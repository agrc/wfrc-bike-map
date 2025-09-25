import {
  ToggleButtonGroup as RACToggleButtonGroup,
  type ToggleButtonGroupProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return (
    <RACToggleButtonGroup
      {...props}
      className={twMerge(
        'flex flex-row [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button]:rounded-none',
        props.className as string,
      )}
    />
  );
}
