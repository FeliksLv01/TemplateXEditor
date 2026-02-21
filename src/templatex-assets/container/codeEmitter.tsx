import { generateJSXCode } from '@ant-design/pro-editor';
import type { ContainerConfig } from '@/types/component';

export const containerCodeEmitter = (config: ContainerConfig) => {
  const style = config.style || {};
  
  const dsl = {
    type: 'container',
    id: `container_${Date.now()}`,
    style: style,
    children: [],
  };
  
  return JSON.stringify(dsl, null, 2);
};
