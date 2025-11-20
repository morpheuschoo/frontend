import { Group, Rect } from 'react-konva';
import { DataType, StackFrame, StructDataType, StructSelfPointer } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { getVariableVis } from '../../utils';
import { Text } from './Text';
import { VariableVis } from './VariableVis';

export class StructField extends VariableVis {
  private readonly _name: Text;
  private readonly _variable: VariableVis;

  constructor(
    name: string,
    address: bigint,
    parentStruct: StructDataType,
    dataType: DataType | StructSelfPointer,
    stackFrame: StackFrame,
    x: number,
    y: number
  ) {
    super(address, dataType, x, y, 'StructField');

    const targetDataType: string =
      dataType.type == 'primary' ? dataType.primaryDataType : dataType.type;

    this._name = new Text(
      targetDataType + ' ' + name + CConfig.VariableColon,
      defaultTextColor(),
      this.x() + CConfig.TextPaddingX,
      this.y()
    );

    const variableDataType: DataType = dataType.type === 'struct self pointer' ?
      { type: "pointer", pointeeType: parentStruct } : dataType;

    this._variable = getVariableVis(
      address,
      variableDataType,
      stackFrame,
      this._name.x() + this._name.width(),
      this.y()
    );

    // Align name to be vertically centered to variable;
    this._name.setY(this._variable.y() + this._variable.height() / 2 - this._name.height() / 2);

    this._height = this._variable.height();
    this._width = this._name.width() + this._variable.width() + 3 * CConfig.TextPaddingX;
  }

  draw(key?: number): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        {this._name.draw()}
        {this._variable.draw()}
      </Group>
    );
  }
}

export class StructValue extends VariableVis {
  private readonly structFields: StructField[] = [];

  constructor(
    address: bigint,
    dataType: StructDataType,
    stackFrame: StackFrame,
    x: number,
    y: number
  ) {
    super(address, dataType, x, y, 'StructValue');

    this._width = 0;
    this._height = CConfig.TextPaddingY;
    let currentY = CConfig.TextPaddingY;
    let currentAddress = address;
    for (const field of dataType.fields) {
      const currentField = new StructField(
        field.tag,
        currentAddress,
        dataType,
        field.dataType,
        stackFrame,
        0,
        currentY
      );

      this.structFields.push(currentField);
      this._width = Math.max(this._width, currentField.width());
      this._height += currentField.height() + CConfig.TextPaddingY;

      currentY += currentField.height() + CConfig.TextPaddingY;

      if (field.dataType.type === "struct self pointer") {
        currentAddress += BigInt(4);
      } else {
        currentAddress += BigInt(stackFrame.getTypeSize(field.dataType));
      }
    }
  }

  draw(key?: number): React.ReactNode {
    return (
      <Group key={CseMachine.key++} x={this.x()} y={this.y()}>
        <Rect
          width={this.width()}
          height={this.height()}
          stroke={defaultTextColor()}
          strokeWidth={2}
        />
        {this.structFields.map(field => field.draw())}
      </Group>
    );
  }
}
