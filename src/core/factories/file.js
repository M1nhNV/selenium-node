import { readFile, writeFile, appendFile, existsSync } from 'fs/promises';
import { resolve } from 'path';

import { ABSOLUTE_PATH_DOWNLOAD_DIR, CONTAINS_DATA_DIR } from '#constants/settings.js';
import isArray from 'lodash/isArray.js';
import has from 'lodash/has.js';

import { isExistDir, getAllFilesInDir } from '#factories';
import { readCSVFile, readJPCSV, filterCsvCol } from './_files/csv.js';
import { writeJsonFile } from './_files/json.js';
import { writeImageFile } from './_files/image.js';


const getFilePath = (path, isRoot) => {
  if (isRoot) {
    return resolve(path);
  }

  return resolve(CONTAINS_DATA_DIR + path);
};

async function readJsonFile(filePath, fileType = 'utf-8') {
  try {
    const fileContent = await readFile(filePath, fileType);
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

async function readExcelFile() {
  try {
    console.log('read excel file');
  } catch (error) {
    return {};
  }
}

const driverGetFile = (type = 'json') => {
  switch (type) {
    case 'json':
      return readJsonFile;
    case 'csv':
      return readCSVFile;
    case 'xlxs':
      return readExcelFile;
    default:
      return readJsonFile;
  }
};

const getInfoFromFile = async (path, params = [], fileType = 'json', isReport = false) => {
  if (isArray(params)) {
    const fc = driverGetFile(fileType);
    const data = await fc(getFilePath(path, isReport));
    const rs = {};
    params.map((key) => (has(data, key) ? (rs[key] = data[key]) : (rs[key] = null)));
    return rs;
  }

  return {};
};

const getLinkFileFromDownloadFolder = () => {
  let files = [];
  let limit = 0;

  // if server is error. Can not download file then 30s recuse loop
  while (limit < 30000) {
    files = getAllFilesInDir(ABSOLUTE_PATH_DOWNLOAD_DIR);
    if (files.length > 0) {
      limit = 30000;
    }

    limit++;
  }

  return files[0] ? `${ABSOLUTE_PATH_DOWNLOAD_DIR}/${files[0]}` : '';
};

const makeCopyFileUrl = (fileUrl) => {
  let fileSplit = fileUrl.split('.');
  return `${fileSplit[0]}_copy.${fileSplit.pop()}`;
};

const writeToFile = async (absolutePath = '', content = '') => {
  try {
    if (!isExistDir(absolutePath)) {
      await writeFile(absolutePath, content, 'utf-8');
    } else {
      await appendFile(absolutePath, content, 'utf-8');
    }
  } catch (error) {
    console.error('Error writing to file:', error.message);
  }
};

const isExistFile = (path) => {
  return existsSync(path);
};

const getFileName = (str) => {
  const regex = /\/([^/]+)\.js$/;
  const match = str.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
};

export {
  isExistFile,
  readCSVFile,
  getFileName,
  writeToFile,
  writeJsonFile,
  readJsonFile,
  writeImageFile,
  readExcelFile,
  readJPCSV,
  getFilePath,
  driverGetFile,
  getInfoFromFile,
  filterCsvCol,
  makeCopyFileUrl,
  getLinkFileFromDownloadFolder,
};
