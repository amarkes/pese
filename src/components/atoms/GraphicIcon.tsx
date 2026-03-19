import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface GraphicIconProps {
  fill?: string;
  width?: number;
  height?: number;
  /** Se true, espelha verticalmente para representar queda */
  flipped?: boolean;
}

export const GraphicIcon: React.FC<GraphicIconProps> = ({
  fill = '#10B981',
  width = 10,
  height = 6,
  flipped = false,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 10 6"
      style={flipped ? { transform: [{ scaleY: -1 }] } : undefined}
    >
      <Path
        d="M7 6V5H8.3L5.7 2.425L3.7 4.425L0 0.7L0.7 0L3.7 3L5.7 1L9 4.3V3H10V6H7Z"
        fill={fill}
      />
    </Svg>
  );
};
