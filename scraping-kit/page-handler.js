/*
 * bankin-scraping
 * 
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

const { ThenableWebDriver } = require('selenium-webdriver');

class PageHandler {

    constructor(driver) {
        this.driver = driver;
    }

    async parseData() {

        return [
            {
                "Account": "A",
                "Transaction": "B",
                "Amount": 150,
                "Currency": "€"
            },
            {
                "Account": "A",
                "Transaction": "B",
                "Amount": 150,
                "Currency": "€"
            }
        ];
        
    }

}

module.exports = PageHandler