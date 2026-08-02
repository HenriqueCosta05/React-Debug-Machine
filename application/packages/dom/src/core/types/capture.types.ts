import type { RootRegistry } from './registry.types';

export type CaptureOptions = {
    eventTypes?: readonly string[];
    documentRef?: Document;
    rootRegistry?: RootRegistry;
};
