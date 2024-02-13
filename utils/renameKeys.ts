export function renameKeys(obj: object) {
  return Object.keys(obj).reduce(
    (newObj, key) => ({
      ...newObj,
      ...{
        [key.replace(
          /_/g,
          Array.isArray(obj[key as keyof typeof obj]) ? "_" : " "
        )]: obj[key as keyof typeof obj],
      },
    }),
    {}
  );
}
