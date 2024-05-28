import { addContext } from '#report';
import encoding from 'encoding-japanese';
import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import Papa from 'papaparse';
import size from 'lodash/size.js';
import { makeCopyFileUrl, writeToFile } from '#factories';

async function readJPCSV(fileUrl) {
  return new Promise((resolve, reject) => {
    readFile(fileUrl, function (err, data) {
      if (err) {
        addContext(this, 'Error reading file:' + err);
        reject(err);
        return;
      }

      const result = encoding.convert(new Uint8Array(data), {
        to: 'unicode',
        type: 'string',
      });

      resolve(result);
    });
  });
}

async function readCSVFile(link, fileType = 'utf-8') {
  try {
    const rows = await readFile(link, fileType);
    return await parse(rows, { columns: true, relax_quotes: true });
  } catch (error) {
    return [];
  }
}

const filterCsvCol = async (file, headers, newFileName = '') => {
  let fileUrl = makeCopyFileUrl(file);

  if (newFileName !== '') {
    fileUrl = newFileName;
  }

  await writeToFile(fileUrl, stringify([headers]));

  const content = await readJPCSV(file);
  const contentParse = Papa.parse(content, {
    header: true,
    dynamicTyping: true,
  });

  const pageContent = [];

  contentParse.data.map((row) => {
    const newRow = {};
    const rowEntries = Object.entries(row);

    for (const [key, value] of rowEntries) {
      if (headers.includes(key) && rowEntries.length >= headers.length) {
        newRow[key] = value;
      }
    }

    if (size(newRow) > 0) {
      pageContent.push(newRow);
    }
  });

  if (pageContent.length > 0) {
    await writeToFile(fileUrl, stringify(pageContent));
  }

  return fileUrl;
};

export { readJPCSV, readCSVFile, filterCsvCol };
