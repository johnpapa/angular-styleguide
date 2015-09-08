# Charte stylistique Angular

*Guide de style subjectif pour Angular par [@john_papa](//twitter.com/john_papa)*

Si vous cherchez un guide de style pour la syntaxe, les conventions, et la structuration d'applications Angular, alors vous êtes au bon endroit. Ces styles sont basés sur mon expérience de développement avec [Angular](//angularjs.org), mes présentations, [mes cours sur Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) et mon travail au sein de diverses équipes.

Le but de ce guide de style est de proposer des conseils sur le développement d'applications Angular en exposant les conventions que j'utilise et plus important encore, pourquoi je les ai choisies.

>Si vous appréciez ce guide, visitez mon cours [Angular Patterns: Clean Code](http://jpapa.me/ngclean) sur Pluralsight qui va de pair avec ce guide.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Remerciements individuels et à la communauté
Ne jamais travailler en vase clos. J'ai trouvé que la communauté Angular est une incroyable communauté dont les membres ont à cœur de partager leurs expériences. Ainsi, avec mon ami et expert d'Angular, Todd Motto, nous avons collaboré sur de nombreux styles et conventions. Nous sommes d'accord sur la plupart, et nous divergeons sur d'autres. Je vous encourage à visiter [le guide de style de Todd](https://github.com/toddmotto/angularjs-styleguide) pour vous faire votre propre avis sur son approche et en quoi elle diverge.

Beaucoup de mes styles proviennent des nombreuses séances de pair programming avec [Ward Bell](http://twitter.com/wardbell). Mon ami Ward a assurément contribué à influencer l'évolution ultime de ce guide.

## Visualiser les styles dans une application d'exemple
Bien que ce guide explique le *quoi*, le *pourquoi* et le *comment*, il m'est utile de pouvoir les visualiser dans la pratique. Ce guide est accompagné par une application d'exemple qui suit ces styles et ces modèles. Vous pouvez trouver l'[application d'exemple (intitulée modular) ici](https://github.com/johnpapa/ng-demos) dans le répertoire `modular`. Vous pouvez librement le récupérer, le cloner, ou le *forker*. [Les instructions pour l’exécuter sont contenues dans ce readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

## Traductions
[Les traductions de ce guide stylistique pour Angular](https://github.com/johnpapa/angular-styleguide/tree/master/i18n) sont maintenues par la communauté et peuvent être trouvées ici.

## Table des matières

  1. [Responsabilité Unique](#responsabilité-unique)
  1. [IIFE](#iife)
  1. [Modules](#modules)
  1. [Contrôleurs](#controleurs)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Services de données](#services-de-données)
  1. [Directives](#directives)
  1. [Résolution de promesses pour un contrôleur](#résolution-de-promesses-pour-un-contrôleur)
  1. [Annoter manuellement les dépendances à injecter](#annoter-manuellement-les-dépendances-à-injecter)
  1. [Minification et annotation](#minification-et-annotation)
  1. [Gestion des exceptions](#gestion-des-exceptions)
  1. [Nommage](#nommage)
  1. [Architecture L.I.F.T.](#architecture-lift)
  1. [Architecture de l'application](#architecture-de-lapplication)
  1. [Modularité](#modularité)
  1. [Logique d'initialisation](#logique-d-initialisation)
  1. [Services $ d'Angular](#services-dollar-d-angular)
  1. [Tests](#tests)
  1. [Animations](#animations)
  1. [Commentaires](#commentaires)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Constantes](#constantes)
  1. [Templates et snippets](#templates-et-snippets)
  1. [Générateur Yeoman](#générateur-yeoman)
  1. [Routage](#routage)
  1. [Automatisation des tâches](#automatisation-des-taches)
  1. [Filtres](#filtres)
  1. [Documentation Angular](#documentation-angular)
  1. [Contribuer](#contribuer)
  1. [Licence](#license)

## Responsabilité unique

### Règle d'unicité
###### [Style [Y001](#style-y001)]

  - Définissez un composant par fichier.

  L'exemple suivant définit le module `app` et ses dépendances, définit un contrôleur, et définit une factory le tout dans le même fichier.

  ```javascript
  /* à éviter */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  Les même composants sont maintenant séparés dans leurs propres fichiers.

  ```javascript
  /* recommandé */

  // app.module.js
  angular
     .module('app', ['ngRoute']);
  ```

  ```javascript
  /* recommandé */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommandé */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Retour en haut de page](#table-des-matières)**

## IIFE
### Les fermetures (*closures*) JavaScript
###### [Style [Y010](#style-y010)]

  - Encapsulez les composants Angular dans une *Immediately Invoked Function Expression* (IIFE) ou Expression de Fonction Immédiatement Invoquée.

  *Pourquoi ?* : Une IIFE supprime les variables du scope global. Cela aide à éviter que les déclarations de variables et de fonctions ne vivent plus longtemps que prévu dans le scope global, ce qui aide aussi à éviter les collisions de variables.

  *Pourquoi ?* : Lorsque votre code est minifié et embarqué dans un unique fichier pour le déploiement dans un serveur de production, vous pouvez avoir des collisions de variables et de nombreuses variables globales. Une IIFE vous protège contre ces dernières en fournissant un scope différent pour chaque fichier.

  ```javascript
  /* à éviter */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // la fonction logger est ajoutée en tant que variable globale
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // la fonction storage est ajoutée en tant que variable globale
  function storage() { }
  ```

  ```javascript
  /**
   * recommandé
   *
   * plus aucune variable globale ne reste après.
   */

  // logger.js
  (function() {
      'use strict';

      angular
          .module('app')
          .factory('logger', logger);

      function logger() { }
  })();

  // storage.js
  (function() {
      'use strict';

      angular
          .module('app')
          .factory('storage', storage);

      function storage() { }
  })();
  ```

  - Note : Pour des raisons de concision seulement, le reste des exemples de ce guide ne seront pas écrits avec la syntaxe IIFE.

  - Note : Les IIFE empêchent le code de test d'atteindre des membres privés, comme les expressions régulières ou les fonctions utilitaires (*helpers*), qu'il est souvent meilleur de tester indépendamment. Cependant, vous pouvez les tester à travers les membres accessibles ou en les exposant à travers leur propre composant. Par exemple en les plaçant dans leur propre factory ou constante.

**[Retour en haut de page](#table-des-matières)**

## Modules

### Éviter les collisions de nommage
###### [Style [Y020](#style-y020)]

  - Utilisez des conventions de nommages uniques avec des séparateurs pour les sous-modules.

  *Pourquoi ?* : Les noms uniques aident à éviter les collisions de nom de module. Les séparateurs aident à définir les modules et la hiérarchie de leurs sous-modules. Par exemple, `app` pourrait être le module principal (*root*) tandis que `app.dashboard` et `app.users` seraient des sous-modules utilisés en tant que dépendances de `app`.

### Mutateurs (*Setters*)
###### [Style [Y021](#style-y021)]

  - Déclarez les modules sans variables en utilisant la syntaxe *setter*.

  *Pourquoi ?* : Avec un composant par fichier, on ne devrait pas avoir besoin d'introduire une variable pour le module.

  ```javascript
  /* à éviter */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Utilisez à la place la syntaxe *setter*.

  ```javascript
  /* recommandé */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Accesseurs (*Getters*)
###### [Style [Y022](#style-y022)]

  - Lorsque vous utilisez un module, évitez d'utiliser une variable en utilisant plutôt le chaînage avec la syntaxe *getter*.

  *Pourquoi ?* : Le code est plus lisible et évite les collisions de variables ou les fuites.

  ```javascript
  /* à éviter */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommandé */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting ou Getting
###### [Style [Y023](#style-y023)]

  - N'utilisez le *setter* qu'une fois et le *getter* pour toutes les autres instances.

  *Pourquoi ?* : Un module ne devrait être créé qu'une seule fois, et ensuite récupéré à partir de ce point.

  ```javascript
  /* recommended */

  // pour setter un module
  angular.module('app', []);

  // pour getter un module
  angular.module('app');
  ```

### Fonctions nommées ou anonymes
###### [Style [Y024](#style-y024)]

  - Utilisez des fonctions nommées au lieu de passer des fonction anonymes dans les *callbacks*.

  *Pourquoi ?* : Le code plus lisible, est plus facile à déboguer, et réduit l'imbrication des *callbacks*.

  ```javascript
  /* à éviter */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recommandé */

  // dashboard.js
  angular
      .module('app')
      .controller('Dashboard', Dashboard);

  function Dashboard() { }
  ```

  ```javascript
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  function logger() { }
  ```

**[Retour en haut de page](#table-des-matières)**

## Contrôleurs

### Syntaxe de la vue avec `controllerAs`
###### [Style [Y030](#style-y030)]

  - Utilisez la syntaxe avec [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) au lieu de la syntaxe classique avec `$scope`.

  *Pourquoi ?* : Les contrôleurs sont construits, recréés, et fournissent une unique nouvelle instance. La syntaxe utilisant `controllerAs` est plus proche de celle d'un constructeur Javascript que la syntaxe classique avec `$scope`.

  *Pourquoi ?* : Elle encourage l'usage du *binding* entre un objet (avec la notation pointée) et la vue (ex. `customer.name` au lieu de `name`). Elle est plus contextuelle, plus facile à lire, et évite tout problème de référence qui peut arriver sans la notation « point ».

  *Pourquoi ?* : Elle permet d'éviter l'usage des appels à `$parent` dans les vues avec des contrôleurs imbriqués.

  ```html
  <!-- à éviter -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recommandé -->
  <div ng-controller="Customer as customer">
     {{ customer.name }}
  </div>
  ```

### Syntaxe du contrôleur avec `controllerAs`
###### [Style [Y031](#style-y031)]

  - Utilisez la syntaxe avec `controllerAs` au lieu de la syntaxe de classique avec `$scope`.

  - La syntaxe avec `controllerAs` utilise `this` à l'intérieur des contrôleurs qui se fait *binder* à `$scope` implicitement.

  *Pourquoi ?* : `controllerAs` est une simplification (sucre) syntaxique de `$scope`. Vous pouvez toujours vous *binder* dans la vue et accéder aux méthodes de `$scope`.

  *Pourquoi ?* : Permet d'éviter la tentation d'utiliser les méthodes de `$scope` à l'intérieur d'un contrôleur. Il est par ailleurs, meilleure pratique de les éviter dans les contrôleurs mais plutôt de les déplacer dans une factory. Considérez utiliser `$scope` dans un contrôleur seulement si nécessaire. Par exemple lorsqu'il faut publier ou souscrire à des événements en utilisant [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), ou [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considérez déplacer ces usages dans une factory et les invoquer depuis le contrôleur.

  ```javascript
  /* à éviter */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recommandé - mais voir la section suivante */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### `controllerAs` avec `vm`
###### [Style [Y032](#style-y032)]

  - Utilisez une variable de capture pour `this` quand vous utilisez la syntaxe avec `controllerAs`. Choisissez un nom de variable consistent tel que `vm` (pour « ViewModel »).

  *Pourquoi ?* : `this` est contextuel et son utilisation au sein d'une fonction à l'intérieur d'un contrôleur pourrait faire changer son contexte. Capturer le contexte de `this` évite de rencontrer ce problème.

  ```javascript
  /* à éviter */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recommandé */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Note : Vous pouvez évitez n'importe quel avertissement [jshint](http://www.jshint.com/) en plaçant le commentaire suivant au dessus de la ligne de code. Cependant, il n'est pas nécessaire lorsque la fonction est nommée en utilisant la CasseEnMajuscule, puisque cette convention signifie que c'est la fonction est un constructeur. C'est précisément la nature d'un contrôleur dans Angular.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Note : Lors de la création de *watchers* dans un contrôleur en utilisant `controlleAs`, vous pouvez *watcher* les différents `vm.*` en utilisant la syntaxe suivante. (Créez des *watchers* avec prudence puisqu'ils ajoutent plus de charge au cycle de *digest*.)

  ```html
  <input ng-model="vm.title"/>
  ```

  ```javascript
  function SomeController($scope, $log) {
      var vm = this;
      vm.title = 'Some Title';

      $scope.$watch('vm.title', function(current, original) {
          $log.info('vm.title was %s', original);
          $log.info('vm.title is now %s', current);
      });
  }
  ```

### Placement des membres *bindables* au début
###### [Style [Y033](#style-y033)]

  - Placez les membres *bindables* au début du contrôleur, par ordre alphabétique, et non pas dispersés à travers le code du contrôleur.

  *Pourquoi ?* : Placer les membres *bindables* au début permet de faciliter la lecture et vous aide à identifier instantanément quels membres du contrôleur peuvent-être *bindés* et utilisés dans la vue.

  *Pourquoi ?* : Définir des fonctions anonymes *in-line* peut être facile, mais lorsque ces fonctions font plus d'une ligne de code elles peuvent réduire la lisibilité. Définir les fonctions sous les membres *bindables* (les fonctions seront *hoistées*) déplace les détails d'implémentation en bas, gardant les membres *bindables* en haut,

  ```javascript
  /* avoid */
  function Sessions() {
      var vm = this;

      vm.gotoSession = function() {
        /* ... */
      };
      vm.refresh = function() {
        /* ... */
      };
      vm.search = function() {
        /* ... */
      };
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recommended */
  function Sessions() {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = refresh;
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';

      ////////////

      function gotoSession() {
        /* */
      }

      function refresh() {
        /* */
      }

      function search() {
        /* */
      }
  ```

    ![Contrôleur utilisant la syntaxe avec les membres bindables au dessus](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-1.png)

  Note : Si la fonction est un *oneliner* vous pouvez la garder en haut du contrôleur, tant que la lisibilité n'est pas affectée.

  ```javascript
  /* à éviter */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * Nombreuses lignes
           * de
           * code
           * affectant
           * la lisibilité
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recommandé */
  function Sessions(sessionDataService) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = sessionDataService.refresh; // *oneliner* acceptable
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Déclaration des fonctions pour cacher les détails d'implémentation
###### [Style [Y034](#style-y034)]

  - Utilisez les déclarations de fonctions pour cacher les détails d'implémentation. Gardez vos membres *bindables* en haut. Quand vous avez besoin de *binder* une fonction dans un contrôleur, faites-la pointer vers la déclaration de la fonction plus bas dans le fichier. Ceci est directement lié à la section du placement des membres *bindables* au début. Pour plus de détails, vous pouvez lire [cet article](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Pourquoi ?* : Placer les membres *bindables* en haut facilite la lecture et vous aide instantanément à identifier quels membres du contrôleur peuvent être *bindés* et utilisés dans la vue.

    *Pourquoi ?* : Placer les détails d'implémentation d'une fonction plus bas dans le fichier permet de masquer la complexité. Ainsi vous ne pouvez voir que les choses importantes en haut.

    *Pourquoi ?* : Les déclarations de fonctions sont *hoistées* donc il n'y a pas problème à utiliser une fonction avant qu'elle ne soit définie (alors que ça serait le cas avec les expressions de fonction).

    *Pourquoi ?* : Vous ne vous préoccuperez plus des déclarations de fonctions déplaçant `var a` avant `var b` cassant ainsi votre code car `a` dépendait de `b`.

    *Pourquoi ?* : L'ordre est critique avec les expressions de fonctions.

  ```javascript
  /**
   * Evitez
   * l'utilisation des expressions de fonctions.
   */
  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      var activate = function() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      var getAvengers = function() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }

      vm.getAvengers = getAvengers;

      activate();
  }
  ```

  Remarquez que dans l'exemple précédent les choses importantes sont dispersées. Dans l'exemple ci-dessous, vous noterez que le contenu important est en haut. Par exemple, les membres *bindables* au contrôleur tels que `vm.avengers` ou `vm.title`. Les détails d'implémentation sont plus bas. C'est simplement plus facile à lire.

  ```javascript
  /*
   * recommandé
   * Utilisation des déclarations de fonction
   * et les membres bindables au début.
   */
  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.getAvengers = getAvengers;
      vm.title = 'Avengers';

      activate();

      function activate() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      function getAvengers() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```

### Déplacez la logique métier dans les services
###### [Style [Y035](#style-y035)]

  - Déplacer la logique d'un contrôleur en la déléguant à des services ou *factories*.

    *Pourquoi ?* : La logique peut être ré-utilisée par plusieurs contrôleurs lorsqu'elle est placée au sein d'un service et exposée via une fonction.

    *Pourquoi ?* : La logique dans un service peut être facilement isolée pour les tests unitaires, tandis que la logique d'appel dans un contrôleur peut facilement être *mockée*.

    *Pourquoi ?* : Cela supprime des dépendances et cache les détails d'implémentation au contrôleur.

    *Pourquoi ?* : Permet de garder le contrôleur le plus minimal et focalisé possible.

  ```javascript

  /* à éviter */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
          var settings = {};
          // Obtenir l'URL de base du service crédit à partir de la config
          // Positionne les headers requis pour le service crédit
          // Prépare l'URL query string ou l'objet de données avec les données de requête.
          // Ajoute les infos d'identification de l'utilisateur afin que le service obtienne les bons droits de limite credit pour cet utilisateur.
          // Utilise JSONP pour ce navigateur s'il ne supporte pas les CORS
          return $http.get(settings)
              .then(function(data) {
                // Décompresse les données JSON dans l'objet de réponse
                  // afin de rechercher maxRemainingAmount
                vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Interpréter l'erreur
                 // Gérer le timeout ? Réessayer ? Essayer un service alternatif ?
                 // Re-rejeter avec une erreur appropriée de l'utilisateur final
              });
      };
  }
  ```

  ```javascript
  /* recommandé */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
         return creditService.isOrderTotalOk(vm.total)
            .then(function(isOk) { vm.isCreditOk = isOk; })
            .catch(showServiceError);
      };
  }
  ```

### Gardez les contrôleurs focalisés
###### [Style [Y037](#style-y037)]

  - Définissez un contrôleur pour une vue, et n'essayez pas de ré-utiliser le contrôleur pour d'autres vues. Au lieu de cela, déplacez la logique réutilisable vers les *factories* et gardez le contrôleur simple et focalisé sur sa vue.

    *Pourquoi ?*: La réutilisation des contrôleurs sur plusieurs vues est fragilisante pour l'application et une bonne couverture de tests *end-to-end* (*e2e*) est requise afin d'assurer la stabilité sur l'ensemble d'une grosse application.

### Assignation des contrôleurs
###### [Style [Y038](#style-y038)]

  - Lorsqu'un contrôleur doit être associé à une vue et qu'un composant pourraient être ré-utilisés par d'autres contrôleurs ou vues, définissez les contrôleurs avec leurs routes.

    Note : Si une vue est chargée via d'autres moyens qu'une route, alors utilisez la syntaxe avec `ng-controller="Avengers as vm"`.

    *Pourquoi ?* : Associer le contrôleur dans la route permet à différentes routes d'invoquer d'autres paires contrôleur-vue. Lorsque les contrôleurs sont assignés dans la vue avec [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), cette vue est toujours associée avec le même contrôleur.

 ```javascript
  /* à éviter - lorsque l'utilisation avec une route et une association dynamique est voulue */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
            templateUrl: 'avengers.html'
          });
  }
  ```

  ```html
  <!-- avengers.html -->
  <div ng-controller="Avengers as vm">
  </div>
  ```

  ```javascript
  /* recommandé */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              controllerAs: 'vm'
          });
  }
  ```

  ```html
  <!-- avengers.html -->
  <div>
  </div>
  ```

**[Retour en haut de page](#table-des-matières)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - Les services sont instanciés avec le mot clé `new`, utilisez `this` pour les méthodes publiques et les variables. Puisque ces derniers sont tellement similaires aux *factories*, utilisez à la place une *factory* pour la cohérence.

    Note : [Tous les services Angular sont des singletons](https://docs.angularjs.org/guide/services). Cela signifie qu'il n'y a qu'une seule instance d'un service donné par injecteur.

  ```javascript
  // service
  angular
      .module('app')
      .service('logger', logger);

  function logger() {
    this.logError = function(msg) {
      /* */
    };
  }
  ```

  ```javascript
  // factory
  angular
      .module('app')
      .factory('logger', logger);

  function logger() {
      return {
          logError: function(msg) {
            /* */
          }
     };
  }
  ```

**[Retour en haut de page](#table-des-matières)**

## Factories

### Responsabilité unique
###### [Style [Y050](#style-y050)]

  - Les *factories* ne devraient avoir qu'une [seule et unique responsabilité](http://en.wikipedia.org/wiki/Single_responsibility_principle), qui serait encapsulée par son contexte. Une fois qu'une *factory* commence à dépasser cet unique cadre, une nouvelle *factory* devrait être créée.

### Singletons
###### [Style [Y051](#style-y051)]

  - Les *factories* sont des singletons et retournent un objet qui contient les membres du service.

    Note : [Tous les services Angular sont des singletons](https://docs.angularjs.org/guide/services).

### Membres accessibles au début
###### [Style [Y052](#style-y052)]

  - Placez les membres appelables du services (son interface) en haut, utilisant une technique dérivée du [*Revealing Module Pattern*](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *Pourquoi ?* : Placer les membres appelables au début facilite la lecture et vous aide à identifier instantanément quels membres du service peuvent être appelés et doivent être testés unitairement (et/ou *mockés*).

    *Pourquoi ?* : C'est particulièrement efficace lorsque le fichier devient long et permet d'éviter de faire défiler tout le code pour voir ce qui est exposé.

    *Pourquoi ?* : Placer les fonctions au fil de l'écriture semble facile, mais quand elles font plus d'une ligne, elles peuvent vite réduire la lisibilité et causer plus de défilement. Définir l'interface à appeler via le service retourné déplace les détails d'implémentation plus bas, garde l'interface d'appel en haut, et rend le tout plus facile à lire.

  ```javascript
  /* à éviter */
  function dataService() {
    var someValue = '';
    function save() {
      /* */
    };
    function validate() {
      /* */
    };

    return {
        save: save,
        someValue: someValue,
        validate: validate
    };
  }
  ```

  ```javascript
  /* recommandé */
  function dataService() {
      var someValue = '';
      var service = {
          save: save,
          someValue: someValue,
          validate: validate
      };
      return service;

      ////////////

      function save() {
          /* */
      };

      function validate() {
          /* */
      };
  }
  ```

  De cette façon, les *bindings* sont répliqués à travers l'objet de capture, les valeurs primitives ne peuvent pas se mettre à jour toutes seules grâce au *revealing module pattern*.

    ![Factories utilisant la syntaxe avec les membres bindables au dessus](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-2.png)

### Déclaration des fonctions pour cacher les détails d'implémentation
###### [Style [Y053](#style-y053)]

  - Utilisez les déclarations de fonctions pour cacher les détails d'implémentation. Gardez les membres accessibles de la *factory* en haut. Faites-les pointer vers les déclarations de fonction qui apparaissent plus loin dans le fichier. Pour plus de détails, vous pouvez lire [cet article](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Pourquoi ?* : Placer les membres accessibles en haut facilite la lecture et vous aide instantanément à identifier quels membres de la *factory* peuvent être appelés depuis l'extérieur.

    *Pourquoi ?* : Placer les détails d'implémentation d'une fonction plus bas dans le fichier permet de masquer la complexité. Ainsi vous ne pouvez voir que les choses importantes en haut.

    *Pourquoi ?* : Les déclarations de fonctions sont *hoistées* donc il n'y a pas problème à utiliser une fonction avant qu'elle ne soit définie (alors que ça serait le cas avec les expressions de fonction).

    *Pourquoi ?* : Vous ne vous préoccuperez plus des déclarations de fonctions déplaçant `var a` avant `var b` cassant ainsi votre code car `a` dépendait de `b`.

    *Pourquoi ?* : L'ordre est critique avec les expressions de fonctions.

  ```javascript
  /**
   * À éviter
   * Utilisation des expressions de fonctions
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
          // détails d'implémentation
      };

      var getAvengerCount = function() {
          // détails d'implémentation
      };

      var getAvengersCast = function() {
          // détails d'implémentation
      };

      var prime = function() {
          // détails d'implémentation
      };

      var ready = function(nextPromises) {
          // détails d'implémentation
      };

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;
  }
  ```

  ```javascript
  /**
   * recommandé
   * Utilisation des déclarations de fonctions
   * et des membres accessibles au début.
   */
  function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;

      ////////////

      function getAvengers() {
          // détails d'implémentation
      }

      function getAvengerCount() {
          // détails d'implémentation
      }

      function getAvengersCast() {
          // détails d'implémentation
      }

      function prime() {
          // détails d'implémentation
      }

      function ready(nextPromises) {
          // avec les détails d'implémentation ici
      }
  }
  ```

**[Retour en haut de page](#table-des-matières)**

## Services de données

### Séparer les appels aux données
###### [Style [Y060](#style-y060)]

  - *Refactorez* la logique pour faire les opérations et interactions avec les données dans une *factory*. Rendez les services de données responsables des appels *XHR*, du *local storage*, du stockage en mémoire, ou de toute autre opération sur les données.

    *Pourquoi ?* : Les responsabilités du contrôleur sont la présentation et l'assemblage des informations pour la vue. Il ne devrait pas avoir à se soucier de la façon dont les données sont récupérées mais seulement de la façon de les demander. Séparer les services de données transforme la logique du contrôleur en logique de « À quel service vais-je demander ces données ? ». Le contrôleur est alors plus simple est plus focalisé sur sa vue.

    *Pourquoi ?* : Cela rend plus facile à tester (*mocké* ou en utilisant le vrai) les appels aux données lorsque l'on teste un contrôleur qui utilise un service de données.

    *Pourquoi ?* : L'implémentation d'un service de données peut contenir du code très spécifique pour gérer le système de données. Cela peut inclure des entêtes, la façon de dialoguer avec les données, ou d'autres services tels que `$http`. Séparer la logique vers un service de données permet d'encapsuler cette logique dans un unique endroit en cachant les détails d'implémentation des consommateurs externes (tel qu'un contrôleur), en rendant également plus simple les changements d'implémentation.

  ```javascript
  /* Recommandé */

  // Factory jouant le rôle de service de données
  angular
      .module('app.core')
      .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', 'logger'];

  function dataservice($http, logger) {
      return {
          getAvengers: getAvengers
      };

      function getAvengers() {
          return $http.get('/api/maa')
              .then(getAvengersComplete)
              .catch(getAvengersFailed);

          function getAvengersComplete(response) {
              return response.data.results;
          }

          function getAvengersFailed(error) {
              logger.error('XHR Failed for getAvengers.' + error.data);
          }
      }
  }
  ```

    Note : Le service de données est appelé par des consommateurs extérieur, tels que des contrôleurs, en leur cachant l'implémentation, comme ci-dessous.

  ```javascript
  /* Recommandé */

  // Contrôleur appelant la factory faisant le service de données
  angular
      .module('app.avengers')
      .controller('Avengers', Avengers);

  Avengers.$inject = ['dataservice', 'logger'];

  function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];

      activate();

      function activate() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      function getAvengers() {
          return dataservice.getAvengers()
              .then(function(data) {
                  vm.avengers = data;
                  return vm.avengers;
              });
      }
  }
  ```

### Retourner une promesse suite à un appel de données
###### [Style [Y061](#style-y061)]

  - Quand vous appelez un service de données tel que `$http` qui retourne une *promise*, retournez également une *promise* dans votre fonction appelante.

    *Pourquoi ?* : Vous pouvez chaîner les promesses entre elles et entreprendre d'autres actions après que l'appel soit terminé, puis résoudre ou rejeter la promesse.

  ```javascript
  /* recommandé */

  activate();

  function activate() {
      /**
       * Etape 1
       * Appelle la fonction getAvengers pour récupérer
       * les données «avenger» et attend la promise.
       */
      return getAvengers().then(function() {
          /**
           * Etape 4
           * Exécute une action à la résolution de la promise finale.
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Etape 2
         * Appel du service de données pour récupérer les données
         * et attend la promesse.
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Etape 3
                 * Définit les données et résout la promesse.
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[Retour en haut de page](#table-des-matières)**

## Directives
### Une directive par fichier
###### [Style [Y070](#style-y070)]

  - Créez seulement une directive par fichier. Nommer le fichier en fonction de la directive.

    *Pourquoi ?* : Il est facile de placer toutes les directives dans un fichier, mais il l'est moins de les séparer après coup. Certaines sont partagées dans toute l'application, certaines par modules, et certaines juste par un seul module.

    *Pourquoi ?* : Une directive par fichier leur permet d'être plus facilement maintenables.

    > Note : "**Bonne pratique** : Les directives devraient pouvoir s'auto-nettoyer. Vous pouvez utiliser `element.on('$destroy', ...)` ou bien `scope.$on('$destroy', ...)` pour lancer une fonction de nettoyage quand une directive est enlevée" ... - Documentation d'Angular

  ```javascript
  /* à éviter */
  /* directives.js */

  angular
      .module('app.widgets')

      /* directive spécifique pour le module order */
      .directive('orderCalendarRange', orderCalendarRange)

      /* directive pouvant être utilisée n'importe où dans l'application sales */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* directive pouvant être utilisée n'importe où dans l'application */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* détails d'implémentation */
  }

  function salesCustomerInfo() {
      /* détails d'implémentation */
  }

  function sharedSpinner() {
      /* détails d'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* calendarRange.directive.js */

  /**
   * @desc directive spécifique pour le module order de l'entreprise Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* détails d'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* customerInfo.directive.js */

  /**
   * @desc directive pouvant être utilisée n'importe où dans l'application sales de l'entreprise Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* détails d'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* spinner.directive.js */

  /**
   * @desc directive pouvant être utilisée n'importe où dans l'application de l'entreprise Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* détails d'implémentation */
  }
  ```

    Note : Il y a plusieurs options de nommage pour les directives puisqu'elles peuvent être utilisées à des échelles (*scopes*) plus ou moins larges. Choisissez un nom qui rend la directive et son fichier clairs et distincts. Des exemples sont définis plus bas mais regardez la section [nommage](#nommage) pour plus de recommandations.

### Manipuler le DOM dans une directive
###### [Style [Y072](#style-y072)]

  - Quand vous manipulez le DOM directement, utilisez une directive. S'il existe des alternatives, comme par exemple le CSS pour définir les styles ou les [services d'animation](https://docs.angularjs.org/api/ngAnimate), les *templates* Angular , [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) ou [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), utilisez les à la place. Par exemple si la directive affiche ou cache un élément, utilisez ngHide ou ngShow.

    *Pourquoi ?* : La manipulation du DOM peut être difficile à tester, déboguer, et il y a souvent une meilleure façon de faire (ex : CSS, animations, *templates*).

### Utiliser un unique préfixe de directive
###### [Style [Y073](#style-y073)]

  - Définissez un unique préfixe de directive court et descriptif comme dans `acmeSalesCustomerInfo` et utilisé dans le HTML de la façon suivante : `acme-sales-customer-info`.

    *Pourquoi ?* : Un préfixe court et unique identifie le contexte et l'origine de la directive. Par exemple, un préfixe comme `cc-` peut indiquer que la directive fait partie de l'application CodeCamper tandis que `acme-` peut indiquer une directive de l'entreprise Acme.

    Note : Évitez d'utiliser le préfixe `ng-` car il est réservé pour les directives Angular. Cherchez les directives populaire pour éviter les conflits de nommage, tel que `ion-` pour les directives du framework [Ionic](http://ionicframework.com/).

### Restreindre aux éléments et aux attributs
###### [Style [Y074](#style-y074)]

  - Lors de la création d'une directive qui fait du sens comme élément indépendant, autorisez la restriction `E` (élément personnalisé) et éventuellement la restriction `A` (attribut personnalisé). En général, s'il devrait avoir son propre contrôle, `E` est le plus indiqué. La convention la plus utilisée est de permettre `EA` mais se dirige vers une implémentation en tant qu'élément lorsque la directive est indépendante et en tant qu'attribut lorsqu'elle augmente son propre élément de DOM.

    *Pourquoi ?* : Cela a du sens.

    *Pourquoi ?* : Même s'il est autorisé d'utiliser une directive en tant que classe, si la directive agit vraiment comme un élément, elle fait plus de sens en tant qu'élément ou au moins en tant qu'attribut.

    Note : EA est la valeur par défaut dans Angular 1.3 +

  ```html
  <!-- à éviter -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* à éviter */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange() {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'C'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```

  ```html
  <!-- recommandé -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* recommandé */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange() {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'EA'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```

### Directives et `controllerAs`
###### [Style [Y075](#style-y075)]

  - Utilisez la syntaxe avec `controllerAs` avec une directive pour être cohérent avec l'utilisation de `controllerAs` pour l'association de la vue et de son contrôleur.

    *Pourquoi ?* : Ça fait sens et ce n'est pas difficile.

    Note : La directive ci-dessous montre une façon parmi d'autres d'utiliser *scope* à l'intérieur de la fonction `link` et dans un contrôleur de directive, par l'utilisation de `controllerAs`. J'ai *inliné* le template pour tout mettre au même endroit.

    Note : Concernant l'injection de dépendances, voir [Annoter manuellement les dépendances à injecter](#annoter-manuellement-les-dépendances-à-injecter).

    Note : Remarquez que le contrôleur de la directive est à l'extérieur de la *closure* de la directive. Cette façon de faire évite le problème d'indisponibilité des injections après le `return`.

  ```html
  <div my-example max="77"></div>
  ```

  ```javascript
  angular
      .module('app')
      .directive('myExample', myExample);

  function myExample() {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          link: linkFunc,
          controller : ExampleController,
            controllerAs: 'vm',
            bindToController: true // parce que le scope est isolé
      };

      return directive;

      function linkFunc(scope, el, attr, ctrl) {
          console.log('LINK: scope.min = %s *** should be undefined', scope.min);
          console.log('LINK: scope.max = %s *** should be undefined', scope.max);
          console.log('LINK: scope.vm.min = %s', scope.vm.min);
          console.log('LINK: scope.vm.max = %s', scope.vm.max);
      }
  }

  ExampleController.$inject = ['$scope'];

  function ExampleController($scope) {
      // Injection de $scope seulement pour la comparaison
      var vm = this;

      vm.min = 3;

      console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
      console.log('CTRL: $scope.vm.max = %s', $scope.vm.max);
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
  }
  ```

  ```html
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

  Note : Vous pouvez aussi nommer le contrôleur au moment où vous l'injectez dans la fonction de `link` et accéder aux attributs de la directive en temps que propriétés du contrôleur.

  ```javascript
  // Alternative to above example
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```

###### [Style [Y076](#style-y076)]

  - Utilisez `bindToController = true` lorsque vous utilisez la syntaxe avec `controllerAs` avec une directive quand vous voulez *binder* le *scope* externe au *scope* du contrôleur de la directive.

    *Pourquoi ?* : Cela rend plus facile de *binder* le *scope* externe au *scope* du contrôleur de la directive.

    Note : `bindToController` a été introduit à partir de Angular 1.3.0.

  ```html
  <div my-example max="77"></div>
  ```

  ```javascript
  angular
      .module('app')
      .directive('myExample', myExample);

  function myExample() {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          controller: ExampleController,
          controllerAs: 'vm',
          bindToController: true
      };

      return directive;
  }

  function ExampleController() {
      var vm = this;
      vm.min = 3;
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
  }
  ```

  ```html
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[Retour en haut de page](#table-des-matières)**

## Résolution des *promises* pour un contrôleur
### *Promises* d'activation du contrôleur
###### [Style [Y080](#style-y080)]

  - Résolvez la logique d'initialisation d'un contrôleur dans une fonction `activate`.

    *Pourquoi ?* : Placer la logique d'initialisation toujours au même endroit permet de la rendre plus facile à localiser, plus cohérente à tester, et permet d'éviter sa dispersion à travers le contrôleur.

    *Pourquoi ?* : La fonction `activate` du contrôleur rend pratique la ré-utilisation de la logique pour un rafraîchissement du contrôleur ou de la vue, garde cette logique en un seul endroit, envoie la vue à l'utilisateur plus rapidement, rend les animations faciles sur `ng-view` ou `ui-view` et rend l'interface plus réactive pour l'utilisateur.

    Note : Si vous avez besoin d'annuler de façon conditionnelle la route avant d'utiliser le contrôleur, utilisez la [résolution de route](#style-y081) à la place.

  ```javascript
  /* à éviter */
  function Avengers(dataservice) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      dataservice.getAvengers().then(function(data) {
          vm.avengers = data;
          return vm.avengers;
      });
  }
  ```

  ```javascript
  /* recommandé */
  function Avengers(dataservice) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      activate();

      ////////////

      function activate() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```

### *Promises* de résolution de route
###### [Style [Y081](#style-y081)]

  - Lorsqu'un contrôleur dépend d'une *promise* qui doit être résolue avant que le contrôleur soit activé, résolvez ces dépendances dans le `$routeProvider` avant que la logique du contrôleur soit exécutée. Si vous avez besoin d'annuler une route de façon conditionnelle avant que le contrôleur soit activé, utilisez un *resolver* de route.

  - Utilisez un *resolver* de route quand vous voulez pouvoir décider d'annuler la route avant même de commencer à naviguer vers la vue.

    *Pourquoi ?* : Un contrôleur pourrait avoir besoin de données avant de se charger. Ces données pourraient provenir d'une promesse via une *factory* ou de [`$http`](https://docs.angularjs.org/api/ng/service/$http). Utiliser une [résolution de route](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) permet à la promesse de se résoudre avant que la logique du contrôleur s’exécute, alors seulement, on peut exécuter les actions basées sur les données fournies via la *promises*.

    *Pourquoi ?* : Le code s’exécute après la route et dans la fonction `activate` du contrôleur. La vue commence à se charger tout de suite. Le *data-binding* démarre quand la *promise* d'activation se résout. Une animation de « chargement » peut être affichée pendant la transition (via `ng-view` ou `ui-view`).

    Note : Le code s’exécute avant la route via une *promise*. Le rejet de la promesse annule le routage. Sa résolution met la future vue en attente de la résolution du routage. Une animation de « chargement » peut être affichée avant la résolution et lorsque la vue change d'état. Si vous voulez aller à la vue plus vite et que vous n'avez pas besoin d'une étape pour décider si vous pouvez l'atteindre, il est conseillé d'utiliser à la place la [technique de la fonction `activate` dans le contrôleur](#style-y080).

  ```javascript
  /* à éviter */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // non-résolue
      vm.movies;
      // résolu de façon asynchrone
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }
  ```

  ```javascript
  /* mieux */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              controllerAs: 'vm',
              resolve: {
                  moviesPrepService: function(movieService) {
                      return movieService.getMovies();
                  }
              }
          });
  }

  // avengers.js
  angular
      .module('app')
      .controller('Avengers', Avengers);

  Avengers.$inject = ['moviesPrepService'];
  function Avengers(moviesPrepService) {
        var vm = this;
        vm.movies = moviesPrepService.movies;
  }
   ```

    Note : L'exemple ci-dessous montre que la résolution du routage pointe vers une fonction nommée, laquelle est plus facile à déboguer et dont l'injection de dépendance est plus facile à gérer.

  ```javascript
  /* encore mieux */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              controllerAs: 'vm',
              resolve: {
                  moviesPrepService: moviesPrepService
              }
          });
  }

  function moviePrepService(movieService) {
      return movieService.getMovies();
  }

  // avengers.js
  angular
      .module('app')
      .controller('Avengers', Avengers);

  Avengers.$inject = ['moviesPrepService'];
  function Avengers(moviesPrepService) {
        var vm = this;
        vm.movies = moviesPrepService.movies;
  }
  ```
    Note : Les dépendances sur `movieService` dans l'exemple ne sont pas directement compatibles avec le processus de minification. Pour plus de détails sur la façon de rendre ce code minifiable sans risques, voir la section sur l'[injection de dépendances](#manual-annotating-for-dependency-injection) et sur [la minification et les annotations](#minification-and-annotation).

**[Retour en haut de page](#table-des-matières)**

## Annotation manuelle pour l'injection de dépendances

### Risques pour la minification
###### [Style [Y090](#style-y090)]

  - Évitez l'utilisation de la syntaxe raccourcie pour déclaration de dépendances. Ulilisez plutôt une approche compatible avec la minification.

    *Pourquoi ?* : Les paramètres des composants (ex: contrôleur, *factory*, etc.) vont êtres convertis en variables raccourcies. Par exemple, ˋcommonˋ et ˋdataserviceˋ deviendraient ˋaˋ et ˋbˋ et ne seraient pas trouvées par Angular.

    ```javascript
    /* à éviter - non compatible avec la minification */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Ce code pourrait produire des variables raccourcies après minification et provoquer des erreurs à l’exécution.

    ```javascript
    /* à éviter - non compatible avec la minification */
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Identification manuelle des dépendances
###### [Style [Y091](#style-y091)]

  - Utilisez ˋ$injectˋ pour identifier manuellement les dépendances de vos composants Angular.

    *Pourquoi ? * : Cette technique réplique celle utilisée par [`ng-annotate`](https://github.com/olov/ng-annotate), que je recommande afin d'automatiser la création de dépendances compatible avec la minification. Si ˋng-annotateˋ détecte que l'injection a déjà été faite, cela ne la dupliquera pas.

    *Pourquoi ?* : Ça assure la compatibilité de vos dépendances à la minification. Par exemple, ˋcommonˋ et ˋdataserviceˋ pourraient devenir ˋaˋ et ˋbˋ et ne pas être trouvés par Angular.

    *Pourquoi ?* : Pour éviter de créer *inline* une longue liste de dépendances car les longs tableaux sont difficiles à lire. De même, cela peut être gênant de voir un tableau composé d'une série de *strings* alors que son dernier élément est un appel à la fonction du composant.

    ```javascript
    /* à éviter */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* à éviter */
    angular
      .module('app')
      .controller('Dashboard',
         ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recommandé */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Note : Lorsque votre fonction se situe sous un `return`, le `$inject` peut ne pas être accessible (cela pourrait arriver dans une directive). Vous pouvez vous en sortir en sortant le contrôleur de la directive.

    ```javascript
    /* À éviter */
    // à l'intérieur d'une définition de directive
    function outer() {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;

        DashboardPanelController.$inject = ['logger']; // Inatteignable
        function DashboardPanelController(logger) {
        }
    }
    ```

    ```javascript
    /* recommandé */
    // à l'exterieur d'une définition de directive
    function outer() {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
         return ddo;
    }

    DashboardPanelController.$inject = ['logger'];
    function DashboardPanelController(logger) {
    }
    ```

### Identification manuelle des dépendances du *route resolver*
###### [Style [Y092](#style-y092)]

  - Utilisez `$inject` pour identifier manuellement vos dépendances du *route resolver* pour les composants Angular.

    *Pourquoi ?* : Cette technique divise la fonction anonyme pour le *route resolver*, le rendant plus facile à lire.

    *Pourquoi ?* : Une instruction `$inject` peut facilement précéder le *resolver* à manipuler rendant n'importe quelle dépendance compatible avec la minification.

    ```javascript
    /* recommandé */
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'AvengersController',
                controllerAs: 'vm',
                resolve: {
                    moviesPrepService: moviePrepService
                }
            });
    }

    moviePrepService.$inject =  ['movieService'];
    function moviePrepService(movieService) {
        return movieService.getMovies();
    }
    ```

**[Retour en haut de page](#table-des-matières)**

## Minification et Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Utilisez [ng-annotate](//github.com/olov/ng-annotate) pour [Gulp](http://gulpjs.com) ou [Grunt](http://gruntjs.com) et commentez les fonctions qui nécessitent l'injection de dépendances automatique en utilisant `/** @ngInject */`.

    *Pourquoi ?* : Cela prévient votre code d'erreur provenant de dépendances n'utilisant pas les bonnes pratiques au regard de la minification.

    *Pourquoi ?*: [`ng-min`](https://github.com/btford/ngmin) est obsolète.

    >Je préfère Gulp car ça me paraît plus facile à écrire, lire et déboguer.

    Le code suivant n'utilise pas de dépendances compatibles avec la minification.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero(){
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }
    ```

    Lorsque le code ci-dessus sera exécuté par `ng-annotate`, il produira le résultat suivant avec l'annotation ˋ$injectˋ et deviendra alors compatible avec la minification.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero(){
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storageService', 'avengerService'];
    ```

    Note : Si ˋng-annotateˋ détecte que l'injection a déjà été faite (ex : ˋ@ngInjectˋ a été détecté), il ne dupliquera pas le code ˋ$injectˋ.

    Note : Lors de l'utilisation d'un *route resolver*, vous pouvez préfixer la fonction de résolution avec `/* @ngInject */` et cela produira le code proprement annoté, en gardant toutes les dépendances injectées compatibles avec la minification.

    ```javascript
    // En utilisant les annotations @ngInject
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'Avengers',
                controllerAs: 'vm',
                resolve: { /* @ngInject */
                    moviesPrepService: function(movieService) {
                        return movieService.getMovies();
                    }
                }
            });
    }
    ```

    > Note : A partir d'Angular 1.3, utilisez le paramètre ˋngStrictDiˋ de la directive [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) pour détecter un potentiel oubli. Avec ce paramètre, l'injecteur sera créé en mode "strict-di" qui fera échouer les invocations de fonctions de l'application qui n'utiliseraient pas explicitement les annotations de fonctions (et qui rendraient l'application non-minifiable). Des infos de débogage seront alors logguées dans la console pour aider à retrouver code à l'origine de l'alerte. Je préfère utiliser `ng-strict-di` uniquement pour le débogage.
    `<body ng-app="APP" ng-strict-di>`

### Utilisation de Gulp ou Grunt pour `ng-annotate`
###### [Style [Y101](#style-y101)]

  - Utilisez [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) ou [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) dans une tâche de *build* automatisée. Injectez `/* @ngInject */` avant toute fonction qui a des dépendances.

    *Pourquoi ?* : `ng-annotate` va intercepter la plupart des dépendances, mais parfois va nécessiter des indices grâce à l'utilisation de l'ajout de `/* @ngInject */ˋ.

    Le code ci-dessous est un exemple d'une tâche gulp qui utilise `ngAnnotate`

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;

        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Annotate est avant uglify pour que le code soit minifié correctement.
            .pipe(ngAnnotate({
                // true permet de l'ajouter là où @ngInject n'est pas utilisé. C'est inféré.
                // Ne fonctionne pas avec resolve, donc nous devons être explicite ici.
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[Retour en haut de page](#table-des-matières)**

## Gestion des Exceptions

### Décorateurs
###### [Style [Y110](#style-y110)]

  - Utilisez un [décorateur](https://docs.angularjs.org/api/auto/service/$provide#decorator), au moment de la configuration en utilisant le service [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), sur le service [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) pour effectuer des actions personnalisées lorsque des exceptions se produisent.

    *Pourquoi ?* : Cela fournit un moyen cohérent pour gérer les exceptions non interceptées d'Angular pendant le développement ou à l’exécution.

    Note : Une autre possibilité serait de surcharger le service au lieu d'utiliser un décorateur. C'est une bonne option, mais si vous voulez vous conformer au comportement standard et l'étendre, un décorateur est plus approprié.

    ```javascript
    /* recommandé */
    angular
        .module('blocks.exception')
        .config(exceptionConfig);

    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'toastr'];

    function extendExceptionHandler($delegate, toastr) {
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * On pourrait ajouter l'erreur à une collection d'un service,
             * ajouter les erreurs au $rootScope, loguer les erreurs sur un serveur distant,
             * ou les loguer localement. Ou alors  les rejeter directement. C'est entièrement votre choix.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Intercepteurs d'exceptions
###### [Style [Y111](#style-y111)]

  - Créez une *factory* qui expose une interface pour intercepter et gérer correctement les exceptions.

    *Pourquoi ?* : Cela fournit un moyen cohérent pour intercepter les exceptions qui peuvent être déclenchées dans votre code (par exemple, pendant une requête XHR ou lors d'un échec de *promise*).

    Note : L'intercepteur d'exceptions est bon pour intercepter et réagir à des exceptions spécifiques potentielles provenant d'appels qui pourraient en produire. Par exemple, lorsque on fait une requête XHR pour récupérer des données d'un service web distant et que vous voulez intercepter n'importe quelles exceptions provenant de ce service uniquement et réagir seulement à celles-ci.

    ```javascript
    /* recommandé */
    angular
        .module('blocks.exception')
        .factory('exception', exception);

    exception.$inject = ['logger'];

    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
    ```

### Erreurs de routage
###### [Style [Y112](#style-y112)]

  - Gérez et loguez toutes les erreurs de routage en utilisant [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Pourquoi ?* : Pour fournir un moyen cohérent de gestion des erreurs de routage.

    *Pourquoi ?* : Pour fournir potentiellement une meilleure expérience utilisateur si une erreur de routage se produit et rediriger vers un écran approprié avec plus de détails ou les possibilités pour s'en sortir.

    ```javascript
    /* recommandé */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Annulation du routage :
         * sur une erreur de routage, aller au dashboard.
         * Fournit une clause de sortie s'il essaye de le faire deux fois.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                if (handlingRouteChangeError) { return; }
                handlingRouteChangeError = true;
                var destination = (current && (current.title ||
                    current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' +
                    (rejection.msg || '');

                /**
                 * Loguer éventuellement en utilisant un service personnalisé ou $log.
                 * (N'oubliez pas d'injecter votre service personnalisé)
                 */
                logger.warning(msg, [current]);

                /**
                 * Lors d'une erreur de routage aller sur une autre route / état.
                 */
                $location.path('/');

            }
        );
    }
    ```

**[Retour en haut de page](#table-des-matières)**

## Nommage

### Conventions de nommage
###### [Style [Y120](#style-y120)]

  - Utilisez des noms cohérents pour tous les composants en utilisant un motif qui décrit la fonctionnalité du composant puis (éventuellement) son type. Le motif que je recommande est `fonctionnalité.type.js`. Il y a deux noms pour la plupart des ressources :
    * le nom du fichier (`avengers.controller.js`)
    * le nom du composant déclaré à Angular (`AvengersController`)

    *Pourquoi ?* : Les conventions de nommage permettent de de nommer de façon cohérente et de retrouver du contenu en un clin d'œil. La cohérence à toute l'échelle du projet est vitale. La cohérence au sein d'une équipe est importante. La cohérence dans une entreprise apporte une efficacité redoutable.

    *Pourquoi ?* : Les conventions de nommage doivent simplement vous aider à naviguer dans votre code plus vite et le rendre plus facile à comprendre.

### Nom des fichiers de fonctionnalités
###### [Style [Y121](#style-y121)]

  - Utilisez des noms cohérents pour tous les composants qui suivent un motif qui décrit leur fonctionnalité et (éventuellement) leur type. Le motif que je recommande est `fonctionnalité.type.js`.

    *Pourquoi ?* : Offre une façon cohérente d'identifier rapidement les composants.

    *Pourquoi ?* : Permet de faire *matcher* par nom de fichier au sein d'un processus d'automatisation.

    ```javascript
    /**
     * Options courantes
     */

    // Contrôleurs
    avengers.js
    avengers.controller.js
    avengersController.js

    // Services/Factories
    logger.js
    logger.service.js
    loggerService.js
    ```

    ```javascript
    /**
     * recommandé
     */

    // contrôleurs
    avengers.controller.js
    avengers.controller.spec.js

    // services/factories
    logger.service.js
    logger.service.spec.js

    // constantes
    constants.js

    // definition de module
    avengers.module.js

    // routes
    avengers.routes.js
    avengers.routes.spec.js

    // configuration
    avengers.config.js

    // directives
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

  Note : Une autre convention courante consiste à nommer les fichiers des contrôleurs sans le mot `controller` dans le nom de fichier comme `avengers.js`au lieu de `avengers.controller.js`. Toutes les autres conventions tiennent à garder le suffixe du type. Le contrôleur étant le type de composant le plus courant, cela permet alors d'économiser à la frappe tout en restant facilement identifiable. Je vous conseille de choisir une convention et de vous y tenir dans toute l'équipe. Ma préference est `avengers.controller.js`.

    ```javascript
    /**
     * recommandé
     */
    // Contrôleurs
    avengers.js
    avengers.spec.js
    ```

### Nommage des fichiers de test
###### [Style [Y122](#style-y122)]

  - Le nommage des spécifications de test est similaire à celui des celui du composant qu'il teste avec le suffixe `spec`.

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement les composants.

    *Pourquoi ?* : Permet de faire *matcher* par nom de fichier dans [karma](http://karma-runner.github.io/) ou d'autres moteurs de tests.

    ```javascript
    /**
     * recommandé
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Nommage des Contrôleurs
###### [Style [Y123](#style-y123)]

  - Utilisez des noms cohérents pour tous les contrôleurs nommés d'après leur fonctionnalité. Utilisez le UpperCamelCase pour les contrôleurs, car ce sont des constructeurs.

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement et de référencer les contrôleurs.

    *Pourquoi ?* : Le UpperCamelCase est la convention pour identifier les objets qui peuvent être instanciés avec un constructeur.

    ```javascript
    /**
     * recommandé
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController() { }
    ```

### Suffixe du nom des contrôleurs
###### [Style [Y124](#style-y124)]

  - Ajoutez au nom du contrôleur le suffixe ˋControllerˋ.

    *Pourquoi ?* : Le suffixe ˋControllerˋ est souvent utilisé et il est explicite.

    ```javascript
    /**
     * recommandé
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Nommage des *factory* et des services
###### [Style [Y125](#style-y125)]

  - Utilisez des noms cohérents pour toutes les *factories* et les services nommés d'après leur fonctionnalités. Utilisez le lowerCamelCase pour les services et les *factories*. Évitez de préfixer les *factories* et les services par `$`. N'ajoutez le suffixe `Service` à leurs noms uniquement si sa nature n'est pas claire (par exemple dans le cas des noms).

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement et de référencer les *factories* et les services.

    *Pourquoi ?* : Permet d'éviter les collisions avec les services et *factories* d'Angular qui ont déjà le préfixe `$`.

    *Pourquoi ?* : Les services aux noms explicites tels que `logger` n'ont pas besoin d'être préfixés.

    *Pourquoi ?* : Des alias tels que 'avengers' sont des noms et ont besoin d'un suffixe. Ce dernier doit être nommé `avengersService`.

    ```javascript
    /**
     * recommandé
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

    ```javascript
    /**
     * recommended
     */

    // credit.service.js
    angular
        .module
        .factory('creditService', creditService);

    function creditService() { }

    // credit.service.js
    angular
        .module
        .service('customersService', customersService);

    function customersService() { }
    ```

### Nommage des directives
###### [Style [Y126](#style-y126)]

  - Utilisez des noms cohérents pour toutes les directives en utilisant le lowerCamelCase. Utilisez un préfixe court pour décrire le domaine auquel les directives appartiennent (par exemple le préfixe de la société ou du projet).

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement et de référencer les composants.

    ```javascript
    /**
     * recommandés
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // l'usage est <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Modules
###### [Style [Y127](#style-y127)]

  - Lorqu'il y a de multiples modules, nommez le fichier du module principal ˋapp.module.jsˋ et nommez les autres modules qui en sont dépendants d'après ce qu'ils représentent. Par exemple, nommez un module d'administration ˋadmin.module.jsˋ. Les noms des modules déclarés seraient alors respectivement ˋappˋ et ˋadminˋ.

    *Pourquoi ?* : Fournit de la cohérence pour les applications modulaires, et pour prévoir l'extension des applications.

    *Pourquoi ?* : Fournit une façon aisée d'utiliser des processus d'automatisation des tâches afin de charger toutes les définitions de modules en premier, puis ensuite tous les autres fichiers Angular (pour l'assemblage).

### Configuration
###### [Style [Y128](#style-y128)]

  - Séparez la configuration d'un module dans son propre fichier nommé d'après le module. Un fichier de configuration du module principal ˋappˋ est nommé ˋapp.config.jsˋ (ou simplement ˋconfig.jsˋ). Une configuration pour un module nommé ˋadmin.module.jsˋ est nommé ˋadmin.config.jsˋ.

    *Pourquoi ?* : Sépare la configuration de la définition du module, des composants et du code actif.

    *Pourquoi ?* : Fournit un endroit bien identifié pour régler la configuration d'un module.

### Routes
###### [Style [Y129](#style-y129)]

  - Séparez la configuration du routage dans son propre fichier. Un exemple pourrait être ˋapp.route.jsˋ pour le module principal et ˋadmin.route.jsˋ pour le module d'administration. Même pour de petites applications, il est préférable de privilégier cette séparation du reste de la configuration.

**[Retour en haut de page](#table-des-matières)**

## Architecture L.I.F.T.
### LIFT
###### [Style [Y140](#style-y140)]

  - Structurez votre application afin de pouvoir `L`ocaliser le code plus rapidement, `I`dentifier le code d'un seul coup, garder la structure la plus plate possible (`F`lattest), et essayez (`T`ry) de rester DRY (Don't Repeat Yourself). La structure doit suivre ces quatre règles de base.

    *Pourquoi ?* : L.I.F.T. fournit une structure cohérente qui peut grossir facilement, qui est modulaire, et augmente facilement l'efficacité de développement. Une autre façon de valider la structure de votre application est de vous demander à quelle vitesse vous pouvez ouvrir et travailler dans tous les fichiers liés à une fonctionnalité.

    Lorsque je trouve que ma structure n'est pas confortable, je reviens en arrière et consulte à nouveau les règles L.I.F.T.

    1. `L`ocaliser notre code est facile.
    2. `I`dentifier le code d'un coup.
    3. `F`lat structure (structure plate) autant que possible.
    4. `T`ry (Essayer) de ne pas se répéter (T-DRY).

### Localisation
###### [Style [Y141](#style-y141)]

  - Rendez la localisation du code intuitive, simple et rapide.

    *Pourquoi ?* : Je trouve que c'est super important pour un projet. Si l'équipe ne peut pas trouver rapidement les fichiers sur lesquels elle doit travailler, elle ne va pas être en mesure de travailler aussi efficacement que possible, et la structure doit changer. Vous ne connaissez peut-être pas le nom du fichier où la position des fichiers liés, alors les placer dans les endroits les plus intuitifs et proches les uns les autres permet de gagner beaucoup de temps. Une structure de répertoire descriptive peut aider.

    ```
    /bower_components
    /client
      /app
        /avengers
        /blocks
          /exception
          /logger
        /core
        /dashboard
        /data
        /layout
        /widgets
      /content
      index.html
    .bower.json
    ```

### Identification
###### [Style [Y142](#style-y142)]

  - Lorsque vous regardez un fichier vous devriez instantanément savoir ce qu'il contient et représente.

    *Pourquoi ?* : Vous passez moins de temps à fouiller et vous perdre pour trouver du code, et devenez de plus en plus efficace. Si ça implique des noms de fichier plus long, alors d'accord. Soyez descriptif avec les noms des fichiers et leur contenu ne doit correspondre qu'à un seul composant. Évitez les fichiers avec plusieurs contrôleurs, plusieurs services, ou un mélange. On pourrait admettre une exception à cette règle si j'ai un ensemble de très petites fonctionnalités qui sont toutes reliées entre elles, elles sont toujours facilement identifiables.

### Plat
###### [Style [Y143](#style-y143)]

  - Gardez une structure de répertoire à plat le plus longtemps possible. Lorsque vous avez sept fichiers ou plus, commencez à penser à séparer.

    *Pourquoi ?* : Personne ne souhaite rechercher dans sept niveaux de répertoires pour trouver un fichier. Pensez aux menus des sites web… Rien de plus profond que deux niveaux ne devrait être sérieusement pris en considération. Dans une structure de répertoire, il n'y a pas de nombre d'or, mais lorsqu'un répertoire à entre sept et dix fichiers, il serait temps de créer des sous-répertoires. Ajustez cela à votre de confort. Utilisez une structure plus plate jusqu'à ce qu'il y ait un intérêt évident (pour respecter les autres principes L.I.F.T.) à créer un sous-répertoire.

### T-DRY (Essayer de ne pas se répéter)
###### [Style [Y144](#style-y144)]

  - Ne vous répétez pas (DRY), mais ne sacrifiez pas la lisibilité.

    *Pourquoi ?* : Ne pas se répéter (DRY) est important, mais pas critique si vous en êtes réduit à sacrifier les autres principes L.I.F.T, c'est ce qu'on sous-entend par T-DRY. Je ne veux pas écrire `session-view.html` pour une vue parce que c'est trivial. Si ce n'est pas évident ou si la convention le précise alors nommez-le.

**[Retour en haut de page](#table-des-matières)**

## Architecture de l'application

### Règles globales
###### [Style [Y150](#style-y150)]

  -  Vous devez avoir une vue court terme et une vision à long terme. En d'autres mots, commencez petit et gardez en tête là où veut aller votre application. Tout le code de l'application va dans un répertoire de départ nommé `app` à la racine du projet. Tout élément fonctionnel doit être rangé dans son propre et unique fichier. Chaque contrôleur, service, module, vue doit avoir son propre fichier. Tous les scripts externes doivent être rangés dans un autre répertoire à la racine du projet et non dans le répertoire `app`. Le code que l'on a pas écrit ne doit pas se mélanger avec le code de l'application (`bower_components`, `script`, `lib`).

    Note : Vous trouverez plus de détails et de justifications concernant l'architecture sur [ce post original sur la structure des applications](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Placez les composants qui définissent l'agencement visuel principal de l'application dans un répertoire nommé `layout`. Il devrait inclure une « vue-enveloppe » et le contrôleur devrait agir comme conteneur pour l'application, la navigation, les menus, les zones de contenu, et les autres régions.

    *Pourquoi ?* : Cela organise tout l'agencement visuel à un seul endroit réutilisé dans toute l'application.

### Structure « répertoire-fonctionnalité »
###### [Style [Y152](#style-y152)]

  - Créez des répertoires nommés d'après les fonctionnalités qu'elles représentent. Lorsqu'un répertoire grossit jusqu'à atteindre plus de sept fichiers, commencez à penser la création d'un sous-répertoire pour ceux-ci. Si votre seuil est différent, ajustez au besoin.

    *Pourquoi ?* : Un développeur peut localiser, identifier ce que représente chaque fichier en une seule fois, la structure est aussi plate que possible, et il n'y a ni répétitions ni redondance de nommage.

    *Pourquoi ?* : Les règles L.I.F.T. sont toutes respectées.

    *Pourquoi ?* : Aide à diminuer l'entropie de l'application en organisant le contenu et en le maintenant en accord avec les principes L.I.F.T.

    *Pourquoi ?* : Lorsqu'il y a de nombreux fichiers (plus de dix), les repérer est plus facile avec une structure de répertoires cohérente que dans une structure à plat.

    ```javascript
    /**
     * recommandé
     */

    app/
        app.module.js
        app.config.js
        components/
            calendar.directive.js
            calendar.directive.html
            user-profile.directive.js
            user-profile.directive.html
        layout/
            shell.html
            shell.controller.js
            topnav.html
            topnav.controller.js
        people/
            attendees.html
            attendees.controller.js
            people.routes.js
            speakers.html
            speakers.controller.js
            speaker-detail.html
            speaker-detail.controller.js
        services/
            data.service.js
            localstorage.service.js
            logger.service.js
            spinner.service.js
        sessions/
            sessions.html
            sessions.controller.js
            sessions.routes.js
            session-detail.html
            session-detail.controller.js
    ```

      ![Image d'un exemple de structure d'application](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-2.png)

      Note : N'utilisez pas une structuration « répertoire-type ». Cela requiert de se déplacer entre de multiples répertoires lors du travail sur une fonctionnalité et cela devient rapidement difficile à manier lorsque l'application passe de à cinq, dix ou plus de vingt-cinq vues et contrôleurs (et autres fonctionnalités), ce qui complique la localisation par rapport à une structure en « répertoire-fonctionnalité ».

    ```javascript
    /*
    * à éviter
    * Alternative aux « répertoires-type » :
    * Je vous conseille les « répertoires-fonctionnalité »
    */

    app/
        app.module.js
        app.config.js
        app.routes.js
        directives.js
        controllers/
            attendees.js
            session-detail.js
            sessions.js
            shell.js
            speakers.js
            speaker-detail.js
            topnav.js
        directives/
            calendar.directive.js
            calendar.directive.html
            user-profile.directive.js
            user-profile.directive.html
        services/
            dataservice.js
            localstorage.js
            logger.js
            spinner.js
        views/
            attendees.html
            session-detail.html
            sessions.html
            shell.html
            speakers.html
            speaker-detail.html
            topnav.html
    ```

**[Retour en haut de page](#table-des-matières)**

## Modularité

### Nombreux petits modules auto-suffisants
###### [Style [Y160](#style-y160)]

  - Créez de petits modules qui encapsulent une seule responsabilité.

    *Pourquoi ?* : Les applications modulaires rendent facile la compossibilité rapide puisqu'elles permettent aux équipes de développement de construire verticalement des sections de l'application et de livrer incrémentalement. Cela signifie que nous pouvons brancher de nouvelles fonctionnalités au fur et à mesure de leur développement.

### Création d'un module applicatif
###### [Style [Y161](#style-y161)]

  - Créez un module racine pour l'application dont le rôle est d'assembler tous les modules et fonctionnalités de votre application. Nommez-le comme votre application.

    *Pourquoi ?* : Angular encourage la modularité et la séparation des responsabilités. La création d'un module racine pour l'application dont le rôle est de lier ensemble des autres modules fournit un moyen très direct d'ajouter et de retirer des modules à votre application.

### Garder le module applicatif léger
###### [Style [Y162](#style-y162)]

  - Ne placez dans le module applicatif que la logique d'assemblage de l'application. Laissez les fonctionnalités dans leurs propres modules.

    *Pourquoi ?* : Ajouter des responsabilités supplémentaires à la racine de l'application pour récupérer des données, afficher des vues, ou toute autre logique non reliée à l'assemblage de l'application trouble le module applicatif et rend plus difficile à réutiliser ou éteindre les ensembles de fonctionnalités.

    *Pourquoi ?* : Le module applicatif devient une déclaration qui montre quels modules aident à constituer l'application.

### Les macro-fonctionnalités sont des modules
###### [Style [Y163](#style-y163)]

  - Créez des modules qui représentent des macro-fonctionnalités, comme l'agencement graphique (*layout*), les services ré-utilisables et partagés, les dashboards, et les fonctionnalités applicatives spécifiques (par exemple : clients, admin, ventes).

    *Pourquoi ?* : Les modules auto-suffisants peuvent être ajoutés à l'application avec peu ou pas de friction.

    *Pourquoi ?* : Les sprints ou itérations peuvent être focalisés sur les macro-fonctionnalités. Elles peuvent être activées à la fin de ceux-ci.

    *Pourquoi ?* : Séparer les macros-fonctionnalités en modules les rend plus facile à tester de façon isolée et à la réutilisation.

### Les Blocks Ré-Utilisables en tant que Modules
###### [Style [Y164](#style-y164)]

  - Créez des modules qui représentent des blocs ré-utilisables dans l'application pour les services en commun tels que la gestion des exceptions, les logs, les diagnostics, la sécurité et la gestion des données locale.

    *Pourquoi ?* : Ces types de fonctionnalités sont requises dans de nombreuses application, donc en les gardant séparées dans leur propres modules elles peuvent être génériques et peuvent être ré-utilisées pour d'autres applications.

### Dépendances entre modules
###### [Style [Y165](#style-y165)]

  - Le module racine de l'application dépend des modules des fonctionnalités spécifiques et de certains modules partagés et ré-utilisables.

    ![Modularité et Dépendences](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-1.png)

    *Pourquoi?* : Le module principal de l'application continent manifeste des fonctionnalités de l'application.

    *Pourquoi ?* : Chaque groupe de fonctionnalités contient une déclaration de ce dont il dépend, de ce fait il peut être importé comme dépendance dans d'autres applications et continuer à fonctionner.

    *Pourquoi ?* : Les fonctionnalités propres à l'application telles que les services de données partagées deviennent faciles à repérer et partager au sein d'un `app.core` (choisissez un nom de votre choix pour ce module).

    Note : C'est une stratégie pour la cohérence. Il y a ici beaucoup de bons choix. Choisissez-en une qui soit cohérente, qui suit les règles des dépendances d'Angular, et qui facilite la maintenance et la montée en charge.

    > Mes structures peuvent varier légèrement entre les projets mais elles suivent toutes ces règles pour la structure et la modularité. L'implémentation peut varier en fonction des fonctionnalités et de l'équipe. En d'autres termes, ne vous paralysez pas sur une structure exactement semblable mais pensez votre structure en termes de cohérence, maintenabilité, et efficacité.

    > Dans de petites applications, vous pouvez aussi mettre toutes vos dépendances partagées dans le module applicatif où les modules fonctionnels n'ont pas de dépendances directes. Cela pourra rendre la maintenance de petites applications plus facile, mais rend difficile la ré-utilisation de ces modules en dehors de celle-ci.

**[Retour en haut de page](#table-des-matières)**

## Logique d'initialisation

### Configuration
###### [Style [Y170](#style-y170)]

  - Injectez le code à l'intérieur d'une [configuration de module](https://docs.angularjs.org/guide/module#module-loading-dependencies) qui doit être configurée avant l’exécution de l'application Angular. Parmi les candidats idéaux, on trouve les *providers* et les constantes.

    *Pourquoi ?* : Cela rend les choses plus faciles d'avoir le moins d'endroits possibles pour la configuration.

  ```javascript
  angular
      .module('app')
      .config(configure);

  configure.$inject =
      ['routerHelperProvider', 'exceptionHandlerProvider', 'toastr'];

  function configure (routerHelperProvider, exceptionHandlerProvider, toastr) {
      exceptionHandlerProvider.configure(config.appErrorPrefix);
      configureStateHelper();

      toastr.options.timeOut = 4000;
      toastr.options.positionClass = 'toast-bottom-right';

      ////////////////

      function configureStateHelper() {
          routerHelperProvider.configure({
              docTitle: 'NG-Modular: '
          });
      }
  }
  ```

### Blocs `run`
###### [Style [Y171](#style-y171)]

  - Tout code qui nécessite de s’exécuter lorsque l'application s'initialise devrait être déclaré dans une *factory*, exposé via une fonction, et injecté dans le [bloc run](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Pourquoi ?* : Le code directement écrit dans un bloc `run` peut être difficile à tester. Le placer dans une *factory* le rend plus facile à abstraire et à *mocker*.

  ```javascript
  angular
      .module('app')
      .run(runBlock);

    runBlock.$inject = ['authenticator', 'translator'];

    function runBlock(authenticator, translator) {
        authenticator.initialize();
        translator.initialize();
    }
  ```

**[Retour en haut de page](#table-des-matières)**

## Les services `$` d'Angular

### `$document` et `$window`
###### [Style [Y180](#style-y180)]

  - Utilisez [`$document`](https://docs.angularjs.org/api/ng/service/$document) et [`$window`](https://docs.angularjs.org/api/ng/service/$window) au lieu de `document` et `window`.

    *Pourquoi ?* : Ces services sont *wrappés* par Angular et plus facilement testables qu'en utilisant document et window dans les tests. Ils vous aident à éviter d'avoir à *mocker* `document` et `window` vous-même.

### $timeout et $interval
###### [Style [Y181](#style-y181)]

  - Utilisez [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) et [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) au lieu de `setTimeout` et `setInterval`.

    *Pourquoi ?* : Ces services sont *wrappés* par Angular et plus facilement testables et gèrent le cycle de *digest* d'Angular conservant un *data-binding* synchronisé.

**[Retour en haut de page](#table-des-matières)**

## Tests
Les tests unitaires aident à maintenir un code source propre, ainsi j'ai inclus quelques unes de mes recommandations sur les bases des tests unitaires avec des liens pour plus d'informations.

### Écrire les tests avec des scenario
###### [Style [Y190](#style-y190)]

  - Écrivez un ensemble de tests pour chaque scenario. Commencer avec un test vide et complétez-les à mesure que vous écrivez le code pour le scenario.

    *Pourquoi ?* : Écrire les descriptions de tests aident à définir clairement ce que votre scenario devra faire, ne devra pas faire et comment mesurer la réussite.

    ```javascript
    it('should have Avengers controller', function() {
        //TODO
    });

    it('should find 1 Avenger when filtered by name', function() {
        //TODO
    });

    it('should have 10 Avengers', function() {
        //TODO (mock data?)
    });

    it('should return Avengers via XHR', function() {
        //TODO ($httpBackend?)
    });

    // et ainsi de suite
    ```

### Librairie de test
###### [Style [Y191](#style-y191)]

  - Utilisez [Jasmine](http://jasmine.github.io/) or [Mocha](http://mochajs.org) pour les tests unitaires.

    *Pourquoi ?* : Jasmine et Mocha sont toutes deux largement utilisées dans la communauté Angular. Toutes les deux sont stables, bien maintenues, et fournissent des fonctionnalités de test robustes.

    Note : Lorsque vous utilisez Mocha, utilisez aussi une librairie d'assertion telle que [Chai](http://chaijs.com). Je prefère Mocha.

### Lanceur de Test
###### [Style [Y192](#style-y192)]

  - Utilisez [Karma](http://karma-runner.github.io) comme lanceur de test.

    *Pourquoi ?* : Karma est facile à configurer pour lancer les tests ponctuellement ou automatiquement lorsqu'un changement est fait dans le code.

    *Pourquoi ?* : Karma s'intègre facilement dans votre processus d'intégration continue soit seul ou via Grunt ou Gulp.

    *Pourquoi ?* : Quelques EDI commencent à s'intégrer avec Karma, c'est le cas de [WebStorm](http://www.jetbrains.com/webstorm/) et [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Pourquoi ?* : Karma fonctionne bien avec les principaux outils d'automatisation de tâches tel que [Grunt](http://www.gruntjs.com) (avec [grunt-karma](https://github.com/karma-runner/grunt-karma)) ou [Gulp](http://www.gulpjs.com). Si vous utilisez Gulp, utilisez [Karma](https://github.com/karma-runner/karma) directement plutôt que via un plugin, son API peut s'utiliser directement.

    ```javascript
    /* recommended */

    // Exemple de Gulp fonctionnant directement avec Karma
    function startTests(singleRun, done) {
        var child;
        var excludeFiles = [];
        var fork = require('child_process').fork;
        var karma = require('karma').server;
        var serverSpecs = config.serverIntegrationSpecs;

        if (args.startServers) {
            log('Starting servers');
            var savedEnv = process.env;
            savedEnv.NODE_ENV = 'dev';
            savedEnv.PORT = 8888;
            child = fork(config.nodeServer);
        } else {
            if (serverSpecs && serverSpecs.length) {
                excludeFiles = serverSpecs;
            }
        }

        karma.start({
            configFile: __dirname + '/karma.conf.js',
            exclude: excludeFiles,
            singleRun: !!singleRun
        }, karmaCompleted);

        ////////////////

        function karmaCompleted(karmaResult) {
            log('Karma completed');
            if (child) {
                log('shutting down the child process');
                child.kill();
            }
            if (karmaResult === 1) {
                done('karma: tests failed with code ' + karmaResult);
            } else {
                done();
            }
        }
    }
    ```

### `stub` et les `spy`
###### [Style [Y193](#style-y193)]

  - Utilisez [Sinon](http://sinonjs.org/) pour les `stub` et les `spy`.

    *Pourquoi ?* : Sinon fonctionne bien avec Jasmine et Mocha et étend les fonctionnalités de `stub` et de `spy` qu'ils offrent.

    *Pourquoi ?* : Sinon rend plus facile l'alternance entre Jasmine et Mocha, si vous voulez essayer les deux.

    *Pourquoi ?* : Sinon fournit des messages descriptifs quand les tests ne valident pas les assertions.

### Navigateur sans interface graphique
###### [Style [Y194](#style-y194)]

  - Utilisez [PhantomJS](http://phantomjs.org/) pour exécuter les tests sur un serveur.

    *Pourquoi?* : PhantomJS est un navigateur sans interface graphique qui peut vous aider à exécuter les tests sans avoir besoin d'un navigateur "visuel". Ainsi vous n'avez pas besoin d'installer Chrome, Safari, IE, ou d'autres navigateurs sur votre serveur.

    Note : Que cela ne vous dispense pas de tester sur tous les navigateurs dans votre environnement,en fonction des clients que vous ciblez.

### Analyse du code
###### [Style [Y195](#style-y195)]

  - Exécutez JSHint sur vos tests.

    *Pourquoi ?* : Les tests c'est aussi du code. JSHint peut vous aider à identifier les problèmes de qualité de code qui pourrait amener les tests à fonctionner de façon incorrecte.

### Assouplissement des règles de JSHint avec les variables globales dans les tests
###### [Style [Y196](#style-y196)]

  - Assouplissez les règles sur votre code de test afin de permettre l'usage des variables globales courantes telles que `describe` et `expect`. Assouplissez les règles pour les expressions puisque Mocha les utilise.

    *Pourquoi ?* : Vos tests sont du code et requièrent à ce titre la même attention avec les mêmes règles de qualité de code que votre code de production. Cependant, les variables globales utilisées par les *frameworks* de test, par exemple, peuvent être négligées en les incluant dans les spécifications de test.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Ou alors vous pouvez rajouter le snippet suivant à votre fichier d'options JSHint.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Outils de test](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/testing-tools.png)

### Organisation des tests
###### [Style [Y197](#style-y197)]

  - Placez les fichiers des tests unitaires (specs) parallèle au code client. Placez les specs qui sont en charge de l'intégration avec le serveur ou celles qui testent plusieurs composants dans un répertoire `tests` séparé.

    *Pourquoi ?* : Les tests unitaires sont en corrélation directe avec les composants et fichiers qu'ils testent dans le code source.

    *Pourquoi ?* : Il est plus facile de les mettre à jour puisqu'ils sont toujours visibles. Quand vous développez, que vous fassiez du TDD, des tests en même temps que l'implémentation ou des tests après l'implémentation, les spécifications ne sont jamais loin ni des yeux ni de l'esprit, et ainsi ils ont plus de chance d'être maintenus, ce qui permet aussi de tenir une bon *coverage*.

    *Pourquoi ?* : Quand vous mettez à jour le code source, il est plus facile de mettre à jour les tests en même temps.

    *Pourquoi ?* : Les placer en parallèle les rend plus facile à trouver et facile à déplacer si vous déplacez les sources.

    *Pourquoi ?* : Avoir les spécifications proches permet au lecteur d'apprendre comment le composant est supposé être utilisé et découvrir ses limitations connues.

    *Pourquoi ?* : Séparer les spécifications de test afin qu'ils ne soient pas inclus dans le *build* est facile avec grunt ou gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.spec.js
                             /customers.controller-detail.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Retour en haut de page](#table-des-matières)**

## Animations

### Utilisation
###### [Style [Y210](#style-y210)]

  - Utilisez de subtiles [animations avec Angular](https://docs.angularjs.org/guide/animations) pour les transitions entre les états pour les vues et les éléments visuels de base. Incluez le [module ngAnimate](https://docs.angularjs.org/api/ngAnimate). Les trois clés sont la subtilité, la fluidité, l’homogénéité.

    *Pourquoi ?* : Des animations subtiles peuvent améliorer l'expérience utilisateur lorsqu'elles sont utilisées de façon appropriées.

    *Pourquoi ?* : Des animations subtiles peuvent améliorer les performances perçues lorsque les vues changent.

### Moins d'une Seconde
###### [Style [Y211](#style-y211)]

  - Utilisez de courtes durées pour les animations. Je commence en général par 300ms et j'ajuste jusqu'à ce que le résultat soit celui attendu.

    *Pourquoi ?* : Les animations longues peuvent avoir des effets inverses sur l'expérience utilisateur et les performances perçues en donnant l'impression d'une application lente.

### animate.css
###### [Style [Y212](#style-y212)]

  - Utilisez [animate.css](http://daneden.github.io/animate.css/) pour les animations classiques.

    *Pourquoi ?* : Les animations que fournit animate.css sont rapides, fluides et faciles à ajouter à votre application.

    *Pourquoi ?* : Fournit de la cohérence à vos animations.

    *Pourquoi ?* : animate.css est largement utilisée et testé.

    Note : Lire ce [super post par Matias Niemelä sur les animations Angular](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Retour en haut de page](#table-des-matières)**

## Commentaires

### jsDoc
###### [Style [Y220](#style-y220)]

  - Si vous prévoyez de documenter votre code source, utilisez la syntaxe [`jsDoc`](http://usejsdoc.org/) pour documenter les noms des fonctions, leur descriptions, paramètres et valeurs de retour. Utilisez `@namespace` et `memberOf` pour s'adapter à l'architecture de votre application.

    *Pourquoi ?* : Vous pouvez générer (et re-générer) la documentation à partir de votre code, au lieu de l'écrire intégralement.

    *Pourquoi ?* : Cela permet d'avoir de la cohérence grâce un outil industriel standard.

    ```javascript
    /**
     * Factory de logger
     * @namespace Factories
     */
    (function() {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Logger de niveau applicatif
       * @memberOf Factories
       */
      function logger($log) {
          var service = {
             logError: logError
          };
          return service;

          ////////////

          /**
           * @name logError
           * @desc Logue les erreurs
           * @param {String} msg Le message à loguer
           * @returns {String}
           * @memberOf Factories.Logger
           */
          function logError(msg) {
              var loggedMsg = 'Error: ' + msg;
              $log.error(loggedMsg);
              return loggedMsg;
          };
      }
    })();
    ```

**[Retour en haut de page](#table-des-matières)**

## JSHint

### Utilisation d'un fichier d'options
###### [Style [Y230](#style-y230)]

  - Utilisez JSHint pour analyser votre JavaScript et assurez-vous d'avoir personnalisé son fichier d'options et incluez le dans le système de versioning. Lire la [documentation de JSHint](http://www.jshint.com/docs/) pour avoir les détails de chaque option.

    *Pourquoi ?* : Cela fournit une première alerte avant de *committer* son code dans le système de versioning.

    *Pourquoi ?* : Fournit de la cohérence dans votre équipe.

    ```javascript
    {
        "bitwise": true,
        "camelcase": true,
        "curly": true,
        "eqeqeq": true,
        "es3": false,
        "forin": true,
        "freeze": true,
        "immed": true,
        "indent": 4,
        "latedef": "nofunc",
        "newcap": true,
        "noarg": true,
        "noempty": true,
        "nonbsp": true,
        "nonew": true,
        "plusplus": false,
        "quotmark": "single",
        "undef": true,
        "unused": false,
        "strict": false,
        "maxparams": 10,
        "maxdepth": 5,
        "maxstatements": 40,
        "maxcomplexity": 8,
        "maxlen": 120,

        "asi": false,
        "boss": false,
        "debug": false,
        "eqnull": true,
        "esnext": false,
        "evil": false,
        "expr": false,
        "funcscope": false,
        "globalstrict": false,
        "iterator": false,
        "lastsemic": false,
        "laxbreak": false,
        "laxcomma": false,
        "loopfunc": true,
        "maxerr": false,
        "moz": false,
        "multistr": false,
        "notypeof": false,
        "proto": false,
        "scripturl": false,
        "shadow": false,
        "sub": true,
        "supernew": false,
        "validthis": false,
        "noyield": false,

        "browser": true,
        "node": true,

        "globals": {
            "angular": false,
            "$": false
        }
    }
    ```

**[Retour en haut de page](#table-des-matières)**

## JSCS

### Utiliser un fichier de configuration
###### [Style [Y235](#style-y235)]

  - Utilisez JSCS pour valider vos styles de code pour votre JavaScript et pensez à personnaliser vos options pour JSCS et de l'inclure dans votre gestionnaire de versioning. Vous pouvez consulter la [documentation de JSCS](http://www.jscs.info) pour voir les détails et les options.

    *Pourquoi ?* : Fournit une première alerte avant de *commiter* sur votre gestionnaire de versioning.

    *Pourquoi ?* : Permet d'assurer une cohérence au sein de votre équipe.

    ```javascript
    {
        "excludeFiles": ["node_modules/**", "bower_components/**"],

        "requireCurlyBraces": [
            "if",
            "else",
            "for",
            "while",
            "do",
            "try",
            "catch"
        ],
        "requireOperatorBeforeLineBreak": true,
        "requireCamelCaseOrUpperCaseIdentifiers": true,
        "maximumLineLength": {
          "value": 100,
          "allowComments": true,
          "allowRegex": true
        },
        "validateIndentation": 4,
        "validateQuoteMarks": "'",

        "disallowMultipleLineStrings": true,
        "disallowMixedSpacesAndTabs": true,
        "disallowTrailingWhitespace": true,
        "disallowSpaceAfterPrefixUnaryOperators": true,
        "disallowMultipleVarDecl": null,

        "requireSpaceAfterKeywords": [
          "if",
          "else",
          "for",
          "while",
          "do",
          "switch",
          "return",
          "try",
          "catch"
        ],
        "requireSpaceBeforeBinaryOperators": [
            "=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=",
            "&=", "|=", "^=", "+=",

            "+", "-", "*", "/", "%", "<<", ">>", ">>>", "&",
            "|", "^", "&&", "||", "===", "==", ">=",
            "<=", "<", ">", "!=", "!=="
        ],
        "requireSpaceAfterBinaryOperators": true,
        "requireSpacesInConditionalExpression": true,
        "requireSpaceBeforeBlockStatements": true,
        "requireLineFeedAtFileEnd": true,
        "disallowSpacesInsideObjectBrackets": "all",
        "disallowSpacesInsideArrayBrackets": "all",
        "disallowSpacesInsideParentheses": true,

        "jsDoc": {
            "checkAnnotations": true,
            "checkParamNames": true,
            "requireParamTypes": true,
            "checkReturnTypes": true,
            "checkTypes": true
        },

        "disallowMultipleLineBreaks": true,

        "disallowCommaBeforeLineBreak": null,
        "disallowDanglingUnderscores": null,
        "disallowEmptyBlocks": null,
        "disallowTrailingComma": null,
        "requireCommaBeforeLineBreak": null,
        "requireDotNotation": null,
        "requireMultipleVarDecl": null,
        "requireParenthesesAroundIIFE": true
    }
    ```

**[Back to top](#table-of-contents)**

## Constantes

### Globales des Librairies Externes
###### [Style [Y240](#style-y240)]

  - Créez une constante Angular pour les variables globales des librairies externes.

    *Pourquoi ?* : Fournit un moyen d'injecter des librairies tierces qui seraient sinon des globales. Cela améliore la testabilité du code en vous permettant de savoir plus facilement quelles sont les dépendances de vos composants (et évite de faire des abstractions qui fuient). Ça vous permet aussi de *mocker* ces dépendances, là où cela fait sens.

    ```javascript
    // constants.js

    /* global toastr:false, moment:false */
    (function() {
        'use strict';

        angular
            .module('app.core')
            .constant('toastr', toastr)
            .constant('moment', moment);
    })();
     ```

###### [Style [Y241](#style-y241)]

  - Utilisez des constantes pour les valeurs qui ne changent pas et ne viennent pas d'un autre service. Quand des constantes ne sont utilisées que par un module qui peut être ré-utilisé dans d'autres applications, placez les constantes dans un seul fichier par module nommé comme le module. Tant que c'est possible, gardez les constantes dans le module principal dans un fichier `constants.js`.

    *Pourquoi ?* : Une valeur qui peut changer, même rarement, devrait être récupérée d'un service afin de ne pas avoir à changer le code source. Par exemple, une URL pour un service de données pourrait être définie comme constante mais il serait mieux de lire cette valeur par appel à un web service.

    *Pourquoi ?* : Les constantes peuvent être injectées dans un composant Angular, y compris les *providers*.

    *Pourquoi ?* : Quand une application est divisée en modules qui peuvent être ré-utilisés dans d'autres applications, chacun de ces modules individuels devrait pouvoir fonctionner tout seul, y compris avec les constantes dépendantes.

    ```javascript
    // Constantes utilisées par toute l'appli
    angular
        .module('app.core')
        .constant('moment', moment);

    // Constantes utilisées seulement par le module de vente
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[Retour en haut de page](#table-des-matières)**

## Modèles de fichiers et *snippets*
Utilisez des *templates* de fichiers ou des *snippets* pour vous aider à suivre des styles et des *patterns* cohérents. Voici des *templates* et/ou *snippets* pour quelques uns des éditeurs de texte pour le développement web et EDIs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - *Snippets* Angular conformes avec ces styles et règles.

    - Téléchargez les [Snippets Angular pour Sublime](assets/sublime-angular-snippets.zip?raw=true)
    - Placez-les dans votre répertoire `Package`
    - Redémarrez Sublime
    - Dans un fichier de type JavaScript, tapez ces commandes suivies par la touche `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - Les *templates* de fichiers qui suivent ces styles et règles peuvent être trouvées sur [SideWaffle](http://www.sidewaffle.com)

    - Téléchargez l'extension [SideWaffle](http://www.sidewaffle.com) pour Visual Studio (fichier vsix)
    - Exécutez le fichier vsix
    - Re-démarrez Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Vous pouvez importer dans les paramètres de WebStormLes les *templates* de fichiers et les *snippets* Angular qui suivent ces styles et ces règles :

    - Téléchargez les [*templates* de fichiers et *snippets* WebStorm pour Angular](assets/webstorm-angular-file-template.settings.jar?raw=true)
    - Ouvrez WebStorm et allez dans le menu `File`
    - Choisissez le menu `Import Settings`
    - Sélectionnez le fichier et cliquez sur `OK`
    - Dans un fichier de type JavaScript, tapez ces commandes suivies de la touche `TAB` :

    ```javascript
    ng-c // crée un contrôleur Angular
    ng-f // crée une factory Angular
    ng-m // crée un module Angular
    ```

### Atom
###### [Style [Y253](#style-y253)]

  - *Snippets* Angular qui suivent ces styles et ces règles.
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    - Ouvrez Atom puis son *package manager* (Packages -> Settings View -> Install Packages/Themes)
    - Cherchez le *package* 'angularjs-styleguide-snippets'
    - Cliquez sur 'Install' pour installer le *package*

  - Dans un fichier JavaScript tapez ces commandes suivies de `TAB` :

    ```javascript
    ngcontroller // Crée un contrôleur Angular
    ngdirective // Crée une directive Angular
    ngfactory // Crée une factory Angular
    ngmodule // Crée un module Angular
    ngservice // Crée un service Angular
    ngfilter // Crée un filter Angular
    ```

### Brackets
###### [Style [Y254](#style-y254)]

  - *Snippets* Angular qui suivent ces styles et ces règles.
    - Téléchargez les [*snippets* Angular pour Brackets](assets/brackets-angular-snippets.yaml?raw=true).
    - Brackets Extension manager ( File > Extension manager )
    - Installez ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets).
    - Cliquez sur l'ampoule dans la marge droite de Brackets.
    - Cliquez sur `Settings` puis sur `Import`
    - Choisissez le fichier et sélectionnez `skip`ou `override`.
    - Cliquez sur `Start Import`

  - Dans un fichier JavaScript tapez ces commandes suivies de `TAB` :

    ```javascript
    // Snippets de fichiers complets avec IIFE
    ngcontroller // Crée un controller Angular
    ngdirective  // Crée une directive Angular
    ngfactory    // Crée une factory Angular
    ngapp        // Crée un module Angular
    ngservice    // Crée un service Angular
    ngfilter     // Crée un filter Angular

    // Snippets à chaîner
    ngmodule     // Crée an Angular module getter
    ngstate      // Crée an Angular UI Router state définition
    ngconfig     // Définit une fonction de configuration
    ngrun        // Définit une fonction run
    ngroute      // Définit une clause `when` pour ngRoute
    ngtranslate  // Utilise le service `$translate` avec sa promise
    ```

### vim
###### [Style [Y255](#style-y255)]

  - *Snippets* pour vim qui suivent ces styles et ces règles.

    - Téléchargez les [*snippets* vim pour Angular](assets/vim-angular-snippets?raw=true)
    - Réglez [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)
    - Copiez les *snippets* dans le répertoire approprié.

    ```javascript
    ngcontroller // Crée un contrôleur Angular
    ngdirective  // Crée une directive Angular
    ngfactory    // Crée une factory Angular
    ngmodule     // Crée un module Angular
    ngservice    // Crée un service Angular
    ngfilter     // Crée un filter Angular
    ```


**[Retour en haut de page](#table-des-matières)**

## Générateur Yeoman
###### [Style [Y260](#style-y260)]

Vous pouvez utiliser le [générateur Yeoman HotTowel](http://jpapa.me/yohottowel) pour créer une application Angular qui servira de point de départ et qui suis cette charte stylistique.

1. Installer `generator-hottowel`

  ```
  npm install -g generator-hottowel
  ```

2. Créer un nouveau répertoire et aller dans ce répertoire

  ```
  mkdir myapp
  cd myapp
  ```

3. Exécuter le générateur

  ```
  yo hottowel helloWorld
  ```

**[Retour en haut de page](#table-des-matières)**

## Routage
Le routage côté client est important pour créer un flux de navigation entre les vues et composer des vues constituées de nombreux *templates* et directives de plus petites tailles.

###### [Style [Y270](#style-y270)]

  - Utilisez le [routeur d'AngularUI](http://angular-ui.github.io/ui-router/) pour faire le routage côté client.

    *Pourquoi ?* : `ui-router` offre toutes les fonctionnalités du routeur d'Angular et en ajoute quelques unes parmi lesquelles les routes imbriquées et les états.

    *Pourquoi ?* : La syntaxe est similaire à celle du routeur Angular par défaut et il est facile de migrer vers `ui-router`.

    - Note: Vous pouvez utiliser un *provider* tel que `routerHelperProvider` montré ci-dessous pour vous aidez à configurer les états à travers les fichiers pendant la phase de `run`.

    ```javascript
    // customers.routes.js
    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'customer',
                config: {
                    abstract: true,
                    template: '<ui-view class="shuffle-animation"/>',
                    url: '/customer'
                }
            }
        ];
    }
    ```

    ```javascript
    // routerHelperProvider.js
    angular
        .module('blocks.router')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        this.$get = RouterHelper;

        $locationProvider.html5Mode(true);

        RouterHelper.$inject = ['$state'];
        /* @ngInject */
        function RouterHelper($state) {
            var hasOtherwise = false;

            var service = {
                configureStates: configureStates,
                getStates: getStates
            };

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function getStates() { return $state.get(); }
        }
    }
    ```

###### [Style [Y271](#style-y271)]

  - Définissez les routes pour les vues d'un module à l'endroit où elles existent. Chaque module devrait contenir le routage de ses vues.

    *Pourquoi ?* : Chaque module devrait être indépendant.

    *Pourquoi ?* : Si on ajoute ou enlève un module, on souhaite que l'application ne contienne que des routes qui aboutissent sur des vues existantes.

    *Pourquoi ?* : Cela rend facile l'activation ou la désactivation de portions de l'application sans se préoccuper d'avoir des routes orphelines.

**[Retour en haut de page](#table-des-matières)**

## Automatisation des Tâches
Utilisez [Gulp](http://gulpjs.com) ou [Grunt](http://gruntjs.com) pour créer des tâches automatisées. Gulp favorise le code plutôt que la configuration tandis que Grunt tend vers la configuration plutôt que le code. À titre personnel je préfère Gulp car il me semble plus facile à lire et écrire, mais les deux sont excellents.

> Apprenez-en plus sur Gulp et les *patterns* pour l'automatisation en allant voir [mon cours sur Pluralsight](http://jpapa.me/gulpps)

###### [Style [Y400](#style-y400)]

  - Utilisez l'automatisation des tâches pour lister les fichiers de définition de module `*.module.js` avant tout autre fichier JavaScript de l'application.

    *Pourquoi ?* : Angular a besoin que la définition des modules soit faite avant qu'ils puissent être utilisés.

    *Pourquoi ?* : Nommer les modules avec un pattern spécifique tel que `*.module.js` les rends faciles à aller chercher avec une expression régulière et à les lister.

    ```javascript
    var clientApp = './src/client/app/';

    // Toujours aller chercher les fichiers de module en premier
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Retour en haut de page](#table-des-matières)**

## Filtres

###### [Style [Y420](#style-y420)]

  - Évitez d'utiliser les filtres pour scanner toutes les propriétés de l'arborescence d'un objet complexe. Utilisez les filtres pour sélectionner des propriétés.

    *Pourquoi ?*: les filtres peuvent être sur-utilisés et peuvent avoir des effets négatifs sur les performances s'ils ne sont pas utilisés de façon appropriée. Par exemple, quand un filtre touche un gros objet dont l'arborescence est profonde.

**[Back to top](#table-of-contents)**

## Documentation
Pour tout le reste, allez voir la [documentation de l'API d'Angular](//docs.angularjs.org/api).

## Contribuer

Créez d'abord une *issue* pour discuter de potentiels changements ou ajouts à faire. Si vous avez des questions sur le guide, je vous encourage à les soumettre en temps qu'*issues*. Si vous trouvez des erreurs de frappe, créez une *pull request*. L'idée est de garder le contenu à jour et d'utiliser les fonctionnalités natives de Github pour aider à retracer l'évolution de ce dernier via les *issues* et les *pull requests*, lesquels sont indexées par Google. Pourquoi ? Parce que si vous vous posez une question, il y a des chances que quelqu'un d'autre se la soit posé ! Vous en apprendrez plus ci-dessous pour savoir comment contribuer.

*En contribuant à ce dépôt, vous acceptez de rendre votre contenu accessible en accord avec la licence du dépôt.*

### Processus
    1. Discuter des changements dans une *issue* GitHub.
    2. Ouvrir une *pull request* sur la branche `develop`, référencer l'*issue*, et expliquer le changement et la raison pour laquelle ce changement est pertinent.
    3. La *pull request* sera évaluée et *mergée* ou refusée.

## License

en bref; Utilisez ce guide. Les attributions sont appréciées._

### Copyright

Copyright (c) 2014-2015 [John Papa](http://johnpapa.net)

### (The MIT License)
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**[Retour en haut de page](#table-des-matières)**
