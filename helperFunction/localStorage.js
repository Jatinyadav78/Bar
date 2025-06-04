//===========Local storage get set remove================

export const setLocalStorage = (key, value) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing local storage for key "${key}":`, error);
    return null;
  }
};
export const getLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    console.log(value)
    if (!value) {
      throw new Error("No key found");
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error accessing local storage for key "${key}":`, error);
    return null;
  }
};
export const removeItemLocalStorage = (keys) => {
  try {
    return keys.map((keyName) => {
      localStorage.removeItem(keyName);
    });
  } catch (error) {
    console.error(`Error removing local storage  keys "${keys}":`, error);
    return null;
  }
};

export const isAuthenticated = (key) => {
  const userData = localStorage.getItem(key);
  console.log("🚀 ~ isAuthenticated ~ userData:", userData);
  return userData ? true : false;
};
