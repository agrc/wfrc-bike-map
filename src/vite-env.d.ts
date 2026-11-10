/// <reference types="vite/client" />
/// <reference types="@arcgis/map-components/types/react" />

declare module '@utahdts/utah-design-system-header/css';

interface ImportMetaEnv {
  readonly VITE_FIREBASE_CONFIG: string;
  readonly VITE_DISCOVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
