import React from 'react';
import { Group, Rect } from 'react-konva';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { MemoryRow } from '../memory/MemoryRow';
import { MemorySegment } from '../memory/MemorySegment';
import { MemorySegmentHeader } from '../memory/MemorySegmentHeader';

export class DataSegmentVis extends CVisible {
  private readonly header: MemorySegmentHeader;
  private readonly memorySegment: MemorySegment;

  constructor(bytes: ArrayBuffer) {
    super();

    this.header = new MemorySegmentHeader(
      'Data segment',
      CControlStashMemoryConfig.dataSegmentHeaderBackgroundColour,
      CControlStashMemoryConfig.dataSegmentTextColour,
      0,
      0
    );
    const byteRows: MemoryRow[] = [];
    for (let i = 0; i < bytes.byteLength; i += 4) {
      byteRows.push(new MemoryRow(i, bytes.slice(i, i + 4), 0, 0));
    }
    this.memorySegment = new MemorySegment(byteRows, 0, this.header.height(), '#FFEDD4');

    this._width = CControlStashMemoryConfig.memoryRowWidth;
    // height = header + total height of byte rows + padding between header and byte row
    this._height = this.header.height() + this.memorySegment.height();
  }

  public height(): number {
    this._height = this.header.height() + this.memorySegment.height();
    return this._height;
  }

  draw(key?: number): React.ReactNode {
    return (
      <Group key={CseMachine.key++} x={this.x()} y={this.y()}>
        {this.header.draw()}
        {this.memorySegment.draw()}
      </Group>
    );
  }
}
