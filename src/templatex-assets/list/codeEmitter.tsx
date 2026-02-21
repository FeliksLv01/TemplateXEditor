import type { ListConfig } from '@/types/component';

export const listCodeEmitter = (config: ListConfig) => {
  const style = config.style || {};
  
  const dsl = {
    type: 'list',
    id: `list_${Date.now()}`,
    props: {
      items: config.items || '${items}',
    },
    style: style,
    children: [],
  };
  
  return JSON.stringify(dsl, null, 2);
};
