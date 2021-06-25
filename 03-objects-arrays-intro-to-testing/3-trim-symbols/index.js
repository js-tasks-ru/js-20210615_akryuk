/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const reducer = (acc, current, index, array) => {
    if (array[index - 1] !== current) {
      return [...acc, current];
    } else {
      const accCopy = [...acc];
      const newLastElem = accCopy.pop() + current;
      return [...accCopy, newLastElem];
    }
  };

  const result = string.split('').reduce(reducer, []);
  return result.map(item => item.slice(0, size)).join('');
}
