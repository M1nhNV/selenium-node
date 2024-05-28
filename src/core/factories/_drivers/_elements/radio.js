import { findElementsByXpath } from '#factories';
import uniq from 'lodash/uniq.js';
import size from 'lodash/size.js';

async function getTextRadioByXpath(driver, xpath) {
  try {
    const listText = [];
    const listRadios = await findElementsByXpath(driver, xpath);
    if (!size(listRadios)) {
      return [];
    }
    for (const index in listRadios) {
      const text = await listRadios[index].getText();
      listText.push(text);
    }
    return listText;
  } catch (error) {
    return [];
  }
}

async function isAllRadiosSelectedByXpath(driver, xpath) {
  try {
    const selected = [];
    const listRadios = await findElementsByXpath(driver, xpath);
    if (!size(listRadios)) {
      return [];
    }
    for (const index in listRadios) {
      const isSelected = await listRadios[index].isSelected();
      selected.push(isSelected);
    }
    return uniq(selected);
  } catch {
    return [];
  }
}

export { getTextRadioByXpath, isAllRadiosSelectedByXpath };
