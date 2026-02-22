import type { TextConfig } from '@/types/component';

export const textCodeEmitter = (config: TextConfig) => {
  const dsl = {
    type: 'text',
    id: `text_${Date.now()}`,
    props: {
      text: config.text,
    },
    style: {
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      textColor: config.textColor,
      textAlign: config.textAlign,
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing,
      numberOfLines: config.numberOfLines,
      width: config.width,
      height: config.height,
    },
    children: undefined,
  };
  
  return JSON.stringify(dsl, null, 2);
};
