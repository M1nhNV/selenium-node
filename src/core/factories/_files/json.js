import { writeToFile } from '#factories';

const writeJsonFile = async (fileName, data) => {
  await writeToFile(fileName, JSON.stringify(data, null, 2));
};

export { writeJsonFile };
