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

type MapContainerProps = {
  onFeatureIdentify: (graphic: __esri.Graphic) => void;
  trayIsOpen: boolean;
};

export const MapContainer = ({
  onFeatureIdentify,
  trayIsOpen,
}: MapContainerProps) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const map = useRef<WebMap | null>(null);
  const mapView = useRef<MapView>(null);
  const clickHandler = useRef<IHandle>(null);
  const layers = useRef<
    Record<keyof typeof config.LAYER_NAMES, __esri.FeatureLayer | null>
  >({
    routeTypes: null,
    trafficStress: null,
    trafficSignals: null,
    otherLinks: null,
  });

  const isDrawing = useViewLoading(mapView.current);

  const { isDarkMode } = useDarkMode();
  const { width = 0 } = useWindowSize();
  const hideZoom = width < config.BREAKPOINTS.md;

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

  useEffect(() => {
    if (!mapNode.current) {
      return;
    }

    console.log('setting up the map');
    map.current = new WebMap({
      portalItem: {
        id: config.WEB_MAP_ID,
      },
    });

    mapView.current = new MapView({
      container: mapNode.current,
      center: {
        // center of SL Valley
        x: -12460335.508799179,
        y: 4959043.257530195,
        spatialReference: {
          wkid: 102100,
        },
      },
      zoom: 9,
      ui: {
        components: hideZoom ? [] : ['zoom'],
      },
      map: map.current,
    });

    mapView.current.when(async () => {
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
    });

    return () => {
      mapView.current?.destroy();
      map.current?.destroy();
    };
  }, []);

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

  const highlightHandle = useRef<__esri.Handle>(null);
  useEffect(() => {
    if (mapView.current) {
      clickHandler.current = mapView.current!.on('immediate-click', (event) => {
        mapView.current!.hitTest(event).then((response) => {
          const graphicHits = response.results.filter(
            (result) =>
              result.type === 'graphic' && result.layer?.type === 'feature',
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
          }
        });
      });
    }

    return () => {
      clickHandler.current?.remove();
    };
  }, [onFeatureIdentify, mapView]);

  useEffect(() => {
    if (mapView.current) {
      mapView.current.padding.bottom = trayIsOpen ? 320 : 0;
    }
  }, [trayIsOpen]);

  return (
    <div ref={mapNode} className="relative size-full">
      {mapView.current && <BusyBar busy={isDrawing} />}
    </div>
  );
};
