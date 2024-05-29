import { Key } from "selenium-webdriver";
import {
  findElementsClassName,
  findElementByClassName,
  findElementById,
  findElementByXpath,
  findElementByName,
  sleep,
  findElementsByXpath,
  scrollToElement,
} from "#factories";

import size from "lodash/size.js";

const _fillValue = async (input, value) => {
  await input.clear();
  await input.sendKeys(value);
};

const fillValueByClass = async (driver, name, value) => {
  const input = await findElementByClassName(driver, name);
  await _fillValue(input, value);
};

const fillValueById = async (driver, id, value) => {
  const input = await findElementById(driver, id);
  await _fillValue(input, value);
};

const fillValueByXpath = async (driver, xpath, value, isBlur = false) => {
  const input = await findElementByXpath(driver, xpath);

  await _fillValue(input, value);

  if (isBlur) {
    await sleep(driver, 0.5);
    await blurInput(driver, input);
  }
};

const fillEmojiByXpath = async (driver, xpath, value, isBlur = false) => {
  const input = await findElementByXpath(driver, xpath);
  await driver.executeScript(
    "arguments[0].value = arguments[1];",
    input,
    value,
  );

  if (isBlur) {
    await driver.executeScript("arguments[0].blur()", input);
  }
};

const fillValueByName = async (driver, name, value, isBlur = false) => {
  const input = await findElementByName(driver, name);
  await _fillValue(input, value);

  if (isBlur) {
    await blurInput(driver, input);
  }
};

const blurInput = async (driver, input) => {
  await driver.executeScript("arguments[0].blur()", input);
};

const clearInputByXpath = async (driver, xpath) => {
  const input = await findElementByXpath(driver, xpath);
  input.clear();
};

const enterValueByXpath = async (driver, xpath, value) => {
  await clearInputByXpath(driver, xpath);
  await fillValueByXpath(driver, xpath, value);
};

const clearAllInputElements = async (driver, className) => {
  try {
    const inputs = await findElementsClassName(driver, className);
    if (!size(inputs)) {
      return;
    }
    for (let input of inputs) {
      await input.clear();
    }
  } catch (error) {
    console.log(error);
  }
};

async function clearAllInputByXpath(driver, xpath) {
  try {
    const elements = await findElementsByXpath(driver, xpath);
    if (!elements.length) {
      return [];
    }
    for (const element of elements) {
      await element.clear();
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function enterInputByXpath(driver, xpath) {
  const input = await findElementByXpath(driver, xpath);
  input.sendKeys(Key.ENTER);
}

async function fillAllValueByXpathWithCharacter(driver, xpath, character = "") {
  try {
    const elements = await findElementsByXpath(driver, xpath);
    if (!elements.length) {
      return [];
    }
    for (const element of elements) {
      await scrollToElement(driver, element);
      await sleep(driver, 0.5);
      await _fillValue(element, character);
    }
    return [character];
  } catch {
    return [];
  }
}

export {
  fillValueByClass,
  fillValueById,
  fillValueByXpath,
  fillValueByName,
  fillEmojiByXpath,
  blurInput,
  clearInputByXpath,
  clearAllInputElements,
  enterValueByXpath,
  enterInputByXpath,
  fillAllValueByXpathWithCharacter,
  clearAllInputByXpath,
};
