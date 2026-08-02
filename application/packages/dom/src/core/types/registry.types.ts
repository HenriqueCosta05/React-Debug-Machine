export type RootRegistry = {
    register: (root: Element) => () => void;
    isWithinRegisteredRoot: (target: Element) => boolean;
    getRoots: () => readonly Element[];
};
