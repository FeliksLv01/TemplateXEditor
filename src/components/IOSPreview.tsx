import React from 'react';
import { ComponentRenderer } from './ComponentRenderer';
import type { DSLComponent } from '@/types/dsl';

interface IOSPreviewProps {
  components: DSLComponent[];
  deviceWidth?: number;
  deviceHeight?: number;
}

export const IOSPreview: React.FC<IOSPreviewProps> = ({
  components,
  deviceWidth = 375,
  deviceHeight = 667,
}) => {
  return (
    <div className="ios-preview-container">
      <div
        className="ios-device-frame"
        style={{
          width: `${deviceWidth}px`,
          height: `${deviceHeight}px`,
        }}
      >
        <div className="ios-screen">
          <div className="ios-status-bar">
            <div className="ios-time">9:41</div>
            <div className="ios-icons">
              <span className="ios-signal">📶</span>
              <span className="ios-wifi">📡</span>
              <span className="ios-battery">🔋</span>
            </div>
          </div>
          <div className="ios-content">
            {components.length === 0 ? (
              <div className="empty-state">
                <p>No components to preview</p>
              </div>
            ) : (
              components.map((component, index) => (
                <ComponentRenderer key={`${component.id}-${index}`} component={component} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
