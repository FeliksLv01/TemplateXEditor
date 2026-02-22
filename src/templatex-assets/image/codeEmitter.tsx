import type { ImageConfig } from '@/types/component';

export const imageCodeEmitter = (config: ImageConfig) => {
  const dsl = {
    type: 'image',
    id: `image_${Date.now()}`,
    props: {
      src: config.src,
    },
    style: {
      width: config.width,
      height: config.height,
      objectFit: config.objectFit,
      cornerRadius: config.cornerRadius,
      backgroundColor: config.backgroundColor,
    },
  };
  
  return JSON.stringify(dsl, null, 2);
};
