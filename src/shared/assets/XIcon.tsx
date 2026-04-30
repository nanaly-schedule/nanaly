import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function XIcon({ size, color = '#333333' }: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12.0003 20.3333C16.6027 20.3333 20.3337 16.6023 20.3337 12C20.3337 7.39759 16.6027 3.66663 12.0003 3.66663C7.39795 3.66663 3.66699 7.39759 3.66699 12C3.66699 16.6023 7.39795 20.3333 12.0003 20.3333Z"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 9.5L9.5 14.5"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 9.5L14.5 14.5"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
