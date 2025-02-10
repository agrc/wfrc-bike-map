import { type Draft } from 'immer';
import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react';
import { useImmerReducer } from 'use-immer';

type FilterState = {
  selectedFilterType: 'routeTypes' | 'trafficStress';
  routeTypes: {
    rendererClasses: __esri.UniqueValueClass[];
    selectedClasses: number[];
  };
  trafficStress: {
    rendererClasses: __esri.UniqueValueClass[];
    selectedClasses: number[];
  };
};

type Action =
  | {
      type: 'MAP_LOADED';
      payload: {
        routeTypes: __esri.UniqueValueClass[];
        trafficStress: __esri.UniqueValueClass[];
      };
    }
  | {
      type: 'TOGGLE_RENDERER_CLASS';
      payload: {
        classIndex: number;
        layerKey: 'routeTypes' | 'trafficStress';
      };
    }
  | {
      type: 'TOGGLE_FILTER_TYPE';
    };

const initialState: FilterState = {
  selectedFilterType: 'routeTypes',
  routeTypes: {
    rendererClasses: [],
    selectedClasses: [],
  },
  trafficStress: {
    rendererClasses: [],
    selectedClasses: [],
  },
};

function reducer(draft: Draft<FilterState>, action: Action): void {
  switch (action.type) {
    case 'MAP_LOADED':
      draft.routeTypes.rendererClasses = action.payload.routeTypes;
      // set selectedClasses to an array of sequential numbers starting at 0 with the same length as the rendererClasses array
      draft.routeTypes.selectedClasses = Array.from(
        { length: action.payload.routeTypes.length },
        (_, i) => i,
      );
      draft.trafficStress.rendererClasses = action.payload.trafficStress;
      draft.trafficStress.selectedClasses = Array.from(
        { length: action.payload.trafficStress.length },
        (_, i) => i,
      );

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
  }
}

const FilterContext = createContext<{
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

export function useFilter() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }

  return context;
}
