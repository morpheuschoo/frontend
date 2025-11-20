import { DataType, StackFrame, StructSelfPointer } from 'src/ctowasm/dist';

import { ArrayValue } from './components/ui/ArrayValue';
import { PrimitiveVariable } from './components/ui/PrimitiveVariable';
import { StructValue } from './components/ui/StructValue';
import { CVisible } from './CVisible';

export function getVariableVis(
  address: bigint,
  dataType: DataType | StructSelfPointer,
  stackFrame: StackFrame,
  x: number,
  y: number
) {
  if (dataType.type === 'primary' || dataType.type === 'pointer') {
    return new PrimitiveVariable(address, stackFrame, dataType, x, y);
  } else if (dataType.type === 'array') {
    return new ArrayValue(address, stackFrame, dataType, x, y);
  } else if (dataType.type === 'struct') {
    return new StructValue(address, dataType, stackFrame, x, y);
  } else {
    throw new Error('NOT SUPPORTED BRO');
  }
}

/**
 * Mutates the provided `CVisible` collection by setting each element's horizontal position
 * so the components are arranged side by side with optional padding, returning the updated array and total width.
 */
export function sideBySide<T extends CVisible>(
  components: T[],
  padding = 0,
  offset = 0
): { components: T[]; totalWidth: number } {
  let currentX = offset;
  const updatedComponents = components.map((component, index) => {
    component.setX(currentX);
    currentX += component.width();
    if (index < components.length - 1) currentX += padding;
    return component;
  });

  return { components: updatedComponents, totalWidth: currentX - offset };
}

/**
 * Mutates the provided `CVisible` collection by setting each element's vertical position
 * so the components are arranged top to bottom with optional padding, returning the updated array and total height.
 */
export function topToBottom<T extends CVisible>(
  components: T[],
  padding = 0,
  offset = 0
): { components: T[]; totalHeight: number } {
  let currentY = offset;
  const updatedComponents = components.map((component, index) => {
    component.setY(currentY);
    currentY += component.height();
    if (index < components.length - 1) currentY += padding;
    return component;
  });

  return { components: updatedComponents, totalHeight: currentY - offset };
}
