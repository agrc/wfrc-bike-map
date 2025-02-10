import { renderPreviewHTML } from '@arcgis/core/symbols/support/symbolUtils';
import { Checkbox } from '@ugrc/utah-design-system';
import { useEffect, useRef } from 'react';
import { useFilter } from '../hooks/useFilter';

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
  const symbolRef = useRef<HTMLDivElement>(null);
  const symbolHasBeenRendered = useRef(false);

  const handleCheckboxChange = () => {
    dispatch({
      type: 'TOGGLE_RENDERER_CLASS',
      payload: {
        classIndex,
        layerKey,
      },
    });
  };

  useEffect(() => {
    if (symbolRef.current && !symbolHasBeenRendered.current) {
      renderPreviewHTML(rendererClass.symbol, {
        node: symbolRef.current,
        size: {
          height: 6,
          width: 30,
        },
      });
      symbolHasBeenRendered.current = true;
    }
  }, [rendererClass]);

  return (
    <Checkbox
      key={rendererClass.label}
      value={rendererClass.values.join(',')}
      onChange={handleCheckboxChange}
      isSelected={state[layerKey].selectedClasses.includes(classIndex)}
    >
      <div ref={symbolRef} />
      {rendererClass.label}
    </Checkbox>
  );
}
