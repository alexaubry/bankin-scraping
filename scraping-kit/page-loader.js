/*
 * bankin-scraping
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

const { Builder } = require('selenium-webdriver');
const { Binary, Options } = require('selenium-webdriver/firefox');
const { Log } = require('./log');

/**
 * Charge une URL dans un driver Firefox.
 */

class PageLoader {

    /**
     * Créé un nouveau chargeur de page avec l'URL donnée.
     *
     * @param {String} url L'URL à charger.
     */

    constructor(url) {
        this.url = url;
        this._driver = null;
    }
    /**
     * Charge la page web.
     *
     * Si le chargement réussit, la fonction retournera le driver (type: `ThenableWebDriver`)
     * contenant la page chargée.
     *
     * Si le chargement échoue, le programme sera fermé.
     *
     * @returns {ThenableWebDriver} Le driver web contenant la page chargée.
     */

    async loadPage() {

        try {
            this._driver = _makeFirefoxDriver();
        } catch(error) {
            Log.fail("Impossible de démarrer Firefox", error);
        }

        try {
            await this._driver.get(this.url);
            return this._driver;
        } catch(error) {
            Log.fail("Impossible de charger la page web", error);
        }

    }

}

module.exports = PageLoader;

/*=== Helpers ===*/

/**
 * Créé un nouveau driver pour Firefox Headless.
 *
 * @returns {ThenableWebDriver} Un driver Firefox.
 * @throws {Error} Si la configuration est invalide.
 */

function _makeFirefoxDriver() {

    const firefoxBinary = new Binary();
    firefoxBinary.addArguments("-headless");

    const options = new Options();
    options.setBinary(firefoxBinary);

    return new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();

}