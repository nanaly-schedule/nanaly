import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { TypeIconProps } from '../types/assets';

export default function MegaphonePrivateIcon({
  size,
  color = '#575757',
}: TypeIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle cx={12} cy={12} r={12} fill="#D6D6D6" />
      <G clipPath="url(#megaphonePrivateClip)">
        <Path
          d="M9.89772 7.95179C12.0853 7.3028 13.9759 5.90712 15.2404 4.00777C15.3206 3.89385 15.4309 3.80451 15.5589 3.74974C15.687 3.69498 15.8278 3.67696 15.9655 3.69771C16.1033 3.71845 16.2325 3.77714 16.3387 3.86719C16.445 3.95725 16.5241 4.07511 16.5671 4.20758L19.3483 12.7671C19.3913 12.8996 19.3966 13.0414 19.3636 13.1767C19.3306 13.312 19.2605 13.4355 19.1613 13.5332C19.062 13.6309 18.9375 13.6991 18.8017 13.7301C18.666 13.761 18.5242 13.7536 18.3924 13.7085C16.253 12.9152 13.9031 12.8974 11.7518 13.6581L7.47207 15.0487C7.09372 15.1716 6.68202 15.1392 6.32756 14.9586C5.97309 14.778 5.70489 14.464 5.58196 14.0856L4.65491 11.2325C4.53197 10.8541 4.56437 10.4424 4.74498 10.088C4.92559 9.7335 5.23961 9.4653 5.61797 9.34237L9.89772 7.95179Z"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.18555 14.8174C8.78731 16.6694 9.97352 18.2763 11.5661 19.3969C11.8915 19.6258 12.2945 19.7161 12.6864 19.6479C13.0783 19.5797 13.4271 19.3586 13.6561 19.0332C13.885 18.7079 13.9753 18.3049 13.9071 17.913C13.8389 17.521 13.6178 17.1722 13.2924 16.9433C12.2307 16.1963 11.4399 15.125 11.0387 13.8903"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7.75781 8.64746L9.61191 14.3538"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="megaphonePrivateClip">
          <Rect
            width={18}
            height={18}
            fill="white"
            transform="translate(0.660156 6.22168) rotate(-18)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
