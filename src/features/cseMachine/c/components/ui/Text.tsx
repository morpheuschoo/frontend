import React from 'react';
import { Group as KonvaGroup, Label as KonvaLabel, Text as KonvaText } from 'react-konva';

import { getTextWidth } from '../../../CseMachineUtils';
import { CConfig, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

/** this class encapsulates a string to be drawn onto the canvas */
export class Text extends CVisible {
  constructor(
    private readonly _text: string,
    private readonly _fontColour: string,
    x: number,
    y: number,
    
  ) {
    super();

    // Position
    this._x = x;
    this._y = y;

    // Height and width
    this._height = CConfig.FontSize;
    this._width = getTextWidth(this._text);
  }

  get text() {
    return this._text;
  }

  setY(y: number) {
    this._y = y;
  }

  draw(): React.ReactNode {
    const props = {
      fontFamily: CConfig.FontFamily,
      fontSize: CConfig.FontSize,
      fontStyle: CConfig.FontStyle,
      fill: this._fontColour
    };

    return (
      <KonvaGroup key={CseMachine.key++}>
        <KonvaLabel x={this.x()} y={this.y()} key={CseMachine.key++}>
          <KonvaText {...ShapeDefaultProps} key={CseMachine.key++} text={this._text} {...props} />
        </KonvaLabel>
      </KonvaGroup>
    );
  }
}
