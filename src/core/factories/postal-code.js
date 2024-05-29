/**
 * All postal code of JP get from site:
 * https://www.post.japanpost.jp/zipcode/download.html
 *
 * Format data in line like this:
 * LocalAuthCode,OldZipCode,ZipCode,PrefectureName,KanaCity,KanaStreetName,State,City,StreetName,MoreZipCodeFlag,SmallerAreaFlag,StreetChomeFlag,MoreStreetFlag,UpdateFlag,Reason
 *
 * More info:
 * https://learn.microsoft.com/en-us/dynamics365/finance/localizations/japan/apac-jpn-import-postal-codes
 */

import { getFilePath, readJPCSV } from "#factories/file.js";
import { POSTAL_CODE_JP_CSV } from "#constants/file.js";
import { size, sample, random } from "lodash";
import Papa from "papaparse";

const CSV_POSTAL_CODE_PATH = getFilePath(`files/${POSTAL_CODE_JP_CSV}`);

let postalCenter = {};

function formatData(csvContent) {
  for (const row of csvContent) {
    if (row[2]) {
      const postalCode = row[2];
      const state = row[6];
      const city = row[7];
      const streetName = row[8];

      postalCenter[postalCode] = {
        postal_code: postalCode,
        state,
        city,
        street: streetName,
      };
    }
  }

  return {};
}

async function initPostalCodeSource() {
  const content = await readJPCSV(CSV_POSTAL_CODE_PATH);
  const contentParsed = Papa.parse(content, {
    header: false,
    dynamicTyping: false,
  });

  formatData(contentParsed.data);
}

function clearFormat(code) {
  if (/[0-9]{3}-[0-9]{4}/.test(code)) {
    return code.replaceAll("-", "");
  }

  return code;
}

function getPostalCode(code) {
  code = clearFormat(code);

  if (postalCenter[code]) {
    return postalCenter[code];
  }

  return {};
}

async function getInfoPostalCode(code) {
  if (typeof code === "string" && code !== "") {
    if (size(postalCenter) <= 0) {
      await initPostalCodeSource();
    }

    return getPostalCode(code);
  }

  return {};
}

async function getRandomPostalCodeInvalid(hasDartLine = true) {
  if (size(postalCenter) <= 0) {
    await initPostalCodeSource();
  }

  let info = {};
  let postalCode = "";

  do {
    postalCode = hasDartLine
      ? `${random(100, 999)}-${random(10000, 9999)}`
      : `${random(100, 999)}${random(10000, 9999)}`;
    info = await getInfoPostalCode(postalCode);
  } while (size(info) > 0);

  return postalCode;
}

async function getRandomPostalCodeValid() {
  if (size(postalCenter) <= 0) {
    await initPostalCodeSource();
  }

  const info = sample(postalCenter);

  return {
    postal_code: {
      full: info.postal_code,
      parts: [
        String(info.postal_code).slice(0, 3),
        String(info.postal_code).slice(3),
      ],
    },
    state: info.state,
    city: info.city,
    street: info.street,
  };
}

export {
  getInfoPostalCode,
  getRandomPostalCodeValid,
  getRandomPostalCodeInvalid,
};
