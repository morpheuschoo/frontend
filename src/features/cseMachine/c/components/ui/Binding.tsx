import React from 'react';
import { DataType, MemoryAddressEntry, StackFrame } from 'src/ctowasm/dist';

import { Arrow } from '../../../java/components/Arrow';
import { Method } from '../../../java/components/Method';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { Text } from './Text';
import { Variable } from './Variable';

/** a Binding is a key-value pair in a Frame */
export class Binding extends CVisible {
  private readonly _name: Text;

  private readonly _value: Variable | Method | Text;

  private readonly _arrow: Arrow | undefined;

  constructor(
    name: string,
    value: number,
    dataType: DataType,
    x: number,
    y: number,
    stackFrame: StackFrame,
    private addressMap: Map<number, { x: number, y: number }>
  ) {
    super();
    
    this._x = x;
    this._y = y;

    this._name = new Text(
      name + CConfig.VariableColon,
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
        this.x() + this._name.width(),
        this.y()
      );

      const targetLocation = this.addressMap.get(value);
      if (targetLocation) {
        this._arrow = new Arrow(
          this._name.x() + this._name.width(),
          this._name.y() + this._name.height() / 2,
          this._name.x() + this._name.width(),
          targetLocation.y
        );
      }
    } else {
      this._value = new Variable(
        this._name.x() + this._name.width(),
        this.y(),
        value,
        targetDataType
      );
    }

    // Register this variable's location in the address map
    if (variableEntry?.absoluteAddress !== undefined) {
      this.addressMap.set(variableEntry.absoluteAddress, {
        x: this._value.x(),
        y: this._value.y() + this._value.height()
      });
    }

    this._height = Math.max(this._name.height(), this._value.height());
    this._width = this._value.x() + this._value.width() - this._name.x();
  }

  get value() {
    return this._value;
  }

  setArrowToX(x: number) {
    this._arrow?.setToX(x);
  }

  draw(): React.ReactNode {
    return (
      <React.Fragment key={CseMachine.key++}>
        {/* Name */}
        {this._name.draw()}

        {/* Value */}
        {this._value.draw()}
        {this._arrow?.draw()}
      </React.Fragment>
    );
  }
}
