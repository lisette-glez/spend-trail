export function renameKeys(obj) {
  return Object.keys(obj).reduce(
    (newObj, key) => ({
      ...newObj,
      // if element is Array don't remove underscore
      ...{ [key.replace(/_/g, Array.isArray(obj[key]) ? "_" : " ")]: obj[key] },
    }),
    {}
  );
}
