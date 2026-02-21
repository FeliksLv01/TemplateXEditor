import type { ButtonConfig } from '@/types/component';

export const buttonCodeEmitter = (config: ButtonConfig) => {
  const props = config.props || {};
  const style = config.style || {};
  
  const dsl = {
    type: 'button',
    id: `button_${Date.now()}`,
    props: props,
    style: style,
    children: undefined,
  };
  
  return JSON.stringify(dsl, null, 2);
};
