import { Button, Checkbox, Dialog, Modal } from '@ugrc/utah-design-system';
import { useLocalStorage } from '@ugrc/utilities/hooks';
import { HelpCircle } from 'lucide-react';
import { DialogTrigger } from 'react-aria-components';

type HelpDialogProps = {
  useMyLocationOnLoad: boolean;
  setUseMyLocationOnLoad: (value: boolean) => void;
};
export default function HelpDialog({
  useMyLocationOnLoad,
  setUseMyLocationOnLoad,
}: HelpDialogProps) {
  const [hideOnLoad, setHideOnLoad] = useLocalStorage(
    'showHelpDialogOnLoad',
    false,
    true,
  );

  return (
    <DialogTrigger defaultOpen={!hideOnLoad}>
      <Button variant="icon" aria-label="About">
        <HelpCircle />
      </Button>
      <Modal>
        <Dialog className="space-y-3" aria-label="About">
          <p>
            This web map depicts known existing bicycle paths, lanes, and paths.
            An alternate map view conveys a comparative level of traffic stress
            (LTS) that users might experience when bicycling along major
            roadways.
          </p>
          <p>
            This dataset is updated periodically but users are advised that the
            map may not reflect current conditions on the ground, and may
            contain errors or omissions. User can click on any location on the
            map to indicate where updated data is needed.
          </p>
          <p>Use of this information is at your own risk.</p>

          <Checkbox isSelected={hideOnLoad} onChange={setHideOnLoad}>
            Don't show this dialog again
          </Checkbox>

          <Checkbox
            isSelected={useMyLocationOnLoad}
            onChange={setUseMyLocationOnLoad}
          >
            Use my location to initialize the map
          </Checkbox>

          <Button slot="close" className="w-full">
            Close
          </Button>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
