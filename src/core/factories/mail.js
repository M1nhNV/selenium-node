import {
  getLinkResetPasswordFromGmail,
} from '#adapter/gmail.js';
import { EMAIL_TYPE } from '#settings';

async function getLinkResetPasswordFromEmail(type = EMAIL_TYPE.GMAIL) {
  switch (type) {
    case EMAIL_TYPE.GMAIL:
      return getLinkResetPasswordFromGmail();
    default:
      return getLinkResetPasswordFromGmail();
  }
}

export { getLinkResetPasswordFromEmail };
