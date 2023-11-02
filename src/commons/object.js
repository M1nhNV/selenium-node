import {getBuilder} from "./driver.js";


export const initDriver = async () => {
    return getBuilder()
}

export const destroyDriver = async (driver) => {
    return await driver.quit()
}

export const getTitle = async (driver) => {
    return await driver.getTitle()
}