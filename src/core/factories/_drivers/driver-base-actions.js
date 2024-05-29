import { Builder, Capabilities } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome.js";
import {
  DEFAULT_TIME_WAITING,
  ABSOLUTE_PATH_RESULT_DIR,
  TEST_STATE,
  DEFAULT_BROWSER_SETTINGS,
} from "#settings";
import { writeImageFile } from "#factories";

async function settingOptionsForBrowser(driver, options) {
  const browserOptions = { ...DEFAULT_BROWSER_SETTINGS, ...options };

  if (browserOptions.maximum) {
    driver.manage().window().maximize();
  }
}

async function loadAndDestroyDriver(callback, options) {
  let driver = null;
  before(async function () {
    driver = await initDriver();
    await settingOptionsForBrowser(driver, options);
    callback(driver);
  });

  afterEach(async function () {
    if (
      process.env.ALLOW_SCREEN_SHORT === "true" &&
      this.currentTest.state === TEST_STATE.FAILED
    ) {
      await takeScreenShort(driver, this.currentTest.title);
    }
  });

  after(async function () {
    await destroyDriver(driver);
  });
}

async function setHeadless(builder) {
  const options = new Chrome.Options();
  builder.setChromeOptions(options.addArguments("--headless=new"));

  return builder;
}

async function setCapabilities(builder) {
  const chromeCapabilities = Capabilities.chrome();
  const chromeOptions = {
    prefs: {
      "download.default_directory": DEFAULT_BROWSER_SETTINGS.downloadPath,
    },
  };

  chromeCapabilities.set("goog:chromeOptions", chromeOptions);
  builder.withCapabilities(chromeCapabilities);

  return builder;
}

async function getBuilder() {
  let builder = new Builder().forBrowser("chrome");

  if (process.env.CHROME_SETTING_HEADLESS === "true") {
    builder = await setHeadless(builder);
  }

  builder = await setCapabilities(builder);

  return builder.build();
}

async function initDriver() {
  return getBuilder();
}

async function destroyDriver(driver) {
  return await driver.quit();
}

async function openUrl(driver, url) {
  await driver.get(url);
}

async function openNewTab(driver) {
  return await driver.switchTo().newWindow("tab");
}

async function openNewWindow(driver) {
  return await driver.switchTo().newWindow("window");
}

async function switchToTab(driver, tabIndex) {
  const tabs = await getAllWindowHandles(driver);
  if (tabs.length >= tabIndex) {
    return await driver.switchTo().window(tabs[tabIndex]);
  }
  return await openNewTab(driver);
}

async function switchToIFrame(driver, iframe) {
  return await driver.switchTo().frame(iframe);
}

async function closeTab(driver) {
  await driver.close();
}

async function getAllWindowHandles(driver) {
  return await driver.getAllWindowHandles();
}
/**
 * process force logout through clear cookies
 * @param driver
 * @returns {Promise<void>}
 */
async function processForceLogout(driver) {
  const cookies = await driver.manage().getCookies();

  for (const cookie of cookies) {
    if (cookie.name === "auth_token") {
      await driver.manage().deleteCookie("auth_token");
    }
  }
}

async function sleep(driver, time = DEFAULT_TIME_WAITING) {
  return await driver.sleep(time * 1000);
}

async function executeScript(driver, script, elements) {
  return await driver.executeScript(script, elements);
}

async function takeScreenShort(driver, name) {
  try {
    const img = await driver.takeScreenshot();
    const absolutePath = `${ABSOLUTE_PATH_RESULT_DIR}/images`;
    await writeImageFile(absolutePath, name, img);
  } catch (error) {
    console.log("takeScreenShort", error);
  }
}
async function getRefresh(driver) {
  return await driver.navigate().refresh();
}

async function closeAllTabsExceptFirst(driver) {
  try {
    const windowHandles = await driver.getAllWindowHandles();
    if (windowHandles.length <= 1) {
      return;
    }
    for (let i = 1; i < windowHandles.length; i++) {
      await driver.switchTo().window(windowHandles[i]);
      await driver.close();
    }
    await driver.switchTo().window(windowHandles[0]);
  } catch (error) {
    console.log("closeAllTabsExceptFirst =>>", error);
  }
}

export {
  destroyDriver,
  takeScreenShort,
  sleep,
  processForceLogout,
  getAllWindowHandles,
  getBuilder,
  switchToTab,
  switchToIFrame,
  setCapabilities,
  setHeadless,
  settingOptionsForBrowser,
  openNewTab,
  openUrl,
  loadAndDestroyDriver,
  executeScript,
  openNewWindow,
  initDriver,
  closeTab,
  getRefresh,
  closeAllTabsExceptFirst,
};
