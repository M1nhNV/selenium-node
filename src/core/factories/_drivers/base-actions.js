import size from "lodash/size.js";
import uniq from "lodash/uniq.js";
import { By, Key } from "selenium-webdriver";
export * from "./_elements/select.js";
export * from "./_elements/input.js";
export * from "./_elements/radio.js";
export * from "./_elements/execute_script.js";
export * from "./_elements/link.js";

import {
  findElementsByXpath,
  findElementById,
  findElementByXpath,
  findElementByClassName,
} from "./find.js";
import { clearMultipleSpace } from "#core/untilities/string.js";
import { sleep } from "./driver-base-actions.js";
import { scrollToElement } from "#core/factories/index.js";

async function getContentElement(driver, className) {
  const el = await driver.findElement(By.className(className));
  return el.textContent;
}

async function getTextById(driver, id) {
  const textValue = await findElementById(driver, id);
  return textValue.getText();
}

async function getTextByXpath(driver, id) {
  const textValue = await findElementByXpath(driver, id);
  return textValue.getText();
}

async function getTextElementsByXpath(driver, xpath, isUniq = true) {
  const elements = await findElementsByXpath(driver, xpath);

  if (!size(elements)) {
    return [];
  }

  const data = [];
  for (const index in elements) {
    const text = await elements[index].getText();
    if (text) {
      data.push(text);
    }
  }
  return isUniq ? uniq(data) : data;
}

async function clickElementById(driver, id) {
  const element = await findElementById(driver, id);
  element.click();
}

async function clickElementByClass(driver, className) {
  const element = await findElementByClassName(driver, className);
  element.click();
}

async function clickElementByXpath(driver, xpath, isScroll = false) {
  const element = await findElementByXpath(driver, xpath);
  if (isScroll) {
    await scrollToElement(driver, element);
    await sleep(driver, 0.5);
  }
  element.click();
}

async function doubleClickElementByXpath(driver, xpath, isScroll = false) {
  const element = await findElementByXpath(driver, xpath);
  if (isScroll) {
    await scrollToElement(driver, element);
    await sleep(driver, 0.5);
  }
  const actions = driver.actions({ async: true });
  await actions.doubleClick(element).perform();
}

async function clickElementsByXpath(driver, xpath, isScroll = false) {
  try {
    const elements = await findElementsByXpath(driver, xpath);
    for (let el of elements) {
      if (isScroll) {
        await scrollToElement(driver, el);
        await sleep(driver, 0.5);
      }

      el.click();
    }
  } catch {
    return;
  }
}

async function getCurrentUrl(driver, notAuth = false) {
  const url = await driver.getCurrentUrl();
  if (notAuth) {
    const newUrl = new URL(url);

    return newUrl.origin + newUrl.pathname + newUrl.search;
  }

  return url;
}

/**
 * verify element display
 * @param driver
 * @param xpath
 * @returns {Promise<void>}
 */
async function isElementDisplay(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  return element.isDisplayed();
}
/**
 * verify element exist
 * @param driver
 * @param xpath
 * @returns {boolean}
 */
async function isElementExist(driver, xpath) {
  try {
    const element = await findElementByXpath(driver, xpath);
    return size(element) > 0;
  } catch {
    return false;
  }
}

async function getValueByXpath(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  return await element.getAttribute("value");
}

async function getAllValueByXpath(driver, xpath) {
  try {
    const elements = await findElementsByXpath(driver, xpath);
    if (!size(elements)) {
      return [];
    }
    const data = [];
    for (const index in elements) {
      const value = await elements[index].getAttribute("value");
      data.push(clearMultipleSpace(value));
    }
    return data;
  } catch (error) {
    return [];
  }
}

async function sendKeyBoardTAB(driver, xpath) {
  const input = await findElementByXpath(driver, xpath);
  input.sendKeys(Key.TAB);
}

async function countElementNumber(driver, xpath) {
  const element = await findElementsByXpath(driver, xpath);
  return element.length;
}

async function getAllTextByClassXpath(driver, xpath, isUniq = true) {
  try {
    const allTextElements = await findElementsByXpath(driver, xpath);
    if (!allTextElements.length) {
      return [];
    }
    const listText = [];

    for (const element of allTextElements) {
      await getTexts(element, listText);
    }

    return isUniq ? uniq(listText) : listText;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getTexts(element, data = []) {
  const text = await element.getText();
  if (text && text.length) {
    data.push(text);
  }
}
async function getAttribute(driver, xpath, attribute) {
  const textValue = await findElementByXpath(driver, xpath);
  return textValue.getAttribute(attribute);
}

async function getAttributes(driver, xpath, attribute, isUniq = true) {
  try {
    const elements = await findElementsByXpath(driver, xpath);
    if (!elements.length) {
      return [];
    }
    const data = [];
    for (const element of elements) {
      const value = await element.getAttribute(attribute);
      data.push(value);
    }
    return isUniq ? uniq(data) : data;
  } catch {
    return [];
  }
}

async function getLengthValueInputByXPath(driver, xpath) {
  const value = await getValueByXpath(driver, xpath);
  return value.length;
}

async function getRectOfElementByXpath(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  return await element.getRect();
}
/*
 * verify element enable
 * @param driver
 * @param xpath
 * @returns {Promise<void>}
 */
async function isElementEnabled(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  return element.isEnabled();
}

async function uploadFile(driver, xpath, fileUrl) {
  const inputUpload = await findElementByXpath(driver, xpath);
  inputUpload.sendKeys(fileUrl);
}

async function scrollToElementByXpath(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  await driver.actions().scroll(0, 0, 0, 0, element).perform();
}

async function isElementDisabledByXpath(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);

  return Boolean(await element.getAttribute("disabled"));
}

async function isExistClassDisabledByXpath(
  driver,
  xpath,
  classDisabled = "disabled",
) {
  const classAttr = await getAttribute(driver, xpath, "class");
  return classAttr.includes(classDisabled);
}

async function handleAlertBrowser(driver, isAccept = true) {
  try {
    if (await driver.alertIsPresent()) {
      const alert = await driver.switchTo().alert();

      if (isAccept) {
        return alert.accept();
      }

      return alert.dismiss();
    }
  } catch {
    return null;
  }
}

export {
  clickElementById,
  clickElementByClass,
  countElementNumber,
  clickElementByXpath,
  clickElementsByXpath,
  getCurrentUrl,
  getTextElementsByXpath,
  getTextByXpath,
  getTextById,
  getAllValueByXpath,
  getValueByXpath,
  getContentElement,
  getAllTextByClassXpath,
  getRectOfElementByXpath,
  getLengthValueInputByXPath,
  getAttributes,
  getAttribute,
  getTexts,
  isElementEnabled,
  isElementExist,
  isElementDisplay,
  isElementDisabledByXpath,
  sendKeyBoardTAB,
  uploadFile,
  doubleClickElementByXpath,
  scrollToElementByXpath,
  isExistClassDisabledByXpath,
  handleAlertBrowser,
};
