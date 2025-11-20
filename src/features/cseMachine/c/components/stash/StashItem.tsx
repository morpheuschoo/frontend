import React from 'react';
import {
  Group as KonvaGroup,
  Label as KonvaLabel,
  Tag as KonvaTag,
  Text as KonvaText
} from 'react-konva';

import { getTextWidth } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { defaultTextProps, ShapeDefaultProps } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

export class StashItem extends CVisible {
  constructor(
    x: number,
    y: number,
    private readonly _text: string,
    private readonly _stroke: string
  ) {
    super();

    // Position.
    this._x = x;
    this._y = y;

    // Height and width.
    this._height =
      CControlStashMemoryConfig.StashItemHeight +
      CControlStashMemoryConfig.StashItemTextPadding * 2;
    this._width = CControlStashMemoryConfig.StashItemTextPadding * 2 + getTextWidth(this._text);
  }

  draw(): React.ReactNode {
    const tagProps = {
      stroke: this._stroke,
      cornerRadius: CControlStashMemoryConfig.StashItemCornerRadius
    };

    return (
      <KonvaGroup key={CseMachine.key++}>
        <KonvaLabel x={this.x()} y={this.y()} key={CseMachine.key++}>
          <KonvaTag {...ShapeDefaultProps} {...tagProps} key={CseMachine.key++} />
          <KonvaText
            {...ShapeDefaultProps}
            {...defaultTextProps}
            text={this._text}
            key={CseMachine.key++}
          />
        </KonvaLabel>
      </KonvaGroup>
    );
  }
}
