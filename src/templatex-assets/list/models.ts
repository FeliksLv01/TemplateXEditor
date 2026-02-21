import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';
import type { ListConfig } from '@/types/component';

export const listSchema: JSONSchema<ListConfig> = {
  type: 'object',
  properties: {
    direction: {
      type: 'string',
      title: '滚动方向',
      renderType: 'radioGroup',
      enum: ['vertical', 'horizontal'],
      enumNames: ['纵向', '横向'],
      default: 'vertical',
      category: 'list',
    },
    columns: {
      type: 'number',
      title: '列数',
      default: 1,
      category: 'list',
    },
    rows: {
      type: 'number',
      title: '行数',
      default: 1,
      category: 'list',
    },
    rowSpacing: {
      type: 'number',
      title: '行间距',
      default: 8,
      category: 'list',
    },
    columnSpacing: {
      type: 'number',
      title: '列间距',
      default: 8,
      category: 'list',
    },
    showsIndicator: {
      type: 'boolean',
      title: '显示滚动条',
      default: true,
      category: 'list',
    },
    bounces: {
      type: 'boolean',
      title: '弹性效果',
      default: true,
      category: 'list',
    },
    isPagingEnabled: {
      type: 'boolean',
      title: '分页滚动',
      default: false,
      category: 'list',
    },
    itemWidth: {
      type: 'number',
      title: 'Item 宽度',
      default: 100,
      category: 'size',
    },
    itemHeight: {
      type: 'number',
      title: 'Item 高度',
      default: 100,
      category: 'size',
    },
    estimatedItemHeight: {
      type: 'string',
      title: '预估 Item 高度',
      default: '100',
      category: 'size',
    },
    autoAdjustHeight: {
      type: 'boolean',
      title: '自动调整高度',
      default: false,
      category: 'list',
    },
    width: {
      type: 'string',
      title: '宽度',
      default: '100%',
      category: 'size',
    },
    height: {
      type: 'string',
      title: '高度',
      default: '400',
      category: 'size',
    },
  },
};

export const listModel: AssetConfigModel = {
  key: 'list',
  schema: () => listSchema,
  emitter: (config) => {
    return {
      style: {
        direction: config.content.direction,
        columns: config.content.columns,
        rows: config.content.rows,
        rowSpacing: config.content.rowSpacing,
        columnSpacing: config.content.columnSpacing,
        showsIndicator: config.content.showsIndicator,
        bounces: config.content.bounces,
        isPagingEnabled: config.content.isPagingEnabled,
        itemWidth: config.content.itemWidth,
        itemHeight: config.content.itemHeight,
        estimatedItemHeight: config.content.estimatedItemHeight,
        autoAdjustHeight: config.content.autoAdjustHeight,
        width: config.content.width,
        height: config.content.height,
      },
    };
  },
};
