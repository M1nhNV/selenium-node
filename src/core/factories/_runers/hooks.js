import 'dotenv/config';
import { reportTestCase, writeReportToFile, clearAllResult } from '#factories/report.js';
import { reportToSlackChanel, getUserByEmail } from '#adapter/slack.js';
import { checkSystemConfiguration } from '#core/factories/system.js';

const reportFiles = [];

export const mochaHooks = {
  afterEach(done) {
    if (!reportFiles.includes(this.currentTest.file)) {
      reportFiles.push(this.currentTest.file);
    }

    if (process.env.EXPORT_REPORT === 'true') {
      writeReportToFile(this.currentTest).then();
    }

    done();
  },
  async afterAll() {
    if (process.env.ALLOW_REPORT_TO_SLACK === 'true') {
      for (const index in reportFiles) {
        await processBeforeDescribe(reportFiles[index]);
      }
      reportFiles.length = 0;
    }
  },
};

const filterFileName = (file) => {
  try {
    return /src\/resources\/test-cases\/(.*).js/.exec(file);
  } catch (e) {
    console.log('filterFileName: ', e);
  }
};

const processBeforeDescribe = async (file = null) => {
  const pathName = filterFileName(file);
  if (pathName && pathName[1]) {
    await reportTestCase(pathName[1]);
  }
};

export const mochaGlobalSetup = async () => {
  await checkSystemConfiguration();

  if (process.env.ALLOW_REPORT_TO_SLACK === 'true') {
    await clearAllResult();
    // await getUsersId();
  }
};

export const mochaGlobalTeardown = async () => {
  if (process.env.ALLOW_REPORT_TO_SLACK === 'true') {
    await reportToSlackChanel();
  }
};

export const getUsersId = async () => {
  try {
    if (!process.env.EMAIL_MEMBERS) {
      return;
    }

    const emails = process.env.EMAIL_MEMBERS.split(',');
    const userSlackIds = await Promise.all(
      emails.map(async (email) => {
        const { id } = await getUserByEmail({ email: email });
        return `<@${id}>`;
      })
    );
    return userSlackIds;
  } catch {
    return [];
  }
};
