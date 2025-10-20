import Konva from "konva";
import React, { RefObject } from "react";
import { Group, Rect } from "react-konva";

import { CControlStashMemoryConfig } from "../../config/CControlStashMemoryConfig";
import { CConfig, ShapeDefaultProps } from "../../config/CCSEMachineConfig";
import { CseMachine } from "../../CseMachine";
import { CVisible } from "../../CVisible";
import { topToBottom } from "../../utils";
import { MemoryRow } from "../memory/MemoryRow";
import { MemorySegmentHeader } from "../memory/MemorySegmentHeader";

export class DataSegmentVis extends CVisible {
  private readonly header: MemorySegmentHeader;

  private byteRows: MemoryRow[] = [];
  private byteRowsTotalHeight: number;
  private byteRowsClipHeight: number;
  private byteRowGroupRef: RefObject<any> = React.createRef();
  
  private scrollY: number = 0;

  constructor(bytes: ArrayBuffer) {
    super();
    
    this.header = new MemorySegmentHeader(
      "Data segment", 
      CControlStashMemoryConfig.dataSegmentHeaderBackgroundColour,
      CControlStashMemoryConfig.dataSegmentTextColour,
      0,
      0
    )
    for(let i = 0;i < bytes.byteLength;i += 4) {
      this.byteRows.push(new MemoryRow(i, bytes.slice(i, i + 4), 0, 0));
    }
    const {components, totalHeight} = topToBottom<MemoryRow>(
      [...this.byteRows], 
      CControlStashMemoryConfig.memoryRowPadding, 
      0
    )
    
    this.byteRows = components;
    this.byteRowsTotalHeight = totalHeight;
    this.byteRowsClipHeight = Math.min(
      totalHeight, 
      CControlStashMemoryConfig.memorySegmentInitialHeight
    );
    
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
    if (this.byteRows.length > 0) {
      this._height = this.header.height() + this.byteRowsClipHeight;
    } else {
      this._height = this.header.height();
    }
  }

  private handleScroll = (event: Konva.KonvaEventObject<WheelEvent>): void => {
    if (typeof event != 'boolean') {
      event.evt.preventDefault();
    }
    event.cancelBubble = true;

    if (this.byteRowGroupRef.current) {
      const group = this.byteRowGroupRef.current as Konva.Group;
      let unitConversion: number = 1;
  
      if (event.evt.deltaMode === 1) {
        unitConversion = CConfig.LineHeight;
      } else if (event.evt.deltaMode === 2) {
        unitConversion = CConfig.PageHeight;
      }
      const maxScroll = 
        this.byteRowsTotalHeight + CControlStashMemoryConfig.memoryRowPadding - this.byteRowsClipHeight;
      this.scrollY += (event.evt.deltaY * unitConversion) * 0.1;

      if (this.scrollY > maxScroll) {
        this.scrollY = maxScroll;
      } else if (this.scrollY < 0) {
        this.scrollY = 0;
      }
      console.log(this.scrollY, "HERE BROO")

      group.y(-this.scrollY);
      group.getLayer()?.batchDraw();
    }
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
        <Group key={CseMachine.key++}
          clipX={0}
          clipY={0}
          y={this.header.height()}
          clipWidth={this.width()} 
          clipHeight={this.byteRowsClipHeight}
          onWheel={this.handleScroll}
        >
          <Group 
            key={CseMachine.key++} 
            height={this.byteRowsTotalHeight}
            ref={this.byteRowGroupRef}
          >
            <Rect
              {...ShapeDefaultProps}
              key={CseMachine.key++}
              width={this.width()}
              height={this.byteRowsTotalHeight + CControlStashMemoryConfig.memoryRowPadding}
              fill={"#FFEDD4"}
            />
            <Group key={CseMachine.key++} y={CControlStashMemoryConfig.memoryRowPadding}>
              {this.byteRows.map((row) => row.draw())}
            </Group>
          </Group>
        </Group>
      </Group>
    )
  }
}
