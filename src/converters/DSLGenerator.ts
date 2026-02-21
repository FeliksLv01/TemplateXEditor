import type { DSLComponent } from '@/types/dsl';

export class DSLGenerator {
  static generateFromStore(
    store: any,
    componentType: string
  ): DSLComponent {
    const config = store.getState().config;
    const emitted = this.applyEmitter(componentType, config);
    
    return {
      type: componentType.toLowerCase(),
      id: `${componentType.toLowerCase()}_${Date.now()}`,
      props: emitted.props || {},
      style: emitted.style || {},
      children: emitted.children || undefined,
    };
  }
  
  static applyEmitter(componentType: string, config: any) {
    switch (componentType) {
      case 'Container':
        return {
          style: {
            flexDirection: config.flexDirection,
            justifyContent: config.justifyContent,
            alignItems: config.alignItems,
            flexWrap: config.flexWrap,
            flexGrow: config.flexGrow,
            flexShrink: config.flexShrink,
            flexBasis: config.flexBasis,
            width: config.width,
            height: config.height,
            minWidth: config.minWidth,
            minHeight: config.minHeight,
            maxWidth: config.maxWidth,
            maxHeight: config.maxHeight,
            aspectRatio: config.aspectRatio,
            margin: config.margin,
            marginTop: config.marginTop,
            marginLeft: config.marginLeft,
            marginBottom: config.marginBottom,
            marginRight: config.marginRight,
            padding: config.padding,
            paddingTop: config.paddingTop,
            paddingLeft: config.paddingLeft,
            paddingBottom: config.paddingBottom,
            paddingRight: config.paddingRight,
            backgroundColor: config.backgroundColor,
            cornerRadius: config.cornerRadius,
            borderWidth: config.borderWidth,
            borderColor: config.borderColor,
            shadowColor: config.shadowColor,
            shadowOffset: config.shadowOffset,
            shadowRadius: config.shadowRadius,
            shadowOpacity: config.shadowOpacity,
            opacity: config.opacity,
            display: config.display,
            visibility: config.visibility,
            overflow: config.overflow,
          },
          children: [],
        };
      
      case 'Text':
        return {
          props: {
            text: config.text,
          },
          style: {
            fontSize: config.fontSize,
            fontWeight: config.fontWeight,
            color: config.textColor,
            textAlign: config.textAlign,
            lineHeight: config.lineHeight,
            letterSpacing: config.letterSpacing,
            numberOfLines: config.numberOfLines,
            width: config.width,
            height: config.height,
          },
        };
      
      case 'Image':
        return {
          props: {
            src: config.src,
          },
          style: {
            width: config.width,
            height: config.height,
            objectFit: config.objectFit,
            cornerRadius: config.cornerRadius,
            backgroundColor: config.backgroundColor,
          },
        };
      
      case 'Button':
        return {
          props: {
            title: config.title,
          },
          style: {
            backgroundColor: config.backgroundColor,
            cornerRadius: config.cornerRadius,
            color: config.textColor,
            fontWeight: config.fontWeight,
            width: config.width,
            height: config.height,
          },
        };
      
      default:
        return {};
    }
  }
  
  static exportToString(components: DSLComponent[]): string {
    return JSON.stringify(components, null, 2);
  }
  
  static exportToFile(components: DSLComponent[], filename: string = 'template.json'): void {
    const json = this.exportToString(components);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
