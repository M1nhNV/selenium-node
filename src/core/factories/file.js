import { readFile } from "fs/promises";
import { resolve } from "path";
import { DATA_FILE_URL } from "#constants/settings.js";

import isArray from "lodash/isArray.js";
import has from "lodash/has.js";

const getFilePath = (path) => {
  return resolve(DATA_FILE_URL + path);
};

async function readJsonFile(filePath, fileType = "utf-8") {
  try {
    const fileContent = await readFile(filePath, fileType);
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

async function readCSVFile(filePath, fileType = "utf-8") {
  try {
    console.log("read csv file");
  } catch (error) {
    return {};
  }
}

async function readExcelFile(filePath, fileType = "utf-8") {
  try {
    console.log("read excel file");
  } catch (error) {
    return {};
  }
}

const driverGetFile = (type = "json") => {
  switch (type) {
    case "json":
      return readJsonFile;
    case "csv":
      return readCSVFile;
    case "xlxs":
      return readExcelFile;
    default:
      return readJsonFile;
  }
};

export const getInfoFromFile = async (path, params = [], fileType = "json") => {
  if (isArray(params)) {
    const fc = driverGetFile(fileType);
    const data = await fc(getFilePath(path));
    const rs = {};
    params.map((key) =>
      has(data, key) ? (rs[key] = data[key]) : (rs[key] = null),
    );
    return rs;
  }

  return {};
};
