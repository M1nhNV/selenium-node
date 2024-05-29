import { isExistDir, createDir } from "#factories/dir.js";
import {
  ABSOLUTE_PATH_RESULT_DIR,
  ABSOLUTE_PATH_DOWNLOAD_DIR,
} from "#settings";
import { configDotenv } from "dotenv";
import { getFilePath, isExistFile } from "#factories/file.js";

/**
 * Check that the system settings are working properly before running the test
 */
const checkSystemConfiguration = async () => {
  await checkDownloadDir();
  await checkResultsDir();
};

/**
 * If folder download is not exist then create it
 */
const checkDownloadDir = async () => {
  if (!isExistDir(ABSOLUTE_PATH_DOWNLOAD_DIR)) {
    await createDir(ABSOLUTE_PATH_DOWNLOAD_DIR);
  }
};

/**
 * If folder results is not exist then create it
 */
const checkResultsDir = async () => {
  if (!isExistDir(ABSOLUTE_PATH_RESULT_DIR)) {
    await createDir(ABSOLUTE_PATH_RESULT_DIR);
  }
};

/**
 *
 * Load multiple config from .env
 *
 */
const loadFileConfigEnv = () => {
  const envFilePath = getFilePath(`.env.${process.env.APP_ENV}`, true);
  if (isExistFile(envFilePath)) {
    configDotenv({ path: envFilePath, override: true });
  } else {
    console.warn(`Can not load config from: ${envFilePath}`);
  }
};

export { checkSystemConfiguration, loadFileConfigEnv };
