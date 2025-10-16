export class BindingDimensions {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
    readonly additionalBendDistance: number,
  ) {}

  get endX(): number {
    return this.x + this.width;
  }

  get endY(): number {
    return this.y + this.height;
  }

  get centerX(): number {
    return this.x + this.width / 2;
  }

  get centerY(): number {
    return this.y + this.height / 2;
  }
}
