# Challenge Scraping Bankin' 

Ce paquet Node.JS scarppe les transactions d'une liste pour le [Challenge Engineering Bankin' #1](https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117).

|                | Fonctions principales |
-----------------|------------------------
&#x2611;&#xFE0F; | Récupère les 4999 transactions
&#x1F4AF;| 100% fiable, peu importe le mode
&#x26A1;| Rapide (≈1.6s sur MacBook Pro 2017)
&#x2728;| Structure orientée objet, simple et propre
&#x1F4DA; | 100% documenté

## Utilisation

1. Installez la dernière version de Google Chrome (testé avec 63.0)

2. Installez Node.JS (version minimum: 8.9.4 LTS)

3. Ouvrez un terminal, clonez ce répertoire et `cd` dans le dossier

~~~bash
git clone https://github.com/alexaubry/bankin-scraping alexaubry-bankin-scraping
cd alexaubry-bankin-scraping
~~~

4. Installez les dépendances Node (`npm install`)

5. Lancez le script avec la commande `node .`

Les transactions seront enregistrées dans le fichier `transactions.json` à la racine du script.

## Technologies utilisées

- Écrit en JavaScript (ECMA 2017 - avec `async/await`)
- Exécuté avec Node.JS
- Utilise Chrome Headless et Selenium pour le traitement de la page web

Le paquet n'a pas d'autres dépendances et se lance rapidement.

## Structure

Le paquet contient deux composants essentiels:

- Le framework `scraping-kit` qui regroupe les algorithmes nécessaires au scraping
- Le script `index.js` qui exécute les opérations

## Analyse préliminaire

Le script a été développé après une analyse profonde du fonctionnement du site.

### Structure de la page

Cette analyse a révélé l'existence de trois modes:

- *Normal* : un tableau ou une iFrame (choix aléatoire) sont affichés direcement au chargement du site

- *Lent* : après quelques secondes (durée aléatoire), on bascule sur le mode normal

- *Échec* : une alerte est affichée au lancement. Un bouton “Reload Transactions“ permet de basculer soit sur le mode normal, soit sur le mode slow (choix aléatoire)

Le mode est choisi aléatoirement au chargement du site.

Le site affiche un bouton "Next" qui charge la suite de la liste (ajoute le paramètre `start` à l'URL). Toutefois cette URL pointe toujours vers la liste 100-150. Il faut donc ignorer ce bouton et gérer la pagination manuellement.

Si le paramètre `start` dépasse le nombre total de transactions, le tableau affiché sera vide (avec seulement un header).

### JavaScript

Bien que majoritairement illisible, la lecture du script `load.js` a permi de découvrir des paramètres intéressants:

#### Variables

- Si `slowmode = true` alors le mode lent est activé
- Si `failmode = true` alors le mode échec est activé
- Si `hasiframe = true` alors le tableau sera affiché dans une iFrame
- On peut modifier le début du tableau en manipulant la variable `start`

#### Méthodes

- `generate()` : si le mode lent est activé, alors un délai d'une durée aléatoire est ajouté avant d'appeler `doGenerate()`. Sinon, la génération commence directement.

- `doGenerate()` : génère les données et les affiche selon différents modes, en fonction des paramètres:

    - Si `hasiframe = true`, alors cette fonction va ajouter une nouvelle iframe et insérer un tableau dans la première iframe de la page.
    - Si `hasiframe = false` et qu'un tableau est déjà sur la frame princpale, ce tableau sera rechargé en prenant en compte le nouveau `start`
    - Si `hasiframe = false` et qu'il n'y a pas de tableau sur la frame princpale, un tableau sera ajouté

#### Paramètres inaccessibles

- `f5` : la limite du nombre total de transaction). 

Il y a 4999 transactions en tout (le nombre de transactions devant être strictement inférieur à f5 [*ligne 491*]). 

Le bouton Next ne permet donc pas d'atteindre toutes les transactions.

- `w5` : le nombre de transactions affichées dans un tableau. S'il avait été modifiable, il aurait été possible d'afficher plus d'éléments et potentiellement de gagner du temps.

## Scraping

La classe `PageScraper` gère le scraping et retourne un Array de transactions une fois le scraping terminé.

Dans cette section, nous expliquerons le fonctionnement de cette classe.

### Gestion des "embûches"

Des alertes sont affichées aléatoirement au lancement. Il faut commencer par les cacher.

Une fois l'alerte cachée, deux options sont possibles:

- Détecter le mode actuel et faire en fonction (traiter chaque mode séparément)
- Ignorer le mode et normaliser la page (toujours afficher un tableau sur la frame principale)

Puisque la clarté du script est un critère déterminant, la seconde option semble plus pertinente. En effet, elle permet d'écrire une seule fonction de traitement du tableau et d'éviter des `if` en cascade.

Pour normaliser la page il faut, dans le moteur JavaScript:

- Désactiver les modes lent (`slowmode`) et échec (`failmode`)
- Désactiver les iframe (`hasiframe`), pour que les données soient toujours affichées dans un tableau
- Regénérer un tableau (`doGenerate()`)

Si on est en mode normal, `doGenerate()` ne fera rien. En revanche, si on était en mode lent ou échec, cette méthode affichera directement un tableau sur la page, ce qui permettra de traiter rapidement les données et d'éliminer les problèmes.

### Traitement des données

Une fois un tableau affiché sur la page principale, on peut en extraire les données.

Une nouvelle fois, deux options semblent pouvoir être choisies:

- Utiliser Selenium pour récupérer les données depuis le DOM
- Exécuter un script dans le moteur JavaScript de Chrome avec les API DOM standard

La deuxième option s'est révélée être environ 150 (!) fois plus rapide. En effet, l'API de Selenium utilise des promesses et ne permet pas de regrouper les opérations, ce qui est possible avec l'API DOM de Chrome.

De plus, Selenium permet d'écécuter un script dans Chrome et de récupérer la valeur de retour, ce qui nous permet d'obtenir facilement le résultat du traitement fait depuis Chrome.

Dans la méthode `parseTransactionData`, on extrait les données du tableau et ajoute la transaction à l'Array JSON.

### Pagination

Pour la pagination, plusieurs solutions étaient également envisageables:

- Changer le paramètre `start` dans l'URL et recharger la page
- Utiliser JavaScript pour recharger les données sans requête réseau

Pour des raisons évidentes de rapidité, la solution 2 s'impose. De plus, l'utilisation de la fonction `doGenerate()` lors de la normalisation permet de recharger rapidement le tableau et de réduire au maximum la latence entre le traitement de chaque page.

### Conclusion

Le scraping s'articule donc de la manière suivante:

~~~
Tant que toutes les pages n'ont pas été traitées

    - changer le numéro de page (variable `start`)
    - normaliser la page et recharger les données
    - extraire les données
    - ajouter les données au résultat global
~~~

## Fonctionnement

1. Un objet `PageLoader` configure Google Chrome et charge la page d'accueil dans un Driver

2. On créé un objet `ScriptEvaluator` pour calculer la durée du scraping après le chargement de la page web

3. Avec le driver retourné par le `PageLoader`, on créé un `PageScraper`, qui retournera la liste des transactions

4. La fonction `ResultsHandler.exportTransactions` convertit les transactions au format JSON et écrit le fichier sur le disque

5. On affiche un message de succès et la durée totale du scraping

## Auteur

Paquet écrit par [Alexis Aubry](https://alexaubry.fr). Mis à disposition sous les termes de la licence MIT.