import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { EditorState, DSLComponent } from '@/types/editor';
import { generateId } from '@/utils/idGenerator';
import { COMPONENT_DEFINITIONS } from '@/config/componentRegistry';
import {
  findComponentById,
  findParentById,
  removeComponentFromParent,
  addComponentToParent,
  updateComponentById,
  deepCloneComponent,
  moveComponent,
} from '@/utils/treeHelper';
import { cleanComponentForExport } from '@/utils/dslCleaner';

// 清理存储中的组件数据（修复旧版本存储的颜色对象格式）
const cleanStoredComponent = (component: DSLComponent | null): DSLComponent | null => {
  if (!component) return null;
  return cleanComponentForExport(component);
};

const cleanStoredHistory = (history: { past: (DSLComponent | null)[]; present: DSLComponent | null; future: (DSLComponent | null)[] }) => {
  return {
    past: history.past.map(cleanStoredComponent),
    present: cleanStoredComponent(history.present),
    future: history.future.map(cleanStoredComponent),
  };
};

const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        rootComponent: null,
        selectedComponentId: null,
        history: {
          past: [],
          present: null,
          future: [],
        },
        clipboard: null,
        expandedKeys: [],

        setRootComponent: (component) => {
          set(
            (state) => ({
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: component,
                future: [],
              },
            }),
            false,
            'setRootComponent'
          );
        },

        addComponent: (parentId, component, index) => {
          const { rootComponent } = get();
          
          if (!parentId && !rootComponent) {
            const newComponent = {
              ...component,
              id: component.id || generateId(component.type),
            };
            set(
              (state) => ({
                rootComponent: newComponent,
                history: {
                  past: [...state.history.past, state.history.present].filter(Boolean),
                  present: newComponent,
                  future: [],
                },
                selectedComponentId: newComponent.id,
                expandedKeys: [...state.expandedKeys, newComponent.id],
              }),
              false,
              'addComponent'
            );
            return;
          }
          
          if (!parentId || !rootComponent) return;
          
          const parent = findComponentById(rootComponent, parentId);
          const parentDef = COMPONENT_DEFINITIONS.find((def) => def.type === parent?.type);
          
          if (!parent || !parentDef?.canHaveChildren) return;
          
          if (parent.type === 'list' && !parentDef.allowChildTypes?.includes(component.type)) {
            return;
          }
          
          const newComponent = {
            ...component,
            id: component.id || generateId(component.type),
          };
          
          const newRoot = addComponentToParent(rootComponent, parentId, newComponent, index);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
              selectedComponentId: newComponent.id,
              expandedKeys: [...state.expandedKeys, newComponent.id, parentId],
            }),
            false,
            'addComponent'
          );
        },

        removeComponent: (id) => {
          const { rootComponent, selectedComponentId } = get();
          if (!rootComponent) return;
          
          // 如果删除的是根组件，直接清空
          if (rootComponent.id === id) {
            set(
              (state) => ({
                rootComponent: null,
                history: {
                  past: [...state.history.past, state.history.present].filter(Boolean),
                  present: null,
                  future: [],
                },
                selectedComponentId: null,
                expandedKeys: [],
              }),
              false,
              'removeComponent'
            );
            return;
          }
          
          const newRoot = removeComponentFromParent(rootComponent, id);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
              selectedComponentId: selectedComponentId === id ? null : selectedComponentId,
            }),
            false,
            'removeComponent'
          );
        },

        updateComponent: (id, updates) => {
          const { rootComponent } = get();
          if (!rootComponent) return;
          
          const newRoot = updateComponentById(rootComponent, id, updates);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
            }),
            false,
            'updateComponent'
          );
        },

        moveComponent: (componentId, newParentId, newIndex) => {
          const { rootComponent } = get();
          if (!rootComponent) return;
          
          const newRoot = moveComponent(rootComponent, componentId, newParentId, newIndex);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
            }),
            false,
            'moveComponent'
          );
        },

        selectComponent: (id) => {
          set({ selectedComponentId: id }, false, 'selectComponent');
        },

        undo: () => {
          const { history } = get();
          if (history.past.length === 0) return;
          
          const previous = history.past[history.past.length - 1];
          const newPast = history.past.slice(0, history.past.length - 1);
          
          set(
            {
              rootComponent: previous,
              history: {
                past: newPast,
                present: previous,
                future: [history.present, ...history.future].filter(Boolean),
              },
            },
            false,
            'undo'
          );
        },

        redo: () => {
          const { history } = get();
          if (history.future.length === 0) return;
          
          const next = history.future[0];
          const newFuture = history.future.slice(1);
          
          set(
            {
              rootComponent: next,
              history: {
                past: [...history.past, history.present].filter(Boolean),
                present: next,
                future: newFuture,
              },
            },
            false,
            'redo'
          );
        },

        copyComponent: (id) => {
          const { rootComponent } = get();
          const component = findComponentById(rootComponent, id);
          if (!component) return;
          
          set({ clipboard: deepCloneComponent(component) }, false, 'copyComponent');
        },

        pasteComponent: (parentId, index) => {
          const { clipboard, rootComponent } = get();
          if (!clipboard) return;
          
          if (!parentId && !rootComponent) {
            const newComponent = deepCloneComponent(clipboard);
            get().setRootComponent(newComponent);
            return;
          }
          
          if (!parentId || !rootComponent) return;
          
          const parent = findComponentById(rootComponent, parentId);
          const parentDef = COMPONENT_DEFINITIONS.find((def) => def.type === parent?.type);
          
          if (!parent || !parentDef?.canHaveChildren) return;
          
          if (parent.type === 'list' && !parentDef.allowChildTypes?.includes(clipboard.type)) {
            return;
          }
          
          const newComponent = deepCloneComponent(clipboard);
          const newRoot = addComponentToParent(rootComponent, parentId, newComponent, index);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
              selectedComponentId: newComponent.id,
              expandedKeys: [...state.expandedKeys, newComponent.id, parentId],
            }),
            false,
            'pasteComponent'
          );
        },

        duplicateComponent: (id) => {
          const { rootComponent } = get();
          if (!rootComponent) return;
          
          const component = findComponentById(rootComponent, id);
          if (!component) return;
          
          const parent = findParentById(rootComponent, id);
          if (!parent) return;
          
          const newComponent = deepCloneComponent(component);
          const parentChildren = parent.children || [];
          const index = parentChildren.findIndex((child) => child.id === id) + 1;
          
          const newRoot = addComponentToParent(rootComponent, parent.id, newComponent, index);
          
          set(
            (state) => ({
              rootComponent: newRoot,
              history: {
                past: [...state.history.past, state.history.present].filter(Boolean),
                present: newRoot,
                future: [],
              },
              selectedComponentId: newComponent.id,
              expandedKeys: [...state.expandedKeys, newComponent.id, parent.id],
            }),
            false,
            'duplicateComponent'
          );
        },

        toggleExpand: (id) => {
          set(
            (state) => ({
              expandedKeys: state.expandedKeys.includes(id)
                ? state.expandedKeys.filter((key) => key !== id)
                : [...state.expandedKeys, id],
            }),
            false,
            'toggleExpand'
          );
        },

        setExpandedKeys: (keys) => {
          set({ expandedKeys: keys }, false, 'setExpandedKeys');
        },
      }),
      {
        name: 'templatex-editor-storage',
        partialize: (state) => ({
          rootComponent: state.rootComponent,
          history: state.history,
        }),
        // 从存储中恢复数据后清理颜色格式
        onRehydrateStorage: () => (state) => {
          if (state) {
            // 清理 rootComponent 中的颜色对象
            if (state.rootComponent) {
              state.rootComponent = cleanStoredComponent(state.rootComponent);
            }
            // 清理 history 中的颜色对象
            if (state.history) {
              state.history = cleanStoredHistory(state.history);
            }
          }
        },
      }
    )
  )
);

export default useEditorStore;
