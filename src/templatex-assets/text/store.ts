import { create } from 'zustand';
import type { TextConfig } from '@/types/component';

export const createTextStore = () =>
  create<{ config: TextConfig; setConfig: (config: TextConfig) => void }>((set) => ({
    config: {
      text: 'Hello TemplateX!',
      fontSize: 14,
      fontWeight: 'normal',
      textColor: '#333333',
      textAlign: 'left',
      lineHeight: 1.5,
      width: '100%',
      height: 'auto',
    },
    setConfig: (config) => set({ config }),
  }));
