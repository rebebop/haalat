import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { scan, map, distinctUntilChanged } from 'rxjs/operators';

import { StateMutation, Reducer, RootReducer, Store, Listener } from './types';
import { shallowEqual } from './util';

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

  /**
   * Adds an action and reducer as modifier
   * @param reducer
   */
  function addModifier<P>(reducer: Reducer<S, P>): Subject<P> {
    const actionObservable = new Subject<P>();

    const rootReducer: RootReducer<S, P> = (payload: P) => (rootState: S): S => {
      return reducer(rootState, payload);
    };

    actionObservable.pipe(map(rootReducer)).subscribe(rootStateMutation => {
      stateMutators.next(rootStateMutation);
    });

    return actionObservable;
  }

  /**
   * Adds a listener to a specific modifier which will run everytime that modifier is run
   * @param modifier
   * @param listener
   */
  function addListener<P>(modifier: Subject<P>, listener: Listener<S, P>): void {
    modifier.subscribe((payload: P) => listener(state.getValue(), payload));
  }

  /**
   * Selects a specific slice of the state and return the subscription to it
   * @param selectorFn
   */
  function select<F = S>(selectorFn: (state: S) => F): Observable<F> {
    return state.pipe(
      map(selectorFn),
      distinctUntilChanged((a, b) => shallowEqual(a, b)),
    );
  }

  return {
    state,
    addModifier,
    addListener,
    select,
  };
}
