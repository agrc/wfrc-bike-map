import type Graphic from '@arcgis/core/Graphic';
import '@arcgis/map-components/components/arcgis-basemap-toggle';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-track';
import { BusyBar } from '@ugrc/utah-design-system/components/Spinner';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import useGraphicManager from '@ugrc/utilities/hooks/useGraphicManager';
import useViewLoading from '@ugrc/utilities/hooks/useViewLoading';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useWindowSize } from 'usehooks-ts';
import config from '../config';
import { useLayerFiltering } from '../hooks/useLayerFiltering';
import { useMapSetup } from '../hooks/useMapSetup';
import { setUrlParameter } from '../utilities/UrlParameters';
import Identify from './Identify';
import { getCoarseLocation, getFeedbackGraphic } from './mapUtils';

const popupRoot = document.createElement('div');

type MapContainerProps = {
  onFeatureIdentify: (graphic: Graphic | null) => void;
  trayIsOpen: boolean;
  useMyLocationOnLoad: boolean;
  genericFeedbackPoint: Graphic | null;
  setGenericFeedbackPoint: (point: Graphic | null) => void;
  identifyGraphic: Graphic | null;
};

export const MapContainer = ({
  onFeatureIdentify,
  trayIsOpen,
  useMyLocationOnLoad,
  genericFeedbackPoint,
  setGenericFeedbackPoint,
  identifyGraphic,
}: MapContainerProps) => {
  const mapNode = useRef<HTMLArcgisMapElement>(null);
  const basemapToggleRef = useRef<HTMLArcgisBasemapToggleElement>(null);

  const { width: windowWidth = 0 } = useWindowSize();
  const isSmallScreen = windowWidth < config.BREAKPOINTS.md;

  const [center, setCenter] = useState<number[] | null>(null);
  const showFeedback = genericFeedbackPoint !== null;

  const logEvent = useFirebaseAnalytics();

  // Set up the map
  const { mapView, layers, highlightHandle } = useMapSetup(
    mapNode,
    trayIsOpen,
    useMyLocationOnLoad,
    isSmallScreen,
    onFeatureIdentify,
    popupRoot,
    basemapToggleRef,
    setCenter,
  );

  // Apply layer filtering based on the current state
  useLayerFiltering(mapView, layers);

  const isDrawing = useViewLoading(mapView.current);

  // Update URL parameters and feedback point when center changes
  useEffect(() => {
    if (center) {
      setUrlParameter('center', center);

      if (showFeedback) {
        const graphic = getFeedbackGraphic(center);
        setGenericFeedbackPoint(graphic);
      }
    } else {
      setGenericFeedbackPoint(null);
    }
  }, [center, showFeedback, setGenericFeedbackPoint]);

  // Display generic feedback point
  const { setGraphic } = useGraphicManager(mapView.current);
  useEffect(() => {
    if (genericFeedbackPoint) {
      setGraphic(genericFeedbackPoint);
    } else {
      setGraphic(null);
    }
  }, [genericFeedbackPoint, setGraphic]);

  // Handle feedback button click
  const handleFeedbackClick = () => {
    logEvent('generic_feedback_button_click');
    if (showFeedback) {
      setGenericFeedbackPoint(null);
    } else {
      setGenericFeedbackPoint(
        getFeedbackGraphic([
          mapView.current!.center.x,
          mapView.current!.center.y,
        ]),
      );

      onFeatureIdentify(null);
      if (highlightHandle.current) {
        highlightHandle.current.remove();
      }
    }
  };

  // Handle zoom to location button click
  const handleZoomToLocation = () => {
    logEvent('zoom_to_location');
    getCoarseLocation().then((location) => {
      if (location && mapView.current) {
        mapView.current.goTo({
          center: [location.x, location.y],
          zoom: 15,
        });
      }
    });
  };

  const changeZoom = (delta: number) => {
    const view = mapView.current;
    if (view) {
      void view.goTo({ zoom: view.zoom + delta });
    }
  };

  return (
    <>
      <div className="relative size-full">
        <arcgis-map ref={mapNode} className="size-full">
          <arcgis-home
            slot="top-right"
            onarcgisGo={() => logEvent('home_button_click')}
          />
          <arcgis-track
            slot="top-right"
            onClick={() => logEvent('track_button_click')}
          />
          {!isSmallScreen && (
            <div slot="top-left" className="map-control-group">
              <button
                type="button"
                className="map-control-button"
                aria-label="Zoom in"
                title="Zoom in"
                onClick={() => changeZoom(1)}
              >
                <Plus aria-hidden="true" size={16} />
              </button>
              <button
                type="button"
                className="map-control-button"
                aria-label="Zoom out"
                title="Zoom out"
                onClick={() => changeZoom(-1)}
              >
                <Minus aria-hidden="true" size={16} />
              </button>
            </div>
          )}
          <arcgis-basemap-toggle ref={basemapToggleRef} slot="top-left" />
          <div
            slot="top-right"
            className="esri-component esri-widget map-control"
          >
            <calcite-button
              kind="neutral"
              className="esri-widget--button"
              icon-start="pencil"
              label="add feedback"
              onClick={handleFeedbackClick}
            ></calcite-button>
          </div>
          <div
            slot="top-right"
            className="esri-component esri-widget map-control"
          >
            <calcite-button
              kind="neutral"
              className="esri-widget--button"
              icon-start="zoom-to-object"
              label="zoom to my location"
              onClick={handleZoomToLocation}
            ></calcite-button>
          </div>
        </arcgis-map>
        {mapView.current && <BusyBar busy={isDrawing} />}
      </div>
      {!isSmallScreen && identifyGraphic
        ? createPortal(
            <Identify
              graphic={identifyGraphic}
              clear={() => {
                onFeatureIdentify(null);
                mapView.current?.closePopup();
                if (highlightHandle.current) {
                  highlightHandle.current.remove();
                }
              }}
            />,
            popupRoot,
          )
        : null}
    </>
  );
};
