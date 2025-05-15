import {
  Checkbox,
  Spinner,
  Switch,
  useFirebaseAnalytics,
} from '@ugrc/utah-design-system';
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

  const logEvent = useFirebaseAnalytics();

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
        onChange={() => {
          logEvent('toggle_filter_type');
          dispatch({
            type: 'TOGGLE_FILTER_TYPE',
          });
        }}
      >
        <h2>
          {isRouteTypes ? layerNames.routeTypes : layerNames.trafficStress}
        </h2>
      </Switch>
      <div className="grid grid-cols-1 gap-y-1.5 md:grid-cols-2 md:gap-4">
        {isRouteTypes ? (
          <>
            {getRendererClassCheckboxes('routeTypes')}
            <Checkbox
              key="otherLinks-route-types"
              isSelected={state.layerToggles.otherLinks}
              onChange={() => {
                logEvent('toggle_other_links');
                dispatch({
                  type: 'TOGGLE_LAYER',
                  payload: { layerKey: 'otherLinks' },
                });
              }}
            >
              <LegendSwatch symbol={state.symbols.otherLinks} />
              <Label>Other Links</Label>
            </Checkbox>
            <Checkbox
              key="bikeshareStations-route-types"
              isSelected={state.layerToggles.bikeshareStations}
              onChange={() => {
                logEvent('toggle_bikeshare_stations');
                dispatch({
                  type: 'TOGGLE_LAYER',
                  payload: { layerKey: 'bikeshareStations' },
                });
              }}
            >
              <LegendSwatch symbol={state.symbols.bikeshareStations} />
              <Label>Bikeshare Stations</Label>
            </Checkbox>
          </>
        ) : (
          <>
            {getRendererClassCheckboxes('trafficStress')}
            <Checkbox
              key="otherLinks-traffic-stress"
              isSelected={state.layerToggles.otherLinks}
              onChange={() => {
                logEvent('toggle_other_links');
                dispatch({
                  type: 'TOGGLE_LAYER',
                  payload: { layerKey: 'otherLinks' },
                });
              }}
            >
              <LegendSwatch symbol={state.symbols.otherLinks} />
              <Label>Other Links</Label>
            </Checkbox>
            <Checkbox
              key="bikeshareStations-traffic-stress"
              isSelected={state.layerToggles.bikeshareStations}
              onChange={() => {
                logEvent('toggle_bikeshare_stations');
                dispatch({
                  type: 'TOGGLE_LAYER',
                  payload: { layerKey: 'bikeshareStations' },
                });
              }}
            >
              <LegendSwatch symbol={state.symbols.bikeshareStations} />
              <Label>Bikeshare Stations</Label>
            </Checkbox>
            <div className="space-y-1.5 md:col-span-full md:grid md:grid-cols-2 md:gap-4">
              {getRendererClassCheckboxes('trafficSignals')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
