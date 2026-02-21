import type { TextConfig } from '@/types/component';

export const textCodeEmitter = (config: TextConfig) => {
  const props = config.props || {};
  const style = config.style || {};
  
  const dsl = {
    type: 'text',
    id: `text_${Date.now()}`,
    props: props,
    style: style,
    children: undefined,
  };
  
  return JSON.stringify(dsl, null, 2);
};
