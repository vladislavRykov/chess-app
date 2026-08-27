export const setlocalStorageData = (key: string, item: any) => {
  const itemToString = JSON.stringify(item);
  localStorage.setItem(key, itemToString);
};
export const getlocalStorageData = (key: string) => {
  const saved = localStorage.getItem(key);
  return saved && JSON.parse(saved);
};
export const removelocalStorageData = (key: string) => {
  localStorage.removeItem(key);
};
