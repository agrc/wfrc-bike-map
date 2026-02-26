import '@arcgis/map-components/components/arcgis-feature';
import { Button, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { CircleX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Feedback from './Feedback';
import './Identify.css';

type IdentifyProps = {
  graphic: __esri.Graphic;
  clear: () => void;
};

export default function Identify({ graphic, clear }: IdentifyProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const featureComponentRef = useRef<HTMLArcgisFeatureElement>(null);

  const logEvent = useFirebaseAnalytics();

  useEffect(() => {
    setShowFeedback(false);
  }, [graphic]);

  return (
    <>
      <Button className="absolute left-0 top-0" variant="icon" onPress={clear}>
        <CircleX />
      </Button>
      <div className="size-full overflow-y-auto">
        <arcgis-feature
          ref={featureComponentRef}
          className="bg-transparent p-3"
          graphic={graphic}
          autoDestroyDisabled={true}
          style={{
            '--calcite-color-background': 'transparent',
            '--calcite-color-foreground-1': 'transparent',
          }}
        />
        <div className="px-3 pb-4">
          {showFeedback ? (
            <Feedback
              onCancel={() => setShowFeedback(false)}
              // pass the graphic from the feature component because it makes the request to get all of the attributes, the graphic from the map click only has the symbology fields
              graphic={featureComponentRef.current!.graphic!}
            />
          ) : (
            <Button
              className="w-full"
              onPress={() => {
                logEvent('show_feature_feedback');
                setShowFeedback(true);
              }}
            >
              Give feedback about this road or trail
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
