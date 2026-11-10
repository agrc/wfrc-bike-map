import type Graphic from '@arcgis/core/Graphic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Drawer } from '@ugrc/utah-design-system/components/Drawer';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import useLocalStorage from '@ugrc/utilities/hooks/useLocalStorage';
import { useCallback, useState } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { useWindowSize } from 'usehooks-ts';
import AboutDialog from './components/AboutDialog';
import Feedback from './components/Feedback';
import Filter from './components/Filter';
import Identify from './components/Identify';
import { MapContainer } from './components/MapContainer';
import UtahChrome from './components/UtahChrome';
import config from './config';
import FilterProvider from './context/FilterProvider';
import useRemoteConfigs from './hooks/useRemoteConfigs';

const queryClient = new QueryClient();

export default function App() {
  const getConfig = useRemoteConfigs();
  const trayState = useOverlayTriggerState({ defaultOpen: true });
  const trayTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    trayState,
  );
  const [identifyGraphic, setIdentifyGraphic] = useState<Graphic | null>(null);
  const [genericFeedbackPoint, setGenericFeedbackPoint] =
    useState<Graphic | null>(null);

  const clearIdentify = () => setIdentifyGraphic(null);

  const openAboutDialog = useCallback(() => {
    const aboutTrigger = document.getElementById('about-dialog-trigger');
    if (!(aboutTrigger instanceof HTMLButtonElement)) {
      throw new Error('The About dialog trigger is not available.');
    }

    aboutTrigger.click();
  }, []);

  const logEvent = useFirebaseAnalytics();
  const onFeatureIdentify = (graphic: Graphic | null) => {
    logEvent('identify');
    if (graphic) {
      trayState.open();
    }
    setIdentifyGraphic(graphic);
  };

  const [useMyLocationOnLoad, setUseMyLocationOnLoad] = useLocalStorage(
    'useMyLocationOnLoad',
    false,
    true,
  );

  const { width: windowWidth = 0 } = useWindowSize();
  const isSmallWidth = windowWidth < config.BREAKPOINTS.md;

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        <UtahChrome
          hasAboutDialog={Boolean(getConfig)}
          onAboutClick={openAboutDialog}
        />
        <main id="main-content" className="flex min-h-0 flex-1 flex-col">
          <AboutDialog
            useMyLocationOnLoad={useMyLocationOnLoad}
            setUseMyLocationOnLoad={setUseMyLocationOnLoad}
          />
          <FilterProvider>
            <QueryClientProvider client={queryClient}>
              <div className="min-h-0 flex-1">
                <MapContainer
                  trayIsOpen={trayState.isOpen}
                  onFeatureIdentify={onFeatureIdentify}
                  useMyLocationOnLoad={useMyLocationOnLoad}
                  genericFeedbackPoint={genericFeedbackPoint}
                  setGenericFeedbackPoint={setGenericFeedbackPoint}
                  identifyGraphic={identifyGraphic}
                />
              </div>
              <Drawer
                type="tray"
                allowFullScreen
                state={trayState}
                {...trayTriggerProps}
              >
                {identifyGraphic && isSmallWidth ? (
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
              </Drawer>
            </QueryClientProvider>
          </FilterProvider>
        </main>
      </div>
      <div id="utah-footer-target" />
    </>
  );
}
