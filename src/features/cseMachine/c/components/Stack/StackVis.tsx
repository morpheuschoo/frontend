import { Group, Rect } from "react-konva";
import { Memory as CMemory } from "src/ctowasm/dist"
import { StackFrame } from "src/ctowasm/dist";

import { CControlStashMemoryConfig } from "../../config/CControlStashMemoryConfig";
import { CConfig, ShapeDefaultProps } from "../../config/CCSEMachineConfig";
import { CseMachine } from "../../CseMachine";
import { CVisible } from "../../CVisible";
import { topToBottom } from "../../utils";
import { MemorySegmentHeader } from "../memory/MemorySegmentHeader";
import { StackFrameVis } from "./StackFrameVis";

export class StackVis extends CVisible {
  private readonly memory: CMemory;
  private readonly frames: StackFrameVis[] = [];
  private readonly header: MemorySegmentHeader;

  private readonly SEGMENT_NAME: string = "Stack";

  constructor(memory: CMemory, frames: StackFrame[]) {
    super();
    this.memory = memory;
    this.frames = [];

    this._x =
      CControlStashMemoryConfig.ControlPosX +
      CControlStashMemoryConfig.ControlItemWidth +
      2 * CConfig.CanvasPaddingX +
      CConfig.FrameMaxWidth;

    this._y =
      CControlStashMemoryConfig.StashPosY +
      CControlStashMemoryConfig.StashItemHeight +
      2 * CConfig.CanvasPaddingY;

    this._width = CControlStashMemoryConfig.memoryRowWidth;

    // construct memory frames
    this.frames = [...frames].filter((frame) => (frame.functionName !== "global")).map(frame => {
      const newMemoryStackFrame = new StackFrameVis(0, 0, this.memory, frame);
      return newMemoryStackFrame;
    });

    this.header = new MemorySegmentHeader(
      this.SEGMENT_NAME,
      CControlStashMemoryConfig.stackHeaderBackgroundColour,
      CControlStashMemoryConfig.stackHeaderTextColour,
      0,
      0
    );

    const { components, totalHeight } = topToBottom<StackFrameVis>([...this.frames], 0, this.header.height());
    this.frames = components;

    this._height =
      this.header.height() +
      totalHeight;
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++} x={this.x()} y={this.y()}>
        <Rect
          {...ShapeDefaultProps}
          width={this.width()}
          height={this.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill="transparent"
          cornerRadius={CConfig.FrameCornerRadius}
        />
        {this.header.draw()}
        {this.frames.map(frame => frame.draw())}
      </Group>
    );
  }
}
