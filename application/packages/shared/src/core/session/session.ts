import { createEventBus } from '../events/events.bus';
import { createTimeline } from '../timeline/timeline';
import { DebugSession, Session } from './session.types';

function createSessionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `session-${Date.now()}`;
}

export function createDebugSession(): DebugSession {
    const session: Session = { id: createSessionId(), startedAt: Date.now() };
    const bus = createEventBus();
    const timeline = createTimeline(bus);

    function end(): void {
        timeline.stop();
    }

    return { session, bus, timeline, end };
}
