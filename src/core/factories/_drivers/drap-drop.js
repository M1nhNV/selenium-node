import { findElementByXpath } from "#factories";

async function dragDropOnElementByXpath(driver, xpathTarget, xpathFinish) {
  const start = await findElementByXpath(driver, xpathTarget);
  const finish = await findElementByXpath(driver, xpathFinish);
  const actions = driver.actions({ async: true });
  await actions.dragAndDrop(start, finish).perform();
}

async function dragDropOffsetByXpath(driver, xpathTarget, offset) {
  const element = await findElementByXpath(driver, xpathTarget);
  const actions = driver.actions({ async: true });
  await actions.dragAndDrop(element, offset).perform();
}

async function getRectElementByXpath(driver, xpath) {
  const element = await findElementByXpath(driver, xpath);
  return await element.getRect();
}

export {
  dragDropOnElementByXpath,
  dragDropOffsetByXpath,
  getRectElementByXpath,
};
