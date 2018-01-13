/*
 * bankin-scraping
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

const fs = require("fs");
const Log = require("./log");

/**
 * Gère le résultat du script.
 */

class ResultHandler {

    /**
     * Exporte les transactions.
     *
     * Les transactions seront exportées au format JSON, dans le fichier `transactions.json`
     * à l'endroit depuis lequel le script est exécuté.
     *
     * @param {Object} transactionsObject L'objet contenant les transactions.
     */

    static async exportTransactions(transactionsObject) {

        return new Promise(function(resolve, reject) {

            const jsonBody = JSON.stringify(transactionsObject, null, 2);

            // Chemin de sortie

            var outputPath = process.cwd();

            if (outputPath.endsWith("/") == false) {
                outputPath += "/";
            }

            outputPath += "transactions.json";

            // Écriture du fichier

            fs.writeFile(outputPath, jsonBody, function(err) {

                if (err) {
                    Log.fail("Impossible d'enregistrer le fichier", err);
                }

                Log.success("Les transactions ont été enregsitrées sous '" + outputPath + "'");
                resolve();

            });

        });

    }

}

module.exports = ResultHandler;