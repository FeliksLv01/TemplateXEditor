import { create } from 'zustand';
import type { ButtonConfig } from '@/types/component';

export const createButtonStore = () =>
  create<{ config: ButtonConfig; setConfig: (config: ButtonConfig) => void }>((set) => ({
    config: {
      title: 'Button',
      backgroundColor: '#1890FF',
      cornerRadius: 8,
      textColor: '#FFFFFF',
      fontWeight: '500',
      width: 'auto',
      height: 44,
    },
    setConfig: (config) => set({ config }),
  }));
