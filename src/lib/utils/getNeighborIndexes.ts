export const getNeighborIndexes = (home: number, neighborhoodSize: number, range = 5): number[] => {
  const results = [home];

  const start = -Math.abs(range);
  const end = Math.abs(range);
  const length = Math.floor((end - start) / 1 + 1);

  const neighborhoodRanges = Array(length)
    .fill(0)
    .map((_: number, index: number) => start + index);

  for (let i = 0; i < neighborhoodRanges.length; i++) {
    const neighborhoodRange = neighborhoodRanges[i];
    let result = (home + neighborhoodRange) % neighborhoodSize;
    if (result < 0) {
      result += neighborhoodSize;
    }
    results[i] = result;
  }

  return [...new Set(results)];
};
