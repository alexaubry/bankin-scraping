/*
 * bankin-scraping
 * 
 * Ce script charge la page demandée et en extrait les transactions. Pour plus d'informations
 * sur les technologies utilisées et sa structure, voir le fichier README.md.
 * 
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT License.
 */

const { PageLoader, PageHandler, ResultHandler, Log, ScriptEvaluator } = require("./scraping-kit");

/** L'URL de la page des transactions. */
const transactionsURL = "https://web.bankin.com/challenge/index.html";

/**
 * La fonction principale du script.
 */

async function main() {

    console.log("=== SCRAPING BANKIN' TRANSACTIONS ===");

    // 1) Chargement de la page des transactions

    Log.step("1", "Chargement de la page des transactions...");

    const pageLoader = new PageLoader(transactionsURL);
    const driver = await pageLoader.loadPage();
    Log.success("Page chargée.");

    // 2) Démarrage de l'analyse

    Log.step("2", "Analyse de la page...");
    const evaluator = new ScriptEvaluator();
    const pageHandler = new PageHandler(driver);
    
    evaluator.startScript();
    const data = await pageHandler.parseData();

    Log.success(data.transactions.length.toString() + " transactions trouvées.");

    // 3) Export JSON

    Log.step("3", "Export dans un fichier JSON...");
    await ResultHandler.exportTransactions(data);

    // :) Fin du script

    const speedEvaluation =  evaluator.finishScript();
    Log.finish("Toutes les transactions ont été traitées [" + speedEvaluation + "]");

}

main();