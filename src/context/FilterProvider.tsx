import { type Draft } from 'immer';
import { createContext, type Dispatch, type ReactNode } from 'react';
import { useImmerReducer } from 'use-immer';
import type { LayersWithRenderClassesKeys } from '../shared';

type FilterState = {
  selectedFilterType: Omit<LayersWithRenderClassesKeys, 'trafficSignals'>;
  symbols: {
    otherLinks: __esri.Symbol | null;
  };
  routeTypes: {
    rendererClasses: __esri.UniqueValueClass[];
    selectedClasses: number[];
  };
  trafficStress: {
    rendererClasses: __esri.UniqueValueClass[];
    selectedClasses: number[];
  };
  trafficSignals: {
    rendererClasses: __esri.UniqueValueClass[];
    selectedClasses: number[];
  };
  layerToggles: {
    otherLinks: boolean;
  };
};

type Action =
  | {
      type: 'MAP_LOADED';
      payload: {
        routeTypes: __esri.UniqueValueClass[];
        trafficStress: __esri.UniqueValueClass[];
        trafficSignals: __esri.UniqueValueClass[];
        symbols: {
          otherLinks: __esri.Symbol;
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
        layerKey: 'otherLinks';
      };
    };

const initialState: FilterState = {
  selectedFilterType: 'routeTypes',
  symbols: {
    otherLinks: null,
  },
  routeTypes: {
    rendererClasses: [],
    selectedClasses: [],
  },
  trafficStress: {
    rendererClasses: [],
    selectedClasses: [],
  },
  trafficSignals: {
    rendererClasses: [],
    selectedClasses: [],
  },
  layerToggles: {
    otherLinks: true,
  },
};

function reducer(draft: Draft<FilterState>, action: Action): void {
  switch (action.type) {
    case 'MAP_LOADED':
      draft.routeTypes.rendererClasses = action.payload.routeTypes;
      draft.routeTypes.selectedClasses = Array.from(
        { length: action.payload.routeTypes.length },
        (_, i) => i,
      );

      draft.trafficStress.rendererClasses = action.payload.trafficStress;
      draft.trafficStress.selectedClasses = Array.from(
        { length: action.payload.trafficStress.length },
        (_, i) => i,
      );

      draft.trafficSignals.rendererClasses = action.payload.trafficSignals;
      draft.trafficSignals.selectedClasses = Array.from(
        { length: action.payload.trafficSignals.length },
        (_, i) => i,
      );

      draft.symbols = action.payload.symbols;

      break;

    case 'TOGGLE_RENDERER_CLASS':
      const selectedClasses = draft[action.payload.layerKey].selectedClasses;

      if (selectedClasses.includes(action.payload.classIndex)) {
        selectedClasses.splice(
          selectedClasses.indexOf(action.payload.classIndex),
          1,
        );
      } else {
        selectedClasses.push(action.payload.classIndex);
      }

      break;

    case 'TOGGLE_FILTER_TYPE':
      draft.selectedFilterType =
        draft.selectedFilterType === 'routeTypes'
          ? 'trafficStress'
          : 'routeTypes';

      break;

    case 'TOGGLE_LAYER':
      draft.layerToggles[action.payload.layerKey] =
        !draft.layerToggles[action.payload.layerKey];

      break;
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
