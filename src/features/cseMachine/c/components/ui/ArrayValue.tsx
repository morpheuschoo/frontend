import React from 'react';
import { Group } from 'react-konva';
import { ArrayDataType, StackFrame } from 'src/ctowasm/dist';

import { CseMachine } from '../../CseMachine';
import { getVariableVis } from '../../utils';
import { VariableVis } from './VariableVis';

export class ArrayValue extends VariableVis {
  private readonly units: VariableVis[] = [];

  constructor(
    address: bigint,
    stackFrame: StackFrame,
    dataType: ArrayDataType,
    x: number,
    y: number
  ) {
    super(address, dataType, x, y, 'ArrayValue');

    this._x = x;
    this._y = y;
    let currentX = this.x();

    if (dataType.numElements.type !== 'IntegerConstant') {
      throw new Error('Not implemented');
    }
    const numOfElements = dataType.numElements.value;
    const elementSize = stackFrame.getTypeSize(dataType.elementDataType);

    this._height = 0;
    this._width = 0;

    for (let i = 0; i < numOfElements; i++) {
      const currentElement = getVariableVis(
        BigInt(address + BigInt(i * elementSize)),
        dataType.elementDataType,
        stackFrame,
        currentX,
        this.y()
      );

      this._width += currentElement.width();
      this._height = Math.max(this._height, currentElement.height());
      currentX += currentElement.width();
      this.units.push(currentElement);
    }
  }

  getUnit(index: number): VariableVis {
    return this.units[index];
  }

  draw(): React.ReactNode {
    return <Group key={CseMachine.key++}>{this.units.map(unit => unit.draw())}</Group>;
  }
}
