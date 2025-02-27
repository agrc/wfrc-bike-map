import '@arcgis/map-components/components/arcgis-feature';
import { Button } from '@ugrc/utah-design-system';
import { CircleX } from 'lucide-react';
import './Identify.css';

type IdentifyProps = {
  graphic: __esri.Graphic;
  clear: () => void;
};

export default function Identify({ graphic, clear }: IdentifyProps) {
  return (
    <>
      <Button variant="icon" onPress={clear}>
        <CircleX />
      </Button>
      <arcgis-feature className="p-2" graphic={graphic} />
    </>
  );
}
