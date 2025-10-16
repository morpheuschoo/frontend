import { Group as KonvaGroup, Rect } from 'react-konva';
import { Text as KonvaText } from 'react-konva';
import { Memory as CMemory, StackFrame } from 'src/ctowasm/dist';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { topToBottom } from '../../utils';
import { MemoryRow } from '../memory/MemoryRow';

export class StackFrameVis extends CVisible {
  public frame: StackFrame;
  public memory: CMemory;
  public byteRows: MemoryRow[];

  constructor(x: number, y: number, memory: CMemory, frame: StackFrame) {
    super();
    this._x = x;
    this._y = y;
    this.memory = memory;
    this.frame = frame;
    this.byteRows = [];

    for (let i = frame.stackPointer; i <= frame.basePointer + frame.sizeOfReturn - 3; i += 4) {
      const newRow =
        new MemoryRow(i, memory.memory.buffer.slice(i, i + 4), 0, 0, );
      this.byteRows.push(newRow);
    }
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = CControlStashMemoryConfig.memoryRowHeight + CControlStashMemoryConfig.memoryRowPadding;
    this.byteRows.forEach(row => (this._height += row.height()));
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
        <KonvaGroup
          y={CControlStashMemoryConfig.memoryRowHeight + CControlStashMemoryConfig.memoryRowPadding}
        >
          <Rect
            y={-CControlStashMemoryConfig.memoryRowPadding}
            key={CseMachine.key++}
            width={CControlStashMemoryConfig.memoryRowWidth}
            height={this._height - CControlStashMemoryConfig.memoryRowHeight}
            fill={'#EFF6FF'}
            stroke={CControlStashMemoryConfig.memoryRowBorderStroke}
            strokeWidth={2}
          />
          {topToBottom(this.byteRows, 0, 0).components.map(row => row.draw())}
        </KonvaGroup>
      </KonvaGroup>
    );
  }
}
