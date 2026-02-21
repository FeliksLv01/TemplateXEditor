import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { TextComponent } from './Component';
import { textCodeEmitter } from './codeEmitter';
import { textModel } from './models';
import { createTextStore } from './store';

export const textAssetParams: ComponentAssetParams<any> = {
  id: 'Text',
  createStore: createTextStore,
  ui: {
    Component: TextComponent,
  },
  models: [textModel],
  defaultConfig: {
    text: 'Hello TemplateX!',
    fontSize: 14,
    fontWeight: 'normal',
    textColor: '#333333',
    textAlign: 'left',
    lineHeight: 1.5,
  },
  codeEmitter: textCodeEmitter as any,
};
