import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Home from '@arcgis/core/widgets/Home';
import Track from '@arcgis/core/widgets/Track';
import { BusyBar } from '@ugrc/utah-design-system';
import { useViewLoading } from '@ugrc/utilities/hooks';
import { useEffect, useRef } from 'react';
import { useDarkMode, useWindowSize } from 'usehooks-ts';
import config from '../config';
import { useFilter } from '../hooks/useFilter';
import { getWhereClause, setLayerViewFilter } from './utilities';

async function getCoarseLocation() {
  return new Promise<{ x: number; y: number } | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ x: position.coords.longitude, y: position.coords.latitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 1000 * 60 * 10, // 10 minutes
      },
    );
  });
}

type MapContainerProps = {
  onFeatureIdentify: (graphic: __esri.Graphic | null) => void;
  trayIsOpen: boolean;
  useMyLocationOnLoad: boolean;
};

const PADDING = 320;
const INITIAL_MAP_ZOOM = 14;

export const MapContainer = ({
  onFeatureIdentify,
  trayIsOpen,
  useMyLocationOnLoad,
}: MapContainerProps) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const map = useRef<WebMap | null>(null);
  const mapView = useRef<MapView>(null);
  const layers = useRef<
    Record<keyof typeof config.LAYER_NAMES, __esri.FeatureLayer | null>
  >({
    routeTypes: null,
    trafficStress: null,
    trafficSignals: null,
    otherLinks: null,
  });
  const mapIsInitialized = useRef<boolean>(false);

  const isDrawing = useViewLoading(mapView.current);

  const { isDarkMode } = useDarkMode();
  const { width = 0 } = useWindowSize();
  const hideZoom = width < config.BREAKPOINTS.md;

  // toggle dark/light modes
  useEffect(() => {
    const darkLink = document.getElementById(
      'arcgis-dark-theme',
    ) as HTMLLinkElement;
    const lightLink = document.getElementById(
      'arcgis-light-theme',
    ) as HTMLLinkElement;

    if (!darkLink || !lightLink) {
      throw new Error('Could not find dark or light theme link elements');
    }

    darkLink.disabled = !isDarkMode;
    lightLink.disabled = isDarkMode;
  }, [isDarkMode]);

  const { state, dispatch } = useFilter();

  // set up map
  // update identify highlighting
  const highlightHandle = useRef<__esri.Handle>(null);
  useEffect(() => {
    if (!mapNode.current || mapIsInitialized.current) {
      return;
    }

    let clickHandler: __esri.Handle | null = null;

    const giddyUp = async () => {
      console.log('setting up the map');
      mapIsInitialized.current = true;
      map.current = new WebMap({
        portalItem: {
          id: config.WEB_MAP_ID,
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
      if (useMyLocationOnLoad) {
        const location = await getCoarseLocation();
        if (location) {
          center = [location.x, location.y];
        }
      }

      mapView.current = new MapView({
        container: mapNode.current,
        center,
        zoom: INITIAL_MAP_ZOOM,
        ui: {
          components: hideZoom ? [] : ['zoom'],
        },
        map: map.current,
        padding: {
          bottom: trayIsOpen ? PADDING : 0,
        },
      });

      clickHandler = mapView.current!.on('immediate-click', (event) => {
        mapView.current!.hitTest(event).then((response) => {
          const graphicHits = response.results.filter(
            (result) =>
              result.type === 'graphic' &&
              result.layer?.type === 'feature' &&
              result.layer.id !== layers.current!.trafficSignals!.id,
          );
          if (graphicHits.length > 0) {
            const graphic = (graphicHits[0] as __esri.GraphicHit)!.graphic;
            onFeatureIdentify(graphic);

            mapView
              .current!.whenLayerView(graphic.layer as __esri.FeatureLayer)
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

      await mapView.current.when();

      const homeWidget = new Home({ view: mapView.current! });
      const trackWidget = new Track({ view: mapView.current! });
      mapView.current!.ui.add(homeWidget, 'top-right');
      mapView.current!.ui.add(trackWidget, 'top-right');

      for (const layerName of Object.keys(layers.current)) {
        const layer = mapView.current!.map.layers.find(
          (layer) =>
            layer.title ===
            config.LAYER_NAMES[layerName as keyof typeof config.LAYER_NAMES],
        ) as __esri.FeatureLayer;
        layer.popupEnabled = false;
        layers.current[layerName as keyof typeof config.LAYER_NAMES] = layer;

        if (!layers.current[layerName as keyof typeof config.LAYER_NAMES]) {
          throw new Error(`Could not find layer: ${layerName}`);
        }
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
          },
        },
      });
    };
    giddyUp();

    return () => {
      clickHandler?.remove();
    };
  }, []);

  // update layer visibility and filters
  useEffect(() => {
    if (
      !mapView.current ||
      !layers.current.routeTypes ||
      !layers.current.trafficStress ||
      !layers.current.trafficSignals ||
      !layers.current.otherLinks
    ) {
      return;
    }

    if (state.selectedFilterType === 'routeTypes') {
      const where = getWhereClause(
        state.routeTypes.selectedClasses,
        state.routeTypes.rendererClasses,
        config.FIELDS.routeTypes.Facility1,
        layers.current.routeTypes.fields.find(
          (layer) => layer.name === config.FIELDS.routeTypes.Facility1,
        )?.type === 'string',
      );
      setLayerViewFilter(layers.current.routeTypes, mapView.current, where);

      layers.current.routeTypes.visible = true;
      layers.current.otherLinks.visible = state.layerToggles.otherLinks;
      layers.current.trafficStress.visible = false;
      layers.current.trafficSignals.visible = false;
    } else if (state.selectedFilterType === 'trafficStress') {
      const where = getWhereClause(
        state.trafficStress.selectedClasses,
        state.trafficStress.rendererClasses,
        config.FIELDS.routeTypes.LTS_SCORE,
        layers.current.routeTypes.fields.find(
          (layer) => layer.name === config.FIELDS.routeTypes.LTS_SCORE,
        )?.type === 'string',
      );
      setLayerViewFilter(layers.current.trafficStress, mapView.current, where);

      const signalsWhere = getWhereClause(
        state.trafficSignals.selectedClasses,
        state.trafficSignals.rendererClasses,
        config.FIELDS.trafficSignals.Type,
        layers.current.trafficSignals.fields.find(
          (layer) => layer.name === config.FIELDS.trafficSignals.Type,
        )?.type === 'string',
      );
      setLayerViewFilter(
        layers.current.trafficSignals,
        mapView.current,
        signalsWhere,
      );

      layers.current.trafficStress.visible = true;
      layers.current.trafficSignals.visible = true;
      layers.current.routeTypes.visible = false;
      layers.current.otherLinks.visible = false;
    }
  }, [state]);

  useEffect(() => {
    if (mapView.current) {
      mapView.current.padding.bottom = trayIsOpen ? PADDING : 0;
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

  return (
    <div ref={mapNode} className="relative size-full">
      {mapView.current && <BusyBar busy={isDrawing} />}
    </div>
  );
};
