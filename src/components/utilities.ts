import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import type FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import type UniqueValueClass from '@arcgis/core/renderers/support/UniqueValueClass';
import type MapView from '@arcgis/core/views/MapView';

export function getWhereClause(
  selectedClasses: number[],
  rendererClasses: UniqueValueClass[],
  fieldName: string,
  isString: boolean,
): string {
  const values = selectedClasses.reduce<(number | string)[]>(
    (previous, classIndex) => {
      const classRenderer = rendererClasses[classIndex];
      const values = classRenderer!.values!.map(
        (value) => value.value as string | number,
      );

      return previous.concat(values);
    },
    [],
  );

  let joinedValues = '';
  if (values.length > 0) {
    if (!isString) {
      joinedValues = values.join(',');
    } else {
      joinedValues = values.map((value) => `'${value}'`).join(',');
    }
  }
  return `${fieldName} IN (${joinedValues})`;
}

export async function setLayerViewFilter(
  layer: FeatureLayer,
  mapView: MapView,
  where: string,
): Promise<void> {
  try {
    const layerView = await mapView.whenLayerView(layer);
    layerView.filter = {
      where,
    } as FeatureFilter;

    console.log(`${layer.title}: ${where}`);
  } catch (error) {
    console.error(`Error setting filter for layer ${layer.title}:`, error);
  }
}
