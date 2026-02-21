import { create } from 'zustand';
import type { ListConfig } from '@/types/component';

export const createListStore = () =>
  create<{ config: ListConfig; setConfig: (config: ListConfig) => void }>((set) => ({
    config: {
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
    setConfig: (config) => set({ config }),
  }));
