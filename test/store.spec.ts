import { createStore } from '../lib/store';

type Todo = {
  id: number;
  description: string;
  done: boolean;
};

type AppState = {
  counter: number;
  todos: Todo[];
};

let initialState: AppState;
beforeEach(() => {
  initialState = {
    counter: 0,
    todos: [
      { id: 0, description: 'Walk the dog', done: false },
      { id: 1, description: 'Do Homework', done: false },
    ],
  };
});

test('createStore sets the correct initial state', done => {
  const store = createStore<AppState>(initialState);
  store.state.subscribe(val => {
    expect(val.counter).toBe(0);
    expect(val.todos.length).toBe(2);
    done();
  });
});

test('select returns a slice of the state', done => {
  const store = createStore<AppState>(initialState);
  const storeSlice = store.select<number>((state: AppState) => {
    return state.counter;
  });
  storeSlice.subscribe((val: number) => {
    expect(val).toBe(0);
    done();
  });
});

test('addModifier modifies the state on action', done => {
  const store = createStore<AppState>(initialState);
  const counterInc = store.addModifier<number>((state: AppState, payload: number) => {
    return { ...state, counter: payload };
  });

  counterInc.next(5);
  store.state.subscribe(val => {
    expect(val.counter).toBe(5);
    done();
  });
});