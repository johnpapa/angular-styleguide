# Guide de style AngularJS

*Guide de style dogmatiques AngularJS pour des équipes par [@john_papa](//twitter.com/john_papa)*

*Traduction de [Benoît Tremblay](//twitter.com/benoit_tremblay)*

>The [original English version](http://jpapa.me/ngstyles) is the source of truth, as it is maintained and updated first.

Si vous cherchez un guide de style dogmatique pour la syntaxe, des convetion et la structure de votre application AngularJS, vous êtes à la bonne place. Ces styles sont basés sur mon expérience de développement avec [AngularJS](//angularjs.org), des présentations, [Pluralsight training courses](http://pluralsight.com/training/Authors/Details/john-papa) et en travaillant dans des équipes.

>Si vous aimez ce guide, allez regarder mon cours sur Pluralsight sur [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean).

Le but de ce guide de style est de donner des orientations sur la création d'applications AngularJS en vous montrant les conventions que j'utilise et, encore plus important, pourquoi je les choisis.

## La communauté impressionnante et crédits
Ne travaillez jamais seul. J'ai trouvé que la communauté d'AngularJS est un groupe incroyable qui sommes passionnés de partager leurs expériences, Donc, un ami et expert en AngularJS Todd Motto et moi avont collaborés sur plusieurs styles et convention. Nous sommes d'accord sur la plupart et nous divergons sur d'autre. Je vous encourage de regarder [Todd's  guidelines](https://github.com/toddmotto/angularjs-styleguide) pour avoir une idée de son approche et ses différences.

Plusieurs de mes styles sont venu de sessions de programmation en pair entre [Ward Bell](http://twitter.com/wardbell) et moi avec eux. Même si nous ne sommes pas toujours d'accord, mon ami Ward a certainement aidé à influencer l'évolution ultime de ce guide.

## Voir les styles dans un exemple d'application
Pendant que ce guide explique le *quoi*, le *pourquoi* et le *comment*, j'ai remarqué que cela aide de les voirs en pratique. Ce guide est accompagné d'un exemple d'application qui suit ces styles et façons de faire. Vous pouvez trouver l'[application d'exemple (nommé modular) ici](https://github.com/johnpapa/ng-demos) dans le dossier `modular`. Soyez à l'aise d'aller le télécharger, cloner ou forker. [Les instructions pour le faire marcher sont dans son readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Traductions
[Les Traductions pour le guide de style Angular](https://github.com/johnpapa/angularjs-styleguide/tree/master/i18n) sont maintenu par la communauté et peuvent être trouvé ici.

## Table des matières

  1. [La responsabilité singulière](#la-responsabilité-singulière)
  1. [IIFE](#iife)
  1. [Modules](#modules)
  1. [Contrôleurs](#contrôleurs)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Data Services](#data-services)
  1. [Directives](#directives)
  1. [Resolving Promises for a Controller](#resolving-promises-for-a-controller)
  1. [Manual Annotating for Dependency Injection](#manual-annotating-for-dependency-injection)
  1. [Minification and Annotation](#minification-and-annotation)
  1. [Exception Handling](#exception-handling)
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
  1. [HTML Layout](#html-layout)
  1. [AngularJS Docs](#angularjs-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## La responsabilité singulière

### La règle du 1
###### [Style [Y001](#style-y001)]

  - Définissez 1 composant par fichier.

 	L'exemple suivant définie le module `app` et ses dépendances, définis un controlleur et définis une usine tous dans le même fichier.

  ```javascript
  /* éviter */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController', SomeController)
    	.factory('someFactory', someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```
    
	Les mêmes composantes sont maintenant séparées dans leurs propres fichiers.

  ```javascript
  /* recommendé */
  
  // app.module.js
  angular
    	.module('app', ['ngRoute']);
  ```

  ```javascript
  /* recommendé */
  
  // someController.js
  angular
    	.module('app')
    	.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommandé */
  
  // uneUsine.js
  angular
    	.module('app')
    	.factory('uneUsine', uneUsine);
  	
  function uneUsine() { }
  ```

**[Retourner en haut](#table-des-matières)**

## IIFE
### Fermetures JavaScript
###### [Style [Y010](#style-y010)]

  - Entourez les composantes AngularJS dans un Immediately Invoked Function Expression (IIFE). 
  
  *Pourquoi?*: Un IIFE supprime les variables de la porté globale. Cela aide à prévenir les variables et les déclarations de fonctions d'exister plus longtemps que prévu dans la porté globale, ce qui aide également d'éviter les collisions de variables.

  *Pourquoi?*: Quand votre code est rapetissé et compaqueté dans un seul fichier pour le déploiement sur un serveur de production, vous pourriez avoir des collisions entre les variables et beaucoup de variables globales. Le IIFE vous protège contre ces deux problèmes en limitant la porté des variables de chaque fichier.

  ```javascript
  /* éviter */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // la fonction logger est ajouté comme une variable globale
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // la fonction storage est ajouté comme une variable globale
  function storage() { }
  ```

  
  ```javascript
  /**
   * recommendé 
   *
   * aucunes variables globales sommes rappelées
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

  - Note: Seulement par souçi de rester concis, le reste des exemples dans ce guide omettera la syntaxe IIFE.
  
  - Note: IIFE prévient le code de test d'atteindre les membres privés comme les expressions régulières ou les fonctions d'aide, qui sommt généralement pratique de tester intégralement. Par contre, vous pouvez les tester en utilisant des membres accessibles ou en les exposant dans votre composante. Par exemple en plaçant les fonctions d'aide, les expressions régulières ou les constantes dans leurs propres factory ou constante.

**[Retourner en haut](#table-des-matières)**

## Modules

### Éviter les collisions de nom
###### [Style [Y020](#style-y020)]

  - Utilisez une convention de noms uniques avec des spéparateurs pour les sous-modules.

  *Pourquoi?*: Des noms uniques aide à éviter des collisions de nom de module. Les séparateurs aident à définir les modules et la hiérarchie des sous-modules. Par exemple, `app` peut être votre module principal alors que `app.dashboard` et `app.users` peuvent être des modules qui sont des dépendances de `app`.

### Définitions (ou Setters)
###### [Style [Y021](#style-y021)]

  - Déclarez les modules sans une variable en utilisant la syntaxe de setter. 

	*Pourquoi?*: Avec 1 composant par fichier, il est rarement utilise d'introduire une variable pour le module.
	
  ```javascript
  /* éviter */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

	Utilisez plutôt la syntaxe de setter simple.

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

  - Quand vous utilisez un module, évitez d'utiliser une variable et utilisez plutôt le chainage avec la syntaxe de getter.

	*Pourquoi?* : Cela produit un code plus lisible et évite les collisions de variables ou les fuites.

  ```javascript
  /* éviter */
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

### Setting vs Getting
###### [Style [Y023](#style-y023)]

  - Utilisez set une seule fois et get pour toutes les autres instances.
	
	*Pourquoi?*: Un module doit être créé une seule fois et être réutilisé par la suite.
  	  
	  - Utilisez `angular.module('app', []);` pour setter un module.
	  - Utilisez  `angular.module('app');` pour getter un module. 

### Fonctions nommées vs anonymes
###### [Style [Y024](#style-y024)]

  - Utilisation des fonctions nommées plutôt que la fonction anonyme en callback.

	*Pourquoi?*: Cela produit un code plus lisible, plus facile à débugger et réduit la quantité de callback imbriqué.

  ```javascript
  /* éviter */
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

**[Retourner en haut](#table-des-matières)**



## Contrôleurs

### Syntaxe de vue controllerAs
###### [Style [Y030](#style-y030)]

  - Utilisez la syntaxe [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) à la place de la syntaxe `classique contrôleur avec $scope`. 

	*Pourquoi?*: Les contrôleurs sont construits, "newer" et produit une seule nouvelle instance alors que la syntaxe `controllerAs` est plus proche d'un constructeur JavaScript que la `syntaxe classique $scope`.

	*Pourquoi?*: Ça encourage l'utilisation d'un objet avec un point dans la vue (exemple `client.nom` au lieu de `nom`), ce qui est plus contextuel, facile à lire et évite les problèmes de références qui pourrait arriver sans le point.

	*Pourquoi?*: Aide à éviter d'appeler `$parent` dans la vue avec des contrôleurs imbriqués.

  ```html
  <!-- éviter -->
  <div ng-controller="Client">
      {{ nom }}
  </div>
  ```

  ```html
  <!-- recommandé -->
  <div ng-controller="Client as client">
     {{ client.nom }}
  </div>
  ```

### Syntaxe d'un contrôleur controllerAs
###### [Style [Y031](#style-y031)]

  - Utilisez la syntaxe `controllerAs` à la place de la syntaxe `classique avec $scope`. 

  - La syntaxe `controllerAs` utilisant `this` à l'intérieur s'attaque au `$scope`

  *Pourquoi?*: `controllerAs` est seulement une amélioration syntaxique par rapport à `$scope`. Vous pouvez toujours vous lier à la Vue et toujours accéder aux méthodes de `$scope`.

  *Pourquoi?*: Aide à éviter la tentation d'utiliser les méthodes de `$scope` à l'intérieur du contrôleur alors qu'il est peut-être prévérable des les éviter ou de les utiliser dans une usine. Considérez utiliser `$scope` dans une usine ou seulement dans un contrôleur lorsque nécessaire. Par exemple, lorsque vous publiez et enregistrez à des évènements en utilisant [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) ou [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on), considérez bouger ces utilisant dans une usine et évoquez les du contrôleur. 

  ```javascript
  /* éviter */
  function Client($scope) {
      $scope.nom = {};
      $scope.envoyerMessage = function() { };
  }
  ```

  ```javascript
  /* recommandé - mais regardez la prochaine section */
  function Client() {
      this.nom = {};
      this.envoyerMessage = function() { };
  }
  ```

### controllerAs avec vm
###### [Style [Y032](#style-y032)]

  - Utilisez une variable de capture pour `this` quand vous utilisez la syntaxe `controllerAs`. Choisissez un nom de variable constant tel que `vm`, qui veut dire ViewModel.
  
  *Pourquoi?*: Le mot-clé `this` est contextuel et quand vous utilisez une fonction à l'intérieur du contrôleur, il peut changer son contexte. Capturer le contexte de `this` évite de rencontrer ce problème.

  ```javascript
  /* éviter */
  function Client() {
      this.nom = {};
      this.envoyerMessage = function() { };
  }
  ```

  ```javascript
  /* recommandé */
  function Client() {
      var vm = this;
      vm.nom = {};
      vm.envoyerMessage = function() { };
  }
  ```

  Note: Vous pouvez éviter n'importe quel avertissements de [jshint](http://www.jshint.com/) en placant le commentaire ci-dessous par dessus la ligne de votre. Par contre, ce n'est pas nécessaire si votre fonction n'est pas nommé avec une Majuscule puisque cette convention veut dire que c'est une fonction constructeur, ce que sont les contrôleurs dans Angular.
    
  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```   

  Note: Quand vous surveillez dans un contrôleur en utilisant `constroller as`, vous pouvez utiliser le membre de `vm.*` en utilisant la syntaxe suivante. (Créez les surveilleurs avec précautions parce qu'ils relantissent la cycle de digestion.)

  ```html
  <input ng-model="vm.titre"/>
  ```

  ```javascript
  function UnControleur($scope, $log) {
      var vm = this;
      vm.titre = 'Un titre';
    
      $scope.$watch('vm.titre', function(current, original) {
          $log.info('vm.titre était %s', original);
          $log.info('vm.titre est maintenant %s', current);
      });
  }
  ```

### Membres liés en haut
###### [Style [Y033](#style-y033)]

  - Placez les membres liables en haut du contrôleur, en ordre alphabétique et pas au travers du code du contrôleur.
  
    *Pourquoi?*: Placer les membres liables en haut facilite la lecture et vous aide à identifier instantanément quels membres du contrôleur peuvent être liés et utilisés dans la Vue.

    *Pourquoi?*: Mettre des fonctions anonymes dans le code peut être facile. Par contre, les fonctions avec plus qu'une ligne de code réduisent la lisibilité. Définir les fonctions en dessous des membres liés (les fonctions vont être hissées) déplace les détails d'implémentation vers le bas et garde les membres liables au dessus and rend le tout plus facile à lire. 

  ```javascript
  /* éviter */
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
  /* recommandé */
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

    ![Contrôleur utilisant "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-1.png)

  Note: Si la fonction est une seule ligne, considérez la garder au nom à condition que la lisibilité n'est pas affecté.

  ```javascript
  /* éviter */
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
      vm.refresh = dataservice.refresh; // une ligne est OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Déclarations des fonction pour cacher les détails d'implémentation
###### [Style [Y034](#style-y034)]

  - Utilisez les déclarations de fonction pour cacher les détails d'implémentation. Gardez vos membres liables en haut. Quand vous devez lier une fonction dans un contrôleur, pointez le vers une déclaration de fonction qui sera définis plus tard dans le fichier. Ceci est lié directement à la section Membres liés en haut. Pour plus de détails, voir [cet article](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).
    
    *Pourquoi?*: Placer les membres liés en haut améliore la lisibilité et vous aide à identifier instantanément quels membres du contrôleurs peuvent être liés et utilisé dans la Vue. (Pareil qu'en haut.)

    *Pourquoi?*: Placer les détails d'implémentation plus tard dans le fichier déplace la complexité en dehors de la vue pour que vous puissez voir les choses importantes en haut.

    *Pourquoi?*: La déclration de fonction est hissé alors vous n'avez aucune crainte à l'utiliser avant qu'elle soit définis (comme il serait la cas avec des expressions de fonction).

    *Pourquoi?*: Vous n'avez jamais à vous inquiéter que les déclrations de fonction qui bouge `var a` avant `var b` va briser votre code à cause que `a` dépend de `b`.     

    *Pourquoi?*: L'ordre est critique avec les expressions de fonction

  ```javascript
  /** 
   * évité
   * Utiliser une expression de fonction
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

  Notez que les choses importantes sont dispersés dans l'exemple précédents. Dans l'exemple suivant, notez que les choses importantes sur en haut. Par exemple, les membres liés au contrôleur comme `vm.avenger` et `vm.title`. Les détails d'implémentation sont plus bas. Ceci est juste plus facile à lire.

  ```javascript
  /*
   * recommandé
   * Utiliser les déclarations de fonctions
   * et les membres liés en haut.
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

### Différez la logique du contrôleur
###### [Style [Y035](#style-y035)]

  - Différez la logique dans un contrôleur en délégant à des services et usines.

    *Pourquoi?*: La logique peut être réutiliser par plusieurs contrôleurs lorsqu'elle est placé dans un service et exposé par une fonction.

    *Pourquoi?*: La logique dans un service peut être isolé plus facilement pour un test unitaire et la logique d'appel peut être facilement imité.

    *Pourquoi?*: Enlève les dépendances et caches les détails d'implémentation du contrôleur.

  ```javascript

  /* éviter */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
		  var settings = {};
          // Get the credit service base URL from config
          // Set credit service required headers
          // Prepare URL query string or data object with request data
          // Add user-identifying info so service gets the right credit limit for this user.
          // Use JSONP for this browser if it doesn't support CORS
          return $http.get(settings)
              .then(function(data) {
	             // Unpack JSON data in the response object
                 // to find maxRemainingAmount
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Interpret error
                 // Cope w/ timeout? retry? try alternate service?
                 // Re-reject with appropriate error for a user to see
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

### Gardez les contrôleurs focusés
###### [Style [Y037](#style-y037)]

  - Définissez un contrôleur pour une vue et essayez de ne pas le réutiliser pour d'autres vues. Au lieu, bougez la logique réutilisation dans des usines et gardez le contrôleur simple et focusé sur sa vue. 
  
    *Pourquoi?*: Réutiliser des contrôleurs avec plusieurs vues est fragile et une bonne couverture de test end to end (e2e) est requis pour s'assurer de la stabilité au travers de l'application au complet.

### Assigner des contrôleurs
###### [Style [Y038](#style-y038)]

  - Quand un contrôleur doit être de pairs avec une vie et que les deux composantes peuvent être réutilisées par d'autres contrôleurs ou vues, définissez les contrôleurs avec leurs routes.
    
    Note: Si une Vue est chargée par une autre façon excepté une route, utilisez alors la syntaxe `ng-controller="Avengers as vm"`.

    *Pourquoi?*: Mettre de pair un contrôleur dans la route permet différentes routes d'invoquer différentes pairs de contrôleurs et vues. Quand les contrôleurs sont assignés dans la vue en utilisant [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), cette vue est toujours associée avec le même contrôleur.

 ```javascript
  /* évité - quand utilisé avec une route et le pairage dynamique est désiré */

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

**[Retourner en haut](#table-des-matières)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - Services are instantiated with the `new` keyword, use `this` for public methods and variables. Since these are so similar to factories, use a factory instead for consistency. 
  
    Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services). This means that there is only one instance of a given service per injector.

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

**[Retourner en haut](#table-des-matières)**

## Factories

### Single Responsibility
###### [Style [Y050](#style-y050)]

  - Factories should have a [single responsibility](http://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a factory begins to exceed that singular purpose, a new factory should be created.

### Singletons
###### [Style [Y051](#style-y051)]

  - Factories are singletons and return an object that contains the members of the service.
  
    Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services).

### Accessible Members Up Top
###### [Style [Y052](#style-y052)]

  - Expose the callable members of the service (it's interface) at the top, using a technique derived from the [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Pourquoi?*: Placing the callable members at the top makes it easy to read and helps you instantly identify which members of the service can be called and must be unit tested (and/or mocked). 

    *Pourquoi?*: This is especially helpful when the file gets longer as it helps avoid the need to scroll to see what is exposed.

    *Pourquoi?*: Setting functions as you go can be easy, but when those functions are more than 1 line of code they can reduce the readability and cause more scrolling. Defining the callable interface via the returned service moves the implementation details down, keeps the callable interface up top, and makes it easier to read.

  ```javascript
  /* éviter */
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

  This way bindings are mirrored across the host object, primitive values cannot update alone using the revealing module pattern

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Function Declarations to Hide Implementation Details
###### [Style [Y053](#style-y053)]

  - Use function declarations to hide implementation details. Keep your accessible members of the factory up top. Point those to function declarations that appears later in the file. For more details see [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Pourquoi?*: Placing accessible members at the top makes it easy to read and helps you instantly identify which functions of the factory you can access externally.

    *Pourquoi?*: Placing the implementation details of a function later in the file moves that complexity out of view so you can see the important stuff up top.

    *Pourquoi?*: Function declaration are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).

    *Pourquoi?*: You never have to worry with function declarations that moving `var a` before `var b` will break your code because `a` depends on `b`.     

    *Pourquoi?*: Order is critical with function expressions 

  ```javascript
  /**
   * avoid
   * Using function expressions
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // implementation details go here
      };

      var getAvengerCount = function() {
          // implementation details go here
      };

      var getAvengersCast = function() {
         // implementation details go here
      };

      var prime = function() {
         // implementation details go here
      };

      var ready = function(nextPromises) {
          // implementation details go here
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
   * recommended
   * Using function declarations
   * and accessible members up top.
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
         // implementation details go here
      }

      function getAvengerCount() {
          // implementation details go here
      }

      function getAvengersCast() {
         // implementation details go here
      }

      function prime() {
          // implementation details go here
      }

      function ready(nextPromises) {
          // implementation details go here
      }
  }
  ```

**[Retourner en haut](#table-des-matières)**

## Data Services

### Separate Data Calls
###### [Style [Y060](#style-y060)]

  - Refactor logic for making data operations and interacting with data to a factory. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    *Pourquoi?*: The controller's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the controller be simpler and more focused on the view.

    *Pourquoi?*: This makes it easier to test (mock or real) the data calls when testing a controller that uses a data service.

    *Pourquoi?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as $http. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a controller), also making it easier to change the implementation.

  ```javascript
  /* recommandé */

  // dataservice factory
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
    
    Note: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.

  ```javascript
  /* recommandé */

  // controller calling the dataservice factory
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

### Return a Promise from Data Calls
###### [Style [Y061](#style-y061)]

  - When calling a data service that returns a promise such as $http, return a promise in your calling function too.

    *Pourquoi?*: You can chain the promises together and take further action after the data call completes and resolves or rejects the promise.

  ```javascript
  /* recommandé */

  activate();

  function activate() {
      /**
       * Step 1
       * Ask the getAvengers function for the
       * avenger data and wait for the promise
       */
      return getAvengers().then(function() {
          /**
           * Step 4
           * Perform an action on resolve of final promise
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Step 2
         * Ask the data service for the data and wait
         * for the promise
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Step 3
                 * set the data and resolve the promise
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Retourner en haut](#table-des-matières)**

## Directives
### Limit 1 Per File
###### [Style [Y070](#style-y070)]

  - Create one directive per file. Name the file for the directive. 

    *Pourquoi?*: It is easy to mash all the directives in one file, but difficult to then break those out so some are shared across apps, some across modules, some just for one module. 

    *Pourquoi?*: One directive per file is easy to maintain.

  ```javascript
  /* éviter */
  /* directives.js */

  angular
      .module('app.widgets')

      /* order directive that is specific to the order module */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales directive that can be used anywhere across the sales app */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* spinner directive that can be used anywhere across apps */
      .directive('sharedSpinner', sharedSpinner);


  function orderCalendarRange() {
      /* implementation details */
  }

  function salesCustomerInfo() {
      /* implementation details */
  }

  function sharedSpinner() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommandé */
  /* calendarRange.directive.js */

  /**
   * @desc order directive that is specific to the order module at a company named Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommandé */
  /* customerInfo.directive.js */

  /**
   * @desc spinner directive that can be used anywhere across the sales app at a company named Acme
   * @example <div acme-sales-customer-info></div>
   */    
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommandé */
  /* spinner.directive.js */

  /**
   * @desc spinner directive that can be used anywhere across apps at a company named Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* implementation details */
  }
  ```

    Note: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and it's file name distinct and clear. Some examples are below, but see the naming section for more recommendations.

### Manipulate DOM in a Directive
###### [Style [Y072](#style-y072)]

  - When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow. 

    *Pourquoi?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

### Provide a Unique Directive Prefix
###### [Style [Y073](#style-y073)]

  - Provide a short, unique and descriptive directive prefix such as `acmeSalesCustomerInfo` which is declared in HTML as `acme-sales-customer-info`.

    *Pourquoi?*: The unique short prefix identifies the directive's context and origin. For example a prefix of `cc-` may indicate that the directive is part of a CodeCamper app while `acme-` may indicate a directive for the Acme company. 

    Note: Avoid `ng-` as these are reserved for AngularJS directives.Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/). 

### Restrict to Elements and Attributes
###### [Style [Y074](#style-y074)]

  - When creating a directive that makes sense as a standalone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when its standalone and as an attribute when it enhances its existing DOM element.

    *Pourquoi?*: It makes sense.

    *Pourquoi?*: While we can allow the directive to be used as a class, if the directive is truly acting as an element it makes more sense as an element or at least as an attribute.

    Note: EA is the default for AngularJS 1.3 +

  ```html
  <!-- évitez -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* éviter */
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
  <!-- recommended -->
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

### Directives and ControllerAs
###### [Style [Y075](#style-y075)]

  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    *Pourquoi?*: It makes sense and it's not difficult.

    Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place. 

    Note: Regarding dependency injection, see [Manually Identify Dependencies](#manual-annotating-for-dependency-injection).

    Note: Note that the directive's controller is outside the directive's closure. This style eliminates issues where the injection gets created as unreachable code after a `return`.

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
      // Injecting $scope just for comparison
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

**[Retourner en haut](#table-des-matières)**

## Resolving Promises for a Controller

### Controller Activation Promises
###### [Style [Y080](#style-y080)]

  - Resolve start-up logic for a controller in an `activate` function.
     
    *Pourquoi?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    Note: If you need to conditionally cancel the route before you start use the controller, use a route resolve instead.
    
  ```javascript
  /* éviter */
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

### Route Resolve Promises
###### [Style [Y081](#style-y081)]

  - When a controller depends on a promise to be resolved, resolve those dependencies in the `$routeProvider` before the controller logic is executed. If you need to conditionally cancel a route before the controller is activated, use a route resolver.

    *Pourquoi?*: A controller may require data before it loads. That data may come from a promise via a custom factory or [$http](https://docs.angularjs.org/api/ng/service/$http). Using a [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) allows the promise to resolve before the controller logic executes, so it might take action based on that data from the promise.

  ```javascript
  /* éviter */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // unresolved
      vm.movies;
      // resolved asynchronously
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }
  ```

  ```javascript
  /* better */

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

    Note: The code example's dependency on `movieService` is not minification safe on its own. For details on how to make this code minification safe, see the sections on [dependency injection](#manual-annotating-for-dependency-injection) and on [minification and annotation](#minification-and-annotation).

**[Retourner en haut](#table-des-matières)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification
###### [Style [Y090](#style-y090)]

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.
  
    *Pourquoi?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    This code may produce mangled variables when minified and thus cause runtime errors.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
###### [Style [Y091](#style-y091)]

  - Use `$inject` to manually identify your dependencies for AngularJS components.
  
    *Pourquoi?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

    *Pourquoi?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    *Pourquoi?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function. 

    ```javascript
    /* éviter */
    angular
        .module('app')
        .controller('Dashboard', 
            ['$location', '$routeParams', 'common', 'dataservice', 
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);      
    ```

    ```javascript
    /* éviter */
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

    Note: When your function is below a return statement the $inject may be unreachable (this may happen in a directive). You can solve this by either moving the $inject above the return statement or by using the alternate array injection syntax. 

    Note: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduced a feature where it moves the `$inject` to where it is reachable.

    ```javascript
    // inside a directive definition
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
    // inside a directive definition
    function outer() {
        DashboardPanel.$inject = ['logger']; // reachable
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Manually Identify Route Resolver Dependencies
###### [Style [Y092](#style-y092)]

  - Use $inject to manually identify your route resolver dependencies for AngularJS components.
  
    *Pourquoi?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

    *Pourquoi?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

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

**[Retourner en haut](#table-des-matières)**

## Minification and Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/** @ngInject */`
  
    *Pourquoi?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

    *Pourquoi?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated 

    >I prefer Gulp as I feel it is easier to write, to read, and to debug.

    The following code is not using minification safe dependencies.

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

    When the above code is run through ng-annotate it will produce the following output with the `$inject` annotation and become minification-safe.

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

    Note: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

    Note: When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

    ```javascript
    // Using @ngInject annotations
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

    > Note: Starting from AngularJS 1.3 use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code.
    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate
###### [Style [Y101](#style-y101)]

  - Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
    *Pourquoi?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

    The following code is an example of a gulp task using ngAnnotate

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;
        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Annotate before uglify so the code get's min'd properly.
            .pipe(ngAnnotate({
                // true helps add where @ngInject is not used. It infers.
                // Doesn't work with resolve, so we must be explicit there
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[Retourner en haut](#table-des-matières)**

## Exception Handling

### decorators
###### [Style [Y110](#style-y110)]

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.
  
    *Pourquoi?*: Provides a consistent way to handle uncaught AngularJS exceptions for development-time or run-time.

    Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

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
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  	```

### Exception Catchers
###### [Style [Y111](#style-y111)]

  - Create a factory that exposes an interface to catch and gracefully handle exceptions.

    *Pourquoi?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

    Note: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

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

### Route Errors
###### [Style [Y112](#style-y112)]

  - Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Pourquoi?*: Provides a consistent way handle all routing errors.

    *Pourquoi?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or  recovery options.

    ```javascript
    /* recommandé */
    function handleRoutingErrors() {
        /**
         * Route cancellation:
         * On routing error, go to the dashboard.
         * Provide an exit clause if it tries to do it twice.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                /**
                 * Optionally log using a custom service or $log.
                 * (Don't forget to inject custom service)
                 */
                logger.warning(msg, [current]);
            }
        );
    }
    ```

**[Retourner en haut](#table-des-matières)**

## Naming

### Naming Guidelines
###### [Style [Y120](#style-y120)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    *   the file name (`avengers.controller.js`)
    *   the registered component name with Angular (`AvengersController`)
 
    *Pourquoi?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Pourquoi?*: The naming conventions should simply help you find your code faster and make it easier to understand. 

### Feature File Names
###### [Style [Y121](#style-y121)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`.

    *Pourquoi?*: Provides a consistent way to quickly identify components.

    *Pourquoi?*: Provides pattern matching for any automated tasks.

    ```javascript
    /**
     * common options 
     */

    // Controllers
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
     * recommended
     */

    // controllers
    avengers.controller.js
    avengers.controller.spec.js

    // services/factories
    logger.service.js
    logger.service.spec.js

    // constants
    constants.js
    
    // module definition
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

  Note: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team.

    ```javascript
    /**
     * recommended
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Test File Names
###### [Style [Y122](#style-y122)]

  - Name test specifications similar to the component they test with a suffix of `spec`.  

    *Pourquoi?*: Provides a consistent way to quickly identify components.

    *Pourquoi?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```javascript
    /**
     * recommended
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Controller Names
###### [Style [Y123](#style-y123)]

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    *Pourquoi?*: Provides a consistent way to quickly identify and reference controllers.

    *Pourquoi?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```
    
### Controller Name Suffix
###### [Style [Y124](#style-y124)]

  - Append the controller name with the suffix `Controller` or with no suffix. Choose 1, not both.

    *Pourquoi?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

    *Pourquoi?*: Omitting the suffix is more succinct and the controller is often easily identifiable even without the suffix.

    ```javascript
    /**
     * recommended: Option 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers(){ }
    ```

    ```javascript
    /**
     * recommended: Option 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Factory Names
###### [Style [Y125](#style-y125)]

  - Use consistent names for all factories named after their feature. Use camel-casing for services and factories.

    *Pourquoi?*: Provides a consistent way to quickly identify and reference factories.

    ```javascript
    /**
     * recommended
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

### Directive Component Names
###### [Style [Y126](#style-y126)]

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    *Pourquoi?*: Provides a consistent way to quickly identify and reference components.

    ```javascript
    /**
     * recommended
     */

    // avenger-profile.directive.js    
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Modules
###### [Style [Y127](#style-y127)]

  -  When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`. 

    *Pourquoi?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *Pourquoi?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration
###### [Style [Y128](#style-y128)]

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *Pourquoi?*: Separates configuration from module definition, components, and active code.

    *Pourquoi?*: Provides a identifiable place to set configuration for a module.

### Routes
###### [Style [Y129](#style-y129)]

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration. 

**[Retourner en haut](#table-des-matières)**

## Application Structure LIFT Principle
### LIFT
###### [Style [Y140](#style-y140)]

  - Structure your app such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should follow these 4 basic guidelines. 

    *Why LIFT?*: Provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When I find my structure is not feeling comfortable, I go back and revisit these LIFT guidelines
  
    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

### Locate
###### [Style [Y141](#style-y141)]

  - Make locating your code intuitive, simple and fast.

    *Pourquoi?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly,  they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

### Identify
###### [Style [Y142](#style-y142)]

  - When you look at a file you should instantly know what it contains and represents.

    *Pourquoi?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat
###### [Style [Y143](#style-y143)]

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *Pourquoi?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - Be DRY, but don't go nuts and sacrifice readability.

    *Pourquoi?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it. 

**[Retourner en haut](#table-des-matières)**

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  -  Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions. 

    *Pourquoi?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed. 

    *Pourquoi?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names. 

    *Pourquoi?*: The LIFT guidelines are all covered.

    *Pourquoi?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *Pourquoi?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

    ```javascript
    /**
     * recommended
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

      ![Sample App Structure](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Note: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

    ```javascript
    /* 
    * avoid
    * Alternative folders-by-type.
    * I recommend "folders-by-feature", instead.
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

**[Retourner en haut](#table-des-matières)**

## Modularity
  
### Many Small, Self Contained Modules
###### [Style [Y160](#style-y160)]

  - Create small modules that encapsulate one responsibility.

    *Pourquoi?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally.  This means we can plug in new features as we develop them.

### Create an App Module
###### [Style [Y161](#style-y161)]

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *Pourquoi?*: AngularJS encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Pourquoi?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

    *Pourquoi?*: The app module becomes a manifest that describes which modules help define the application. 

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Pourquoi?*: Self contained modules can be added to the application with little or no friction.

    *Pourquoi?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Pourquoi?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code. 

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Pourquoi?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - The application root module depends on the app specific feature modules and any shared or reusable modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Pourquoi?*: The main app module contains a quickly identifiable manifest of the application's features. 

    *Pourquoi?*: Each feature area contains a manifest of what it depends on, so it can be pulled in as a dependency in other applications and still work. 

    *Pourquoi?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind. 

    > In a small app, you can also consider putting all the shared dependencies in the app module where the feature modules have no direct dependencies. This makes it easier to maintain the smaller application, but makes it harder to reuse modules outside of this application.

**[Retourner en haut](#table-des-matières)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidaes include providers and constants.

    *Pourquoi?*: This makes it easier to have a less places for configuration.

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

    *Pourquoi?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Retourner en haut](#table-des-matières)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Pourquoi?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Pourquoi?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Retourner en haut](#table-des-matières)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Pourquoi?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

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

    *Pourquoi?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

### Test Runner
###### [Style [Y192](#style-y192)]

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Pourquoi?*: Karma is easy to configure to run once or automatically when you change your code.

    *Pourquoi?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Pourquoi?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Pourquoi?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - Use Sinon for stubbing and spying.

    *Pourquoi?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Pourquoi?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Pourquoi?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server. 

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - Run JSHint on your tests. 

    *Pourquoi?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *Pourquoi?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Retourner en haut](#table-des-matières)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Pourquoi?*: Subtle animations can improve User Experience when used appropriately.

    *Pourquoi?*: Subtle animations can improve perceived performance as views transition.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.  

    *Pourquoi?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css
###### [Style [Y212](#style-y212)]

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Pourquoi?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Pourquoi?*: Provides consistency in your animations.

    *Pourquoi?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Retourner en haut](#table-des-matières)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *Pourquoi?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Pourquoi?*: Provides consistency using a common industry tool.

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

**[Retourner en haut](#table-des-matières)**

## JS Hint

### Use an Options File
###### [Style [Y230](#style-y230)]

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

    *Pourquoi?*: Provides a first alert prior to committing any code to source control.

    *Pourquoi?*: Provides consistency across your team.

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

**[Retourner en haut](#table-des-matières)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - Create an AngularJS Constant for vendor libraries' global variables.

    *Pourquoi?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

**[Retourner en haut](#table-des-matières)**

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

**[Retourner en haut](#table-des-matières)**

## HTML Layout
### Cloak your HTML
###### [Style [Y260](#style-y260)]

Before Angular is loaded, the user will see your application layout HTML in raw (including the {{uglyBrackets}} instead of the value). Then, it will display the real content as soon as Angular is ready. To prevent the flickering, I use `ng-cloak` to hide the raw HTML.

I cloak only the parts that are necessary so that the loading of the page is progressive and feel smooth.

```html
<!DOCTYPE html>
<html ng-app="app">
<body>
  <h1>This title is never hidden</h1>
  <div ng-cloak>This part is hidden until Angular is ready</div>
</body>
</tml>
```

**[Retourner en haut](#table-des-matières)**

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

**[Retourner en haut](#table-des-matières)**