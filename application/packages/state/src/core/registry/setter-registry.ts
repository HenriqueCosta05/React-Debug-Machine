export type StateSetter = (next: unknown) => void;

export function createStateSetterRegistry() {
    const setters = new Map<string, StateSetter>();

    function register(label: string, setter: StateSetter): () => void {
        setters.set(label, setter);
        return () => setters.delete(label);
    }

    function get(label: string): StateSetter | undefined {
        return setters.get(label);
    }

    return { register, get };
}

export type StateSetterRegistry = ReturnType<typeof createStateSetterRegistry>;
