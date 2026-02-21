import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { ContainerComponent } from './Component';
import { containerCodeEmitter } from './codeEmitter';
import { containerModel } from './models';
import { createContainerStore } from './store';

export const containerAssetParams: ComponentAssetParams<any> = {
  id: 'Container',
  createStore: createContainerStore,
  ui: {
    Component: ContainerComponent,
  },
  models: [containerModel],
  defaultConfig: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 'auto',
  },
  codeEmitter: containerCodeEmitter as any,
};
