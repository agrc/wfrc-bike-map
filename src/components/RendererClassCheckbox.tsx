import { Checkbox } from '@ugrc/utah-design-system';
import { useFilter } from '../context/FilterProvider';

type RendererClassCheckboxProps = {
  rendererClass: __esri.UniqueValueClass;
  classIndex: number;
  layerKey: 'routeTypes' | 'trafficStress';
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
      {rendererClass.label}
    </Checkbox>
  );
}
