import { getInfoFromFile, getPathFileReport, sumUpReport } from '#factories';
import api from '#factories/http.js';
import size from 'lodash/size.js';
import { createReadStream } from 'fs';

let interVal = null;

export const reportToSlackChanel = async () => {
  try {
    interVal = setInterval(async () => {
      const pathFileReportJson = getPathFileReport('json');
      const { stats } = await getInfoFromFile(pathFileReportJson, ['stats'], 'json', true);
      if (size(stats)) {
        clearInterval(interVal);
        return sumUpReport(stats);
      }
    }, 300);
  } catch (e) {
    console.error(e);
  }
};

export const pushMessagesToSlack = async (msgContent, threadId = '') => {
  try {
    const data = {
      channel: process.env.CHANNELS_ID,
      text: msgContent,
      thread_ts: threadId,
    };

    const { ts } = await api.post('/chat.postMessage', data);
    return {
      thread_ts: ts,
    };
  } catch (error) {
    console.log('pushMessagesToSlack error ', error);
  }
};

export const pushMessagesWithFileToSlack = async (msgContent, filepath, threadId = '') => {
  try {
    const data = {
      channels: process.env.CHANNELS_ID,
      initial_comment: msgContent,
      thread_ts: threadId,
    };

    const files = [
      {
        key: `file`,
        value: createReadStream(filepath),
      },
    ];

    const { ts } = await api.postUpload('/files.upload', files, data);

    return {
      thread_ts: ts,
    };
  } catch (error) {
    console.log('pushMessagesToSlack error ', error);
  }
};

export const getUserByEmail = async (params) => {
  try {
    const { user } = await api.get('users.lookupByEmail', params);
    return user;
  } catch (error) {
    return {};
  }
};
