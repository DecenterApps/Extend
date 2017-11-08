import PQueue from 'p-queue';
import { get, set, clearReducer } from './store';
import { CLEAR_PENDING } from '../constants/actionTypes';

const queue = new PQueue({ concurrency: 1 });

/**
 * Load reducer state from chrome local store if it was already saved there.
 * If it wasn't then it saves initial state to chrome local store
 *
 * @param reducerData Object that has reducer name initial state and handle function
 */
const initReducer = async (reducerData) =>
  new Promise(async (resolve) => {
    // await clearReducer(reducerData.name); // remove when finished

    const existingReducerState = await get(reducerData.name);

    if (existingReducerState === undefined) {
      await set(reducerData.name, reducerData.initialState);
      resolve(reducerData.initialState);
    }

    resolve(existingReducerState);
  });

/**
 * Loads all reducer states from chrome local store if it was already saved there.
 * If it wasn't then it saves that reducers initial state to chrome local store
 *
 * @param reducersData Array of objects that have reducer names,
 * initial states and handle function
 */
const combineReducers = (reducersData) =>
  new Promise((resolve) => {
    const store = {
      state: {},
      reducers: {}
    };

    reducersData.forEach(async (reducerData, index) => {
      store.state[reducerData.name] = await initReducer(reducerData);
      store.reducers[reducerData.name] = reducerData.handle;

      if (index === reducersData.length - 1) resolve(store);
    });
  });

/**
 * Checks if action went to all reducers and handles if all the reducers were checked
 *
 * @param {Number} reducersFinished
 * @param {Object} reducers
 * @param {Boolean} resolved - if any reducer handled the action
 * @param {Function} resolve - dispatch promise resolver
 * @param {Object} state
 * @param {Object} action
 * @param {String} reducerName
 */
const handleReducerFinish = (reducersFinished, reducers, resolved, resolve, state, action, reducerName) => {
  if (reducersFinished !== Object.keys(reducers).length) return;

  if (resolved) {
    resolve(state[reducerName]);
  } else {
    if (action.type.includes(CLEAR_PENDING)) {
      resolve();
      return;
    }

    throw Error('Dispatch was not handled in any reducer', action);
  }
};


// TODO Try to clean this code up
/**
 * Goes through all reducers and checks if there was any state before starting the app.
 * Creates getState and dispatch functions
 *
 * @param {Object} reducersData - reducers names and handlers
 */
const createStore = (reducersData) =>
  new Promise(async (resolve) => {
    const combinedReducers = await combineReducers(reducersData);

    let state = combinedReducers.state;
    const reducers = combinedReducers.reducers;

    resolve({
      getState: () => state,
      dispatch: (action) => {
        const handleDispatchAction = () =>
          new Promise(async (dispatchResolve) => {
            let resolved = false;
            let reducersFinished = 0;

            Object.keys(reducers).forEach(async (reducerName) => {
              const reducer = reducers[reducerName];
              const reducerState = state[reducerName];

              const newReducerState = reducer(reducerState, action);

              if (!newReducerState) {
                reducersFinished++;
                handleReducerFinish(reducersFinished, reducers, resolved, dispatchResolve, state, action, reducerName);
                return;
              }

              const setResult = await set(reducerName, newReducerState);
              console.log('ACTION', action);
              resolved = true;
              state[reducerName] = setResult;

              reducersFinished++;
              handleReducerFinish(reducersFinished, reducers, resolved, dispatchResolve, state, action, reducerName);
            });
          });

        return queue.add(handleDispatchAction);
      }
    });
  });

export default createStore;
