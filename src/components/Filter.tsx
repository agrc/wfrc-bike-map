import { Checkbox, Spinner, Switch } from '@ugrc/utah-design-system';
import type { ClassOrders } from '../context/FirebaseRemoteConfigsProvider';
import { useFilter } from '../hooks/useFilter';
import useRemoteConfigs from '../hooks/useRemoteConfigs';
import type { LayersWithRenderClassesKeys } from '../shared';
import Label from './Label';
import LegendSwatch from './LegendSwatch';
import RendererClassCheckbox from './RendererClassCheckbox';

export default function Filter() {
  const { state, dispatch } = useFilter();
  const isRouteTypes = state.selectedFilterType === 'routeTypes';
  const getConfig = useRemoteConfigs();

  if (state.routeTypes.rendererClasses.length === 0 || !getConfig) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="size-12">
          <Spinner />
        </div>
      </div>
    );
  }

  const layerNames = getConfig('layerNames') as Record<string, string>;

  const getRendererClassCheckboxes = (
    layerKey: LayersWithRenderClassesKeys,
  ) => {
    const rendererClasses = state[layerKey].rendererClasses;
    const classOrder = getConfig('classOrder') as ClassOrders;
    const indexesInOrder =
      classOrder[layerKey] ?? Object.keys(rendererClasses).map(Number);
    return indexesInOrder.map((classIndex) => {
      const rendererClass = rendererClasses[classIndex];
      if (!rendererClass) {
        throw new Error(
          `Invalid renderer class index: ${classIndex} for ${layerKey}`,
        );
      }

      return (
        <RendererClassCheckbox
          key={rendererClass.label}
          classIndex={classIndex}
          layerKey={layerKey}
          rendererClass={rendererClass}
        />
      );
    });
  };

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
        <h2>
          {isRouteTypes ? layerNames.routeTypes : layerNames.trafficStress}
        </h2>
      </Switch>
      <div className="space-y-1.5">
        {isRouteTypes ? (
          <>
            {getRendererClassCheckboxes('routeTypes')}
            <Checkbox
              isSelected={state.layerToggles.otherLinks}
              onChange={() =>
                dispatch({
                  type: 'TOGGLE_LAYER',
                  payload: { layerKey: 'otherLinks' },
                })
              }
            >
              <LegendSwatch symbol={state.symbols.otherLinks} />
              <Label>Other Links</Label>
            </Checkbox>
          </>
        ) : (
          <>
            {getRendererClassCheckboxes('trafficStress')}
            {getRendererClassCheckboxes('trafficSignals')}
          </>
        )}
      </div>
    </div>
  );
}
