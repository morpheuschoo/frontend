import React from 'react';
import { Group } from 'react-konva';
import { Stash as CStash, StashItem as CStashItem } from 'src/ctowasm/dist';

import { defaultTextColor } from '../../../CseMachineUtils';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { StashItem } from './StashItem';

export class Stash extends CVisible {
  private readonly _stashItems: StashItem[] = [];

  constructor(stash: CStash, x: number, y: number) {
    super();

    // Position.
    this._x = x;
    this._y = y;

    // Create each StashItem.
    let stashItemX: number = this._x;
    for (const stashItem of stash.getStack()) {
      const stashItemText = this.getStashItemString(stashItem);
      const stashItemStroke = defaultTextColor();

      const currStashItem = new StashItem(stashItemX, this.y(), stashItemText, stashItemStroke);

      this._stashItems.push(currStashItem);
      stashItemX += currStashItem.width();
    }

    // Height and width.
    this._height = CControlStashMemoryConfig.StashItemHeight;
    this._width = stashItemX - this._x;
  }

  draw(): React.ReactNode {
    return <Group key={CseMachine.key++}>{this._stashItems.map(s => s.draw())}</Group>;
  }

  private getStashItemString = (stashItem: CStashItem): string => {
    switch (stashItem.type) {
      case 'IntegerConstant':
        return stashItem.value.toString();
      case 'FloatConstant':
        return stashItem.value.toString();
      case 'FunctionTableIndex': {
        const index = stashItem.index;
        if (
          !CseMachine.functions ||
          index.value < 0 ||
          index.value > CseMachine.functions.length - 1
        ) {
          throw new Error('Index of desired function is out of bounds or functions are undefined');
        }

        const functionName = CseMachine.functions[Number(index.value)];
        return functionName.functionName;
      }
      case 'MemoryAddress':
        return `0x${stashItem.value.toString(16).padStart(2, '0').toUpperCase()}`;
    }
  };
}
