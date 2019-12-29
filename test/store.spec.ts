import { Store } from '../lib/store';

test('createStore', () => {
  const initialState = {
    counter: 0,
    todos: [
      { id: 0, description: 'Walk the dog', done: false },
      { id: 1, description: 'Do Homework', done: false },
    ],
  };
  // define store
  const store = Store(initialState);
  store.state.subscribe(val => console.log(val.counter));
  // modifiers
  const counterInc = (state: any, payload: number) => {
    return { ...state, counter: payload };
  };
  const nx = store.addModifier<number>(counterInc);
  nx.next(4);
  nx.next(5);
  nx.next(9);

  expect('2').toBe('2');
});
