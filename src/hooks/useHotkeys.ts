import { useEffect } from 'react';
import useEditorStore from '@/store/editorStore';

export const useHotkeys = () => {
  const { undo, redo, copyComponent, removeComponent, selectedComponentId, pasteComponent } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (ctrlOrCmd && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (ctrlOrCmd && e.key === 'c') {
        e.preventDefault();
        if (selectedComponentId) {
          copyComponent(selectedComponentId);
        }
      } else if (ctrlOrCmd && e.key === 'v') {
        e.preventDefault();
        pasteComponent(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        if (selectedComponentId) {
          removeComponent(selectedComponentId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copyComponent, removeComponent, selectedComponentId, pasteComponent]);
};

export default useHotkeys;
