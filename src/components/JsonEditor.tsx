import React, { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';

interface JsonEditorProps {
  /** 当前 JSON 文本 */
  value: string;
  /** 文本变化回调 */
  onChange?: (value: string) => void;
  /** 是否只读 */
  readOnly?: boolean;
  /** 编辑器高度，默认 'auto' */
  height?: string;
  /** 最小高度 */
  minHeight?: string;
  /** 最大高度 */
  maxHeight?: string;
  /** placeholder 文本 */
  placeholder?: string;
}

/**
 * 通用 JSON 编辑器组件
 *
 * 基于 CodeMirror 6，提供：
 * - JSON 语法高亮
 * - 实时 lint 错误标注（行内红色波浪线 + 左侧 gutter 图标）
 * - 括号匹配、自动缩进
 * - 行号
 */
export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = 'auto',
  minHeight,
  maxHeight,
  placeholder,
}) => {
  const handleChange = useCallback(
    (val: string) => {
      onChange?.(val);
    },
    [onChange],
  );

  return (
    <CodeMirror
      value={value}
      onChange={handleChange}
      extensions={[json(), linter(jsonParseLinter()), lintGutter()]}
      readOnly={readOnly}
      editable={!readOnly}
      placeholder={placeholder}
      height={height}
      minHeight={minHeight}
      maxHeight={maxHeight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        bracketMatching: true,
        autocompletion: false,
        highlightActiveLine: !readOnly,
        highlightSelectionMatches: true,
      }}
      style={{
        fontSize: 12,
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    />
  );
};
