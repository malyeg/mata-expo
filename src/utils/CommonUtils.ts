// export function delay(time: number) {
//   return new Promise((resolve) => {
//     // simulate a fetch call
//     setTimeout(() => {
//       //   resolver();
//       //   resolve(petsDB[type]);
//     }, time);
//   });
// }
// export async function delayAsync(time: number) {
//   return new Promise((resolve) => {
//     // simulate a fetch call
//     setTimeout(() => {
//       //   resolve(petsDB[type]);
//     }, time);
//   });
// }

const isEmpty = (obj: string | Array<any>) => {
  if (obj && obj !== undefined && obj !== null) {
    if (typeof obj === "string") {
      return obj.trim() === "";
    } else if (Array.isArray(obj) && obj.length > 0) {
      return false;
    }
  }

  return false;
};

const isNull = (obj: any) => {
  if (obj !== undefined && obj !== null) {
    return false;
  }

  return true;
};

const isEqual = (obj1: object | undefined, obj2: object | undefined) => {
  // TODO replace with better solution (ex. lodash)
  if (!obj1 || !obj2) {
    return false;
  }
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getKeyValue =
  <T extends object, U extends keyof T>(obj: T) =>
  (key: U) =>
    obj[key];

const allCombinations = (str1: string) => {
  const arr = [];
  for (let x = 0, y = 1; x < str1.length; x++, y++) {
    arr[x] = str1.substring(x, y);
  }
  const combination = [];
  let temp = "";
  let len = Math.pow(2, arr.length);
  for (let i = 0; i < len; i++) {
    temp = "";
    for (let j = 0; j < arr.length; j++) {
      if (i & Math.pow(2, j)) {
        temp += arr[j];
      }
    }
    if (temp !== "" && str1.includes(temp)) {
      combination.push(temp.toLowerCase());
    }
  }
  return combination;
};

export { allCombinations, getKeyValue, isEmpty, isEqual, isNull, timeout };
