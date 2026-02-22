import type { ButtonConfig } from '@/types/component';

export const buttonCodeEmitter = (config: ButtonConfig) => {
  const dsl = {
    type: 'button',
    id: `button_${Date.now()}`,
    props: {
      title: config.title,
    },
    style: {
      backgroundColor: config.backgroundColor,
      cornerRadius: config.cornerRadius,
      textColor: config.textColor,
      fontWeight: config.fontWeight,
      width: config.width,
      height: config.height,
    },
    children: undefined,
  };
  
  return JSON.stringify(dsl, null, 2);
};
