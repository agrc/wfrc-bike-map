import { BusyBar } from '@ugrc/utah-design-system';
import { useGraphicManager, useViewLoading } from '@ugrc/utilities/hooks';
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
  onFeatureIdentify: (graphic: __esri.Graphic | null) => void;
  trayIsOpen: boolean;
  useMyLocationOnLoad: boolean;
  genericFeedbackPoint: __esri.Graphic | null;
  setGenericFeedbackPoint: (point: __esri.Graphic | null) => void;
  identifyGraphic: __esri.Graphic | null;
};

export const MapContainer = ({
  onFeatureIdentify,
  trayIsOpen,
  useMyLocationOnLoad,
  genericFeedbackPoint,
  setGenericFeedbackPoint,
  identifyGraphic,
}: MapContainerProps) => {
  const mapNode = useRef<HTMLDivElement>(null);
  const feedbackButtonRef = useRef<HTMLDivElement>(null);
  const zoomButtonRef = useRef<HTMLDivElement>(null);

  const { width: windowWidth = 0 } = useWindowSize();
  const isSmallScreen = windowWidth < config.BREAKPOINTS.md;

  const [center, setCenter] = useState<number[] | null>(null);
  const showFeedback = genericFeedbackPoint !== null;

  // Set up the map
  const { mapView, layers, highlightHandle } = useMapSetup(
    mapNode,
    trayIsOpen,
    useMyLocationOnLoad,
    isSmallScreen,
    onFeatureIdentify,
    popupRoot,
    feedbackButtonRef,
    zoomButtonRef,
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
    getCoarseLocation().then((location) => {
      if (location && mapView.current) {
        mapView.current.goTo({
          center: [location.x, location.y],
          zoom: 15,
        });
      }
    });
  };

  return (
    <>
      <div ref={mapNode} className="relative size-full">
        {mapView.current && <BusyBar busy={isDrawing} />}
      </div>
      <div className="esri-component esri-widget" ref={feedbackButtonRef}>
        <calcite-button
          kind="neutral"
          className="esri-widget--button"
          icon-start="pencil"
          label="add feedback"
          onClick={handleFeedbackClick}
        ></calcite-button>
      </div>
      <div className="esri-component esri-widget" ref={zoomButtonRef}>
        <calcite-button
          kind="neutral"
          className="esri-widget--button"
          icon-start="zoom-to-object"
          label="zoom to my location"
          onClick={handleZoomToLocation}
        ></calcite-button>
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
