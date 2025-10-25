import React from 'react';
import { Group } from 'react-konva';
import { DataType, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../../CseMachineUtils';
import { Method } from '../../../../java/components/Method';
import { CConfig } from '../../../config/CCSEMachineConfig';
import { CseMachine } from '../../../CseMachine';
import { CVisible } from '../../../CVisible';
import { ArrayValue } from '../ArrayValue';
import { Arrow } from '../Arrow';
import { Text } from '../Text';
import { Variable } from '../Variable';
import { BindingDimensionMap } from './BindingDimensionMap';

/** a Binding is a key-value pair in a Frame */
export class Binding extends CVisible {
  private readonly _name: Text;
  private _value: Variable | Method | Text | ArrayValue;
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

    this._name = new Text(
      name + CConfig.VariableColon,
      defaultTextColor(),
      this.x(),
      this.y() + CConfig.FontSize + CConfig.TextPaddingX
    );

    const targetDataType: string =
      dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;

    const variableEntry = Array.from(stackFrame.variablesMap.entries())
      .find(([varName, _]) => varName === name)?.[1];

    let arrayElements: number[] = [];

    if (dataType.type === 'pointer') {
      this._value = new Text(
        '',
        defaultTextColor(),
        this._name.x() + this._name.width(),
        this.y() + CConfig.FontSize + CConfig.TextPaddingX
      );
    } else if (dataType.type === 'array') {
      const arrayX = this._name.x() + this._name.width();
      const arrayY = this._name.y() - this._name.height() / 2;

      arrayElements = stackFrame.getArrayElements(name) || [];
      this._value = new ArrayValue(
        arrayX,
        arrayY,
        arrayElements
      );
    } else {
      this._value = new Variable(
        this._name.x() + this._name.width(),
        this.y(),
        0,
        targetDataType
      );
    }

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
        const arrayValue = this._value as ArrayValue;
        for (let i = 0; i < arrayElements.length; i++) {
          const unit = arrayValue.getUnit(i);
          if (unit) {
            const elementAddress = variableEntry.absoluteAddress + (i * variableEntry.elementSize);
            this.dimensionMap.register(
              elementAddress,
              unit.x() + unit.width() / 2,
              unit.y() + unit.height(),
              0,
              0,
              0
            );
          }
        }
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
    this._width = this._value.x() + this._value.width() - this._name.x();
  }

  updateValue(newValue: number | number[], dataType: DataType, stackFrame?: StackFrame, name?: string) {
    if (dataType.type === 'pointer' && typeof newValue === 'number') {
      const targetDimensions = this.dimensionMap.getDimensions(newValue);
      if (targetDimensions) {
        const verticalDistance = Math.abs(this.y() - targetDimensions.y);
        const baseBendDistance = targetDimensions.endX + 50;
        const bendOutDistance = baseBendDistance + targetDimensions.additionalBendDistance + (verticalDistance / 10);

        this._arrow = new Arrow(
          this._name.x() + this._name.width(),
          this._name.y() + this._name.height() / 2,
          targetDimensions.endX,
          targetDimensions.centerY
        );
        this._arrow.setMiddleX(bendOutDistance);
      }
    } else if (dataType.type === 'array' && stackFrame && name) {
      // TODO: DRAW ARROW TO ARRAY
    } else if (this._value instanceof Variable && typeof newValue === 'number') {
      const targetDataType: string =
        dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;

      this._value = new Variable(
        this._name.x() + this._name.width(),
        this.y(),
        newValue,
        targetDataType
      );
    }
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
