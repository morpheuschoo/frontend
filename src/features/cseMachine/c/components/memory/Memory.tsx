import Konva from 'konva';
import React, { RefObject } from 'react';
import { Group } from 'react-konva';
import { Memory as CMemory, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { DataSegmentVis } from '../dataSegment/DataSegmentVis';
import { HeapVis } from '../heap/HeapVis';
import { StackVis } from '../Stack/StackVis';

export class Memory extends CVisible {
  textProps = {
    fill: defaultTextColor(),
    padding: CControlStashMemoryConfig.ControlItemTextPadding,
    fontFamily: CControlStashMemoryConfig.FontFamily,
    fontSize: CControlStashMemoryConfig.FontSize,
    fontStyle: CControlStashMemoryConfig.FontStyle,
    fontVariant: CControlStashMemoryConfig.FontVariant
  };

  memory: CMemory;
  private readonly dataSegmentSizeInBytes: number;
  private readonly stackPointer: number;
  private readonly basePointer: number;
  private readonly heapPointer: number;

  private memoryGroupRef: RefObject<any> = React.createRef();
  private dataSegmentRef: RefObject<any> = React.createRef();
  private heapRef: RefObject<any> = React.createRef();
  private stackRef: RefObject<any> = React.createRef();

  private stack: StackVis;
  private heap: HeapVis;
  private dataSegment: DataSegmentVis;

  constructor(memory: CMemory, frames: StackFrame[]) {
    super();
    this.memory = memory;

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

    const { dataSegmentSizeInBytes, stackPointer, basePointer, heapPointer } = memory.getPointers();

    this.dataSegmentSizeInBytes = dataSegmentSizeInBytes;
    this.stackPointer = stackPointer;
    this.basePointer = basePointer;
    this.heapPointer = heapPointer;

    this.stack = new StackVis(memory, frames);
    this.heap = new HeapVis(
      this.memory.memory.buffer.slice(this.dataSegmentSizeInBytes + 4, this.heapPointer),
      this.dataSegmentSizeInBytes + 4,
      this.heapPointer - 1
    );
    this.dataSegment = new DataSegmentVis(
      this.memory.memory.buffer.slice(0, this.dataSegmentSizeInBytes)
    );
  }

  public redraw = (): void => {
    if (
      this.memoryGroupRef.current &&
      this.dataSegmentRef.current &&
      this.heapRef.current &&
      this.stackRef.current
    ) {
      this.stack.redraw();

      const dataSegmentGroup = this.dataSegmentRef.current as Konva.Group;
      const heapGroup = this.heapRef.current as Konva.Group;
      const stackGroup = this.stackRef.current as Konva.Group;

      dataSegmentGroup.x(this.x());
      dataSegmentGroup.y(this.y());

      heapGroup.x(this.x());
      heapGroup.y(this.y() + this.dataSegment.height());

      stackGroup.x(this.x());
      stackGroup.y(this.y() + this.dataSegment.height() + this.heap.height());

      const parentGroup = this.memoryGroupRef.current as Konva.Group;
      parentGroup.getLayer()?.batchDraw();
    }
  };

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++} ref={this.memoryGroupRef}>
        <Group x={this.x()} y={this.y()} ref={this.dataSegmentRef}>
          {this.dataSegment.draw()}
        </Group>
        <Group x={this.x()} y={this.y() + this.dataSegment.height()} ref={this.heapRef}>
          {this.heap.draw()}
        </Group>
        <Group
          x={this.x()}
          y={this.y() + this.dataSegment.height() + this.heap.height()}
          ref={this.stackRef}
        >
          {this.stack.draw()}
        </Group>
      </Group>
    );
  }
}
