import { useContext } from 'react';
import { FirebaseRemoteConfigsContext } from '../context/FirebaseRemoteConfigsProvider';

export default function useRemoteConfigs() {
  const context = useContext(FirebaseRemoteConfigsContext);

  if (context === undefined) {
    throw new Error(
      'useRemoteConfigs must be used within a FirebaseRemoteConfigsProvider',
    );
  }

  return context.getConfig;
}
