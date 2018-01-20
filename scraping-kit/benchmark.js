/*
 * bankin-scraping
 *
 * Copyright (c) 2018 Alexis Aubry. Licensed under the terms of the MIT Licence.
 */

const Log = require("./log");

/**
 * Évalue la rapidité du script.
 *
 * Appelez `startProcessing` pour démarrer l'enregistrement des stats. Appelez `finishProcessing`
 * pour terminer l'enregistrement des stats et obtenir les infos.
 */

class Benchmark {

    /**
     * Créé une nouvelle instance.
     *
     * N.B.: Les instances ne sont pas réutilisables. Vous devez créér un nouvel objet pour
     * chaque nouvelle tâche mesurée.
     */

    constructor() {
        this._startDate = null;
        this._endDate = null;
    }

    /**
     * Démarre l'enregistrement des statistiques.
     *
     * Vous ne pouvez pas appeler cette méthode plus d'une fois, ou après avoir
     * fini l'enregistrement. Pour démarrer un nouvel enregistrement, crééz un nouvel objet.
     */

    startProcessing() {

        if (this._startDate !== null) {
            Log.precontionFailure("Le statistiques ne peuvent pas être réactivées.");
        }

        this._startDate = new Date();

    }

    /**
     * Termine l'enregistrement des statistiques et en retourne une version lisible.
     *
     * Vous ne pouvez pas appeler cette méthode plus d'une fois.
     *
     * @returns {String} La durée d'exécution du script, formattée de manière lisible.
     */

    finishProcessing() {

        const endDate = new Date();

        if (this._endDate !== null) {
            Log.precontionFailure("Le statistiques ne peuvent pas être désactivées une deuxième fois.");
        }

        /* Calcul de la durée */

        this._endDate = endDate;
        const duration = (this._endDate.valueOf() - this._startDate.valueOf()) / 1000;

        /* Création de la version lisible */

        if (duration < 60) {

            // Si la durée est inférieure à 1 minute, afficher seulement les secondes.
            return duration.toFixed(3).toString() + "s";

        } else if (duration < 3600) {

            // Si la durée est inférieure à 1 heure, afficher les minutes et les secondes.
            return  _formatMS(duration);

        } else {

            // Si la durée est supérieure ou égale à 1 heure, afficher heures, minutes et secondes.
            return _formatHMS(duration);

        }

    }

}

module.exports = Benchmark;

/*=== Helpers ===*/

/**
 * Formatte des secondes en minutes et secondes (ex: 61 -> 1min. 1s)
 *
 * @param {Number} time Le temps en secondes.
 * @return {String} Le texte qui correspond au temps.
 */

function _formatMS(time) {

    let minutes = (Math.floor(time / 60)).toString();
    let seconds = (Math.floor(time % 60)).toString();

    return minutes + "‘ " + seconds + "s";

}

/**
 * Formatte des secondes en heures, minutes et secondes (ex: 3661 -> 1h 1min. 1s)
 *
 * @param {Number} time Le temps en secondes.
 * @return {String} Le texte qui correspond au temps.
 */

function _formatHMS(time) {

    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = Math.floor((time - (hours * 3600) - (minutes * 60)));

    return hours.toString() + "h " + minutes.toString() + "min. " + seconds.toString() + "s";

}