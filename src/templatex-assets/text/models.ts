import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';
import type { TextConfig } from '@/types/component';

export const textSchema: JSONSchema<TextConfig> = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: '文本内容',
      renderProps: {
        allowClear: true,
        placeholder: '输入文本内容',
        autoFocus: true,
      },
    },
    fontSize: {
      type: 'number',
      title: '字体大小',
      default: 14,
      category: 'text',
    },
    fontWeight: {
      type: 'string',
      title: '字重',
      renderType: 'select',
      enum: ['normal', 'bold', '400', '500', '600', '700'],
      default: 'normal',
      category: 'text',
    },
    textColor: {
      type: 'string',
      title: '文本颜色',
      renderType: 'color',
      default: '#333333',
      category: 'text',
    },
    textAlign: {
      type: 'string',
      title: '对齐方式',
      renderType: 'radioGroup',
      enum: ['left', 'center', 'right', 'justify'],
      enumNames: ['左对齐', '居中', '右对齐', '两端对齐'],
      default: 'left',
      category: 'text',
    },
    lineHeight: {
      type: 'number',
      title: '行高',
      default: 1.5,
      category: 'text',
    },
  },
};

export const textModel: AssetConfigModel = {
  key: 'text',
  schema: () => textSchema,
  emitter: (config) => {
    return {
      props: {
        text: config.content.text,
      },
      style: {
        fontSize: config.content.fontSize,
        fontWeight: config.content.fontWeight,
        color: config.content.textColor,
        textAlign: config.content.textAlign,
        lineHeight: config.content.lineHeight,
        width: config.content.width,
        height: config.content.height,
      },
    };
  },
};
