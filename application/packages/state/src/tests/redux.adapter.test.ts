import { describe, expect, it, rstest } from '@rstest/core';
import { combineReducers, createStore } from 'redux';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startReduxCapture } from '../core/adapters/redux.adapter';

type CounterState = { count: number };
type CounterAction = { type: 'increment' };

function counterReducer(state: CounterState = { count: 0 }, action: CounterAction): CounterState {
    if (action.type === 'increment') return { count: state.count + 1 };
    return state;
}

function userReducer(state = { name: 'anon' }) {
    return state;
}

const rootReducer = combineReducers({ counter: counterReducer, user: userReducer });

describe('startReduxCapture', () => {
    it('publica before/after a cada dispatch que muda o state', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const store = createStore(counterReducer);

        startReduxCapture(bus, store, 'counter');
        store.dispatch({ type: 'increment' });

        expect(handler).toHaveBeenCalledWith(expect.objectContaining({
            type: 'state',
            data: { origin: 'redux', label: 'counter', before: { count: 0 }, after: { count: 1 } },
        }));
    });

    it('usa label padrão "store" quando não informado', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const store = createStore(counterReducer);

        startReduxCapture(bus, store);
        store.dispatch({ type: 'increment' });

        expect(handler).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ label: 'store' }),
        }));
    });

    it('stop() cancela o subscribe: dispatch subsequente não publica', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const store = createStore(counterReducer);

        const stop = startReduxCapture(bus, store);
        stop();
        store.dispatch({ type: 'increment' });

        expect(handler).not.toHaveBeenCalled();
    });

    it('com sliceKeys, publica 1 evento só pra chave que mudou', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const store = createStore(rootReducer);

        startReduxCapture(bus, store, 'root', ['counter', 'user']);
        store.dispatch({ type: 'increment' });

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({
            type: 'state',
            data: { origin: 'redux', label: 'root.counter', before: { count: 0 }, after: { count: 1 } },
        }));
    });

    it('com sliceKeys, não publica nada se nenhuma das chaves mudou', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const store = createStore(rootReducer);

        startReduxCapture(bus, store, 'root', ['counter', 'user']);
        store.dispatch({ type: 'noop' });

        expect(handler).not.toHaveBeenCalled();
    });
});
