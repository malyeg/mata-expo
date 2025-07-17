function getArrayMutations(arr: string[], perms: any = [], len = arr.length) {
  if (len === 1) {
    perms.push(arr.slice(0));
  }

  for (let i = 0; i < len; i++) {
    getArrayMutations(arr, perms, len - 1);

    len % 2 // parity dependent adjacent elements swap
      ? ([arr[0], arr[len - 1]] = [arr[len - 1], arr[0]])
      : ([arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]);
  }
  return perms;
}

function toSearchArray(
  value: string,
  separator = ' ',
  searchArray: string[] = [],
): string[] {
  const vArray = value
    .split(separator)
    .filter(i => !i.trim().match(/^(and|or|&|@|،|-|_|#|\.)$/g));

  if (vArray.length === 0) {
    return searchArray;
  }

  const newSearchArray = [...searchArray, ...vArray];

  vArray.forEach(v => {
    const vIndex = value.indexOf(separator + v + separator);
    newSearchArray.push(value.substring(vIndex));
  });

  const newValue = vArray.splice(0, vArray.length - 1).join(separator);
  if (newValue && newValue.length > 0) {
    return toSearchArray(
      newValue,
      separator,
      Array.from(new Set(newSearchArray)),
    );
  }

  return Array.from(new Set(newSearchArray));
}

const stringUtils = {getArrayMutations, toSearchArray};
export default stringUtils;
export {getArrayMutations, toSearchArray};
