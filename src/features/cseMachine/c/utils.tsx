import React from "react";

import { CVisible } from "./CVisible";

/**
 * Mutates the provided `CVisible` collection by setting each element's horizontal position
 * so the components are arranged side by side with optional padding, returning the updated array.
 */
export function sideBySide(components: CVisible[], padding = 0): CVisible[] {
  let currentX = 0;
  return components.map((component, index) => {
    component.setX(currentX);
    currentX += component.width();
    if (index < components.length - 1) currentX += padding;
    return component;
  });
}

/**
 * Mutates the provided `CVisible` collection by setting each element's vertical position
 * so the components are arranged top to bottom with optional padding, returning the updated array.
 */
export function topToBottom(components: CVisible[], padding = 0): CVisible[] {
  let currentY = 0;
  return components.map((component, index) => {
    component.setY(currentY);
    currentY += component.height();
    if (index < components.length - 1) currentY += padding;
    return component;
  });
}
