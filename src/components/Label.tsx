import { Label as UDSLabel } from '@ugrc/utah-design-system/components/Field';

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
};

export default function Label({ children, htmlFor }: LabelProps) {
  return (
    <UDSLabel htmlFor={htmlFor} className="text-lg">
      {children}
    </UDSLabel>
  );
}
