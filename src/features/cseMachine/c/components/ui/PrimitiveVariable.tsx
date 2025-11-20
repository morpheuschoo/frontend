import { Group, Rect } from 'react-konva';
import { ScalarCDataType, ScalarDataType, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { Text } from './Text';
import { VariableVis } from './VariableVis';

export class PrimitiveVariable extends VariableVis {
  private readonly _value: string;
  private readonly _textValue: Text;

  constructor(
    address: bigint,
    stackFrame: StackFrame,
    dataType: ScalarDataType,
    x: number,
    y: number
  ) {
    super(address, dataType, x, y, 'PrimitiveValue');

    let targetDataType: ScalarCDataType;

    if (dataType.type === 'pointer') {
      targetDataType = dataType.type;
    } else {
      targetDataType = dataType.primaryDataType;
    }

    this._value = stackFrame.readPrimitiveValue(address, targetDataType);
    this._textValue = new Text(
      this._value,
      defaultTextColor(),
      this.x() + CConfig.TextPaddingX,
      this.y() + CConfig.TextPaddingY
    );

    this._height = this._textValue.height() + 2 * CConfig.TextPaddingY;
    this._width = this._textValue.width() + 2 * CConfig.TextPaddingX;
  }

  draw(key?: number): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        <Rect
          x={this.x()}
          y={this.y()}
          height={this.height()}
          width={this.width()}
          stroke={defaultTextColor()}
          strokeWidth={2}
        />
        {this._textValue.draw()}
      </Group>
    );
  }
}
