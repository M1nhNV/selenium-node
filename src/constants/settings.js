import { join } from 'path';
import { makeAbsoluteDir } from '#factories';

/**
 * DIRECTORIES SETTINGS
 *
 */
const BASE_PATH = process.env.APP_PATH ? process.env.APP_PATH : process.cwd();

const CONTAINS_DATA_DIR = join('src', 'resources', 'data');

const RESULTS_DIR = 'results';
const DOWNLOAD_DIR = 'downloadFiles';
const ABSOLUTE_PATH_DOWNLOAD_DIR = makeAbsoluteDir(DOWNLOAD_DIR);
const ABSOLUTE_PATH_RESULT_DIR = makeAbsoluteDir(RESULTS_DIR);

/**
 * THIRD SERVICE SETTINGS
 *
 */

const EMAIL_TYPE = {
  GMAIL: 'gmail',
  YOPMAIL: 'yopmail',
};

// for mocha status
const TEST_STATE = {
  PASS: 'passed',
  FAILED: 'failed',
  UNDEFINED: 'undefined',
};

// Google Chrome setting download folder
const DEFAULT_BROWSER_SETTINGS = {
  maximum: true,
  downloadPath: ABSOLUTE_PATH_DOWNLOAD_DIR,
};

// selenium default waiting
const DEFAULT_TIME_WAITING = 5;
const MAXIMUM_TIME_OUT = 3600000; // millisecond
/**
 * DOMAIN SERVICE SETTINGS
 *
 */
const EMAIL_ADDRESS = ''

const SUB_DOMAIN = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

const MAX_PER_PAGE = 50;
const MIN_PER_PAGE = 10;

export {
  CONTAINS_DATA_DIR,
  RESULTS_DIR,
  DOWNLOAD_DIR,
  ABSOLUTE_PATH_DOWNLOAD_DIR,
  ABSOLUTE_PATH_RESULT_DIR,
  EMAIL_TYPE,
  EMAIL_ADDRESS,
  TEST_STATE,
  DEFAULT_BROWSER_SETTINGS,
  DEFAULT_TIME_WAITING,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  BASE_PATH,
  SUB_DOMAIN,
  MAXIMUM_TIME_OUT
};
