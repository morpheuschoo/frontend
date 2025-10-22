import { Group as KonvaGroup, Rect } from 'react-konva';
import { Text as KonvaText } from 'react-konva';
import { Memory as CMemory, StackFrame } from 'src/ctowasm/dist';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { MemoryRow } from '../memory/MemoryRow';
import { MemorySegment } from '../memory/MemorySegment';

export class StackFrameVis extends CVisible {
  private frame: StackFrame;
  private memory: CMemory;
  private memorySegment: MemorySegment;

  constructor(x: number, y: number, memory: CMemory, frame: StackFrame) {
    super();
    this._x = x;
    this._y = y;
    this.memory = memory;
    this.frame = frame;

    const byteRows: MemoryRow[] = [];

    for (let i = frame.stackPointer; i <= frame.basePointer + frame.sizeOfReturn - 3; i += 4) {
      const newRow =
        new MemoryRow(i, this.memory.memory.buffer.slice(i, i + 4), 0, 0, );
      byteRows.push(newRow);
    }
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = CControlStashMemoryConfig.memoryRowHeight * 2 + CControlStashMemoryConfig.memoryRowPadding;
    this.memorySegment = new MemorySegment(
      byteRows,
      0,
      CControlStashMemoryConfig.memoryRowHeight,
      "#EFF6FF",
    )
  }

  draw(key?: number): React.ReactNode {
    // if (!this.frame || !this.memory) {
    //   throw new Error('Cannot draw memory stack frame where fields are not instantiated');
    // }

    return (
      <KonvaGroup key={CseMachine.key++} x={this.x()} y={this.y()}>
        <Rect
          {...ShapeDefaultProps}
          width={this.width()}
          height={this.height()}
          stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
          strokeWidth={2}
          fill="transparent"
        />
        {/* function name */}
        <KonvaGroup key={CseMachine.key++}>
          <Rect
            key={CseMachine.key++}
            height={CControlStashMemoryConfig.memoryRowHeight}
            width={CControlStashMemoryConfig.memoryRowWidth}
            stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
            strokeWidth={2}
            fill={'#DBEAFE'}
          />
          <KonvaText
            text={this.frame.functionName}
            fontSize={CControlStashMemoryConfig.FontSize}
            fill="#193CB8"
            width={CControlStashMemoryConfig.memoryRowWidth}
            height={CControlStashMemoryConfig.memoryRowHeight}
            align="center"
            verticalAlign="middle"
          />
        </KonvaGroup>

        {/* Memory segment */}
        {this.memorySegment.draw()}
      </KonvaGroup>
    );
  }
}
