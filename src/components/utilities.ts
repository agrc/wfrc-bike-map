export function getWhereClause(
  selectedClasses: number[],
  rendererClasses: __esri.UniqueValueClass[],
  fieldName: string,
  isString: boolean,
): string {
  const values = selectedClasses.reduce<(number | string)[]>(
    (previous, classIndex) => {
      const classRenderer = rendererClasses[classIndex];
      const values = classRenderer!.values.map((value) => value.value);

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
  layer: __esri.FeatureLayer,
  mapView: __esri.MapView,
  where: string,
): Promise<void> {
  try {
    const layerView = await mapView.whenLayerView(layer);
    layerView.filter = {
      where,
    } as __esri.FeatureFilter;

    console.log(`${layer.title}: ${where}`);
  } catch (error) {
    console.error(`Error setting filter for layer ${layer.title}:`, error);
  }
}
