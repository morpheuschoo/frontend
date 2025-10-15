import React from 'react';
import { DataType, MemoryAddressEntry, StackFrame } from 'src/ctowasm/dist';
import { Group, Rect } from 'react-konva';

import { defaultTextColor } from '../../../../CseMachineUtils';
import { Method } from '../../../../java/components/Method';
import { CConfig } from '../../../config/CCSEMachineConfig';
import { CseMachine } from '../../../CseMachine';
import { CVisible } from '../../../CVisible';
import { Arrow } from '../Arrow';
import { Text } from '../Text';
import { Variable } from '../Variable';
import { BindingDimensionMap } from './BindingDimensionMap';

/** a Binding is a key-value pair in a Frame */
export class Binding extends CVisible {
  private readonly _name: Text;

  private readonly _value: Variable | Method | Text ;

  private readonly _arrow: Arrow | undefined;

  constructor(
    name: string,
    value: number,
    dataType: DataType,
    x: number,
    y: number,
    stackFrame: StackFrame,
    private dimensionMap: BindingDimensionMap
  ) {
    super();

    this._x = x;
    this._y = y;

    this._name = new Text(
      name + CConfig.VariableColon, // := is part of
      defaultTextColor(),
      this.x(),
      this.y() + CConfig.FontSize + CConfig.TextPaddingX
    );

    const targetDataType: string =
      dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;

    const variableEntry = Array.from(stackFrame.variablesMap.entries())
      .find(([varName, _]) => varName === name)?.[1];

    if (dataType.type === 'pointer') {
      this._value = new Text(
        '',
        defaultTextColor(),
        this._name.x() + this._name.width(),
        this.y() + CConfig.FontSize + CConfig.TextPaddingX
      );

      const targetDimensions = this.dimensionMap.getDimensions(value);
      if (targetDimensions) {
        const verticalDistance = Math.abs(this.y() - targetDimensions.y);
        const baseBendDistance = targetDimensions.endX + 50;
        const bendOutDistance = baseBendDistance + (verticalDistance / 10);

        this._arrow = new Arrow(
          this._name.x() + this._name.width(),
          this._name.y() + this._name.height() / 2,
          targetDimensions.endX,
          targetDimensions.centerY
        );
        this._arrow.setMiddleX(bendOutDistance);
      }

      if (variableEntry?.absoluteAddress !== undefined) {
        this.dimensionMap.register(
          variableEntry.absoluteAddress,
          this._name.x(),
          this._name.y(),
          this._name.width(),
          this._name.height()
        );
      }
    } else {
      this._value = new Variable(
        this._name.x() + this._name.width(),
        this.y(),
        value,
        targetDataType
      );

      if (variableEntry?.absoluteAddress !== undefined) {
        this.dimensionMap.register(
          variableEntry.absoluteAddress,
          this._value.x(),
          this._value.y(),
          this._value.width(),
          this._value.height()
        );
      }
    }

    this._height = Math.max(this._name.height(), this._value.height());
    this._width = this._value.x() + this._value.width() - this._name.x();
  }

  get value() {
    return this._value;
  }

  setArrowToX(x: number) {
    this._arrow?.setX(x);
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        {this._name.draw()}
        {this._value.draw()}
        {this._arrow?.draw()}
      </Group>
    );
  }
}
