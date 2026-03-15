import { useRef, useState, useCallback, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  /** 拖拽手柄在哪一侧 */
  handleSide: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 可拖拽调整宽度的面板，类似 Figma 侧边栏
 * handleSide="right" → 手柄在右侧（左侧面板向右拖拽扩大）
 * handleSide="left"  → 手柄在左侧（右侧面板向左拖拽扩大）
 */
const ResizablePanel = ({
  children,
  defaultWidth,
  minWidth = 120,
  maxWidth = 600,
  handleSide,
  className,
  style,
}: ResizablePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      // 右侧手柄：鼠标右移 → 宽度增加；左侧手柄：鼠标左移 → 宽度增加
      const newWidth = handleSide === 'right'
        ? startWidth.current + delta
        : startWidth.current - delta;
      setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleSide, minWidth, maxWidth]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
      {/* 拖拽手柄 */}
      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 5,
          cursor: 'col-resize',
          zIndex: 10,
          ...(handleSide === 'right' ? { right: -2 } : { left: -3 }),
        }}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default ResizablePanel;
