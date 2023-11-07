import { connectToSlack, pushMessagesToSlack } from "#adapter/slack.js";
import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { getCurrentTimeUTC } from "#core/untilities/time.js";
import get from "lodash/get.js";

export const reportToSlack = () => {
  connectToSlack();
  pushMessagesToSlack();
};

const getPath = (str) => {
  try {
    const reg = new RegExp("(?:\\/test-cases\\/([^\\/]+))\\/");
    const match = str.match(reg);
    return match[1];
  } catch (e) {
    return "";
  }
};

async function createDirectory(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.error(`error create dir ${directoryPath}: ${error.message}`);
  }
}

export const getDirName = () => {
  return dirname(fileURLToPath(import.meta.url));
};

export const getAbsolutePath = () => {
  return resolve(dirname(""), "src/results");
};

export const getFileName = (str) => {
  const regex = /\/([^\/]+)\.js$/;
  const match = str.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
};
const writeJsonToFile = async (absolutePath, jsonContent) => {
  try {
    const jsonString = JSON.stringify(jsonContent);
    await writeToFile(absolutePath, jsonString);
    return true;
  } catch (error) {}
};

const getCurrentTime = () => {
  const date = new Date();
  return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
};

const getHeaderFile = () => {
  return `parent_title, title, state, error, speed, duration, time_end_test_case \n`;
};

const writeToFile = async (absolutePath, content) => {
  try {
    if (!existsSync(absolutePath)) {
      const headers = getHeaderFile();
      await writeFile(absolutePath, headers, "utf-8");
    }

    await fs.appendFile(absolutePath, content, "utf-8");
  } catch (error) {
    console.error("Error writing to file:", error.message);
  }
};

export const clearAllResult = async (folderPath) => {
  try {
    const stats = await fs.stat(folderPath);
    if (stats.isDirectory()) {
      const files = await fs.readdir(folderPath);

      for (const file of files) {
        const filePath = join(folderPath, file);
        const fileStats = await fs.stat(filePath);
        if (fileStats.isDirectory()) {
          await clearAllResult(filePath);
        } else {
          await fs.unlink(filePath);
        }
      }
    } else {
      await fs.unlink(folderPath);
    }
  } catch (error) {
    console.error(`error d: ${error.message}`);
  }
};

const formatFunctionError = (err) => {
  return err.replace(/(\r\n|\n|\r)/gm, "");
};

export const reportToFile = async (context) => {
  try {
    const err = context.err ? context.err : " ";
    const parent = get(context, "parent.title", "");
    const errContent = formatFunctionError(err);
    const relativePath = getPath(context.file);
    const absolutePath = getAbsolutePath();
    let fileName = getFileName(context.file);

    const content = `${parent}, ${context.title}, ${
      context.state
    },  ${errContent}, ${context.speed}, ${
      context.duration
    }, ${getCurrentTimeUTC()} \n`;

    fileName = `${context.state}_${fileName}_${getCurrentTime()}.csv`;
    const path = join(absolutePath, relativePath);
    const pathFile = join(path, fileName);
    await createDirectory(path);
    await writeToFile(pathFile, content);
  } catch (e) {
    console.log("e: ", e);
  }
};
