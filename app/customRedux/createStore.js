import { get, set } from './store';

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
      const reducerState = await initReducer(reducerData);

      store.state[reducerData.name] = reducerState;
      store.reducers[reducerData.name] = reducerData.handle;

      if (index === reducersData.length - 1) resolve(store);
    });
  });


const createStore = async (reducersData) => {
  const combinedReducers = await combineReducers(reducersData);

  let state = combinedReducers.state;
  const reducers = combinedReducers.reducers;

  return {
    getState: () => state,
    dispatch: (action) =>
      new Promise(async (resolve) => {
        let resolved = false;

        Object.keys(reducers).forEach(async (reducerName, index) => {
          const reducer = reducers[reducerName];
          const reducerState = state[reducerName];

          const newReducerState = reducer(reducerState, action);

          if (!newReducerState) return;

          const setResult = await set(reducerName, newReducerState);
          resolved = true;
          state[reducerName] = setResult;

          if (index === reducers.length - 1) {
            if (resolved) resolve(state[reducerName]);
            throw Error('Dispatch was not handled in any reducer', action);
          }
        });
      })
  };
};

export default createStore;
