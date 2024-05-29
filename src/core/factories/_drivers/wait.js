import { DEFAULT_TIME_WAITING } from "#settings";
import { By, until } from "selenium-webdriver";

async function waitUntilElementIsVisible(
  driver,
  element,
  time = DEFAULT_TIME_WAITING,
) {
  await driver.wait(until.elementIsVisible(element), time * 1000);
}

async function waitForElement(driver, xpath, time = DEFAULT_TIME_WAITING) {
  await driver.wait(until.elementLocated(By.xpath(xpath)), time * 1000);
  await waitUntilElementIsVisible(
    driver,
    driver.findElement(By.xpath(xpath), time),
  );
}

async function waitForElementWithClass(
  driver,
  className,
  time = DEFAULT_TIME_WAITING,
) {
  await driver.wait(until.elementLocated(By.className(className)), time * 1000);
  await waitUntilElementIsVisible(
    driver,
    driver.findElement(By.className(className), time),
  );
}

async function waitForElementWithId(driver, id, time = DEFAULT_TIME_WAITING) {
  await driver.wait(until.elementLocated(By.id(id)), time * 1000);
  await waitUntilElementIsVisible(driver, driver.findElement(By.id(id), time));
}

async function waitForElementWithName(
  driver,
  name,
  time = DEFAULT_TIME_WAITING,
) {
  await waitUntilElementIsVisible(
    driver,
    driver.findElement(By.name(name)),
    time,
  );
}

async function waitForUrlIs(driver, url, time) {
  await driver.wait(until.urlIs(url, time * 1000));
}

async function waitForUrlContains(driver, substrUrl, time) {
  await driver.wait(until.urlContains(substrUrl, time * 1000));
}

async function waitForTitleContains(driver, url, time) {
  await driver.wait(until.titleContains(url, time * 1000));
}

async function waitForElementStalenessOf(
  driver,
  element,
  time = DEFAULT_TIME_WAITING,
) {
  try {
    await driver.wait(until.stalenessOf(element, time * 1000));
  } catch (error) {
    console.log(error);
  }
}

export {
  waitUntilElementIsVisible,
  waitForElement,
  waitForElementWithName,
  waitForElementWithId,
  waitForElementWithClass,
  waitForTitleContains,
  waitForUrlIs,
  waitForElementStalenessOf,
  waitForUrlContains,
};
