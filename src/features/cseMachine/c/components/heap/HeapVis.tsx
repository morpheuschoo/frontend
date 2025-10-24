import { Group, Rect } from 'react-konva';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { MemoryRow } from '../memory/MemoryRow';
import { MemorySegment } from '../memory/MemorySegment';
import { MemorySegmentHeader } from '../memory/MemorySegmentHeader';

export class HeapVis extends CVisible {
  private readonly header: MemorySegmentHeader;
  private readonly memorySegment: MemorySegment;

  private readonly SEGMENT_NAME: string = 'Heap';

  constructor(bytes: ArrayBuffer, startAddress: number, endAddress: number) {
    if (bytes.byteLength !== endAddress - startAddress + 1) {
      throw new Error(
        `Heap segment length mismatch: expected ${bytes.byteLength} bytes but received ${bytes.byteLength}.`
      );
    }
    super();

    this._width = CControlStashMemoryConfig.memoryRowWidth;

    this.header = new MemorySegmentHeader(
      this.SEGMENT_NAME,
      CControlStashMemoryConfig.heapHeaderBackgroundColour,
      CControlStashMemoryConfig.heapHeaderTextColour,
      0,
      0
    );

    const byteRows: MemoryRow[] = [];
    for (let i = 0; i < bytes.byteLength; i += 4) {
      byteRows.push(new MemoryRow(startAddress + i, bytes.slice(i, i + 4), 0, 0));
    }
    this.memorySegment = new MemorySegment(byteRows, 0, this.header.height(), '#DCFCE7');

    this._height = this.header.height() + this.memorySegment.height();
  }

  public height(): number {
    this._height = this.header.height() + this.memorySegment.height();
    return this._height;
  }

  draw(): React.ReactNode {
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
    );
  }
}
