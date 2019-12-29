import { createStore } from './lib/store';

const initialState = {
  counter: 0,
  todos: [
    { id: 0, description: 'Walk the dog', done: false },
    { id: 1, description: 'Do Homework', done: false },
  ],
};
// define store
const store = createStore(initialState);
store.state.subscribe(val => console.log(val.counter));

// modifiers
const counterInc = (state: any, payload: number) => {
  return { ...state, counter: payload };
};

// add modifier on state
