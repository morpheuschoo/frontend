import { Visible } from '../components/Visible';

export abstract class CVisible extends Visible {
  constructor() {
    super();
  }

  setX(x: number): void {
    this._x = x;
  }

  setY(y: number): void {
    this._y = y;
  }
}
