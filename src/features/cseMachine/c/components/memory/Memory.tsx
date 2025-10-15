import React from 'react';
import { Group } from 'react-konva';
import { Memory as CMemory, StackFrame } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { StackVis } from '../Stack/StackVis';

export class Memory extends CVisible {
  textProps = {
    fill: defaultTextColor(),
    padding: CControlStashMemoryConfig.ControlItemTextPadding,
    fontFamily: CControlStashMemoryConfig.FontFamily,
    fontSize: CControlStashMemoryConfig.FontSize,
    fontStyle: CControlStashMemoryConfig.FontStyle,
    fontVariant: CControlStashMemoryConfig.FontVariant
  };

  memory: CMemory;
  stack: StackVis;

  constructor(memory: CMemory, frames: StackFrame[]) {
    super();
    this.memory = memory;

    this._x =
      CControlStashMemoryConfig.ControlPosX +
      CControlStashMemoryConfig.ControlItemWidth +
      2 * CConfig.CanvasPaddingX +
      CConfig.FrameMaxWidth;

    this._y =
      CControlStashMemoryConfig.StashPosY +
      CControlStashMemoryConfig.StashItemHeight +
      2 * CConfig.CanvasPaddingY;

    this._width = CControlStashMemoryConfig.memoryRowWidth;

    this.stack = new StackVis(memory, frames);
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        {this.stack.draw()}
      </Group>
    );
  }
}
