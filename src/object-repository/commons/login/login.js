import { BASE_URL } from "#constants/settings.js";
import size from "lodash/size.js";
import * as BaseActions from "#runner-base-action";
import { getInfoFromFile } from "#factories/file.js";

export const login = async (driver, params = {}) => {
  const url = `${BASE_URL}/auth/login`;

  if (size(params) === 0) {
    params = getInfoFromFile("info.json", ["email", "password"]);
  }

  await driver.get(url);

  const inputEmail = await BaseActions.findElementByName(driver, "email");
  const inputPass = await BaseActions.findElementByName(driver, "password");
  const buttonSubmit = await BaseActions.findElementByClassName(
    driver,
    "login-button",
  );

  inputEmail.sendKeys(params.email);
  inputPass.sendKeys(params.password);
  buttonSubmit.click();
};
