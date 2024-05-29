import { writeFileSync } from "fs";
import { isExistDir, createDir } from "#factories";

const writeImageFile = async (path, imageName, img) => {
  if (!isExistDir(path)) {
    await createDir(path);
  }

  await writeFileSync(`${path}/${imageName}.png`, img, "base64");
};

export { writeImageFile };
