import React from 'react';
import { Group } from 'react-konva';
import { DataType, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../../CseMachineUtils';
import { CConfig } from '../../../config/CCSEMachineConfig';
import { CseMachine } from '../../../CseMachine';
import { CVisible } from '../../../CVisible';
import { getVariableVis } from '../../../utils';
import { Arrow } from '../Arrow';
import { Text } from '../Text';
import { VariableVis } from '../VariableVis';
import { BindingDimensionMap } from './BindingDimensionMap';

/** a Binding is a key-value pair in a Frame */
export class Binding extends CVisible {
  private readonly _name: Text;
  private _value: VariableVis;
  private _arrow: Arrow | undefined;

  constructor(
    name: string,
    dataType: DataType,
    x: number,
    y: number,
    stackFrame: StackFrame,
    private dimensionMap: BindingDimensionMap
  ) {
    super();

    this._x = x;
    this._y = y;

    const targetDataType: string =
      dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;

    this._name = new Text(
      targetDataType + ' ' + name + CConfig.VariableColon,
      defaultTextColor(),
      this.x(),
      this.y()
    );

    const variableEntry = Array.from(stackFrame.variablesMap.entries()).find(
      ([varName, _]) => varName === name
    )?.[1];

    if (!variableEntry) {
      // TODO: CREATE A NEW VARIABLE TYPE THAT HANDLES WHEN THE DATA IS NOT WELL FORMATED
      throw new Error(`Cannot find value with name: ${name}`);
    }
    if (!variableEntry.absoluteAddress) {
      // TODO: CREATE A NEW VARIABLE TYPE THAT HANDLES WHEN THE DATA IS NOT WELL FORMATED
      throw new Error(`Address of ${name} not found`);
    }

    this._value = getVariableVis(
      BigInt(variableEntry.absoluteAddress),
      dataType,
      stackFrame,
      this.x() + this._name.width(),
      this.y()
    );

    // Align name to be vertically middle of _value
    this._name.setY(this._value.y() + this._value.height() / 2 - this._name.height() / 2);

    // Register dimensions
    if (variableEntry?.absoluteAddress !== undefined) {
      if (dataType.type === 'pointer') {
        this.dimensionMap.register(
          variableEntry.absoluteAddress,
          this._name.x(),
          this._name.y(),
          this._name.width(),
          this._name.height(),
          50
        );
      } else if (dataType.type === 'array' && variableEntry.elementSize) {
        // const arrayValue = this._value as ArrayValue;
        // for (let i = 0; i < arrayElements.length; i++) {
        //   const unit = arrayValue.getUnit(i);
        //   if (unit) {
        //     const elementAddress = variableEntry.absoluteAddress + i * variableEntry.elementSize;
        //     this.dimensionMap.register(
        //       elementAddress,
        //       unit.x() + unit.width() / 2,
        //       unit.y() + unit.height(),
        //       0,
        //       0,
        //       0
        //     );
        //   }
        // }
      } else {
        this.dimensionMap.register(
          variableEntry.absoluteAddress,
          this._value.x(),
          this._value.y(),
          this._value.width(),
          this._value.height(),
          0
        );
      }
    }

    this._height = Math.max(this._name.height(), this._value.height());
    this._width = this._name.width() + this._value.width();
    console.log(name, this._name.width(), this._value.width(), 'FUK ME');
  }

  updateValue(
    newValue: number | number[],
    dataType: DataType,
    stackFrame?: StackFrame,
    name?: string
  ) {
    // if (dataType.type === 'pointer' && typeof newValue === 'number') {
    //   const targetDimensions = this.dimensionMap.getDimensions(newValue);
    //   if (targetDimensions) {
    //     const verticalDistance = Math.abs(this.y() - targetDimensions.y);
    //     const baseBendDistance = targetDimensions.endX + 50;
    //     const bendOutDistance =
    //       baseBendDistance + targetDimensions.additionalBendDistance + verticalDistance / 10;
    //     this._arrow = new Arrow(
    //       this._name.x() + this._name.width(),
    //       this._name.y() + this._name.height() / 2,
    //       targetDimensions.endX,
    //       targetDimensions.centerY
    //     );
    //     this._arrow.setMiddleX(bendOutDistance);
    //   }
    // } else if (dataType.type === 'array' && stackFrame && name) {
    //   // TODO: DRAW ARROW TO ARRAY
    // } else if (this._value instanceof Variable && typeof newValue === 'number') {
    //   const targetDataType: string =
    //     dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;
    //   this._value = new Variable(
    //     this._name.x() + this._name.width(),
    //     this.y(),
    //     newValue,
    //     targetDataType
    //   );
    // }
  }

  get value() {
    return this._value;
  }

  get name(): string {
    return this._name.text.replace(CConfig.VariableColon, '');
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
