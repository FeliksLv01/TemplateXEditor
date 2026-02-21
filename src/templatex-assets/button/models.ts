import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';
import type { ButtonConfig } from '@/types/component';

export const buttonSchema: JSONSchema<ButtonConfig> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '按钮文本',
      renderProps: {
        allowClear: true,
        placeholder: '输入按钮文本',
        autoFocus: true,
      },
    },
    backgroundColor: {
      type: 'string',
      title: '背景颜色',
      renderType: 'color',
      default: '#1890FF',
      category: 'button',
    },
    cornerRadius: {
      type: 'number',
      title: '圆角',
      default: 8,
      category: 'button',
    },
    textColor: {
      type: 'string',
      title: '文本颜色',
      renderType: 'color',
      default: '#FFFFFF',
      category: 'button',
    },
    fontWeight: {
      type: 'string',
      title: '字重',
      renderType: 'select',
      enum: ['normal', 'bold', '400', '500', '600', '700'],
      default: '500',
      category: 'button',
    },
    width: {
      type: 'string',
      title: '宽度',
      default: 'auto',
      category: 'size',
    },
    height: {
      type: 'number',
      title: '高度',
      default: 44,
      category: 'size',
    },
  },
};

export const buttonModel: AssetConfigModel = {
  key: 'button',
  schema: () => buttonSchema,
  emitter: (config) => {
    return {
      props: {
        title: config.content.title,
      },
      style: {
        backgroundColor: config.content.backgroundColor,
        cornerRadius: config.content.cornerRadius,
        color: config.content.textColor,
        fontWeight: config.content.fontWeight,
        width: config.content.width,
        height: config.content.height,
      },
    };
  },
};
