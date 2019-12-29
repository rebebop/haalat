import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { scan, map } from 'rxjs/operators';

export type StateMutation<S> = (state: S) => S;
export type Reducer<S, P = void> = (state: S, actionPayload: P) => S;
type RootReducer<R, P> = (payload: P) => StateMutation<R>;

function createState<S>(stateMutators: Observable<StateMutation<S>>, initialState: S): BehaviorSubject<S> {
  const state = new BehaviorSubject<S>(initialState);
  stateMutators.pipe(scan((state: S, reducer: StateMutation<S>) => reducer(state), initialState)).subscribe(state);

  return state;
}

export function Store<S>(initialState: S) {
  const stateMutators = new Subject<StateMutation<S>>();
  const state: BehaviorSubject<S> = createState(stateMutators, initialState);

  function addModifier<P>(reducer: Reducer<S, P>) {
    const newActionObservable = new Subject<P>();
    const rootReducer: RootReducer<S, P> = (payload: P) => rootState => {
      return reducer(rootState, payload);
    };

    newActionObservable.pipe(map(rootReducer)).subscribe(rootStateMutation => {
      stateMutators.next(rootStateMutation);
    });

    return newActionObservable;
  }

  return {
    state,
    stateMutators,
    addModifier,
  };
}
