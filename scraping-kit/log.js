/*
 * bankin-scraping
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

/**
 * Ensemble de fonctions affichant des messages dans la console.
 */

class Log {

    /**
     * Affiche un message d'information sur le script.
     * 
     * @param {String} message Le message d'info à afficher.
     */

    static info(message) {
        console.log("•", info);
    }

    /**
     * Indique une étape d'un processus.
     *
     * @param {String} i Le numéro de l'étape dans le processus.
     * @param {String} message Le message à afficher (tâche en cours).
     */

    static step(i, message) {
        console.log("\x1b[35m" + i + "> \x1b[34m" + message + "\x1b[0m");
    }

    /**
     * Indique une erreur et quitte le processus avec le statut “-1“.
     *
     * @param {String} message Une description de la tâche qui n'a pas pû être achevée.
     * @param {Error} error L'erreur qui est survenue. Cette erreur doit contenir un message.
     */

    static fail(message, error) {
        console.log("\x1b[31m" + message + " : " + error.message + "\x1b[0m");
        process.exit(-1);
    }

    /**
     * Indique une erreur de programmation et quitte le processus avec le code d'erreur “-1“.
     *
     * @param {String} message Une description de l'erreur de programmation.
     */

    static preconditionFailure(message) {
        console.log("\x1b[31m" + message + "\x1b[0m");
        process.exit(-1);
    }

    /**
     * Indique le succès d'une tâche.
     *
     * @param {String} message Une description de la tâche achevée.
     */

    static success(message) {
        console.log("\x1b[32m" + message + "\x1b[0m");
    }

    /**
     * Indique le succès du script et termine son exécution.
     *
     * @param {String} message Le message de fin.
     */

    static finish(message) {
        console.log("\x1b[35m✔ \x1b[34m" + message + "\x1b[0m");
        process.exit(0);
    }

}

module.exports = Log;