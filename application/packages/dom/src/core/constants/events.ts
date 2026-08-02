export const DEFAULT_EVENT_TYPES = [
    'click', 'dblclick', 'input', 'change', 'submit', 'keydown', 'keyup', 'focus', 'blur',
] as const;

export const MOUSE_EVENT_TYPES = new Set(['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout']);
export const KEYBOARD_EVENT_TYPES = new Set(['keydown', 'keyup', 'keypress']);
export const FOCUS_EVENT_TYPES = new Set(['focus', 'blur', 'focusin', 'focusout']);
