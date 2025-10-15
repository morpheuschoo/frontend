import { KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { Arrow as KonvaArrow, Group as KonvaGroup, Path as KonvaPath } from 'react-konva';

import { IHoverable } from '../../../CseMachineTypes';
import {
  defaultStrokeColor,
  setHoveredCursor,
  setHoveredStyle,
  setUnhoveredCursor,
  setUnhoveredStyle
} from '../../../CseMachineUtils';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

export class Arrow extends CVisible implements IHoverable {
  private readonly points: number[];
  private readonly arrowHeadPoints: number[];
  private readonly cornerRadius = 10;

  constructor(fromX: number, fromY: number, toX: number, toY: number) {
    super();

    const middleX1 = fromX + 50;
    const middleY1 = fromY;
    const middleX2 = middleX1;
    const middleY2 = toY;

    this.points = [fromX, fromY, middleX1, middleY1, middleX2, middleY2, toX, toY];
    this.arrowHeadPoints = [middleX2, middleY2, toX, toY];
  }

  onMouseEnter(e: KonvaEventObject<MouseEvent>) {
    setHoveredStyle(e.currentTarget);
    setHoveredCursor(e.currentTarget);
  }

  onMouseLeave(e: KonvaEventObject<MouseEvent>) {
    setUnhoveredStyle(e.currentTarget);
    setUnhoveredCursor(e.currentTarget);
  }

  setMiddleX(x: number) {
    this.points[2] = x;
    this.points[4] = x;
    this.arrowHeadPoints[0] = x;
  }

  private generatePath(): string {
    const [fromX, fromY, middleX, , , , toX, toY] = this.points;
    const isGoingUp = toY < fromY;

    if (isGoingUp) {
        return `M ${fromX} ${fromY}
                L ${middleX - this.cornerRadius} ${fromY}
                Q ${middleX} ${fromY} ${middleX} ${fromY - this.cornerRadius}
                L ${middleX} ${toY + this.cornerRadius}
                Q ${middleX} ${toY} ${middleX - this.cornerRadius} ${toY}
                L ${toX} ${toY}`;
    }

    return `M ${fromX} ${fromY}
            L ${middleX - this.cornerRadius} ${fromY}
            Q ${middleX} ${fromY} ${middleX} ${fromY + this.cornerRadius}
            L ${middleX} ${toY - this.cornerRadius}
            Q ${middleX} ${toY} ${middleX + this.cornerRadius} ${toY}
            L ${toX} ${toY}`;
    }

  draw(): React.ReactNode {
    return (
      <KonvaGroup
        key={CseMachine.key++}
        onMouseEnter={e => this.onMouseEnter(e)}
        onMouseLeave={e => this.onMouseLeave(e)}
      >
        <KonvaPath
          {...ShapeDefaultProps}
          data={this.generatePath()}
          stroke={defaultStrokeColor()}
          strokeWidth={CConfig.ArrowStrokeWidth}
          hitStrokeWidth={CConfig.ArrowHitStrokeWidth}
        />
        <KonvaArrow
          {...ShapeDefaultProps}
          points={this.arrowHeadPoints}
          fill={defaultStrokeColor()}
          strokeEnabled={false}
          pointerWidth={CConfig.ArrowHeadSize}
          pointerLength={CConfig.ArrowHeadSize}
        />
      </KonvaGroup>
    );
  }
}
