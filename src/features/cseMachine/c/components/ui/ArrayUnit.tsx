import React from 'react';
import { Group, Rect, Text as KonvaText } from 'react-konva';

import { defaultStrokeColor, defaultTextColor } from '../../../CseMachineUtils';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

export class ArrayUnit extends CVisible {
  private readonly data: number;
  private readonly index: number;
  private readonly isFirstUnit: boolean;
  private readonly isLastUnit: boolean;

  constructor(
    index: number,
    data: number,
    x: number,
    y: number,
    isFirst: boolean,
    isLast: boolean
  ) {
    super();

    this._x = x;
    this._y = y;
    this._width = CConfig.DataUnitWidth;
    this._height = CConfig.FontSize + 2 * CConfig.TextPaddingX;

    this.index = index;
    this.data = data;
    this.isFirstUnit = isFirst;
    this.isLastUnit = isLast;
  }

  draw(): React.ReactNode {
    let cornerRadius: number | number[] = 0;

    if (this.isFirstUnit && this.isLastUnit) {
      cornerRadius = CConfig.DataCornerRadius;
    } else if (this.isFirstUnit) {
      cornerRadius = [CConfig.DataCornerRadius, 0, 0, CConfig.DataCornerRadius];
    } else if (this.isLastUnit) {
      cornerRadius = [0, CConfig.DataCornerRadius, CConfig.DataCornerRadius, 0];
    }

    return (
      <Group key={CseMachine.key++}>
        {/* Box */}
        <Rect
          {...ShapeDefaultProps}
          x={this._x}
          y={this._y}
          width={this._width}
          height={this._height}
          stroke={defaultStrokeColor()}
          strokeWidth={1}
          cornerRadius={cornerRadius}
        />

        {/* Index number above box */}
        <KonvaText
          {...ShapeDefaultProps}
          text={this.index.toString()}
          x={this._x}
          y={this._y - CConfig.FontSize - CConfig.TextMargin}
          width={this._width}
          height={CConfig.FontSize}
          fontSize={CConfig.FontSize * 0.7}
          fontFamily={CConfig.FontFamily}
          fill={defaultTextColor()}
          align="center"
        />

        {/* Value inside box */}
        <KonvaText
          {...ShapeDefaultProps}
          text={this.data.toString()}
          x={this._x + CConfig.TextPaddingX}
          y={this._y + CConfig.TextPaddingX}
          width={this._width - 2 * CConfig.TextPaddingX}
          height={this._height - 2 * CConfig.TextPaddingX}
          fontSize={CConfig.FontSize}
          fontFamily={CConfig.FontFamily}
          fill={defaultTextColor()}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  }
}
