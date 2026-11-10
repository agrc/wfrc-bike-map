import type Graphic from '@arcgis/core/Graphic';
import '@arcgis/map-components/components/arcgis-feature';
import { Button } from '@ugrc/utah-design-system/components/Button';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import { CircleX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Feedback from './Feedback';

type IdentifyProps = {
  graphic: Graphic;
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
      <style>{`
        .esri-popup__main-container {
          width: 400px !important;
        }

        .identify-popup {
          position: relative;
          width: 100%;
          max-height: 100%;
          overflow-y: auto;
          color: #333;
          font-family: inherit;
          box-sizing: border-box;
        }

        .identify-popup__close {
          position: absolute;
          top: -0.25rem;
          left: -0.25rem;
          z-index: 1;
          display: grid;
          width: 32px;
          height: 32px;
          min-height: 32px;
          padding: 4px;
          place-items: center;
          border: 0;
          border-radius: 9999px;
          background: transparent;
          color: #18181b;
          cursor: default;
        }

        .identify-popup__close:hover {
          background: rgb(0 0 0 / 5%);
        }

        .identify-popup__close:focus-visible,
        .identify-popup__feedback button:focus-visible {
          outline: 2px solid #4d2a54;
          outline-offset: 2px;
        }

        .identify-popup__close svg {
          width: 24px;
          height: 24px;
        }

        .identify-popup__feature {
          display: block;
          padding: 12px;
          box-sizing: border-box;
        }

        .identify-popup__feedback {
          padding: 0 12px 16px;
        }

        .identify-popup__feedback button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 36px;
          padding: 0 32px;
          border: 1px solid rgb(0 0 0 / 10%);
          border-radius: 9999px;
          background: #4d2a54;
          box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 10%);
          color: #fff;
          cursor: default;
          font-family: inherit;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          transition: all 200ms ease-in-out;
        }

        .identify-popup__feedback button:hover {
          background: #7c3f8c;
        }

        .identify-popup__feedback button:active {
          background: #673573;
        }

        .identify-popup__feedback button:disabled,
        .identify-popup__feedback button[aria-disabled='true'] {
          border-color: rgb(0 0 0 / 20%);
          background: #f4f4f5;
          color: #71717a;
        }

        .identify-popup__feedback-button {
          width: 100%;
        }

        .identify-popup form button:first-of-type {
          border-color: rgb(255 255 255 / 10%);
          background: #33505d;
        }

        .identify-popup form button:first-of-type:hover {
          background: #396e81;
        }

        .identify-popup form button:first-of-type:active {
          background: #345b6a;
        }

        .identify-popup form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .identify-popup form label {
          display: block;
          font-weight: 600;
        }

        .identify-popup form input,
        .identify-popup form textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #a1a1aa;
          border-radius: 4px;
          box-sizing: border-box;
          font: inherit;
        }

        .identify-popup form > div {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        @media (prefers-color-scheme: dark) {
          .identify-popup {
            color: #f4f4f5;
          }

          .identify-popup__close {
            color: #fff;
          }

          .identify-popup__close:hover {
            background: rgb(255 255 255 / 10%);
          }

          .identify-popup__feedback button:disabled,
          .identify-popup__feedback button[aria-disabled='true'] {
            border-color: rgb(255 255 255 / 20%);
            background: #3f3f46;
            color: #d4d4d8;
          }

          .identify-popup form input,
          .identify-popup form textarea {
            border-color: #52525b;
            background: #27272a;
            color: #f4f4f5;
          }
        }
      `}</style>
      <div className="identify-popup">
        <Button
          className="identify-popup__close"
          variant="icon"
          onPress={clear}
        >
          <CircleX />
        </Button>
        <arcgis-feature
          ref={featureComponentRef}
          className="identify-popup__feature"
          graphic={graphic}
          autoDestroyDisabled={true}
          style={{
            '--calcite-color-background': 'transparent',
            '--calcite-color-foreground-1': 'transparent',
          }}
        />
        <div className="identify-popup__feedback">
          {showFeedback ? (
            <Feedback
              onCancel={() => setShowFeedback(false)}
              // pass the graphic from the feature component because it makes the request to get all of the attributes, the graphic from the map click only has the symbology fields
              graphic={featureComponentRef.current!.graphic!}
            />
          ) : (
            <Button
              className="identify-popup__feedback-button"
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
