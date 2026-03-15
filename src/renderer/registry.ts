import type { TXComponentRender } from './types';

/**
 * 组件注册表 — type string → React render component
 *
 * 类似 iOS 端的 ComponentRegistry，但更轻量：
 * 只做 type → React FC 的映射，不涉及 factory / clone 等。
 */
class ComponentRegistry {
  private components = new Map<string, TXComponentRender>();

  register(type: string, render: TXComponentRender): void {
    this.components.set(type, render);
  }

  get(type: string): TXComponentRender | undefined {
    return this.components.get(type);
  }

  has(type: string): boolean {
    return this.components.has(type);
  }

  /** 注册的类型列表 */
  types(): string[] {
    return Array.from(this.components.keys());
  }
}

export const registry = new ComponentRegistry();
