import chai from 'chai';

// For more information https://www.chaijs.com/api/assert/#method_assert
const assert = chai.assert;

export const equal = (actual, expected) => {
  return assert.equal(actual, expected);
};

export const notEqual = (actual, expected) => {
  return assert.notEqual(actual, expected);
};

export const isAbove = (actual, expected) => {
  return assert.isAbove(actual, expected);
};

export const isBelow = (actual, expected) => {
  return assert.isBelow(actual, expected);
};

export const isAtLeast = (actual, expected) => {
  return assert.isAtLeast(actual, expected);
};

export const isTrue = (actual) => {
  return assert.isTrue(actual);
};

export const isFalse = (actual) => {
  return assert.isFalse(actual);
};

export const exists = (actual) => {
  return assert.exists(actual);
};

export const isObject = (actual) => {
  return assert.isObject(actual);
};

export const include = (haystack, needle) => {
  return assert.include(haystack, needle);
};

export const isEmpty = (haystack, needle) => {
  return assert.isEmpty(haystack, needle);
};

export const deepEqual = (haystack, needle) => {
  return assert.deepEqual(haystack, needle);
};

export const notInclude = (haystack, needle) => {
  return assert.notInclude(haystack, needle);
};

export const deepInclude = (haystack = [], needle) => {
  return assert.deepInclude(haystack, needle);
};

export const sameMembers = (haystack = [], needle = []) => {
  return assert.sameMembers(haystack, needle);
};

export const notSameMembers = (haystack = [], needle = []) => {
  return assert.notSameMembers(haystack, needle);
};

export const sameOrderedMembers = (haystack = [], needle = []) => {
  return assert.sameOrderedMembers(haystack, needle);
};

export const includeMembers = (haystack = [], needle = []) => {
  return assert.includeMembers(haystack, needle);
};

export const notIncludeMembers = (haystack = [], needle = []) => {
  return assert.notIncludeMembers(haystack, needle);
};

export const sameDeepMembers = (haystack = [], needle = []) => {
  return assert.sameDeepMembers(haystack, needle);
};

export const notSameOrderedMembers = (haystack = [], needle = []) => {
  return assert.notSameOrderedMembers(haystack, needle);
};

export const sameDeepOrderedMembers = (haystack = [], needle = []) => {
  return assert.sameDeepOrderedMembers(haystack, needle);
};

export const notSameDeepOrderedMembers = (haystack = [], needle = []) => {
  return assert.notSameDeepOrderedMembers(haystack, needle);
};

export const textMatch = (haystack = '', needle) => {
  const regex = new RegExp('/^.*' + haystack + '$/');
  return regex.test(needle);
};

export const textMatchAll = (haystack = '', needle = []) => {
  const result = needle.map((text) => textMatch(haystack, text));
  return !result.includes(false);
};

export const lengthOf = (actual, length) => {
  return assert.lengthOf(actual, length);
};
