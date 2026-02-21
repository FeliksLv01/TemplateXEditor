export interface ContainerConfig {
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  aspectRatio?: number;
  margin?: number;
  marginTop?: number;
  marginLeft?: number;
  marginBottom?: number;
  marginRight?: number;
  padding?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingBottom?: number;
  paddingRight?: number;
  backgroundColor?: string;
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowRadius?: number;
  shadowOpacity?: number;
  opacity?: number;
  display?: 'flex' | 'none';
  visibility?: 'visible' | 'hidden';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

export interface TextConfig {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number | string;
  letterSpacing?: number;
  numberOfLines?: number;
  width?: string | number;
  height?: string | number;
}

export interface ImageConfig {
  src: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  cornerRadius?: number;
  backgroundColor?: string;
}

export interface ButtonConfig {
  title: string;
  backgroundColor?: string;
  cornerRadius?: number;
  textColor?: string;
  fontWeight?: string;
  width?: string | number;
  height?: string | number;
}

export interface ListConfig {
  direction?: 'vertical' | 'horizontal';
  columns?: number;
  rows?: number;
  rowSpacing?: number;
  columnSpacing?: number;
  showsIndicator?: boolean;
  bounces?: boolean;
  isPagingEnabled?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  estimatedItemHeight?: number | string;
  autoAdjustHeight?: boolean;
  items?: string;
  width?: string | number;
  height?: string | number;
}
