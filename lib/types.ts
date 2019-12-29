import { Subject, BehaviorSubject } from 'rxjs';

export type StateMutation<S> = (state: S) => S;

export type Reducer<S, P = void> = (state: S, actionPayload: P) => S;

export type RootReducer<R, P> = (payload: P) => StateMutation<R>;

export type Store<S> = {
  state: BehaviorSubject<S>;
  addModifier: <P>(reducer: Reducer<S, P>) => Subject<P>;
};
