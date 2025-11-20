import { DataType, StructSelfPointer } from 'src/ctowasm/dist';

import { CVisible } from '../../CVisible';

export abstract class VariableVis extends CVisible {
  protected readonly _address: bigint;
  protected readonly _dataType: DataType | StructSelfPointer;
  protected _type: 'PrimitiveValue' | 'StructValue' | 'StructField' | 'ArrayValue';

  constructor(
    address: bigint,
    dataType: DataType | StructSelfPointer,
    x: number,
    y: number,
    type: 'PrimitiveValue' | 'StructValue' | 'ArrayValue' | 'StructField'
  ) {
    super();
    this._x = x;
    this._y = y;

    this._address = address;
    this._dataType = dataType;

    this._type = type;
  }

  public type() {
    return this._type;
  }

  public address() {
    return this._address;
  }

  public dataType() {
    return this._dataType;
  }
}
