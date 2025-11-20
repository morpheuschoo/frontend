import React from 'react';
import { Group, Rect, Text } from 'react-konva';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

export class MemorySegmentHeader extends CVisible {
  constructor(
    private readonly _segmentName: string,
    private readonly _backgroundColour: string,
    private readonly _textColour: string,
    x: number,
    y: number
  ) {
    super();
    this._x = x;
    this._y = y;
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = CControlStashMemoryConfig.memoryRowHeight * 2;
  }

  draw(key?: number): React.ReactNode {
    const textProps = {
      fill: defaultTextColor(),
      padding: CControlStashMemoryConfig.ControlItemTextPadding,
      fontFamily: CControlStashMemoryConfig.FontFamily,
      fontSize: CControlStashMemoryConfig.FontSize,
      fontStyle: CControlStashMemoryConfig.FontStyle,
      fontVariant: CControlStashMemoryConfig.FontVariant
    };

    return (
      <Group key={CseMachine.key++} x={0} y={0}>
        <Rect
          x={this.x()}
          y={this.y()}
          width={this.width()}
          height={this.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill={this._backgroundColour}
          cornerRadius={Number(CConfig.FrameCornerRadius)}
        />
        <Text
          {...textProps}
          fontSize={20}
          x={this.x() + CControlStashMemoryConfig.memoryRowPadding}
          y={this.y() + CControlStashMemoryConfig.memoryRowPadding}
          text={this._segmentName}
          stroke={this._textColour}
          strokeWidth={2}
        />
      </Group>
    );
  }
}
