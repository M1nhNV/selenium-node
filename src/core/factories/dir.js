import {
  existsSync,
  mkdir,
  readdirSync,
  unlinkSync,
  rmSync,
  lstatSync,
} from "fs";
import { resolve, join } from "path";
import { BASE_PATH } from "#settings";

const isExistDir = (path) => {
  return existsSync(path);
};

const createDir = async (directoryPath = "") => {
  try {
    await mkdir(directoryPath, { recursive: true }, () => {});
  } catch (error) {
    console.error(`error create dir ${directoryPath}: ${error.message}`);
  }
};

const getAllFilesInDir = (folderPath) => {
  try {
    return readdirSync(folderPath);
  } catch (error) {
    console.error(`Error reading files in folder: ${error.message}`);
    return [];
  }
};

const clearDataInDir = (folderPath) => {
  readdirSync(folderPath).forEach((child) => {
    const childPath = join(folderPath, child);
    const isFile = lstatSync(childPath).isFile();
    if (isFile) {
      unlinkSync(childPath);
    } else {
      rmSync(childPath, { recursive: true, force: true });
    }
  });
};

const makeAbsoluteDir = (...folders) => {
  return join(resolve(BASE_PATH), ...folders);
};

export {
  createDir,
  isExistDir,
  getAllFilesInDir,
  clearDataInDir,
  makeAbsoluteDir,
};
