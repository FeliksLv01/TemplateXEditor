import { create } from 'zustand';
import type { ImageConfig } from '@/types/component';

export const createImageStore = () =>
  create<{ config: ImageConfig; setConfig: (config: ImageConfig) => void }>((set) => ({
    config: {
      src: 'https://via.placeholder.com/150',
      width: 150,
      height: 150,
      objectFit: 'cover',
      cornerRadius: 0,
    },
    setConfig: (config) => set({ config }),
  }));
