import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { ButtonComponent } from './Component';
import { buttonCodeEmitter } from './codeEmitter';
import { buttonModel } from './models';
import { createButtonStore } from './store';

export const buttonAssetParams: ComponentAssetParams<any> = {
  id: 'Button',
  createStore: createButtonStore,
  ui: {
    Component: ButtonComponent,
  },
  models: [buttonModel],
  defaultConfig: {
    title: 'Button',
    backgroundColor: '#1890FF',
    cornerRadius: 8,
    textColor: '#FFFFFF',
    fontWeight: '500',
    width: 'auto',
    height: 44,
  },
  codeEmitter: buttonCodeEmitter as any,
};
