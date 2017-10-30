import { CLEAR_PENDING } from '../constants/actionTypes';

const clearPendingStates = (dispatch, combinedReducers) =>
  new Promise(async (resolve, reject) => {
    try {
      const clears = combinedReducers.map((reducer) => (
        dispatch({ type: `${CLEAR_PENDING}-${reducer.name}` })
      ));

      console.log('clears', clears);

      await Promise.all(clears);
      resolve();
    } catch(err) {
      reject();
    }
  });

export default clearPendingStates;
