export function addToStorage(name, item, useSerializer = false) {
  localStorage.setItem(name, useSerializer ? JSON.stringify(item) : item);
}

export function getFromStorage(name, useDeserializer = false) {
  const item = localStorage.getItem(name);
  return useDeserializer ? JSON.parse(item) : item;
}

export function removeFromStorage(name) {
  localStorage.removeItem(name);
}
