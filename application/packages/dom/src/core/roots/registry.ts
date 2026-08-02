import type { RootRegistry } from '../types/registry.types';

export function createRootRegistry(): RootRegistry {
    const roots = new Set<Element>();

    function register(root: Element): () => void {
        roots.add(root);
        return () => roots.delete(root);
    }

    function isWithinRegisteredRoot(target: Element): boolean {
        if (roots.size === 0) return true;
        for (const root of roots) {
            if (root.contains(target)) return true;
        }
        return false;
    }

    function getRoots(): readonly Element[] {
        return Array.from(roots);
    }

    return { register, isWithinRegisteredRoot, getRoots };
}
