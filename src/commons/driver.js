import { Builder } from 'selenium-webdriver'
export const getBuilder = () => {
    return new Builder().forBrowser('chrome').build();
}


