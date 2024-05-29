import {
  executeScript,
  findElementsByXpath,
  findElementsClassName,
  findElementByXpath,
} from "#core/factories/index.js";
import { Select } from "selenium-webdriver";
import isArray from "lodash/isArray.js";
import max from "lodash/max.js";
import uniq from "lodash/uniq.js";
import size from "lodash/size.js";

const _getSelectedOptions = async (selectElements, index, data = []) => {
  const select = new Select(selectElements[index]);
  const selectedOptionList = await select.getAllSelectedOptions();
  const text = await selectedOptionList[0].getText();
  if (!!text && !!text.length && !data.includes(text)) {
    data.push(text);
  }
};

const selectDropdownWithValueByXpath = async (driver, xpath, value) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);
  return await select.selectByValue(`${value}`);
};

const selectDropdownWithTextByXpath = async (driver, xpath, valueSelect) => {
  const element = await findElementByXpath(driver, xpath);
  const select = new Select(element);
  return await select.selectByVisibleText(valueSelect);
};

const getValueSelectedSelectByXpath = async (driver, xpath) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);

  const firstOption = await select.getFirstSelectedOption();
  return firstOption.getAttribute("value");
};

const getInnerHTMLSelectedSelectByXpath = async (driver, xpath) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);

  const firstOption = await select.getFirstSelectedOption();
  return firstOption.getAttribute("innerHTML");
};

const getInnerTextsByXpath = async (driver, xpath) => {
  const els = await findElementsByXpath(driver, xpath);

  if (!size(els)) {
    return [];
  }

  const texts = [];
  for (const el of els) {
    texts.push(await el.getAttribute("innerText"));
  }

  return texts;
};

const getMaxValueSelectByXpath = async (driver, xpath) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);

  const options = await select.getOptions();
  const value = await Promise.all(
    options.map(async (option) => Number(await option.getAttribute("value"))),
  );

  return max(value);
};

const getTextOptionsSelectByXpath = async (driver, xpath) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);
  const optionList = await select.getOptions();
  if (!size(optionList)) {
    return [];
  }

  const data = [];
  for (const index in optionList) {
    const text = await optionList[index].getText();
    data.push(text);
  }
  return data;
};

const getAllSelectedOptionsValueByXpath = async (driver, xpath) => {
  const elements = await findElementsByXpath(driver, xpath);
  return Promise.all(
    elements.map(async (el) => {
      const select = new Select(el);
      const firstOption = await select.getFirstSelectedOption();
      return await executeScript(
        driver,
        "return arguments[0].value;",
        firstOption,
      );
    }),
  );
};

/**
 * Get all select and option by same the xpath
 * @param driver
 * @param locator
 * @returns {Promise<*[]>}
 */
const getMultiSelectOptionsTextByXpath = async (driver, locator) => {
  const selectElements = await findElementsByXpath(driver, locator);
  const total = [];
  await Promise.all(
    selectElements.map(async (item) => {
      const select = new Select(item);
      const options = await select.getOptions();
      let rowData = [];
      if (isArray(options)) {
        rowData = await Promise.all(
          options.map(async (option) => await option.getText()),
        );
      }

      total.push(rowData);
    }),
  );

  return total;
};

/**
 * Get multi select and option is selected by same xpath
 * @param driver
 * @param locator
 * @returns {Promise<*[]>}
 */
const getMultiSelectedOptionsTextByXpath = async (driver, locator) => {
  const selectElements = await findElementsByXpath(driver, locator);
  const result = [];

  await Promise.all(
    selectElements.map(async (item) => {
      const select = new Select(item);
      const options = await select.getAllSelectedOptions();
      for (const index in options) {
        result.push(await options[index].getText());
      }
    }),
  );

  return result;
};

/**
 * Get all options of one select
 * @param driver
 * @param xpath
 * @returns {Promise<Awaited<!Promise<string>|*>[]|*[]>}
 */
const getAllOptionsTextSelectByXpath = async (driver, xpath) => {
  const selectElement = await findElementByXpath(driver, xpath);
  const select = new Select(selectElement);
  const options = await select.getOptions();

  if (isArray(options)) {
    return await Promise.all(
      options.map(async (option) => await option.getText()),
    );
  }

  return [];
};

const getAllSelectedOptionsByClassName = async (driver, className) => {
  try {
    const selectElements = await findElementsClassName(driver, className);
    if (!selectElements.length) {
      return [];
    }
    const listText = [];

    for (const index in selectElements) {
      await _getSelectedOptions(selectElements, index, listText);
    }

    return uniq(listText);
  } catch (error) {
    return [];
  }
};

const getAllSelectedOptionsByXpath = async (
  driver,
  xpath,
  optionsLength = 2,
) => {
  try {
    const selectElements = await findElementsByXpath(driver, xpath);
    if (!selectElements.length) {
      return [];
    }
    const listText = [];

    for (const index in selectElements) {
      if (optionsLength === listText.length) {
        break;
      }
      await _getSelectedOptions(selectElements, index, listText);
    }

    return uniq(listText);
  } catch (error) {
    return [];
  }
};

/**
 * verify element selected
 * @param driver
 * @param xpath
 * @returns {Promise<void>}
 */
const isElementSelected = async (driver, xpath) => {
  const element = await findElementByXpath(driver, xpath);
  return element.isSelected();
};

async function getTextSelectedSelectByXpath(driver, xpath) {
  try {
    const selectElement = await findElementByXpath(driver, xpath);
    const select = new Select(selectElement);

    const firstOption = await select.getFirstSelectedOption();
    return firstOption.getText();
  } catch {
    return "";
  }
}

async function selectDropdownWithIndexByXpath(driver, xpath, index) {
  const element = await findElementByXpath(driver, xpath);
  const select = new Select(element);
  return await select.selectByIndex(index);
}

async function getAllTextSelectedOptionsByXpath(driver, xpath) {
  try {
    const selectElements = await findElementsByXpath(driver, xpath);
    if (!selectElements.length) {
      return [];
    }

    const listText = [];

    for (const index in selectElements) {
      const select = new Select(selectElements[index]);

      const firstOption = await select.getFirstSelectedOption();
      const text = await firstOption.getText();
      listText.push(text);
    }

    return listText;
  } catch (error) {
    return [];
  }
}

async function resetAllDropdownWithTextByXpath(driver, xpath, valueSelect) {
  try {
    const selectElements = await findElementsByXpath(driver, xpath);
    if (!selectElements.length) {
      return [];
    }

    for (const index in selectElements) {
      const select = new Select(selectElements[index]);
      await select.selectByVisibleText(valueSelect);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export {
  selectDropdownWithValueByXpath,
  selectDropdownWithTextByXpath,
  getTextOptionsSelectByXpath,
  getValueSelectedSelectByXpath,
  getInnerHTMLSelectedSelectByXpath,
  getInnerTextsByXpath,
  getAllSelectedOptionsValueByXpath,
  getAllSelectedOptionsByXpath,
  getAllSelectedOptionsByClassName,
  getAllOptionsTextSelectByXpath,
  getMultiSelectedOptionsTextByXpath,
  getMultiSelectOptionsTextByXpath,
  getMaxValueSelectByXpath,
  isElementSelected,
  getTextSelectedSelectByXpath,
  selectDropdownWithIndexByXpath,
  getAllTextSelectedOptionsByXpath,
  resetAllDropdownWithTextByXpath,
};
