# Guida stilistica ad Angular

*Guida stilistica dogmatica ad Angular per i team di [@john_papa](//twitter.com/john_papa)*

Se stai cercando una guida stilistica dogmatica per le sintassi, convenzioni e struttura di applicazioni AngularJS, allora questo fa per te. Gli stili sono basati sulla mia esperienza di sviluppo con [AngularJS](//angularjs.org), presentazioni, [corsi di formazioni di Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) e del lavoro in team.

L'obbiettivo di questa guida stilistica è di fare da vademecum alla costruzione di applicazioni con Angular mostrando le convenzioni che uso e, più importante, perché le uso.

>Se ti piace questa guida, dai un'occhiata al mio corso [Angular Patterns: Clean Code](http://jpapa.me/ngclean) (in inglese) su Pluralsight come complemento a questa guida.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Eccezionalità della comunità e riconoscimenti
Mai lavorare nel vuoto. Ritengo che la comunità intorno ad Angular sia un gruppo incredibile con la passione di condividere le esperienze. Perciò, Todd Motto, un amico ed un esperto di Angular, ed io abbiamo collaborato su molti stili e convenzioni. Su molto siamo d'accordo, su altro meno.  Ti invito a controllare le [linee guida di Todd](https://github.com/toddmotto/angularjs-styleguide) per avere cognizione del suo approccio e di come paragonarle.

Molti dei mie stili sono frutto di parecchie sessioni di pair programming che [Ward Bell](http://twitter.com/wardbell) ed io abbiamo avuto. Il mio amico Ward ha di certo una influenza sull'evoluzione finale di questa guida.

## Guarda gli stili in una App di Esempio
Nonostante questa guida spieghi i *cosa*, *come* e *perché*, trovo che sia di aiuto vederle in pratica. Questa guida è accompagnata da una applicazione di esempio che segue questi stili e schemi. Puoi trovare l'[applicazione di esempio (chiamata modular) qui](https://github.com/johnpapa/ng-demos) nella cartella `modular`. Prendila, clonala o fanne un fork liberamente. [Le istruzioni su come eseguirla sono nel proprio readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Traduzioni
[Traduzioni di questa guida stilistica ad Angular](https://github.com/johnpapa/angularjs-styleguide/tree/master/i18n) sono gestite dalla comunità e possono essere trovate qui.

## Tavola dei contenuti

  1. [Responsabilità singola](#responsabilità-singola)
  1. [IIFE](#iife)
  1. [Moduli](#moduli)
  1. [Controller](#controller)
  1. [Service](#service)
  1. [Factory](#factory)
  1. [Data Service](#data-service)
  1. [Directive](#directive)
  1. [Risoluzioni di promesse per un controller](#risoluzioni-di-promesse-per-un-controller)
  1. [Annotazioni manuali per la Dependency Injection](#annotazioni-manuali-per-la-dependency-injection)
  1. [Minificazione e Annotazioni](#minificazione-e-annotazioni)
  1. [Gestione delle eccezioni](#gestione-delle-eccezioni)
  1. [Nomenclatura](#nomenclatura)
  1. [Principio "LIFT" per la struttura dell'applicazione](#principio-lift-per-la-struttura-dellapplicazione)
  1. [Struttura dell'applicazione](#struttura-dellapplicazione)
  1. [Modularità](#modularità)
  1. [Logica di Startup](#logica-di-startup)
  1. [Wrapper dei Servizi $ di Angular](#wrapper-dei-servizi--di-angular)
  1. [Test](#test)
  1. [Animazioni](#animazioni)
  1. [Commenti](#commenti)
  1. [JSHint](#jshint)
  1. [JSCS](#jscs)
  1. [Costanti](#costanti)
  1. [File Template e Snippet](#file-template-e-snippet)
  1. [Generatore Yeoman](#generatore-yeoman)
  1. [Routing](#routing)
  1. [Automazione dei processi](#automazione-dei-processi)
  1. [Filtri](#filtri)
  1. [Documentazione di Angular](#documentazione-di-angularjs)
  1. [Contribuire](#contribuire)
  1. [Licenza](#licenza)

## Responsabilità singola

### Regola dell'1
###### [Stile [Y001](#stile-y001)]

  - Definire 1 componente per file.

 	Il seguente esempio definisce il modulo `app` e le proprie dipendenze, definisce un controller e definisce una factory tutto nel medesimo file.

  ```javascript
  /* evitare */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

    Gli stessi componenti sono ora separati nei propri file.

  ```javascript
  /* consigliato */

  // app.module.js
  angular
    	.module('app', ['ngRoute']);
  ```

  ```javascript
  /* consigliato */

  // someController.js
  angular
    	.module('app')
    	.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* consigliato */

  // someFactory.js
  angular
    	.module('app')
    	.factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## IIFE
### Closures di JavaScript
###### [Stile [Y010](#stile-y010)]

  - Racchiudi i componenti di Angular in una Immediately Invoked Function Expression (IIFE) (Espressione di funzione immediatamente chiamata).

  *Perché?*: Una IIFE rimuove le variabili dallo scope globale. Questo aiuta a prevenire che variabili e dichiarazioni di funzione vivano più del previsto nello scope globale, inoltre aiuta ad evitare la collisione di variabili.
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
   * consigliato
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

  - Nota: Le IIFE evitano che il codice di test possa raggiungere membri privati come regular expression o funzioni di supporto le quali sono spesso oggetto di propri unit test. In ogni caso, queste possono essere testate per mezzo di membri accessibili o attraverso l'esposizione di propri componenti. Per esempio ponendo funzioni di supporto, regular expression o costanti nelle proprie factory o costanti.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Moduli

### Evitare la collisione di nomi
###### [Stile [Y020](#stile-y020)]

  - Usa una convenzione unica per i nomi con separatori per sotto moduli.

  *Perché?*: Nomi unici aiutano ad evitare la collisione di nomi dei moduli. I separatori aiutano a definire gerarchie di moduli e dei propri sotto moduli. Per esempio `app` potrebbe essere il modulo principale mentre `app.dashboard` e `app.users` potrebbero essere moduli che sono usati come dipendenze di `app`.

### Definizioni (altrimenti noti come Setter)
###### [Stile [Y021](#stile-y021)]

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
  /* consigliato */
  angular
    	.module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getter
###### [Stile [Y022](#stile-y022)]

  - Usando un modulo, evita l'uso di una variabile e piuttosto usa la concatenazione con la sintassi getter.

  *Perché?*: Ciò produce un codice maggiormente leggibile ed evita la collisione di variabili o buchi.

  ```javascript
  /* evitare */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* consigliato */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs Getting
###### [Stile [Y023](#stile-y023)]

  - Setta solo una volta e prendi (get) per tutte le altre istanze.

  *Perché?*: Un modulo dovrebbe essere creato solamente una volta, quindi recuperato da lì in avanti.

  ```javascript
  /* consigliato */

  // per creare un modulo
  angular.module('app', []);

  // per recuperare un modulo
  angular.module('app');
  ```

### Funzioni con un nome vs funzioni anonime
###### [Stile [Y024](#stile-y024)]

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
  /* consigliato */

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Controller

### Sintassi controllerAs nella View
###### [Stile [Y030](#stile-y030)]

  - Usa la sintassi [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) al posto della sintassi `classico controller con $scope`.

  *Perché?*: I controller sono costruiti, creati con "new" e forniti con un nuova istanza singola, inoltre la sintassi `controllerAs` è più somigliante ad un costruttore JavaScript rispetto alla `sintassi classica con $scope`.

  *Perché?*: Promuove l'uso del binding ad un oggetto che "usa il punto" nella View (p.e. `customer.name` invece di `name`), il quale è più contestuale, più facile da leggere ed evita qualunque questione di riferimenti che potrebbe accadere senza "uso del punto".

  *Perché?*: Aiuta ad evitare l'uso di chiamate a `$parent` nelle View che hanno controller nidificati.

  ```html
  <!-- evitare -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- consigliato -->
  <div ng-controller="Customer as customer">
     {{ customer.name }}
  </div>
  ```

### Sintassi controllerAs nel Controller
###### [Stile [Y031](#stile-y031)]

  - Usa la sintassi `controllerAs` al posto della sintassi `classico controller con $scope`.

  - La sintassi `controllerAs` usa `this` all'interno dei controller che fanno uso di `$scope`

  *Perché?*: `controllerAs` è una semplificazione sintattica per `$scope`. Puoi ancora fare il binding con la View ed accedere ai metodi di `$scope`.

  *Perché?*: Aiuta ad evitare la tentazione ad usare i metodi di `$scope` dentro un controller quando sarebbe meglio evitare o spostarli in una factory quindi referenziarli dal controller. Considera l'uso di `$scope` in un controller soltanto quando necessario. Per esempio, quando si pubblicano o sottoscrivono eventi usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), o [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considera di spostare questi tipi di utilizzi in una facotry e di invocarli da un controller.

  ```javascript
  /* evitare */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* consigliato - tuttavia vedi la prossima sezione */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs con vm
###### [Stile [Y032](#stile-y032)]

  - Usa una variabile che "catturi" `this` quando si utilizza la sintassi `controllerAs`. Scegli un nome della variabile consistente come `vm`, che sta per ViewModel.

  *Perché?*: La keyword `this` è contestuale e quando usata all'interno di una funzione dentro un controller può cambiare il proprio contesto. Catturare il contesto di `this` evita di incorrere in questo problema.

  ```javascript
  /* evitare */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* consigliato */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Nota: Puoi evitare ogni warning di [jshint](http://www.jshint.com/) ponendo il commento sotto riportato al di sopra della linea di codice. Comunque ciò non è richiesto quando la funzione è nominata ConUsoMaiuscole, dal momento che questa convenzione è intesa come funzione costruttore ovvero ciò che un controller è in Angular.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Nota: Quando di creano watch in un controller usando `controller as`, puoi fare il watch del membro `vm.*` usando la seguente sintassi. (Crea watch con cautela poiché aggiungono più carico al ciclo di digest.)

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

### Membri che possono fare il bind in alto
###### [Stile [Y033](#stile-y033)]

  - Poni i membri che possono fare il bind in alto nel controller, in ordine alfabetico, piuttosto che dispersi in tutto il codice del controller.

    *Perché?*: Porre i membri che posso fare il bind in alto rende semplice la lettura e aiuta l'istantanea identificazione di quali membri del controller possono essere collegati ed usati in una View.

    *Perché?*: Settare funzioni anonime nella medesima linea è semplice, tuttavia quando queste funzioni sono più lunghe di 1 linea di codice possono ridurre la leggibilità. Definire le funzione al di sotto i membri che possono fare il bind (funzioni che saranno chiamate) spostano i dettagli di implementazione in basso, tengono i membri che possono fare il bind in alto e rendono il codice più facile da leggere.

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
  /* consigliato */
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

  Nota: Se la funzione è di 1 linea considera di poterla lasciare in alto fino a che la leggibilità non ne è compromessa.

  ```javascript
  /* evitare */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * linee
           * di
           * codice
           * che peggiorano
           * leggibilità
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* consigliato */
  function Sessions(sessionDataService) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = sessionDataService.refresh; // codice di 1 liena è OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Dichiarazioni di funzione per nascondere i dettagli di implementazione
###### [Stile [Y034](#stile-y034)]

  - Usa le dichiarazioni di funzione per nascondere i dettagli di implementazione. Tieni i membri che possono fare il binding in alto. Quando necessiti di fare binding a una funzione nel controller, puntalo ad una dichiarazione di funzione che compaia dopo nel file. Questo è direttamente collegabile con la sezione Membri che possono fare il bind posti in alto. Per ulteriori dettagli guarda [questo post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) (in inglese).

    *Perché?*: Porre i membri che possono fare il binding in alto rende semplice la lettura ed aiuta l'immediata identificazione dei membri del controller che possono fare il binding ed usati nella View. (Come sopra.)

    *Perché?*: Porre i dettagli di implementazione di una funzione in seguito nel file sposta la complessità fuori dalla vista così che puoi vedere le cose importanti in alto.

    *Perché?*: Dichiarazioni di funzioni che sono chiamate così che non c'è rischio dell'uso di una funzione prima che sia definita (come sarebbe in caso di espressioni di funzione).

    *Perché?*: Non ti devi preoccupare di dichiarazioni di funzione che sposta `var a` prima di `var b` romperà il codice perché `a` dipende da  `b`.

    *Perché?*: Con le espressioni di funzione l'ordine è critico.

  ```javascript
  /**
   * evitare
   * Uso di espressioni di funzione.
   */
  function Avengers(avengersService, logger) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';

      var activate = function() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      var getAvengers = function() {
          return avengersService.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }

      vm.getAvengers = getAvengers;

      activate();
  }
  ```

  Nota come le cose importanti, nell'esempio precedente, sono disseminate. Nell'esempio sotto, nota che le cose importanti sono in alto. Per esempio, i membri collegati al controller come `vm.avengers` e `vm.title`. I dettagli di implementazione sono in fondo. Questo è certamente più facile da leggere.

  ```javascript
  /*
   * consigliato
   * Usare dichiarazione di funzione
   * e membri che fanno in binding in alto.
   */
  function Avengers(avengersService, logger) {
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
          return avengersService.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```

### Rimandare la logica del Controller ad un Service
###### [Stile [Y035](#stile-y035)]

  - Rimandare la logica in un controller delegandola ai service e factory.

    *Perché?*: La logica può essere riutilizzata da più controller quando posta in un service ed esposta tramite una funzione.

    *Perché?*: La logica posta in un service può essere più facilmente isolata in una unit test inoltre la chiamata della logica nel controller può essere oggetto di un mock con più facilità.

    *Perché?*: Rimuove dipendenze e nasconde i dettagli di implementazione dal controller.

  ```javascript

  /* evitare */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
		  var settings = {};
          // Prendi la URL di base per il servizio del credito
          // Setta le intestazioni necessarie per il servizio del credito
          // Prepara le URL della query string o i data object con i dati richiesti
          // Aggiungi le informazioni sull'identificazione dell'utente così il servizio prende i dati sul limite del credito corretto
          // Usare JSONP per questo browser se CORS non è supportato
          return $http.get(settings)
              .then(function(data) {
	         // Spacchetta i dati JSON nell'ogetto di risposta
                 // per trovare maxRemainingAmount
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Errore dell'interprete
                 // Affronta timeout? nuovo tentativo? provare servizi alternativi?
                 // Rilancia con l'errore appropriato per essere letto dall'utente
              });
      };
  }
  ```

  ```javascript

  /* consigliato */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
         return creditService.isOrderTotalOk(vm.total)
            .then(function(isOk) { vm.isCreditOk = isOk; })
            .catch(showError);
      };
  }
  ```

### Tenere i controller "a fuoco"
###### [Stile [Y037](#stile-y037)]

  - Definisci un controller per vista e prova a non riutilizzare il controller per altre view. Piuttosto, sposta la logica riutilizzabile alle factory e mantieni il controller semplice ed a fuoco sulla propria view.

    *Perché?*: Riutilizzare i controller con diverse view è precario e sono necessari dei buoni test end-to-end (e2e) per assicurarne la stabilità in applicazioni su larga scala.

### Assegnazione dei Controller
###### [Stile [Y038](#stile-y038)]

  - Quando un controller deve essere accoppiato ad una view ed un componente può essere riutilizzato da altri controller o view, definisci i controller insieme alle loro route.

    Nota: Se una View è caricata attraverso altri mezzi che una route, allora usa la sintassi `ng-controller="AvengersController as avengers"`.

    *Perché?*: Accoppiare il controller in una route consente a route diverse di invocare diversi accoppiamenti di controller e view. Quando i controller sono assegnati in una view usando [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController) quella view sarà sempre associata al medesimo controller.

 ```javascript
  /* evitare - quando usato con una route e si desidera una dinamicità negli accoppiamenti */

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
  <div ng-controller="AvengersController as avengers">
  </div>
  ```

  ```javascript
  /* consigliato */

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Service

### Singleton
###### [Stile [Y040](#stile-y040)]

  - I Service sono istanziati con la keyword  `new`, usa `this` per metodi e variabili pubbliche. Dal momento che sono molto simili alle factory, usa queste ultime per consistenza.

    Nota: [Tutti i servizi di Angular sono singleton](https://docs.angularjs.org/guide/services). Questo significa che c'è soltanto una istanza di un dato servizio per iniettore.

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Factory

### Singola responsabilità
###### [Stile [Y050](#stile-y050)]

  - Le factory dovrebbero avere la [singola responsabilità](http://en.wikipedia.org/wiki/Single_responsibility_principle) che è incapsulata nel proprio contesto. Una volta che una factory eccede quello che è un singolo scopo, dovrebbe essere creata una nuova factory.

### Singleton
###### [Stile [Y051](#stile-y051)]

  - Le factory sono singleton e ritornano un oggetto che contiene i membri del servizio.

    Nota: [Tutti i servizi di Angular sono singleton](https://docs.angularjs.org/guide/services).

### Membri accessibili in alto
###### [Stile [Y052](#stile-y052)]

  - Esponi tutti i membri richiamabili del servizio (l'interfaccia) in alto, usando una tecnica derivata dal [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *Perché?*: Porre i membri richiamabili in alto lo rende semplice da leggere e aiuta ad identificare istantaneamente quali membri del servizio possono essere chiamati ed essere oggetto di unit test (e/o simulati).

    *Perché?*: Questo è particolarmente utile quando i file iniziano ad allungarsi così da evitare la necessità di scorrere per leggere cosa è esposto.

    *Perché?*: Settare funzioni mentre procedi può essere facile ma quando tali funzioni sono più lunghe di 1 linea di codice possono ridurre la leggibilità e causare maggiore scorrimento. Definire l'interfaccia richiamabile attraverso i servizi ritornati sposta i dettagli di implementazione in basso, tiene l'interfaccia richiamabile in alto e rende più facile la lettura.

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
  /* consigliato */
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
###### [Stile [Y053](#stile-y053)]

  - Usa le dichiarazioni di funzioni per nascondere i dettagli di implementazione. Tieni i membri accessibili della factory in alto. Puntali alle dichiarazioni di funzioni che compaiono dopo nel file. Per ulteriori dettagli guarda [questo post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) (in inglese).

    *Perché?*: Porre i membri richiamabili in alto la rende semplice da leggere e aiuta ad identificare istantaneamente quali funzioni della factory possono accessibili esternamente.

    *Perché?*: Porre i dettagli di implementazione di una funzione dopo nel file sposta la complessità fuori dalla vista così che puoi vedere le cose importanti prima.

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
   * consigliato
   * Uso di dichiarazioni di funzioni
   * e membri accessibili in alto.
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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Data Service

### Separare le chiamate ai dati
###### [Stile [Y060](#stile-y060)]

  - Rivedi la logica per gestire le operazioni con i dati e con la loro interazione delegandola ad una factory. Rendi il servizio di accesso ai dati responsabile per le chiamate XHR, conservazione locale, lo stashing in memoria o qualunque altra operazione sui dati.

    *Perché?*: La responsabilità del controller è la presentazione e raccolta di informazioni dalla view. Non dovrebbe occuparsi di come recuperare i dati, soltanto sapere a chi chiederli. La separazione dei servizi per i dati sposta la logica su come reperirli al servizio dei dati, rendendo il controller più semplice e più focalizzato sulla view.


    *Perché?*: Ciò rende più semplice da testare (vere o simulate) le chiamate ai dati quando si testa un controller che usa un servizio ai dati.

    *Perché?*: L'implementazione di un servizio ai dati può avere del codice molto specifico su come trattare i repository dei dati. Questo può includere header, come comunicare con i dati o altri servizi quali `$http`. Separare la logica in un servizio ai dati incapsula questa logica in un posto unico nascondendo l'implementazione a consumatori esterni (forse un controller), rendendo inoltre più semplice cambiarne l'implementazione.

  ```javascript
  /* consigliato */

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
              logger.error('XHR fallita per getAvengers.' + error.data);
          }
      }
  }
  ```

    Nota: Il servizio ai dati è chiamato dai consumatori, come un controller, nascondendo l'implementazione ai consumatori, come mostrato sotto.

  ```javascript
  /* consigliato */

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
###### [Stile [Y061](#stile-y061)]

  - Quando si chiama un servizio ai dati che ritorna una promessa come `$http`, ritorna a tua volta una promessa nella funzione di chiamata.

    *Perché?*: Puoi concatenare le promesse insieme e prendere ulteriori azioni dopo che la chiamata ai dati è completata e risolvere o rigettare la promessa.

  ```javascript
  /* consigliato */

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
                 * setta i dati e risolvi la promessa
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Directive
### Limita 1 per file
###### [Stile [Y070](#stile-y070)]

  - Crea una directive per file. Nomina il file per la directive.

    *Perché?*: È facile mescolare tutte le directive in un unico file ma difficoltoso da separare così che alcune siano condivise tra le applicazioni, alcune tra moduli, altre solo per un module.

    *Perché?*: Una directive per file è semplice da manutenere.

    > Nota: "**Best Practice**: Le directive dovrebbero fare pulizia alla fine. Puoi usare `element.on('$destroy', ...)` oppure `scope.$on('$destroy', ...)` per lanciare una funzione di pulizia quando la directive è rimossa" ... dalla documentazione di Angular.

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
  /* consigliato */
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
  /* consigliato */
  /* customerInfo.directive.js */

  /**
   * @desc directive delle vendite che può essere usato dovunque nella applicazione di vendita di una azienda di nome Acme
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
  /* consigliato */
  /* spinner.directive.js */

  /**
   * @desc directive dello spinner che può essere usato dovunque nella applicazione di vendita di una azienda di nome Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* dettagli di implementazione */
  }
  ```

    Nota: Ci sono molte opzioni per i nomi delle directive, in particolare dal momento che possono essere usate in ambiti stretti o larghi. Scegline uno che sia chiaro e distino per la directive e il suo nome del file. Alcuni esempi sono sotto ma vedi la sezione sulla [Nomenclatura](#nomenclatura) per ulteriori suggerimenti.

### Manipolare il DOM in una Directive
###### [Stile [Y072](#stile-y072)]

  - Quando devi manipolare direttamente il DOM, usa una directive. Se possono essere usate delle alternative come usare CSS per settare stili o i [servizi di animazione](https://docs.angularjs.org/api/ngAnimate), templating di Angular, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) oppure [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), allora usa questi. Per esempio, se la directive deve semplicemente nascondere e mostrare, usa ngHide/ngShow.

    *Perché?*: Manipolare il DOM può essere difficoltoso da testare, debuggare e spesso ci sono modi migliori (p.e. CSS, animazioni, template)

### Utilizza un prefisso unico per la Directive
###### [Stile [Y073](#stile-y073)]

  - Utilizza un corto, unico e descrittivo prefisso alla directive come `acmeSalesCustomerInfo` che potrebbe essere dichiarato in HTML come `acme-sales-customer-info`.

	*Perché?*: L'unico breve prefisso identifica il contesto delle directive e l'origine. Per esempio un prefisso `cc-` potrebbe indicare che la directive è parte di una app CodeCamper mentre `acme-` potrebbe indicare una direttiva per l'azienda Acme.

	Nota: Evita `ng-` poiché queste sono riservate per le directive di Angular. Cerca directive che sono largamente utilizzate per evitare il conflitto di nomi, come `ion-` per il [Framework Ionic ](http://ionicframework.com/).

### Restringi a Elementi and Attributi
###### [Stile [Y074](#stile-y074)]

  - Quando crei una directive che abbia senso come elemento a se stante, considera la restrizione a `E` (elemento custom) e facoltativamente restringere a `A` (attributo custom). In generale, se può essere il suo stesso controllo, `E` è appropriato. Le linee guida generali sono di permettere `EA` ma tendono verso l'implementazione come un elemento quando è a se stante e come attributo quando accresce il proprio elemento DOM esistente.

    *Perché?*: È sensato.

    *Perché?*: È possibile consentire che sia usata come una classe ma se la directive agisce davvero come un elemento è più sensato che sia un elemento o al meno un attributo.

    Nota: EA è il default per Angular 1.3 e successivi

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
  <!-- consigliato -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* consigliato */
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
###### [Stile [Y075](#stile-y075)]

  - Usa la sintassi `controller as` con una directive per essere consistente con l'utilizzo di `controller as` con un accoppiamento view/controller.

    *Perché?*: È sensato e non è difficile.

    Nota: La directive sotto dimostra alcuni dei modi in cui puoi usare lo scope all'interno di link e controller di directive usando controllerAs. Ho usato sulla stessa linea il template solo per mettere tutto in un unico posto.

    Nota: In relazione alla dependency injection, guarda [Annotazioni manuali per la Dependency Injection](#annotazioni-manuali-per-la-dependency-injection).

    Nota: Notare che il controller della directive è al di fuori della closure della directive. Questo stile elimina problematiche dove l'iniezione viene creata come codice non raggiungibile dopo un `return`.

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
          bindToController: true // perché lo scope è isolato
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
     // Iniettare $scope solo per confronto
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

    Nota: Puoi inoltre nominare il controller quando lo inietti nella link function e accedi agli attributi della directive come proprietà del controller.

  ```javascript
  // Alternativa all'esempio sopra riportato
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```
###### [Stile [Y076](#stile-y076)]

  - Usa `bindToController = true` quando usi la sintassi `controller as` con una directive al fine di fare il bind tra lo scope esterno e lo scope del controller della directive.

    *Perché?*: Rende semplice il bind tra lo scope esterno e lo scope del controller delle directive.

    Nota: `bindToController` è stato introdotto con Angular 1.3.0.

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Risoluzioni di promesse per un controller
### Promesse di attivazione di un Controller
###### [Stile [Y080](#stile-y080)]

  - Risolvi la logica di start-up per un controller in una funzione `activate`.

    *Perché?*: Porre la logica di start-up in una posizione consistente nel controller la rende semplice da localizzare, più consistente da testare e aiuta a prevenire la diffusione della logica di attivazione su tutto il controller.

    *Perché?*: La funzione `activate` del controller rende il riuso della logica adatto in caso di un refresh del controller/view, tiene la logica assieme, porta l'utente alla view più rapidamente, rende le animazini più facili su `ng-view` o `ui-view`e da la sensazione all'utente di istantaneità.

    Nota: Se hai necessità di annullare condizionalmente il route prima di iniziare ad usare il controller, usa piuttosto una [risoluzione nella route](#stile-y081).

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
  /* consigliato */
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
###### [Stile [Y081](#stile-y081)]

  - Quando un controller dipende dal fatto che una promessa sia risolta prima che il controller sia attivato, risolvi queste dipendenze nel `$routeProvider` prima che la logica del controller sia eseguita. Se hai bisogno di annullare condizionalmente una route prima che il controller sia attivato, usa una risoluzione della route.

  - Usa la risoluzione della route quando decidi di annullare la route prima ancora di iniziara la transizione alla view.

    *Perché?*: Un controller può richiedere dei dati prima che si carichi. Quei dati potrebbero venire da una promessa di una factory su misura oppure [$http](https://docs.angularjs.org/api/ng/service/$http). Usando un [resolver della route](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) consenti che la promessa sia risolta prima che la logica del controller sia eseguita, così da poter prendere decisioni basandosi sui dati provenienti dalla promessa.

    *Perché?*: Il codice è eseguito dopo la route e nella funzione di attivazione del controller. La view inizia il caricamento immediatamente. Il data binding è effettivo quando le promesse nella funzione di attivazione sono risolte. Una animazione di “attendere” può essere mostrata durante la transizione alla view (per mezzo di ng-view o ui-view).

    Nota: Il codice è eseguito prima del route per mezzo di una promessa. Il rifiuto della promessa annulla la route. "Resolve" fa attendere la view mentre viene risolta. Una animazione “attendere” può essere mostrata prima della risoluzione e durante tutta la transizione alla vista. Se desideri arrivare alla view più in fretta e non hai bisogno di un punto di controllo per decidere se vuoi navigare alla view, considera piuttosto [Promesse di attivazione di un Controller](#stile-y080).

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
      var vm = this;
      vm.movies = moviesPrepService.movies;
  }
  ```

    Nota: L'esempio sotto mostra il punto di risoluzione della route in una funzione con il nome per cui è più semplice da fare il debug e più semplice da gestire nella iniezione delle dependenze.

  ```javascript
  /* ancora meglio */

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

  function moviesPrepService(movieService) {
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
    Nota: La dipendenza del codice di esempio da `movieService` non è a prova di minificazione in se stessa. Per i dettagli su come rendere questo codice a prova di minificazione, vedi la sezione sulla [dependency injection](#annotazioni-manuali-per-la-dependency-injection) e sulla [minificazione e annotazione](#minificazione-e-annotazioni).

**[Torna all'inizio](#tavola-dei-contenuti)**

## Annotazioni manuali per la Dependency Injection

### Non sicuro per la minificazione
###### [Stile [Y090](#stile-y090)]

  - Evita di usare abbreviazioni sintattiche per la dichiarazione di dipendenze senza usare un approccio a prova di minificazione.

    *Perché?*: I parametri dei componenti (p.e. controller, factory, etc.) saranno convertiti in variabili dal nome ridotto. Per esempio, `common` e `dataservice` potrebbero diventare `a` o `b` e non essere piò ritrovate da Angular.

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
###### [Stile [Y091](#stile-y091)]

  - Usa `$inject` per identificare manualmente le tue dipendenze per i componenti di Angular.

    *Perché?*: Questa tecnica rispecchia la tecnica usata da [`ng-annotate`](https://github.com/olov/ng-annotate), che raccomando per l'automazione della creazione della minificazione sicura delle dipendenze. Se `ng-annotate` rileva che una iniezione è stata fatta, non la duplicherà.

    *Perché?*: Questo salvaguarda le tue dipendenze dall'essere vulnerabili alla questione della minificazione quando i parametri possono essere passati con nomi ridotti. Per esempio, `common` e `dataservice` possono diventare `a` o `b` e non essere più trovati da Angular.

    *Perché?*: Evita la creazione di dipendenze sulla stessa linea dal momento che lunghe liste possono essere difficili da leggere nell'array. Inoltre può essere fuorviante che l'array è una serie di stringhe mentre l'ultimo elemento è la funzione del componente.

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
    /* consigliato */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Nota: Quando la tua funzione si trova dopo una dichiarazione di return, `$inject` potrebbe essere non raggiungibile (ciò può accadere in una directive). Puoi risolvere ciò sia spostando il Controller fuori dalla directive.

    ```javascript
    /* evitare */
    // dentro la definizione di una directive
    function outer() {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;

        DashboardPanelController.$inject = ['logger']; // Non raggiungibile
        function DashboardPanelController(logger) {
        }
    }
    ```

    ```javascript
    /* consigliato */
    // fuori la definizione di una directive
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

### Idetificazione manuale delle dipendenze di resolver della route
###### [Stile [Y092](#stile-y092)]

  - Usa `$inject` per identificare manualmente le tue dipendenze di resolver della route per i componenti di Angular.

    *Perché?*: Questa tecnica evade le funzioni anonime per il resolver della route, rendendolo più semplice da leggere.

    *Perché?*: Una dichiarazione `$inject` può facilmente precedere il resolver per gestire la produzione di dipendenze che siano a prova di minificazione.

    ```javascript
    /* consigliato */
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

    moviesPrepService.$inject =  ['movieService'];
    function moviesPrepService(movieService) {
        return movieService.getMovies();
    }
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Minificazione e Annotazioni

### ng-annotate
###### [Stile [Y100](#stile-y100)]

  - Usa [ng-annotate](//github.com/olov/ng-annotate) per [Gulp](http://gulpjs.com) o [Grunt](http://gruntjs.com) e commenta le funzioni che necessitano di automatizzare la dependency injection usando `/* @ngInject */`

    *Perché?*: Questo salvaguarda il tuo codice da ogni dipendenza che non segua le pratiche a prova di minificazione

    *Perché?*: [`ng-min`](https://github.com/btford/ngmin) è deprecato.

    >Preferisco Gulp poiché lo ritengo più semplice da scrivere, leggere e fare il debug.

    Il codice che segue non usa dipendenze che sono a prova di minificazione.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero(){
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }
    ```

    Quando il codice soprastante passa da ng-annotate viene prodotto il seguente output con l'annotazione `$inject` e diventa a prova di minificazione.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero(){
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storage', 'avengerService'];
    ```

    Nota: Se `ng-annotate` rileva che l'iniezione è già stata fatta (p.e. `@ngInject` è stato rilevato), non duplicherà il codice di `$inject`.

    Nota: Quando si usa un resolver della route, puoi fare precedere il resolver della funzione con `/* @ngInject */` e ciò produrrà codice opportunamente annotato, mantenendo ogni iniezione delle dipendenze a prova di minificazione.

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

    > Nota: A partire da Angular 1.3 puoi usare il parametro `ngStrictDi` della directive [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) per rilevare ogni potenziale dipendenza che non sia a prova di minificazione. Quando presente, l'iniettore sarà creato in modalità "strict-di" causando il fallimento dell'invocazione di funzioni che non fanno uso esplicito di annotazione delle funzioni da parte dell'applicazione (queste potrebbero non essere a prova di minificazione). Informazioni di debug saranno mostrate nella console per aiutare nel tracciare il codice non confacente. Preferisco usare soltanto `ng-strict-di` per i soli scopi di debug.
    `<body ng-app="APP" ng-strict-di>`

### Usa Gulp o Grunt per ng-annotate
###### [Stile [Y101](#stile-y101)]

  - Usa [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) o [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in un task di automatizzazione delle build. Inietta `/* @ngInject */` prima di qualunque funzione che abbia delle dipendenze.

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Gestione delle eccezioni

### decoratori (decorator)
###### [Stile [Y110](#stile-y110)]

  - Usa un [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), al momento del config usando il servizio [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), sul servizio [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) per eseguire azioni ad hoc quando l'eccezione occorre.

    *Perché?*: Fornisce un modo consistente per la gestione delle eccezioni non trattate da Angular sia durante lo sviluppo che a runtime.

    Nota: Un'altra opzione è di fare l'override del servizio invece che usare un decorator. Questa è una buona opzione ma se vuoi tenere il comportamento di default ed estenderlo un decorator è consigliato.

  	```javascript
    /* consigliato */
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
###### [Stile [Y111](#stile-y111)]

  - Crea una factory che espone un'interfaccia per ricevere ed elegantemente gestire le eccezioni.

    *Perché?*: Fornisce un modo consistente di ricevere le eccezioni che possono essere lanciate nel tuo codice (p.e. durante una chiamata XHR o il fallimento di promesse).

    Nota: Il ricevitore di eccezioni è buono per ricevere e reagire a specifiche eccezioni da parte di chiamate che sai ne possono generare una. Per esempio, quando fai una chiamata XHR per il recupero di dati da un servizio di un server web remoto e vuoi ricevere qualsiasi eccezione da ciò e reagire univocamente.

    ```javascript
    /* consigliato */
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
###### [Stile [Y112](#stile-y112)]

  - Gestisti e fai il log di tutti gli errori di routing usando [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Perché?*: Fornisce un modo consistente di gestire tutti gli errori di routing.

    *Perché?*: Potenzialmente fornisce una migliore esperienza all'utente se si verifica un errore di routing e li puoi indirizzare ad una schermata di aiuto o con opzioni di recupero.

    ```javascript
    /* consigliato */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Annullamento del route:
         * Su un errore di routing, vai alla dashboard.
         * Fornisci una clausola di uscita se tenta di farlo per una seconda volta.
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
                 * A scelta fai il log usando un servizio ad hoc o $log.
                 * (Non dimenticare di iniettare il servizio ad hoc)
                 */
                logger.warning(msg, [current]);

                /**
                 * Su un errore di routing, vai ad un'altra route/stato.
                 */
                $location.path('/');
            }
        );
    }
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Nomenclatura

### Linee guida per assegnare i nomi
###### [Stile [Y120](#stile-y120)]

  - Usa nomi consistenti per tutti i componenti seguendo uno schema che descriva le funzionalità dei componenti e poi (a scelta) il suo tipo. Lo schema che consiglio è `feature.type.js`. Ci sono 2 nomi per la maggior parte dei componenti:
    *   il nome del file (`avengers.controller.js`)
    *   il nome del componente registrato con Angular (`AvengersController`)

    *Perché?*: Convezioni sui nomi aiutano a fornire un modo consistente per trovate i contenuti a colpo d'occhio. Essere consistenti in un progetto è vitale. Essere consistenti in un team è importante. Essere consistenti nell'insieme di un'azienda è tremendamente efficiente.

    *Perché?*: Le convezioni sulla nomenclatura dovrebbe semplicemente aiutare a trovare il tuo codice più rapidamente e renderlo più semplice da comprendere.

### Nomi dei file per funzionalità
###### [Stile [Y121](#stile-y121)]

  - Usa nomi consistenti per tutti i componenti seguendo uno schema che descriva le funzionalità dei componenti e poi (a scelta) il suo tipo. Lo schema che consiglio è `feature.type.js`.

    *Perché?*: Fornisce un modo consistente per identificare facilmente i componenti.

    *Perché?*: Fornisce uno schema di corrispondenza per qualsiasi processo di automatizzazione.

    ```javascript
    /**
     * opzioni comuni
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
     * consigliato
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

  Nota: Un'altra convenzione comune è dare il nome al file del controller senza la parola `controller` nel nome del file come `avengers.js` invece di `avengers.controller.js`. Tutte le altre convenzioni continuano ancora a mantenere il suffisso del tipo. I controller sono i tipi di componenti più comuni perciò questo risparmia digitazione continuando ad essere facilmente identificabili. Consiglio di scegliere 1 convenzione e rimanere consistente nel tuo team. La mia preferenza va a `avengers.controller.js`.

    ```javascript
    /**
     * consigliato
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Nomi dei file di test
###### [Stile [Y122](#stile-y122)]

  - Nomina le specifiche dei test in modo similare al componente che testano aggiundendo il suffisso `spec`.

    *Perché?*: Fornisce un modo consistente per identificare facilmente i componenti.

    *Perché?*: Fornisce uno schema di corrispondenza per [karma](http://karma-runner.github.io/) o altri esecutori di test.

    ```javascript
    /**
     * consigliato
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Nomi dei controller
###### [Stile [Y123](#stile-y123)]

  - Usa nomi consistenti per tutti i controller nominandoli come le loro funzionalità. Usa UpperCamelCase per i controller, dal momento che sono costruttori.

    *Perché?*: Fornisce un modo consistente per identificare e referenziare facilmente i controller.

    *Perché?*: UpperCamelCase è una convezione per identificare un oggetto che può essere istanziato usando un costruttore.

    ```javascript
    /**
     * consigliato
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```

### Suffisso nel nome di un controller
###### [Stile [Y124](#stile-y124)]

  - Aggiungi `Controller` alla fine del nome del controller.

    *Perché?*: Il suffisso `Controller` è quello più comunemente usato ed è più esplicitamente descrittivo.

    ```javascript
    /**
     * consigliato
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Nomi delle factory e dei service
###### [Stile [Y125](#stile-y125)]

  - Usa una nomenclatura consistente per tutte le factory e i service dando i nomi a seguito delle loro funzionalità. Usa il camel-case per service e factory. Evita di pre-nominare factory e service con `$`. Aggiungi il suffisso `Service` a service e factory soltanto quando non è chiaro cosa siano (p. es. quando si tratta di nomi).

    *Perché?*: Fornisce un modo consistente per identificare facilmente e referenziare le factory.

    *Perché?*: Evita collisione di nomi con factory e servizi di Angular esistenti che usano il prefisso `$`.

    *Perché?*: Service con nomi evidenti quali `logger` on richiedono il suffisso.

    *Perché?*: Nomi di service quali `avengers` sono nomi, richiedono in suffisso e dovrebbero essere nominati `avengersService`.

    ```javascript
    /**
     * consigliato
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

    ```javascript
    /**
     * consigliato
     */

    // credit.service.js
    angular
        .module
        .factory('creditService', creditService);

    function creditService() { }

    // customer.service.js
    angular
        .module
        .service('customersService', customersService);

    function customersService() { }
    ```

### Nomi dei componenti directive
###### [Stile [Y126](#stile-y126)]

  - Usa nomi consistenti per tutte le directive usando il camel-case. Usa un breve prefisso che descriva l'area alla quale la directive appartiene (alcuni esempi sono prefissi relativi all'azienda o al progetto).

    *Perché?*: Fornisce un modo consistente per identificare e referenziare facilmente i componenti.

    ```javascript
    /**
     * consigliato
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // l'uso è <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Moduli
###### [Stile [Y127](#stile-y127)]

  -  Quando ci sono moduli multipli, il modulo principale è nominato come `app.module.js` mentre altri moduli dipendenti prendono i nomi da ciò che rappresentano. Per esempio, un modulo admin è nominato `admin.module.js`. I rispettivi nomi con i quali sono registrati saranno `app` e `admin`.

    *Perché?*: Fornisce consistenza per app che hanno più di un modulo e per poter espandere verso applicazioni a larga scala.

    *Perché?*: Fornisce un modo semplice al fine di usare processi automatici per caricare prima tutte le definizioni di moduli, successivamente tutti gli altri file di Angular (per il bundling).

### Configurazione
###### [Stile [Y128](#stile-y128)]

  - Separa la configurazione di un modulo nel proprio file chiamato come il modulo. Un file di configurazione per il modulo principale `app` è chiamato `app.config.js` (o semplicemente `config.js`). Un file di configurazione per un modulo chiamato `admin.module.js` sarà `admin.config.js`.

    *Perché?*: Separa la configurazione dalla definizione, componenti e codice di attivazione del modulo.

    *Perché?*: Fornisce una posizione identificabile per settare la configurazione di un modulo.

### Route
###### [Stile [Y129](#stile-y129)]

  - Separa la configurazione delle route nei propri file. Esempi possono essere `app.route.js` per il modulo principale e `admin.route.js` per il modulo `admin`. Anche in piccole app preferisco questa separazione dal resto della configurazione.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Principio "LIFT" per la struttura dell'applicazione
### LIFT
###### [Stile [Y140](#stile-y140)]

  - Struttura la tua app tale da poter `L`ocate (localizzare) il codice facilmente, `I`dentify (identificare) il codice a colpo d'occhio, tenere la struttura più `F`lattest (piatta) che puoi, e `T`ry (provare) a rimanere DRY (Don't Repeat Yourself - Non ripetersi). La struttura dovrebbe seguire queste 4 linee guida basilari.

    *Perché LIFT?*: Fornisce una struttura consistente che scala bene, è modulare e rende più semplice aumentare l'efficienza dello sviluppatore nel trovare facilmente il codice. Un altro modo per verificare la struttura della tua app è chiederti: Quanto rapidamente puoi aprire e lavorare ad una funzionalità in tutti i file che sono collegati?

    Quando ritengo che la mia struttura non sia confortevole, torno indietro a rivedere le linee guida LIFT

    1. `L`ocalizzare il nostro codice con facilità
    2. `I`dentificare il codice a colpo d'occhio
    3. `F`lat (pitta) struttura quanto più possibile
    4. `T`ry (prova) a restare DRY (Don’t Repeat Yourself) o T-DRY

### Locate - localizzare
###### [Stile [Y141](#stile-y141)]

  - Rendi intuitivo, semplice e facile localizzare il codice.

    *Perché?*: Ritengo ciò essere estremamente importante per un progetto. Se il team non è in grado di trovare i file di cui necessita rapidamente, non sarà in grado di lavorare il più efficacemente possibile, per cui la struttura necessita un cambiamento. Potresti non sapere il nome del file o dove sono i file a questo correlati quindi posizionarli in nel posto più intuitivo e prossimi gli uni agli altri fa risparmiare un mucchio di tempo. Una descrittiva struttura delle cartelle può essere d'aiuto.

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
###### [Stile [Y142](#stile-y142)]

  - Guardando un file dovresti istantaneamente sapere ciò che contiene e cosa rappresenta.

    *Perché?*: Spendi meno tempo a rintracciare e beccare il codice e diventa più efficiente. Se per fare ciò hai bisogno di nomi dei file più lunghi, fallo. Si descrittivo con i nomi dei file e tieni il contenuto del file con esattamente 1 componente. Evita file con più di un controller, diversi service o un misto. Ci sono delle eccezioni alla regola "1 per file" ovvero quando ho una serie di piccole funzionalità correlate l'un l'altra: continuano ad essere facilmente identificabili.

### Flat - piatto
###### [Stile [Y143](#stile-y143)]


  - Tieni la struttura delle cartelle piatta il più a lungo possibile. Quando arrivi ad avere 7 o più file, inizia a considerarne una separazione.

    *Perché?*: Nessuno vuole cercare 7 livelli di cartelle per trovare un file. Pensa ai menù di un sito web.. qualunque cosa oltre i 2 livelli dovrebbe esser presa in seria considerazione. Nella struttura di cartella non c'è una regola con un numero esattamente definito ma quando una cartella contiene 7-10 file, potrebbe essere il momento di creare una sottocartella. Basalo su un livello a te comodo. Usa una struttura più piatta fino a che c'è l'ovvia necessità (praticando il resto dei principi LIFT) di creare una nuova cartella.

### T-DRY (Try to Stick to DRY) - Prova a non ripeterti
###### [Stile [Y144](#stile-y144)]

  - Si DRY, ma non diventare pazzo e sacrificare la leggibilità.

    *Perché?*: Non ripetersi è importante ma non è cruciale se sacrifica altri principi LIFT, per questo il principio è Try (provare) DRY. Non voglio digitare session-view.html perché è ovvio essere una view. Se non è ovvio o se per convenzione allora nominala così.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Struttura dell'applicazione

### Linee guida generali
###### [Stile [Y150](#stile-y150)]

  -  Abbi una visione a breve termine dell'implementazione e una a lunga scadenza. In altre parole, parti in piccolo ma tieni in mente su dove l'app è diretta lungo il percorso. Tutto il codice dell'app va nella cartella principale chiamata `app`. Tutto il contenuto rispetta 1 funzione per file. Ogni controller, service, module, view nel proprio file. Tutti gli script di terze party sono poste in una altra cartella principale e non nella cartella `app`. Non le ho scritte e non voglio facciano disordine nella mia app (`bower_components`, `scripts`, `lib`).

    Nota: Trovi più dettagli e le motivazioni di questa struttura nel [post originale sulla struttura delle applicazioni](http://www.johnpapa.net/angular-app-structuring-guidelines/) (in inglese).

### Layout
###### [Stile [Y151](#stile-y151)]

  - Metti i componenti che definiscono il layout globale dell'applicazione in una cartella con il nome `layout`. Questi possono includere un shell view e controller che agiscono come contenitori per l'app, navigazione, menù, aree per i contenuti ed altre regioni.

    *Perché?*: Organizza tutto il layout in una sola posizione riutilizzabile lungo tutta l'applicazione.

### Struttura Cartella-per-Funzionalità
###### [Stile [Y152](#stile-y152)]

  - Crea cartelle che abbiamo in nome per la funzionalità che rappresentano. Quando una cartella cresce fino a contenere più di 7 file, inizia a considerare la creazione di un'altra cartella. La tua soglia potrebbe essere differente, aggiustala di conseguenza.

    *Perché?*: Uno sviluppatore può localizzare il codice, identificare ciò che rappresenta a colpo d'occhio, la struttura è piatta come deve essere e non c'è ripetitività o nomi ridondanti.

    *Perché?*: Le linee guida LIFT sono tutte coperte.

    *Perché?*: Aiuta a ridurre la possibilità che l'app divenga disordinata per mezzo dell'organizzazione dei contenuti mantenendola allineata con i principi LIFT.

    *Perché?*: Quando ci sono parecchi file (più di 10) la loro localizzazione è più semplice con una struttura di cartelle che sia consistente e più difficile in una struttura piatta.

    ```javascript
    /**
     * consigliato
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

      ![Struttura dell'App di Esempio](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Nota: Non usare una strutturazione del tipo cartella-per-tipo per la tua app. Questo richiede spostarsi tra molte cartelle quando si lavora su una funzionalità e diventa rapidamente scomodo quando l'app cresce di 5, 10 o più di 25 tra view e controller (ed altre funzionalità), per cui è più difficile rispetto alla localizzazione basata su cartella-per-funzionalità.

    ```javascript
    /*
    * evitare
    * Alternativa cartella-per-tipo
    * Consiglio invece "cartella-per-funzionalità".
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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Modularità

### Molti moduli piccoli e autonomi
###### [Stile [Y160](#stile-y160)]

  - Crea moduli piccoli che incapsulino una responsabilità.

    *Perché?*: Applicazioni modulari rendono semplice l'inclusione dal momento che consentono ai team di sviluppo la costruzione di tagli verticali dell'applicazione e il suo roll out incrementale. Questo significa che è possibile aggiungere nuove funzionalità mentre vengono sviluppate.

### Creare un modulo App
###### [Stile [Y161](#stile-y161)]

  - Crea un modulo principale per l'applicazione il cui ruolo sia di mettere insieme tutti gli altri moduli e funzionalità della tua applicazione. Chiamalo con il nome della tua applicazione.

    *Perché?*: Angular incoraggia la modularità e schemi di separazione. La creazione di un modulo principale il cui ruolo sia quello di legante tra gli altri moduli consente un modo lineare di aggiungere o rimuovere moduli dall'applicazione.

### Tenere il modulo App snello
###### [Stile [Y162](#stile-y162)]

  - Nel modulo principale metti solo la logica che serva da collante per l'app. Lascia le funzionalità ognuna al proprio modulo.

    *Perché?*: L'aggiunta di ruoli addizionali al modulo principale per il recupero dei dati, il mostrare viste o altra logica non correlata al tenere insieme l'applicazione sporca il modulo principale e rende entrambi gli insiemi di funzionalità più complessi da riusare o rimuovere.

    *Perché?*: Il modulo app diventa un manifesto che descrive quali moduli aiutano a definire l'applicazione.

### Aree di funzionalità sono Moduli
###### [Stile [Y163](#stile-y163)]

  - Crea moduli che rappresentino aree di funzionalità come layout, servizi riusabili e condivisi, pannelli di controllo e funzioni specifiche all'app (p.e. clienti, amministrazione, vendite).

    *Perché?*: Moduli autonomi possono essere aggiunti all'applicazione con piccola o nessuna frizione.

    *Perché?*: Sprint o iterazioni possono focalizzarsi sulle aree di funzionalità e renderle disponibili alla fine dello sprint o dell'iterazione.

    *Perché?*: Separare aree di funzioni in moduli rende più semplice testare i moduli in isolamento e il riutilizzo del codice.

### Blocchi riutilizzabili sono Moduli
###### [Stile [Y164](#stile-y164)]

  - Crea moduli che rappresentino blocchi di applicazione riutilizzabili per servizi comuni quali la gestione delle eccezioni, il log, la diagnostica, sicurezza e il data stashing locale.

    *Perché?*: Questi tipi di funzionalità sono richieste in molte applicazioni, perciò tenendole separate nel proprio modulo possono essere generiche e riutilizzate in applicazioni diverse.

### Dipendenze dei Moduli
###### [Stile [Y165](#stile-y165)]

  - Il modulo principale dell'applicazione dipende dai moduli di funzionalità specifiche dell'app e da qualunque altro modulo che sia condiviso o riusabile.

    ![Modularità e Dipendenze](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Perché?*: Il modulo principale dell'app contiene un manifesto che sia facilmente identificabile con le funzionalità dell'applicazione.

    *Perché?*: Ogni area di funzionalità contiene un manifesto di ciò da cui dipende, in modo tale da poter essere usato come dipendenza in altre applicazioni e continuare a funzionare.

    *Perché?*: Funzionalità intra-app come servizio ai dati condiviso diventano facilmente localizzabili da dentro `app.core` (scegli il nome che più di piaccia per questo modulo).

    Nota: Questa è una strategia per la consistenza. Ci sono diverse buone opzioni in questo caso. Scegline una che sia consistente, segua le regole delle dipendenze di Angular e sia facile da manutenere e scalare.

    > La mia struttura varia leggermente tra progetti ma tutti seguono queste linee guida per la strutturazione e modularità. L'implementazione può variare in relazione alle funzionalità ed al team. In altre parole, non ti bloccare su una struttura che sia esattamente uguale ma giustifica la tua struttura tenendo a mente l'uso di consistenza, manutenibilità ed efficienza.

    > In una applicazione piccola, si può considerare di mettere tutte le dipendenze condivise nel modulo dell'app dove i moduli delle funzionalità non hanno dipendenze dirette. Ciò rende semplice mantenere l'applicazione più piccola ma rende più difficile riutilizzare i moduli fuori dell'applicazione stessa.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Logica di Startup

### Configurazione
###### [Stile [Y170](#stile-y170)]

  - Inietta codice nel  [modulo di configurazione](https://docs.angularjs.org/guide/module#module-loading-dependencies) che deve essere configurato prima dell'esecuzione dell'app angular. I candidati ideali includono provider e costanti.

    *Perché?:* Questo rende più facile ottenere pochi posti atti alla configurazione

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

### Blocchi Run
###### [Stile [Y171](#stile-y171)]

  - Qualunque codice che necessiti di essere eseguito quando un'applicazione si avvia dovrebbe essere dichiarato in una factory, esposto tramite funzione ed iniettato nel [blocco run](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Perché?*: Codice posto direttamente in un blocco run può essere difficile da testate. Metterlo in una factory lo rende più astratto e simulabile (farne un mock).

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Wrapper dei Servizi $ di Angular

### $document e $window
###### [Stile [Y180](#stile-y180)]

  - Usa [`$document`](https://docs.angularjs.org/api/ng/service/$document) e [`$window`](https://docs.angularjs.org/api/ng/service/$window) al posto di `document` e `window`.

    *Perché?*: Questi servizi sono gestiti da Angular e più facilmente testabili che l'uso di document e window nei test. Ciò ti aiuta ad evitare di fare mock di document e window.

### $timeout e $interval
###### [Stile [Y181](#stile-y181)]

  - Usa [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) e [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) al posto di `setTimeout` e `setInterval`.

	*Perché?*: Questi servizi sono gestiti da Angular e più facilmente testabili e gestiscono il ciclo di digest di Angular così da tenere sincronizzato il data binding.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Test
Gli unit test aiutano a mantenere il codice più chiaro, perciò ho incluso alcune mie raccomandazioni per le fondamenta dello unit testing con link per ulteriori dettagli.

### Scrivi test che abbiano storie
###### [Stile [Y190](#stile-y190)]

  - Scrivi un set di test per ogni storia. Inizia con un test vuoto e riempilo fino a scrivere il codice per la storia.

    *Perché?*: Scrivere la descrizione del test aiuta a definire chiaramente cosa la tua stoia farà, non farà e come puoi misurarne il successo.

    ```javascript
    it('dovrebbe avere il controller Avenger', function() {
        //TODO
    });

    it('dovrebbe trovare 1 Avenger quando filtrato per nome', function() {
        //TODO
    });

    it('dovrebbe avere 10 Avenger', function() {
        //TODO (fare un mock dei dati?)
    });

    it('dovrebbe ritornare Avenger via XHR', function() {
        //TODO ($httpBackend?)
    });

    // così via
    ```

### Librerie per i test
###### [Stile [Y191](#stile-y191)]

  - Usa [Jasmine](http://jasmine.github.io/) oppure [Mocha](http://mochajs.org) per lo unit testing.

    *Perché?*: Sia Jasmine che Mocha sono largamente utilizzati nella comunità di Angular. Entrambi son stabili, ben manutenuti e forniscono funzionalità solide per i test.

    Nota: Usando Mocha, tieni in considerazione di usare anche una libreria di asserzione come [Chai](http://chaijs.com). Io preferisco Mocha.

### Esecutori di Test
###### [Stile [Y192](#stile-y192)]

  - Usa [Karma](http://karma-runner.github.io) come esecutore di test.

    *Perché?*: Karma è facilmente configurabile per essere eseguito una sola volta o automaticamente quando cambia il tuo codice.

    *Perché?*: Karma si aggancia facilmente al tuo processo di Integrazione Continua da solo o attraverso Grunt o Gulp.

    *Perché?*: Alcuni IDE cominciano ad integrarsi con Karma, come [WebStorm](http://www.jetbrains.com/webstorm/) e [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Perché?*: Karma lavora bene con leader di automazione di processo quali [Grunt](http://www.gruntjs.com) (con [grunt-karma](https://github.com/karma-runner/grunt-karma)) e [Gulp](http://www.gulpjs.com). Quando usi Gulp, usa [Karma](https://github.com/karma-runner/karma) direttamente e non con un plugin dal momento che le API possono essere richiamate direttamente.

    ```javascript
    /* consigliato */

    // Esempio di Gulp che usa direttamente Karma
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

### Stubbing e Spying
###### [Stile [Y193](#stile-y193)]

  - Usa [Sinon](http://sinonjs.org) per lo stubbing e spying.

    *Perché?*: Sinon lavora bene sia con Jasmine che Mocha ed estende le funzionalità di stubbing e spying che questi offrono.

    *Perché?*: Sinon rende più semplice il passaggio tra Jasmine e Mocha, nel caso voglia usarli entrambi.

### Headless Browser
###### [Stile [Y194](#stile-y194)]

  - Usa [PhantomJS](http://phantomjs.org/) per eseguire i test su un server.

    *Perché?*: PhantomJS è un headless browser (browser senza interfaccia grafica) che aiuta l'esecuzione di test senza la necessità di un browser "visuale". Quindi non devi installare Chrome, Safari, IE o altri browser sul server.

    Nota: Dovresti in ogni caso testare tutti i browser nel tuo ambiente, come appropriato per il pubblico che ne è il target.

### Analisi del codice
###### [Stile [Y195](#stile-y195)]

  - Esegui JSHint sui tuoi test.

    *Perché?*: I test sono codice. JSHint può aiutare ad identificare problemi di qualità del codice che causano l’improprio funzionamento del test.

### Alleviare le regole sulle variabili globali di JSHint per i test
###### [Stile [Y196](#stile-y196)]

  - Rilassa le regole sul codice dei test per consentire variabili globali comuni quali `describe` ed `expect`.

    *Perché?*: I tuoi test sono codice e richiedono al medesima attenzione e regole per la qualità del codice come tutto il resto del codice di produzione. Comunque, variabili globali usate dai framework di test, per esempio, possono essere rilassate includendole nelle specifiche dei test.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Oppure puoi aggiungere le righe che seguono al tuo file JSHint Options.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Strumenti per i test](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

### Organizzazione dei test
###### [Stile [Y197](#stile-y197)]

  - Posiziona i file degli unit test (spec) vicino al codice del client. Posiziona le specifiche che coprono l'integrazione con il server o che testano più componenti in una cartella separata `tests`.

    *Perché?*: Gli unit test hanno una correlazione diretta con un componente specifico e file nei sogenti.

    *Perché?*: È più semplice da tenere aggiornati dal momento che sono sempre a vista. Quando scrivi codice, sia che tu faccia TDD o fai i test durante o dopo lo sviluppo, le scpecifiche sono sempre di fianco e mai fuori dalla vista o dai pensieri, quindi è più probabile che siano aggiornati e ciò consente inoltre a mantenere una migliore copertura del codice.

    *Perché?*: Quando aggiorni i sorgenti, è più semplice andare ad aggiornare anche i test.

    *Perché?*: Posizionarli vicino rende semplice trovarli e spostarli con i sorgenti qualora ciò accada.

    *Perché?*: Avere le specifiche vicino rende più facile al lettore del codice sorgente imparare come il componente dovrebbe essere usato e scoprire le sue limitazioni.

    *Perché?*: Separare le specifiche così da non essere nella build di distribuzione è semplice con grunt o gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.js
                             /customers.controller.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Animazioni

### Utilizzo
###### [Stile [Y210](#stile-y210)]

  - Usa sfumate [animazioni con Angular](https://docs.angularjs.org/guide/animations) per fare transizioni tra stati per viste ed elementi visuali primari. Includi il [modulo ngAnimate](https://docs.angularjs.org/api/ngAnimate). Le 3 chiavi sono sfumate, dolci e continue.

    *Perché?*: Animazioni sfumate possono migliorare l'esperienza dell'utente quando usate in modo appropriato.

    *Perché?*: Animazioni sfumate possono migliorare la percezione di prestazioni nella transizione tra le viste.

### Sotto il secondo
###### [Stile [Y211](#stile-y211)]

  - Usa animazioni che abbiano una durata breve. Generalmente parto con 300 ms e aggiusto finché non è appropriato.

    *Perché?*: Animazioni lunghe possono avere l'effetto contrario sull'esperienza dell'utente e di percezzione delle prestazioni che danno il senso di una applicazione lenta.

### animate.css
###### [Stile [Y212](#stile-y212)]

  - Usa [animate.css](http://daneden.github.io/animate.css/) per animazioni convenzionali.

    *Perché?*: Le animazione che animate.css fornisce sono veloci, dolci e facili da aggiungere alla tua applicazione.

    *Perché?*: Da consistenza alle tue animazioni.

    *Perché?*: animate.css è ampiamente usato e testato.

    Nota: Leggi questo [ottimo post di Matias Niemelä sulle animazioni di Angular](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Torna all'inizio](#tavola-dei-contenuti)**

## Commenti

### jsDoc
###### [Stile [Y220](#stile-y220)]

  - Se hai intenzione di produrre documentazione, usa la sintassi di [`jsDoc`](http://usejsdoc.org/) per documentare nomi di funzione, descrizione, parametri e ciò che ritorna. Usa `@namespace` e `@memberOf` per adattarlo alla stuttura della tua app.

    *Perché?*: Puoi generare (e rigenerare) documentazione dal tuo codice, invece di scriverlo partendo da zero.

    *Perché?*: Fornisce consistenza usando un tool comune nell'industria.

    ```javascript
    /**
     * Factory di Log
     * @namespace Factories
     */
    (function() {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Logger di tutta l'applicazione
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
           * @desc Log degli errori
           * @param {String} msg Messaggio di cui fare il log
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

**[Torna all'inizio](#tavola-dei-contenuti)**

## JSHint

### Usa un file di opzioni
###### [Stile [Y230](#stile-y230)]

  - Usa JS Hint per spazzolare il tuo JavaScript ed assicurati di ritagliare il file di opzioni di JS Hint e di includerlo nel source control. Vedi la [documentazione di JS Hint](http://www.jshint.com/docs/) per i dettagli sulle opzioni.

    *Perché?*: Da un allerta iniziale prima di fare il commit di qualunque codice al source control.

    *Perché?*: Fornisce consistenza all'interno del tuo team.

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

**[Torna all'inizio](#tavola-dei-contenuti)**

## JSCS

### Usa un file di opzioni
###### [Stile [Y235](#stile-y235)]

  - Usa JSCS per il controllo dello stile del tuo codice JavaScript ed assicurati di personalizzare il file di opzioni JSCS ed includerlo nel source control. Vedi [JSCS docs](http://www.jscs.info) per i dettagli sulle opzioni.

    *Perché?*: Fornisce un iniziale avvertimento prima di fare il commit di qualunque codice al source control.

    *Perché?*: Fornisce consistenza per l'intero team.

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

        "validateJSDoc": {
            "checkParamNames": true,
            "requireParamTypes": true
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

**[Torna all'inizio](#tavola-dei-contenuti)**

## Costanti

### Variabili globali delle terze parti
###### [Stile [Y240](#stile-y240)]

  - Crea una costante di Angular per le variabili globali delle librerie di terze parti.

    *Perché?*: Fornisce in modo per iniettare librerie di terze parte che altrimenti sarebbero globali. Questo migliore la testabilità del codice permettendoti più facilmente di sapere quali sono le dipendenze dei tuoi componenti. Ti consente inoltre di fare un mock di queste dipendenze, dove ciò ha senso.

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

###### [Stile [Y241](#stile-y241)]

  - Usa constanti per i valori che non cambiano e che non provengono da un altro servizio. Quando le costanti sono utilizzate solo per un modulo che potrebbe essere riutilizzato in più applicazioni, metti le costanti in un file per modulo e nominalo come il modulo. Fintanto che tale necesstià non si presenti, tieni le constanti nel modulo principale in un file `constants.js`.

    *Perché*: Un valore che potrebbe variare, anche non di frequente, dovrebbe essere recuperato da un servizio così che non sia necessario cambiare il codice sorgente. Per esempio, una URL per un servizio di accesso ai dati può essere messo in una costante ma un miglior posizionamento sarebbe quello di caricarlo da un web service.

    *Perché?*: Le costanti possono essere iniettate in un componente di angular, provider inclusi.

    *Perché?*: Quando una applicazione è separata in moduli che potrebbero essere usati in altre applicazioni, ogni modulo dovrebbe essere in grado di funzionare a se stante ivi incluse ogni costante da cui dipende.

    ```javascript
    // Costanti usate dall'intera applicazione
    angular
        .module('app.core')
        .constant('moment', moment);

    // Costanti usate solo dal modulo delle vendite
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## File Template e Snippet
Usa file template o snippet che ti aiutino a seguire stili e schemi consistentemente. Qui trovi alcuni template e/o snippet per alcuni degli editor per lo sviluppo web e IDE.

### Sublime Text
###### [Stile [Y250](#stile-y250)]

  - Snippet Angular che seguono questi stili e linee guida.

    - Scarica gli [snippet di Angular per Sublime](assets/sublime-angular-snippets.zip?raw=true)
    - Mettili nella tua cartella Packages
    - Riavvia Sublime
    - In un file JavaScript digita questi comandi seguiti da `TAB`

    ```javascript
    ngcontroller // crea un controller Angular
    ngdirective  // crea una directive Angular
    ngfactory    // crea una factory Angular
    ngmodule     // crea un modulo Angular
    ngservice    // crea un servizio Angular
    ngfilter     // crea un filtro Angular
    ```

### Visual Studio
###### [Stile [Y251](#stile-y251)]

  - I file dei template per Angular che seguono questi stili e linee guida possono essere trovati su [SideWaffle](http://www.sidewaffle.com)

    - Scarica l'estensione [SideWaffle](http://www.sidewaffle.com) per Visual Studio (file vsix)
    - Esegui il file vsix
    - Riavvia Visual Studio

### WebStorm
###### [Stile [Y252](#stile-y252)]

  - Snippet Angular e file di template che seguono queste linee guida. Le puoi importare dentro i tuoi settaggi di WebStorm:

    - Scarica i [file dei template e gli snippet di Angular per WebStorm](assets/webstorm-angular-file-template.settings.jar?raw=true)
    - Apri WebStorm e vai al menù `File`
    - Scegli la voce di menù `Import Settings`
    - Seleziona il file e clicca `OK`
    - In un file JavaScript digita questi comandi seguiti da `TAB`

    ```javascript
    ng-c // crea un controller Angular
    ng-f // crea una factory Angular
    ng-m // crea un modulo Angular
    ```

### Atom
###### [Stile [Y253](#stile-y253)]

  - Snippet Angular e file di template che seguono queste linee guida.
    ```
    apm install angularjs-styleguide-snippets
    ```
    oppure
    - Apri Atom, poi apri il Package Manager (Packages -> Settings View -> Install Packages/Themes)
    - Cerca il pacchetto 'angularjs-styleguide-snippets'
    - Clicca 'Install' per installare il pacchetto

  - In un file di JavaScript digita i seguenti comandi seguiti da un `TAB`

    ```javascript
    ngcontroller // crea un controller Angular
    ngdirective // crea una directive Angular
    ngfactory // crea una factory Angular
    ngmodule // crea un module Angular
    ngservice // crea un servizio Angular
    ngfilter // crea un filtro Angular
    ```

### Brackets
###### [Stile [Y254](#stile-y254)]

  - Snippet Angular che seguono questi stili e linee guida.
    - Scarica gli [snippet di Angulare per Brackets](assets/brackets-angular-snippets.yaml?raw=true)
    - Brackets Extension manager ( File > Extension manager )
    - Installa ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets)
    - Clicca sulla lampadina nel gutter destro in bracket
    - Clicca su `Settings` e quindi `Import`
    - Scegli il file e seleziona per saltare o fare l'override
    - Clicca `Start Import`

  - In un file di tipo JavaScript digita questi comandi seguiti da un `TAB`

    ```javascript
    // Questi sono snippet interi che contengono una IIFE
    ngcontroller // crea un controller Angular
    ngdirective  // crea una directive Angular
    ngfactory    // crea una factory Angular
    ngapp        // crea una impostazione di modulo Angular
    ngservice    // crea un service Angular
    ngfilter     // crea un filtro Angular

    // Questi sono snippet parziali intesi per essere concatenati
    ngmodule     // crea un getter di modulo Angular
    ngstate      // crea una definizione di stato di UI Router Angular
    ngconfig     // definisce un funzione per la fase di cofigurazione
    ngrun        // definisce una funzione per la fase di esecuzione
    ngroute      // definisce una ngRoute Angular con la definizione 'when'
    ngtranslate  // usa il service $translate con le proprie promesse
    ```

### vim
###### [Style [Y255](#style-y255)]

  - Snippet di vim che seguono questi stili e linee guida.

    - Scarica gli [snippet vim per Angular](assets/vim-angular-snippets?raw=true)
    - setta [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)
    - copia gli snippets nella directory snippet
    
  - snippet vim UltiSnips che seguono questi stilili e linee guida.

    - Scarica gli [snippet vim Angular UltiSnips](assets/vim-angular-ultisnips?raw=true)
    - setta [UltiSnips](https://github.com/SirVer/ultisnips)
    - copia gli snippet nella directory UltiSnips
    ```javascript
    ngcontroller // crea un controller Angular
    ngdirective  // crea una directive Angular
    ngfactory    // crea una factory Angular
    ngmodule     // crea un modulo Angular
    ngservice    // crea un service Angular
    ngfilter     // crea un filter Angular
    ```

### Visual Studio Code

###### [Stile [Y256](#stile-y256)]

  - Snippet [Visual Studio Code](http://code.visualstudio.com) che seguono questi stili e linee guida.

    - Scarica gli [snippet VS Code Angular](assets/vscode-snippets/javascript.json?raw=true)
    - copia gli snippet nella directory snippet o, in alternativa, copia ed incolla gli snippet in quella esistente.

    ```javascript
    ngcontroller // crea un controller Angular
    ngdirective  // crea una directive Angular
    ngfactory    // crea una factory Angular
    ngmodule     // crea un modulo Angular
    ngservice    // crea un service Angular
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Generatore Yeoman
###### [Stile [Y260](#stile-y260)]

Puoi usare il [generatore yeoman di HotTowel](http://jpapa.me/yohottowel) per creare un'app che funga da punto di partenza per Angular che segue gli stili di questa guida.

1. Installa generator-hottowel

  ```
  npm install -g generator-hottowel
  ```

2. Crea una nuova cartella e cambia la directory su di essa

  ```
  mkdir myapp
  cd myapp
  ```

3. Esegui il generatore

  ```
  yo hottowel helloWorld
  ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Routing
Il routing del lato client è importante al fine di creare in flusso di navigazione tra view e composizione di view che sono costituite da template più piccoli e directive.

###### [Stile [Y270](#stile-y270)]

  - Usa il [Router AngularUI](http://angular-ui.github.io/ui-router/) per il routing del lato client.

    *Perché?*: UI Router offre tutte le funzionalità del router di Angular più alcune funzionalità aggiuntive che includono route nidificate e stati.

    *Perché?*: la sintassi è piuttosto simile a quella del router di Angular ed è facile migrare a UI Router.

  - Nota: Puoi usare un provider quale `routerHelperProvider` mostrato sotto per aiutarti a configurare gli stati tra i file durante la fase di esecuzione.

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

###### [Stile [Y271](#stile-y271)]

  - Definisci le route per le view nel modulo dove queste esistono. Ogni modulo dovrebbe contenere le route per le view del modulo.

    *Perché?*: Ogni modulo dovrebbe essere a se stante.

    *Perché?*: Quando rimuovi o aggiungi un modulo, l'app conterrà soltanto route che puntano a view esistenti.

    *Perché?*: Ciò rende semplice abilitare o disabilitare porzioni di una applicazione senza preoccupazioni inerenti route orfane.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Automazione dei processi
Usa [Gulp](http://gulpjs.com) o [Grunt](http://gruntjs.com) per la creazione di processi automatizzati. Gulp si basa su "codice sopra configurazione" mentre Grunt si basa su "configurazione sopra codice". Personalmente preferisco Gulp poiché lo percepisco come più facile da leggere e scrivere ma entrambi sono eccellenti.

> Impara di più su Gulp per l'automazione dei processi e pattern in mio [corso Pluralsight su Gulp](http://jpapa.me/gulpps) (in inglese)

###### [Stile [Y400](#stile-y400)]

  - Usa l'automazione dei processi per elencare i file delle definizioni dei moduli `*.module.js` prima di qualunque altro file JavaScript dell'applicazione.

    *Perché?*: Angular necessita delle definizione del modulo da essere registrate prima di essere usati.

    *Perché?*: Nominare i moduli con un pattern specifico come `*.module.js` semplifica prenderli con un glob ed elencarli per primi.

    ```javascript
    var clientApp = './src/client/app/';

    // Prendi sempre i file dei moduli per primi
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Torna all'inizio](#tavola-dei-contenuti)**

## Filtri

###### [Stile [Y420](#stile-y420)]

  - Evita l'utilizzo di filtri per la scansione di tutte le proprietà del grafo di un oggetto complesso. Usa i filtri per selezionare le proprietà.

    *Perché?*: I filtri possono facilmente essere abusati ed avere un impatto negativo sulle prestazioni se non usati con saggezza, per esempio quando i filtri hanno come soggetto il grafo di un oggetto largo e profondo.

**[Torna all'inizio](#tavola-dei-contenuti)**

## Documentazione di Angular
Per qualunque altra cosa, riferimenti alle API, controlla la [documentazione di Angular](//docs.angularjs.org/api).

## Contribuire

Apri prima una "issue" per discutere potenziali cambiamenti/aggiunte. Se hai domande relative alla guida, sentiti libero di porle come "issue" nel repository. Se trovi un errore di scrittura, crea una pull request. L'idea è quella di tenere aggiornato il contenuto e usare le funzioni native di Github per aiutare nel racconto della storia con issue e pull request che sono tutte ricercabili via Google. Perché? Il caso vuole che se hai una domanda, qualcun altro l'abbia pure. Puoi trovare di più su come contribuire qui.

*Contribuendo a questo repository sei d'accordo a rendere il tuo contenuto soggetto alla licenza di questo repository*

### Processo

    1. Discuti i cambiamenti in un issue di GitHub.
    2. Apri una Pull Request, fai riferimento all issue e specifica i cambiamenti e perché questi aggiungono valore.
    3. La Pull Request sarà vagliata e quindi fatto un merge o declinata.

## Licenza

_tldr; Usa questa guida. I riferimenti sono apprezzati._

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

**[Torna all'inizio](#tavola-dei-contenuti)**
