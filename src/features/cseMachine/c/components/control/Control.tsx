import { Group } from 'react-konva';
import {
  Control as CControl,
  ControlItem as CControlItem,
  controlItemToString
} from 'src/ctowasm/dist';

import { defaultActiveColor, defaultStrokeColor } from '../../../CseMachineUtils';
import { CseMachine } from '../../CseMachine';
import { CVisible } from '../../CVisible';
import { ControlItem } from './ControlItem';

export class Control extends CVisible {
  private readonly _controlItems: ControlItem[] = [];

  isEmpty(): boolean {
    return this._controlItems.length == 0;
  }

  constructor(control: CControl, x: number, y: number) {
    super();

    // Position.
    this._x = x;
    this._y = y;

    // Create each ControlItem.
    let controlItemY: number = this._y;
    control.getStack().forEach((controlItem: CControlItem, index: number) => {
      const controlItemText = controlItemToString(controlItem);

      const controlItemStroke =
        index === control.getStack().length - 1 ? defaultActiveColor() : defaultStrokeColor();

      const controlItemTooltip = this.getControlItemTooltip(controlItem);

      const highlightOnHover = () => {
        let start = -1;
        let end = -1;
        if (controlItem.position) {
          start = controlItem.position.start.line - 1;
          end = controlItem.position.end.line - 1;
        }
        CseMachine.setEditorHighlightedLines([[start, end]]);
      };
      const unhighlightOnHover = () => CseMachine.setEditorHighlightedLines([]);

      const currControlItem = new ControlItem(
        this.x(),
        controlItemY,
        controlItemText,
        controlItemStroke,
        controlItemTooltip,
        highlightOnHover,
        unhighlightOnHover
      );

      this._controlItems.push(currControlItem);
      controlItemY += currControlItem.height();
    });

    this._height = this._controlItems.reduce<number>((prev, current) => prev + current.height(), 0);
    this._width = this._controlItems.reduce<number>(
      (prev, current) => Math.max(prev, current.width()),
      0
    );
  }

  draw(): React.ReactNode {
    return (
      <Group key={CseMachine.key++} ref={this.ref}>
        {this._controlItems.map(c => c.draw())}
      </Group>
    );
  }

  private getControlItemTooltip = (controlItem: CControlItem): string => {
    switch (controlItem.type) {
      default:
        return 'INSTRUCTION';
    }
  };
}
