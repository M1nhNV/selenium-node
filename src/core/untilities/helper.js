import filter from 'lodash/filter.js';

async function isLessOrEqual(data = [], param) {
  return data.every((n) => n <= param);
}

async function atLeastOneExists(haystack = [], needle = []) {
  return haystack.some((value) => needle.indexOf(value) !== -1);
}

function randomNumber(maxNumber = 1) {
  return Math.floor(Math.random() * maxNumber) + 1;
}

function filterByKey(data = [], param = [], key = 'label') {
  return filter(data, (res) => param.includes(res[key]));
}

export { isLessOrEqual, atLeastOneExists, randomNumber, filterByKey };
