import { Builder, until } from "selenium-webdriver";

export const getBuilder = () => {
  return new Builder().forBrowser("chrome").build();
};

export const initDriver = async () => {
  return getBuilder();
};

export const destroyDriver = async (driver) => {
  return await driver.quit();
};

export const openUrl = async (driver, url) => {
  await driver.get(url);
};

export const waitUntilElementIsVisible = async (driver, element, time) => {
  await driver.wait(until.elementIsVisible(element), time);
};

export const waitUntilElementIsSelected = async (driver, element, time) => {
  await driver.wait(until.elementIsSelected(element), time);
};

export const waitUntilElementsLocated = async (driver, element, time) => {
  await driver.wait(until.elementsLocated(element), time);
};
