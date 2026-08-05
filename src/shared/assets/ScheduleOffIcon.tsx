import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function ScheduleOffIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G clipPath="url(#scheduleOffClip)">
        <Rect
          x={0.625}
          y={4.625}
          width={22.75}
          height={17.75}
          rx={3.375}
          stroke={color}
          strokeWidth={1.25}
        />
        <Path
          d="M20 10.625C20.3452 10.625 20.625 10.3452 20.625 10C20.625 9.65482 20.3452 9.375 20 9.375V10V10.625ZM1 10V10.625H20V10V9.375H1V10Z"
          fill={color}
        />
        <Path
          d="M7.5 3V6M16.5 3V6"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M7.5 15L9.67703 16.6328C10.7545 17.4409 12.2386 17.4319 13.3062 16.6106L18 13"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </G>
      <Defs>
        <ClipPath id="scheduleOffClip">
          <Rect width={24} height={24} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
