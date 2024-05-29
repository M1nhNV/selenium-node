import { By } from "selenium-webdriver";

export const findElementById = async (driver, id) => {
  return await driver.findElement(By.id(id));
};

export const findElementByName = async (driver, name) => {
  return await driver.findElement(By.name(name));
};

export const findElementsByName = async (driver, name) => {
  return await driver.findElements(By.name(name));
};

export const findElementByClassName = async (driver, className) => {
  return await driver.findElement(By.className(className));
};

export const findElementsClassName = async (driver, name) => {
  return await driver.findElements(By.className(name));
};

export const findElementByXpath = async (driver, name) => {
  return await driver.findElement(By.xpath(name));
};

export const findElementsByXpath = async (driver, xpath) => {
  return await driver.findElements(By.xpath(xpath));
};
