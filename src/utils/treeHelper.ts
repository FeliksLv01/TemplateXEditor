import type { DSLComponent } from '@/types/editor';

export function findComponentById(root: DSLComponent | null, id: string): DSLComponent | null {
  if (!root) return null;
  if (root.id === id) return root;
  
  if (root.children) {
    for (const child of root.children) {
      const found = findComponentById(child, id);
      if (found) return found;
    }
  }
  
  return null;
}

export function findParentById(
  root: DSLComponent | null,
  id: string,
  parent: DSLComponent | null = null
): DSLComponent | null {
  if (!root) return null;
  if (root.id === id) return parent;
  
  if (root.children) {
    for (const child of root.children) {
      const found = findParentById(child, id, root);
      if (found) return found;
    }
  }
  
  return null;
}

export function findPathById(root: DSLComponent | null, id: string): string[] {
  if (!root) return [];
  if (root.id === id) return [root.id];
  
  if (root.children) {
    for (const child of root.children) {
      const path = findPathById(child, id);
      if (path.length > 0) return [root.id, ...path];
    }
  }
  
  return [];
}

export function deepCloneComponent(component: DSLComponent): DSLComponent {
  return {
    ...component,
    id: generateId(component.type),
    children: component.children?.map(child => deepCloneComponent(child)),
  };
}

export function removeComponentFromParent(
  root: DSLComponent,
  componentId: string
): DSLComponent | null {
  if (root.id === componentId) {
    return null;
  }
  
  if (root.children) {
    const filteredChildren = root.children
      .map(child => removeComponentFromParent(child, componentId))
      .filter(child => child !== null) as DSLComponent[];
    
    return {
      ...root,
      children: filteredChildren,
    };
  }
  
  return root;
}

export function addComponentToParent(
  root: DSLComponent,
  parentId: string,
  component: DSLComponent,
  index?: number
): DSLComponent {
  if (root.id === parentId) {
    const children = root.children ? [...root.children] : [];
    if (index !== undefined && index >= 0 && index <= children.length) {
      children.splice(index, 0, component);
    } else {
      children.push(component);
    }
    return {
      ...root,
      children,
    };
  }
  
  if (root.children) {
    const updatedChildren = root.children.map(child =>
      addComponentToParent(child, parentId, component, index)
    );
    return {
      ...root,
      children: updatedChildren,
    };
  }
  
  return root;
}

export function updateComponentById(
  root: DSLComponent,
  componentId: string,
  updates: Partial<DSLComponent>
): DSLComponent {
  if (root.id === componentId) {
    return {
      ...root,
      ...updates,
    };
  }
  
  if (root.children) {
    const updatedChildren = root.children.map(child =>
      updateComponentById(child, componentId, updates)
    );
    return {
      ...root,
      children: updatedChildren,
    };
  }
  
  return root;
}

export function moveComponent(
  root: DSLComponent,
  componentId: string,
  newParentId: string,
  newIndex?: number
): DSLComponent {
  const component = findComponentById(root, componentId);
  const oldParent = findParentById(root, componentId);
  
  if (!component || !oldParent) return root;
  
  const rootWithoutComponent = removeComponentFromParent(root, componentId) as DSLComponent;
  
  return addComponentToParent(rootWithoutComponent, newParentId, component, newIndex);
}

export function convertToTreeData(component: DSLComponent): any {
  return {
    title: `${component.type} (${component.id.split('_')[0]})`,
    key: component.id,
    children: component.children?.map(child => convertToTreeData(child)),
    data: component,
  };
}
