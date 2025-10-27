import React from 'react';
import { Group } from 'react-konva';

import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { ArrayUnit } from './ArrayUnit';

export class ArrayValue extends CVisible {
  private readonly units: ArrayUnit[] = [];

  constructor(x: number, y: number, arrayData: number[]) {
    super();

    this._x = x;
    this._y = y;

    for (let i = 0; i < arrayData.length; i++) {
      const unitX = x + i * CConfig.DataUnitWidth;
      const isFirst = i === 0;
      const isLast = i === arrayData.length - 1;

      const unit = new ArrayUnit(i, arrayData[i], unitX, y, isFirst, isLast);

      this.units.push(unit);
    }

    this._width = arrayData.length * CConfig.DataUnitWidth;
    this._height = CConfig.FontSize + 2 * CConfig.TextPaddingX;
  }

  getUnit(index: number): ArrayUnit | undefined {
    return this.units[index];
  }

  draw(): React.ReactNode {
    return <Group key={CseMachine.key++}>{this.units.map(unit => unit.draw())}</Group>;
  }
}
