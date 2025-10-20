import Konva from 'konva';
import React, { RefObject } from 'react';
import { Group, Rect } from 'react-konva';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { topToBottom } from '../../utils';
import { MemoryRow } from './MemoryRow';

// Consists of memory rows
export class MemorySegment extends CVisible {
  private backgroundColour: string;

  private byteRows: MemoryRow[] = [];
  private byteRowsTotalHeight: number;
  private byteRowsClipHeight: number;
  private byteRowGroupRef: RefObject<any> = React.createRef();

  private scrollY: number = 0;

  constructor(byteRows: MemoryRow[], x: number, y: number, backgroundColour: string) {
    super();
    this.backgroundColour = backgroundColour;

    const {components, totalHeight} = topToBottom<MemoryRow>(
      [...byteRows],
      CControlStashMemoryConfig.memoryRowPadding,
      0
    )

    this.byteRows = components
    this.byteRowsTotalHeight = totalHeight;
    this.byteRowsClipHeight = Math.min(
      totalHeight,
      CControlStashMemoryConfig.memorySegmentInitialHeight
    );

    this._x = x;
    this._y = y;
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = this.byteRowsClipHeight;
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
      const maxScroll = this.byteRowsTotalHeight + CControlStashMemoryConfig.memoryRowPadding - this.byteRowsClipHeight;
      this.scrollY += (event.evt.deltaY * unitConversion) * 0.1;

      if (this.scrollY > maxScroll) {
        this.scrollY = maxScroll;
      } else if (this.scrollY < 0) {
        this.scrollY = 0;
      }

      group.y(-this.scrollY);
      group.getLayer()?.batchDraw();
    }
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++}
        clipX={0}
        clipY={0}
        x={this.x()}
        y={this.y()}
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
            fill={this.backgroundColour}
          />
          <Group key={CseMachine.key++} y={CControlStashMemoryConfig.memoryRowPadding}>
            {this.byteRows.map((row) => row.draw())}
          </Group>
        </Group>
      </Group>
    )
  }
}
