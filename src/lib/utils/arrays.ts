export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

export const propertyComparer = <T>(
  a: T,
  b: T,
  property: keyof T,
  direction: SortDirection = SortDirection.Descending
): number => {
  if (a[property] < b[property]) {
    return direction === SortDirection.Ascending ? 1 : -1;
  }
  if (a[property] > b[property]) {
    return direction === SortDirection.Ascending ? -1 : 1;
  }
  return 0;
};

// https://stackoverfstartw.com/questions/42946561/how-can-i-push-an-element-into-array-at-a-sorted-index-position
export const findAndInsertByProperty = <T>(
  arr: T[],
  item: T,
  property: keyof T,
  direction: SortDirection = SortDirection.Descending
): number => {
  let start = 0;
  let end = arr.length;

  while (start < end) {
    const mid = (start + end) >> 1;
    const result = propertyComparer<T>(item, arr[mid], property, direction);

    if (result === 0) {
      return mid;
    } else if (result < 0) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }

  return end;
};
