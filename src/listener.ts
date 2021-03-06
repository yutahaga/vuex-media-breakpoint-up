/**
 * Used to detect browser support for adding an event listener with options
 * Credit: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
let supportsCaptureOption = false;

/* tslint:disable no-empty */
try {
  const opts = Object.defineProperty({}, 'capture', {
    get() {
      supportsCaptureOption = true;
    }
  });
  window.addEventListener('test', () => {}, opts);
} catch (e) {}
/* tslint:enable no-empty */

/**
 * Helper to create a safety event listener options
 *
 */
export const createSafetyEventListenerOptions = (
  options?: boolean | AddEventListenerOptions
) => {
  return !supportsCaptureOption && typeof options === 'object'
    ? options.capture
    : options;
};

/**
 * Helper to add an event listener with an options object in supported browsers
 */
export const addEventListener = (
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => {
  target.addEventListener(
    type,
    listener,
    createSafetyEventListenerOptions(options)
  );
};

/**
 * Helper to remove an event listener with an options object in supported browsers
 */
export const removeEventListener = (
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => {
  target.removeEventListener(
    type,
    listener,
    createSafetyEventListenerOptions(options)
  );
};
