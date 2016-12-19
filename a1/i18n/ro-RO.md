# Ghid stilistic pentru Angular 1

## Aprobat de Echipa Angular
Mulțumiri speciale lui Igor Minar, liderul echipei Angular, pentru revizuire, oferire de feedback, și pentru încredințarea mea în păstorirea acestui ghid.

## Scop
*Ghid stilistic opinionat pentru Angular îndreptat spre echipe de [@john_papa](//twitter.com/john_papa)*

Dacă cauți un ghid stilistic opinionat pentru sintaxă, convenții și structurearea aplicațiilor Angular, atunci pornește de aici. Aceste stiluri sunt bazate pe experiența mea de dezvoltare cu [Angular](//angularjs.org), prezentări, [cursuri de training Pluralsight](http://app.pluralsight.com/author/john-papa) și lucrul în echipe.

Scopul acestui ghid stilistic este acela de a oferi îndrumare pentru crearea de aplicații Angular prin expunereea convențiilor pe care le folosesc și, mai important, de ce le-am ales.

>Dacă îți place acest ghid, vezi și cursul meu [Angular Patterns: Clean Code](http://jpapa.me/ngclean) de la Pluralsight, care este un companion pentru acest ghid.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Minunăția comunității și acreditare
Nu lucra niciodată întrun vid. Observ că comunitatea Angular este un grup incredibil care este pasionat de împărtășirea experiențelor. Din motivul acesta, expertul Angular Todd Motto și eu am colaborat la multe stiluri și convenții. Suntem de-acord la multe dintre ele, iar la unele nu. Te încurajez să vezi [Todd's guidelines](https://github.com/toddmotto/angular-styleguide) ca să-ți faci o părere despre abordarea lui și cum diferă.

Multe din stilurile mele sunt din multitudinea de sesiuni de pair programming pe care eu și [Ward Bell](https://twitter.com/wardbell) le-am făcut. Prietenul meu Ward a influențat cu siguranță evoluția finală a acestui ghid.


## Vezi stilurile într-o Aplicație-Mostră
Chiar dacă acest ghid explică *ce*, *de ce* și *cum*, mi se pare folositor ca acestea să fie văzute în practică. Acest ghid este acompaniat de o aplicație-mostră ce folosește aceste stiluri și structuri. Poți găsi [aplicația-mostră (numită 'modular') aici](https://github.com/johnpapa/ng-demos) în folderul `modular`. Simte-te liber să o iei, să-i dai 'clone' sau 'fork'. [Instrucțiuni pentru rularea ei găsești în readme](https://github.com/johnpapa/ng-demos/tree/master/modular).


##Translations
[Traduceri ale acestui ghid stilistic pentru Angular](https://github.com/johnpapa/angular-styleguide/tree/master/a1/i18n) sunt gestionate de către comunitate și pot fi găsite aici.

## Cuprins

  1. [Responsibilitate unică](#single-responsibility)
  1. [IIFE](#iife)
  1. [Module](#modules)
  1. [Controlere](#controllers)
  1. [Servicii](#services)
  1. [Factory-uri](#factories)
  1. [Servicii de date](#data-services)
  1. [Directive](#directives)
  1. [Rezolvarea Promise-urilor](#resolving-promises)
  1. [Adnotarea manuală a Injecției de Dependințe](#manual-annotating-for-dependency-injection)
  1. [Minificare și Adnotare](#minification-and-annotation)
  1. [Tratarea Excețiilor](#exception-handling)
  1. [Denumire](#naming)
  1. [Structura aplicației - LIFT Principle](#application-structure-lift-principle)
  1. [Structura aplicației](#application-structure)
  1. [Modularitatea](#modularity)
  1. [Logica de lansare](#startup-logic)
  1. [Servicii $ Wrapper](#angular--wrapper-services)
  1. [Testare](#testing)
  1. [Animații](#animations)
  1. [Comentarii](#comments)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Constante](#constants)
  1. [Șabloane de fișier și snippeturi](#file-templates-and-snippets)
  1. [Generatorul Yeoman](#yeoman-generator)
  1. [Rutare](#routing)
  1. [Automatiarea taskurilor](#task-automation)
  1. [Filtre](#filters)
  1. [Documentația Angular](#angular-docs)

## Responsabilitatea Unică

### Regula 1
###### [Style [Y001](#style-y001)]

  - Definește 1 component per fișier, recomandat cu mai puțin de 400 de linii de code.

  *De ce?*: Un component per fișier încurajează atât unit testing cât și creerea de date de test mai ușor.

  *De ce?*: Un component per fișier face totul mult mai ușor de citit, gestionat, și de a evita conflictele cu echipa în "source control".

  *De ce?*: Un component per fișier evită buguri ascunse care apar frecvent când se combină componentele în fișiere în care se folosesc aceleași variabile, se crează closure-uri nedorite, sau se leagă, în mod nedorit, de dependințe. 

  Următorul exemplu definește modulul `app` și dependințele sale, definește un controller, și definește un factory, toate în același fișier.

  ```javascript
  /* evită */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  Aceleași componente sunt acum separate în propriile fișiere.

  ```javascript
  /* recomandat */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* recomandat */

  // some.controller.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomandat */

  // some.factory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Înapoi sus](#table-of-contents)**

### Funcții mici
###### [Style [Y002](#style-y002)]

  - Definește funcții mici, nu mai mult de 75 LDC (linii de cod). (mai puțin e mai bine).

  *De ce?*: Funcțiile mici sunt mai ușor de citit, mai ușor de testat, în special atunci când fac un singur lucru și au un singur scop.

  *De ce?*: Funcțiile mici încurajează reusabilitatea.

  *De ce?*: Funcțiile mici sunt mai ușor de citit.

  *De ce?*: Funcțiile mici sunt mai ușor de gestionat.

  *De ce?*: Funcțiile mici ajută evitarea de buguri ascunse care apar frecvent când exist funcții mari care se folosesc de aceleași variabile, care crează closure-uri nedorite, sau se leagă, în mod nedorit, de dependințe.
  
**[Înapoi sus](#table-of-contents)**

## IIFE
### JavaScript Scopes
###### [Style [Y010](#style-y010)]

  - Învelește componentele Angular într-o Expresie de Funcție Imediat Invocată (Immediately Invoked Function Expression (IIFE)).

  *De ce?*: Un IIFE înlătură variabilele din scopul global. Aceasta previne ca variabilele și declarațiile de funcții să trăiască mai mult decât ar trebui în scopul global, ceea ce totodată ajută la evitarea coliziunilor dintre variabile.

  *De ce?*: Când codul tău e minificat și împachetat într-un singur fișier pentru deployment pe un server de producție, ai putea avea coliziuni între variabile și foarte multe variabile globale. Un IIFE te protejează împotriva ambelor probleme oferind scop variabilelor pentru fiecare fișier.

  ```javascript
  /* evită */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // funcția de logare e adăugată ca o variabilă globală
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // funcția de stocare e adăugată ca o variabilă globală
  function storage() { }
  ```

  ```javascript
  /**
   * recomandat
   *
   * nicio variabilă globală nu e lăsată-n urmă
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

  - Notă: Doar pentru brevitate, restul exemplelor din ghidul acesta ar putea omite sintaxa IIFE.

  - Notă: IIFE-urile previn codul de test din a ajunge la membrii privați, cum ar fi expresiile regulate sau funcțiile ajutătoare, care sunt de multe ori testabile direct pe cont propriu. Cu toate acestea, le puteți testa prin membrii accesibili sau prin expunerea lor prin propriile lor componente. De exemplu, plasarea de funcții ajutătoare, expresii regulate sau constante în proprile lor factory-uri sau constante.


**[Înapoi sus](#table-of-contents)**

## Modules

### Evită coliziunile de denumiri
###### [Style [Y020](#style-y020)]

  - Folosește convenții de denumire unice cu separatori pentru sub-module

  *De ce?*: Numele unice ajută la evitarea coliziunilor de denumiri a submodulelor. Separatorii ajută la definirea modulelor și a ierarhiei submodulelor lor. De exemplu, `app` ar putea fi modulul tău de bază, iar `app.dashboard` și `app.users` ar putea fi module care să fie folosite ca și dependințe ale `app`.

### Definiții (sau Setteri)
###### [Style [Y021](#style-y021)]

  - Declară module fără o variabilă folosind sintaxa setter.

  *De ce?*: Cu un component per fișier, apare rar nevoia de a introduce o variabilă pentru modul.

  ```javascript
  /* evită */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  În schimb, folosește sintaxa setter, mai simplă.

  ```javascript
  /* recomandat */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getteri
###### [Style [Y022](#style-y022)]

  - Când folosești un modul, evită folosirea unei variabile și folosește înlănțuirea cu sintaxa getter.

  *De ce?*: Aceasta produce cod mai lizibil, și evită coliziunile de variabile sau leakurile.

  ```javascript
  /* evită */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomandat */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setarea vs Obținerea
###### [Style [Y023](#style-y023)]

  - Setează doar o dată și preia pentru toate celelalte instanțe.

  *De ce?*: Un modul ar trebui să fie creat doar o dată, și preluat de-acolo-ncolo.

  ```javascript
  /* recomandat */

  // to set a module
  angular.module('app', []);

  // to get a module
  angular.module('app');
  ```

### Funcții denumite vs anonime
###### [Style [Y024](#style-y024)]

  - Folosește funcții anonime în locul pasării funcțiilor anonime ca și callback.

  *De ce?*: Produce cod mai lizibil, ușurează cu mult debug-ul, și reduce cantitatea de cod cu multe callback-uri cuibărite

  ```javascript
  /* evită */
  angular
      .module('app')
      .controller('DashboardController', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recomandat */

  // dashboard.js
  angular
      .module('app')
      .controller('DashboardController', DashboardController);

  function DashboardController() { }
  ```

  ```javascript
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  function logger() { }
  ```

**[Înapoi sus](#table-of-contents)**

## Controlere

### Sintaxa pentru View 'controllerAs' 
###### [Style [Y030](#style-y030)]

  - Folosește sintaxa [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) în locul `classicei sintaxe controler cu $scope`.

  *De ce?*: Controlerele sunt construite, "reinnoite", și oferă o singură nouă instanță, iar sintaxa `controllerAs` e mult mai aproape de cea a unui constructor de JavaScript decât cea a `clasicei sintaxe ce $scope`.

  *De ce?*: încurajează folosirea de binduri cu un obiect "dotted" din View (e.g. `customer.name` în loc de `name`), ceea ce e mult mai contextual, mai ușor de citit, și evită orice probleme de referințe ce-ar putea apărea cu "dotting".

  *De ce?*: Ajută la evitarea de call-uri la `$parent` în View-uri cu controlere in ierarhie.

  ```html
  <!-- avoid -->
  <div ng-controller="CustomerController">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recomandat -->
  <div ng-controller="CustomerController as customer">
      {{ customer.name }}
  </div>
  ```

### Syntaxa de controler 'controllerAs'
###### [Style [Y031](#style-y031)]

  - Folosește sintaxa `controllerAs` în locul `sintaxei clasice de controler cu $scope`.

  - Sintaxa `controllerAs` folosește `this` înăuntrul controlerelor, iar acesta este legat de `$scope` 

  *De ce?*: `controllerAs` e syntactic sugar pentru `$scope`. Poți face binduri în continuare la View și să folosești metodele de pe `$scope`.

  *De ce?*: Ajută evitarea temptației de a folosit metode ale `$scope` înăuntrul unui controler atunci când, de fapt, ar fi mai bine să le evităm sau să mutăm metoda într-un factory și să facem referință la ea din controler. Încearcă să folosești `$scope` într-un controler doar când e nevoie. De exemplu, atunci când publici sau abonezi evenimente folosind [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), sau[`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on).

  ```javascript
  /* evită */
  function CustomerController($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomandat - dar vezi secțiunea viitoare */
  function CustomerController() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs cu vm
###### [Style [Y032](#style-y032)]

  - Folosește o variabilă de captură pentru `this` când folosești sintaxa `controllerAs`. Alege un nume de variabilă consecvent precum `vm`, care vine de la 'ViewModel'.

  *De ce?*: Keyword-ul `this` este contextual iar atunci când e folosit înăuntrul unei funcții dintr-un controler și-ar putea schimba contextul. Capturarea contextului lui `this` evită întâlnirea acestei probleme.

  ```javascript
  /* evită */
  function CustomerController() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomandat */
  function CustomerController() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Notă: Poți evita avertizările [jshint](http://jshint.com/) prin lăsarea unui comentariu deasupra liniei de cod. Totuși, nu este nevoie de aceasta atunci când funcția e denumită folosing UpperCasing, deoarece această conventție înseamnă că este o funcție-constructor, ceea ce și este un controler în Angular. 

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Notă: Când creezi un watch într-un controler folosing `controller as`, poti urmări membrul `vm.*` folosing următoarea sintaxă. (Crează watch-uri cu atenție, acestea adaugă timp de execuție ciclului de digest)

  ```html
  <input ng-model="vm.title"/>
  ```

  ```javascript
  function SomeController($scope, $log) {
      var vm = this;
      vm.title = 'Some Title';

      $scope.$watch('vm.title', function(current, original) {
          $log.info('vm.title a fost %s', original);
          $log.info('vm.title este acum %s', current);
      });
  }
  ```

  Notă: Când lucrezi cu baze de coduri mai mari, folosirea unui nume mai descriptiv ajută la ușurarea căutabilității și la reducerea overheadului cognitiv. Evită nume prea verboase care sunt prea greu de tastat.

  ```html
  <!-- avoid -->
  <input ng-model="customerProductItemVm.title">
  ```

  ```html
  <!-- recomandat -->
  <input ng-model="productVm.title">
  ```

### Membrii bindabili sus
###### [Style [Y033](#style-y033)]

  - Pleasează membrii bindabili în partea de sus a controlerului, în ordine alfabetică, și nu împrăștiați prin codul controlerului

    *De ce?*: Plasarea membrilor bindabili sus ușurează lizibilitatea și te ajută să identifici instant care membri ai controlerului pot fi bindabili și folosiți în View.

    *De ce?*: Setarea funcțiilor anonime in-line poate fi ușor, dar atunci când funcțiile respective sunt mai mult de o linie de cod ele pot reduce lizibilitatea. Definirea de funcții sub membri bindabili (funcțiile vor fi hoistate) mută detaliile implementarării jos, păstreaza membrii bindabili sus, și face totul mai ușor de citit. 

  ```javascript
  /* evită */
  function SessionsController() {
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
  }
  ```

  ```javascript
  /* recomandat */
  function SessionsController() {
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
  }
  ```

    ![Controller care folosește "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-1.png)

  Notă: Dacă funcția este o linie de cod consideră păstrarea ei sus, atâta vreme cât lizibilitatea nu este afectată.

  ```javascript
  /* evită */
  function SessionsController(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * liniile
           * de
           * cod
           * afectează
           * lizibilitatea
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  }
  ```

  ```javascript
  /* recomandat */
  function SessionsController(sessionDataService) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = sessionDataService.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  }
  ```

### Declarări de funcții pentru ascunderea detaliilor de implementare
###### [Style [Y034](#style-y034)]

  - Folosește declarări de funcții pentru a ascunde detaliile implementarării. Păstrează-ți membrii bindabili sus. Când ai nevoie de o funcție într-un controller, pointeaz-o la o declarație de funcție ce apare mai târziu în fișier. Acest lucru e direct legat de secțiunea "Membrii Bindabili Sus". Pentru mai multe detalii vezi [acest post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code/).

    *De ce?*: Plasarea membriilor bindabili sus face mai ușoară citirea și ajută să identifici instant ce membri ai controlerului pot fi folosiți în View. (La fel ca mai sus.)

    *De ce?*: Plasarea detaliilor de implementare a unei funcții mai târziu în cod mută toată complexitatea în afara câmpului vizibil, astfel că poți vedea toate lucrurile importante sus.

    *De ce?*: Declarațiile funcțiilor sunt hoistate deci nu sunt griji cum că ai folosi o funcție înainte să o definești (precum ar fi cu expresiile de funcții).

    *De ce?*: În legătură cu declarațiile de funcții, nu trebuie să-ți faci griji niciodată cum că mutând `var a` înainte de `var b` îți va strica codul fiindcă `a` depinde de `b`.

    *De ce?*: Ordinea e critică cu expresiile de funcții

  ```javascript
  /**
   * evitî
   * Folosirea de expresii de funcții.
   */
  function AvengersController(avengersService, logger) {
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

  Observă că lucrurile importante sunt împrăștiate în exemplul de mai sus. În exemplul de mai jos, observă că lucrurile importante sunt sus. De exemplu, membri legați de controler precum `vm.avengers` și `vm.title`. Detaliile de implementare sun jos. Asta e pur și simplu mai ușor de citit.

  ```javascript
  /*
   * recomandat
   * Folosirea de declarații de funcții
   * și membri bindabili sus.
   */
  function AvengersController(avengersService, logger) {
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

### Defer Controller Logic to Services
###### [Style [Y035](#style-y035)]

  - Scapă de logica dintr-un controller dând-o la servicii și factory-uri

    *De ce?*: Logica ar putea fi refolosită de mai multe controllere dacă e pusă într-un serviciu și expusă printr-o funcție

    *De ce?*: Logica într-un serviciu poate fi izolată mult mai ușor într-un unit test, iar logica de apelare dintr-un controler poate fi generată mai ușor.

    *De ce?*: Înlătură dependințele și ascunde detaliile implementarării din controller.

    *De ce?*: Păstrează controller-ul subțire, curat și focusat.

  ```javascript

  /* evită */
  function OrderController($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
          var settings = {};
          // Ia URL-ul de bază a serviciului de credit din config 
          // Setează antetele necesare serviciului de credit
          // Pregătește query string-ul URL-ului sau obiectul de date cu datele de interogare
          // Adaugă informații de identificare a utilizatorului pentru ca serviciul să ia limita corectă de credite pentru utilizatorul curent
          // Folosește JSONP pentru acest browser dacă nu suportă CORS
          return $http.get(settings)
              .then(function(data) {
               // Desfă data JSON din obiectul de răspus
                 // ca să găsești maxRemainingAmount
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Interpretează eroarea
                 // Tratezi timeout-ul? reîncerci? încerci un serviciu alternat?
                 // Respinge cu eroarea adecvată pentru utilizator
              });
      };
  }
  ```

  ```javascript
  /* recomandat */
  function OrderController(creditService) {
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

### Păstrează controllerele focusate
###### [Style [Y037](#style-y037)]

  - Definește un controler pentru un view, și încearcă să nu reutilizezi controlerul pentru alte view-uri. În schimb, mută logica reutilizabilă în factory-uri și păstrează controlerul simplu și focusat pe view-ul său.

    *De ce?*: Reutilizarea controllerelor cu mai multe view-uri este fragilă și necesită teste end-to-end (e2e) cu acoperire foarte bună pentru a asigura stabilitatea în aplicații mari.

### Asignarea de controlere
###### [Style [Y038](#style-y038)]

  - Când un controller trebuie legat cu un view și unul dintre cele două componente trebuie refolosite de alte controlere sau view-uri, definește controlere și rutele lor.

    Notă: Dacă un View este încărcat printr-un alt procedeu decât prin rutare, foloselște syntaxa `ng-controller="Avengers as vm"`.

    *De ce?*: Combinarea unui controler în rută permite mai multor rute să invoce diferite perechi de controlere și view-uri. Când controllerele sunt asignat în view folosing  [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), acel view este întotdeauna asociat cu același controller.

 ```javascript
  /* evită - when using with a route and dynamic pairing is desired */
  /* evită - când este folosit cu o rută iar combinarea dinamică e dorită */

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
  <div ng-controller="AvengersController as vm">
  </div>
  ```

  ```javascript
  /* recomandat */

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

**[Înapoi sus](#table-of-contents)**

## Serviciile

### Singletonurile
###### [Style [Y040](#style-y040)]

  - Serviciile sunt instanțiate cu keywordul `new`, folosește `this` pentru metode publice și variabile. De vreme ce acestea sunt atât de similare cu factory-urile, foloseste un factory în schimb pentru consecvență.

    Notă: [Toate serviciile angular sunt singletonuri](https://docs.angularjs.org/guide/services). Aceasta înseamnă că este una și numai o instanță de serviciu per injector.

  ```javascript
  // serviciu
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

**[Înapoi sus](#table-of-contents)**

## Factory-urile

### Responsibilitate unică
###### [Style [Y050](#style-y050)]

  - Factory-urile ar trebui să aibă o [responsabilitate unică](https://en.wikipedia.org/wiki/Single_responsibility_principle), ce e encapsulată de contextul său. Când un factory începe să depășească acel scop unic, un factory nou trebuie creat.
  - Factories should have a [single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a factory begins to exceed that singular purpose, a new factory should be created.

### Siingletonuri
###### [Style [Y051](#style-y051)]

  - Factory-urile sunt singletonuri și returnează un obiect ce conține membrii unui serviciu.

    Notă: [Toate serviciile angular sunt singletonuri](https://docs.angularjs.org/guide/services).

### Membrii accesibili sus
###### [Style [Y052](#style-y052)]

  - Expune membrii apelabili ai unui serviciu (interfața sa) sus, folosind o tehnică derivată din șablonul [Revealing Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *De ce?*: Plasânt membri apelabili sus face mai ușoară citirea și te ajută să identifici instant care membri ai serviciului pot fi apelați și trebuie să fie testați (și/sau generați) 

    *De ce?*: Aceasta este util în special când fișierul devine mai mare și evită nevoii de a face scroll pentru a vedea ce e expus.

    *De ce?*: Setarea funcțiilor pe parcurs poate fi ușoară, dar când acele funcții sunt mai mult de o linie de cod ele pot reduce din lizibilitate și cauza mai mult scrolling. Definirea interfeței apelabile prin serviciul returnat mută detaliile de implementare jos, păstrează interfața apelabilă sus, și face totul mai ușor de citit.

  ```javascript
  /* evită */
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
  /* recomandat */
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

  În modul acesta bindurile sunt oglindite în obiectul gazdă, iar valorile primitive nu pot fi modificate prin șablonului modulului expunător.

    ![Factory care folosește "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-2.png)

### Declarații de funcții pentru ascunderea detaliilor de implementare
###### [Style [Y053](#style-y053)]

  - Folosește declarații de funcț ii pentru ascunderea detaliilor de implementare. Păstrează membrii accesibili ai factory-ului sus. Pointează-i spre declarații de funcții care apar mai târziu în fișier. Pentru mai multe detalii vezi [acest articol](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *De ce?*: Plasarea membrilor accesibili sus face mai totul mai lizibil și te-ajută să identifici instant ce funcții ale factory-ului poți accesa în exterior.

    *De ce?*: Plasarea detaliilor implementării unei funcții mai târziu în fișier mută toată complexitatea respectivă în afara câmpului vizual așa că poți vedea lucrurile importante sus.

    *De ce?*: Declarațiile funcțiilor sunt hoistate deci nu există griji în legătură cu utilizarea unei funcții înaintea definirii ei (așa cum ar fi cazul cu expresiile de funcții) 
    *De ce?*: Function declarations are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).

    *De ce?*: În legătură cu declarațiile de funcții, nu trebuie să-ți faci griji niciodată cum că mutând `var a` înainte de `var b` îți va strica codul fiindcă `a` depinde de `b`.

    *De ce?*: Ordinea e critică cu expresiile de funcții

  ```javascript
  /**
   * evitp
   * Folosirea de expresii de funcții
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
   * recomandat
   * Folosirea de declarații de funcții
   * și membrii accesibili sus.
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
          // detaliile implementării vin aici
      }

      function getAvengerCount() {
          // detaliile implementării vin aici
      }

      function getAvengersCast() {
          // detaliile implementării vin aici
      }

      function prime() {
          // detaliile implementării vin aici
      }

      function ready(nextPromises) {
          // detaliile implementării vin aici
      }
  }
  ```

**[Înapoi sus](#table-of-contents)**

## Servicii de date

### Apeluri de date separate
###### [Style [Y060](#style-y060)]

  - Mută codul care face operații de date și interacționează cu date într-un factory. Fă serviciile de date responsabile de apeluri XHR, storage local, stashing în memorie, sau orice alte operații de date. 

    *De ce?*: Responsabilitatea controlerului este de a prezenta și aduna informații pentru view. Lui nu ar trebui să-i pese cum ia datele, ci doar să știe de la cine să le ceară. Separarea serviciilor de date mută logica luării datelor într-un serviciu de date, și lasă controlerul să fie mai simplu și mai focusat pe view.

    *De ce?*: Face mai ușoară testarea și generarea de date false pentru când se testează un controler ce folosește un serviciu de date.

    *De ce?*: Implementarea unui serviciu de date ar putea avea cod foarte specific depozitului de date. Asta ar putea include antete, cum să vorbești datelor, sau alte servicii precum `$http`. Separarea logicii într-un serviciu de date encapsulează această logică într-un singur loc, ascunzând implementarea de utilizatorii externi (poate un controler), și face și mai ușoară o eventuală schimbare a implementării.

  ```javascript
  /* recomandat */

  // factory de serviciu de date
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

    Notă: Serviciul de date e apelat de consumatori, precum un controller, ascunzând implementarea pentru consumatori, precum e arătat mai jos.

  ```javascript
  /* recomandat */

  // controler care apelează factory-ul serviciului de date
  angular
      .module('app.avengers')
      .controller('AvengersController', AvengersController);

  AvengersController.$inject = ['dataservice', 'logger'];

  function AvengersController(dataservice, logger) {
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

### Returnează un promise prin apeluri la date
###### [Style [Y061](#style-y061)]

  - Când apelezi un serviciu de date ce returnează un promise, precum `$http`, returnează un promise în funcția ta de asemenea.

    *De ce?*: Poți înlănțui promise-urile și să iei decizii după ce apelul de date e gata și se rezolvă sau respinge promise-ul.

  ```javascript
  /* recomandat */

  activate();

  function activate() {
      /**
       * Pas 1
       * Cere funcției getAvengers datele
       * și așteaptă promise-ul
       */
      return getAvengers().then(function() {
          /**
           * Pas 4
           * Execută o acțiune la rezolvarea promse-ului final
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Step 2
         * Cere datele servicului de date și
         * așteaptă promise-ul
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Step 3
                 * setează data și rezolvă promise-ul
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[Înapoi sus](#table-of-contents)**

## Directive
### Limitează-te la 1 per fișier
###### [Style [Y070](#style-y070)]

  - Crează o directivă per fișier. Numește fișierul precum directiva.

    *De ce?*: E ușor să arunci toate directivele într-un singur fișier, dar greu să le spargi pe urmă astfel încât unele din ele sunt folosite de mai multe aplicații, unele doar de mai multe module, și altele doar pentru un singur modul.

    *De ce?*: O directivă per fișier face totul mai ușor de gestionat.

    > Notă: "**Best Practice**: Directivele ar trebui să curețe după ele. Poți folosi `element.on('$destroy', ...)` sau `scope.$on('$destroy', ...)` ca să rulezi o funcție de clean-up când directiva e înlăturată" ... din documentația Angular.
    > Notă: "**Best Practice**: Directives should clean up after themselves. You can use `element.on('$destroy', ...)` or `scope.$on('$destroy', ...)` to run a clean-up function when the directive is removed" ... from the Angular documentation.

  ```javascript
  /* evită */
  /* directives.js */

  angular
      .module('app.widgets')

      /* directivă pentru comenzi specifică modulului de comenzi */
      .directive('orderCalendarRange', orderCalendarRange)

      /* directivă pentru vânzări ce poate fi folosită oriunde în aplicația de sales */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* directivă pentru spinner ce poate fi folosită oriunde */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* detalii de implementare */
  }

  function salesCustomerInfo() {
      /* detalii de implementare */
  }

  function sharedSpinner() {
      /* detalii de implementare */
  }
  ```

  ```javascript
  /* recomandat */
  /* calendar-range.directive.js */

  /**
   * @desc directivă pentru comenzi specifică modulului de comenzi la o companie numită Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* detalii de implementare */
  }
  ```

  ```javascript
  /* recomandat */
  /* customer-info.directive.js */

  /**
   * @desc directivă pentru vânzări ce poate fi folosită oriunde în aplicația de sales la o companie numită Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* detalii de implementare */
  }
  ```

  ```javascript
  /* recomandat */
  /* spinner.directive.js */

  /**
   * @desc directivă pentru spinner ce poate fi folosită oriunde la o companie numită Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* detalii de implementare */
  }
  ```

    Notă: Sunt multe opțiuni de numire pentru directive, în special datoriă faptului că pot fi folosite în scopuri mai mici sau mai largi. Alege un nume ce face directiva și numele fișierului său distinct și clar. Niște example sunt mai jos, dar vezi secțiunea de [Denumire](#naming) pentru mai multe recomandări.

### Manipulează DOM-ul într-o Directivă
###### [Style [Y072](#style-y072)]

  - Când manipulezi DOM-ul direct, folosește o directivă. Dacă metode alternative pot fi folosite, precum folosirea de CSS pentru a seta stilurile sau [serviciile de animație](https://docs.angularjs.org/api/ngAnimate), șablonarea Angular, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) sau [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), atunci folosește-le pe acelea în schimb. De exemplu, dacă directiva doar arată / ascunde, folosește ngHide/ngShow.

    *De ce?*: Manipulările de DOM pot fi greu de testat, reparat, și de multe ori există soluții mai bune (e.g. CSS, animații, șablonare)
    *De ce?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

### Oferă un prefix unic Directivei
###### [Style [Y073](#style-y073)]

  - Oferă un prefix scurt, unic și descriptiv directivei precum `acmeSalesCustomerInfo` care, în HTML, ar fi declarat ca `acme-sales-customer-info`.

    *De ce?*: Prefixul scurt și unic identifică contextul și originea directivei. De exemplu, un prefix ca `cc-` ar putea indica că directiva face parte dintr-o aplicație CodeCamper, iar `acme-` ar putea indica o directivă pentru compania Acme.

    Notă: Evită `ng-`, deoarece acestea sunt rezervate pentru directivele Angular. Află mai multe despre directivele populare pentru a evita conflictele de nume, precum `ion-` pentru [Framework-ul Ionic](http://ionicframework.com/).

### Rămâi la Elemente și Atribute
###### [Style [Y074](#style-y074)]

  - Când creezi o directivă care are sens pe cont propriu, permite `E` (element custom) și opțional restrict `A` (atribut custom). În general, dacă poate fi un control de sine stătător, `E` e adecvat. Ghidul geeneral e să permiți `EA` dar tinde spre implementarea ca un element atunci când e folosibil pe cont-propriu și ca atribut când dezvoltă elementul său existent.

    *De ce?*: Are sens.

    *De ce?*: Chiar dacă putem lăsa directiva să fie folosită ca și clasă, dacă directiva e într-adevăr un element are mai mult sens ca un element sau măcar ca un atribut.

    Notă: EA este implicitul pentru Angular 1.3 +

  ```html
  <!-- evită -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* evită */
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
  <!-- recomandat -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* recomandat */
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

### Directive și ControllerAs
###### [Style [Y075](#style-y075)]

  - Folosește sintaxa `controller as` cu o directivă pentru a fi consecvent cu folosirea `controller as` cu perechile de view și controler.

    *De ce?*: Are sens și nu e greu.

    Notă: Directiva de mai jos demonstrează unele din modalitățile pe care poți folosi într-un controler de link / directivă, folosind controllerAs. Am pus șablonul in-line doar ca să am totul în același loc.

    Notă: Cât despre injectarea de dependințe, vezi [Identificarea Manuală a Dependințelor](#manual-annotating-for-dependency-injection).

    Notă: Observă că controllerul directivei este în afara closure-ului directivei. Acest stil elimină problemele unde injectarea se crează ca și cod la care nu se poate ajunge după un `return`.

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
          controller: ExampleController,
          // Notă: Acesta ar fi 'ExampleController' (numele controlerului exportat, ca string)
          // dacă s-ar referi la un controller definit în fișierul său separat
          controllerAs: 'vm',
          bindToController: true // fiindcă scope-ul e izolat
      };

      return directive;

      function linkFunc(scope, el, attr, ctrl) {
          console.log('LINK: scope.min = %s *** ar trebui să fie undefined', scope.min);
          console.log('LINK: scope.max = %s *** ar trebui să fie undefined', scope.max);
          console.log('LINK: scope.vm.min = %s', scope.vm.min);
          console.log('LINK: scope.vm.max = %s', scope.vm.max);
      }
  }

  ExampleController.$inject = ['$scope'];

  function ExampleController($scope) {
      // Injecting $scope just for comparison
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

    Notă: You can also name the controller when you inject it into the link function and access directive attributes as properties of the controller.

  ```javascript
  // Alternativă la exemplul de mai sus
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```

###### [Style [Y076](#style-y076)]

  - Folosește `bindToController = true` cănd ai sintaxa `controller as` cu o directivă când dorești să legi scopul extern de scopul controllerului directivei.

    *De ce?*: Face ușoară legarea scopului extern de scopul controlerului directivei.

    Notă: `bindToController` a fost introdus în 1.3.0.

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

**[Înapoi sus](#table-of-contents)**

## Resolvarea de promise-uri
### Controller Activation Promises
###### [Style [Y080](#style-y080)]

  - Pune logica de inițiere într-o funcție `activate`.

    *De ce?*: Punerea logicii de început într-un loc consecvent în controller o face mai ușor de localizat, mai consecvent la testare, li ajută la evitarea răspândirii logicii inițiale de-alungul controllerului. 

    *De ce?*: Funcția `activate` face mai convenabilă reutilizarea logicii a unui refresh a controllerului/View-ului, păstrează logica împreună, îndrumă utilizatorul la View mai repede, face animațiile mai ușoare pe `ng-view` sau `ui-view`, și se simte mai vioi pentru utilizator.

    Notă: Dacă ai nevoie să anulezi condițional ruta înainte de-a folosi controllerul, folosește un [route resolve](#style-y081) în schimb.

  ```javascript
  /* evită */
  function AvengersController(dataservice) {
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
  /* recomandat */
  function AvengersController(dataservice) {
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

### Rutele Rezolvă Promise-urile
###### [Style [Y081](#style-y081)]

  - Când un controller depinde de un promise să fie rezolvat înainte ca el să fie activat, rezolvă acele dependințe în `$routeProvider` înainte ca logica controllerului să fie executată. Dacă ai nevoie să anulezi o rută înainte ca un controller să fie activat, folosește un resolver de rută. 

  - Folosește un resolver de rută când vrei să decizi să anulez ruta înainte de-a tranziționa în View.

    *De ce?*: Un controller ar putea necesita date înainte de a se încărca. Acele date pot veni de la un promise printr-un factory custom sau [$http](https://docs.angularjs.org/api/ng/service/$http). Folosirea unui [resolver de rută](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) permite promise-ului să fie rezolvat înainte ca logica controllerului să fie executată, așa că ar putea acționa bazându-se pe data de la promise.

    *De ce?*: Codul execută după rută și în funcția de 'activate' din controller. View-ul începe să se încarce direct. Legarea datelor apare când promise-ul de activare se rezolvă. O animație de "busy" poate fi arătată pe durata tranziției view-ului (prin `ng-view` or `ui-view`)
    *De ce?*: The code executes after the route and in the controller’s activate function. The View starts to load right away. Data binding kicks in when the activate promise resolves. A “busy” animation can be shown during the view transition (via `ng-view` or `ui-view`)

    Notă: Codul se execută înaintea rutei printr-un promise. Respingerea promise-ului anulează ruta. Rezolvarea face ca noul view să aștepte ca ruta să fie rezolvată O animație de "busy" paote fi arătată înainte de rezolvare și de-alungul tranziției view-ulu. Dacă vrei să primești View-ul mai repede și nu ai nevoie de un checkpoint ca să decizi dacă poți ajunge la View, consideră folosirea tehnicii [controller `activate`](#style-y080) în schimb.
    Notă: The code executes before the route via a promise. Rejecting the promise cancels the route. Resolve makes the new view wait for the route to resolve. A “busy” animation can be shown before the resolve and through the view transition. If you want to get to the View faster and do not require a checkpoint to decide if you can get to the View, consider the [controller `activate` technique](#style-y080) instead.

  ```javascript
  /* evită */
  angular
      .module('app')
      .controller('AvengersController', AvengersController);

  function AvengersController(movieService) {
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
  /* mai bine */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'AvengersController',
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
      .controller('AvengersController', AvengersController);

  AvengersController.$inject = ['moviesPrepService'];
  function AvengersController(moviesPrepService) {
      var vm = this;
      vm.movies = moviesPrepService.movies;
  }
  ```

    Notă: Exemplul de mai jos arată punctele de rezolvare a rutei spre o funcție denumită, ceea ce face codul mai ușor de reparat și mai ușor de gestionat injectarea de dependințe.

  ```javascript
  /* și mai bine */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'AvengersController',
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
      .controller('AvengersController', AvengersController);

  AvengersController.$inject = ['moviesPrepService'];
  function AvengersController(moviesPrepService) {
        var vm = this;
        vm.movies = moviesPrepService.movies;
  }
  ```
    Notă: Dependința codului la `movieService` nu este sigur pentru minificare. Pentru detalii despre cum să faci acest cod sigur pentru minificare, vezi secțiunile despre [injectarea de dependințe](#manual-annotating-for-dependency-injection) și despre [minificare și adnotare](#minification-and-annotation).

**[Înapoi sus](#table-of-contents)**

### Handling Exceptions with Promises
###### [Style [Y082](#style-y082)]

  - The `catch` block of a promise must return a rejected promise to maintain the exception in the promise chain.

  - Always handle exceptions in services/factories.

    *De ce?*: If the `catch` block does not return a rejected promise, the caller of the promise will not know an exception occurred. The caller's `then` will execute. Thus, the user may never know what happened.

    *De ce?*: To avoid swallowing errors and misinforming the user.

    Notă: Consider putting any exception handling in a function in a shared module and service.

  ```javascript
  /* evită */

  function getCustomer(id) {
      return $http.get('/api/customer/' + id)
          .then(getCustomerComplete)
          .catch(getCustomerFailed);

      function getCustomerComplete(data, status, headers, config) {
          return data.data;
      }

      function getCustomerFailed(e) {
          var newMessage = 'XHR Failed for getCustomer'
          if (e.data && e.data.description) {
            newMessage = newMessage + '\n' + e.data.description;
          }
          e.data.description = newMessage;
          logger.error(newMessage);
          // ***
          // Notice there is no return of the rejected promise
          // ***
      }
  }

  /* recomandat */
  function getCustomer(id) {
      return $http.get('/api/customer/' + id)
          .then(getCustomerComplete)
          .catch(getCustomerFailed);

      function getCustomerComplete(data, status, headers, config) {
          return data.data;
      }

      function getCustomerFailed(e) {
          var newMessage = 'XHR Failed for getCustomer'
          if (e.data && e.data.description) {
            newMessage = newMessage + '\n' + e.data.description;
          }
          e.data.description = newMessage;
          logger.error(newMessage);
          return $q.reject(e);
      }
  }
  ```

**[Înapoi sus](#table-of-contents)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification
###### [Style [Y090](#style-y090)]

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.

    *De ce?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by Angular.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    function DashboardController(common, dataservice) {
    }
    ```

    This code may produce mangled variables when minified and thus cause runtime errors.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('DashboardController', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
###### [Style [Y091](#style-y091)]

  - Use `$inject` to manually identify your dependencies for Angular components.

    *De ce?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

    *De ce?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by Angular.

    *De ce?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function.

    ```javascript
    /* evită */
    angular
        .module('app')
        .controller('DashboardController',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* evită */
    angular
      .module('app')
      .controller('DashboardController',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recomandat */
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function DashboardController($location, $routeParams, common, dataservice) {
    }
    ```

    Notă: When your function is below a return statement the `$inject` may be unreachable (this may happen in a directive). You can solve this by moving the Controller outside of the directive.

    ```javascript
    /* evită */
    // inside a directive definition
    function outer() {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;

        DashboardPanelController.$inject = ['logger']; // Unreachable
        function DashboardPanelController(logger) {
        }
    }
    ```

    ```javascript
    /* recomandat */
    // outside a directive definition
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

### Manually Identify Route Resolver Dependencies
###### [Style [Y092](#style-y092)]

  - Use `$inject` to manually identify your route resolver dependencies for Angular components.

    *De ce?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

    *De ce?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

    ```javascript
    /* recomandat */
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'AvengersController',
                controllerAs: 'vm',
                resolve: {
                    moviesPrepService: moviesPrepService
                }
            });
    }

    moviesPrepService.$inject = ['movieService'];
    function moviesPrepService(movieService) {
        return movieService.getMovies();
    }
    ```

**[Înapoi sus](#table-of-contents)**

## Minification and Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/* @ngInject */`

    *De ce?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

    *De ce?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated

    >I prefer Gulp as I feel it is easier to write, to read, and to debug.

    The following code is not using minification safe dependencies.

    ```javascript
    angular
        .module('app')
        .controller('AvengersController', AvengersController);

    /* @ngInject */
    function AvengersController(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }
    ```

    When the above code is run through ng-annotate it will produce the following output with the `$inject` annotation and become minification-safe.

    ```javascript
    angular
        .module('app')
        .controller('AvengersController', AvengersController);

    /* @ngInject */
    function AvengersController(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }

    AvengersController.$inject = ['storage', 'avengerService'];
    ```

    Notă: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

    Notă: When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

    ```javascript
    // Using @ngInject annotations
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'AvengersController',
                controllerAs: 'vm',
                resolve: { /* @ngInject */
                    moviesPrepService: function(movieService) {
                        return movieService.getMovies();
                    }
                }
            });
    }
    ```

    > Notă: Starting from Angular 1.3 you can use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter to detect any potentially missing minification safe dependencies. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code. I prefer to only use `ng-strict-di` for debugging purposes only.
    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate
###### [Style [Y101](#style-y101)]

  - Use [gulp-ng-annotate](https://www.npmjs.com/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.com/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.

    *De ce?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

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

**[Înapoi sus](#table-of-contents)**

## Exception Handling

### decorators
###### [Style [Y110](#style-y110)]

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.

    *De ce?*: Provides a consistent way to handle uncaught Angular exceptions for development-time or run-time.

    Notă: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recomandat.

    ```javascript
    /* recomandat */
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

    *De ce?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

    Notă: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

    ```javascript
    /* recomandat */
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

    *De ce?*: Provides a consistent way to handle all routing errors.

    *De ce?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or recovery options.

    ```javascript
    /* recomandat */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Route cancellation:
         * On routing error, go to the dashboard.
         * Provide an exit clause if it tries to do it twice.
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
                 * Optionally log using a custom service or $log.
                 * (Don't forget to inject custom service)
                 */
                logger.warning(msg, [current]);

                /**
                 * On routing error, go to another route/state.
                 */
                $location.path('/');

            }
        );
    }
    ```

**[Înapoi sus](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [Y120](#style-y120)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recomandat pattern is `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.controller.js`)
    * the registered component name with Angular (`AvengersController`)

    *De ce?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *De ce?*: The naming conventions should simply help you find your code faster and make it easier to understand.

### Feature File Names
###### [Style [Y121](#style-y121)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recomandat pattern is `feature.type.js`.

    *De ce?*: Provides a consistent way to quickly identify components.

    *De ce?*: Provides pattern matching for any automated tasks.

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
     * recomandat
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

  Notă: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team. My preference is `avengers.controller.js` identifying the `AvengersController`.

    ```javascript
    /**
     * recomandat
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Test File Names
###### [Style [Y122](#style-y122)]

  - Name test specifications similar to the component they test with a suffix of `spec`.

    *De ce?*: Provides a consistent way to quickly identify components.

    *De ce?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```javascript
    /**
     * recomandat
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Controller Names
###### [Style [Y123](#style-y123)]

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    *De ce?*: Provides a consistent way to quickly identify and reference controllers.

    *De ce?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    ```javascript
    /**
     * recomandat
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController() { }
    ```

### Controller Name Suffix
###### [Style [Y124](#style-y124)]

  - Append the controller name with the suffix `Controller`.

    *De ce?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

    ```javascript
    /**
     * recomandat
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Factory and Service Names
###### [Style [Y125](#style-y125)]

  - Use consistent names for all factories and services named after their feature. Use camel-casing for services and factories. Avoid prefixing factories and services with `$`. Only suffix service and factories with `Service` when it is not clear what they are (i.e. when they are nouns).

    *De ce?*: Provides a consistent way to quickly identify and reference factories.

    *De ce?*: Avoids name collisions with built-in factories and services that use the `$` prefix.

    *De ce?*: Clear service names such as `logger` do not require a suffix.

    *De ce?*: Service names such as `avengers` are nouns and require a suffix and should be named `avengersService`.

    ```javascript
    /**
     * recomandat
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

    ```javascript
    /**
     * recomandat
     */

    // credit.service.js
    angular
        .module
        .factory('creditService', creditService);

    function creditService() { }

    // customer.service.js
    angular
        .module
        .service('customerService', customerService);

    function customerService() { }
    ```

### Directive Component Names
###### [Style [Y126](#style-y126)]

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    *De ce?*: Provides a consistent way to quickly identify and reference components.

    ```javascript
    /**
     * recomandat
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Modules
###### [Style [Y127](#style-y127)]

  - When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`.

    *De ce?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *De ce?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration
###### [Style [Y128](#style-y128)]

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *De ce?*: Separates configuration from module definition, components, and active code.

    *De ce?*: Provides an identifiable place to set configuration for a module.

### Routes
###### [Style [Y129](#style-y129)]

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration.

**[Înapoi sus](#table-of-contents)**

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

    *De ce?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly, they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

    *De ce?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat
###### [Style [Y143](#style-y143)]

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *De ce?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - Be DRY, but don't go nuts and sacrifice readability.

    *De ce?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it.

**[Înapoi sus](#table-of-contents)**

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  - Have a near term view of implementation and a long term vision. In other words, start small but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    Notă: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions.

    *De ce?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed.

    *De ce?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names.

    *De ce?*: The LIFT guidelines are all covered.

    *De ce?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *De ce?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

    ```javascript
    /**
     * recomandat
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

      ![Sample App Structure](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-2.png)

      Notă: Do not structure your app using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

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

**[Înapoi sus](#table-of-contents)**

## Modularity

### Many Small, Self Contained Modules
###### [Style [Y160](#style-y160)]

  - Create small modules that encapsulate one responsibility.

    *De ce?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally. This means we can plug in new features as we develop them.

### Create an App Module
###### [Style [Y161](#style-y161)]

  - Create an application root module whose role is to pull together all of the modules and features of your application. Name this for your application.

    *De ce?*: Angular encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *De ce?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

    *De ce?*: The app module becomes a manifest that describes which modules help define the application.

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *De ce?*: Self contained modules can be added to the application with little or no friction.

    *De ce?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *De ce?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code.

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *De ce?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - The application root module depends on the app specific feature modules and any shared or reusable modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-1.png)

    *De ce?*: The main app module contains a quickly identifiable manifest of the application's features.

    *De ce?*: Each feature area contains a manifest of what it depends on, so it can be pulled in as a dependency in other applications and still work.

    *De ce?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Notă: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows Angular's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind.

    > In a small app, you can also consider putting all the shared dependencies in the app module where the feature modules have no direct dependencies. This makes it easier to maintain the smaller application, but makes it harder to reuse modules outside of this application.

**[Înapoi sus](#table-of-contents)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidates include providers and constants.

    *De ce?*: This makes it easier to have less places for configuration.

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

    *De ce?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Înapoi sus](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *De ce?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *De ce?*: These services are wrapped by Angular and more easily testable and handle Angular's digest cycle thus keeping data binding in sync.

**[Înapoi sus](#table-of-contents)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *De ce?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

    ```javascript
    it('should have Avengers controller', function() {
        // TODO
    });

    it('should find 1 Avenger when filtered by name', function() {
        // TODO
    });

    it('should have 10 Avengers', function() {
        // TODO (mock data?)
    });

    it('should return Avengers via XHR', function() {
        // TODO ($httpBackend?)
    });

    // and so on
    ```

### Testing Library
###### [Style [Y191](#style-y191)]

  - Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://mochajs.org) for unit testing.

    *De ce?*: Both Jasmine and Mocha are widely used in the Angular community. Both are stable, well maintained, and provide robust testing features.

    Notă: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com). I prefer Mocha.

### Test Runner
###### [Style [Y192](#style-y192)]

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *De ce?*: Karma is easy to configure to run once or automatically when you change your code.

    *De ce?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *De ce?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](https://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *De ce?*: Karma works well with task automation leaders such as [Grunt](http://gruntjs.com/) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://gulpjs.com/). When using Gulp, use [Karma](https://github.com/karma-runner/karma) directly and not with a plugin as the API can be called directly.

    ```javascript
    /* recomandat */

    // Gulp example with Karma directly
    function startTests(singleRun, done) {
        var child;
        var excludeFiles = [];
        var fork = require('child_process').fork;
        var Server = require('karma').Server;
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

        var karmaOptions = {
          configFile: __dirname + '/karma.conf.js',
          exclude: excludeFiles,
          singleRun: !!singleRun
        };

        let server = new Server(karmaOptions, karmaCompleted);
        server.start();

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

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - Use [Sinon](http://sinonjs.org/) for stubbing and spying.

    *De ce?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *De ce?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

    *De ce?*: Sinon has descriptive messages when tests fail the assertions.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *De ce?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server.

    Notă: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - Run JSHint on your tests.

    *De ce?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`. Relax the rules for expressions, as Mocha uses these.

    *De ce?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Or you can add the following to your JSHint Options file.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/testing-tools.png)

### Organizing Tests
###### [Style [Y197](#style-y197)]

  - Place unit test files (specs) side-by-side with your client code. Place specs that cover server integration or test multiple components in a separate `tests` folder.

    *De ce?*: Unit tests have a direct correlation to a specific component and file in source code.

    *De ce?*: It is easier to keep them up to date since they are always in sight. When coding whether you do TDD or test during development or test after development, the specs are side-by-side and never out of sight nor mind, and thus more likely to be maintained which also helps maintain code coverage.

    *De ce?*: When you update source code it is easier to go update the tests at the same time.

    *De ce?*: Placing them side-by-side makes it easy to find them and easy to move them with the source code if you move the source.

    *De ce?*: Having the spec nearby makes it easier for the source code reader to learn how the component is supposed to be used and to discover its known limitations.

    *De ce?*: Separating specs so they are not in a distributed build is easy with grunt or gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.js
                             /customers.controller.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Înapoi sus](#table-of-contents)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - Use subtle [animations with Angular](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *De ce?*: Subtle animations can improve User Experience when used appropriately.

    *De ce?*: Subtle animations can improve perceived performance as views transition.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.

    *De ce?*: Long animations can have the reverse effect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css
###### [Style [Y212](#style-y212)]

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *De ce?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *De ce?*: Provides consistency in your animations.

    *De ce?*: animate.css is widely used and tested.

    Notă: See this [great post by Matias Niemelä on Angular animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Înapoi sus](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *De ce?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *De ce?*: Provides consistency using a common industry tool.

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

**[Înapoi sus](#table-of-contents)**

## JS Hint

### Use an Options File
###### [Style [Y230](#style-y230)]

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://jshint.com/docs/) for details on the options.

    *De ce?*: Provides a first alert prior to committing any code to source control.

    *De ce?*: Provides consistency across your team.

    ```javascript
    {
        "bitwise": true,
        "camelcase": true,
        "curly": true,
        "eqeqeq": true,
        "esversion": 6,
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
        "maxerr": 50,
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

**[Înapoi sus](#table-of-contents)**

## JSCS

### Use an Options File
###### [Style [Y235](#style-y235)]

  - Use JSCS for checking your coding styles your JavaScript and be sure to customize the JSCS options file and include in source control. See the [JSCS docs](http://jscs.info/) for details on the options.

    *De ce?*: Provides a first alert prior to committing any code to source control.

    *De ce?*: Provides consistency across your team.

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

**[Înapoi sus](#table-of-contents)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - Create an Angular Constant for vendor libraries' global variables.

    *De ce?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

  - Use constants for values that do not change and do not come from another service. When constants are used only for a module that may be reused in multiple applications, place constants in a file per module named after the module. Until this is required, keep constants in the main module in a `constants.js` file.

    *De ce?*: A value that may change, even infrequently, should be retrieved from a service so you do not have to change the source code. For example, a url for a data service could be placed in a constants but a better place would be to load it from a web service.

    *De ce?*: Constants can be injected into any angular component, including providers.

    *De ce?*: When an application is separated into modules that may be reused in other applications, each stand-alone module should be able to operate on its own including any dependent constants.

    ```javascript
    // Constants used by the entire app
    angular
        .module('app.core')
        .constant('moment', moment);

    // Constants used only by the sales module
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[Înapoi sus](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Angular snippets that follow these styles and guidelines.

    - Download the [Sublime Angular snippets](assets/sublime-angular-snippets?raw=true)
    - Place it in your Packages folder
    - Restart Sublime
    - In a JavaScript file type these commands followed by a `TAB`

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

  - Angular file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Angular live templates that follow these styles and guidelines.

    - Download the [webstorm-angular-live-templates.xml](assets/webstorm-angular-live-templates/webstorm-angular-live-templates.xml?raw=true)
    - Place it in your [templates folder](https://www.jetbrains.com/webstorm/help/project-and-ide-settings.html)
    - Restart WebStorm
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    // These are full file snippets containing an IIFE
    ngapp     // creates an Angular module setter
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngfilter     // creates an Angular filter
    ngservice    // creates an Angular service

    // These are partial snippets intended to be chained
    ngconfig     // defines a configuration phase function
    ngmodule     // creates an Angular module getter
    ngroute      // defines an Angular ngRoute 'when' definition
    ngrun        // defines a run phase function
    ngstate      // creates an Angular UI Router state definition
    ```

  *Individual templates are also available for download within the [webstorm-angular-live-templates](assets/webstorm-angular-live-templates?raw=true) folder*

### Atom
###### [Style [Y253](#style-y253)]

  - Angular snippets that follow these styles and guidelines.
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    - Open Atom, then open the Package Manager (Packages -> Settings View -> Install Packages/Themes)
    - Search for the package 'angularjs-styleguide-snippets'
    - Click 'Install' to install the package

  - In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective // creates an Angular directive
    ngfactory // creates an Angular factory
    ngmodule // creates an Angular module
    ngservice // creates an Angular service
    ngfilter // creates an Angular filter
    ```

### Brackets
###### [Style [Y254](#style-y254)]

  - Angular snippets that follow these styles and guidelines.
    - Download the [Brackets Angular snippets](assets/brackets-angular-snippets.yaml?raw=true)
    - Brackets Extension manager ( File > Extension manager )
    - Install ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets)
    - Click the light bulb in brackets' right gutter
    - Click `Settings` and then `Import`
    - Choose the file and select to skip or override
    - Click `Start Import`

  - In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    // These are full file snippets containing an IIFE
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngapp        // creates an Angular module setter
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter

    // These are partial snippets intended to chained
    ngmodule     // creates an Angular module getter
    ngstate      // creates an Angular UI Router state definition
    ngconfig     // defines a configuration phase function
    ngrun        // defines a run phase function
    ngwhen      // defines an Angular ngRoute 'when' definition
    ngtranslate  // uses $translate service with its promise
    ```

### vim
###### [Style [Y255](#style-y255)]

  - vim snippets that follow these styles and guidelines.

    - Download the [vim Angular snippets](assets/vim-angular-snippets?raw=true)
    - set [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)
    - copy snippets to snippet directory

  - vim UltiSnips snippets that follow these styles and guidelines.

    - Download the [vim Angular UltiSnips snippets](assets/vim-angular-ultisnips?raw=true)
    - set [UltiSnips](https://github.com/SirVer/ultisnips)
    - copy snippets to UltiSnips directory

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter
    ```

### Visual Studio Code

###### [Style [Y256](#style-y256)]

  - [Visual Studio Code](https://code.visualstudio.com/) snippets that follow these styles and guidelines.

    - Download the [VS Code Angular snippets](assets/vscode-snippets/javascript.json?raw=true)
    - copy snippets to snippet directory, or alternatively copy and paste the snippets into your existing ones

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ```

### Emacs
###### [Style [Y257](#style-y257)]

  - [Emacs](https://www.gnu.org/software/emacs/) snippets that follow these styles and guidelines.

    - Download the [Emacs Angular snippets](assets/emacs-angular-snippets?raw=true)

      Note that yasnippet categorizes snippets by major mode, and there are several Emacs major modes for editing Javascript code. The snippets are in `js2-mode`, and the other directories contain only a dotfile to reference them there.

    - install [yasnippet](https://github.com/capitaomorte/yasnippet) (`M-x package-install RET yasnippet RET`)
    - copy snippets to snippet directory, or modify your Emacs init to add snippet directory to `yas-snippet-dirs`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter
    ```
    
**[Înapoi sus](#table-of-contents)**

## Yeoman Generator
###### [Style [Y260](#style-y260)]

You can use the [HotTowel yeoman generator](http://jpapa.me/yohottowel) to create an app that serves as a starting point for Angular that follows this style guide.

1. Install generator-hottowel

  ```
  npm install -g generator-hottowel
  ```

2. Create a new folder and change directory to it

  ```
  mkdir myapp
  cd myapp
  ```

3. Run the generator

  ```
  yo hottowel helloWorld
  ```

**[Înapoi sus](#table-of-contents)**

## Routing
Client-side routing is important for creating a navigation flow between views and composing views that are made of many smaller templates and directives.

###### [Style [Y270](#style-y270)]

  - Use the [AngularUI Router](http://angular-ui.github.io/ui-router/) for client-side routing.

    *De ce?*: UI Router offers all the features of the Angular router plus a few additional ones including nested routes and states.

    *De ce?*: The syntax is quite similar to the Angular router and is easy to migrate to UI Router.

  - Notă: You can use a provider such as the `routerHelperProvider` shown below to help configure states across files, during the run phase.

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

  - Define routes for views in the module where they exist. Each module should contain the routes for the views in the module.

    *De ce?*: Each module should be able to stand on its own.

    *De ce?*: When removing a module or adding a module, the app will only contain routes that point to existing views.

    *De ce?*: This makes it easy to enable or disable portions of an application without concern over orphaned routes.

**[Înapoi sus](#table-of-contents)**

## Task Automation
Use [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) for creating automated tasks.  Gulp leans to code over configuration while Grunt leans to configuration over code. I personally prefer Gulp as I feel it is easier to read and write, but both are excellent.

> Learn more about gulp and patterns for task automation in my [Gulp Pluralsight course](http://jpapa.me/gulpps)

###### [Style [Y400](#style-y400)]

  - Use task automation to list module definition files `*.module.js` before all other application JavaScript files.

    *De ce?*: Angular needs the module definitions to be registered before they are used.

    *De ce?*: Naming modules with a specific pattern such as `*.module.js` makes it easy to grab them with a glob and list them first.

    ```javascript
    var clientApp = './src/client/app/';

    // Always grab module files first
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Înapoi sus](#table-of-contents)**

## Filters

###### [Style [Y420](#style-y420)]

  - Avoid using filters for scanning all properties of a complex object graph. Use filters for select properties.

    *De ce?*: Filters can easily be abused and negatively affect performance if not used wisely, for example when a filter hits a large and deep object graph.

**[Înapoi sus](#table-of-contents)**

## Angular docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

**[Înapoi sus](#table-of-contents)**