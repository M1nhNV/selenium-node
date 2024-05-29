import assert from "assert";
import { loadAndDestroyDriver } from "#factories";

let driver = null;

describe("Page demo with factory", async function () {
  await loadAndDestroyDriver((instance) => (driver = instance));

  it("Get title page", async function () {
    await driver.get("https://www.selenium.dev/selenium/web/web-form.html");
    const title = await driver.getTitle();
    assert.equal("Web form", title);
  });
});
