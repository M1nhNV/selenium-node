import assert from "assert";
import { loadAndDestroyDriver } from "#driver-base-action";

let driver = null;
loadAndDestroyDriver((instance) => (driver = instance));
describe("Page demo with factory", function () {
  it("Get title page", async function () {
    await driver.get("https://www.selenium.dev/selenium/web/web-form.html");
    const title = await driver.getTitle();
    assert.equal("Web form", title);
  });
});
