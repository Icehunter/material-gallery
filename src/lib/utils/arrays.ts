export enum SortDirection {
  Ascending,
  Descending
}

export const propertyComparer = <T>(
  a: T,
  b: T,
  property: keyof T,
  direction: SortDirection = SortDirection.Ascending
): number => {
  if (a[property] < b[property]) {
    return direction === SortDirection.Ascending ? 1 : -1;
  }
  if (a[property] > b[property]) {
    return direction === SortDirection.Ascending ? -1 : 1;
  }
  return 0;
};

// https://stackoverflow.com/questions/42946561/how-can-i-push-an-element-into-array-at-a-sorted-index-position
export const findAndInsertByProperty = <T>(
  arr: T[],
  item: T,
  property: keyof T,
  direction: SortDirection = SortDirection.Ascending
): number => {
  if (arr.length === 0) {
    return 0;
  }
  if (item[property] < arr[0][property]) {
    return 0;
  }
  if (item[property] > arr[arr.length - 1][property]) {
    return arr.length;
  }
  let m = 0;
  let n = arr.length - 1;

  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = propertyComparer<T>(item, arr[k], property, direction);

    if (cmp > 0) m = k + 1;
    else if (cmp < 0) n = k - 1;
    else return k;
  }

  return -m - 1;
};
