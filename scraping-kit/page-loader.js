/*
 * bankin-scraping
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

const { Capabilities, Builder } = require("selenium-webdriver");
const Log = require("./log");

/**
 * Charge une URL dans un driver Chrome.
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
            this._driver = _makeChromeDriver();
        } catch(error) {
            Log.fail("Impossible de démarrer Chrome", error);
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
 * Créé un nouveau driver pour Chrome Headless.
 *
 * @returns {ThenableWebDriver} Un driver Chrome.
 * @throws {Error} Si la configuration est invalide.
 */

function _makeChromeDriver() {

    // > Trouver le Driver

    // Le driver se situe dans le dossier ./node_modules
    // On ajoute ce dossier au PATH pour que Selenium puisse le trouver

    var chromeDriverPath = process.cwd();

    if (chromeDriverPath.endsWith("/") == false) {
        chromeDriverPath += "/";
    }

    chromeDriverPath += "node_modules/chromedriver/bin";
    process.env.PATH += (":" + chromeDriverPath);

    // > Démarrer Chrome en mode Headless

    const chromeCapabilities = Capabilities.chrome();
    chromeCapabilities.set("chromeOptions", {args: ["--headless"]});

    return new Builder()
        .forBrowser("chrome")
        .withCapabilities(chromeCapabilities)
        .build();

}