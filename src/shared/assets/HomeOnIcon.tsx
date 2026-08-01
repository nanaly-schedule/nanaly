import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function HomeOnIcon({
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
      <G clipPath="url(#homeOnClip)">
        <Path
          d="M4 18.5V9.5C4 9.18333 4.071 8.88333 4.213 8.6C4.355 8.31667 4.55067 8.08333 4.8 7.9L10.8 3.4C11.15 3.13333 11.55 3 12 3C12.45 3 12.85 3.13333 13.2 3.4L19.2 7.9C19.45 8.08333 19.646 8.31667 19.788 8.6C19.93 8.88333 20.0007 9.18333 20 9.5V18.5C20 19.05 19.804 19.521 19.412 19.913C19.02 20.305 18.5493 20.5007 18 20.5H15C14.7167 20.5 14.4793 20.404 14.288 20.212C14.0967 20.02 14.0007 19.7827 14 19.5V14.5C14 14.2167 13.904 13.9793 13.712 13.788C13.52 13.5967 13.2827 13.5007 13 13.5H11C10.7167 13.5 10.4793 13.596 10.288 13.788C10.0967 13.98 10.0007 14.2173 10 14.5V19.5C10 19.7833 9.904 20.021 9.712 20.213C9.52 20.405 9.28267 20.5007 9 20.5H6C5.45 20.5 4.97933 20.3043 4.588 19.913C4.19667 19.5217 4.00067 19.0507 4 18.5Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="homeOnClip">
          <Rect width={24} height={24} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
