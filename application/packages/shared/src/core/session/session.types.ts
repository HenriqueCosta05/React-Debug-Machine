import { EventBus } from "../events/events.bus";
import { Timeline } from "../timeline/timeline";

export type Session = {
    id: string;
    startedAt: number;
};

export type DebugSession = {
    session: Session;
    bus: EventBus;
    timeline: Timeline;
    end: () => void;
};