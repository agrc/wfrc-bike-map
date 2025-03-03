import { Drawer, Header } from '@ugrc/utah-design-system';
import { useLocalStorage } from '@ugrc/utilities/hooks';
import { useEffect, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import AboutDialog from './components/AboutDialog';
import Filter from './components/Filter';
import Identify from './components/Identify';
import { MapContainer } from './components/MapContainer';
import FilterProvider from './context/FilterProvider';

export default function App() {
  const trayState = useOverlayTriggerState({ defaultOpen: true });
  const trayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    trayState,
  );
  const [identifyGraphic, setIdentifyGraphic] = useState<__esri.Graphic | null>(
    null,
  );

  const clearIdentify = () => setIdentifyGraphic(null);

  useEffect(() => {
    if (identifyGraphic && !trayState.isOpen) {
      trayState.open();
    }
  }, [identifyGraphic]);

  const [useMyLocationOnLoad, setUseMyLocationOnLoad] = useLocalStorage(
    'useMyLocationOnLoad',
    false,
    true,
  );

  return (
    <main className="flex size-full flex-col">
      <Header>
        <div className="flex h-full grow items-center gap-3">
          <h1 className="font-heading font-black leading-7 text-primary-900 sm:text-5xl dark:text-zinc-100">
            Utah Bikeways
          </h1>
        </div>
        <AboutDialog
          useMyLocationOnLoad={useMyLocationOnLoad}
          setUseMyLocationOnLoad={setUseMyLocationOnLoad}
        />
      </Header>
      <FilterProvider>
        <MapContainer
          trayIsOpen={trayState.isOpen}
          onFeatureIdentify={setIdentifyGraphic}
          useMyLocationOnLoad={useMyLocationOnLoad}
        />
        <Drawer
          type="tray"
          allowFullScreen
          state={trayState}
          {...trayTriggerProps}
        >
          {identifyGraphic ? (
            <Identify graphic={identifyGraphic} clear={clearIdentify} />
          ) : (
            <Filter />
          )}
        </Drawer>
      </FilterProvider>
    </main>
  );
}
