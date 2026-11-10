import Basemap from '@arcgis/core/Basemap';
import { watch } from '@arcgis/core/core/reactiveUtils';
import Point from '@arcgis/core/geometry/Point';
import type Graphic from '@arcgis/core/Graphic';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import type SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import type UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import type FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import type MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Popup from '@arcgis/core/widgets/Popup';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import debounce from 'lodash.debounce';
import { useEffect, useRef } from 'react';
import { getCoarseLocation, INITIAL_MAP_ZOOM } from '../components/mapUtils';
import type { LayerNames } from '../context/FirebaseRemoteConfigsProvider';
import { getUrlParameter, setUrlParameter } from '../utilities/UrlParameters';
import { useFilter } from './useFilter';
import useRemoteConfigs from './useRemoteConfigs';

type LayerNameKey = keyof LayerNames;

const HYBRID_BASEMAP_PARAM = 'hybrid';
const LITE_BASEMAP_PARAM = 'lite';

export function useMapSetup(
  mapNodeRef: React.RefObject<HTMLArcgisMapElement | null>,
  trayIsOpen: boolean,
  useMyLocationOnLoad: boolean,
  isSmallScreen: boolean,
  onFeatureIdentify: (graphic: Graphic | null) => void,
  popupRoot: HTMLDivElement,
  basemapToggleRef: React.RefObject<HTMLArcgisBasemapToggleElement | null>,
  setCenter: (center: number[]) => void,
) {
  const getConfig = useRemoteConfigs();
  const map = useRef<WebMap | null>(null);
  const mapView = useRef<MapView>(null);
  const layers = useRef<Record<LayerNameKey, FeatureLayer | null>>({
    routeTypes: null,
    trafficStress: null,
    trafficSignals: null,
    otherLinks: null,
    bikeshareStations: null,
    udotAlrs: null,
  });
  const mapIsInitialized = useRef<boolean>(false);
  const highlightHandle = useRef<ReturnType<
    FeatureLayerView['highlight']
  > | null>(null);
  const { dispatch } = useFilter();

  const logEvent = useFirebaseAnalytics();

  // set up map
  useEffect(() => {
    if (
      !mapNodeRef.current ||
      !basemapToggleRef.current ||
      mapIsInitialized.current ||
      !getConfig
    ) {
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

      let center: Point | [number, number] = new Point({
        // SLC
        x: -12455376,
        y: 4978678,
        spatialReference: {
          wkid: 102100,
        },
      });

      const xyUrlParam = getUrlParameter('center', 'number[]') as number[];
      const zoomUrlParam = getUrlParameter('zoom', 'number') as number;
      if (xyUrlParam) {
        center = new Point({
          x: xyUrlParam[0],
          y: xyUrlParam[1],
          spatialReference: {
            wkid: 3857,
          },
        });
      } else if (useMyLocationOnLoad) {
        const location = await getCoarseLocation();
        if (location) {
          center = [location.x, location.y];
        }
      }

      const mapElement = mapNodeRef.current!;
      const basemapToggle = basemapToggleRef.current!;
      const hybridBasemap = new Basemap({
        id: HYBRID_BASEMAP_PARAM,
        portalItem: {
          id: getConfig('hybridId') as string,
        },
      });
      const basemapToggleReady = new Promise<void>((resolve) => {
        if (basemapToggle.state !== 'disabled') {
          resolve();
        } else {
          basemapToggle.addEventListener('arcgisReady', () => resolve(), {
            once: true,
          });
        }
      });

      mapElement.center = center;
      mapElement.zoom = zoomUrlParam ?? INITIAL_MAP_ZOOM;
      mapElement.padding = {
        bottom: trayIsOpen ? 320 : 0,
        left: 0,
        right: 0,
        top: 0,
      };
      basemapToggle.nextBasemap = hybridBasemap;
      mapElement.map = map.current;

      await Promise.all([mapElement.viewOnReady(), basemapToggleReady]);

      const view = mapElement.view;
      view.popup = new Popup({
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
      });
      view.popupEnabled = false;

      view.on('click', (event) => {
        view.closePopup();
        const popupDisabledLayersIds = [
          layers.current.trafficSignals!.id,
          layers.current.bikeshareStations!.id,
          layers.current.udotAlrs!.id,
        ];
        view.hitTest(event).then((response) => {
          const graphicHits = response.results.filter(
            (result) =>
              result.type === 'graphic' &&
              result.layer?.type === 'feature' &&
              !popupDisabledLayersIds.includes(result.layer.id),
          );
          if (graphicHits.length > 0) {
            const graphic = (graphicHits[0] as { graphic: Graphic }).graphic;

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
              .whenLayerView(graphic.layer as FeatureLayer)
              .then((layerView: FeatureLayerView) => {
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

      watch(
        () => basemapToggle.activeBasemap?.id,
        (id) => {
          if (!id) {
            return;
          }

          setUrlParameter(
            'basemap',
            id === HYBRID_BASEMAP_PARAM ? id : LITE_BASEMAP_PARAM,
          );

          logEvent('basemap_toggle', { basemap: id });
        },
      );

      const initialId = getUrlParameter('basemap', 'string');
      if (initialId && initialId === hybridBasemap.id) {
        void basemapToggle.toggle();
      }

      const layerNames = getConfig('layerNames') as LayerNames;
      for (const layerName of Object.keys(layers.current) as LayerNameKey[]) {
        const layer = view.map!.layers.find(
          (layer) => layer.title === layerNames[layerName],
        ) as FeatureLayer;
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
            (layers.current.routeTypes!.renderer as UniqueValueRenderer)
              .uniqueValueGroups?.[0]?.classes ?? [],
          trafficStress:
            (layers.current.trafficStress!.renderer as UniqueValueRenderer)
              .uniqueValueGroups?.[0]?.classes ?? [],
          trafficSignals:
            (layers.current.trafficSignals!.renderer as UniqueValueRenderer)
              .uniqueValueGroups?.[0]?.classes ?? [],
          symbols: {
            otherLinks: (layers.current.otherLinks!.renderer as SimpleRenderer)
              .symbol!,
            bikeshareStations: (
              layers.current.bikeshareStations!.renderer as SimpleRenderer
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
    basemapToggleRef,
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
