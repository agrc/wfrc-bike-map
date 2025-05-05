import { Checkbox, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { useFilter } from '../hooks/useFilter';
import type { LayersWithRenderClassesKeys } from '../shared';
import Label from './Label';
import LegendSwatch from './LegendSwatch';

type RendererClassCheckboxProps = {
  rendererClass: __esri.UniqueValueClass;
  classIndex: number;
  layerKey: LayersWithRenderClassesKeys;
};

export default function RendererClassCheckbox({
  rendererClass,
  classIndex,
  layerKey,
}: RendererClassCheckboxProps) {
  const { state, dispatch } = useFilter();

  const logEvent = useFirebaseAnalytics();

  const handleCheckboxChange = () => {
    logEvent('filter_renderer_class', {
      rendererClass: rendererClass.label,
      layerKey,
    });
    dispatch({
      type: 'TOGGLE_RENDERER_CLASS',
      payload: {
        classIndex,
        layerKey,
      },
    });
  };

  return (
    <Checkbox
      key={rendererClass.label}
      value={rendererClass.values!.join(',')}
      onChange={handleCheckboxChange}
      isSelected={state[layerKey].selectedClasses!.includes(classIndex)}
    >
      <LegendSwatch symbol={rendererClass.symbol} />
      <Label>{rendererClass.label}</Label>
    </Checkbox>
  );
}
