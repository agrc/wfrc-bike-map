import { Button } from '@ugrc/utah-design-system/components/Button';
import { Checkbox } from '@ugrc/utah-design-system/components/Checkbox';
import { Dialog } from '@ugrc/utah-design-system/components/Dialog';
import { ExternalLink } from '@ugrc/utah-design-system/components/Link';
import { Modal } from '@ugrc/utah-design-system/components/Modal';
import useLocalStorage from '@ugrc/utilities/hooks/useLocalStorage';
import { HelpCircle } from 'lucide-react';
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
      <Button variant="icon" aria-label="About">
        <HelpCircle />
      </Button>
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

          <p className="flex justify-end text-sm">
            <ExternalLink href="/ThirdPartyNotices.txt">
              Third-party Notices
            </ExternalLink>
          </p>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
