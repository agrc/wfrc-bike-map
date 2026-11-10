import { Button } from '@ugrc/utah-design-system/components/Button';
import { Checkbox } from '@ugrc/utah-design-system/components/Checkbox';
import { Dialog } from '@ugrc/utah-design-system/components/Dialog';
import { Modal } from '@ugrc/utah-design-system/components/Modal';
import useLocalStorage from '@ugrc/utilities/hooks/useLocalStorage';
import { DialogTrigger } from 'react-aria-components/Dialog';
import useRemoteConfigs from '../hooks/useRemoteConfigs';

type HelpDialogProps = {
  useMyLocationOnLoad: boolean;
  setUseMyLocationOnLoad: (value: boolean) => void;
};
export default function AboutDialog({
  useMyLocationOnLoad,
  setUseMyLocationOnLoad,
}: HelpDialogProps) {
  const [hideOnLoad, setHideOnLoad] = useLocalStorage(
    'showHelpDialogOnLoad',
    false,
    true,
  );
  const getConfig = useRemoteConfigs();

  if (!getConfig) {
    return null;
  }

  return (
    <DialogTrigger defaultOpen={!hideOnLoad}>
      <Button
        id="about-dialog-trigger"
        variant="icon"
        aria-label="About"
        className="hidden"
      />
      <Modal>
        <Dialog className="space-y-3" aria-label="About">
          <div
            className="space-y-3"
            dangerouslySetInnerHTML={{ __html: getConfig('aboutContent') }}
          />

          <Checkbox isSelected={hideOnLoad} onChange={setHideOnLoad}>
            Don{`'`}t show this dialog again
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
