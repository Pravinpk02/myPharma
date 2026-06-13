declare module '@react-map/india' {
  import * as React from 'react';

  export interface CityColorMap {
    [key: string]: string;
  }

  export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'dash-dot' | 'dash-double-dot';

  export interface IndiaProps {
    type: 'select-single' | 'select-multiple';
    size?: number;
    mapColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    hoverColor?: string;
    selectColor?: string;
    hints?: boolean;
    hintTextColor?: string;
    hintBackgroundColor?: string;
    hintPadding?: string;
    hintBorderRadius?: number;
    onSelect?: (state: string | null, selectedStates?: string[]) => void;
    cityColors?: CityColorMap;
    disableClick?: boolean;
    disableHover?: boolean;
    borderStyle?: BorderStyle;
  }

  const India: React.ComponentType<IndiaProps>;
  export default India;
}
