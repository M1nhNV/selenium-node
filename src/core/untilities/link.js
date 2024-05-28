export const getRelativePath = (link) => {
  const match = /\/src\/.*/.exec(link);
  if (match !== null && match[0]) {
    return match[0];
  }

  return '';
};

export const getTestCasePath = (str) => {
  try {
    const match = str.match(/\/test-cases\/(.*)/);
    return match[1];
  } catch (e) {
    return '';
  }
};

export const getPathIncludeTestCase = (str) => {
  try {
    const reg = new RegExp('\\/test-cases\\/([^\\\\]+)\\/');
    const match = str.match(reg);
    return match[1];
  } catch (e) {
    return '';
  }
};
