import { create } from 'zustand';
import type { ContainerConfig } from '@/types/component';

export const createContainerStore = () =>
  create<{ config: ContainerConfig; setConfig: (config: ContainerConfig) => void }>((set) => ({
    config: {
      flexDirection: 'column',
      padding: 16,
      backgroundColor: '#FFFFFF',
      width: '100%',
      height: 'auto',
    },
    setConfig: (config) => set({ config }),
  }));
