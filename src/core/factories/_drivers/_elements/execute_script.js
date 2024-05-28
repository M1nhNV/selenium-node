import { executeScript, findElementByXpath } from '#factories';

/**
 * Click by css
 *
 * @param driver
 * @param xpath
 */
async function executeClickJavaScript(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  await driver.executeScript('arguments[0].click();', element);
}

/**
 * set attribute
 * @param driver
 * @param xpath
 * @param attName
 * @param attValue
 * @returns {Promise<void>}
 */
async function setAttribute(driver, xpath, attName, attValue) {
  const element = await findElementByXpath(driver, xpath);
  await driver.executeScript('arguments[0].setAttribute(arguments[1], arguments[2]);', element, attName, attValue);
}

async function getTextByJavaScript(driver, xpath) {
  const textValue = await findElementByXpath(driver, xpath);
  return await driver.executeScript('return arguments[0].value', textValue);
}

/**
 * set attribute
 * @param driver
 * @param xpath
 * @param attValue
 * @returns {Promise<void>}
 */
async function setAttributeMaxLength(driver, xpath, attValue) {
  const element = await findElementByXpath(driver, xpath);
  await driver.executeScript('arguments[0].setAttribute(arguments[1], arguments[2]);', element, 'maxlength', attValue);
}

async function getTextInScriptTagByXpath(driver, xpath) {
  const el = await findElementByXpath(driver, xpath);
  return await driver.executeScript('return arguments[0].innerHTML', el);
}

async function getCssBeforeContentByXpath(driver, xpath) {
  try {
    const el = await findElementByXpath(driver, xpath);
    const script = "return window.getComputedStyle(arguments[0],'::before').getPropertyValue('content')";
    const text = await executeScript(driver, script, el);
    const result = text.match(/"(.*)"/);
    return result[1];
  } catch (e) {
    return '';
  }
}

async function removeAttributeByXpath(driver, xpath, attribute) {
  const el = await findElementByXpath(driver, xpath);
  return await executeScript(driver, `arguments[0].removeAttribute('${attribute}')`, el);
}

async function removeClassByXpath(driver, xpath, className) {
  const el = await findElementByXpath(driver, xpath);
  return await executeScript(driver, `arguments[0].classList.remove('${className}')`, el);
}

async function removeAttributeDisabledByXpath(driver, xpath) {
  return removeAttributeByXpath(driver, xpath, 'disabled');
}

export {
  setAttribute,
  executeClickJavaScript,
  getTextByJavaScript,
  setAttributeMaxLength,
  getTextInScriptTagByXpath,
  getCssBeforeContentByXpath,
  removeAttributeByXpath,
  removeClassByXpath,
  removeAttributeDisabledByXpath,
};
