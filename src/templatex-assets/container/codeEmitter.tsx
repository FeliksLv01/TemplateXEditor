import type { ContainerConfig } from '@/types/component';

export const containerCodeEmitter = (config: ContainerConfig) => {
  const dsl = {
    type: 'container',
    id: `container_${Date.now()}`,
    style: {
      flexDirection: config.flexDirection,
      justifyContent: config.justifyContent,
      alignItems: config.alignItems,
      padding: config.padding,
      backgroundColor: config.backgroundColor,
      width: config.width,
      height: config.height,
    },
    children: [],
  };
  
  return JSON.stringify(dsl, null, 2);
};
