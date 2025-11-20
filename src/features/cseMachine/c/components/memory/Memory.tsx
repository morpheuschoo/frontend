import React from 'react';
import { Group } from 'react-konva';
import { Memory as CMemory, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
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

  private stack: StackVis;
  private heap: HeapVis;
  private dataSegment: DataSegmentVis;

  constructor(memory: CMemory, frames: StackFrame[], x: number, y: number) {
    super();
    this.memory = memory;

    this._x = x;
    this._y = y;

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

    // Set all 3 segments on top of each other
    this.dataSegment.setX(this.x());
    this.dataSegment.setY(this.y());

    this.heap.setX(this.x());
    this.heap.setY(this.dataSegment.y() + this.dataSegment.height());

    this.stack.setX(this.x());
    this.stack.setY(this.heap.y() + this.heap.height());
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        {this.heap.draw()}
        {this.stack.draw()}
        {this.dataSegment.draw()}
      </Group>
    );
  }
}
