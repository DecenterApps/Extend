import { get, set, clearReducer } from './storageActions';

Object.resolve = (path, obj) => (
  path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj || self)
);

const swap = (arr, i, j) => {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

const partition = (arr, pivot, left, right) => {
    let pivotValue = arr[pivot],
        partitionIndex = left;

    for(let i = left; i < right; i++){
        if(arr[i] < pivotValue){
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
};


export const quickSort = (arr, left, right) => {
    let pivot, partitionIndex;

    if(left < right){
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
};

export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const initReducer = async (reducerData) =>
  new Promise(async (resolve) => {
    await clearReducer(reducerData.name); // remove when finished

    if ((await get(reducerData.name)) === undefined) {
      await set(reducerData.name, reducerData.initialState);
      resolve();
    }

    resolve();
  });

export const createReducerData = (name, initialState) => ({
  name, initialState
});

export const getState = async (reducer, path) => {
  const reducerState = await get(reducer);

  if (!path) return reducerState;
  return Object.resolve(path, reducerState);
};

export const initReducers = (reducersData) =>
  new Promise((resolve) => {
    reducersData.forEach(async (reducerData, index) => {
      await initReducer(reducerData);

      if (index === reducersData.length - 1) resolve();
    });
  });
