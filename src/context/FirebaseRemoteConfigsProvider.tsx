import { useFirebaseApp } from '@ugrc/utah-design-system';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  type RemoteConfig,
} from 'firebase/remote-config';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import remoteConfigDefaults from '../remote_config_defaults.json';

type ConfigName = keyof typeof remoteConfigDefaults.parameters;
type ValueTypeName = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
type ValueType = string | number | boolean | LayerNames | FieldNames;
type Defaults = {
  [key in ConfigName]: string;
};
type Parameters = {
  [key in ConfigName]: {
    defaultValue: {
      value: string;
    };
    description: string;
    valueType: ValueTypeName;
  };
};
export type LayerNames = {
  routeTypes: string;
  trafficStress: string;
  trafficSignals: string;
  otherLinks: string;
};
export type FieldNames = {
  facility1: string;
  ltsScore: string;
  type: string;
};

function getDefaultValues(parameters: Parameters): Defaults {
  const values = {} as Defaults;

  for (const key in parameters) {
    values[key as ConfigName] =
      parameters[key as ConfigName].defaultValue.value;
  }

  return values;
}

type GetterFunction = (name: ConfigName) => ValueType;
export const FirebaseRemoteConfigsContext = createContext<{
  getConfig: GetterFunction | null;
}>({ getConfig: null });

function getGetter(
  remoteConfig: RemoteConfig,
  parameters: Parameters,
): GetterFunction {
  return (name: ConfigName) => {
    const value = getValue(remoteConfig, name);
    const valueType = parameters[name].valueType;

    switch (valueType) {
      case 'STRING':
        return value.asString();
      case 'NUMBER':
        return value.asNumber();
      case 'BOOLEAN':
        return value.asBoolean();
      case 'JSON':
        return JSON.parse(value.asString());
      default:
        throw new Error(`Unrecognized value type for ${name}`);
    }
  };
}

type FirebaseRemoteConfigsProviderProps = {
  children: ReactNode;
};

export default function FirebaseRemoteConfigsProvider({
  children,
}: FirebaseRemoteConfigsProviderProps) {
  const [state, setState] = useState<{
    getConfig: GetterFunction | null;
  }>({ getConfig: null });
  const app = useFirebaseApp();

  useEffect(() => {
    if (!app) {
      return;
    }

    const giddyUp = async () => {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.defaultConfig = getDefaultValues(
        remoteConfigDefaults.parameters as Parameters,
      );
      remoteConfig.settings.fetchTimeoutMillis = 2000;

      if (!import.meta.env.DEV) {
        try {
          console.log('fetching remote config values');
          await fetchAndActivate(remoteConfig);
        } catch (e) {
          console.error('failure to fetch and activate remote configs', e);
        }
      }

      setState({
        getConfig: getGetter(
          remoteConfig,
          remoteConfigDefaults.parameters as Parameters,
        ),
      });
    };

    giddyUp();
  }, [app]);

  return (
    <FirebaseRemoteConfigsContext.Provider value={state}>
      {children}
    </FirebaseRemoteConfigsContext.Provider>
  );
}
