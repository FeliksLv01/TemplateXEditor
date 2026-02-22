import { Form, InputNumber } from 'antd';

export const BoxModelInput = () => {
  const boxInputStyle = {
    width: 40,
    textAlign: 'center' as const,
    backgroundColor: 'transparent',
    border: 'none',
  };

  return (
    <div style={{ padding: '8px 0' }}>
      {/* 盒子模型可视化 */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffd6a5',
          padding: '20px',
          borderRadius: 4,
        }}
      >
        {/* Margin 标签 */}
        <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 10, color: '#996633' }}>
          margin
        </div>
        
        {/* Margin 输入框 */}
        <Form.Item name="marginTop" noStyle>
          <InputNumber
            size="small"
            min={0}
            placeholder="-"
            controls={false}
            style={{
              ...boxInputStyle,
              position: 'absolute',
              top: 2,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </Form.Item>
        <Form.Item name="marginBottom" noStyle>
          <InputNumber
            size="small"
            min={0}
            placeholder="-"
            controls={false}
            style={{
              ...boxInputStyle,
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </Form.Item>
        <Form.Item name="marginLeft" noStyle>
          <InputNumber
            size="small"
            min={0}
            placeholder="-"
            controls={false}
            style={{
              ...boxInputStyle,
              position: 'absolute',
              left: 2,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </Form.Item>
        <Form.Item name="marginRight" noStyle>
          <InputNumber
            size="small"
            min={0}
            placeholder="-"
            controls={false}
            style={{
              ...boxInputStyle,
              position: 'absolute',
              right: 2,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </Form.Item>

        {/* Padding 区域 */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#b4d7a8',
            padding: '20px',
            borderRadius: 2,
          }}
        >
          {/* Padding 标签 */}
          <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 10, color: '#4a7c3f' }}>
            padding
          </div>
          
          {/* Padding 输入框 */}
          <Form.Item name="paddingTop" noStyle>
            <InputNumber
              size="small"
              min={0}
              placeholder="-"
              controls={false}
              style={{
                ...boxInputStyle,
                position: 'absolute',
                top: 2,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </Form.Item>
          <Form.Item name="paddingBottom" noStyle>
            <InputNumber
              size="small"
              min={0}
              placeholder="-"
              controls={false}
              style={{
                ...boxInputStyle,
                position: 'absolute',
                bottom: 2,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </Form.Item>
          <Form.Item name="paddingLeft" noStyle>
            <InputNumber
              size="small"
              min={0}
              placeholder="-"
              controls={false}
              style={{
                ...boxInputStyle,
                position: 'absolute',
                left: 2,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </Form.Item>
          <Form.Item name="paddingRight" noStyle>
            <InputNumber
              size="small"
              min={0}
              placeholder="-"
              controls={false}
              style={{
                ...boxInputStyle,
                position: 'absolute',
                right: 2,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </Form.Item>

          {/* 内容区域 */}
          <div
            style={{
              backgroundColor: '#a8c7e6',
              padding: '16px 8px',
              borderRadius: 2,
              textAlign: 'center',
              fontSize: 11,
              color: '#3a6ea5',
            }}
          >
            content
          </div>
        </div>
      </div>
    </div>
  );
};
