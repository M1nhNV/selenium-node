import { destroyDriver, initDriver } from "#src/core/factories/driver.js";

export const loadAndDestroyDriver = (callback) => {
  let driver = null;
  before(async () => {
    driver = await initDriver();
    callback(driver);
  });

  after(async () => {
    await destroyDriver(driver);
  });
};
