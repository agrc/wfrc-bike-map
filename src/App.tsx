import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Drawer, Header } from '@ugrc/utah-design-system';
import { useLocalStorage } from '@ugrc/utilities/hooks';
import { useEffect, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import AboutDialog from './components/AboutDialog';
import Feedback from './components/Feedback';
import Filter from './components/Filter';
import Identify from './components/Identify';
import { MapContainer } from './components/MapContainer';
import FilterProvider from './context/FilterProvider';

const queryClient = new QueryClient();

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
  const [genericFeedbackPoint, setGenericFeedbackPoint] =
    useState<__esri.Graphic | null>(null);

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
          <img src="/logo.svg" alt="Utah Bikeways Logo" className="h-12 w-12" />
          <h2 className="font-heading font-black leading-7 text-primary-900 sm:text-5xl dark:text-zinc-100">
            Utah Bikeways
          </h2>
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
          genericFeedbackPoint={genericFeedbackPoint}
          setGenericFeedbackPoint={setGenericFeedbackPoint}
        />
        <Drawer
          type="tray"
          allowFullScreen
          state={trayState}
          {...trayTriggerProps}
        >
          <QueryClientProvider client={queryClient}>
            {identifyGraphic ? (
              <Identify graphic={identifyGraphic} clear={clearIdentify} />
            ) : genericFeedbackPoint ? (
              <div className="p-4">
                <Feedback
                  genericPoint={genericFeedbackPoint}
                  onCancel={() => setGenericFeedbackPoint(null)}
                />
              </div>
            ) : (
              <Filter />
            )}
          </QueryClientProvider>
        </Drawer>
      </FilterProvider>
    </main>
  );
}
