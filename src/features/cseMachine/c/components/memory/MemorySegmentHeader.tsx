import React from "react";
import { Group, Rect, Text } from "react-konva";

import { defaultTextColor } from "../../../CseMachineUtils";
import { CControlStashMemoryConfig } from "../../config/CControlStashMemoryConfig";
import { CConfig } from "../../config/CCSEMachineConfig";
import { CseMachine } from "../../CseMachine";
import { CVisible } from "../../CVisible";

export class MemorySegmentHeader extends CVisible {
  private readonly SegmentName: string;
  textProps = {
    fill: defaultTextColor(),
    padding: CControlStashMemoryConfig.ControlItemTextPadding,
    fontFamily: CControlStashMemoryConfig.FontFamily,
    fontSize: CControlStashMemoryConfig.FontSize,
    fontStyle: CControlStashMemoryConfig.FontStyle,
    fontVariant: CControlStashMemoryConfig.FontVariant
  };

  constructor(SegmentName: string, x: number, y: number) {
    super();
    this.SegmentName = SegmentName;
    this._x = x;
    this._y = y;
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = CControlStashMemoryConfig.memoryRowHeight * 2;
  }

  draw(key?: number): React.ReactNode {

    return (
      <Group key={CseMachine.key++} x={0} y={0}>
        <Rect
          x={this.x()}
          y={this.y()}
          width={this.width()}
          height={this.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill="#BEDBFF"
          cornerRadius={Number(CConfig.FrameCornerRadius)}
        />
        <Text
          {...this.textProps}
          fontSize={20}
          x={this.x() + CControlStashMemoryConfig.memoryRowPadding}
          y={this.y() + CControlStashMemoryConfig.memoryRowPadding}
          text={this.SegmentName}
          stroke={'#193CB8'}
          strokeWidth={2}
        />
      </Group>
    );
  }
}
