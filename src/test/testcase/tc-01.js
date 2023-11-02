import assert from "assert";
import { initDriver, destroyDriver, getTitle } from "../../commons/object.js";
import { BASE_URL } from "../../constants/system.js";

describe('Page Login', function () {
    let driver = {}

    before(async function () {
        driver = await initDriver()
    })

    it('Test case 01', async function () {
        await driver.get('https://www.selenium.dev/selenium/web/web-form.html')
        const title = await getTitle(driver)
        assert.equal("Web form", title)
    });

    it('Test case 02', async function () {
        await driver.get(BASE_URL + '/auth/login')
        const title = await getTitle(driver)
        assert.equal("ログイン", title)
    });

    after(async () => await destroyDriver(driver))
})
