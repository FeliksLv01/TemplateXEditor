import { AppstoreOutlined, FontSizeOutlined, PictureOutlined, BorderOutlined, BarsOutlined } from '@ant-design/icons';
import type { ComponentDefinition } from '@/types/editor';
import { containerAssetParams } from '@/templatex-assets/container';
import { textAssetParams } from '@/templatex-assets/text';
import { imageAssetParams } from '@/templatex-assets/image';
import { buttonAssetParams } from '@/templatex-assets/button';
import { listAssetParams } from '@/templatex-assets/list';

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: 'container',
    name: 'Container',
    icon: <AppstoreOutlined />,
    canHaveChildren: true,
    defaultConfig: containerAssetParams.defaultConfig,
  },
  {
    type: 'text',
    name: 'Text',
    icon: <FontSizeOutlined />,
    canHaveChildren: false,
    defaultConfig: textAssetParams.defaultConfig,
  },
  {
    type: 'image',
    name: 'Image',
    icon: <PictureOutlined />,
    canHaveChildren: false,
    defaultConfig: imageAssetParams.defaultConfig,
  },
  {
    type: 'button',
    name: 'Button',
    icon: <BorderOutlined />,
    canHaveChildren: false,
    defaultConfig: buttonAssetParams.defaultConfig,
  },
  {
    type: 'list',
    name: 'List',
    icon: <BarsOutlined />,
    canHaveChildren: true,
    allowChildTypes: ['container', 'text', 'image', 'button'],
    defaultConfig: listAssetParams.defaultConfig,
  },
];

export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  return COMPONENT_DEFINITIONS.find(def => def.type === type);
};

export const canAddChildToParent = (parentType: string, childType: string): boolean => {
  const parentDef = getComponentDefinition(parentType);
  if (!parentDef || !parentDef.canHaveChildren) return false;
  
  if (parentType === 'list') {
    return parentDef.allowChildTypes?.includes(childType) ?? false;
  }
  
  return true;
};
