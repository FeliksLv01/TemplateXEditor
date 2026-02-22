import type { DSLComponent } from '@/types/dsl';

export class DSLParser {
  static parse(jsonString: string): DSLComponent {
    try {
      const parsed = JSON.parse(jsonString);
      return this.validateAndTransform(parsed);
    } catch (error) {
      throw new Error(`Invalid DSL JSON: ${error}`);
    }
  }
  
  static parseFromFile(file: File): Promise<DSLComponent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const component = this.parse(content);
          resolve(component);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
  
  private static validateAndTransform(parsed: any): DSLComponent {
    if (!parsed.type) {
      throw new Error('DSL component must have a "type" property');
    }
    
    const validTypes = ['container', 'text', 'image', 'button'];
    const normalizedType = parsed.type.toLowerCase();
    
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Invalid component type: ${parsed.type}. Valid types are: ${validTypes.join(', ')}`);
    }
    
    const component: DSLComponent = {
      type: normalizedType,
      id: parsed.id || `${normalizedType}_${Date.now()}`,
      props: parsed.props || {},
      style: parsed.style || {},
      children: parsed.children || undefined,
    };
    
    return component;
  }
  
  static parseToConfig(component: DSLComponent): any {
    const baseConfig: any = {
      ...component.props,
      ...component.style,
    };
    
    switch (component.type) {
      case 'container':
        return {
          flexDirection: baseConfig.flexDirection || 'column',
          justifyContent: baseConfig.justifyContent || 'flex-start',
          alignItems: baseConfig.alignItems || 'flex-start',
          flexWrap: baseConfig.flexWrap || 'nowrap',
          flexGrow: baseConfig.flexGrow || 0,
          flexShrink: baseConfig.flexShrink || 1,
          flexBasis: baseConfig.flexBasis || 'auto',
          width: baseConfig.width || '100%',
          height: baseConfig.height || 'auto',
          minWidth: baseConfig.minWidth || undefined,
          minHeight: baseConfig.minHeight || undefined,
          maxWidth: baseConfig.maxWidth || undefined,
          maxHeight: baseConfig.maxHeight || undefined,
          aspectRatio: baseConfig.aspectRatio || undefined,
          margin: baseConfig.margin || 0,
          marginTop: baseConfig.marginTop || undefined,
          marginLeft: baseConfig.marginLeft || undefined,
          marginBottom: baseConfig.marginBottom || undefined,
          marginRight: baseConfig.marginRight || undefined,
          padding: baseConfig.padding || 16,
          paddingTop: baseConfig.paddingTop || undefined,
          paddingLeft: baseConfig.paddingLeft || undefined,
          paddingBottom: baseConfig.paddingBottom || undefined,
          paddingRight: baseConfig.paddingRight || undefined,
          backgroundColor: baseConfig.backgroundColor || '#FFFFFF',
          cornerRadius: baseConfig.cornerRadius || 0,
          borderWidth: baseConfig.borderWidth || 0,
          borderColor: baseConfig.borderColor || '#000000',
          shadowColor: baseConfig.shadowColor || '#000000',
          shadowOffset: baseConfig.shadowOffset || { width: 0, height: 0 },
          shadowRadius: baseConfig.shadowRadius || 0,
          shadowOpacity: baseConfig.shadowOpacity || 0,
          opacity: baseConfig.opacity || 1,
          display: baseConfig.display || 'flex',
          visibility: baseConfig.visibility || 'visible',
          overflow: baseConfig.overflow || 'visible',
        };
      
      case 'text':
        return {
          text: baseConfig.text || '',
          fontSize: baseConfig.fontSize || 14,
          fontWeight: baseConfig.fontWeight || 'normal',
          textColor: baseConfig.color || '#333333',
          textAlign: baseConfig.textAlign || 'left',
          lineHeight: baseConfig.lineHeight || 1.5,
          letterSpacing: baseConfig.letterSpacing || 0,
          numberOfLines: baseConfig.numberOfLines || undefined,
          width: baseConfig.width || '100%',
          height: baseConfig.height || 'auto',
        };
      
      case 'image':
        return {
          src: baseConfig.src || '',
          width: baseConfig.width || '100%',
          height: baseConfig.height || 'auto',
          objectFit: baseConfig.objectFit || 'cover',
          cornerRadius: baseConfig.cornerRadius || 0,
          backgroundColor: baseConfig.backgroundColor || '#FFFFFF',
        };
      
      case 'button':
        return {
          title: baseConfig.title || 'Button',
          backgroundColor: baseConfig.backgroundColor || '#1890FF',
          cornerRadius: baseConfig.cornerRadius || 8,
          textColor: baseConfig.color || '#FFFFFF',
          fontWeight: baseConfig.fontWeight || '500',
          width: baseConfig.width || 'auto',
          height: baseConfig.height || 44,
        };
      
      default:
        return {};
    }
  }
  
  static parseMultiple(jsonString: string): DSLComponent[] {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => this.validateAndTransform(item));
      } else {
        return [this.validateAndTransform(parsed)];
      }
    } catch (error) {
      throw new Error(`Invalid DSL JSON: ${error}`);
    }
  }
}
