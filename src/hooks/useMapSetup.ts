import { watch } from '@arcgis/core/core/reactiveUtils';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle.js';
import Home from '@arcgis/core/widgets/Home';
import Track from '@arcgis/core/widgets/Track';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system';
import debounce from 'lodash.debounce';
import { useEffect, useRef } from 'react';
import { getCoarseLocation, INITIAL_MAP_ZOOM } from '../components/mapUtils';
import type { LayerNames } from '../context/FirebaseRemoteConfigsProvider';
import { getUrlParameter, setUrlParameter } from '../utilities/UrlParameters';
import { useFilter } from './useFilter';
import useRemoteConfigs from './useRemoteConfigs';

type LayerNameKey = keyof LayerNames;

export function useMapSetup(
  mapNodeRef: React.RefObject<HTMLDivElement | null>,
  trayIsOpen: boolean,
  useMyLocationOnLoad: boolean,
  isSmallScreen: boolean,
  onFeatureIdentify: (graphic: __esri.Graphic | null) => void,
  popupRoot: HTMLDivElement,
  feedbackButtonRef: React.RefObject<HTMLDivElement | null>,
  zoomButtonRef: React.RefObject<HTMLDivElement | null>,
  setCenter: (center: number[]) => void,
) {
  const getConfig = useRemoteConfigs();
  const map = useRef<WebMap | null>(null);
  const mapView = useRef<MapView>(null);
  const layers = useRef<Record<LayerNameKey, __esri.FeatureLayer | null>>({
    routeTypes: null,
    trafficStress: null,
    trafficSignals: null,
    otherLinks: null,
    bikeshareStations: null,
  });
  const mapIsInitialized = useRef<boolean>(false);
  const highlightHandle = useRef<__esri.Handle>(null);
  const { dispatch } = useFilter();

  const logEvent = useFirebaseAnalytics();

  // set up map
  useEffect(() => {
    if (!mapNodeRef.current || mapIsInitialized.current || !getConfig) {
      return;
    }

    const initializeMap = async () => {
      console.log('setting up the map');
      mapIsInitialized.current = true;
      map.current = new WebMap({
        portalItem: {
          id: getConfig('webMapId') as string,
        },
      });

      let center: __esri.PointProperties | number[] = {
        // SLC
        x: -12455376,
        y: 4978678,
        spatialReference: {
          wkid: 102100,
        },
      };

      const xyUrlParam = getUrlParameter('center', 'number[]') as number[];
      const zoomUrlParam = getUrlParameter('zoom', 'number') as number;
      if (xyUrlParam) {
        center = {
          x: xyUrlParam[0],
          y: xyUrlParam[1],
          spatialReference: {
            wkid: 3857,
          },
        };
      } else if (useMyLocationOnLoad) {
        const location = await getCoarseLocation();
        if (location) {
          center = [location.x, location.y];
        }
      }

      const view = new MapView({
        container: mapNodeRef.current,
        center,
        zoom: zoomUrlParam ?? INITIAL_MAP_ZOOM,
        ui: {
          components: isSmallScreen ? [] : ['zoom'],
        },
        map: map.current,
        padding: {
          bottom: trayIsOpen ? 320 : 0,
        },
        popup: {
          actions: [],
          dockEnabled: false,
          dockOptions: {
            breakpoint: false,
            buttonEnabled: false,
          },
          visibleElements: {
            actionBar: false,
            heading: false,
            closeButton: false,
          },
        },
        popupEnabled: false,
      });

      view.on('click', (event) => {
        view.closePopup();
        view.hitTest(event).then((response) => {
          const graphicHits = response.results.filter(
            (result) =>
              result.type === 'graphic' &&
              result.layer?.type === 'feature' &&
              result.layer.id !== layers.current!.trafficSignals!.id,
          );
          if (graphicHits.length > 0) {
            const graphic = (graphicHits[0] as __esri.GraphicHit)!.graphic;

            onFeatureIdentify(graphic);

            if (!isSmallScreen) {
              if (!view.popup?.visible) {
                view.openPopup({
                  location: event.mapPoint,
                  content: popupRoot,
                });
              }
            }

            view
              .whenLayerView(graphic.layer as __esri.FeatureLayer)
              .then((layerView: __esri.FeatureLayerView) => {
                if (highlightHandle.current) {
                  highlightHandle.current.remove();
                }
                highlightHandle.current = layerView.highlight(graphic);
              });
          } else {
            onFeatureIdentify(null);
            if (highlightHandle.current) {
              highlightHandle.current.remove();
            }
          }
        });
      });

      const debounceTime = 200;
      watch(
        () => view.center,
        debounce(() => {
          const x = Math.round(view.center.x);
          const y = Math.round(view.center.y);
          setCenter([x, y]);
        }, debounceTime),
      );

      watch(
        () => view.zoom,
        debounce(() => {
          setUrlParameter('zoom', view.zoom);
        }, debounceTime),
      );

      await view.when();

      const homeWidget = new Home({ view });
      homeWidget.on('go', () => logEvent('home_button_click'));
      const trackWidget = new Track({ view });
      trackWidget.on('track', () => logEvent('track_button_click'));
      view.ui.add(homeWidget, 'top-right');
      view.ui.add(trackWidget, 'top-right');
      view.ui.add(zoomButtonRef.current!, 'top-right');
      view.ui.add(feedbackButtonRef.current!, 'top-right');
      view.ui.add(
        new BasemapToggle({
          view,
          nextBasemap: {
            portalItem: {
              id: getConfig('hybridId') as string,
            },
          },
        }),
        'top-left',
      );

      const layerNames = getConfig('layerNames') as LayerNames;
      for (const layerName of Object.keys(layers.current) as LayerNameKey[]) {
        const layer = view.map.layers.find(
          (layer) => layer.title === layerNames[layerName],
        ) as __esri.FeatureLayer;
        if (!layer) {
          throw new Error(`Could not find layer: ${layerName}`);
        }
        layer.popupEnabled = false;
        layers.current[layerName] = layer;
      }

      // wait for all of the layers to fully load
      await Promise.all(
        Object.values(layers.current).map((layer) => layer!.when()),
      );

      dispatch({
        type: 'MAP_LOADED',
        payload: {
          routeTypes:
            (layers.current.routeTypes!.renderer as __esri.UniqueValueRenderer)
              .uniqueValueGroups?.[0]?.classes ?? [],
          trafficStress:
            (
              layers.current.trafficStress!
                .renderer as __esri.UniqueValueRenderer
            ).uniqueValueGroups?.[0]?.classes ?? [],
          trafficSignals:
            (
              layers.current.trafficSignals!
                .renderer as __esri.UniqueValueRenderer
            ).uniqueValueGroups?.[0]?.classes ?? [],
          symbols: {
            otherLinks: (
              layers.current.otherLinks!.renderer as __esri.SimpleRenderer
            ).symbol!,
            bikeshareStations: (
              layers.current.bikeshareStations!
                .renderer as __esri.SimpleRenderer
            ).symbol!,
          },
        },
      });

      mapView.current = view;
    };

    initializeMap();
  }, [
    getConfig,
    mapNodeRef,
    trayIsOpen,
    useMyLocationOnLoad,
    isSmallScreen,
    onFeatureIdentify,
    popupRoot,
    zoomButtonRef,
    feedbackButtonRef,
    dispatch,
    setCenter,
    logEvent,
  ]);

  // update map padding when tray is open
  useEffect(() => {
    if (mapView.current) {
      mapView.current.padding.bottom = trayIsOpen ? 320 : 0;
    }
  }, [trayIsOpen]);

  // zoom map if use my location is toggled
  useEffect(() => {
    if (useMyLocationOnLoad && mapView.current) {
      getCoarseLocation().then((location) => {
        if (location) {
          mapView.current!.goTo([location.x, location.y]);
        }
      });
    }
  }, [useMyLocationOnLoad]);

  return {
    mapView,
    layers,
    highlightHandle,
  };
}
