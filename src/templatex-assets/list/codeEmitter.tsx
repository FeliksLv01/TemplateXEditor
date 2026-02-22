import type { ListConfig } from '@/types/component';

export const listCodeEmitter = (config: ListConfig) => {
  const dsl = {
    type: 'list',
    id: `list_${Date.now()}`,
    props: {
      items: config.items || '${items}',
    },
    style: {
      direction: config.direction,
      columns: config.columns,
      rows: config.rows,
      rowSpacing: config.rowSpacing,
      columnSpacing: config.columnSpacing,
      itemWidth: config.itemWidth,
      itemHeight: config.itemHeight,
      width: config.width,
      height: config.height,
    },
    children: [],
  };
  
  return JSON.stringify(dsl, null, 2);
};
