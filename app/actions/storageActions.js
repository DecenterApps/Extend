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
