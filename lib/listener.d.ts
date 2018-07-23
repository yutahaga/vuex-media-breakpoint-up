/**
 * Helper to create a safety event listener options
 *
 */
export declare const createSafetyEventListenerOptions: (options?: boolean | AddEventListenerOptions | undefined) => boolean | AddEventListenerOptions | undefined;
/**
 * Helper to add an event listener with an options object in supported browsers
 */
export declare const addEventListener: (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
/**
 * Helper to remove an event listener with an options object in supported browsers
 */
export declare const removeEventListener: (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => void;
