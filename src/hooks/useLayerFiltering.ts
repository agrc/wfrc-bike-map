import { useEffect, type RefObject } from 'react';
import { getWhereClause, setLayerViewFilter } from '../components/utilities';
import type { FieldNames } from '../context/FirebaseRemoteConfigsProvider';
import { useFilter } from './useFilter';
import useRemoteConfigs from './useRemoteConfigs';

export function useLayerFiltering(
  mapView: RefObject<__esri.MapView | null>,
  layers: RefObject<Record<string, __esri.FeatureLayer | null>>,
) {
  const { state } = useFilter();
  const getConfig = useRemoteConfigs();

  useEffect(() => {
    if (
      !mapView.current ||
      !layers.current.routeTypes ||
      !layers.current.trafficStress ||
      !layers.current.trafficSignals ||
      !layers.current.otherLinks ||
      !layers.current.bikeshareStations ||
      !getConfig
    ) {
      return;
    }

    const fieldNames = getConfig('fieldNames') as FieldNames;
    layers.current.bikeshareStations.visible =
      state.layerToggles.bikeshareStations;
    if (state.selectedFilterType === 'routeTypes') {
      const where = getWhereClause(
        state.routeTypes.selectedClasses!,
        state.routeTypes.rendererClasses,
        fieldNames.facility1,
        layers.current.routeTypes.fields.find(
          (layer) => layer.name === fieldNames.facility1,
        )?.type === 'string',
      );
      setLayerViewFilter(layers.current.routeTypes, mapView.current, where);

      layers.current.routeTypes.visible = true;
      layers.current.otherLinks.visible = state.layerToggles.otherLinks;
      layers.current.trafficStress.visible = false;
      layers.current.trafficSignals.visible = false;
    } else if (state.selectedFilterType === 'trafficStress') {
      const where = getWhereClause(
        state.trafficStress.selectedClasses!,
        state.trafficStress.rendererClasses,
        fieldNames.ltsScore,
        layers.current.routeTypes.fields.find(
          (layer) => layer.name === fieldNames.ltsScore,
        )?.type === 'string',
      );
      setLayerViewFilter(layers.current.trafficStress, mapView.current, where);

      const signalsWhere = getWhereClause(
        state.trafficSignals.selectedClasses!,
        state.trafficSignals.rendererClasses,
        fieldNames.type,
        layers.current.trafficSignals.fields.find(
          (layer) => layer.name === fieldNames.type,
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
  }, [state, mapView, layers, getConfig]);
}
