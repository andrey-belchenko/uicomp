/**
* DevExtreme (animation/frame.d.ts)
* Version: 24.1.3
* Build date: Tue Jun 11 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
*/
/**
 * Cancels an animation frame request scheduled with the requestAnimationFrame method.
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * Makes the browser call a function to update animation before the next repaint.
 */
export function requestAnimationFrame(callback: Function): number;
