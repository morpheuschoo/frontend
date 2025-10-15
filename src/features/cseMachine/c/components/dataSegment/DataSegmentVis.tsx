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
  
  constructor(bytes: ArrayBuffer) {
    super();
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
    const {components, totalHeight} = topToBottom<MemoryRow>([...this.byteRows], CControlStashMemoryConfig.memoryRowPadding, this.header.height())
    this.byteRows = components;

    // height = header + total height of byte rows + padding between header and byte row
    if (this.byteRows.length > 0) {
      this._height =
      this.header.height() +
      totalHeight +
      CControlStashMemoryConfig.memoryRowPadding;
    } else {
      this._height = this.header.height();
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
        <Rect
          {...ShapeDefaultProps}
          key={CseMachine.key++}
          width={this.width()}
          y={this.header.height()}
          height={this.height() - this.header.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill={"#FFEDD4"}
        />
        <Group key={CseMachine.key++} y={CControlStashMemoryConfig.memoryRowPadding}>
          {this.byteRows.map((row) => row.draw())}
        </Group>
      </Group>
    )
  }
}
