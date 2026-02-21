export interface DSLComponent {
  type: string;
  id: string;
  style?: Record<string, any>;
  props?: Record<string, any>;
  children?: DSLComponent[];
}

export interface TemplateXDSL {
  type: string;
  id: string;
  style?: Record<string, any>;
  props?: Record<string, any>;
  children?: DSLComponent[];
}
