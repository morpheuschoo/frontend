import { BindingDimensions } from './BindingDimensions';

export class BindingDimensionMap {
  public readonly dimensions: Map<number, BindingDimensions>;

  constructor() {
    this.dimensions = new Map();
  }

  register(
    address: number,
    x: number,
    y: number,
    width: number,
    height: number,
    additionalBendDistance: number
  ) {
    this.dimensions.set(
      address,
      new BindingDimensions(x, y, width, height, additionalBendDistance)
    );
  }

  getDimensions(address: number): BindingDimensions | undefined {
    return this.dimensions.get(address);
  }

  clear() {
    this.dimensions.clear();
  }
}
