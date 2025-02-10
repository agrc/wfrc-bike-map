import { Checkbox } from '@ugrc/utah-design-system';
import { useFilter } from '../hooks/useFilter';
import type { LayersWithRenderClassesKeys } from '../shared';
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

  const handleCheckboxChange = () => {
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
      value={rendererClass.values.join(',')}
      onChange={handleCheckboxChange}
      isSelected={state[layerKey].selectedClasses.includes(classIndex)}
    >
      <LegendSwatch symbol={rendererClass.symbol} />
      {rendererClass.label}
    </Checkbox>
  );
}
