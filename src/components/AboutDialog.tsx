import {
  Button,
  Checkbox,
  Dialog,
  ExternalLink,
  Modal,
} from '@ugrc/utah-design-system';
import { useLocalStorage } from '@ugrc/utilities/hooks';
import { HelpCircle } from 'lucide-react';
import { DialogTrigger } from 'react-aria-components';
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
      <Button variant="icon" aria-label="About">
        <HelpCircle />
      </Button>
      <Modal>
        <Dialog className="space-y-3" aria-label="About">
          <div
            className="space-y-3"
            dangerouslySetInnerHTML={{ __html: getConfig('aboutContent') }}
          />

          <p>
            <ExternalLink href="/ThirdPartyNotices.txt">
              Third-party Notices
            </ExternalLink>
          </p>

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
