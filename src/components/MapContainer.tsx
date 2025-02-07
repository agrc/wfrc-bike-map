import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import Home from '@arcgis/core/widgets/Home';
import Track from '@arcgis/core/widgets/Track';
import { useEffect, useRef } from 'react';
import { useDarkMode, useWindowSize } from 'usehooks-ts';
import config from '../config';

export const MapContainer = ({
  onClick,
}: {
  onClick?: __esri.ViewImmediateClickEventHandler;
}) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const map = useRef<WebMap | null>(null);
  const mapView = useRef<MapView>(null);
  const clickHandler = useRef<IHandle>(null);

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

  // setup the Map
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
        type: 'point',
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

    mapView.current.when(() => {
      const homeWidget = new Home({ view: mapView.current! });
      const trackWidget = new Track({ view: mapView.current! });
      mapView.current!.ui.add(homeWidget, 'top-right');
      mapView.current!.ui.add(trackWidget, 'top-right');
    });

    return () => {
      mapView.current?.destroy();
      map.current?.destroy();
    };
  }, []);

  // add click event handlers
  useEffect(() => {
    if (onClick) {
      clickHandler.current = mapView.current!.on('immediate-click', onClick);
    }

    return () => {
      clickHandler.current?.remove();
    };
  }, [onClick, mapView]);

  return <div ref={mapNode} className="size-full"></div>;
};
