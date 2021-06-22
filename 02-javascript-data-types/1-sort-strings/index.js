/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = {caseFirst: 'upper'};

  const compareFn = (prev, next) => {
    const ascCompare = prev.localeCompare(next, locales, options);
    const descCompare = next.localeCompare(prev, locales, options);

    return (param !== 'desc') ? ascCompare : descCompare;
  };

  return [...arr].sort(compareFn);
}
