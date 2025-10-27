import { CVisible } from './CVisible';

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
