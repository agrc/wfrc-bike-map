import { Spinner, Switch } from '@ugrc/utah-design-system';
import config from '../config';
import { useFilter } from '../context/FilterProvider';
import RendererClassCheckbox from './RendererClassCheckbox';

export default function Filter() {
  const { state, dispatch } = useFilter();
  const isRouteTypes = state.selectedFilterType === 'routeTypes';

  if (state.routeTypes.rendererClasses.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="size-12">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Switch
        className="mb-3"
        isSelected={isRouteTypes}
        onChange={() =>
          dispatch({
            type: 'TOGGLE_FILTER_TYPE',
          })
        }
      >
        <h3>
          {isRouteTypes
            ? config.LAYER_NAMES.routeTypes
            : config.LAYER_NAMES.trafficStress}
        </h3>
      </Switch>
      <div className="space-y-1.5">
        {isRouteTypes
          ? state.routeTypes.rendererClasses.map((rendererClass, index) => (
              <RendererClassCheckbox
                key={rendererClass.label}
                classIndex={index}
                layerKey="routeTypes"
                rendererClass={rendererClass}
              />
            ))
          : state.trafficStress.rendererClasses.map((rendererClass, index) => (
              <RendererClassCheckbox
                key={rendererClass.label}
                classIndex={index}
                layerKey="trafficStress"
                rendererClass={rendererClass}
              />
            ))}
      </div>
    </div>
  );
}
