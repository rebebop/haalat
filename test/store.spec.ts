import { createStore } from '../lib/store';

type Todo = {
  id: number;
  description: string;
  done: boolean;
};

type InitialState = {
  counter: number;
  todos: Todo[];
};

test('createStore', () => {
  const initialState: InitialState = {
    counter: 0,
    todos: [
      { id: 0, description: 'Walk the dog', done: false },
      { id: 1, description: 'Do Homework', done: false },
    ],
  };

  // define store
  const store = createStore<InitialState>(initialState);
  store.state.subscribe(val => console.log(val.counter));

  // modifiers
  const counterInc = store.addModifier<number>((state: InitialState, payload: number) => {
    return { ...state, counter: payload };
  });
  counterInc(4);
  counterInc(6);
  counterInc(9);

  expect('2').toBe('2');
});
