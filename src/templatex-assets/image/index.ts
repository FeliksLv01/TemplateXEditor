import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { ImageComponent } from './Component';
import { imageCodeEmitter } from './codeEmitter';
import { imageModel } from './models';
import { createImageStore } from './store';

export const imageAssetParams: ComponentAssetParams<any> = {
  id: 'Image',
  createStore: createImageStore,
  ui: {
    Component: ImageComponent,
  },
  models: [imageModel],
  defaultConfig: {
    props: {
      src: 'https://via.placeholder.com/150',
    },
    style: {
      width: 150,
      height: 150,
      objectFit: 'cover',
    },
  },
  codeEmitter: imageCodeEmitter as any,
};
