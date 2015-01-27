# Le Guide Stylistique AngularJS

*Le guide d'un certain point de vue stylistique sur AngularJS par [@john_papa](//twitter.com/john_papa)*

Si vous cherchez un guide d'un certain point de vue stylistique pour la syntaxe, les conventions, et la structuration d'application AngularJS, alors vous êtes au bon endroit. Ces styles sont basés sur mon expérience de dévelopement avec [AngularJS](//angularjs.org), mes présentations, [mes cours sur Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) et mon travail au sein des équipes.

>Si vous appréciez ce guide, visitez mon cours [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) sur Pluralsight.

Le but de ce guide stylistique est de proposer des conseils sur le développement d'applications AngularJS en montrant les conventions que j'utilise et, plus important encore, les raisons des choix que j'ai pris.

## Supprématie de la Communauté et Remerciements
Ne jamais travailler dans le vide. J'ai trouvé que la communauté AngularJS est un incroyable groupe dont les membres ont à coeur de partager leurs expériences. Ainsi, un ami et expert AngularJS Todd Motto et moi avons collaboré sur de nombreux styles et conventions. Nous sommes d'accord sur la plupart, et nous divergeons sur d'autres. Je vous encourage à visiter [les guideslines de Todd](https://github.com/toddmotto/angularjs-styleguide) pour vous faire un sentiment sur son approche et en quoi elle est comparable.

De nombreux de mes styles proviennent des maintes scéances de pair programming que [Ward Bell](http://twitter.com/wardbell) et moi avons eu. Même si nous n'étions pas toujours d'accord, mon ami Ward a assurément contribué à influencer l'évolution ultime de ce guide.

## Visualiser les Styles dans une Application d'Exemple
Alors que ce guide explique le *quoi*, le *pourquoi* et le *comment*, il m'a été utile de les visualiser dans la pratique. Ce guide est accompagné par une application d'exemple qui suit ces styles et ces motifs. Vous pouvez trouver l'[application d'exemple (appellée modular) ici](https://github.com/johnpapa/ng-demos) dans le répertoire `modular`. Vous pouvez librement le récupérer, le cloner, ou le dupliquer pour le modifier. [Les instructions pour l'éxécuter sont contenues dans ce readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

## Traductions
[Des traductions de ce guide stylistique Angular](https://github.com/johnpapa/angularjs-styleguide/tree/master/i18n) sont maintenues par la communauté et peuvent être trouvées ici.

## Table des matières

  1. [Responsabilité Unique](#responsabilité-unique)
  1. [IIFE](#iife)
  1. [Modules](#modules)
  1. [Controlleurs](#controlleurs)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Data Services](#data-services)
  1. [Directives](#directives)
  1. [Resolving Promises for a Controller](#resolving-promises-for-a-controller)
  1. [Manual Annotating for Dependency Injection](#manual-annotating-for-dependency-injection)
  1. [Minification and Annotation](#minification-and-annotation)
  1. [Gestion des Exceptions](#gestion-des-exceptions)
  1. [Naming](#naming)
  1. [Application Structure LIFT Principle](#application-structure-lift-principle)
  1. [Application Structure](#application-structure)
  1. [Modularity](#modularity)
  1. [Startup Logic](#startup-logic)
  1. [Angular $ Wrapper Services](#angular--wrapper-services)
  1. [Testing](#testing)
  1. [Animations](#animations)
  1. [Comments](#comments)
  1. [JSHint](#js-hint)
  1. [Constants](#constants)
  1. [File Templates and Snippets](#file-templates-and-snippets)
  1. [AngularJS Docs](#angularjs-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Responsabilité Unique

### La règle de l'unicité
###### [Style [Y001](#style-y001)]

  - Définir 1 composant par fichier.

  L'exemple suivant définit le module `app` et ses dépendances, définit un controlleur, et définit une factory le tout dans le même fichier.

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
### Les Closures JavaScript
###### [Style [Y010](#style-y010)]

  - Encapsuler les composants AngularJS dans une Immediately Invoked Function Expression (IIFE) ou Expression de Fonction Immédiatement Invoquée.

  *Pourquoi ?* : Une IIFE supprime les variables du scope global. Cela aide à éviter que les déclarations de variables et de fonctions ne vivent plus longtemps qu'attendu dans le scope global, ce qui aide aussi à éviter les collisions de variables.

  *Pourquoi ?* : Lorsque votre code est minifié et embarqué dans un unique fichier pour le déploiement dans un serveur de production, vous pouvez avoir des collisions de variables et de nombreuses variables globales. Une IIFE protège contre ces derniers en fournissant un scope de variable pour chaque fichier.

  ```javascript
  /* à éviter */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // la fonction de logger est ajoutée en tant que variable globale
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

  - Note : Pour des raisons de concision seulement, le reste des examples de ce guide peuvent avoir omis la syntaxe IIFE.

  - Note : Les IIFE empêchent le code code de test d'atteindre des membres privés comme des expressions régulières ou des fonctions helper ce qui est bon pour tester unitairement directement indépendamment. Cependant, vous pouvez les tester à travers des membres accessibles ou en les exposant à travers leur propre composant. Par exemple en plaçant des fonctions helper, des expressions régulières ou des constantes dans leur propre factory ou contante.

**[Retour en haut de page](#table-des-matières)**

## Modules

### Éviter les Collisions de Nommage
###### [Style [Y020](#style-y020)]

  - Utilisez des conventions de nommages uniques avec des séparations pour les sous-modules.

  *Pourquoi ?* : Les noms uniques aident à éviter les collisions de nom de module. Les séparateurs aident à définir les modules et leur hiérarchie de sous-modules. Par exemple, `app` pourrait être le module racine tandis que `app.dashboard` et `app.users` serait les modules qui sont utilisés en tant que dépendances de `app`.

### Définitions (i.e. Setters)
###### [Style [Y021](#style-y021)]

  - Déclarer des modules sans variable en utilisant la syntaxe setter.

  *Pourquoi ?* : Avec 1 composant par fichier, on ne devrait pas avoir besoin d'introduire une variable pour le module.

  ```javascript
  /* à éviter */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Utilisez à la place la syntaxe setter simple.

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

### Getters
###### [Style [Y022](#style-y022)]

  - Lorsque vous utilisez un module, évitez d'utiliser une variable en utilisant plutôt le chaînage avec la syntaxe du getter.

  *Pourquoi ?* : Cela produit du code plus lisible et évite les collisions de variable ou les fuites.

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

  - Ne settez qu'une fois et gettez pour toutes les autres instances.

  *Pourquoi ?* : Un module ne devrait être créé qu'une seule fois, et ensuite récupéré à partir de ce point et après.

	  - Utilisez `angular.module('app', []);` pour setter un module.
	  - Utilisez `angular.module('app');` pour getter un module.

### Fonctions Nommées ou Anonymes
###### [Style [Y024](#style-y024)]

  - Utilisez des fonctions nommées au lieu de passer une fonction anonyme comme callback.

  *Pourquoi ?* : Celà produit du code plus lisible, est plus facile à débugguer, et réduit la quantité de code callback imbriqué.

  ```javascript
  /* à éviter */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recommendé */

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

## Controlleurs

### La Syntaxe Vue controllerAs
###### [Style [Y030](#style-y030)]

  - Utilisez la syntaxe [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) au lieu de la syntaxe de `controlleur classique avec $scope`.

	*Pourquoi ?* : Les controlleurs sont constuits, "new-és", and fournissent une unique nouvelle instance, et la syntaxe `controllerAs` est plus proche de celle d'un contructeur Javascript que la `syntaxe $scope classique`.

	*Pourquoi ?* : Il promeut l'usage du binding entre un objet avec "point" et la Vue (ex. `customer.name` au lieu de `name`), ce qui est plus contextuel, plus facile à lire, et évite tout problème de référence qui peut arriver sans "point".

	*Pourquoi ?* : Permet d'éviter l'usage des appels à `$parent` dans les Vues avec des controlleurs imbriqués.

  ```html
  <!-- à éviter -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recommendé -->
  <div ng-controller="Customer as customer">
     {{ customer.name }}
  </div>
  ```

### La Syntaxe de Controlleur controllerAs
###### [Style [Y031](#style-y031)]

  - Utilisez la syntaxe `controllerAs` au lieu de la syntaxe de `controlleur classique avec $scope`.

  - La syntaxe `controllerAs` utilise `this` à l'intérieur des controlleurs qui se font relier au `$scope`.

  *Pourquoi ?* : `controllerAs` est un sucre syntaxique sur le `$scope`. Vous pouvez toujours vous relier à la Vue et toujours accéder aux métodes du `$scope`.

  *Pourquoi ?* : Permet d'éviter la tentation d'utiliser les méthodes du `$scope` à l'intérieur d'un controlleur alors qu'il serait par ailleurs meilleur de les éviter ou de les déplacer dans une factory. Considérez utiliser le `$scope` dans une factory, ou seulement si nécessaire dans un controlleur. Par exemple lorsqu'il faut publier ou souscrire des événements en utilisant [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), ou [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considérez déplacer ces usages dans une factory et les invoquer depuis le controlleur.

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

### controllerAs avec vm
###### [Style [Y032](#style-y032)]

  - Utilisez une variable de capture pour `this` quand vous utilisez la syntaxe `controllerAs`. Choisissez un nom de variable consistant tel que `vm`, qui signifie ViewModel.

  *Pourquoi ?* : Le mot clé `this` est contextuel et son utilisation au sein d'une fonction à l'intérieur d'un controlleur pourrait changer son contexte. Capturer le contexte de `this` évite de rencontrer ce problème.

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

  Note : Vous pouvez évitez n'importe quel avertissement [jshint](http://www.jshint.com/) en plaçant le commentaire ci-dessous au dessus de la ligne de code. Cependant, ce n'est pas nécesaire lorsque la fonction est nommée en utilisant la CasseEnMajuscule, puisque cette convention signifie que c'est une fonction constructeur, ce qu'est un controlleur en Angular.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Note : Lors de la création de watchs dans un controlleur en utilisant `controller as`, vous pouvez watcher les membres `vm.*` en utilisant la syntaxe suivante. (Créez des watchs avec prudence puisqu'ils ajoutent plus de charge au cycle de digest.)

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

### Les Membres Bindable au Début
###### [Style [Y033](#style-y033)]

  - Placez les membres bindables au début du controlleur, par ordre alphabétique, et non pas dispersés à travers le code du controlleur.

  *Pourquoi ?* : Placer les membres bindables au début permet de faciliter la lecture et vous aide à identifier instantanément quels membres du controlleur peut être bindé et utilisés dans la Vue.

  *Pourquoi ?* : Placer les fonction anonymes sur la même ligne peut être facile, mais lorsque ces fonctions ont plus d'une ligne de code elles peuvent réduire la lisibilité. Définir les fonctions sous les membres bindables (les fonctions seront hissées) déplace les détails d'implémentation en bas, guardant les membres bindables en haut,
  Setting anonymous functions in-line can be easy, but when those functions are more than 1 line of code they can reduce the readability. Defining the functions below the bindable members (the functions will be hoisted) moves the implementation details down, keeps the bindable members up top, and makes it easier to read.

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

    ![Les Controlleur Utilisant "Au dessus de la Réduction"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-1.png)

  Note : Si la fonction est un one-liner, considérez de la garder bien en haut, tant que la lisibilité n'est pas affectée.

  ```javascript
  /* à éviter */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * lines
           * of
           * code
           * affects
           * readability
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recommandé */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // Le one-liner est acceptable
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Déclaration de Fonctions pour Cacher les Détails d'Implémentation
###### [Style [Y034](#style-y034)]

  - Utilisez les déclarations de fonctions pour cacher les détails d'implémentation. Gardez vos membres bindables tout en haut. Quand vous avez besoin de binder une fonction dans un controlleur, faites-la pointer vers la déclaration de la fonction plus bas dans le fichier. Ceci est directement lié à la section des Membres Bindable au Début. Pour plus de détails, vous pouvez lire [cet article](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Pourquoi ?* : Placer les membres bindables en haut rend plus facile la lecture et vous aide instantanément à identifier quels membres du controlleur peuvent être bindés et utilisés dans la Vue. (Même chose que plus haut.)

    *Pourquoi ?* : Placer les détails d'implémentation d'une fonction plus bas dans le fichier déplace cette complexité en dehors du regard ainsi vous pouvez ne voir que les choses importantes en haut.

    *Pourquoi ?* : Les déclarations de fichiers sont remontées donc il n'y a aucun problème à utiliser une fonction avant qu'elle ne soit définie (alors que ça le serait avec les expressions de fonction).

    *Pourquoi ?* : Vous ne vous préocuperez plus des déclarations de fonctions déplaçant `var a` avant `var b` cassant ainsi votre code car `a` dépend de `b`.

    *Pourquoi ?* : L'ordre est critique avec les expressions de fonction

  ```javascript
  /**
   * à éviter
   * L'utilisation des expressions de fonction.
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

  Remarquez que les choses importantes sont dispersées dans l'exemple précédent. Dans l'exemple ci-dessous, remarquez que les choses importantes sont tout en haut. Par exemple, les membres bindés au controlleur tels que `vm.avengers` et `vm.title`. Les détails d'implémentation sont plus bas dessous. C'est simplement plus facile à lire.

  ```javascript
  /*
   * recommandé
   * L'utilisation des déclarations de fonction
   * et les membres bindables tout en haut.
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

### Déplacer la Logique des Controlleurs
###### [Style [Y035](#style-y035)]

  - Déplacer la logique d'un controlleur en la déléguant à des services et des factories. 
  
    *Pourquoi ?* : La logique peut être ré-utilisée par plusieurs controlleurs lorsqu'elle est placée au sein d'un service et exposée via une fonction.

    *Pourquoi ?* : La logique d'un service peut plus facilement être isolée dans un test unitaire, tandis que la logique d'appel dans le controlleur peut facilement être mockée.

    *Pourquoi ?* : Cela supprime des dépendances et cache les détails d'implémentation au controlleur.

  ```javascript

  /* à éviter */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
          var settings = {};
          // Obtenir l'URL de base du service credit à partir de la config
          // Positionne les headers requis pour le service credit
          // Prépare l'URL query string ou l'objet de données avec les données de requête.
          // Ajoute les infos d'identification de l'utilsiateur afin que le service obtienne
          // les bons droits de limite credit pour cet utilisateur.
          // Utilise JSONP pour ce navigateur s'il ne supporte pas CORS
          return $http.get(settings)
              .then(function(data) {
	         // Décompresse les données JSON dans l'objet réponse
	         // afin de rechercher maxRemainingAmount
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Interpréter l'erreur
                 // Gérer le timeout ? Réessayer ? Essayer un service alternatif ?
                 // Re-rejetter avec une erreur appropriée à la vue de l'utilisateur
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

### Gardez des Controlleurs Focalisés
###### [Style [Y037](#style-y037)]

  - Définir un controlleur pour une vue, et n'essayez pas de ré-utiliser le controlleur pour d'autres vues. Au lieu de cela, déplacez la logique réutilisable vers des factories et gardez le controlleur simple et focalisé sur sa vue.

    *Pourquoi ?*: La réutilisation de controlleurs sur plusieurs vues est fragile et une bonne couverture de tests de bout en bout ("end to end" ou "e2e") est requise afin d'assurer la stabilité dans les grosses applications.

### Assigner les Controlleurs
###### [Style [Y038](#style-y038)]

  - Lorsqu'un controlleur doit être associé à une vue et qu'un composant pourrait être ré-utilisé par d'autres controlleurs ou vues, définissez les controlleurs avec leurs routes.

    Note : Si une Vue est chargée via d'autres moyens que la route, alors utilisez la syntaxe `ng-controller="Avengers as vm"`.

    *Pourquoi ?* : Associer le controlleur dans la route permet que différentes routes invoquent d'autres paires de controlleurs et vues. Lorsque les controlleurs sont assignés dans la vue avec [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), cette vue est toujours associée avec le même controlleur.

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

**[Retour en haut de page](#table-of-contents)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - Les Services sont instanciés avec le mot clé `new`, utilisez `this` pour les méthodes publiques et les variables. Puisque ces derniers sont tellement similaires aux factories, utilisez à la place une factory pour la cohérence.

    Note : [Tous les serices AngularJS services sont des singletons](https://docs.angularjs.org/guide/services). Celà signifie qu'il n'y a qu'une seule instance d'un service donné par injecteur.

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

**[Retour en faut de page](#table-of-contents)**

## Factories

### Responsabilité Unique
###### [Style [Y050](#style-y050)]

  - Les factories ne devraient avoir qu'une [unique responsabilité](http://en.wikipedia.org/wiki/Single_responsibility_principle), c'est-à-dire encapsulé par son contexte. Une fois qu'une factory commence à dépasser ce but unique, une nouvelle factory devrait être créée.

### Singletons
###### [Style [Y051](#style-y051)]

  - Les factories sont des singletons et renvoient un objet qui contient les membres du service.

    Note : [Tous les services AngularJS sont des singletons](https://docs.angularjs.org/guide/services).

### Membres Accessibles Tout en Haut
###### [Style [Y052](#style-y052)]

  - Exposer les membres appellables du services (son interface) en haut, utilisant une technique dérivée du Principe du Module Révélateur ou [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *Pourquoi ?* : Placer les membres appellables tout en haut le rend facile à lire et vous aide à identifier instantanément quels membres du service peut être appellé et doit être testé unitairement (et/ou mocké).

    *Pourquoi ?* : Ceci est spécialement conseillé lorsque le fichier devient un peu long et celà aide à éviter le besoin de faire défiler pour voir ce qui est exposé.

    *Pourquoi ?* : Placer les fonctions au fil de l'écriture semble être facile, mais quand ces fonctions ont plus d'une ligne de code, elles peuvent réduire la lisibilité et causer plus de défilement. Définir l'interface à appeller via le service renvoyé déplace les détails d'implémentation plus bas, garde l'interface appellante tout en haut, et rend le tout plus facile à lire.

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

  De cette façon, les bindings sont dupliqués à travers l'objet hôte, les valeurs primitives ne peuvant se mettre à jour toutes seules grâce au principe du module révélateur.

    ![Factories Utilisants "Au dessus du Pliage"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Déclaration de Fonctions pour Cacher les Détails d'Implémentation
###### [Style [Y053](#style-y053)]

  - Utilisez les déclarations de fonction pour cacher les détails d'implémentation. Gardez les membres accessibles de la factory tout en haut. Faites-les pointer vers les déclarations de fonction qui apparaissent plus loin dans le fichier. Pour plus de détails, voir [ce post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Pourquoi ?* : Placer les membres accessibles tout en haut permet de le rendre facile à lire et vous aide à identifier instantanément quelles fonctions de la factory vous pouvez accéder de l'extérieur.

    *Pourquoi ?* : Placer les détails d'implémentation d'une fonction plus loin dans le fichier déplace cette complexité en dehors de la vue afin de voir les choses importantes tout en haut.

    *Pourquoi ?* : Les déclarations de fonctions sont hissées de telle sorte qu'il n'y ait aucun soucis à utiliser une fonction avant qu'elle ne soit définie (comme il serait de mise avec les expressions fonctionnelles).

    *Pourquoi ?* : Vous n'aurez plus jamais à vous en faire avec les déclarations de fonction dont le déplacement de `var a` avant `var b` pourrait casser votre code à cause d'une dépendance de `a` vers `b`.

    *Pourquoi ?* : L'ordre est critique avec les expressions fonctionnelles.

  ```javascript
  /**
   * À éviter
   * L'utilisation des expressions fonctionnelles
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // avec les détails d'implémentation ici
      };

      var getAvengerCount = function() {
          // avec les détails d'implémentation ici
      };

      var getAvengersCast = function() {
         // avec les détails d'implémentation ici
      };

      var prime = function() {
         // avec les détails d'implémentation ici
      };

      var ready = function(nextPromises) {
          // avec les détails d'implémentation ici
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
   * L'utilisation des déclararions de fonction
   * et des membres accessibles tout en haut.
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
         // avec les détails d'implémentation ici
      }

      function getAvengerCount() {
          // avec les détails d'implémentation ici
      }

      function getAvengersCast() {
         // avec les détails d'implémentation ici
      }

      function prime() {
          // avec les détails d'implémentation ici
      }

      function ready(nextPromises) {
          // avec les détails d'implémentation ici
      }
  }
  ```

**[Retour en haut de page](#table-des-matières)**

## Services de Données

### Séparer les Appels de Données
###### [Style [Y060](#style-y060)]

  - Refactorer la logique pour faire les opérations sur les données et les interactions avec la donnée dans une factory. Rendez les services de données responsables des appels ajax, du local storage, du stockage en mémoire, ou toute autre opérations sur les données.

    *Pourquoi ?* : La responsabilité du controlleur est la présentation et l'assemblage des informations pour la vue. Il ne devrait pas se soucier de la façon dont la donnée est récupérée, mais seulement de la façon de la demander. Séparer des services de données déplace la logique du 'comment récupérer une donnée' dans ce service de donnée, et laisse le controlleur plus simple et plus focalisé sur la vue.

    *Pourquoi ?* : Cela le rend plus facile à tester (en mockant ou avec le vrai) les appels aux données lorsque l'on teste un controlleur qui utilise un service de données.

    *Pourquoi ?* : L'implémentation d'un service de données peut avoir du code très spécifique pour gérer le référentiel des données. Celà peut inclure des entêtes, la façon de dialoguer avec la donnée, ou des dépendances vers d'autres services tels que $http. La séparation de la logique vers un service de données encapsule cette logique dans un unique endroit en cachant les détails d'implémentation du consommateur externe (peut-être un controlleur), en rendant également plus simple les changements d'implémentation.

  ```javascript
  /* Recommandé */

  // une factory service de données
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

    Note : Le service de données est appellé depuis des consommateurs, tels que des controlleurs, en leur cachant l'implémentation, comme le montre l'éxemple ci-dessous.

  ```javascript
  /* Recommandé */

  // un controlleur qui appelle la factory du service de données
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

### Retourner une promesse depuis un appel de donnée
###### [Style [Y061](#style-y061)]

  - Lorsqu'un service de données retourne une promesse telle que $http, retournez une promesse dans votre fonction appelée.

    *Pourquoi ?* : Vous pouvez chainer les promesses entre elles et ajouter des actions après que l'appel des données soit terminé puis résoudre ou rejeter la promesse.

  ```javascript
  /* recommandé */

  activate();

  function activate() {
      /**
       * Etape 1
       * Appel la fonction getAvengers pour récupérer
       * les données avenger et attend la promesse
       */
      return getAvengers().then(function() {
          /**
           * Etape 4
           * Exécute une action à la résolution de la promesse finale
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Etape 2
         * Appel du service de données pour récupérer les données
         * et attend la promesse
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Etape 3
                 * Défini les donnée et résoue la promesse
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Retour en haut de page](#table-des-matières)**

## Directives
### Limite de 1 Par Fichier
###### [Style [Y070](#style-y070)]

  - Créer une directive par fichier. Nommer le fichier en fonction de la directive.

    *Pourquoi ?* : C'est facile de placer toutes les directives dans un fichier, mais difficile de les séparer, certains sont partagés par toute l'application, certain par modules, et certain juste par un module.

    *Pourquoi ?* : Une directive par fichier est plus facilement maintenable.

  ```javascript
  /* à éviter */
  /* directives.js */

  angular
      .module('app.widgets')

      /* directive order spécifique pour le module order */
      .directive('orderCalendarRange', orderCalendarRange)

      /* directive sales pouvant être utilisée n'importe où dans l'application sales */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* directive spinner pouvant être utilisée n'importe où dans l'application */
      .directive('sharedSpinner', sharedSpinner);


  function orderCalendarRange() {
      /* détails de l'implémentation */
  }

  function salesCustomerInfo() {
      /* détails de l'implémentation */
  }

  function sharedSpinner() {
      /* détails de l'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* calendarRange.directive.js */

  /**
   * @desc directive order spécifique pour le module order pour la compagnie Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* détails de l'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* customerInfo.directive.js */

  /**
   * @desc directive sales pouvant être utilisée n'importe où dans l'application sales pour la compagnie Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* détails de l'implémentation */
  }
  ```

  ```javascript
  /* recommandé */
  /* spinner.directive.js */

  /**
   * @desc directive spinner pouvant être utilisée n'importe où dans l'application pour la compagnie Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* détails de l'implémentation */
  }
  ```

    Note : Il y a plusieurs options de nommage pour les directives, puisqu'elles peuvent être utilisé par des scopes plus ou moins larges. Choisissez un nom qui rend la directive et son fichier clair et distinct. Des exemples sont définis plus bas, mais regarder la section des noms pour plus de recommandations.

### Manipuler le DOM dans une Directive
###### [Style [Y072](#style-y072)]

  - Quand le DOM est directement manipulé, utilisez une directive. Si une alternative peut être utilisé avec le CSS pour définir le style ou les [services d'animation](https://docs.angularjs.org/api/ngAnimate), les templates Angular , [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) ou [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), mieux vaut les utiliser à la place. Par exemple, si la directive affiche ou cache un élément, utilisez ngHide/ngShow.

    *Pourquoi ?* : La manipulation du DOM peut être difficile à tester, debugger, et il y a souvent une meilleure façon de faire (e.g. CSS, animations, templates)

### Fournir un Unique Préfixe de Directive
###### [Style [Y073](#style-y073)]

  - Definissez un préfixe de directive court, unique et descriptif tel que `acmeSalesCustomerInfo` et déclaré en HTML comme `acme-sales-customer-info`.

    *Pourquoi ?* : Le préfixe court et unique identifie le contexte et l'origine de la directive. Par exemple, un préfixe `cc-` peut indiquer que la directive fait partie de l'application CodeCamper alors que `acme-` peut indiquer une directive de la companie Acme.

    Note : Evitez `ng-` car il est réservé pour les directives AngularJS. Cherchez les directives largement utilisées pour éviter les conflits de nom, tel que `ion-` pour le [Framework Ionic](http://ionicframework.com/).

### Restreindre aux Éléments et aux Attributs
###### [Style [Y074](#style-y074)]

  - Lors de la création d'une directive qui fait du sens comme élément indépendant, permettez la restriction `E` (élément personnalisé) et éventuellement la restriction `A` (attribut personnalisé). En général, s'il devrait avoir son propre contrôle, `E` est le plus indiqué. Le conseil le plus général est de permettre `EA` mais se dirige vers une implémentation en tant qu'élément lorsqu'il est indépendant et en tant qu'attribut lorsqu'il améliore un élément DOM existant.

    *Why?* : Ça fait sens.

    *Why?* : Même s'il est autorisé d'utiliser une directive en tant que classe, si la directive agit vraiement comme un élément, elle fait plus de sens en tant qu'élément ou au moins en tant qu'attribut.

    Note : EA est la valeur par défaut avec AngularJS 1.3 +

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

### Directives et ControllerAs
###### [Style [Y075](#style-y075)]

  - Utilisez la syntaxe `controller as` avec une directive pour être cohérent avec l'utilisation de `controller as` pour l'association de la vue et du controlleur.

    *Pourquoi ?* : Ça fait sens et ce n'est pas difficile.

    Note : La directive ci-dessous démontre une façon parmis d'autres d'utiliser le scope à l'intérieur de la fonction link et dans un controlleur de directive, par l'utilisation de controllerAs. J'ai in-liné le template que pour le mettre au même endroit.

    Note : Concernant l'injection de dépendance, voir [Identifier Manuellement les Dépendances](#manual-annotating-for-dependency-injection).

    Note : Remarquez que le controlleur de la directive est à l'extérieur de la closure de la directive. Cette façon de faire évite le problème des injections plus disponibles après le `return`.

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
          controllerAs: 'vm'
      };

      return directive;

      function linkFunc(scope, el, attr, ctrl) {
          console.log('LINK: scope.max = %i', scope.max);
          console.log('LINK: scope.vm.min = %i', scope.vm.min);
          console.log('LINK: scope.vm.max = %i', scope.vm.max);
      }
  }

  ExampleController.$inject = ['$scope'];

  function ExampleController($scope) {
      // Injection du $scope seuelement pour la comparaison
      var vm = this;

      vm.min = 3;
      vm.max = $scope.max;
      console.log('CTRL: $scope.max = %i', $scope.max);
      console.log('CTRL: vm.min = %i', vm.min);
      console.log('CTRL: vm.max = %i', vm.max);
  }
  ```

  ```html
  /* example.directive.html */
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[Retour en haut de la page](#table-des-matieres)**

## Resolving Promises for a Controller

### Promesses d'Activation du Controller
###### [Style [Y080](#style-y080)]

  - Résolvez la logique de démarrage d'un controlleur dans une fonction `activate`.

    *Pourquoi ?* : Placer la logique de démarrage toujours au même endroit permet de le rendre plus facile à localiser, plus cohérent à tester, et permet d'éviter la dispersion de la logique d'activation à travers le controlleur.

    Note : Si vous avez besoin d'annuler sous conditions la route avant de vous mettre à utiliser le controlleur, utilisez une résolution de route à la place.

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

### Promesses de Résolution de Route
###### [Style [Y081](#style-y081)]

  - Lorsqu'un controlleur dépend d'une promesse qui doit être résolue, résolvez ces dépendances dans le `$routeProvider` avant que la logique du controlleur soit éxécutée. Si vous avez besoin d'annuler une route sous certaines conditions avant que le controlleur soit activé, utilisez un resolver de route.

    *Pourquoi ?* : Un controlleur pourrait avoir besoin de données avant qu'il se charge. Cette donnée pourrait venir d'une promesse via une factory personnalisée ou de  [$http](https://docs.angularjs.org/api/ng/service/$http). Utiliser une [resolution de route](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) permet à la promesse de se résoudre avant que la logique du controlleur s'éxécute, ainsi on peut prendre des actions basées sur cette donnée à partir de la promesse.

  ```javascript
  /* à éviter */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // non-résolue
      vm.movies;
      // résolue de façon asynchrone
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

    Note : Les dépendances dans l'exemple de code sur `movieService` ne sont pas directement compatibles avec la minification. Pour les détails sur la façon de rendre ce code compatible avec la minification, voir la section sur l'[injection de dépendance](#manual-annotating-for-dependency-injection) et sur [la minification et les annotations](#minification-and-annotation).

**[Retour en haut de page](#table-of-contents)**

## Annoter Manuellement pour l'Injection de Dépendances

### Non Sur pour la Minification
###### [Style [Y090](#style-y090)]

  - Eviter l'utilisation de la syntaxe raccourcie de déclaration des dépendances sans utiliser une approche sûre pour la minification.

    *Pourquoi ?* : Les paramètres du composant (ex: controlleur, factory, etc.) seront converties en variables mutilées. Par exemple, ˋcommonˋet ˋdataserviceˋ deviendraient ˋaˋet ˋbˋ et ne seraient pas trouvées par AngularJS.

    ```javascript
    /* à éviter - non sûr pour la minification */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Ce code pourrait produire des variables mutilées après minification et en cela provoquer des erreurs à l'éxécution.

    ```javascript
    /* à éviter - non sûr pour la minification */
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Identifier Manuellement les Dépendances
###### [Style [Y091](#style-y091)]

  - Utilisez ˋ$injectˋpour identifier manuellement vos dépendances de composants AngularJS.

    *Pourquoi ? * : Cette technique est la même que celle utilisée par [`ng-annotate`](https://github.com/olov/ng-annotate), que je recommande pour automatiser la création de dépendances sûres pour la minification. Si ˋng-annotateˋ détecte que l'injection a déjà été faite, celà ne la dupliquera pas.

    *Pourquoi ?* : Ca préserve vos dépendances d'être vulnérable aux problèmes de minification lorsque les paramètres sont mutilés. Par exemple, ˋcommonˋet ˋdataserviceˋpourraient devenir ˋaˋ et ˋbˋ et ne pas être trouvés par AngularJS.

    *Pourquoi ?* : Eviter de créer en ligne une longue liste de dépendances peut rendre le tableau difficile à lire. De même, il peut entraîner une confusion dans la mesure où le tableau est une série de chaînes de caratères alors que le dernier élément est le nom de la fonction du composant.

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

    Note : Lorsque votre fonction est sous une instruction de return, le $inject peut ne pas être accessible (cela pourrait arriver dans une directive). Vous pouvez résoudre ça soit en déplaçant le $inject au dessus de l'instruction de return soit en utilisant la syntaxe d'injection avec le tableau.

    Note : [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) a introduit une fonctionnalité où il déplace le ˋ$injectˋ là où il devient accessible.

    ```javascript
    // à l'intérieur d'une définition de directive
    function outer() {
        return {
            controller: DashboardPanel,
        };

        DashboardPanel.$inject = ['logger']; // Unreachable
        function DashboardPanel(logger) {
        }
    }
    ```

    ```javascript
    // à l'intérieur d'une définition de directive.
    function outer() {
        DashboardPanel.$inject = ['logger']; // reachable
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Identifier Manuellement les Dépendances du Route Resolver
###### [Style [Y092](#style-y092)]

  - Utilisez $inject pour identifier manuellement vos dépendances du route resolver pour les composants AngularJS.

    *Pourquoi ?* : Cette technique divise la fonction anonyme pour le route resolver, la rendant plsu facile à lire.

    *Pourquoi ?* : Une instruction `$inject` peut facilement précéder le resolver à manipuler rendant n'importe quelle dépendance sûre à la minification.

    ```javascript
    /* recommandé */
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'Avengers',
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

**[Retour en haut de page](#table-des-matieres)**

## Minification et Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Utilisez [ng-annotate](//github.com/olov/ng-annotate) pour [Gulp](http://gulpjs.com) ou [Grunt](http://gruntjs.com) et commentez les fonctions qui nécessitent l'injection de dépendances automatique en utilisant `/** @ngInject */`.

    *Pourquoi ?* : Ca préserve votre code de n'importe quelle dépendance qui pourrait ne pas utiliser les pratiques sûres à la minification.

    *Pourquoi ?*: [`ng-min`](https://github.com/btford/ngmin) est déprécié.

    >Je préfère Gulp car ça me paraît plus facile à écrire, lire et débugger.

    Le code suivant n'utilise pas de dépendances sûres à la minification.

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

    Lorsque le code ci-dessus est éxécuté par ng-annotate il produira le résultat suivant avec l'annotation ˋ$injectˋ et deviendra sûr à la minification.

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

    Note : Si ˋng-annotateˋ détecte que l'injection a déjà été faite (ex : ˋ@ngInjectˋ a été détécté), il ne dupliquera pas le code ˋ$injectˋ.

    Note : Lors de l'utilisation d'un route resolver, vous pouvez préfixer la fonction de résolution avec `/* @ngInject */` et cela produira le code proprepement annoté, en gardant toute dépendance injectée sûre à la minification.

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

    > Note : A partir d'AngularJS 1.3, utilisez le paramètre ˋngStrictDiˋ de la directive [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp). Avec ce paramètre, l'injecteur sera créé en mode "strict-di" qui rendra fera échouer les invocations de fonctions de l'application qui n'utilisent pas explicitement les annotation de fonction (ceci peut ne pas être sûr à la minification). Débugger les informations qui seront logguées dans la console peut aider à débusquer le code à l'origine.
    `<body ng-app="APP" ng-strict-di>`

### Utilisation de Gulp ou Grunt pour ng-annotate
###### [Style [Y101](#style-y101)]

  - Utilisez [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) ou [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) dans une tâche de build automatisée. Injectez `/* @ngInject */` avant toute fonction qui possède des dépendances.

    *Pourquoi ?* : ng-annotate va intercepter la plupart des dépendances, mais parfois va nécessiter des indices grâce à l'utilisation de la syntaxe `/* @ngInject */ˋ.

    Le code ci-dessous est un exemple d'une tâche gulp qui utilise ngAnnotate

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

### decorateurs
###### [Style [Y110](#style-y110)]

  - Utilisez un [decorateur](https://docs.angularjs.org/api/auto/service/$provide#decorator), au moment de la configuration en utilisant le service [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), sur le service [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) pour effecture des actions personnalisées lorsque des exceptions se produisent.

    *Pourquoi ?* : Fournir un moyen cohérent pour gérer les exceptions non interceptées d'AngularJS pendant le développement ou à l'éxécution.

    Note : Une autre possibilité serait de surcharger le service au lieu d'utiliser un décorateur. C'est une bonne possibilité, mais si vou voulez garder le comportement par défaut et l'étendre, un décorateur est plus approprié.

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
             * ajouter les erreurs au $rootScope, loguer les erreurs vers un serveur distant,
             * ou loguer locallement. Ou rejetter directement. C'est entièrement votre choix.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  	```

### Catcher d'Exceptions
###### [Style [Y111](#style-y111)]

  - Créer une factory qui expose une interface pour attraper et gérer correctement les exceptions.

    *Pourquoi ?* : Fournir un moyen cohérent pour gérer les exception qui peuvent être déclenchées dans votre code (par example, pendant un appel Ajax ou lors d'un échec d'une promesse).

    Note : Le catcher d'axception est bon pour attraper et réagir à des exceptions spécifiques provenant d'appels dont vous savez qu'elles sont déclenchées. Par exemple, lorsque on fait un appel Ajax pour récuppérer des données d'un serveur distant et que vous voulez attraper n'importe quelles exceptions provenant de ce service uniquement et réagir seulement à celui-ci.

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

### Erreurs de Routage
###### [Style [Y112](#style-y112)]

  - Gérez et loguez toute erreur de routage en utilisant [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Pourquoi ?* : Fournir un moyen cohérent de gérer les erreurs de routage.

    *Pourquoi ?* : Fournir potentiellement une meilleure expérience utilisateur si une erreur de routage se produit et les rediriger vers un écran convivial avec plus de détails ou les possibilités de s'en sortir.

    ```javascript
    /* recommandé */
    function handleRoutingErrors() {
        /**
         * Annulation du routage:
         * Sur une erreur de routage, aller au dashboard.
         * Fournir une clause de sortie s'il essaye de le faire deux fois.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                /**
                 * Loguer éventuellement en utilisant un service personnalisé ou $log.
                 * (N'oubliez pas d'injecter votre service personnalisé)
                 */
                logger.warning(msg, [current]);
            }
        );
    }
    ```

**[Retour en haut de page](#table-des-matieres)**

## Nommage

### Règles de Nommage
###### [Style [Y120](#style-y120)]

  - Utilisez des noms cohérents pour tous les composants en utilisant un pattern qui décrit la fonctionnalité de ce composant puis (éventuellement) son type. Le pattern que je recommande est `fonctionnalité.type.js`. Il y a 2 noms pour la plupart des resources:
    *   le nom du fichier (`avengers.controller.js`)
    *   le nom du composant déclaré à Angular (`AvengersController`)

    *Pourquoi ?* : Les conventions de nommage donnent une façon cohérente de s'y retrouver en un clin d'oeil. La cohérence dans tout le projet est vitale. La cohérence au sein de l'équipe est importante. La cohérence dans l'entreprise apporte une efficacité redoutable.

    *Pourquoi ?* : Les conventions de nommage doivent simplement vous aider à naviguer dans le code plus vite et le rendre plus facile à comprendre.

### Nom des Fichiers de Fonctionnalités
###### [Style [Y121](#style-y121)]

  - Utilisez des noms cohérents pour tous les composants qui suivent un pattern qui décrit la fonctionnalité d'un composant et (éventuellent) son type. Le pattern que je recommande est `fonctionnalité.type.js`.

    *Pourquoi ?* : Offre une façon cohérente d'identifier rapidement les composants.

    *Pourquoi ?* : Fournit un pattern matching pour automatiser des tâches.

    ```javascript
    /**
     * possibilités couramment rencontrées.
     */

    // Controlleurs
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

    // controlleurs
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

  Note : Une autre convention courante consiste à nommer les fichiers de controlleurs sans le mot `controller` dans le nom de fichier comme `avengers.js`au lieu de `avengers.controller.js`. Toutes les autres conventions étant maintenues avec un suffixe par type. Les controlleurs étant les les types de composant les plus courants, ça permet d'économiser la frappe au clavier tout en étant facilement identifiable. Je vous conseille de choisir une convention et de vous y tenir dans toute l'équipe.

    ```javascript
    /**
     * recommandé
     */
    // Controlleurs
    avengers.js
    avengers.spec.js
    ```

### Nommage des Fichiers de Test
###### [Style [Y122](#style-y122)]

  - Les spécifications du nommage des tests est similaire à celui du composant qu'il teste avec un suffixe `spec`.

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement les composants.

    *Pourquoi ?* : Permet le pattern matching pour [karma](http://karma-runner.github.io/) ou d'autres moteurs de tests.

    ```javascript
    /**
     * recommandé
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Nommage des Controlleurs
###### [Style [Y123](#style-y123)]

  - Utilisez des noms cohérents pour tous les controlleurs nommés d'après leur fonctionnalité. Utilisez le CamelCaseEnMajuscule, puisque ce sont des constructeurs.

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement et de référencer les controlleurs.

    *Pourquoi ?* : Le CamelCaseEnMajuscules est la convention pour identifier les objets qui peuvent être instanciés avec un controleur.

    ```javascript
    /**
     * recommandé
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```

### Suffixe des Noms de Controlleurs
###### [Style [Y124](#style-y124)]

  - Ajoutez au nom du controlleur le suffixe ˋControllerˋ ou pas de suffixe du tout. Choississez une des deux conventions, pas les deux à la fois.

    *Pourquoi ?* : Le suffixe ˋControllerˋ est utilisé souvent et il est plus explicitement descriptif.

    *Pourquoi ?* : Omettre le suffixe est plus succint et le controlleur est souvent facilement identifiable même sans le suffixe.

    ```javascript
    /**
     * recommandé: Option 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers(){ }
    ```

    ```javascript
    /**
     * recommandé: Option 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Nommage des Factory
###### [Style [Y125](#style-y125)]

  - Utilisez des noms cohérents pour toutes les foactories nommées d'après la fonctionnalitée. Utilisez le camel-case pour les services et les factories.

    *Pourquoi ?* : Fournit une façon cohérente d'identifier rapidement et de référencer les factories.

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

### Nommage des Directives de Composants
###### [Style [Y126](#style-y126)]

  - Utilisez des noms cohérents pour toutes les directives en utilisant le camel-case. Utilisez un préfixe court pour décrire le domaine à laquelle les directives appartiennent (exemples : préfixe de la société ou préfixe du projet).

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

  - Lorqu'il y a de multiples modules, le fichier du module principal est nommé ˋapp.module.jsˋ tandis que les autres modules dépendants sont nommés d'après ce qu'ils représentent. Par exemple, un module d'admin est nommé ˋadmin.module.jsˋ. Les noms des modules déclarés seraient respectivement ˋappˋ et ˋadminˋ.

    *Pourquoi ?* : Fournit de la cohérence pour les applications multi-modules, et pour les applications qui grossissent.

    *Pourquoi ?* : Fournit une façon aisée d'utiliser l'automatisation des tâches afin de charger toutes les définitions de modules en premier, puis ensuite tous les autres fichiers angular (pour l'assemblage).

### Configuration
###### [Style [Y128](#style-y128)]

  - Séparer la configuration d'un module dans son propre fichier nommé d'après le module. Un fichier de configuration du module principal ˋappˋ est nommé ˋapp.config.jsˋ (ou simplement ˋconfig.jsˋ). Une configuration pour un module nommé ˋadmin.module.jsˋ est nommé ˋadmin.config.jsˋ.

    *Pourquoi ?* : Sépare la configuration de la définition du module, du composant et du code actif.

    *Pourquoi ?* : Fournit un endroit bien identifié pour mettre la configuration d'un module.

### Routes
###### [Style [Y129](#style-y129)]

  - Séparez la configuration de la route dans son propre fichier. Un exemple pourrait être ˋapp.route.jsˋ pour le module principal et ˋadmin.route.jsˋ pour le module d'ˋadminˋ. Même pour de petites applications, il est préférable de privilégier cette séparation du reste de la configuration.

**[Retour en haut de page](#table-des-matières)**

## Le Principe LIFT de Structuration de l'Application
### LIFT
###### [Style [Y140](#style-y140)]

  - Structurez votre application afin de pouvoir `L`ocaliser le code plus rapidement, `I`dentifier le code d'un seul coup, garder la structure la plus platte possible (`F`lattest), et essayez (`T`ry) de rester DRY (Don't Repeat Yourself). La structure doit suivre ces 4 règles de bases.

    *Pourquoi LIFT ?* : Fournit une structure cohérente qui passe bien à l'échelle, qui est modulaire, et facilite l'augmentation de l'efficacité du développeur. Une autre façon de valider la structure de votre application est de vous demander : à quelle vitesse vous pouvez ouvrir et travailler dans tous les fichiés liés à une fonctionnalité ?

    Lorsque je trouve que ma structure n'est pas confortable, je reviens en arrière et je revisite les règles LIFT.

    1. `L`ocaliser le code est facile
    2. `I`dentifier le code d'un coup
    3. `F`lat (platte) structure autant que possible
    4. `T`ry (essayer) de rester DRY (Don’t Repeat Yourself, Ne Pas Se Répéter) ou T-DRY

### Localisation
###### [Style [Y141](#style-y141)]

  - Rendez la localisation du code intuitive, simple et rapide.

    *Pourquoi ?* : Je trouve que c'est super important pour un projet. Si l'équipe ne peut pas trouver rapidement les fichiers sur lesquels elle doit travailler, ils ne vont pas être en mesure de travailler aussi efficacement que possible, et la structure devra changer. Vous ne connaissez peut-être pas le nom du fichier où la position des fichiers liés, alors les placer dans les endroits les plus intuitifs et proches les uns les autres permet de gagner un paquet de temps. Une structure de répertoire descriptive peut aider à ça.

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

  - Lorsque vous regardez un fichier vous devriez instantanément savoir ce qu'il contient ce qu'il représente.

    *Pourquoi ?* : Vous passez moins de temps à fouiller et vous perdre pour cherche le code, et devenez de plus en plus efficient. Si ça implique des noms de fichier plus long, alors d'accord. Soyez descriptif avec les noms de fichier et leur contenu ne doit contenir exactement qu'un seul composant. Éviter les fichier avec plusieurs controlleurs, plusieurs services, ou un mélange. On pourrait admettre une exception à cette règle si j'ai un ensemble de fonctionnalités très petites qui sont toutes reliées entre elles, elles sont toujours facilement identifiables.

### Plat
###### [Style [Y143](#style-y143)]

  - Gardez une structure de répertoire à plat le plus longtemps possible. Lorsque vous avez 7 fichiers ou plus, commencez à penser à séparer.

    *Pourquoi ?* : Personne ne souhaite rechercher dans 7 niveaux de répertoires pour trouver un fichier. Pensez aux menus des sites web… rien de plus profond que 2 niveaux ne devrait être sérieursement pris en considération. Dans une structure de répertoire, il n'y a pas de nombre d'or, mais lorsqu'un répertoire à entre 7 et 10 fichiers, il serait temps de créer des sous-répertoires. Basez cela sur votre niveau de confort. Utilisez une structure plus plate jusqu'à ce qu'il y ait un évident intérêt (pour respecter les autres principes LIFT) à créer un sous-répertoire.

### T-DRY (Essayer de respecter DRY)
###### [Style [Y144](#style-y144)]

  - Ne vous répétez pas (DRY), mais pas bêtement à tout prix ni en sacrifiant la lisibilité.

    *Pourquoi ?* : Ne pas se répéter (DRY) est important, mais pas cricial si vous en êtesréduit à sacrifier les autres principes LIFT, c'est que qu'on peut appeller T-DRY (Essayer de ne pas se répéter). Je ne voudrai pas écrire session-view.html pour une vue, parce que, c'est évidemment une vue. Si ce n'est pas évident ou par convention, alors nommez-le.

**[Retour en haut de page](#table-des-matières)**

## Structure de l'Application

### Règles Générales
###### [Style [Y150](#style-y150)]

  -  Vous devez avoir une vue court terme et une vision à long terme. En d'autres mots, commencez petit et garder en tête là où en est votre application. Tout le code de l'appli va dans un répertoire racine nommé `app`. Tout contenu fonctionnel doit être rangé dans son propre fichier. Chaque controlleur, service, module, vue doit avoir son propre fichier. Tous les scripts provenant de fournisseurs extérieurs doivent être rangés dans un autre répertoire racine et non dans le répertoire `app`. Le code que l'on écrit pas soi-même ne doit pas se mélanger avec son appli (`bower_components`, `script`, `lib`).

    Note : Vous trouverez plus de détails et les justifications derrière la structure sur [ce post original sur la structure des applications](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Placez les composants qui définissent le layout principal de l'application dans un répertoire nommé `layout`. Il devrait inclure une vue noyau et le controlleur devrait agir comme conteneur pour l'appli, la nivigation, les menus, les zones de contenu, et les autres régions.

    *Pourquoi ?* : Organise tout le layout à un seul endroit réutilisé dans l'application.

### Structure en Répertoires-par-Fonctionnalités
###### [Style [Y152](#style-y152)]

  - Créez des répertoires nommés d'après les fonctionnalités qu'elles représentent. Lorsqu'un répertoire grossit jusqu'à atteindre plus de 7 fichiers, commencez à penser la création d'un répertoire pour ceux-ci. Si votre seuil est différent, ajustez-le au besoin.

    *Pourquoi ?* : Un développeur peut localiser, identifier ce que représente chaque fichier en sune seule fois, la structure est aussi plate que possible, et il n'y a ni répétitions ni noms redondants.

    *Pourquoi ?* : Les règles LIFT sont toutes couvertes.

    *Pourquoi ?* : Aide à diminuer l'entropie de l'appli en organizant le contenu et en le maintenant aligné avec les principes LIFT.

    *Pourquoi ?* : Lorsqu'il y a de nombreux fichiers (+ de 10) les repérer est plus facile avec une structure de répertoires cohérente et plus difficile dans une structure à plat.

    ```javascript
    /**
     * recommandé
     */

    app/
        app.module.js
        app.config.js
        app.routes.js
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
            session-detail.html
            session-detail.controller.js
    ```

      ![Structure d'une Appli Exemple](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Note : N'utilisez pas une structuration de répertoires-par-type. Cela requiert de se déplacer entre de multiples répertoires lorsqu'on travaille sur une fonctionnalité et cela devient rapidement difficile à manier lorsque l'application grossit à 5, 10 ou plus de 25 vues et controlleurs (et autres), ce qui complique la localisation par rapport à des répertoires-par-fonctionnalité.

    ```javascript
    /*
    * à éviter
    * Trouver une alternative aux répertoires-par-type.
    * Je vous conseille les "répertoires-par-fonctionnalité", à la place.
    */

    app/
        app.module.js
        app.config.js
        app.routes.js
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

### De Nombreux Petits Modules Auto-Suffisants
###### [Style [Y160](#style-y160)]

  - Créez de petits modules qui encapsulent une responsabilité.

    *Pourquoi ?* : Les Applications modulaires rendent faciles le branchement rapide puisqu'elles permettent aux équipes de développement de construire des sections verticales de l'application et de livrer incrémentalement. Cela signifie que nous pouvons brancher de nouvelles fonctionnalités à mesure que nous les développons.

### Création d'un Module Applicatif
###### [Style [Y161](#style-y161)]

  - Créez un module racine pour l'application dont le rôle est d'assembler tous les modules et fonctionnalités de votre application. Nommez-le comme votre application.

    *Pourquoi ?* : AngularJS encourage la modularité et la séparation des responsabilités. La création d'un module racine pour l'application dont le rôle est de lier ensemble les autres modules fournit un moyen très direct d'ajouter et de retirer des modules à votre application.

### Garder le Module Applicatif Léger
###### [Style [Y162](#style-y162)]

  - Ne placez dans le module applicatif que la logique d'assemblage de l'application. Laissez les fonctionnalités dans leurs propres modules.

    *Pourquoi ?* : Ajouter des responsabilités supplémentaires à l'application racine pour récupérer des données, afficher des vues, ou toute autre logique non reliée à l'assemblage de l'application trouble le module applicatif rend plus difficile à réutiliser ou éteindre les ensembles de fonctionnalités.

    *Pourquoi ?* : Le module applicatif devient une déclaration qui montre quels modules aident à constituer l'application.

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Why?*: Self contained modules can be added to the application with little or no friction.

    *Why?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Why?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code.

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Why?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - The application root module depends on the app specific feature modules and any shared or reusable modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Why?*: The main app module contains a quickly identifiable manifest of the application's features.

    *Why?*: Each feature area contains a manifest of what it depends on, so it can be pulled in as a dependency in other applications and still work.

    *Why?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind.

    > In a small app, you can also consider putting all the shared dependencies in the app module where the feature modules have no direct dependencies. This makes it easier to maintain the smaller application, but makes it harder to reuse modules outside of this application.

**[Back to top](#table-of-contents)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidaes include providers and constants.

    *Why?*: This makes it easier to have a less places for configuration.

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

### Run Blocks
###### [Style [Y171](#style-y171)]

  - Any code that needs to run when an application starts should be declared in a factory, exposed via a function, and injected into the [run block](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Why?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Back to top](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Back to top](#table-of-contents)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Why?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

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

    // and so on
    ```

### Testing Library
###### [Style [Y191](#style-y191)]

  - Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://visionmedia.github.io/mocha/) for unit testing.

    *Why?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

### Test Runner
###### [Style [Y192](#style-y192)]

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Why?*: Karma is easy to configure to run once or automatically when you change your code.

    *Why?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Why?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Why?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - Use Sinon for stubbing and spying.

    *Why?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Why?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Why?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server.

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - Run JSHint on your tests.

    *Why?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *Why?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Back to top](#table-of-contents)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Why?*: Subtle animations can improve User Experience when used appropriately.

    *Why?*: Subtle animations can improve perceived performance as views transition.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.

    *Why?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css
###### [Style [Y212](#style-y212)]

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Why?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Why?*: Provides consistency in your animations.

    *Why?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Back to top](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *Why?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Why?*: Provides consistency using a common industry tool.

    ```javascript
    /**
     * Logger Factory
     * @namespace Factories
     */
    (function() {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Application wide logger
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
           * @desc Logs errors
           * @param {String} msg Message to log
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

**[Back to top](#table-of-contents)**

## JS Hint

### Use an Options File
###### [Style [Y230](#style-y230)]

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

    *Why?*: Provides a first alert prior to committing any code to source control.

    *Why?*: Provides consistency across your team.

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

**[Back to top](#table-of-contents)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - Create an AngularJS Constant for vendor libraries' global variables.

    *Why?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

**[Back to top](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - AngularJS snippets that follow these styles and guidelines.

    - Download the [Sublime Angular snippets](assets/sublime-angular-snippets.zip?raw=true)
    - Place it in your Packages folder
    - Restart Sublime
    - In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective // creates an Angular directive
    ngfactory // creates an Angular factory
    ngmodule // creates an Angular module
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - AngularJS file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - AngularJS snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    - Download the [WebStorm AngularJS file templates and snippets](assets/webstorm-angular-file-template.settings.jar?raw=true)
    - Open WebStorm and go to the `File` menu
    - Choose the `Import Settings` menu option
    - Select the file and click `OK`
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

**[Back to top](#table-of-contents)**

## AngularJS docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

### Process
    1. Discuss the changes in an Issue.
    2. Open a Pull Request, reference the issue, and explain the change and why it adds value.
    3. The Pull Request will be evaluated and either merged or declined.

## License

_tldr; Use this guide. Attributions are appreciated._

### (The MIT License)

Copyright (c) 2014 [John Papa](http://johnpapa.net)

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

**[Back to top](#table-of-contents)**
