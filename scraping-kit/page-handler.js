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

        return {
        
            "transactions": [
                {
                    "account": "A",
                    "transaction": "B",
                    "amount": 150,
                    "currency": "€"
                },

                {
                    "account": "A",
                    "transaction": "B",
                    "amount": 150,
                    "currency": "€"
                }

            ]
        
        };
        
    }

}

module.exports = PageHandler