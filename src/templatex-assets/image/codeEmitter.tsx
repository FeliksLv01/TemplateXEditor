import type { ImageConfig } from '@/types/component';

export const imageCodeEmitter = (config: ImageConfig) => {
  const props = config.props || {};
  const style = config.style || {};
  
  const dsl = {
    type: 'image',
    id: `image_${Date.now()}`,
    props: props,
    style: style,
  };
  
  return JSON.stringify(dsl, null, 2);
};
