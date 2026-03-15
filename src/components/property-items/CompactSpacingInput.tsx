import { useRef, useState, useCallback } from 'react';
import { Form } from 'antd';

/**
 * 紧凑间距输入组
 * - 一行 4 个输入框，分别对应 Top / Right / Bottom / Left
 * - 每个输入框上方有方向标签 (T/R/B/L)
 */

interface SpacingRowProps {
  /** 前缀，如 "margin" 或 "padding" */
  prefix: 'margin' | 'padding';
  /** 标题 */
  title: string;
}

const DIRECTIONS = [
  { key: 'Top', label: 'T' },
  { key: 'Right', label: 'R' },
  { key: 'Bottom', label: 'B' },
  { key: 'Left', label: 'L' },
] as const;

// 受控输入框，Ant Design Form 通过 value/onChange 注入
const SpacingNumberInput = ({ value, onChange, label }: {
  value?: number;
  onChange?: (val: number | undefined) => void;
  label: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [localText, setLocalText] = useState('');
  const [editing, setEditing] = useState(false);

  const displayValue = editing ? localText : (value != null && value !== 0 ? String(value) : '');

  const handleFocus = () => {
    setFocused(true);
    setEditing(true);
    setLocalText(value != null ? String(value) : '');
  };

  const handleBlur = () => {
    setFocused(false);
    setEditing(false);
    const parsed = parseFloat(localText);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange?.(parsed);
    } else if (localText.trim() === '') {
      onChange?.(undefined);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setLocalText(value != null ? String(value) : '');
      inputRef.current?.blur();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const delta = e.key === 'ArrowUp' ? step : -step;
      const current = parseFloat(localText) || value || 0;
      const next = Math.max(0, current + delta);
      setLocalText(String(next));
      onChange?.(next);
    }
  }, [localText, value, onChange]);

  return (
    <div className="compact-spacing-cell">
      <span className="compact-spacing-dir-label">{label}</span>
      <input
        ref={inputRef}
        type="text"
        className={`compact-spacing-input ${focused ? 'focused' : ''}`}
        value={displayValue}
        placeholder="0"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => { setLocalText(e.target.value); }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

/** 一组间距输入（margin 或 padding） */
const SpacingRow = ({ prefix, title }: SpacingRowProps) => {
  return (
    <div className="compact-spacing-group">
      <span className="compact-spacing-title">{title}</span>
      <div className="compact-spacing-row">
        {DIRECTIONS.map(({ key, label }) => (
          <Form.Item key={key} name={`${prefix}${key}`} noStyle>
            <SpacingNumberInput label={label} />
          </Form.Item>
        ))}
      </div>
    </div>
  );
};

/**
 * 紧凑间距面板
 * 包含 Margin 和 Padding 两组输入
 */
export const CompactSpacingInput = () => {
  return (
    <div className="compact-spacing-panel">
      <SpacingRow prefix="margin" title="Margin" />
      <SpacingRow prefix="padding" title="Padding" />
    </div>
  );
};
