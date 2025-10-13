import React from 'react';

import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';

export class MemorySegment extends CVisible {
  leftPointer: integer;
  rightPointer: integer;

  constructor(
    leftPointer: integer,
    rightPointer: integer,
    readonly highlightOnHover?: () => void,
    readonly unhighlightOnHover?: () => void
  ) {
    super();

    this.leftPointer = leftPointer;
    this.rightPointer = rightPointer;
  }

  draw(): React.ReactNode {
    return <div key={CseMachine.key++}>MEMORY SEGMENT</div>;
  }
}
