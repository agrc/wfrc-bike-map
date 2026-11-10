import type UniqueValueClass from '@arcgis/core/renderers/support/UniqueValueClass';
import { Checkbox } from '@ugrc/utah-design-system/components/Checkbox';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import { useId } from 'react';
import { useFilter } from '../hooks/useFilter';
import type { LayersWithRenderClassesKeys } from '../shared';
import Label from './Label';
import LegendSwatch from './LegendSwatch';

type RendererClassCheckboxProps = {
  rendererClass: UniqueValueClass;
  classIndex: number;
  layerKey: LayersWithRenderClassesKeys;
};

export default function RendererClassCheckbox({
  rendererClass,
  classIndex,
  layerKey,
}: RendererClassCheckboxProps) {
  const { state, dispatch } = useFilter();
  const id = useId();

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
      id={id}
    >
      <LegendSwatch symbol={rendererClass.symbol} />
      <Label htmlFor={id}>{rendererClass.label}</Label>
    </Checkbox>
  );
}
