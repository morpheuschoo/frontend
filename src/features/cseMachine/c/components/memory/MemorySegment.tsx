import Konva from 'konva';
import React, { RefObject } from 'react';
import { Group, Rect } from 'react-konva';

import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { topToBottom } from '../../utils';
import { Memory } from './Memory';
import { MemoryRow } from './MemoryRow';

// Consists of memory rows
export class MemorySegment extends CVisible {
  private readonly changeHeightButtonHeight = 15;

  private backgroundColour: string;

  private byteRows: MemoryRow[] = [];
  private byteRowsTotalHeight: number;
  private byteRowsClipHeight: number;
  private byteRowGroupRef: RefObject<any> = React.createRef();

  private clippingGroupRef: RefObject<any> = React.createRef();

  private scrollY: number = 0;

  constructor(byteRows: MemoryRow[], x: number, y: number, backgroundColour: string) {
    super();
    this.backgroundColour = backgroundColour;

    const { components, totalHeight } = topToBottom<MemoryRow>(
      [...byteRows],
      CControlStashMemoryConfig.memoryRowPadding,
      0
    );

    this.byteRows = components;
    this.byteRowsTotalHeight = totalHeight;
    this.byteRowsClipHeight = Math.min(
      totalHeight + (totalHeight > 0 ? CControlStashMemoryConfig.memoryRowPadding : 0),
      CControlStashMemoryConfig.memorySegmentInitialHeight
    );

    this._x = x;
    this._y = y;
    this._width = CControlStashMemoryConfig.memoryRowWidth;
    this._height = this.byteRowsClipHeight + this.changeHeightButtonHeight;
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
        this.byteRowsTotalHeight +
        CControlStashMemoryConfig.memoryRowPadding -
        this.byteRowsClipHeight;
      this.scrollY += event.evt.deltaY * unitConversion * 0.1;

      if (this.scrollY > maxScroll) {
        this.scrollY = maxScroll;
      } else if (this.scrollY < 0) {
        this.scrollY = 0;
      }

      group.y(-this.scrollY);
      group.getLayer()?.batchDraw();
    }
  };

  private handleDrag = (e: Konva.KonvaEventObject<DragEvent>): void => {
    if (typeof e !== 'boolean') {
      e.evt.preventDefault();
    }
    if (this.clippingGroupRef.current && this.byteRowGroupRef.current) {
      e.cancelBubble = true;

      e.target.x(0);

      const newY = Math.min(e.target.y(), this.byteRowsTotalHeight);
      e.target.y(Math.max(newY, 0));

      this.byteRowsClipHeight = Math.max(0, e.target.y());
      this._height = this.byteRowsClipHeight + this.changeHeightButtonHeight;

      const group = this.clippingGroupRef.current as Konva.Group;
      group.clip({
        x: 0,
        y: 0,
        width: this.width(),
        height: this.byteRowsClipHeight
      });

      const maxScroll =
        this.byteRowsTotalHeight +
        CControlStashMemoryConfig.memoryRowPadding -
        this.byteRowsClipHeight;
      if (this.scrollY > maxScroll) {
        this.scrollY = maxScroll;
      } else if (this.scrollY < 0) {
        this.scrollY = 0;
      }
      const byteRowGroup = this.byteRowGroupRef.current as Konva.Group;
      byteRowGroup.y(-this.scrollY);

      CseMachine.memory?.redraw();
    }
  };

  draw(): React.ReactNode {
    return (
      <Group x={this.x()} y={this.y()}>
        <Group
          clipX={0}
          clipY={0}
          clipWidth={this.width()}
          clipHeight={this.byteRowsClipHeight}
          onWheel={this.handleScroll}
          ref={this.clippingGroupRef}
        >
          <Group ref={this.byteRowGroupRef}>
            <Rect
              {...ShapeDefaultProps}
              width={this.width()}
              height={this.byteRowsTotalHeight + CControlStashMemoryConfig.memoryRowPadding}
              fill={this.backgroundColour}
            />
            <Group y={CControlStashMemoryConfig.memoryRowPadding}>
              {this.byteRows.map(row => row.draw())}
            </Group>
          </Group>
        </Group>

        <Group>
          <Rect
            y={this.byteRowsClipHeight}
            width={this.width()}
            height={this.changeHeightButtonHeight}
            fill="white"
            stroke="black"
            draggable
            onDragStart={e => (e.cancelBubble = true)}
            onDragMove={this.handleDrag}
            onDragEnd={this.handleDrag}
            onMouseEnter={e => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseLeave={e => {
              document.body.style.cursor = 'default';
            }}
          />
        </Group>
      </Group>
    );
  }
}
