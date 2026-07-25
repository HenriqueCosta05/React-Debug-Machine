import { DebugEvent } from "./events.types"

export const EventBusEvents = {
    dom: (event: DebugEvent) => {
        console.log('DOM Event:', event); // TODO: Implement actual DOM event handling logic here
    },
    network: (event: DebugEvent) => {
        console.log('Network Event:', event); // TODO: Implement actual network event handling logic here
    },
    console: (event: DebugEvent) => {
        console.log('Console Event:', event); // TODO: Implement actual console event handling logic here
    },
    state: (event: DebugEvent) => {
        console.log('State Event:', event); // TODO: Implement actual state event handling logic here
    },
    typescript: (event: DebugEvent) => {
        console.log('TypeScript Event:', event); // TODO: Implement actual TypeScript event handling logic here
    },
    custom: (event: DebugEvent) => {
        console.log('Custom Event:', event); // TODO: Implement actual custom event handling logic here
    }
}

export const EventBus = (origin: DebugEvent['type']) => {
    return {
        origin,
        originalFn: EventBusEvents[origin],
        replayFn: EventBusEvents[origin]
    }
}