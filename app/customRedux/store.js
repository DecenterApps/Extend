import reducersData from '../background/src/reducers/index';

export const subscribe = (callback) => {
  chrome.storage.onChanged.addListener(callback);
};

export const set = (key, data) =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [key]: data }, () => {
      resolve(data);
    });
  });

export const get = (key) =>
  new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => {
      resolve(data[key]);
    });
  });

export const clearReducer = (key) =>
  new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve(key);
    });
  });

export const getState = () =>
  new Promise(async (resolve) => {
    const state = {};

    reducersData.forEach(async (reducerData, index) => {
      state[reducerData.name] = await get(reducerData.name);

      if (index === reducersData.length - 1) resolve(state);
    });
  });
