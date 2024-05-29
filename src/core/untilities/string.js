import isString from "lodash/isString.js";
const slugify = (str) => {
  return str
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/[đĐ]/g, "d") // replace GD
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/_/g, "-") // Replace _ with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/-$/g, ""); // Remove trailing -
};

const convertFullSizeToHalfSize = async (fullSize) => {
  const withoutSpaces = fullSize.replace(/\s/g, "");
  return withoutSpaces.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });
};

const clearMultipleSpace = (str) => {
  return str.trim().split(/\s+/).join(" ");
};

const parseSpecialChars = (str) => {
  if (isString(str)) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  return str;
};

const isHTML = (content) => {
  return /<\/?[^>]*>/.test(content);
};

export {
  slugify,
  convertFullSizeToHalfSize,
  clearMultipleSpace,
  parseSpecialChars,
  isHTML,
};
