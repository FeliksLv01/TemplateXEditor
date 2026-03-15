import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * 紧凑尺寸输入框
 * - 输入框右侧内嵌单位切换（Auto / px / %）
 * - 点击单位文字循环切换
 * - 紧凑设计，适合双列布局
 */

interface CompactSizeInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  /** 左侧标签，如 "W" "H" "Min W" 等 */
  label?: string;
  /** 占位符 */
  placeholder?: string;
}

type SizeMode = 'auto' | 'px' | 'percent';

function parseValue(val: unknown): { mode: SizeMode; num: number } {
  if (val === 'auto' || val === undefined || val === null || val === '') {
    return { mode: 'auto', num: 0 };
  }
  if (typeof val === 'string') {
    if (val === 'auto') return { mode: 'auto', num: 0 };
    if (val.endsWith('%')) {
      const num = parseFloat(val);
      return { mode: 'percent', num: isNaN(num) ? 100 : num };
    }
    const num = parseFloat(val);
    if (!isNaN(num)) return { mode: 'px', num };
    return { mode: 'auto', num: 0 };
  }
  if (typeof val === 'number') {
    return { mode: 'px', num: val };
  }
  return { mode: 'auto', num: 0 };
}

export const CompactSizeInput = ({ value, onChange, label, placeholder }: CompactSizeInputProps) => {
  const { mode, num } = parseValue(value);

  // 本地编辑状态
  const [editing, setEditing] = useState(false);
  const [localText, setLocalText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部值变化
  useEffect(() => {
    if (!editing) {
      setLocalText(mode === 'auto' ? '' : String(num));
    }
  }, [mode, num, editing]);

  // 循环切换: auto → px → % → auto
  const handleUnitClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'auto') {
      onChange?.(100); // auto → px(100)
    } else if (mode === 'px') {
      onChange?.(`${num || 100}%`); // px → %
    } else {
      onChange?.('auto'); // % → auto
    }
  }, [mode, num, onChange]);

  const unitLabel = mode === 'auto' ? 'Auto' : mode === 'percent' ? '%' : 'px';

  const handleFocus = () => {
    setEditing(true);
    setLocalText(mode === 'auto' ? '' : String(num));
  };

  const handleBlur = () => {
    setEditing(false);
    if (localText.trim() === '' && mode !== 'auto') {
      return;
    }
    const parsed = parseFloat(localText);
    if (!isNaN(parsed)) {
      if (mode === 'percent') {
        onChange?.(`${parsed}%`);
      } else {
        onChange?.(parsed);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setLocalText(mode === 'auto' ? '' : String(num));
      inputRef.current?.blur();
    }
    // 上下箭头调整数值
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const delta = e.key === 'ArrowUp' ? step : -step;
      const current = parseFloat(localText) || 0;
      const next = Math.max(0, current + delta);
      setLocalText(String(next));
      if (mode === 'percent') {
        onChange?.(`${next}%`);
      } else if (mode !== 'auto') {
        onChange?.(next);
      }
    }
  };

  const isAuto = mode === 'auto';

  return (
    <div className="compact-size-input">
      {label && <span className="compact-size-label">{label}</span>}
      <div className={`compact-size-field ${isAuto ? 'is-auto' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="compact-size-number"
          value={isAuto ? '' : (editing ? localText : String(num))}
          placeholder={isAuto ? 'Auto' : (placeholder || '0')}
          readOnly={isAuto}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setLocalText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span
          className="compact-size-unit"
          onClick={handleUnitClick}
          title="点击切换单位"
        >
          {unitLabel}
        </span>
      </div>
    </div>
  );
};
