import { InputNumber, Button } from 'antd';

interface SizeInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
}

export const SizeInput = ({ value, onChange }: SizeInputProps) => {
  // 解析当前值的类型
  const parseValue = (val: any): { type: 'auto' | 'percent' | 'fixed'; num: number } => {
    if (val === 'auto' || val === undefined || val === null) {
      return { type: 'auto', num: 0 };
    }
    if (typeof val === 'string') {
      if (val === 'auto') return { type: 'auto', num: 0 };
      if (val.endsWith('%')) {
        const num = parseFloat(val);
        return { type: 'percent', num: isNaN(num) ? 100 : num };
      }
      const num = parseFloat(val);
      return { type: 'fixed', num: isNaN(num) ? 0 : num };
    }
    if (typeof val === 'number') {
      return { type: 'fixed', num: val };
    }
    return { type: 'auto', num: 0 };
  };

  const { type, num } = parseValue(value);

  // 循环切换: auto -> % -> px -> auto
  const handleToggleType = () => {
    if (type === 'auto') {
      onChange?.('100%');
    } else if (type === 'percent') {
      onChange?.(100);
    } else {
      onChange?.('auto');
    }
  };

  const handleNumChange = (newNum: number | null) => {
    if (newNum === null) return;
    if (type === 'percent') {
      onChange?.(`${newNum}%`);
    } else {
      onChange?.(newNum);
    }
  };

  // 按钮显示的文字
  const buttonLabel = type === 'auto' ? 'Auto' : type === 'percent' ? '%' : 'px';

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button 
        size="small" 
        onClick={handleToggleType}
        style={{ width: 50, flexShrink: 0 }}
      >
        {buttonLabel}
      </Button>
      {type !== 'auto' && (
        <InputNumber
          size="small"
          value={num}
          onChange={handleNumChange}
          style={{ flex: 1 }}
          min={0}
        />
      )}
    </div>
  );
};
