import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';
import type { ContainerConfig } from '@/types/component';

export const containerSchema: JSONSchema<ContainerConfig> = {
  type: 'object',
  properties: {
    flexDirection: {
      type: 'string',
      title: 'Flex 方向',
      renderType: 'radioGroup',
      enum: ['row', 'column'],
      enumNames: ['横向', '纵向'],
      default: 'column',
      category: 'layout',
    },
    justifyContent: {
      type: 'string',
      title: '主轴对齐',
      renderType: 'select',
      enum: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      enumNames: ['起始', '结束', '居中', '两端对齐', '分散对齐', '完全分散'],
      default: 'flex-start',
      category: 'layout',
    },
    alignItems: {
      type: 'string',
      title: '交叉轴对齐',
      renderType: 'select',
      enum: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
      enumNames: ['起始', '结束', '居中', '拉伸', '基线'],
      default: 'flex-start',
      category: 'layout',
    },
    padding: {
      type: 'number',
      title: '内边距',
      default: 16,
      category: 'spacing',
    },
    margin: {
      type: 'number',
      title: '外边距',
      default: 0,
      category: 'spacing',
    },
    backgroundColor: {
      type: 'string',
      title: '背景色',
      renderType: 'color',
      default: '#FFFFFF',
      category: 'visual',
    },
    cornerRadius: {
      type: 'number',
      title: '圆角',
      default: 0,
      category: 'visual',
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
      default: 'auto',
      category: 'size',
    },
    opacity: {
      type: 'number',
      title: '透明度',
      renderType: 'slider',
      default: 1,
      category: 'visual',
    },
  },
};

export const containerModel: AssetConfigModel = {
  key: 'container',
  schema: () => containerSchema,
  emitter: (config) => {
    return {
      style: {
        flexDirection: config.content.flexDirection,
        justifyContent: config.content.justifyContent,
        alignItems: config.content.alignItems,
        padding: config.content.padding,
        margin: config.content.margin,
        width: config.content.width,
        height: config.content.height,
        backgroundColor: config.content.backgroundColor,
        cornerRadius: config.content.cornerRadius,
        opacity: config.content.opacity,
      },
    };
  },
};
