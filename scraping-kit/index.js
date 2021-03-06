/*
 * bankin-scraping
 *
 * Ce module fournit les algorithmes de traitement des données de la page web.
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

/*=== Core Types ===*/

module.exports.PageLoader = require("./page-loader");
module.exports.PageScraper = require("./page-scraper");
module.exports.ResultHandler = require("./result-handler");

/*== Stats ===*/

module.exports.Log = require("./log");
module.exports.Benchmark = require("./benchmark");