import { Group } from 'react-konva';
import { StackFrame } from 'src/ctowasm/dist';

import { Line } from '../../../java/components/Line';
import { Obj } from '../../../java/components/Object';
import { CControlStashMemoryConfig } from '../../config/CControlStashMemoryConfig';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { Frame } from './Frame';
import { BindingDimensionMap } from '../ui/binding/BindingDimensionMap';

export class Environment extends CVisible {
  private readonly _methodFrames: Frame[] = [];
  private readonly _objects: Obj[] = [];
  private readonly _classFrames: Frame[] = [];
  private readonly _lines: Line[] = [];
  private readonly bindingDimensionMap: BindingDimensionMap = new BindingDimensionMap();

  constructor(stackFrames: StackFrame[]) {
    super();

    // Position.
    this._x =
      CControlStashMemoryConfig.ControlPosX +
      CControlStashMemoryConfig.ControlItemWidth +
      2 * CConfig.CanvasPaddingX;
    this._y =
      CControlStashMemoryConfig.StashPosY +
      CControlStashMemoryConfig.StashItemHeight +
      2 * CConfig.CanvasPaddingY;

    // Create method frames.
    const methodFramesX = this._x;
    let methodFramesY: number = this._y;
    let methodFramesWidth = Number(CConfig.FrameMinWidth);

    const reversedFrames = [...stackFrames].reverse();
    let parentFrame: Frame | undefined = undefined;

    reversedFrames.forEach(frame => {
      const stroke = '#999';
      const newFrame = new Frame(frame, methodFramesX, methodFramesY, stroke, this.bindingDimensionMap);
      this._methodFrames.push(newFrame);
      methodFramesY += newFrame.height() + CConfig.FramePaddingY;
      methodFramesWidth = Math.max(methodFramesWidth, newFrame.width());

      if (parentFrame) {
        newFrame.setParent(parentFrame);
      }
      parentFrame = newFrame;
    });

    this._methodFrames.forEach(frame => frame.updateValues());
  }

  get classes() {
    return this._classFrames;
  }

  get objects() {
    return this._objects.flatMap(obj => obj.frames);
  }

  get frames() {
    return this._methodFrames;
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++}>
        {this._methodFrames.map(f => f.draw())}
        {this._objects.flatMap(obj => obj.frames).map(f => f.draw())}
        {this._classFrames.map(f => f.draw())}
        {this._lines.map(f => f.draw())}
      </Group>
    );
  }
}
