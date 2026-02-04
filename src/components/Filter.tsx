import {
  Checkbox,
  Spinner,
  ToggleButton,
  ToggleButtonGroup,
  useFirebaseAnalytics,
} from '@ugrc/utah-design-system';
import type { Key } from 'react-aria';
import type { ClassOrders } from '../context/FirebaseRemoteConfigsProvider';
import { useFilter } from '../hooks/useFilter';
import useRemoteConfigs from '../hooks/useRemoteConfigs';
import type { LayersWithRenderClassesKeys } from '../shared';
import Label from './Label';
import LegendSwatch from './LegendSwatch';
import RendererClassCheckbox from './RendererClassCheckbox';

const toggleButtonClasses =
  'data-[selected]:bg-blue-600 data-[selected]:dark:bg-blue-600 data-[selected]:dark:text-zinc-100 data-[selected]:hover:bg-blue-700 data-[selected]:pressed:bg-blue-700 data-[selected]:dark:hover:bg-blue-700 data-[selected]:dark:pressed:bg-blue-800 data-[selected]:font-extrabold bg-zinc-300 dark:hover:bg-zinc-700 dark:pressed:bg-zinc-800';

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
    <div id="main-content" className="p-4">
      <h1 className="sr-only">Filter Options</h1>
      <ToggleButtonGroup
        selectionMode="single"
        selectedKeys={[state.selectedFilterType as Key]}
        onSelectionChange={() => {
          logEvent('toggle_filter_type');
          dispatch({
            type: 'TOGGLE_FILTER_TYPE',
          });
        }}
        aria-label="Filter Type"
        className="mb-3 justify-center"
      >
        {state.selectedFilterType === 'routeTypes' ? (
          <>
            <ToggleButton id="routeTypes" className={toggleButtonClasses}>
              {layerNames.routeTypes}
            </ToggleButton>
            <ToggleButton id="trafficStress" className={toggleButtonClasses}>
              {layerNames.trafficStress}
            </ToggleButton>
          </>
        ) : (
          <>
            <ToggleButton id="trafficStress" className={toggleButtonClasses}>
              {layerNames.trafficStress}
            </ToggleButton>
            <ToggleButton id="routeTypes" className={toggleButtonClasses}>
              {layerNames.routeTypes}
            </ToggleButton>
          </>
        )}
      </ToggleButtonGroup>
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
              id="otherLinks-route-types"
            >
              <LegendSwatch symbol={state.symbols.otherLinks} />
              <Label htmlFor="otherLinks-route-types">Other Links</Label>
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
              id="bikeshareStations-route-types"
            >
              <LegendSwatch symbol={state.symbols.bikeshareStations} />
              <Label htmlFor="bikeshareStations-route-types">
                Bikeshare Stations
              </Label>
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
              id="otherLinks-traffic-stress"
            >
              <LegendSwatch symbol={state.symbols.otherLinks} />
              <Label htmlFor="otherLinks-traffic-stress">Other Links</Label>
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
              id="bikeshareStations-traffic-stress"
            >
              <LegendSwatch symbol={state.symbols.bikeshareStations} />
              <Label htmlFor="bikeshareStations-traffic-stress">
                Bikeshare Stations
              </Label>
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
