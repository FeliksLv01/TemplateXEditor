import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { ListComponent } from './Component';
import { listCodeEmitter } from './codeEmitter';
import { listModel } from './models';
import { createListStore } from './store';

export const listAssetParams: ComponentAssetParams<any> = {
  id: 'List',
  createStore: createListStore,
  ui: {
    Component: ListComponent,
  },
  models: [listModel],
  defaultConfig: {
    direction: 'vertical',
    columns: 1,
    rows: 1,
    rowSpacing: 8,
    columnSpacing: 8,
    showsIndicator: true,
    bounces: true,
    isPagingEnabled: false,
    itemWidth: 100,
    itemHeight: 100,
    estimatedItemHeight: 100,
    autoAdjustHeight: false,
    items: '${items}',
    width: '100%',
    height: 400,
  },
  codeEmitter: listCodeEmitter as any,
};
