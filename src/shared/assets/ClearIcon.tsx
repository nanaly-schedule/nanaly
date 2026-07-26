import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function ClearIcon({
  size,
  color = '#333333',
}: TypeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_1977_42531)">
        <Path
          d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14.25 9.75L9.75 14.25"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.75 9.75L14.25 14.25"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1977_42531">
          <Rect width={18} height={18} fill="white" transform="translate(3 3)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
