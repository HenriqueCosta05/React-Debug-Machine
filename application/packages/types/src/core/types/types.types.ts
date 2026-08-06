/** EventTarget surface needed by startTypesCapture — lets tests pass a fake target. */
export type TypesCaptureTarget = Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
