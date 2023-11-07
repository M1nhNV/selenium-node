import { By } from "selenium-webdriver";
import size from "lodash/size.js";

export const findElementById = async (driver, id) => {
  return await driver.findElement(By.id(id));
};

export const findElementByName = async (driver, name) => {
  return await driver.findElement(By.name(name));
};

export const findElementByClassName = async (driver, className) => {
  return await driver.findElement(By.className(className));
};

export const findElementByXpath = async (driver, name) => {
  return await driver.findElement(By.xpath(name));
};

export const findAllElementsClassName = async (driver, name) => {
  return await driver.findElements(By.className(name));
};

export const getContentElement = async (driver, className) => {
  const el = await driver.findElement(By.className(className));
  return el.textContent;
};

export const fillValueByClass = async (driver, name, value) => {
  const input = await findElementByClassName(driver, name);
  await input.clear();
  await input.sendKeys(value);
};

export const getTextById = async (driver, id) => {
  const textValue = await findElementById(driver, id);
  return textValue.getText();
};

export const getTextByXpath = async (driver, id) => {
  const textValue = await findElementByXpath(driver, id);
  return textValue.getText();
};

export const fillValueById = async (driver, id, value) => {
  const input = await findElementById(driver, id);
  await input.clear();
  await input.sendKeys(value);
};

export const fillValueByXpath = async (driver, xpath, value) => {
  const input = await findElementByXpath(driver, xpath);
  input.sendKeys(value);
};

export const clickElementById = async (driver, id) => {
  const element = await findElementById(driver, id);
  element.click();
};

export const clickElementByXpath = async (driver, xpath) => {
  const element = await findElementByXpath(driver, xpath);
  element.click();
};
