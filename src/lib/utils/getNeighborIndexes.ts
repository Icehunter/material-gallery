export const getNeighborIndexes = (home: number, neighborhoodSize: number, range = 5): number[] => {
  const results = [home];

  const start = -Math.abs(range);
  const end = Math.abs(range);
  const length = Math.floor((end - start) / 1 + 1);

  const neighborhoodRanges = Array(length)
    .fill(0)
    .map((_: number, index: number) => start + index);

  for (let neighborIndex = 0; neighborIndex < neighborhoodRanges.length; neighborIndex++) {
    const neighborhoodRange = neighborhoodRanges[neighborIndex];
    let result = (home + neighborhoodRange) % neighborhoodSize;
    if (result < 0) {
      result += neighborhoodSize;
    }
    results[neighborIndex] = result;
  }

  const unique = new Set(results);

  return Array.from(unique);
};
