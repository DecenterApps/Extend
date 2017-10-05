import store from 'store';

export const clearAll = () => { store.clearAll(); };

export const set = (key, data) => {
  store.set(key, data);
  return data;
};

export const get = (key) => {
  return store.get(key);
};
