import Svg, { Path } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function AppIcon({ size, color = '#333333' }: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
    >
      <Path
        d="M5.7549 23.3191H67.2451M49.049 42.1489V46.5426M56.5784 42.1489V46.5426M43.402 50.3085C44.0294 52.4007 46.7902 56.5851 52.8137 56.5851C58.8373 56.5851 61.1797 52.4007 61.598 50.3085M13.2843 66H59.7157C64.5671 66 68.5 62.0658 68.5 57.2128V15.7872C68.5 10.9342 64.5671 7 59.7157 7H13.2843C8.43287 7 4.5 10.9342 4.5 15.7872V57.2128C4.5 62.0658 8.43287 66 13.2843 66Z"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
