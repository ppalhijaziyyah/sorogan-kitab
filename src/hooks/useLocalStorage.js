import { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return defaultValue;
  }
  try {
    const initial = JSON.parse(saved);
    return initial || defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
