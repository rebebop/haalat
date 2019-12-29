import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { scan, map } from 'rxjs/operators';

import { StateMutation, Reducer, RootReducer, Store, Modifier } from './types';

function createState<S>(
  stateMutators: Observable<StateMutation<S>>,
  initialState: S,
): BehaviorSubject<S> {
  const state = new BehaviorSubject<S>(initialState);
  stateMutators
    .pipe(scan((state: S, reducer: StateMutation<S>) => reducer(state), initialState))
    .subscribe(state);

  return state;
}

export function createStore<S>(initialState: S): Store<S> {
  const stateMutators = new Subject<StateMutation<S>>();
  const state: BehaviorSubject<S> = createState(stateMutators, initialState);

  function addModifier<P>(reducer: Reducer<S, P>): Modifier<P> {
    const actionObservable = new Subject<P>();

    const rootReducer: RootReducer<S, P> = (payload: P) => (rootState: S): S => {
      return reducer(rootState, payload);
    };

    actionObservable.pipe(map(rootReducer)).subscribe(rootStateMutation => {
      stateMutators.next(rootStateMutation);
    });

    return (payload: P): void => actionObservable.next(payload);
  }

  return {
    state,
    addModifier,
  };
}
