import { Header } from '@ugrc/utah-design-system';
import Filter from './components/Filter';
import { MapContainer } from './components/MapContainer';

export default function App() {
  return (
    <main className="flex size-full flex-col">
      <Header>
        <div className="flex h-full grow items-center gap-3">
          <h1 className="font-heading font-black leading-7 text-zinc-600 sm:text-5xl dark:text-zinc-100">
            Utah Bikeways
          </h1>
        </div>
      </Header>
      <MapContainer />
      <Filter />
    </main>
  );
}
