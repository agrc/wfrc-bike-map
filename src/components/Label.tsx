import { Label as UDSLabel } from '@ugrc/utah-design-system';

type LabelProps = {
  children: React.ReactNode;
};

export default function Label({ children }: LabelProps) {
  return <UDSLabel className="text-lg">{children}</UDSLabel>;
}
