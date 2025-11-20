import { Group } from 'react-konva';
import { StackFrame } from 'src/ctowasm/dist';

import { Line } from '../../../java/components/Line';
import { Obj } from '../../../java/components/Object';
import { CConfig } from '../../config/CCSEMachineConfig';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { BindingDimensionMap } from '../ui/binding/BindingDimensionMap';
import { Frame } from './Frame';

export class Environment extends CVisible {
  private readonly _methodFrames: Frame[] = [];
  private readonly _objects: Obj[] = [];
  private readonly _classFrames: Frame[] = [];
  private readonly _lines: Line[] = [];
  private readonly bindingDimensionMap: BindingDimensionMap = new BindingDimensionMap();

  constructor(stackFrames: StackFrame[], x: number, y: number) {
    super();

    // Position.
    this._x = x;
    this._y = y;

    // Create method frames.
    const methodFramesX: number = this.x();
    let methodFramesY: number = this.y();
    let methodFramesWidth = Number(CConfig.FrameMinWidth);

    const reversedFrames = [...stackFrames].reverse();
    let parentFrame: Frame | undefined = undefined;

    reversedFrames.forEach(frame => {
      const stroke = '#999';
      const newFrame = new Frame(
        frame,
        methodFramesX,
        methodFramesY,
        stroke,
        this.bindingDimensionMap
      );
      this._methodFrames.push(newFrame);
      methodFramesY += newFrame.height() + CConfig.FramePaddingY;
      methodFramesWidth = Math.max(methodFramesWidth, newFrame.width());

      if (parentFrame) {
        newFrame.setParent(parentFrame);
      }
      this._width = Math.max(this._width, newFrame.width());
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
