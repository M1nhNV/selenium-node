import { fileURLToPath } from "url";

export const getFileName = () => {
  return fileURLToPath(import.meta.url);
};

export const getFileContent = () => {};
