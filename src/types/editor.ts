import type { ReactNode } from 'react';

export interface EditorState {
  // 组件树根节点
  rootComponent: DSLComponent | null;

  // 当前选中组件 ID
  selectedComponentId: string | null;

  // 历史记录
  history: {
    past: (DSLComponent | null)[];
    present: DSLComponent | null;
    future: (DSLComponent | null)[];
  };

  // 剪贴板
  clipboard: DSLComponent | null;

  // 组件树展开状态
  expandedKeys: string[];

  // Actions
  setRootComponent: (component: DSLComponent | null) => void;
  addComponent: (parentId: string | null, component: DSLComponent, index?: number) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<DSLComponent>) => void;
  moveComponent: (componentId: string, newParentId: string, newIndex?: number) => void;
  selectComponent: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  copyComponent: (id: string) => void;
  pasteComponent: (parentId: string | null, index?: number) => void;
  duplicateComponent: (id: string) => void;
  toggleExpand: (id: string) => void;
  setExpandedKeys: (keys: string[]) => void;
}

export interface DSLComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  style: Record<string, any>;
  children?: DSLComponent[];
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: ReactNode;
  canHaveChildren: boolean;
  allowChildTypes?: string[];
  defaultConfig: Record<string, any>;
}

export interface TreeDataNode {
  title: string;
  key: string;
  children?: TreeDataNode[];
  isLeaf?: boolean;
  data: DSLComponent;
}
