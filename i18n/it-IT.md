# Guida stilistica ad AngularJS

*Guida stilistica dogmatica ad AngularJS per i team di [@john_papa](//twitter.com/john_papa)*

Se stai cercando una guida stilistica dogmatica per le sintassi, convenzioni e struttura di applicazioni AngularJS, allora questo fa per te. Gli stili sono basati sulla mia esperienza di sviluppo con [AngularJS](//angularjs.org), presentazioni, [corsi di formazioni di Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) e del lavoro in team. 

>Se ti piace questa guida, dai un'occhiata al mio corso [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) (in inglese) su Pluralsight.

L'obbiettivo di questa guida stilistica è di fare da vademecum alla costruzione di applicazioni con AngularJS mostrando le convenzioni che uso e, più importante, perché le uso.

## Eccezionalità della comunità e riconoscimenti
Mai lavorare nel vuoto. Ritengo che la comunità intorno ad AngularJS sia un gruppo incredible con la passione di condividere le esperienze. Perciò, Todd Motto, un amico ed un esperto di AngularJS, ed io abbiamo collaborato su molti stili e convenzioni. Su molto siamo d'accordo, su altro meno.  Ti invito a controllare le [linee guida di Todd](https://github.com/toddmotto/angularjs-styleguide) per avere cognizione del suo approccio e di come paragonarle.

Many of my styles have been from the many pair programming sessions [Ward Bell](http://twitter.com/wardbell) and I have had. While we don't always agree, my friend Ward has certainly helped influence the ultimate evolution of this guide.

Molti dei mie stili sono frutto di parecchie sessioni di pair programming che [Ward Bell](http://twitter.com/wardbell) ed io abbiamo avuto. Seppur non sempre in sintonia, il mio amico Ward ha di certo una influenza sull'evoluzione finale di questa guida.

## Guarda gli stili in una App di Esempio
Nonostante questa guida speghi i *cosa*, *come* e *perché*, trovo che sia di aiuto vederle in pratica. Questa guida è accompagnata da una applicazione di esempio che segue questi stili e schemi. Troverai l'[applicazione di esempio (chiamata modular) qui](https://github.com/johnpapa/ng-demos) nella cartella `modular`. Prendila, clonala o fanne un fork liberamente. [Le istruzioni su come eseguirla sono nel proprio readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Traduzioni 
[Traduzioni di questa guida stilistica ad AngularJS](./i18n) sono gestite dalla comunità e possono essere trovate qui.

## Tavola dei contenuti

  1. [Responsabilità singola](#single-responsibility)
  1. [IIFE](#iife)
  1. [Moduli](#modules)
  1. [Controller](#controllers)
  1. [Service](#services)
  1. [Factory](#factories)
  1. [Data Service](#data-services)
  1. [Directive](#directives)
  1. [Risoluzioni di promesse per un controller](#resolving-promises-for-a-controller)
  1. [Annotazioni manuali per la Dependency Injection](#manual-annotating-for-dependency-injection)
  1. [Minificazione e Annotazioni](#minification-and-annotation)
  1. [Gestione delle eccezzioni](#exception-handling)
  1. [Dare i nomi](#naming)
  1. [Principio "LIFT" per la struttura dell'applicazione](#application-structure-lift-principle)
  1. [Struttura dell'applicazione](#application-structure)
  1. [Modularità](#modularity)
  1. [Logica di Startup](#startup-logic)
  1. [Wrapper dei Servizi $ di Angular](#angular--wrapper-services)
  1. [Test](#testing)
  1. [Animazioni](#animations) 
  1. [Commenti](#comments)
  1. [JSHint](#js-hint)
  1. [Costanti](#constants)
  1. [File Template e Snippet](#file-templates-and-snippets)
  1. [Documentazione di AngularJS](#angularjs-docs)
  1. [Contribuire](#contributing)
  1. [Licenza](#license)

## Responsabilità singola

### Regola dell'1

  - Definire 1 componente per file.  

 	Il seguente esempio definisce il modulo `app` e le proprie dipendenze, definisce un controller e definisce una factory tutto nel medesimo file.

  ```javascript
  /* evitare */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```

    Gli stessi componenti sono ora separati nei loro file.

  ```javascript
  /* raccomandato */
  
  // app.module.js
  angular
    	.module('app', ['ngRoute']);
  ```

  ```javascript
  /* raccomandato */
  
  // someController.js
  angular
    	.module('app')
    	.controller('SomeController' , SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* raccomandato */
  
  // someFactory.js
  angular
    	.module('app')
    	.factory('someFactory' , someFactory);
  	
  function someFactory() { }
  ```

**[Torna all'inizio](#table-of-contents)**

## IIFE
### JavaScript Closures

  - Racchiudi i componenti di AngularJS in una Immediately Invoked Function Expression (IIFE) (Espressione di funzione immediatamente chiamata). 
  
  *Perché?*: Una IIFFE rimuove le variabili dallo scope globale. Questo aiuta a prevenire che variabili e funzioni vivano più del previsto nello scope globale, che inoltre aiuta ad evitare la collisione di variabili.
  *Perché?*: Quando il tuo codice è minificato e raggruppato in un file singolo per il rilascio ad un server di produzione, potresti avere collisioni di variabili e parecchie variabili globali. Una IIFE ti protegge in entrambi i casi fornendo uno scope variabile per ogni file.

  ```javascript
  /* evitare */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

    // La funzione logger è aggiunta come variabile globale  
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

    // La funzione storage è aggiunta come variabile globale  
  function storage() { }
  ```

  
  ```javascript
  /**
   * raccomandato 
   *
   * non ci sono più variabili globali 
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

  - Nota: Per essere più coincisi, il resto degli esempi in questa guida potrebbe omettere l'uso della sintassi IIFE. 
  
  - Nota: Le IIFE evitano che il codice di test possa raggiungere membri privati come regular expression o funzioni di supporto le quali sono spesso oggetto dei propri unit test. In ogni caso, queste possono essere testate per mezzo di membri accessibili o attraverso l'esposizione di propri componenti. Per esempio ponendo funzioni di supporto, regular expression o costanti nelle proprie factory o costanti.

**[Torna all'inizio](#table-of-contents)**

## Moduli

### Evitare la collisione di nomi

  - Usa una convenzione unica per i nomi con separatori per sotto moduli. 

  *Perché?*: Nomi unici aiutano ad evitare la collisione di nomi dei moduli. I separatori aiutano a definire gerarchie di moduli e dei propri sotto moduli. Per esempio `app` potrebbe essere il modulo principale mentre `app.dashboard` e `app.users` potrebbero essere moduli che sono usati come dipendenze di `app`. 

### Definizioni (altrimenti noti come Setter)

  - Dichiara moduli senza una variabile usando la sintassi setter.

    *Perché?*: con 1 componente per file, raramente c'è la necessità di introdurre una variabile per il modulo.
	
  ```javascript
  /* evitare */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

	Invece usa la più semplice sintassi setter.

  ```javascript
  /* raccomandato */
  angular
    	.module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getter

  - Usando un modulo, evita l'uso di una variabile e piuttosto usa la concatenazione con la sintassi getter.

	*Perché?* : Ciò produce un codice maggiormente leggibile ed evita la collisione di veriabili o buchi.

  ```javascript
  /* evitare */
  var app = angular.module('app');
  app.controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

  ```javascript
  /* raccomandato */
  angular
      .module('app')
      .controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

### Setting vs Getting

  - Setta solo una volta e prendi (get) per tutte le altre istanze.
	
	*Perché?*: Un modulo dovrebbe essere crato solamente una volta, quindi recuperato da lì in avanti.
  	  
	  - Usa `angular.module('app', []);` per settare un modulo.
	  - Usa  `angular.module('app');` per prendere (get) un modulo. 

### Funzioni con un nome vs funzioni anonime

  - Usa funzioni che hanno un nome piuttosto che passare una funzione anonima come in una callback.

	*Perché?*: Ciò produce codice maggiormente leggibile, è più facile farne il debug, e riduce la quantità di codice posto dentro una callback.

  ```javascript
  /* evitare */
  angular
      .module('app')
      .controller('Dashboard', function() { });
      .factory('logger', function() { });
  ```

  ```javascript
  /* raccomandato */

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

**[Torna all'inizio](#table-of-contents)**

## Controller

### Sintassi controllerAs nella View

  - Usa la sintassi [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) al posto della sintassi `classico controller con $scope`. 

	*Perché?*: I controller sono costruiti, fatti nuovi e forniti con un nuova istanza singola, inoltre la sintassi `controllerAs` è più somigliante ad un costruttore JavaScript che la `sintassi classica con $scope`. 

	*Perché?*: Promuove l'uso del binding ad un oggetto che "usa il punto" nella View (p.e. `customer.name` invece di `name`), il quale è più contestuale, facile da leggere ed evita qualunque questione di riferimenti che potrebbe accadere senza "uso del punto".

	*Perché?*: Aiuta ad evitare l'uso di chiamate a `$parent` nelle View che hanno controller nidificati.

  ```html
  <!-- evitare -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- raccomandato -->
  <div ng-controller="Customer as customer">
     {{ customer.name }}
  </div>
  ```

### Sintassi controllerAs nel Controller

  - Usa la sintassi `controllerAs` al posto della sintassi `classico controller con $scope`. 

  - La sintassi `controllerAs` usa `this` all'interno dei controller che fanno uso di `$scope`

  *Perché?*: `controllerAs` è una semplificazione sintattica per `$scope`. Puoi ancora fare il binding con la View ed accedere ai metodi di `$scope`.  

  *Perché?*: Aiuta ad evitare la tentazione ad usare i metodi di `$scope` dentro un controller quando sarebbe meglio evitare o spostarli in una factory. Considera l'uso di `$scope` in una factory o, se in un controller, soltanta quando necessario. Per esempio, quando si pubblicano o sottoscrivono eventi usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), o [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considera di spostare questi tipi di utilizzi in una facotry e di invoacarli da un controller. 

  ```javascript
  /* evitare */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* raccomandato - tuttavia vedi la prossima sezione */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs con vm

  - Usa una variabile che "catturi" `this` quando si utilizza la sintassi `controllerAs`. Scegli un nome della variabile consistente come `vm`, che sta per ViewModel.
  
  *Perché?*: La keyword `this` è contestuale e quando usata all'interno di una funzione dentro un controller puà cambiare il proprio contesto. Catturare il contesto di `this` evita di incorrere in questo problema.

  ```javascript
  /* evitare */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* raccomandato */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Nota: Puoi evitare ogni warning di [jshint](http://www.jshint.com/) ponendo il commento sotto riportato al di sopra della linea di codice.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```
   
  Nota: Quando di creano watch in un controller usando `controller as`, puoi fare il watch del membro `vm.*` usando la seguente sintassi. (Crea watch con cautela poiché aggiungono carico al cisclo di digest.)

  ```javascript
  $scope.$watch('vm.title', function(current, original) {
      $log.info('vm.title was %s', original);
      $log.info('vm.title is now %s', current);
  });
  ```

### Membri che possono fare il bind in cima

  - Poni i membri che possono fare il bind in cima al controller, in ordine alfabetico, piuttosto che dispersi in tutto il codice del controller.
  
    *Perché?*: Porre i membri che posso fare il bind in cima rende semplice la lettura e aiuta l'istantanea identificazione di quali membri del controller possono essere collegati ed usati in una View.

    *Perché?*: Settare funzioni anonime nella medesima linea è semplice, tuttavia quando queste funzioni sono più lunghe di 1 linea di codice possono ridurre la leggibilità. Definire le funzione al di sotto i membri che possono fare il bind (funzioni che saranno chiamate) spostano l'implementazione in basso, tengono i membri che possono fare il bind in cima e rendono il codice più facile da leggere. 

  ```javascript
  /* evitare */
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
  /* raccomandato */
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

    ![Controller che usa "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-1.png)

  Nota: Se la funzione è di 1 linea considera di poterla lasciare in cima fino a che la leggibilità non ne è compromessa.

  ```javascript
  /* evitare */
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
  /* raccomandato */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Dichiarazioni di funzione per nascondere i dettagli di omplementazione

  - Usa le dichiarazioni di funzione per nascondere i dettagli di implementazione. Tieni i membri che possono fare il binding in cima. Quando necessiti di fare binding a una funzione nel controller, puntalo ad una dichiarazione di funzione che compaia dopo nel file. Questo è direttamente collegabile con la sezione Membri che possono fare il binding in cima. Per ulteriori dettagli guarda [questo post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) (in inglese).
    
    *Perché?*: Porre i menbri che possono fare il binding in cima rende semplice la lettura ed aiuta l'immediata identificazione dei membri del controller che possono fare il binding ed usati nella View. (Come sopra.)

    *Perché?*: Porre i dettagli di implementazione di una funzione in seguito nel file sposta la complessità fuori dalla vista così che puoi vedere le cose importanti in cima.

    *Perché?*: Dichiarazioni di funzioni che sono chiamate così che non c'è rischio dell'uso di una funzione prima che sia definita (come sarebbe in caso di espressioni di funzione).

    *Perché?*: Non ti devi preoccupare di dichiarazioni di funzione che sposta `var a` prima di `var b` che romperà il codice perché `a` dipende da  `b`.     

    *Perché?*: Con le espressioni di funzione l'ordine è critico. 

  ```javascript
  /** 
   * evitare 
   * Uso di espressioni di funzione.
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

  Nota come le cose importanti, nell'esempio precendete, sono disseminate. Nell'esempio sotto, nota che le cose importanti sono in cima. Per esempio, i membri collegati al controller come `vm.avengers` e `vm.title`. I dettagli di implementazione sono in fondo. Questo è certamente più facile da leggere.

  ```javascript
  /*
   * raccomandato
   * Usare dichiarazione di funzione
   * e mebri che fanno in binding in cima.
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

### Rimandare la logica del Controller

  - Rimandare la logica in un controller delegandola ai service e factory.

    *Perché?*: La logica può essere riutilizata da più controller quando posta in un service ed esposta tramite una funzione.

    *Perché?*: La logica posta in un service può esere più facilmente isolata in una unit test, mentre la call della logica nel controller può essere più facile di farne un mock.

    *Perché?*: Rimuove dipendenze e nasconde dettagli di implementazione dal controller.

  ```javascript
  /* evitare */
  function Order($http, $q) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit() { 
          var orderTotal = vm.total;
          return $http.get('api/creditcheck').then(function(data) {
              var remaining = data.remaining;
              return $q.when(!!(remaining > orderTotal));
          });
      };
  }
  ```

  ```javascript
  /* raccomandato */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit() { 
         return creditService.check();
      };
  }
  ```

### Tenere i controller "a fuoco"

  - Definisci un controller per vista e prova a non utilizzare il controller per altre view. Piuttosto, sposta la logica riutilizzabile alle factory e mantieni il controller semplice ed a fuoco sulla propria view. 
  
    *Perché?*: Riutilizzare i controller con diverse view è precario e sono necessari dei buoni test end to end (e2e) per assicurarne la stabilità in applicazioni su larga scala.

### Assegnazione dei Controller

  - Quando un controller deve essere accoppiato ad una view ed un componente può essere riutilizzato da altri controller o view, definisci i controller insime alle loro route. 
    
    Nota: Se una View è caricata attraverso altri mezzi che una route, allora usa la sintassi `ng-controller="Avengers as vm"`. 

    *Perché?*: Accoppiare il controller in una route consente a route diverse di invocare diversi accoppiamenti di controller e view.Quando i controller sono assegnati in una view usando [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), quella view sarà sempre associata al mendesimo controller.

 ```javascript
  /* evitare - quando usato con una route ed è desiderata una dinamicità negli accoppiamenti */

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
  /* raccomandato */

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

**[Torna all'inizio](#table-of-contents)**

## Service

### Singletons

  - Services are instantiated with the `new` keyword, use `this` for public methods and variables. Since these are so similar to factories, use a factory instead for consistency. 
  
    Nota: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services). This means that there is only one instance of a given service per injector.

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

**[Torna all'inizio](#table-of-contents)**

## Factory

### Single Responsibility

  - Factories should have a [single responsibility](http://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a factory begins to exceed that singular purpose, a new factory should be created.

### Singletons

  - Factories are singletons and return an object that contains the members of the service.
  
    Nota: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services).

### Accessible Members Up Top

  - Expose the callable members of the service (it's interface) at the top, using a technique derived from the [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Perché?*: Placing the callable members at the top makes it easy to read and helps you instantly identify which members of the service can be called and must be unit tested (and/or mocked). 

    *Perché?*: This is especially helpful when the file gets longer as it helps avoid the need to scroll to see what is exposed.

    *Perché?*: Setting functions as you go can be easy, but when those functions are more than 1 line of code they can reduce the readability and cause more scrolling. Defining the callable interface via the returned service moves the implementation details down, keeps the callable interface up top, and makes it easier to read.

  ```javascript
  /* evitare */
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
  /* raccomandato */
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

  - Use function declarations to hide implementation details. Keep your acessible members of the factory up top. Point those to function declarations that appears later in the file. For more details see [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Perché?*: Placing accessible members at the top makes it easy to read and helps you instantly identify which functions of the factory you can access externally.

    *Perché?*: Placing the implementation details of a function later in the file moves that complexity out of view so you can see the important stuff up top.

    *Perché?*: Function declaration are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).

    *Perché?*: You never have to worry with function declarations that moving `var a` before `var b` will break your code because `a` depends on `b`.     

    *Perché?*: Order is critical with function expressions 

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

**[Torna all'inizio](#table-of-contents)**

## Data Service

### Separate Data Calls

  - Refactor logic for making data operations and interacting with data to a factory. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    *Perché?*: The controller's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the controller be simpler and more focused on the view.

    *Perché?*: This makes it easier to test (mock or real) the data calls when testing a controller that uses a data service.

    *Perché?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as $http. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a controller), also making it easier to change the implementation.

  ```javascript
  /* raccomandato */

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
    
    Nota: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.

  ```javascript
  /* raccomandato */

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

  - When calling a data service that returns a promise such as $http, return a promise in your calling function too.

    *Perché?*: You can chain the promises together and take further action after the data call completes and resolves or rejects the promise.

  ```javascript
  /* raccomandato */

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

    **[Torna all'inizio](#table-of-contents)**

## Directive
### Limit 1 Per File

  - Create one directive per file. Name the file for the directive. 

    *Perché?*: It is easy to mash all the directives in one file, but difficult to then break those out so some are shared across apps, some across modules, some just for one module. 

    *Perché?*: One directive per file is easy to maintain.

  ```javascript
  /* evitare */
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
  /* raccomandato */
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
  /* raccomandato */
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
  /* raccomandato */
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

    Nota: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and it's file name distinct and clear. Some examples are below, but see the naming section for more recommendations.

### Limit DOM Manipulation

  - When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow. 

    *Perché?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

### Provide a Unique Directive Prefix

  - Provide a short, unique and descriptive directive prefix such as `acmeSalesCustomerInfo` which is declared in HTML as `acme-sales-customer-info`.

    *Perché?*: The unique short prefix identifies the directive's context and origin. For example a prefix of `cc-` may indicate that the directive is part of a CodeCamper app while `acme-` may indicate a directive for the Acme company. 

    Nota: Avoid `ng-` as these are reserved for AngularJS directives.Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/). 

### Restrict to Elements and Attributes

  - When creating a directive that makes sense as a standalone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when its standalone and as an attribute when it enhances its existing DOM element.

    *Perché?*: It makes sense.

    *Perché?*: While we can allow the directive to be used as a class, if the directive is truly acting as an element it makes more sense as an element or at least as an attribute.

    Nota: EA is the default for AngularJS 1.3 +

  ```html
  <!-- avoid -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* evitare */
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
  /* raccomandato */
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

  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    *Perché?*: It makes sense and it's not difficult.

    Nota: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place. 

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

      ExampleController.$inject = ['$scope'];
      function ExampleController($scope) {
          // Injecting $scope just for comparison
          /* jshint validthis:true */
          var vm = this;

          vm.min = 3; 
          vm.max = $scope.max; 
          console.log('CTRL: $scope.max = %i', $scope.max);
          console.log('CTRL: vm.min = %i', vm.min);
          console.log('CTRL: vm.max = %i', vm.max);
      }

      function linkFunc(scope, el, attr, ctrl) {
          console.log('LINK: scope.max = %i', scope.max);
          console.log('LINK: scope.vm.min = %i', scope.vm.min);
          console.log('LINK: scope.vm.max = %i', scope.vm.max);
      }
  }
  ```

  ```html
  /* example.directive.html */
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[Torna all'inizio](#table-of-contents)**

## Risoluzioni di promesse per un controller

### Controller Activation Promises

  - Resolve start-up logic for a controller in an `activate` function.
     
    *Perché?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    Nota: If you need to conditionally cancel the route before you start use the controller, use a route resolve instead.
    
  ```javascript
  /* evitare */
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
  /* raccomandato */
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

  - When a controller depends on a promise to be resolved, resolve those dependencies in the `$routeProvider` before the controller logic is executed. If you need to conditionally cancel a route before the controller is activated, use a route resolver.

    *Perché?*: A controller may require data before it loads. That data may come from a promise via a custom factory or [$http](https://docs.angularjs.org/api/ng/service/$http). Using a [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) allows the promise to resolve before the controller logic executes, so it might take action based on that data from the promise.

  ```javascript
  /* evitare */
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
        /* jshint validthis:true */
        var vm = this;
        vm.movies = moviesPrepService.movies;
  }
  ```

    Nota: The code example's dependency on `movieService` is not minification safe on its own. For details on how to make this code minification safe, see the sections on [dependency injection](#manual-annotating-for-dependency-injection) and on [minification and annotation](#minification-and-annotation).

**[Torna all'inizio](#table-of-contents)**

## Annotazioni manuali per la Dependency Injection

### UnSafe from Minification

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.
  
    *Perché?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

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

  - Use `$inject` to manually identify your dependencies for AngularJS components.
  
    *Perché?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

    *Perché?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    *Perché?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function. 

    ```javascript
    /* evitare */
    angular
        .module('app')
        .controller('Dashboard', 
            ['$location', '$routeParams', 'common', 'dataservice', 
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);      
    ```

    ```javascript
    /* evitare */
    angular
      .module('app')
      .controller('Dashboard', 
         ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* raccomandato */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Nota: When your function is below a return statement the $inject may be unreachable (this may happen in a directive). You can solve this by either moving the $inject above the return statement or by using the alternate array injection syntax. 

    Nota: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduced a feature where it moves the `$inject` to where it is reachable.

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

  - Use $inject to manually identify your route resolver dependencies for AngularJS components.
  
    *Perché?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

    *Perché?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

    ```javascript
    /* raccomandato */
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

**[Torna all'inizio](#table-of-contents)**

## Minificazione e Annotazioni

### ng-annotate

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/** @ngInject */`
  
    *Perché?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

    *Perché?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated 

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

    Nota: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

    Nota: When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

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

    > Nota: Starting from AngularJS 1.3 use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code.
    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate

  - Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
    *Perché?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

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

**[Torna all'inizio](#table-of-contents)**

## Gestione delle eccezzioni

### decorators

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.
  
    *Perché?*: Provides a consistent way to handle uncaught AngularJS exceptions for development-time or run-time.

    Nota: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

  	```javascript
    /* raccomandato */
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

  - Create a factory that exposes an interface to catch and gracefully handle exceptions.

    *Perché?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

    Nota: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

    ```javascript
    /* raccomandato */
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

  - Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Perché?*: Provides a consistent way handle all routing errors.

    *Perché?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or  recovery options.

    ```javascript
    /* raccomandato */
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

**[Torna all'inizio](#table-of-contents)**

## Dare i nomi

### Naming Guidelines

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    *   the file name (`avengers.controller.js`)
    *   the registered component name with Angular (`AvengersController`)
 
    *Perché?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Perché?*: The naming conventions should simply help you find your code faster and make it easier to understand. 

### Feature File Names

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`.

    *Perché?*: Provides a consistent way to quickly identify components.

    *Perché?*: Provides pattern matching for any automated tasks.

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

  Nota: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team.

    ```javascript
    /**
     * recommended
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Test File Names

  - Name test specifications similar to the component they test with a suffix of `spec`.  

    *Perché?*: Provides a consistent way to quickly identify components.

    *Perché?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

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

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    *Perché?*: Provides a consistent way to quickly identify and reference controllers.

    *Perché?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

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

  - Append the controller name with the suffix `Controller` or with no suffix. Choose 1, not both.

    *Perché?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

    *Perché?*: Omitting the suffix is more succinct and the controller is often easily identifiable even without the suffix.

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

  - Use consistent names for all factories named after their feature. Use camel-casing for services and factories.

    *Perché?*: Provides a consistent way to quickly identify and reference factories.

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

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    *Perché?*: Provides a consistent way to quickly identify and reference components.

    ```javascript
    /**
     * recommended
     */

    // avenger.profile.directive.js    
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Modules

  -  When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`. A single module app might be named `app.js`, omitting the module moniker.

    *Perché?*: An app with 1 module is named `app.js`. It is the app, so why not be super simple.
 
    *Perché?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *Perché?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *Perché?*: Separates configuration from module definition, components, and active code.

    *Perché?*: Provides a identifiable place to set configuration for a module.

### Routes

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration. An alternative is a longer name such as `admin.config.route.js`.

**[Torna all'inizio](#table-of-contents)**

## Principio "LIFT" per la struttura dell'applicazione
### LIFT

  - Structure your app such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should follow these 4 basic guidelines. 

    *Why LIFT?*: Provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When I find my structure is not feeling comfortable, I go back and revisit these LIFT guidelines
  
    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

### Locate

  - Make locating your code intuitive, simple and fast.

    *Perché?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly,  they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

  - When you look at a file you should instantly know what it contains and represents.

    *Perché?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *Perché?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)

  - Be DRY, but don't go nuts and sacrifice readability.

    *Perché?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it. 

**[Torna all'inizio](#table-of-contents)**

## Struttura dell'applicazione

### Overall Guidelines

  -  Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    Nota: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions. 

    *Perché?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed. 

    *Perché?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names. 

    *Perché?*: The LIFT guidelines are all covered.

    *Perché?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *Perché?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

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

      Nota: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

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

**[Torna all'inizio](#table-of-contents)**

## Modularità
  
### Many Small, Self Contained Modules

  - Create small modules that encapsulate one responsibility.

    *Perché?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally.  This means we can plug in new features as we develop them.

### Create an App Module

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *Perché?*: AngularJS encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Perché?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

### Feature Areas are Modules

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Perché?*: Self contained modules can be added to the application will little or no friction.

    *Perché?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Perché?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code. 

### Reusable Blocks are Modules

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Perché?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies

  - The application root module depends on the app specific feature modules, the feature modules have no direct dependencies, the cross-application modules depend on all generic modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Perché?*: The main app module contains a quickly identifiable manifest of the application's features. 

    *Perché?*: Cross application features become easier to share. The features generally all rely on the same cross application modules, which are consolidated in a single module (`app.core` in the image).

    *Perché?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Nota: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind. 

**[Torna all'inizio](#table-of-contents)**

## Logica di Startup

### Configuration
  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidaes include providers and constants.

    *Why?:* This makes it easier to have a less places for configuration.

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

  - Any code that needs to run when an application starts should be declared in a factory, exposed via a function, and injected into the [run block](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Perché?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Torna all'inizio](#table-of-contents)**

## Wrapper dei Servizi $ di Angular

### $document and $window

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Perché?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Perché?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Torna all'inizio](#table-of-contents)**

## Test
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Perché?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

    ```javascript
    it('should have Avengers controller', function() {
        //TODO
    });

    it('should find 1 Avenger when filtered by name', function() {
        //TODO
    });

    it('should have 10 Avengers', function() {}
        //TODO (mock data?)
    });

    it('should return Avengers via XHR', function() {}
        //TODO ($httpBackend?)
    });

    // and so on
    ```

### Testing Library

  - Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://visionmedia.github.io/mocha/) for unit testing.

    *Perché?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Nota: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

### Test Runner

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Perché?*: Karma is easy to configure to run once or automatically when you change your code.

    *Perché?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Perché?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Perché?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing and Spying

  - Use Sinon for stubbing and spying.

    *Perché?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Perché?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

### Headless Browser

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Perché?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server. 

    Nota: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis

  - Run JSHint on your tests. 

    *Perché?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *Perché?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Torna all'inizio](#table-of-contents)**

## Animazioni

### Usage

  - Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Perché?*: Subtle animations can improve User Experience when used appropriately.

    *Perché?*: Subtle animations can improve perceived performance as views transition.

### Sub Second

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.  

    *Perché?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Perché?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Perché?*: Provides consistency in your animations.

    *Perché?*: animate.css is widely used and tested.

    Nota: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Torna all'inizio](#table-of-contents)**

## Commenti

### jsDoc

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *Perché?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Perché?*: Provides consistency using a common industry tool.

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

**[Torna all'inizio](#table-of-contents)**

## JS Hint

### Use an Options File

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

    *Perché?*: Provides a first alert prior to committing any code to source control.

    *Perché?*: Provides consistency across your team.

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

**[Torna all'inizio](#table-of-contents)**

## Costanti

### Vendor Globals

  - Create an AngularJS Constant for vendor libraries' global variables.

    *Perché?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

**[Torna all'inizio](#table-of-contents)**

## File Template e Snippet
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text

  - AngularJS snippets that follow these styles and guidelines. 

    - Download the [Sublime Angular snippets](assets/sublime-angular-snippets.zip) 
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

  - AngularJS file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm

  - AngularJS snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    - Download the [WebStorm AngularJS file templates and snippets](assets/webstorm-angular-file-template.settings.jar) 
    - Open WebStorm and go to the `File` menu
    - Choose the `Import Settings` menu option
    - Select the file and click `OK`
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

**[Torna all'inizio](#table-of-contents)**

## Documentazione di AngularJS
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contribuire

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

### Process
    1. Discuss the changes in an Issue. 
    1. Open a Pull Request, reference the issue, and explain the change and why it adds value.
    1. The Pull Request will be evaluated and either merged or declined.

## Licenza

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

**[Torna all'inizio](#table-of-contents)**
