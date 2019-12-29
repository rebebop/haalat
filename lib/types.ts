import { BehaviorSubject, Subject, Observable } from 'rxjs';

export type StateMutation<S> = (state: S) => S;

export type Reducer<S, P = void> = (state: S, actionPayload: P) => S;

export type RootReducer<R, P> = (payload: P) => StateMutation<R>;

export type Listener<S, P> = (state: S, payload: P) => void;

export type Store<S> = {
  state: BehaviorSubject<S>;
  addModifier: <P>(reducer: Reducer<S, P>) => Subject<P>;
  addListener: <P>(modifier: Subject<P>, listener: Listener<S, P>) => void;
  select: <F = S>(selectorFn: (state: S) => F) => Observable<F>;
};
