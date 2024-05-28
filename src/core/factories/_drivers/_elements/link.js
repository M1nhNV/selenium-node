import { By } from 'selenium-webdriver';

export const findElementByLinkText = async (driver, linkText) => {
  return await driver.findElement(By.linkText(linkText));
};

export const findElementByPartialLinkText = async (driver, linkText) => {
  return await driver.findElement(By.partialLinkText(linkText));
};

export const getHrefLinkByLinkText = async (driver, linkText) => {
  const link = await findElementByLinkText(driver, linkText);
  return await link.getAttribute('href');
};
