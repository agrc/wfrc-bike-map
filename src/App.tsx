import { Drawer, Header } from '@ugrc/utah-design-system';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Filter from './components/Filter';
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

  return (
    <main className="flex size-full flex-col">
      <Header>
        <div className="flex h-full grow items-center gap-3">
          <h1 className="font-heading font-black leading-7 text-primary-900 sm:text-5xl dark:text-zinc-100">
            Utah Bikeways
          </h1>
        </div>
      </Header>
      <FilterProvider>
        <MapContainer trayIsOpen={trayState.isOpen} />
        <Drawer
          type="tray"
          // className="data-[open='true']:h-[275px]"
          allowFullScreen
          state={trayState}
          {...trayTriggerProps}
        >
          <Filter />
        </Drawer>
      </FilterProvider>
    </main>
  );
}
