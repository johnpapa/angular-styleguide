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
  1. [Nomenclatura](#naming)
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

### Singleton

  - I Service sono instanziati con la keyword  `new`, usa `this` per metodi e variabili pubbliche. Dal momento che sono molto simili alle factory, usa queste ultime per consistenza. 
  
    Nota: [Tutti i servizi di AngularJS sono singleton](https://docs.angularjs.org/guide/services). Questo significa che c'è soltanto una istanza di un dato servizio per iniettore.

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

### Singola responsabilità 

  - Le factory dovrebbero avere la [singola responsabilità](http://en.wikipedia.org/wiki/Single_responsibility_principle) che è incapsulata nel proprio contesto. Una volta che una factory eccede quello che è un sigolo scopo, una nuova facotry dovrebbe essere creata.

### Singleton

  - Le factory sono singleton e ritornano un oggetto che contiene i membri del servizio.
  
    Nota: [Tutti i servizi di AngularJS sono singleton](https://docs.angularjs.org/guide/services).

### Membri accessibili in cima

  - Esponi tutti i membri richiamabili del servizio (l'interfaccia) in cima, usando una tecnica derivata dal [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Perché?*: Porre i membri richiamabili in cima lo rende semplice da leggere e aiuta ad identificare istantaneamente quali membri del servizio possono essere richiamati ed essere oggetto di unit test (e/o simulati). 

    *Perché?*: Questo è particolarmente utile quando i file iniziano ad allungarsi così come aiuta la necessità di scorrere per leggere cosa è esposto.

    *Perché?*: Settare funzioni mentre procedi può essere facile ma quando tali funzioni sono più lunghe di 1 linea di codice possono ridurre la leggibilità e causare maggiore scorrimento. Definire l'interfaccia richiamabile attraverso i servizi ritornati sposta i dettagli di implementazione in basso, tiene l'interfaccia richiamabile in cima e rende più facile al lettura.

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

  In questo modo i binding si riflettono in tutto l'oggetto host, i valori di base non possono essere solamente aggiornati usando il revealing module pattern.


    ![Factory che usano "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Dichiarazioni di funzione per nascondere i dettagli di implementazione

  - Usa le dichiarazioni di funzioni per nascondere i dettagli di implementazione. Tieni i membri accessibili della facotry in cima. Puntali alle dichiarazioni di funzioni che compaiono dopo nel file. Per ulteriori dettagli guarda [questo post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) (in inglese).

    *Perché?*: Porre i membri richiamabili in cima lo rende semplice da leggere e aiuta ad identificare istantaneamente quali funzioni della factory possono accessibili esternamente. 

    *Perché?*: Porre i dettagli di implementazione di una funzione dopo nel file sposta la complessità fuori dalla vista così che puoi vedere le cose importanti in cima.

    *Perché?*: Le dichiarazioni di funzione sono richiamate così da non avere preoccupazioni circa l'uso di una funzione prima della sua definizione (come sarebbe nel caso di espressioni di funzione).

    *Perché?*: Non dovrai mai preoccuparti di dichiarazioni di funzione che spostano `var a` prima di `var b` rompendo il codice perché `a` dipende da `b`.     

    *Perché?*: Con le espressioni di funzione l'ordine è critico. 

  ```javascript
  /**
   * evita
   * Uso di espressioni di funzioni
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // dettagli di implementazione vanno qui
      };

      var getAvengerCount = function() {
          // dettagli di implementazione vanno qui
      };

      var getAvengersCast = function() {
          // dettagli di implementazione vanno qui
      };

      var prime = function() {
          // dettagli di implementazione vanno qui
      };

      var ready = function(nextPromises) {
          // dettagli di implementazione vanno qui
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
   * raccomandato
   * Uso di dichiarazioni di funzioni
   * e membri accessibili in cima.
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
          // dettagli di implementazione vanno qui
      }

      function getAvengerCount() {
          // dettagli di implementazione vanno qui
      }

      function getAvengersCast() {
          // dettagli di implementazione vanno qui
      }

      function prime() {
          // dettagli di implementazione vanno qui
      }

      function ready(nextPromises) {
          // dettagli di implementazione vanno qui
      }
  }
  ```

**[Torna all'inizio](#table-of-contents)**

## Data Service

### Separare le chiamate ai dati

  - Rivedi la logica per gestire le oprazioni con i dati e con la loro interazione delegandola ad una factory.

    *Perché?*: La responsabilità del controller è per la presentazione e raccolta di informazioni dalla view. Non dovrebbe occuparsi di come recuperare i dati, soltanto sapere a chi chiederli. La separazione dei servizi per i dati sposta la logica su come reperirli al servizio dei dati, rendendo il controller più semplice e più focalizzato sulla view.


    *Perché?*: Ciò rende più semplice da testare (vere o simulate) le chiamate ai dati quando si testa un controller che usa un servizio ai dati.

    *Perché?*: L'implementazione di un serzio ai dati può avere del codice molto specifico su come trattare i repository dei dati. Questo può includere header, come comunicare con i dati o altri servizi quali $http. Separare la logica in un servizio ai dati incapsula questa logica in un posto unico nascondendo l'implementazione ai consumatori esterni (forse un controller), rendendo inoltre più semplice cambiarne l'implementazione.

  ```javascript
  /* raccomandato */

  // factory del servizio ai dati 
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
    
    Nota: Il servizio ai dati è chiamato dai consumatori, come un controller, nascondendo l'implementazione ai consumatori, come mostrato sotto.

  ```javascript
  /* raccomandato */

  // controller che chiama la factory del servizio ai dati
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

### Ritornare una promessa dalle chiamate ai dati

  - Quando si chiama un servizio ai dati che ritorna una promessa come $http, ritorna a tua volta una promessa nella tua funzione di chiamata.

    *Perché?*: Puoi concatenare le promesse insieme e prendere ulteriori azioni dopo che la chiamata ai dati è completata e risolvere o rigettare la promessa.

  ```javascript
  /* raccomandato */

  activate();

  function activate() {
      /**
       * Passo 1
       * Chiedi alla funzione getAvengers per i
       * dati sugli avenger e aspetta la promessa
       */
      return getAvengers().then(function() {
		 /**
           * Passo 4
           * Produci un'azione sulla risoluzione della promessa conclusiva
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Passo 2
         * Chiedi al servizio i dati e aspetta
         * la promessa
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Passo 3
                 * set the data and resolve the promise setta i dati e risolvi la promessa
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Torna all'inizio](#table-of-contents)**

## Directive
### Limite di 1 per file

  - Crea una directive per file. Nomina il file per la directive.  

    *Perché?*: È facile mescolare tutte le directive in un unico file ma difficoltoso da separarle così che alcune siano condivise tra le applicazioni, alcune tra moduli, altre solo per un module. 

    *Perché?*: Una directive per file è semplice da manutenere.

  ```javascript
  /* evitare */
  /* directives.js */

  angular
      .module('app.widgets')

      /* directive di ordini che è specifica per il modulo degli ordini */
      .directive('orderCalendarRange', orderCalendarRange)

      /* directive delle vendite che può essere usata dovunque nelle app di vendita */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* dirctive dello spinner che può essere usata dovunque nelle app */
      .directive('sharedSpinner', sharedSpinner);


  function orderCalendarRange() {
      /* dettagli di implementazione */
  }

  function salesCustomerInfo() {
      /* dettagli di implementazione */
  }

  function sharedSpinner() {
      /* dettagli di implementazione */
  }
  ```

  ```javascript
  /* raccomandato */
  /* calendarRange.directive.js */

  /**
   * @desc directive di ordini che è specifica al modulo ordini in una azienda di nome Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* dettagli di implementazione */
  }
  ```

  ```javascript
  /* raccomandato */
  /* customerInfo.directive.js */

  /**
   * @desc directive dello spinner che può essere usato docunque nella applicazione di vendita di una azienda di nome Acme
   * @example <div acme-sales-customer-info></div>
   */    
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* dettagli di implementazione */
  }
  ```

  ```javascript
  /* raccomandato */
  /* spinner.directive.js */

  /**
   * @desc directive dello spinner che può essere usato docunque nella applicazione di vendita di una azienda di nome Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* dettagli di implementazione */
  }
  ```

    Nota: Ci sono molte opzioni per i nomi delle directive, in particolare dal momento che possono essere usate in ambiti stretti o largi. Scegline uno che sia chiaro e distino che dia senso alla directive e il suo nome del file. Alcuni esempi sono sotto ma vedi la sezione sulla nomenclatura per maggiori raccomandazioni.

### Limiti alla manipolazione del DOM

  - Quando devi manipolare direttamente il DOM, usa una directive. Se possono essere usate delle alternative come settare stili CSS o i [servizi di animazione](https://docs.angularjs.org/api/ngAnimate), templating di Angular, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) oppure [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), piuttosto usa questi. Per esempio, se la directive semplicemente nasconde e mostra, usa ngHide/ngShow. 

    *Perché?*: Manipolare il DOM può essere difficoltoso da testare, debuggare e spesso ci sono modi migliori (p.e. CSS, animazioni, template)

### Utilizza un prefisso unico per la Directive

  - Utilizza un corto, unico e descrittico prefizzo alla directive come `acmeSalesCustomerInfo` che è dichiarato in HTML come `acme-sales-customer-info`.

	*Perché?*: L'unico breve prefisso identifica il contesto delle directive e l'origine. Per esempio un prefisso `cc-` potrebbe indicare che la directive è parte di una app CodeCamper mentre `acme-` potrebbe indicare una direttiva per l'azienda Acme. 
 
	Nota: Evita `ng-` poiché queste sono riservate per le directive di AngularJS. Cerca directive che sono largamente utilizzate per evitare il conflitto di nomi, come `ion-` per il [Framework Ionic ](http://ionicframework.com/). 

### Restringi a Elementi and Attributi

  - Quando crei una directive che abbia senso come elemento a se stante, considera la restrizione a `E` (elemento custom) e facoltativamente restringere a `A` (attributo custom). In generale, se può essere il suo stesso controllo, `E` è appropriato. Le linee guida generali sono di permettere `EA` ma tendono verso l'implementazione come un elemento quando è a se stante e come attributo quando accresce il proprio elemento DOM esistente.

    *Perché?*: È sensato.

    *Perché?*: Mentre è possibile consentire che la directive sia usata come una classe, se questa agisce davvero con un elemento è più sensato usarla un elemento o al meno come un attributo.

    Nota: EA è il default per AngularJS 1.3 e successivi

  ```html
  <!-- evitare -->
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
  <!-- raccomandato -->
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

### Directive e ControllerAs

  - USa la sintassi `controller as` con una directive per essere consistente con l'utilizzo di `controller as` con una coppia di view e controller.

    *Perché?*: È sensato e non è difficile.

    Nota: Le directive sotto dimostrano alcuni dei modi in cui puoi usare lo scope all'interno di link e controller di directive usando controllerAs. Ho usato sulla stessa linea il template solo per mettere tutto in un unico posto. 

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
          // Iniettare $scope solo per confronto
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

### Promesse di attivazione di un Controller

  - Risolvi la lofica di start-up per un controller in una funzione `activate`.
     
    *Perché?*: Porre la logica di start-up in una posizione consistente nel controller la rende semplice da localizzare, più consistente da testare e aiuta a precenire la diffusione di logica su tutto il controller.

    Nota: Se hai necessità di annullare condizionalmente il route prima di inziare ad usare il controller, usa piuttosto una risoluzione nella route.
    
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

### Promesse risolte nel route

  - Quando un controller dipende dalla dal fatto che una promessa sia risoltam risolvi queste dipendenze nel `$routeProvider` prima che la logica del controller sia eseguita. Se hai bisogno di annullare condizionalmente una route prima che il controller sia attivato, usa un resolver della route.

    *Perché?*: Un controller può richiedere dei dati prima che si carichi. Quei dati potrebbero venire da una promessa di una factory su misura oppure [$http](https://docs.angularjs.org/api/ng/service/$http). Usando un [resolver della route](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) aconsenti che la promessa sia risolta prima che la logica del controller sia eseguita, così da poter prendere decisioni basandosi sui dati provenienti dalla promessa.

  ```javascript
  /* evitare */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // non risolta
      vm.movies;
      // risolta in modo asincrono
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }
  ```

  ```javascript
  /* migliore */

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

    Nota: La dipendenza del codice di esempio da `movieService` non è a prova di minificazione in se stessa. Per i dettagli su come rendere questo codice a prova di minificazione, vedi la sezione sulla [dependency injection](#manual-annotating-for-dependency-injection) e sulla [minificazione e annotazione](#minification-and-annotation).

**[Torna all'inizio](#table-of-contents)**

## Annotazioni manuali per la Dependency Injection

### Non sicuro per la minificazione

  - Evita di usare abbrevizioni sintattiche per la dichiarazione di dipendenze senza usara un approccio a prova di minificazione.
  
    *Perché?*: I paramentri dei componenti (p.e. controller, factory, etc) saranno convertiti in variabili dal nome ridotto. Per esempio, `common` e `dataservice` potrebbero diventare `a` o `b` e non essere piò ritrovate da AngularJS.

    ```javascript
    /* evita - non a prova di minificazione*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Questo codice può produrre variabili da nome ridotto e perciò causare errori a runtime.

    ```javascript
    /* evita - non a prova di minificazione*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Indentificazione manuale delle dipendenze

  - Usa `$inject` per identificare manualemmnte le tue dipendenze per i componenti di AngularJS.
  
    *Perché?*: Questa tecnica rispecchia la tecnica usata da [`ng-annotate`](https://github.com/olov/ng-annotate), che raccomando per l'automazione della creazione della minificazione che sia a sicura per le dipendenze. Se `ng-annotate` rileva che una iniezione è stata fatta, non la duplicherà.

    *Perché?*: Questo salavguarda le tue dipendenze dal essere vulnerabili alla questione della minificazione quando i parametri possono essere passati con nomi ridotti. Per esempio, `common` e `dataservice` possono divetare `a` o `b` e non essere più trovati da AngularJS.

    *Perché?*: Evita la creazione di dipendenze sulla stessa linea dal momente che lunghe liste possono essere difficili da leggere nell'array. Inoltre può essere furviante che l'array è una serie di stringhe mentre l'ultimo elemento è una funzione. 

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

    Nota: Quando la tua funzione si trova sotto una dichiarazione di return, $inject potrebbe essere non raggiungibile (ciò può accadere in una directive). Puoi ricolvere ciò sia spostando l'$inject sopra la dichiarazione di return oppure usando la sintassi di array di iniezione alternativa.  

    Nota: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduce una caratteristica che sposta l'`$inject`  dove è raggiungibile.

    ```javascript
    // dentro la definizione di una directive
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
    // dentro la definizione di una directive
    function outer() {
        DashboardPanel.$inject = ['logger']; // reachable
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Intetificazione manuale delle dipendenze di resolver della route

  - Usa $inject per identificare manualmente le tue dipendenze di resolver della route per i componenti di AngularJS.
  
    *Perché?*: Questa tecnica evade le funzioni anonime per il di resolver della route, rendendolo più semplice da leggere.

    *Perché?*: Una dichiarazione `$inject` può facilmente precedere il resolver della route per gestistire la produzione di dipendenze che siano a prova di minificazione.

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

  - Usa [ng-annotate](//github.com/olov/ng-annotate) per [Gulp](http://gulpjs.com) o [Grunt](http://gruntjs.com) e commenta le funzioni che necessitano di automatizzare il dependency injection usando `/** @ngInject */`
  
    *Perché?*: Questo salvaguarda il tuo codice da ogni dipendenza che non segua le pratiche a prova di minificazione

    *Perché?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated
    *Perché?*: [`ng-min`](https://github.com/btford/ngmin) è deprecato.  

    >Preferisco Gulp poiché lo ritengo più semplice da scrivere, leggere e fare il debug.

    Il codice che segue non usa dipendeze che sono a prova di minificazione.

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

    Quando il codice soprastante è eseguito da ng-annotate procude il seguente output con l'annotazione `$inject` e diventa a prova di minificazione.

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

    Nota: Se `ng-annotate` rileva che l'iniezione è già stata fatta (p.e. `@ngInject` è stato rilevato), non duplicherà il codice di `$inject`.

    Nota: Quando si usa un resolver della route, puoi fare precedere il resolver della funzione con `/* @ngInject */` e ciò produrrà codice opportunamento annotato, mantenendo ogni iniezione delle dipendenze a prova di minificazione.

    ```javascript
    // Usare l'annotazione @ngInject
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

    > Nota: A partire da AngularJS 1.3 usa il paramettro `ngStrictDi` della directive [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp). Quando presente, l'iniettore sarà creato in modalità "strict-di" causando il fallimento dell'invocazione di funzioni che non fanno uso esplicito di annotazione delle funzioni da parte dell'applicazione (queste potrebbero non essere a prova di minificazione). Informazioni di debug saranno mostrate nella console per aiutare nel tracciare il codice non confacente.
    `<body ng-app="APP" ng-strict-di>`

### Usa Gulp o Grunt per ng-annotate

  - Usa [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) o [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in un task di build automatizzato. Inietta `/* @ngInject */` prima di qualunque funzione che abbia delle dipendenze.
  
    *Perché?*: ng-annotate carpirà la maggior parte delle dipendenze ma talvolta necessita dell'uso del suggerimento sintattico `/* @ngInject */`.

    Il seguente codice è un esempio di un task di gulp che utilizza ngAnnotate.

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;
        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Annota prima di fare l'uglify così che il codice sarà minificato correttamente.
            .pipe(ngAnnotate({
                // true aiuta ad aggiunge @ngInject dove non usato. Inferisce.
                // Non funzione con resolve, quindi deve essere esplicitato qui
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

### decoratori (decorator)

  - Usa un [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), al momento del config una un servizio [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), sul servizio [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) per eseguire azioni ad hoc quando l'eccezione occorre.
  
    *Perché?*: Fornisci un modo consistente per la gestione delle eccezioni che non trattate da AngularJS sia durante lo sviluppo che a runtime.

    Nota: Un'altra opzione è di fare l'override del servizio invece che usare un decorator. Questa è una buona opzione ma se vuoi tenere il comportamento di default ed estenderlo un decorator è consigliato.

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
             * Potresti aggiungere l'errore ad una collezione del servizio,
             * aggiungere l'errore a $rootScope, fare il log degli errori ad un server web remoto,
             * oppure farlo localmente. O lanciare l'eccezione solamente. Sta del tutto a te.
             * lancia l'eccezione;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  	```

### Ricevitore di eccezioni

  - Crea una factory che espone un'interfaccia per ricevere ee elegantemente gestire le eccezioni.

    *Perché?*: Fornisce un modo consistente di rivecere le eccezioni che possono essere lanciate nel tuo codice (p.e. durante una chiamata XHR o il fallimento di promesse).

    Nota: Il ricevitore di eccezioni è buopno per ricevere e reagire a specifiche eccezioni da chiamate che sai ne possono generare una. Per esempio, quando fai una chiamata XHR per il recupero di dati da un servizio di un server web remoto e vuoi ricevere qualsiasi eccezione da ciò e reagire univocamente.

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

### Errori di routing

  - Gestisti e fai il log di tutti gli errori di routing usando [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Perché?*: Fornisce un modo consistente di gestire tutti gli errori di routing.

    *Perché?*: Potenzialmente fornisce una migliore esperienza all'utente se si verifica un errore di routing e li puoi indirizzare ad una schermata di aiuto o con opzioni di recupero.

    ```javascript
    /* raccomandato */
    function handleRoutingErrors() {
        /**
         * Annullamento del route:
         * Su un errore di routing, vai alla dashboard.
         * Fornisci una clausola di uscita se tenta di farlo per una seconda volta.
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
                /**
                 * A scelta fai il log usando un servizio ad hoc o $log.
                 * (Non dimenticare di iniettare il servizio ad hoc)
                 */
                logger.warning(msg, [current]);
            }
        );
    }
    ```

**[Torna all'inizio](#table-of-contents)**

## Nomenclatura

### Linee guida per assegnare i nomi

  - Usa nomi consistenti per tutti i componenti seguendo uno schema che descriva le funzionalità dei componenti e poi (a scelta) il suo tipo. Lo schema che consiglio è `feature.type.js`. Ci sono 2 nomi per la maggior parte dei componenti:
    *   il nome del file (`avengers.controller.js`)
    *   il nome del componente registrato con Angular (`AvengersController`)
 
    *Perché?*: Convezioni sui nomi aiutano a fornire un modo consistente per trovate i contenuti a colpo d'occhio. Essere consisteni in un progetto è vitale. Essere consistenti in un team è importante. Essere consistenti nell'insieme di un'azienda è tremendamente efficiente.

    *Perché?*: Le convezioni sulla nomenclatura dovrebbe semplicemente aiutare a trovare il tuo codice più rapidamente e renderlo più semplice da comprendere. 

### Nomi dei file per funzionalità

  - Usa nomi consistenti per tutti i componenti seguendo uno schema che descriva le funzionalità dei componenti e poi (a scelta) il suo tipo. Lo schema che consiglio è `feature.type.js`.

    *Perché?*: Fornisce un modo consistente per identificare facilmente i componenti.

    *Perché?*: Fornisce uno schema di corrispondenza per qualsiasi processo di automatizzazione.

    ```javascript
    /**
     * opzioni compuni 
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
     * raccomandato
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

  Nota: Un'altra concenzione comune è dare il nome al file del controller senza la parola `controller` nel nome del file come `avengers.js` invece di `avengers.controller.js`. Tutte le altre convenzioni continuano ancora a mantenere il suffisso del tipo. I controller sono i tipi di componenti più comuni perciò questo risparmia digitazione continuando ad essere facilmente identificabili. Consiglio di scegliere 1 convenzione e rimanere consistente nel tuo team.

    ```javascript
    /**
     * raccomandato
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Nomi dei file di test

  - Nomina le specifiche dei test in modo similare al componente che testano aggiundendo il suffisso `spec`.   

    *Perché?*: Fornisce un modo consistente per identificare facilmente i componenti.

	*Perché?*: Fornisce uno schema di corrispondeza per [karma](http://karma-runner.github.io/) o altri esecutori di test.

    ```javascript
    /**
     * raccomandato
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Nomi dei controller

  - Usa nomi consistenti per tutti i controller nominandoli come le loro funzionalità. Usa UpperCamelCase per i constroller, dal momento che sono costruttori.

    *Perché?*: Fornisce un modo consistente per identificare e referenziare facilmente i controller.

    *Perché?*: UpperCamelCase è una convezione per identificare un oggetto che può essere instanziato usando un costruttore.

    ```javascript
    /**
     * raccomandato
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```
    
### Suffisso nel nome di un controller

  - Aggiungi `Controller` alla fine del nome del controller o no. Segline 1 non entrambi.

    *Perché?*: Il suffisso `Controller` è quello più comunemente usato ed è più esplicitamente descrittivo.

    *Perché?*: L'omissione del sufficco è più coinciso ed il controller è spesso facilmente indentificabile anche senza suffisso.

    ```javascript
    /**
     * raccomandato: Opzione 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers(){ }
    ```

    ```javascript
    /**
     * raccomandato: Opzione 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Nomi delle factory

  - Usa una nomenclatura consistente per tutte le factory dando i nomi date le loro funzionalità. Usa il camel-case per service e factory.

    *Perché?*: Fornisce un modo consistente per identificare facilmente e referenziare le factory.

    ```javascript
    /**
     * raccomandato
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

### Nomi dei componenti directive

  - Usa nomi consistenti per putte le directive usando il camel-case. Usa un breve previsso che descriva l'area alla quale la directive appartiene (alcuni esempi sono presiffi relativi all'azienda o al progetto).

    *Perché?*: Fornisce un modo consistente per identificare e referenziare facilmente i componenti.

    ```javascript
    /**
     * raccomandato
     */

    // avenger.profile.directive.js    
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Moduli

  -  Quando di sono moduli multipli, il modulo principale è nominato come `app.module.js` mentre altri moduli dipendenti prendono i nomi da ciò che rappresentano. Per esempio, un modulo admin è nominato `admin.module.js`. I rispettivi nomi con i quali sono registrati saranno `app` e `admin`. Una app a modulo singolo si chiamerà `app.js`, omettendo l'appellativo module.

    *Perché?*: Una app con 1 modulo si chiama `app.js`. È l'app, quindi perché non estremamente semplice.
 
    *Perché?*: Fornisce consistenza per app che hanno più di un modulo e per poter espandare verso applicazioni a larga scala.

    *Perché?*: Fornisci un modo semplice al fine di usare processi automatici per caricare prima tutte le definizioni di moduli, successivamente tutti gli altri file di Angular (per il bunndling).

### Configurazione

  - Separa la configurazione di un modulo nel proprio file chiamato come il modulo. Un file di configurazione per il modulo principale `app` è chiamato `app.config.js` (o semplicemente `config.js`). Un file di configurazione per un modulo chiamato `admin.module.js` sarà `admin.config.js`.

    *Perché?*: Separa la configurazione dalla definizione, componenti e codice di attivazione del modulo.

    *Perché?*: Fornisci una posiszione identificabile per settare la configurazione di un modulo.

### Route

  - Separa la configurazione delle route nei propri file. Esempi possono essere `app.route.js` per il modulo principale e `admin.route.js` per il modulo `admin`. Anche in piccole app preferisco questa separazione dal resto della configurazione. Una alternativa è un nome più esteso quale `admin.config.route.js`.

**[Torna all'inizio](#table-of-contents)**

## Principio "LIFT" per la struttura dell'applicazione
### LIFT

  - Struttura la tua app tale da poter `L`ocate (localizzare) il codice facilmente, `I`dentify (identificare) il codice con uno sguardo, tenere la stuttura più `F`lattest (piatta) che puoi, e `T`ry (provare) a rimanere DRY (Don't Repeat Yourself - Non ripetersi). La struttura dovrebbe seguire queste 4 linee guida basilari. 

    *Perché LIFT?*: Fornisce una struttura consistente che scala bene, è modulare e rende più semplice aumentare l'efficienza nel trovare facilmente il codice. Un altro modo per verificare la struttura della tua app è chiedeti: Quanto rapidamente puoi aprire e lavorare ad una funzionalità in tutti i file che sono collegati?

    Quando ritengo che la mia struttura non sia confortevole, torno indietro a rivedere le linee guida LIFT
  
    1. `L`ocalizzare il nostro codice con facilità
    2. `I`dentificare il codice a vista
    3. `F`lat (pitta) struttura quanto più possibile
    4. `T`ry (prova) a rimanere DRY (Don’t Repeat Yourself) o T-DRY

### Locate - localizzare

  - Rendi intuitivo, semplice e facile localizzare il codice.

    *Perché?*: Ritengo ciò essere estremamente importante per il progetto. Se il team non è in grado di trovare i file di cui necessita rapidamente, non sarà in grado di lavorare il più efficacemente possibile, per cui la struttura necessita un cambiamento. Potresti non sapere il nome del file o dove sono i file a questo correlati quindi posizionarli in nel posto più intuitivo e prossimi gli uni agli altri fa risparmiare un mucchio di tempo. Una descrittiva struttura delle cartelle può essere d'aiuto.

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

### Identify - identificare

  - Guardando un file dovresti istantaneamente sapere ciò che contiene e cosa rappresenta.

    *Perché?*: Spendi meno tempo a rintracciare e beccare il codice e diventa più efficente. Se per fare ciò hai bisogno di nomi dei file più lunghi, fallo. Si descrittivo con i nomi dei file e tieni il contenuto del file con esattamente 1 componente. Evita file con più di un controller, diversi service o un misto. Ci sono delle eccezioni alla regola "1 per file" ovvero quando ho una serie di piccole funzionalità correlate l'un l'altra: continuano ad essere facilmente identificabili.

### Flat - piatto


  - Tieni la struttura delle cartelle piatta il più a lungo possibile. Quando arrivi ad avere 7 o più file, inizia a considerarne una separazione.

    *Perché?*: Nessuno vuole cercare 7 livelli di cartelle per trovare un file. Pensa ai menù di un sito web.. qualunche cosa oltre i 2 livelli dovrebbe esser presa in considerazione. Nella struttura di cartella non c'è una regola con un numero esattamente definito ma quando una cartella contiene 7-10 file, è il momento di creare una sottocartella. Basalo su un livello a te comodo. Usa una struttura più piatta fino a che c'è l'ovvia necessità (praticando il resto dei principi LIFT) di creare una nuova cartella.

### T-DRY (Try to Stick to DRY) - Prova a non ripeterti

  - Si DRY, ma non diventare pazzo e sacrificare la leggibilità.

    *Perché?*: Non ripetersi è importante ma non crocuale se sacrifica altri principi LIFT, per questo il principio è Try (provare) DRY. Non voglio digitare session-view.html perché è ovvio essere una view. Se non è ovvio o se per convenzione allora nominala così.  

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
