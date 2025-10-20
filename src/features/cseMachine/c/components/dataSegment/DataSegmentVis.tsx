import React from "react";
import { Group, Rect } from "react-konva";

import { CControlStashMemoryConfig } from "../../config/CControlStashMemoryConfig";
import { CConfig, ShapeDefaultProps } from "../../config/CCSEMachineConfig";
import { CseMachine } from "../../CseMachine";
import { CVisible } from "../../CVisible";
import { MemoryRow } from "../memory/MemoryRow";
import { MemorySegment } from "../memory/MemorySegment";
import { MemorySegmentHeader } from "../memory/MemorySegmentHeader";

export class DataSegmentVis extends CVisible {
  private readonly header: MemorySegmentHeader;
  private readonly memorySegment: MemorySegment;

  constructor(bytes: ArrayBuffer) {
    super();
    
    this.header = new MemorySegmentHeader(
      "Data segment", 
      CControlStashMemoryConfig.dataSegmentHeaderBackgroundColour,
      CControlStashMemoryConfig.dataSegmentTextColour,
      0,
      0
    )
    const byteRows: MemoryRow[] = [];
    for(let i = 0;i < bytes.byteLength;i += 4) {
      byteRows.push(new MemoryRow(i, bytes.slice(i, i + 4), 0, 0));
    }
    this.memorySegment = new MemorySegment(
      byteRows,
      0,
      this.header.height(),
      "#FFEDD4",
    )
    
    this._x =
    CControlStashMemoryConfig.ControlPosX +
    CControlStashMemoryConfig.ControlItemWidth +
      4 * CConfig.CanvasPaddingX +
      3 * CConfig.FrameMaxWidth;
      
    this._y =
    CControlStashMemoryConfig.StashPosY +
      CControlStashMemoryConfig.StashItemHeight +
      2 * CConfig.CanvasPaddingY;

    this._width = CControlStashMemoryConfig.memoryRowWidth;
    // height = header + total height of byte rows + padding between header and byte row
    this._height = this.header.height() + this.memorySegment.height();
  }

  draw(key?: number): React.ReactNode {
    return (
      <Group key={CseMachine.key++} x={this.x()} y={this.y()}> 
        <Rect 
          {...ShapeDefaultProps}
          key={CseMachine.key++}
          width={this.width()}
          height={this.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill="transparent"
          cornerRadius={CConfig.FrameCornerRadius}
        />
        {this.header.draw()}
        {this.memorySegment.draw()}        
      </Group>
    )
  }
}
