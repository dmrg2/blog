import { createStore } from 'redux';
import Reducers from '../reducers/Reducers';

export default function Store(initialState) {
  return createStore(Reducers, initialState);
}
