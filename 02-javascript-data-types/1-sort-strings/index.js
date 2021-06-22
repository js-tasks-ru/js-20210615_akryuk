/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const compareFn = (prev, next) => prev.localeCompare(next, ['ru', 'en'], {caseFirst: 'upper'});
  const sortedArray = [...arr].sort(compareFn);
  return param !== 'desc' ? sortedArray : sortedArray.reverse();
}
