import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';
import type { ImageConfig } from '@/types/component';

export const imageSchema: JSONSchema<ImageConfig> = {
  type: 'object',
  properties: {
    src: {
      type: 'string',
      title: '图片地址',
      renderProps: {
        placeholder: '输入图片URL',
      },
    },
    width: {
      type: 'string',
      title: '宽度',
      default: 'auto',
      category: 'size',
    },
    height: {
      type: 'string',
      title: '高度',
      default: 'auto',
      category: 'size',
    },
    objectFit: {
      type: 'string',
      title: '填充方式',
      renderType: 'select',
      enum: ['fill', 'contain', 'cover', 'none'],
      enumNames: ['填充', '包含', '覆盖', '原始'],
      default: 'cover',
      category: 'visual',
    },
    cornerRadius: {
      type: 'number',
      title: '圆角',
      default: 0,
      category: 'visual',
    },
  },
};

export const imageModel: AssetConfigModel = {
  key: 'image',
  schema: () => imageSchema,
  emitter: (config) => {
    return {
      props: {
        src: config.content.src,
      },
      style: {
        width: config.content.width,
        height: config.content.height,
        objectFit: config.content.objectFit,
        cornerRadius: config.content.cornerRadius,
      },
    };
  },
};
