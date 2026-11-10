import type UniqueValueClass from '@arcgis/core/renderers/support/UniqueValueClass';
import type { SymbolUnion } from '@arcgis/core/symbols/types';
import { castDraft, type Draft } from 'immer';
import { createContext, type Dispatch, type ReactNode } from 'react';
import { useImmerReducer } from 'use-immer';
import type { LayersWithRenderClassesKeys } from '../shared';
import { getUrlParameter, setUrlParameter } from '../utilities/UrlParameters';
import type { LayerNames } from './FirebaseRemoteConfigsProvider';

type FilterState = {
  selectedFilterType: Omit<LayersWithRenderClassesKeys, 'trafficSignals'>;
  symbols: {
    otherLinks: SymbolUnion | null | undefined;
    bikeshareStations: SymbolUnion | null | undefined;
  };
  routeTypes: {
    rendererClasses: UniqueValueClass[];
    selectedClasses: number[] | null;
  };
  trafficStress: {
    rendererClasses: UniqueValueClass[];
    selectedClasses: number[] | null;
  };
  trafficSignals: {
    rendererClasses: UniqueValueClass[];
    selectedClasses: number[] | null;
  };
  layerToggles: {
    otherLinks: boolean;
    bikeshareStations: boolean;
  };
};

type Action =
  | {
      type: 'MAP_LOADED';
      payload: {
        routeTypes: UniqueValueClass[];
        trafficStress: UniqueValueClass[];
        trafficSignals: UniqueValueClass[];
        symbols: {
          otherLinks: SymbolUnion;
          bikeshareStations: SymbolUnion;
        };
      };
    }
  | {
      type: 'TOGGLE_RENDERER_CLASS';
      payload: {
        classIndex: number;
        layerKey: LayersWithRenderClassesKeys;
      };
    }
  | {
      type: 'TOGGLE_FILTER_TYPE';
    }
  | {
      type: 'TOGGLE_LAYER';
      payload: {
        layerKey: keyof Pick<LayerNames, 'otherLinks' | 'bikeshareStations'>;
      };
    };

const initialState: FilterState = {
  selectedFilterType:
    (getUrlParameter('filterType', 'string') as string) ?? 'routeTypes',
  symbols: {
    otherLinks: null,
    bikeshareStations: null,
  },
  routeTypes: {
    rendererClasses: [],
    selectedClasses:
      (getUrlParameter('routeTypes', 'number[]') as number[]) ?? null,
  },
  trafficStress: {
    rendererClasses: [],
    selectedClasses:
      (getUrlParameter('trafficStress', 'number[]') as number[]) ?? null,
  },
  trafficSignals: {
    rendererClasses: [],
    selectedClasses:
      (getUrlParameter('trafficSignals', 'number[]') as number[]) ?? null,
  },
  layerToggles: {
    otherLinks:
      (getUrlParameter('otherLinks', 'boolean', true) as boolean) ?? true,
    bikeshareStations:
      (getUrlParameter('bikeshareStations', 'boolean', true) as boolean) ??
      true,
  },
};

function reducer(draft: Draft<FilterState>, action: Action): void {
  switch (action.type) {
    case 'MAP_LOADED':
      draft.routeTypes.rendererClasses = castDraft(action.payload.routeTypes);
      if (draft.routeTypes.selectedClasses === null) {
        draft.routeTypes.selectedClasses = Array.from(
          { length: action.payload.routeTypes.length },
          (_, i) => i,
        );
      }

      draft.trafficStress.rendererClasses = castDraft(
        action.payload.trafficStress,
      );
      if (draft.trafficStress.selectedClasses === null) {
        draft.trafficStress.selectedClasses = Array.from(
          { length: action.payload.trafficStress.length },
          (_, i) => i,
        );
      }

      draft.trafficSignals.rendererClasses = castDraft(
        action.payload.trafficSignals,
      );
      if (draft.trafficSignals.selectedClasses === null) {
        draft.trafficSignals.selectedClasses = Array.from(
          { length: action.payload.trafficSignals.length },
          (_, i) => i,
        );
      }

      draft.symbols = castDraft(action.payload.symbols);

      break;

    case 'TOGGLE_RENDERER_CLASS': {
      const selectedClasses = draft[action.payload.layerKey].selectedClasses;

      if (selectedClasses!.includes(action.payload.classIndex)) {
        selectedClasses!.splice(
          selectedClasses!.indexOf(action.payload.classIndex),
          1,
        );
      } else {
        selectedClasses!.push(action.payload.classIndex);
      }

      setUrlParameter(action.payload.layerKey, selectedClasses!);

      break;
    }

    case 'TOGGLE_FILTER_TYPE': {
      const newValue =
        draft.selectedFilterType === 'routeTypes'
          ? 'trafficStress'
          : 'routeTypes';

      draft.selectedFilterType = newValue;

      setUrlParameter('filterType', newValue);

      break;
    }

    case 'TOGGLE_LAYER': {
      const layerKey = action.payload.layerKey;
      draft.layerToggles[layerKey] = !draft.layerToggles[layerKey];

      setUrlParameter(layerKey, draft.layerToggles[layerKey]);

      break;
    }
  }
}

export const FilterContext = createContext<{
  state: FilterState;
  dispatch: Dispatch<Action>;
} | null>(null);

export default function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}
