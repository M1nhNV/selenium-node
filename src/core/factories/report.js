import { join } from "path";
import moment from "moment";
import { getCurrentTimeUTC, convertTime } from "#core/untilities/time.js";
import {
  getRelativePath,
  getPathIncludeTestCase,
} from "#core/untilities/link.js";
import addContext from "mochawesome/addContext.js";
import { ABSOLUTE_PATH_RESULT_DIR } from "#settings";
import {
  pushMessagesToSlack,
  pushMessagesWithFileToSlack,
} from "#adapter/slack.js";
import size from "lodash/size.js";
import isString from "lodash/isString.js";
import isArray from "lodash/isArray.js";
import get from "lodash/isArray.js";

import "dotenv/config";
import {
  writeToFile,
  clearDataInDir,
  getFileName,
  createDir,
  readCSVFile,
  readJsonFile,
  isExistFile,
} from "#factories";
import { stringify } from "csv-stringify/sync";
export { addContext };

const HEADERS = [
  "parent_title",
  "file",
  "title",
  "state",
  "add_context",
  "error",
  "speed",
  "duration",
  "time_end_test_case",
];

export const clearAllResult = () => {
  clearDataInDir(ABSOLUTE_PATH_RESULT_DIR);
};

const escapeCSVValue = (str) => {
  if (typeof str === "string") {
    return str.replace(/["',\r\n|\r|\n]/g, "");
  }

  if (isArray(str)) {
    return str.join("");
  }

  return str;
};

const formatErrorBeforeSaveToCSV = (err) => {
  try {
    const acceptKeys = ["message", "actual", "operator", "expected"];
    let errors = "";

    for (const key of acceptKeys) {
      if (err[key]) {
        errors = errors + `${key}:${escapeCSVValue(err[key])}%`;
      }
    }

    return errors;
  } catch (e) {
    return "";
  }
};

const formatContextBeforeSaveToCSV = (arr) => {
  try {
    let strContent = "";
    for (const i of arr) {
      strContent =
        strContent === ""
          ? escapeCSVValue(i)
          : `${strContent};${escapeCSVValue(i)}`;
    }
    return strContent;
  } catch (e) {
    return "";
  }
};

const getCurrentState = (context) => {
  if (context.state) {
    return context.state;
  }

  return "retry";
};

const makeHeaderOfReportFile = async (path) => {
  if (!isExistFile(path)) {
    await writeToFile(path, stringify([HEADERS]));
  }
};

export const writeReportToFile = async (context) => {
  try {
    const fileName = getFileName(context.file);
    const fileSrc = getRelativePath(context.file);
    const parent = get(context, "parent.title", "");
    const testCaseName = get(context, "title", "");
    const state = getCurrentState(context);
    const speed = get(context, "speed", "");
    const duration = get(context, "duration", 0);

    const contentAddStr = formatContextBeforeSaveToCSV(context.context);
    const errContent = formatErrorBeforeSaveToCSV(get(context, "err", ""));

    const content = `${parent},${fileSrc},${testCaseName},${state},${contentAddStr},${errContent},${speed},${duration},${getCurrentTimeUTC()}\n`;

    const path = join(
      ABSOLUTE_PATH_RESULT_DIR,
      getPathIncludeTestCase(context.file),
    );
    const pathFile = join(path, `${fileName}.csv`);
    await createDir(path);

    await makeHeaderOfReportFile(pathFile);
    await writeToFile(pathFile, content);
  } catch (e) {
    console.log("e: ", e);
  }
};

export const getPathFileReport = (type) => {
  const fileName = `hr_report_${moment().format("MM-DD-YYYY")}.${type}`;
  return join("results", fileName);
};

const makeSlackContentReport = async (testCase, callbackFailed, detailCase) => {
  let mainTestCase = "";
  let content = ``;
  let caseContent = ``;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalRetry = 0;
  let totalTime = 0;
  let timeEnd = "";
  let fileTest = "";

  for (let i in testCase) {
    if (mainTestCase === "") {
      mainTestCase = testCase[i]["parent_title"];
    }

    if (fileTest === "") {
      fileTest = testCase[i]["file"];
    }

    if (timeEnd === "") {
      timeEnd = testCase[i]["time_end_test_case"];
    }

    totalTime = totalTime + Number(testCase[i]["duration"]);
    if (testCase[i]["state"] === "passed") {
      totalPassed++;
    }

    if (testCase[i]["state"] === "retry") {
      totalRetry++;
    }

    if (testCase[i]["state"] === "failed") {
      totalFailed++;
      callbackFailed(testCase[i]);
    }

    caseContent =
      caseContent +
      `${testCase[i]["title"]} | ${testCase[i]["state"]} | ${convertTime(
        testCase[i]["duration"],
      )} |\n`;
  }

  detailCase(caseContent);

  content = `\`\`\`Main test: ${mainTestCase}\nTotal case: ${size(
    testCase,
  )}\nFile: ${fileTest}\nPassed: ${totalPassed}\nFailed: ${totalFailed}\nRetry: ${totalRetry} \nTotal time: ${convertTime(
    totalTime,
  )}\nTime end: ${moment(timeEnd).format("YYYY/MM/DD HH:mm:ss")}\`\`\``;

  return {
    status: mainTestCase !== "",
    content: content,
    raw: {
      passed: totalPassed,
      failed: totalFailed,
      time: totalTime,
    },
  };
};

const splitAddContent = (content) => {
  if (isString(content)) {
    return content.split(";");
  }

  return [];
};

const formatErrorBeforePushToSlack = (err) => {
  try {
    const errors = err.split("%");
    let rs = "";
    for (const row of errors) {
      rs = rs + row + "\n";
    }

    return rs;
  } catch (e) {
    return "";
  }
};

const processContextMessageBeforePushToSlack = (addContext) => {
  try {
    let content = "";
    const context = splitAddContent(addContext);
    for (const row of context) {
      content = `${content} ${row}\n`;
    }

    return content;
  } catch (e) {
    return "";
  }
};
const makeFailedTestCaseReport = (failedCase) => {
  return (
    "<@U063UQUK2JV> <@U05RBR1ML4U> <@U06455T68GY> \n" +
    `\`\`\`Detail case failed: ${failedCase.title} \n` +
    `----------\n` +
    `Errors: ${formatErrorBeforePushToSlack(failedCase.error)}` +
    `----------\n` +
    `Context: ${processContextMessageBeforePushToSlack(
      failedCase.add_context,
    )}\`\`\`\n`
  );
};

const makeDetailReportTestCase = (detailCase) => {
  return `\`\`\`Detail cases: \nTitle | Status | Duration \n${detailCase}\`\`\``;
};

export const reportTestCase = async (file = null) => {
  try {
    const link = `${ABSOLUTE_PATH_RESULT_DIR}/${file}.csv`;

    const testCase = await readCSVFile(link);
    if (size(testCase) < 0) {
      return;
    }

    const totalFailedCase = [];
    let detailCase = "";

    const results = await makeSlackContentReport(
      testCase,
      (failedCase) => {
        totalFailedCase.push(failedCase);
      },
      (detail) => {
        detailCase = detail;
      },
    );

    if (results.status) {
      // push to report
      const rs = await pushMessagesToSlack(results.content);
      await pushMessagesToSlack(
        makeDetailReportTestCase(detailCase),
        rs.thread_ts,
      );

      if (totalFailedCase.length) {
        for (const index in totalFailedCase) {
          await reportFailedToSlack(totalFailedCase[index], rs.thread_ts);
        }
      }
    }
  } catch (e) {
    console.log("reportTestCase err : ", e);
  }
};

export const reportFailedToSlack = async (failedCase, thread_ts) => {
  const failedContent = makeFailedTestCaseReport(failedCase);
  if (process.env.ALLOW_SCREEN_SHORT === "true") {
    const absolutePath = `${ABSOLUTE_PATH_RESULT_DIR}/images/${failedCase.title}.png`;
    await pushMessagesWithFileToSlack(failedContent, absolutePath, thread_ts);
  } else {
    await pushMessagesToSlack(failedContent, thread_ts);
  }
};

export const makeTotalReport = async () => {
  const fileName = `${ABSOLUTE_PATH_RESULT_DIR}/total-result.json`;
  await readJsonFile(fileName);
};

export const reportTotalToFile = async (context) => {
  try {
    const err = context.err ? context.err : " ";
    const parent = get(context, "parent.title", "");
    const errContent = formatErrorBeforeSaveToCSV(err);
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const content = `${parent}, ${context.title}, ${context.state},  ${errContent}, ${context.speed}, ${context.duration}, ${now} \n`;
    const pathFile = getPathFileReport("csv");

    await makeHeaderOfReportFile(pathFile);
    await writeToFile(pathFile, content);
  } catch (e) {
    console.log("e: ", e);
  }
};

export const sumUpReport = async (stats) => {
  try {
    const content =
      `\`\`\`` +
      `====== Total report ======\n` +
      `Start time: ${moment(stats.start).format("YYYY/MM/DD HH:mm:ss")}\n` +
      `End time: ${moment(stats.end).format("YYYY/MM/DD HH:mm:ss")}\n` +
      `Total test case: ${stats.testsRegistered}\n` +
      `Total passed: ${stats.passes}\n` +
      `Total failed: ${stats.failures}\n` +
      `Total Skipped: ${stats.skipped}\n` +
      `Total time: ${convertTime(stats.duration)}\n\`\`\``;
    await pushMessagesToSlack(content);
  } catch (error) {
    console.log(error);
  }
};
