import type { DomTargetDescriptor } from '@henriquecosta/react-debug-machine-shared';

export function serializeTarget(element: Element): DomTargetDescriptor {
    return {
        tagName: element.tagName,
        id: element.id || null,
        className: typeof element.className === 'string' && element.className ? element.className : null,
        selectorPath: buildSelectorPath(element),
    };
}

function buildSelectorPath(element: Element): string {
    const segments: string[] = [];
    let current: Element | null = element;

    while (current) {
        segments.unshift(describeSegment(current));
        if (current.id) break;
        current = current.parentElement;
    }

    return segments.join(' > ');
}

function describeSegment(element: Element): string {
    if (element.id) return `#${element.id}`;

    const tag = element.tagName.toLowerCase();
    const parent = element.parentElement;
    if (!parent) return tag;

    const siblingsOfSameTag = Array.from(parent.children).filter(
        (sibling) => sibling.tagName === element.tagName,
    );
    if (siblingsOfSameTag.length <= 1) return tag;

    const index = siblingsOfSameTag.indexOf(element) + 1;
    return `${tag}:nth-of-type(${index})`;
}
