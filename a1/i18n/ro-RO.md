# Ghid stilistic pentru Angular 1

## Aprobat de Echipa Angular
Mulțumiri speciale lui Igor Minar, liderul echipei Angular, pentru revizuire, dare de feedback, și pentru încrederea pe care mi-a acordat-o în păstorirea acestui ghid.

## Scop
*Ghid stilistic dogmatic de Angular pentru echipe de [@john_papa](//twitter.com/john_papa)*

Dacă cauți un ghid stilistic dogmatic pentru sintaxă, convenții și structurarea aplicațiilor Angular, pornește de aici. Aceste stiluri sunt bazate pe experiența mea de dezvoltare cu [Angular](//angularjs.org), prezentări, [cursuri de training Pluralsight](http://app.pluralsight.com/author/john-papa) și lucrul în echipe.

Scopul acestui ghid stilistic este acela de a oferi îndrumare pentru creerea de aplicații Angular prin expunereea convențiilor pe care le folosesc și, mai important, motivelor pentru care le-am ales.

> Dacă îți place acest ghid, vezi și cursul meu [Angular Patterns: Clean Code](http://jpapa.me/ngclean) de la Pluralsight, care este un companion pentru acest ghid.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Minunăția Comunității și Acreditare
Nu lucra niciodată într-un vid. Observ că comunitatea Angular este un grup incredibil care este pasionat de împărtășirea experiențelor. Din motivul acesta, expertul Angular Todd Motto și eu am colaborat la multe stiluri și convenții. Suntem de-acord la multe dintre ele, iar la unele nu. Te încurajez să vezi [Ghidurile lui Todd](https://github.com/toddmotto/angular-styleguide) ca să-ți faci o părere despre abordarea lui și cum diferă de acesta.

Multe dintre stilurile mele sunt din multitudinea de sesiuni de pair programming pe care eu și [Ward Bell](https://twitter.com/wardbell) le-am făcut. Prietenul meu Ward a influențat cu siguranță evoluția finală a acestui ghid.


## Vezi stilurile într-o Aplicație-Model
Chiar dacă acest ghid explică *ce*, *de ce* și *cum*, mi se pare folositor ca acestea să fie văzute în practică. Acest ghid este acompaniat de o aplicație-model ce folosește aceste stiluri și structuri. Poți găsi [aplicația-model (numită 'modular') aici](https://github.com/johnpapa/ng-demos) în folderul `modular`. Simte-te liber să o iei și să-i dai 'clone' sau 'fork'. [Instrucțiuni pentru rularea ei găsești în readme](https://github.com/johnpapa/ng-demos/tree/master/modular).


##Traduceri
[Traduceri ale acestui ghid stilistic pentru Angular](https://github.com/johnpapa/angular-styleguide/tree/master/a1/i18n) sunt gestionate de către comunitate și pot fi găsite aici.

## Cuprins

  1. [Responsibilitate unică](#single-responsibility)
  1. [IIFE](#iife)
  1. [Module](#modules)
  1. [Controllere](#controllers)
  1. [Servicii](#services)
  1. [Factory-uri](#factories)
  1. [Servicii de date](#data-services)
  1. [Directive](#directives)
  1. [Rezolvarea Promise-urilor](#resolving-promises)
  1. [Adnotarea manuală a Injecției de Dependințe](#manual-annotating-for-dependency-injection)
  1. [Minificare și Adnotare](#minification-and-annotation)
  1. [Tratarea Excepțiilor](#exception-handling)
  1. [Denumire](#naming)
  1. [Structura aplicației - Principiul LIFT](#application-structure-lift-principle)
  1. [Structura aplicației](#application-structure)
  1. [Modularitate](#modularity)
  1. [Logica de lansare](#startup-logic)
  1. [Servicii $Wrapper](#angular--wrapper-services)
  1. [Testare](#testing)
  1. [Animații](#animations)
  1. [Comentarii](#comments)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Constante](#constants)
  1. [Șabloane de fișier și snippeturi](#file-templates-and-snippets)
  1. [Generatorul Yeoman](#yeoman-generator)
  1. [Rutare](#routing)
  1. [Automatizarea taskurilor](#task-automation)
  1. [Filtre](#filters)
  1. [Documentația Angular](#angular-docs)

## Responsabilitatea Unică

### Regula 1
###### [Style [Y001](#style-y001)]

  - Definește 1 component per fișier, recomandat cu mai puțin de 400 de linii de cod.

  *De ce?*: Un component per fișier ușurează atât unit testing-ul cât și creerea de date de test mai ușor.

  *De ce?*: Un component per fișier face totul mult mai ușor de citit, gestionat, și de evitat conflictele cu echipa în source control.

  *De ce?*: Un component per fișier evită buguri ascunse care apar frecvent când se combină componentele în fișiere în care se folosesc aceleași variabile, se creează closure-uri nedorite, sau se leagă, în mod nedorit, de dependințe. 

  Următorul exemplu definește modulul `app` și dependințele sale, definește un controller și un factory, toate în același fișier.

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

  *De ce?*: Funcțiile mici încurajează reuzabilitatea.

  *De ce?*: Funcțiile mici sunt mai ușor de citit.

  *De ce?*: Funcțiile mici sunt mai ușor de gestionat.

  *De ce?*: Funcțiile mici ajută evitarea de buguri ascunse care apar frecvent când există funcții mari care se folosesc de aceleași variabile, care creează closure-uri nedorite, sau se leagă, în mod nedorit, de dependințe.
  
**[Înapoi sus](#table-of-contents)**

## IIFE
### Scopurile JavaScript
###### [Style [Y010](#style-y010)]

  - Învelește componentele Angular într-o Expresie de Funcție Imediat-Invocată (Immediately Invoked Function Expression (IIFE)).

  *De ce?*: Un IIFE înlătură variabilele din scopul global. Acest lucru previne ca variabilele și declarațiile de funcții să trăiască mai mult decât ar trebui în scopul global, ceea ce totodată ajută la evitarea conflictelor dintre variabile.

  *De ce?*: Când codul tău e minificat și împachetat într-un singur fișier pentru deployment pe un server de producție, ai putea avea conflicte între variabile și foarte multe variabile globale. Un IIFE te protejează împotriva ambelor probleme oferind scop variabilelor pentru fiecare fișier.

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

## Module

### Evită coliziunile de denumiri
###### [Style [Y020](#style-y020)]

  - Folosește convenții de denumire unice cu separatori pentru sub-module.

  *De ce?*: Numele unice ajută la evitarea coliziunilor de denumiri a submodulelor. Separatorii ajută la definirea modulelor și a ierarhiei submodulelor lor. De exemplu, `app` ar putea fi modulul tău de bază, iar `app.dashboard` și `app.users` ar putea fi module care să fie folosite ca și dependințe ale `app`.

### Definiri (sau Setteri)
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

  *De ce?*: Acest lucru produce cod mai lizibil, și evită coliziunile de variabile sau scurgerile.

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

### Setare vs Obținere
###### [Style [Y023](#style-y023)]

  - Setează doar o dată și obține pentru toate celelalte instanțe.

  *De ce?*: Un modul ar trebui să fie creat doar o dată, și preluat de-acolo-ncolo.

  ```javascript
  /* recomandat */

  // pentru a seta un modul
  angular.module('app', []);

  // pentru a obține un modul
  angular.module('app');
  ```

### Funcții Denumite vs Anonime
###### [Style [Y024](#style-y024)]

  - Folosește funcții denumite în locul pasării funcțiilor anonime ca și callback.

  *De ce?*: Produce cod mai lizibil, ușurează debug-ul, și reduce cantitatea de cod cu multe callback-uri cuibărite (??? xD)

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

## Controllere

### Sintaxa pentru View 'controllerAs' 
###### [Style [Y030](#style-y030)]

  - Folosește sintaxa [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) în locul `classicei sintaxe pentru controller cu $scope`.

  *De ce?*: Controllerele sunt construite, "reînnoite" și oferă o singură nouă instanță, iar sintaxa `controllerAs` e mult mai aproape de cea a unui constructor de JavaScript decât cea a `clasicei sintaxe cu $scope`.

  *De ce?*: Încurajează folosirea de binduri cu un obiect "dotted" din View (e.g. `customer.name` în loc de `name`), ceea ce e mult mai contextual, mai ușor de citit, și evită orice probleme de referințe ce-ar putea apărea cu "dotting".

  *De ce?*: Ajută la evitarea de apeluri la `$parent` în View-uri cu Controllere ierarhizate.
  ```html
  <!-- evită -->
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

### Sintaxa de controller 'controllerAs'
###### [Style [Y031](#style-y031)]

  - Folosește sintaxa `controllerAs` în locul `sintaxei clasice de controller cu $scope`.

  - Sintaxa `controllerAs` folosește `this` înăuntrul controllerelor, iar acesta se leagă de `$scope`.

  *De ce?*: `controllerAs` e syntactic sugar pentru `$scope`. Poți face binduri în continuare la View și să și folosești metodele de pe `$scope`.

  *De ce?*: Ajută la evitarea temptației de a folosi metode ale `$scope` înăuntrul unui controller atunci când, de fapt, ar fi mai bine să le evităm sau să mutăm metoda într-un factory și să facem referință la ea din controller. Încearcă să folosești `$scope` într-un controller doar când e nevoie. De exemplu, atunci când publici sau abonezi evenimente folosind [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), sau [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on).

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

  *De ce?*: Keyword-ul `this` este contextual iar atunci când e folosit înăuntrul unei funcții dintr-un controller și-ar putea schimba contextul. Capturarea contextului lui `this` evită întâlnirea acestei probleme.

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

  Notă: Poți evita avertizările [jshint](http://jshint.com/) prin lăsarea unui comentariu deasupra liniei de cod. Totuși, acest lucru nu e necesar atunci când funcția e denumită folosind UpperCasing, deoarece această convenție înseamnă că este o funcție-constructor, ceea ce și este un controller în Angular. 

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Notă: Când creezi un watch într-un controller folosind `controller as`, poti urmări membrul `vm.*` folosind următoarea sintaxă. (creează watch-uri cu atenție, acestea adaugă timp de execuție ciclului de digest)

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
  <!-- evită -->
  <input ng-model="customerProductItemVm.title">
  ```

  ```html
  <!-- recomandat -->
  <input ng-model="productVm.title">
  ```

### Membrii Bindabili Sus
###### [Style [Y033](#style-y033)]

  - Plasează membrii bindabili în partea de sus a controllerului, în ordine alfabetică, și nu împrăștiați prin codul controllerului.

    *De ce?*: Plasarea membriilor bindabili sus îmbunătățește lizibilitatea și te ajută să identifici instant care membri ai controllerului pot fi bindabili și folosiți în View.

    *De ce?*: Setarea funcțiilor anonime in-line poate fi ușoară, dar atunci când funcțiile respective sunt constituite din mai mult de o linie de cod ele pot reduce lizibilitatea. Definirea de funcții sub membrii bindabili (funcțiile vor fi hoistate) mută detaliile implementării jos, păstrează membrii bindabili sus, și face totul mai ușor de citit. 

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

  Notă: Dacă funcția este constituită dintr-o linie de cod ia în considerare păstrarea ei sus, atâta vreme cât lizibilitatea nu este afectată.

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

  - Folosește declarări de funcții pentru a ascunde detaliile implementării. Păstrează-ți membrii bindabili sus. Când ai nevoie de o funcție într-un controller, pointeaz-o la o declarație de funcție ce apare mai târziu în fișier. Acest lucru e direct legat de secțiunea "Membrii Bindabili Sus". Pentru mai multe detalii vezi [acest articol](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code/).

    *De ce?*: Punerea membriilor bindabili sus face mai ușoară citirea și ajută să identifici instant ce membri ai controllerului pot fi folosiți în View. (La fel ca mai sus.)

    *De ce?*: Mutarea detaliilor de implementare a unei funcții mai târziu în cod mută toată complexitatea în afara câmpului vizibil, astfel că poți vedea toate lucrurile importante sus.

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

  Observă că lucrurile importante sunt împrăștiate în exemplul de mai sus. În exemplul de mai jos, observă că lucrurile importante sunt sus. De exemplu, membri legați de controller precum `vm.avengers` și `vm.title`. Detaliile de implementare sun jos. Asta e pur și simplu mai ușor de citit.

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

### Mută Logica din Controllere în Servicii
###### [Style [Y035](#style-y035)]

  - Scapă de logica dintr-un controller dând-o la servicii și factory-uri.

    *De ce?*: Logica ar putea fi refolosită de mai multe controllere dacă e pusă într-un serviciu și expusă printr-o funcție

    *De ce?*: Logica într-un serviciu poate fi izolată mult mai ușor într-un unit test, iar logica de apelare dintr-un controller poate fi generată mai ușor.

    *De ce?*: Înlătură dependințele și ascunde detaliile implementării din controller.

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

  - Definește un controller pentru un view, și încearcă să nu reutilizezi controllerul pentru alte view-uri. În schimb, mută logica reutilizabilă în factory-uri și păstrează controllerul simplu și focusat pe view-ul său.

    *De ce?*: Reutilizarea controllerelor cu mai multe view-uri este fragilă și necesită teste end-to-end (e2e) cu acoperire foarte bună pentru a asigura stabilitatea în aplicații mari.

### Asignarea de Controllere
###### [Style [Y038](#style-y038)]

  - Când un controller trebuie legat cu un view și unul dintre cele două componente trebuie refolosite de alte Controllere sau view-uri, definește Controllere și rutele lor.

    Notă: Dacă un View este încărcat printr-un alt procedeu decât prin rutare, foloselște syntaxa `ng-controller="Avengers as vm"`.

    *De ce?*: Combinarea unui controller în rută permite mai multor rute să invoce diferite perechi de Controllere și view-uri. Când controllerele sunt asignat în view folosind  [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), acel view este întotdeauna asociat cu același controller.

 ```javascript
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

### Siingletonuri
###### [Style [Y051](#style-y051)]

  - Factory-urile sunt singletonuri și returnează un obiect ce conține membrii unui serviciu.

    Notă: [Toate serviciile angular sunt singletonuri](https://docs.angularjs.org/guide/services).

### Membrii accesibili sus
###### [Style [Y052](#style-y052)]

  - Expune membrii apelabili ai unui serviciu (interfața sa) sus, folosind o tehnică derivată din șablonul [Revealing Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *De ce?*: Plasând membri apelabili sus face mai ușoară citirea și te ajută să identifici instant care membri ai serviciului pot fi apelați și trebuie să fie testați (și/sau generați) 

    *De ce?*: Acest lucru este util în special când fișierul devine mai mare și evită nevoia de a face scroll pentru a vedea ce e expus.

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

  - Folosește declarații de funcții pentru ascunderea detaliilor de implementare. Păstrează membrii accesibili ai factory-ului sus. Pointează-i spre declarații de funcții care apar mai târziu în fișier. Pentru mai multe detalii vezi [acest articol](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *De ce?*: Plasarea membriilor accesibili sus face mai totul mai lizibil și te-ajută să identifici instant ce funcții ale factory-ului se pot accesa în exterior.

    *De ce?*: Plasarea detaliilor implementării unei funcții mai târziu în fișier mută toată complexitatea respectivă în afara câmpului vizual așa că poți vedea lucrurile importante sus.

    *De ce?*: Declarațiile funcțiilor sunt hoistate deci nu există griji în legătură cu utilizarea unei funcții înaintea definirii ei (așa cum ar fi cazul cu expresiile de funcții).

    *De ce?*: În legătură cu declarațiile de funcții, nu trebuie să-ți faci griji niciodată cum că mutând `var a` înainte de `var b` îți va strica codul fiindcă `a` depinde de `b`.

    *De ce?*: Ordinea e critică cu expresiile de funcții.

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

  - Mută codul care face operații de date și interacționează cu date într-un factory. Fă serviciile de date responsabile de apeluri XHR, stocare locală, stashing în memorie, sau orice alte operații de date. 

    *De ce?*: Responsabilitatea controllerului este de a prezenta și aduna informații pentru view. Lui nu ar trebui să-i pese cum ia datele, ci doar să știe de la cine să le ceară. Separarea serviciilor de date mută logica luării datelor într-un serviciu de date, și lasă controllerul să fie mai simplu și mai focusat pe view.

    *De ce?*: Face mai ușoară testarea și generarea de date false pentru când se testează un controller ce folosește un serviciu de date.

    *De ce?*: Implementarea unui serviciu de date ar putea avea cod foarte specific depozitului de date. Asta ar putea include antete, metode de comunicare cu datele, sau alte servicii precum `$http`. Separarea logicii într-un serviciu de date encapsulează această logică într-un singur loc, ascunzând implementarea de utilizatorii externi (poate un controller), și face și mai ușoară o eventuală schimbare a implementării.

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
              logger.error('XHR eșuat pentru getAvengers.' + error.data);
          }
      }
  }
  ```

    Notă: Serviciul de date e apelat de consumatori, precum un controller, ascunzând implementarea pentru aceștia, precum e arătat mai jos.

  ```javascript
  /* recomandat */

  // controller care apelează factory-ul serviciului de date
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

  - Când apelezi un serviciu de date ce returnează un promise, precum `$http`, returnează de asemenea un promise în funcția ta.

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
         * Cere datele servicului de date
         * și așteaptă promise-ul
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Step 3
                 * setează datele și rezolvă promise-ul
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

  - Creează o directivă per fișier. Numește fișierul precum directiva.

    *De ce?*: E ușor să arunci toate directivele într-un singur fișier, dar greu să le spargi pe urmă astfel încât unele din ele sunt folosite de mai multe aplicații, unele doar de mai multe module, și altele doar pentru un singur modul.

    *De ce?*: O directivă per fișier face lucrurile mai ușor de gestionat.

    > Notă: "**Best Practice**: Directivele ar trebui să curețe după ele. Poți folosi `element.on('$destroy', ...)` sau `$scope.$on('$destroy', ...)` ca să rulezi o funcție de clean-up când directiva e înlăturată" ... din documentația Angular.

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

    Notă: Sunt multe opțiuni de denumire pentru directive, în special datoriă faptului că pot fi folosite în scopuri mai înguste sau mai largi. Alege un nume ce face directiva și numele fișierului său distinct și clar. Niște example sunt mai jos, dar vezi secțiunea de [Denumire](#naming) pentru mai multe recomandări.

### Manipulează DOM-ul într-o Directivă
###### [Style [Y072](#style-y072)]

  - Când manipulezi DOM-ul direct, folosește o directivă. Dacă metode alternative pot fi folosite, precum folosirea de CSS pentru a seta stilurile sau [serviciile de animație](https://docs.angularjs.org/api/ngAnimate), șablonarea Angular, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) sau [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), atunci folosește-le pe acelea în schimb. De exemplu, dacă directiva doar arată / ascunde, folosește ngHide/ngShow.

    *De ce?*: Manipulările de DOM pot fi greu de testat, reparat, și de multe ori există soluții mai bune (e.g. CSS, animații, șablonare).

### Oferă un prefix unic Directivei
###### [Style [Y073](#style-y073)]

  - Oferă un prefix scurt, unic și descriptiv directivei precum `acmeSalesCustomerInfo` care, în HTML, ar fi declarat ca `acme-sales-customer-info`.

    *De ce?*: Prefixul scurt și unic identifică contextul și originea directivei. De exemplu, un prefix ca `cc-` ar putea indica că directiva face parte dintr-o aplicație CodeCamper, iar `acme-` ar putea indica o directivă pentru compania Acme.

    Notă: Evită `ng-`, deoarece acestea sunt rezervate pentru directivele Angular. Află mai multe despre directivele populare pentru a evita conflictele de nume, precum `ion-` pentru [Framework-ul Ionic](http://ionicframework.com/).

### Rămâi la Elemente și Atribute
###### [Style [Y074](#style-y074)]

  - Când creezi o directivă care are sens pe cont propriu, permite `E` (element custom) și opțional interzice `A` (atribut custom). În general, dacă poate fi un control de sine stătător, `E` e adecvat. Ghidul geeneral e să permiți `EA` dar tinde spre implementarea ca un element atunci când e folosibil pe cont-propriu și ca atribut când extinde elementul său existent.

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

  - Folosește sintaxa `controller as` cu o directivă pentru a fi consecvent cu folosirea `controller as` cu perechile de view și controller.

    *De ce?*: Are sens și nu e greu.

    Notă: Directiva de mai jos demonstrează unele din modalitățile pe care poți folosi într-un controller de link / directivă, folosind controllerAs. Am pus șablonul in-line doar ca să am totul în același loc.

    Notă: Cât despre injectarea de dependințe, vezi [Identificarea Manuală a Dependințelor](#manual-annotating-for-dependency-injection).

    Notă: Observă că controllerul directivei este în afara closure-ului directivei. Acest stil elimină problemele unde injectarea se creează ca și cod la care nu se poate ajunge după un `return`.

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
          // Notă: Acesta ar fi 'ExampleController' (numele controllerului exportat, ca string)
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
      // Injectarea de $scope doar pentru comparație
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

    Notă: Poți, de asemenea denumi controller-ul când îl injectezi în funcția de legare și accesezi atributele directivelor ca proprietăți alte controlerului.

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

  - Folosește `bindToController = true` cănd ai sintaxa `controller as` cu o directivă dacă dorești să legi scopul extern de scopul controllerului directivei.

    *De ce?*: Face ușoară legarea scopului extern de scopul controllerului directivei.

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
### Promise-uri Activante de Controllere
###### [Style [Y080](#style-y080)]

  - Pune logica de inițiere într-o funcție `activate`.

    *De ce?*: Punerea logicii de început într-un loc consecvent în controller o face mai ușor de localizat, e mai consecvent la testare, li ajută la evitarea răspândirii logicii inițiale de-alungul controllerului. 

    *De ce?*: Funcția `activate` face mai convenabilă reutilizarea logicii a unui refresh al Controllerului/View-ului, păstrează logica împreună, îndreaptă utilizatorul la View mai repede, face animațiile mai ușoare pe `ng-view` sau `ui-view`, și se simte mai fluent pentru utilizator.

    Notă: Dacă ai nevoie să anulezi condițional ruta înainte de-a folosi controllerul, folosește un [route resolver](#style-y081) în schimb.

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

### Promise-uri Rezolvatoare de Rute
###### [Style [Y081](#style-y081)]

  - Când un controller depinde de un promise să fie rezolvat înainte ca el să fie activat, rezolvă acele dependințe în `$routeProvider` înainte ca logica controllerului să fie executată. Dacă ai nevoie să anulezi o rută înainte ca un controller să fie activat, folosește un resolver de rută. 

  - Folosește un resolver de rută când vrei să decizi anularea rutei înainte de-a tranziționa în View.

    *De ce?*: Un controller ar putea necesita date înainte de a se încărca. Acele date pot veni de la un promise printr-un factory custom sau [$http](https://docs.angularjs.org/api/ng/service/$http). Folosirea unui [resolver de rută](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) permite promise-ului să fie rezolvat înainte ca logica controllerului să fie executată, așa că ar putea acționa bazându-se pe data de la promise.

    *De ce?*: Codul se execută după rută și în funcția de 'activate' din controller. View-ul începe să se încarce direct. Legarea datelor apare când promise-ul de activare se rezolvă. O animație de "busy" poate fi arătată pe durata tranziției view-ului (prin `ng-view` sau `ui-view`)

    Notă: Codul se execută înaintea rutei printr-un promise. Respingerea promise-ului anulează ruta. Rezolvarea face ca noul view să aștepte ca ruta să fie rezolvată. O animație de "busy" poate fi arătată înainte de rezolvare și de-alungul tranziției view-ului. Dacă ai nevoie de View mai repede și nu necesiți un checkpoint ca să decizi dacă poți ajunge la View, consideră folosirea tehnicii [controller `activate`](#style-y080) în schimb.

  ```javascript
  /* evită */
  angular
      .module('app')
      .controller('AvengersController', AvengersController);

  function AvengersController(movieService) {
      var vm = this;
      // nerezolvat
      vm.movies;
      // rezolvat asincron
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

    Notă: Exemplul de mai jos arată punctele de rezolvare a rutei spre o funcție denumită, ceea ce face codul mai ușor de reparat și mai ușoară de gestionat injectarea de dependințe.

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
    Notă: Dependința codului la `movieService` nu este sigură pentru minificare. Pentru detalii despre cum să faci acest cod sigur pentru minificare, vezi secțiunile despre [injectarea de dependințe](#manual-annotating-for-dependency-injection) și despre [minificare și adnotare](#minification-and-annotation).

**[Înapoi sus](#table-of-contents)**

### Tratarea Excepțiilor cu Promise-uri
###### [Style [Y082](#style-y082)]

  - Blocul de `catch` al unui promise trebuie să returneze un promise respins pentru a păstra excepția în lanțul promise-ului.

  - Tratează întotdeauna excepțiile în servicii/factory-uri.

    *De ce?*: Dacă blocul de `catch` nu returnează un promise respins, apelatorul promise-ului nu va știi că s-a întâmplat o excepție. Metoda de `then` se va executa. Deci, utilizatorul ar putea să nu știe niciodată ce s-a întâmplat. 

    *De ce?*: Pentru a evita înghițirea erorilor și informarea greșită a utilizatorului.

    Notă: Ia în considerare punerea tratărilor de excepții într-o funcție dintr-un modul general sau serviciu.

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
          var newMessage = 'XHR eșuat pentur getCustomer'
          if (e.data && e.data.description) {
            newMessage = newMessage + '\n' + e.data.description;
          }
          e.data.description = newMessage;
          logger.error(newMessage);
          // ***
          // Observă că aici nu este nicio returnare a promise-ului respins
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
          var newMessage = 'XHR eșuat pentru getCustomer'
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

## Adnotare Manuală pentru Injectarea de Dependințe

### NeSigur Pentru Minificare
###### [Style [Y090](#style-y090)]

  -Evită folosirea the sintaxei-scurtătură de declarare de dependințe fără folosirea unei metode sigură pentru minificare.

    *De ce?*: Parametrii componentei (e.g. controller, factory, etc) vor fi convertiți în variabile deformate. De exemplu, `common` și `dataservice` ar putea deveni `a` sau `b` și să nu fie găsiți de Angular.

    ```javascript
    /* evită - nesigur pentru minificare */
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    function DashboardController(common, dataservice) {
    }
    ```

    Acest cod ar putea produce variabile deformate și cauza erori în momentul execuției.

    ```javascript
    /* evită - nesigur pentru minificare*/
    angular.module('app').controller('DashboardController', d);function d(a, b) { }
    ```

### Identificarea Manuală a Dependințelor 
###### [Style [Y091](#style-y091)]

  - Folosește `$inject` pentru a identifica manual dependințele pentru componentele Angular.

    *De ce?*: Această tehnică oglindește tehnica folosită de [`ng-annotate`](https://github.com/olov/ng-annotate), pe care o recomand pentru automatizarea creerii de dependințe sigure pentru minificare. Dacă `ng-annotate` detectează că injectarea s-a făcut deja, el nu o va duplica.

    *De ce?*: Acest lucru îți protejează dependințele de la a fi vulnerabile la problemele minificării ce apar când parametrii sunt deformați. De exemply, `common` și `dataservice` pot deveni `a` sau `b` și să nu fie găsite de Angular.

    *De ce?*: Evită creerea de dependințe in-line dacă lista e greu de citit. De asemeanea, poate creea confuzie faptul că array-ul e o serie de string-uri, în timp ce ultimul element este funcția componentei.

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

    Notă: Când funcția ta e sub un statement de return, `$inject` ar putea fi inaccesibil (posibil să se întâmple într-o directivă). Poți rezolva acest lucru prin mutarea Controller-ului în afara directivei.

    ```javascript
    /* evită */
    // înăuntrul definiției unei directive
    function outer() {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;

        DashboardPanelController.$inject = ['logger']; // Inaccesibil
        function DashboardPanelController(logger) {
        }
    }
    ```

    ```javascript
    /* recomandat */
    // înafara definiției unei directive
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

### Identificarea Manuală a Dependințelor Resolverului de Rută
###### [Style [Y092](#style-y092)]

  - Folosește `$inject` pentru identificarea dependințelor resolverului de rută pentru componentele Angular.

    *De ce?*: Această tehnică scapă din funcția anonimă a resolverului de rută, făcând lucrurile mai lizibile.

    *De ce?*: Un statement de `$inject` poate preceda cu ușurință resolver-ul pentru a trata creerea dependințelor sigure pentru minificare.

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

## Minificare și Adnotare

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Folosește [ng-annotate](//github.com/olov/ng-annotate) pentru [Gulp](http://gulpjs.com) sau [Grunt](http://gruntjs.com) și comentează funcțiile ce au nevoie de injectare automată de dependințe folosind `/* @ngInject */`

    *De ce?*: Acest lucru îți asigură codul împotriva dependințelor ce ar putea să nu folosească metode sigure pentru minificare.
    *De ce?*: [`ng-min`](https://github.com/btford/ngmin) e depreciat.

    >Prefer Gulp fiindcă mi se pare mai ușor de scris, citit, și pentru debug.

    Codul următor nu folosește dependințe sigure pentru minificare.

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

    Când codul de mai sus e rulat prin ng-annotate el va produce următorul output cu adnotarea `$inject` și va deveni sigur pentru minificare.

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

    Notă: Dacă `ng-annotate` detectează că injectarea s-a făcut deja (e.g. `@ngInject` a fost detectat), el nu va duplica codul de `$inject`.

    Notă: Când folosești un resolver de rută poți prefixa funcția resolverului cu  `/* @ngInject */` și el va produce cod adnotat corect, păstrând dependințele injectate sigure pentru minificare.

    ```javascript
    // Folosind adnotări @ngInject
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

    > Notă: Începând cu Angular 1.3 poți folosi parametrul `ngStrictDi` din [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) pentru a detecta dependințele nesigure pentru minificare. Atunci când injectorul este prezent el va fi creat în modul "strict-di" mode, cauzând aplicația să eșueze invocarea funcțiilor care nu folosesc adnotare implicită (acestea ar putea să nu fie sigure pentru minificare). Informațile de debug vor fi înregistrate în consolă pentru a ajuta găsirea codului stricat. Prefer să folosesc `ng-strict-di` doar în scopuri de debug.
    `<body ng-app="APP" ng-strict-di>`

### Folosește Gulp sau Grunt pentru ng-annotate
###### [Style [Y101](#style-y101)]

  - Folosește [gulp-ng-annotate](https://www.npmjs.com/package/gulp-ng-annotate) sau [grunt-ng-annotate](https://www.npmjs.com/package/grunt-ng-annotate) într-un task de build automatizat. Injectează `/* @ngInject */` înaintea oricărei funcții ce nu are dependințe.

    *De ce?*: ng-annotate va prinde majoritatea dependințelor, dar câteodată necesită sugestii folosind sintaxa `/* @ngInject */`.

    Următorul cod este un exemplu de task gulp care folosește ngAnnotate

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;

        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Adnotează înaintea uglificării pentru ca codul să fie minificat corect
            .pipe(ngAnnotate({
                // true ajută la adăuărui acolo unde @ngInject nu este folosit. Folosește deduceri.
                // Nu funcționează cu resolve, deci trebuie să fim expliciți aici
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

## Tratarea Excepțiilor

### Decoratori
###### [Style [Y110](#style-y110)]


  - Folosește un [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator) când faci configurarea folosind serviciul [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), pe serviciul [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) pentru a executa operații custom când apar excepții.

    *De ce?*: Furnizează o modalitate consecventă pentru tratarea excepțiilor neprinse din Angular, pentru perioada de development sau cea de execuție.

    Notă: O altă opțiune este să faci override la serviciu în locul folosirii unui decorator. Aceasta ar fi o soluție bună, dar dacă vrei să foloseși comportamentul implicit și să-l extinzi, un decorator e recomandat.

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
             * Ai putea adăuga eroarea la colecția unui serviciu,
             * adăuga eroarea la $rootScope, înregistra eroarea pe un server remote,
             * sau înregistra local. Sau să faci throw simpl. Depinde doar de tine.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Prinzători de Excepții
###### [Style [Y111](#style-y111)]

  - Creează un factory ce expune o interfață de prindere și tratează grațios excepțiile.

    *De ce?*: Furnizează o metodă consecventă de prindere a excepțiilor ce ar putea fi aruncate în codul tău (e.g. îmn timpul apelurilor XHR sau eșecurilor de promise-uri).

    Notă: Prinzătorul de excepții e bun pentru prinderea și reacționarea la excepții specifice din apeluri care știi că ar putea arunca una. De exemplu, când faci un apel XHR pentru luarea de date de la un serviciu web remote și vrei să prinzi excepțiile de la acel serviciu și să reacționezi unitar la ele. 

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

### Erori de Rută
###### [Style [Y112](#style-y112)]

  - Tratează și înregistrează toate erorile folosind [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *De ce?*: Furnizează un mod consecvent de prindere a tuturor erorilor de rutare.

    *De ce?*: Are potențialul de a furniza o experiență mai bună pentru utilizator dacă atunci când se întâmplă erori de rutare îl redirecționezi spre un ecran prietenos cu mai multe detalii sau opțiuni de redresare. 

    ```javascript
    /* recomandat */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Anularea rutei:
         * La o eroare de rutare, du-te la dashboard.
         * Oferă o clauză de ieșire dacă încearcă să o facă de două ori.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                if (handlingRouteChangeError) { return; }
                handlingRouteChangeError = true;
                var destination = (current && (current.title ||
                    current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Eroare la rutarea spre ' + destination + '. ' +
                    (rejection.msg || '');

                /**
                 * Opțional, înregistrează folosind un serviciu custom sau $log.
                 * (Nu uita să injectezi serviciul custom)
                 */
                logger.warning(msg, [current]);

                /**
                 * La erori de rută, du-te la o altă rută/stare.
                 */
                $location.path('/');

            }
        );
    }
    ```

**[Înapoi sus](#table-of-contents)**

## Denumire

### Instrucțiuni de Denumire
###### [Style [Y120](#style-y120)]

  - Folosește nume consecvente pentru toate componentele folosind un șablon ce descrie trăsătura componentei și apoi (opțional) tipul său. `trăsăturî.tip.js`. Există 2 nume pentru mai toate elementele:
    * numele fișierului (`avengers.controller.js`)
    * numele componentei înregistrate cu Angular (`AvengersController`)

    *De ce?*: Convențiile de nume ajută la furnizarea unei metode mai consecvente de găsire a conținutului dintr-un foc. Consecvența într-un proiect e vitală. Consecvența cu echipa e importantă. Consecvența într-o companie furnizează eficiență imensă.

    *De ce?*: Convențiile de nume ar trebui pur și simplu să te ajute să-ți găsești codul mai repede și să-l facă mai ușor de înțeles.

### Nume de Fișere pe Baza Trăsăturilor
###### [Style [Y121](#style-y121)]

  - Folosește nume consecvente pentru toate componentele, urmând un șablon ce descrie trăsătura componentei și apoi (opțional) tipul său. Șablonul meu recomandat este `trăsătură.tip.js`.

    *De ce?*: Furnizează o metodă consecventă de a identifica rapid compoenentele.

    *De ce?*: Conferă potrivire de șabloane pentru orice taskuri automate.

    ```javascript
    /**
     * opțiuni comune
     */

    // Controllere
    avengers.js
    avengers.controller.js
    avengersController.js

    // Service-uri/Factory-uri
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

    // servicii/factory-uri
    logger.service.js
    logger.service.spec.js

    // constante
    constants.js

    // definirea modulelor
    avengers.module.js

    // rute
    avengers.routes.js
    avengers.routes.spec.js

    // configurare
    avengers.config.js

    // directive
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

  Notă: O altă convenție comună este numirea fișierelor de controller fără folosirea cuvântului `controller` în numele fișierului, precum `avengers.js` în loc de `avengers.controller.js`. Toate celelalte convenții rămân încă valide și ar trebui să folosească un sufix pentru tip. Preferința mea e ca `avengers.controller.js` să identifice `AvengersController`.

    ```javascript
    /**
     * recomandat
     */
    // Controllere
    avengers.js
    avengers.spec.js
    ```

### Numele Fișierelor de Test
###### [Style [Y122](#style-y122)]

  - Denumește specificațiile de test similar cu componentele pe care le testează și un sufix ca `spec`.

    *De ce?*: Conferă o metodă consecventă de identificare a componentelor.

    *De ce?*: Furnizează potrivire de șabloane pentru [karma](http://karma-runner.github.io/) sau alte utilități de teste.

    ```javascript
    /**
     * recomandat
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Numele Controllerelor
###### [Style [Y123](#style-y123)]

  - Folosește nume consecvente pentru toate controllere, numindu-le după trăsăturile lor. Folosește UpperCamelCase pentru controllere, de vreme ce aceștia sunt constructori.

    *De ce?*: Oferă o metodă consecventă de a identifica și referenția Controllere.

    *De ce?*: UpperCamelCase e convenția pentru identificarea unui obiect ce poate fi instanțiat folosind un constructor.

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

### Sufixul Numelui Controllerui
###### [Style [Y124](#style-y124)]

  - Adaugă numelui controllerui sufixul `Controller`.

    *De ce?*: Sufixul `Controller` e folosit mai des și e mai descriptiv.

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

### Numele de Factory-uri și Servicii
###### [Style [Y125](#style-y125)]

  - Folosește nume consecvente pentru toate factory-urile și serviciile numite după trăsăturile lor. Folosește camel-casing pentru servicii și factory-uri. Evită prefixarea factory-urilor și serviciilor cu `$`. Sufixează serviciile și factory-urile doar cu `Service` atunci când nu e clar ce sunt (i.e. când sunt substantive).

    *De ce?*: Furnizează o metodă rapidă de găsire și referențiere a factory-urilor.

    *De ce?*: Evită conflictele de nume cu factory-urile built-in și cu serviciile ce folosesc prefixul `$`.

    *De ce?*: Numele clare de servicii precum `logger` nu au nevoie de un sufix.

    *De ce?*: Numele de servicii precum `avengers` sunt substantive și au nevoie de un sufix, deci ar trebui numite `avengersService`.

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

### Numele Componentelor Directivelor
###### [Style [Y126](#style-y126)]

  - Folosește nume consecvente pentru toate directivele folosind camel-case. Folosește un prefix scurt pentru a descrie zona din care fac parte directivele respective (niște exemple ar fi prefixul companiei sau prefixul proiectului).

    *De ce?*: Furnizează un mod consecvent de a identifica și referenția rapid componentele.

    ```javascript
    /**
     * recomandat
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // se folosește ca <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Module
###### [Style [Y127](#style-y127)]

  - Atunci când sunt mai multe module, fișierul modululului principal se numește `app.module.js` iar celelalte module dependente sunt numite după ceea ce reprezintă. De exemplu, un modul de admin se va numi `admin.module.js`. Numele modulelor înregistrate aferente ar fi `app` și `admin`.

    *De ce?*: Conferă consecvență pentru mai aplicații cu mai multe module, și pentru scalarea înspre aplicații mari.

    *De ce?*: Furnizează o metodă ușoară de automatizare a taskurilor pentru a încărca definițiile modulelor prima dată, iar apoi toate celelalte fișiere Angular (pentru împachetare).

### Configurare
###### [Style [Y128](#style-y128)]

  - Separă configurația unui modul în fișierul său separat numit după modul. Un fișier de configurare pentru modulul principal `app` se va numi `app.config.js` (sau simplu doar `config.js`). Un fișier de configurare pentru un modul de admin `admin.module.js` se va numi `admin.config.js`.

    *De ce?*: Separă configurarea de definirea modulelor, a componentelor și de codul activ.

    *De ce?*: Furnizează un loc identificabil unde să setezi configurarea unui modul.

### Rutele
###### [Style [Y129](#style-y129)]

  - Separă cofigurarea rutelor în fișiere lor separate. De exemplu `app.route.js` pentru modulul principal, `admin.route.js` pentru modulul de `admin`. Chiar și în aplicații mai mici prefer separarea de restul configurării.

**[Înapoi sus](#table-of-contents)**

## Structura Aplicației - Principul LIFT
### LIFT
###### [Style [Y140](#style-y140)]

  - Structurează-ți aplicația în așa fel încât să-ți poți `L`ocaliza codul rapid, `I`dentifica codul rapid, păstrează cea mai plată (`F`lattest) structură posibilă, și încearcă (`T`ry) să rămâi DRY. Structura ar trebui să urmeze aceste 4 orientări de bază:

    *De ce LIFT?*: Furnizează un mod consecvent de a scala cum trebuie, e modular, și face ca eficiența unui programator să crească prin găsirea codului rapid. O altă metodă de a-ți verifica structura aplicației este: Cât de repede pot să deschid și să lucrez în toate fișierele legate de o funcționalitate?

    Când consider că structura mea nu e confortabilă, mă întorc și revizitez aceste orientări LIFT

    1. `L`ocalizarea codului tău e ușor
    2. `I`dentificarea codului se face rapid
    3.  Structură plată (`F`lat) pe cât posibil
    4.  Încearcă (`T`ry) să rămâi DRY (Nu te repeta - Don’t Repeat Yourself) sau T-DRY

### Localizează
###### [Style [Y141](#style-y141)]

  - Fă localizarea codului tău intuitivă, simplă, și rapidă.

    *De ce?*: Observ că acest lucru e super important pentru un proiect. Dacă membri echipei nu pot găsi rapid fișierele de care au nevoie, nu vor putea lucra cât de eficient se poate, iar structura va trebui să sufere modificări. Posibil să nu știi numele fișierului sau care îi sunt fișierele relatate, așa că punerea lor în cele mai intuitive locații și una lângă alta salvează mult timp. O structură de directoare descriptivă poate de asemenea să ajute în această chestiune.  

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

### Identifică
###### [Style [Y142](#style-y142)]

  - Când vezi un fișier ar trebui să știi instant ce conține și ce reprezintă.

    *De ce?*: Petreci mai puțin timp vânând și căutând cod, și devii mai eficient. Dacă acest lucru înseamnă să folosești nume de fișier mai mari, fă-o. Fii descriptiv cu numele fișierelor și păstrează conținutul fișierului la exact 1 per component. Evită fișierele cu mai multe controllere, mai multe servicii, sau o amestecătură. Există devieri de la regula de 1 per fișier atunci când am un set de funcționalități foarte mici care sunt toate legate una de cealaltă, ele fiind în continuare ușor identificabile.

### Plat
###### [Style [Y143](#style-y143)]

  - Păstrează o structură plată a directoarelor pe cât posibil. Când ajungi la mai mult de 7 fișiere, începe să iei în considerare separarea.

    *De ce?*: Nimeni nu vrea să caute în 7 nivele de foldere ca să găsească un fișier. Gândește-te la meniurile de pe web site-uri.. orice mai adânc de 2 nivele ar trebui să fie revizuit serios. Într-o structură de foldere nu este o regulă rapidă și strictă, dar când un folder are 7-10 fișiere, cam acela ar fi momentul în care să fie create subfoldere. Bazează-te pe nivelul tău de confort. Folosește o structură mai plată până când există o valoare clară (ca să ajute la restul de LIFT) în creerea de foldere noi.

### T-DRY (Încearcă să Rămâi DRY)
###### [Style [Y144](#style-y144)]

  - Fii DRY, dar nu o du la extrem și sacrifica lizibilitatea.

    *De ce?*: Să fii DRY e important, dar nu crucial dacă sacrifici alți membri ai LIFT, motiv pentru care îl și numesc T-DRY. Nu vreau să scriu session-view.html pentru un view pentru că, ei bine, e bineînțeles un view. Dacă nu e clar sau din convenție, atunci îl numesc. 

**[Înapoi sus](#table-of-contents)**

## Structura Aplicației

### Ghiduri Generale
###### [Style [Y150](#style-y150)]

  - Să ai o viziune rapidă de implementare și o viziune largă, de lungă durată. Cu alte cuvinte, începe mic dar ține minte încotro se îndreaptă aplicația. Tot codul aplicației merge într-un folder-rădăcină numit `app`. Tot conținutul e o funcționalitate per fișier. Fiecare controller, serviciu, modul, view e în fișierul său separat. Toate scripturile 3rd party sunt stocate în alt folder și nu în folder-ul `app`. Nu le-am scris eu și nu vreau ca ele să-mi aglomereze aplicația (`bower_components`, `scripts`, `lib`).

    Notă: Găsește mai multe detalii și raționarea din spatele structuri în [acest articol original despre structura aplicației](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Plan General
###### [Style [Y151](#style-y151)]

  - Pune componentele ce definesc layout-ul general al aplicației într-un folder numit `layout`. Acestea pot include de asemenea un view și un controller și pot fi de asemenea recipiente pentru aplicație, navigare, meniuri, zone de conținut, și alte regiuni.

    *De ce?*: Organizează tot layout-ul într-un singur loc refolosit în toată aplicația.

### Structură Folders-per-Caracteristică
###### [Style [Y152](#style-y152)]

  - Creează foldere numite după funcționalitatea pe care o reprezintă. Când un folder începe să conțină mai mult de 7 fișiere, ia în considerare creearea unui folder pentru ele. Limita ta ar putea să difere, așa că ajustarea e necesară.

    *De ce?*: Un programator poate localiza codul, identifica ce reprezintă fiecare fișier dintr-un foc, structura e cât se poate de plată, și nu există nume repetitive sau redundante.

    *De ce?*: Ghidurile LIFT sunt toate acoperite.

    *De ce?*: Ajută la prevenirea aplicației din a deveni prea aglomerată prin organizarea conținutului și păstrarea lui aliniat cu principiile LIFT.

    *De ce?*: Când există multe fișiere (10+), localizarea lor e mai ușoară cu o structură de foldere consecventă și mai grea în structuri plate.

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

      ![Model de Structură a Aplicației](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-2.png)

      Notă: Nu-ți structura aplicația folosind folder-per-tip. Acest lucru necesită mutarea în foldere multiple când lucrezi la o funcționalitate și devine groaie rapid, pe măsură ce aplicație crește la 5, 10 sau 25+ de view-uri și controllere (și alte funcționalități), ceea ce face totul mau greu decât folder-per-caracteristică la localizarea fișierelor. 

    ```javascript
    /*
    * evită
    * Alternativă: foldere-per-tip.
    * Recomand "folder-per-funcționalitate" în schimb.
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

## Modularitate

### Multe Module Mici, Autonome
###### [Style [Y160](#style-y160)]

  - Creează module mici ce encapsulează o singură responsabilitate.

    *De ce?*: Aplicațiile modulare fac ușoară folosirea și permit echipelor de dezvoltare să construiască felii verticale ale aplicației și să le livreze incremental. Acest lucru înseamnă că putem adăuga funcționalități noi în timp ce le dezvoltăm.

### Creează un Modul App
###### [Style [Y161](#style-y161)]

  - Creează un modul de bază al aplicației al cărui rol să fie agregarea tuturor modulelor și a funcționalităților aplicației tale. Denumește-l bazându-te pe aplicația ta.

    *De ce?*: Angular încurajează modularitatea și șabloanele de separare. Creerea unui modul de bază al cărui rol este să lege celelalte module conferă un mod foarte direct de a adăuga și înlătura module din aplicație.

### Păstrează Modulul Subțire
###### [Style [Y162](#style-y162)]

  - Pune doar logica de agregare în modulul de bază. Lasă funcționalitățile în modulele proprii.

    *De ce?*: Adăugarea de roluri adiționale la rădăcina aplicației pentru luare de date remote, afișare de view-uri, sau altă logică ce nu ține de agregarea aplicației murdărește modulul aplicației și face ambele mulțimi de funcționalități mai greu de reutilizat sau dezactivat. 

    *De ce?*: Modulul app devine un manifest ce descrie ce module contribuie la definirea aplicației.

### Zonele de Funcționalități sunt Module
###### [Style [Y163](#style-y163)]

  - Creează module ce reprezintă zone de funcționalități, precum layout, servicii partajate și refolosibile, dashboard-uri, și funcționalități specifice aplicației (e.g. customers, admin, sales).

    *De ce?*: Module autonome pot fi adăugate la aplicație cu conflict redus sau inexistent.

    *De ce?*: Sprinturile sau iterațiile se pot axa pe zone de funcționalitate și să le activeze la sfărșitul sprintului sau iterației.

    *De ce?*: Separarea zonelor viitoare în module face mai ușoară testarea modulelor în izolare și refolosirea codului.

### Blocurile Refolosibile sunt Module
###### [Style [Y164](#style-y164)]

  - Creează module ce reprezintă blocuri refolosibile ale aplicației pentru servicii comune precum tratarea excepțiilor, logare, diagnoză, securitate, și stashing de date locale.

    *De ce?*: Aceste tipuri de funcționalități sunt necesare în multe aplicații, deci prin păstrarea lor separat în modulele lor proprii ele pot fi generale și refolosite în mai multe aplicații.

### Dependințele Modulelor
###### [Style [Y165](#style-y165)]

  - Modulul de bază al aplicației depinde de module bazate pe funcționalități, specifice aplicației, și pe alte module partajate sau reutilizabile. 

    ![Modularitate și dependințe](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-1.png)

    *De ce?*: Modulul de bază al aplicației conține un manifest rapid indentificabil ce conține funcționalitățile aplicației.

    *De ce?*: Fiecare zonă de funcționalitate conține un manifest a ceea de ce depinde, așa că poate fi luat ca o dependință în alte aplicații și să funcționeze în continuare.

    *De ce?*: Funcționalități Intra-Aplicație precum serviciile de date partajate devin ușor de localizat și partajat din `app.core` (alege numele tău favorit pentru acest modul)

    Notă: Aceasta e o strategie pentru consecvență. Există multe opțiuni bune aici. Alege una ce e consecventă, urmează regulile de dependințe a Angular, și e ușor de întreținut și scalat.

    > Structurile mele variază ușor între proiecte dar toate urmează aceste reguli pentru structură și modularitate. Implementarea poate varia în funcție de funcționalități și echipă. Cu alte cuvinte, nu te axa pe o structură bătută în cuie, dar construiește structura ta având în vedere consecvență, mentenabilitate, și eficiență.

    > Într-o aplicație mică, poți lua în considerare punerea tuturor dependințelor partajate în modulul de bază unde modulele de funcționalități nu au dependințe direct. Acest lucru face mai ușoară întreținerea aplicațiilor mici, dar face mai grea refolosirea acestor module în afara aplicației acesteia.

**[Înapoi sus](#table-of-contents)**

## Logica de Start

### Configurare
###### [Style [Y170](#style-y170)]

  - Injectează cod în [configurarea modulului] (https://docs.angularjs.org/guide/module#module-loading-dependencies), ce trebuie să fie configurat înaintea rulării aplicației. Candidații ideali sunt providerii și constantele.

    *De ce?*: Acest lucru reduce numărul de locuri în care ai configurație.

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

### Blocuri de rulare
###### [Style [Y171](#style-y171)]

  - Orice cod ce trebuie să ruleze când o aplicație pornește ar trebui declarat într-un factory, expus printr-o funcție, și injectat în [blocul de rularee](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *De ce?*: Codul direct într-un bloc de rulare poate fi greu de testat. Punându-l într-un factory il face mai ușor de abstractizat și generat.

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

## Servicii Angular $ Wrapper

### $document și $window
###### [Style [Y180](#style-y180)]

  - Folosește [`$document`](https://docs.angularjs.org/api/ng/service/$document) și [`$window`](https://docs.angularjs.org/api/ng/service/$window) în loc de `document` și `window`.

    *De ce?*: Aceste servicii sunt învelite de Angular și sunt mai ușor testabile decât folosind document și window in teste. Acest lucru ajută la evitarea generării manuale a 'document' și 'window'.

### $timeout și $interval
###### [Style [Y181](#style-y181)]

  - Folosește [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) și [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) în loc de `setTimeout` și `setInterval` .

    *De ce?*: Aceste servicii sunt învelite de Angular și sunt mai ușor testabile și folosesc ciclul de digest al Angular, deci păstrează data-bind-ul sincronizat.

**[Înapoi sus](#table-of-contents)**

## Testarea
Unit testurile ajută la menținerea curățeniei codului, iar din acest motiv am inclus niște recomandări pentru unit testing-ul fundațiilor cu link-uri pentru mai multe informații.

### Scrie Teste cu Story-uri
###### [Style [Y190](#style-y190)]

  - Scrie un set de teste pentru fiecare story. Începe cu un test gol și umple-le în timp ce scrii codul pentru story.
    *De ce?*: Scriind descrierea testelor ajută la clarificarea definirii a ceea ce va face un story, a ceea ce nu va face, și cum se poate măsura succesul.

    ```javascript
    it('ar trebui să aibă Avengers controller', function() {
        // TODO
    });

    it('ar trebui să găsească 1 Avenger când se filtrează după nume', function() {
        // TODO
    });

    it('ar trebui să aibă 10 Avengeri', function() {
        // TODO (generează date?)
    });

    it('ar trebui să returneze Avengers prin XHR', function() {
        // TODO ($httpBackend?)
    });

    // și așa mai departe
    ```

### Biblioteca de Testare
###### [Style [Y191](#style-y191)]

  - Folosește [Jasmine](http://jasmine.github.io/) sau [Mocha](http://mochajs.org) pentru unit testing.

    *De ce?*: Atât Jasmine cât și Mocha sunt frecvent folosite de către comunitatea Angular. Ambele sunt stabile, întreținute bine, și furnizează funcționalități robuste de testare.

    Notă: Când folosești Mocha, ia în calcul de asemenea folosirea unei biblioteci de assert precum [Chai](http://chaijs.com). Eu prefer Mocha.

### Rularea Testelor
###### [Style [Y192](#style-y192)]

  - Folosește [Karma](http://karma-runner.github.io) pentru rularea testelor.

    *De ce?*: Karma e ușor de configurat ca să ruleze o dată automat sau automat când faci schimbări în cod.

    *De ce?*: Karma se leagă de procesul tău de Continuous Integration ușor pe cont propriu sau prin intermediul Grunt sau Gulp.

    *De ce?*: unele IDE-uri încep să se integreze cu Karma, precum [WebStorm](http://www.jetbrains.com/webstorm/) și [Visual Studio](https://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *De ce?*: Karma funcționează bine cu leaderii de automatizare de taskuri precum [Grunt](http://gruntjs.com/) (cu [grunt-karma](https://github.com/karma-runner/grunt-karma)) și [Gulp](http://gulpjs.com/). Când folosești Gulp, folosește [Karma](https://github.com/karma-runner/karma) direct și nu un API, de vreme ce API-ul poate fi apelat direct.

    ```javascript
    /* recomandat */

    // Exemplu de Gulp direct cu Karma
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

### Stubbing-ul și Spionarea
###### [Style [Y193](#style-y193)]

  - Folosește [Sinon](http://sinonjs.org/) pentru stubbing și spionare.

    *De ce?*: Sinon funcționează bine atât cu Jasmine cât și cu Mocha și extinde caracteristicile de stubbing și spionare pe care acestea le oferă.

    *De ce?*: Sinon face mai ușoară trecerea între Jasmine și Mocha, dacă vrei să le încerci pe ambele.

    *De ce?*: Sinon are mesaje descriptive pentru când testele eșuază assert-urile.

### Browser Headless 
###### [Style [Y194](#style-y194)]

  - Folosește [PhantomJS](http://phantomjs.org/) pentru a-ți rula testele pe un server.

    *De ce?*: PhantomJS e un browser headless ce ajută la rularea testelor tale fără a avea nevoie de un browser "vizual". Așa că nu ai nevoie să instalezi Chrome, Safari, IE, sau alte browsere pe serverul tău.

    Notă: Ar trebui, în continuare, să testezi pe toate browserele din mediul tău, mai ales acelea relative pentru utilizatorii tăi.

### Analiza Codului
###### [Style [Y195](#style-y195)]

  - Rulează JSHint pe testele tale.

    *De ce?*: Testele sunt cod. JSHint poate identifica probleme de calitate a codului ce pot apărea și cauza test să nu ruleze cum trebuie.

### Atenuează Globalele pentru Regulile JSHint despre Teste
###### [Style [Y196](#style-y196)]

  - Atenuează regulile pe codul tău de test pentru a permite globale comune precum `describe` și `expect`. Atenuează regulile pentru expresii, de vreme ce Mocha le folosește.

    *De ce?*: Testele tale sunt cod și au nevoie de aceași atenție pentru regulile de calitate a codului precum codul tău de producție. Însă variablilele globale folosite de framework-ul de testare de exemplu, pot fi relaxate prin includerea lui "this" în specificațiile de test.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Sau poți adăuga următoarele în fișierul tău de opțiuni JSHint.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Unelte de Testare](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/testing-tools.png)

### Organizarea Testelor
###### [Style [Y197](#style-y197)]

  - Pune fișierele de unit test (specs) lângă codul tău de client. Pune specificațiile ce acoperă integrarea cu serverul sau testează mai multe componente într-un foloder separat `tests`.

    *De ce?*: Unit testurile au corelare directă cu o componentă și un fișier specific din codul sursă.

    *De ce?*: E mai ușor să le menții la zi de vreme ce sunt întotdeauna la vedere. Când scrii cod, indiferent dacă faci TDD sau testezi în timpul dezvoltării sau după dezvoltare, specificațiile sunt una lângă alta și niciodată în afara câmpului vizual, așa că au mai multe șanse să fie aduse la zi, și deci să menții code coverage-ul.

    *De ce?*: Când faci update la codul sursă e mai ușor să faci update și la teste în același timp.

    *De ce?*: Punându-le una lângă alta face mai ușoară găsirea lor și mai ușor să le muți împreună cu codul sursă dacă muți sursa.

    *De ce?*: Avutul specificației aproape, face mai ușoară citirea pentru cititorul codului sursă în scopul înțelegerii a cum ar trebui ca o componentă să fie folosită și să descopere limitările acesteia.

    *De ce?*: Separarea specificațiilor în așa fel încât acestea nu sunt într-un build distribuit e ușor cu grunt sau gulp.

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

## Animații

### Folosire
###### [Style [Y210](#style-y210)]

  - Folosește [animații subtile cu Angular](https://docs.angularjs.org/guide/animations) pentru a tranziționa între stări și view-uri și pentru elemente vizuale primare. Include [modulul ngAnimate](https://docs.angularjs.org/api/ngAnimate). Cele 3 chei sunt subtil, lin, și fluid.

    *De ce?*: Animațiile subtile pot îmbunătăți experiența utilizatoruli atunci când sunt folosite în mod corespuzător.

    *De ce?*: Animațiile subtile pot îmbunătăți peformanța percepută când view-urile tranziționează.

### Sub o Secundă
###### [Style [Y211](#style-y211)]

  - Folosește durate scurte pentru animații. Eu prefer în general să încep cu 300ms și să ajustez până când e corespunzător.

    *De ce?*: Animațiile lungi pot avea efectul invers asupra experienței utilizatorului și a performanței percepute prin darea unei senzații de aplicație înceată.

### animate.css
###### [Style [Y212](#style-y212)]

  - Folosește [animate.css](http://daneden.github.io/animate.css/) pentru animații convenționale.

    *De ce?*: Animațiile pe care animate.css le oferă sunt rapide, fluide și foarte ușoare de adăugat în aplicație.

    *De ce?*: Conferă consecvență în animații.

    *De ce?*: animate.css e folosit și testat în mod larg.

    Notă: Vezi [acest articol foarte bun al lui Matias Niemelä despre animațiile Angular](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Înapoi sus](#table-of-contents)**

## Comentarii

### jsDoc
###### [Style [Y220](#style-y220)]

  - Dacă planifici să produci documentație, folosește sintaxa [`jsDoc`](http://usejsdoc.org/) pentru a documenta numele de funcții, descrierile, parametrii și returnurile. Folosește `@namespace` și `@memberOf` pentru a potrivi structura aplicației.

    *De ce?*: Poți genera (și regenera) documentație din codul tău, în locul scrierii sale de la 0.

    *De ce?*: Folosirea unui tool comun în industrie conferă consecvență.

    ```javascript
    /**
     * Factory-uri de log 
     * @namespace Factories
     */
    (function() {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Logger în toată aplicația
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
           * @param {String} msg Mesaj pentru logare
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

### Folosește un fișier de opțiuni
###### [Style [Y230](#style-y230)]

  - Folosește JS Hint pentru linting-ul codului tău JavaScript și asigură-te că personalizezi fișierul JS hint de opțiuni și îl incluzi în source control. Vezi [documentația JS Hint](http://jshint.com/docs/) pentru detalii despre opțiuni.

    *De ce?*: Furnizează o primă alertă înaintea comiterii codului în source control.

    *De ce?*: Furnizează consecvență în echipă.

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

### Folosește un Fișier de Opțiuni
###### [Style [Y235](#style-y235)]

  - Folosește JSCS pentru verificarea stilului codului tău JavaScript și asigură-te că personalizezi fișierul de opțiuni JSCS și-l incluzi în source control. Vezi [documentația JSCS](http://jscs.info/).
    
    *De ce?*: Furnizează o primă alertă înaintea comiterii codului în source control.

    *De ce?*: Furnizează consecvență în echipă.

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

## Constante

### Globale Specifice Furnizorului
###### [Style [Y240](#style-y240)]

  - Creează o Constantă Angular pentru variabilele globale care aparțin biblioteciilor furnizorilor. 

    *De ce?*: Oferă o metodă de a injecta biblioteci ale furnizorilor care altfel ar fi globale. Acest lucru îmbunătățește testabilitatea codului prin faptul că îți permite să știi mai ușor care sunt dependințele componentelor tale (evită abstracțiile indiscrete). 

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

  - Folosește constante pentru valori ce nu se schimbă și care nu vin dintr-un alt serviciu. Când constantele sunt folosite doar pentru un modul ce ar putea fi folosit în mai multe aplicații, pleasează constantele într-un fișier per modul numit după modul. Până când acest lucru e necesar, păstrează constantele din modulul principal într-un fișier `constants.js`.

    *De ce?*: O valoare ce s-ar putea schimba, până și rar, ar trebui luată dintr-un serviciu, astfel încât tu să nu trebuiască să schimbi codul sursă. De exemplu, un url pentru un serviciu de date ar putea fi pus într-o constantă dar un loc mai bun ar fi încărcarea lui dintr-un serviciu web.

    *De ce?*: Constantele pot fi injectate în orice component angular, încluzând providerii.

    *De ce?*:Când o aplicație e separată în module ce ar putea fi refolosite în alte aplicații, fiecare modul stand-alone ar trebui să poată să opereze pe cont propriu incluzând orice constante dependente.

    ```javascript
    // Constante folosite de întreaga aplicație
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

## Șabloane de Fișiere și Snippeturi
Folosește șabloane de fișier sau snippeturi pentru a ajuta urmarea de stiluri și șabloane consecvente. Aici sunt niște șabloane și/sau snippeturi pentru unele dintre editoarele de web development și IDE-uri. 

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Snippeturi Angular ce urmează aceste stiluri și ghiduri.

    - Descarcă [Sublime Angular snippets](assets/sublime-angular-snippets?raw=true)
    - Pune-l în folderul Packages
    - Restartează Sublime
    - Într-un fișier JavaScript scrie aceste comenzi urmate de un `TAB`:

    ```javascript
    ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngmodule     // creează un modul Angular
    ngservice    // creează un serviciu Angular
    ngfilter     // creează un filtru Angular
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - Snippeturi Angular ce urmează aceste stiluri și ghiduri pot fi găsite pe site-ul [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Descarcă extensia [SideWaffle](http://www.sidewaffle.com) pentru Visual Studio (fișierul vsix)
    - Rulează fișierul vsix
    - Restartează Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Live Template-uri Angular ce urmează aceste stiluri și ghiduri.

    - Descarcă [webstorm-angular-live-templates.xml](assets/webstorm-angular-live-templates/webstorm-angular-live-templates.xml?raw=true)
    - Pune-l în fișierul tău de [template-uri](https://www.jetbrains.com/webstorm/help/project-and-ide-settings.html)
    - Restartează WebStorm
    - Într-un fișier JavaScript scrie aceste comenzi urmate de un `TAB`:

    ```javascript
    // Acestea sunt snippet-uri pe fișiere întregi ce conțin IIFE-uri
    ngapp     // creează un modul Angular setter
    ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngfilter     // creează un filtru Angular
    ngservice    // creează un serviciu Angular

    // Acestea sunt snippet-uri parțiale menite a fi înlănțuite
    ngmodule     // creează un getter de modul Angular
    ngstate      // creează o definiție de stare pentru Angular UI Router
    ngconfig     // definește o funcție pentru faza de configurare 
    ngrun        // definește o funcție pentru faza de rulare
    ngwhen      // creează o definiție ngRoute cu 'when'
    ```

  *Template-uri individuale sunt de asemenea disponibile pentru descărcare în folder-ul [webstorm-angular-live-templates](assets/webstorm-angular-live-templates?raw=true)*

### Atom
###### [Style [Y253](#style-y253)]

  - Snippet-uri Angular ce urmează aceste stiluri și ghiduri.
  
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    - Deschide Atom, apoi deschide Package Manager (Packages -> Settings View -> Install Packages/Themes)
    - Caută pachetul 'angularjs-styleguide-snippets'
    - Apasă 'Install' pentru a instala pachetul

  - Într-un fișier JavaScript scrie aceste comenzi, urmate de un `TAB`

    ```javascript
    ngcontroller // creează un controller Angular
    ngdirective // creează o directivă Angular
    ngfactory // creează un factory Angular
    ngmodule // creează un modul Angular
    ngservice // creează un serviciu Angular
    ngfilter // creează un filtru Angular
    ```

### Brackets
###### [Style [Y254](#style-y254)]

  - Snippet-uri Angular ce urmează aceste stiluri și ghiduri.
    - Descarcă [Brackets Angular snippets](assets/brackets-angular-snippets.yaml?raw=true)
    - Brackets Extension manager ( File > Extension manager )
    - Instalează ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets)
    - Apasă becul din partea din dreapta sus a Brackets
    - Apasă `Settings` și apoi `Import`
    - Selectează fișierul și apoi alege dacă faci skip sau override
    - Apasă `Start Import`

  - Într-un fișier JavaScript scrie aceste comenzi, urmate de un `TAB`

    ```javascript
    // Acestea sunt snippet-uri pe fișiere întregi ce conțin IIFE-uri
     ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngmodule     // creează un modul Angular
    ngservice    // creează un serviciu Angular
    ngfilter     // creează un filtru Angular

    // Acestea sunt snippet-uri parțiale menite a fi înlănțuite
    ngmodule     // creează un getter de modul Angular
    ngstate      // creează o definiție de stare pentru Angular UI Router
    ngconfig     // definește o funcție pentru faza de configurare 
    ngrun        // definește o funcție pentru faza de rulare
    ngwhen      // creează o definiție ngRoute cu 'when'
    ngtranslate  // folosește serviciul $translate cu promise-ul său
    ```

### vim
###### [Style [Y255](#style-y255)]

  - Snippet-uri vim ce urmează aceste stiluri și ghiduri.

    - Descarcă [vim Angular snippets](assets/vim-angular-snippets?raw=true)
    - Setează [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)
    - Copiază snippet-urile în folder-ul de snippeturi

  - Snippet-uri vim UltiSnips ce urmează aceste stiluri și ghiduri.

    - Descarcă[vim Angular UltiSnips snippets](assets/vim-angular-ultisnips?raw=true)
    - Setează [UltiSnips](https://github.com/SirVer/ultisnips)
    - Copiază snippet-urile în folderul UltiSnips

    ```javascript
    ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngmodule     // creează un modul Angular
    ngservice    // creează un serviciu Angular
    ngfilter     // creează un filtru Angular
    ```

### Visual Studio Code

###### [Style [Y256](#style-y256)]

  - Snippeturi [Visual Studio Code](https://code.visualstudio.com/) ce urmează aceste stiluri și ghiduri.

    - Descarcă [VS Code Angular snippets](assets/vscode-snippets/javascript.json?raw=true)
    - Copiază snippeturile în folder-ul de snippet-uri, sau copiază snippet-urile în cele deja existente

    ```javascript
    ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngmodule     // creează un modul Angular
    ngservice    // creează un serviciu Angular
    ngfilter     // creează un filtru Angular
    ```

### Emacs
###### [Style [Y257](#style-y257)]

  - Snippet-uri [Emacs](https://www.gnu.org/software/emacs/) ce urmează aceste stiluri și ghiduri.

    - Descarcă [Emacs Angular snippets](assets/emacs-angular-snippets?raw=true)

      Yyasnippet categorizează snippet-urile prin mod-ul major, și sunt mai multe moduri major pentru Emacs pentru editarea codului JavaScript. Snippet-urile sunt în `js2-mode`, și celelalte directoare conțin doar un dotfile ce le referențiază de acolo.

    - Instalează [yasnippet](https://github.com/capitaomorte/yasnippet) (`M-x package-install RET yasnippet RET`)
    - Copiază snippet-urile în folder-ul de snippeturi, sau modifică init-ul Emacs init ca să adaugi directorul de snippeturi la `yas-snippet-dirs`

    ```javascript
    ngcontroller // creează un controller Angular
    ngdirective  // creează o directivă Angular
    ngfactory    // creează un factory Angular
    ngmodule     // creează un modul Angular
    ngservice    // creează un serviciu Angular
    ngfilter     // creează un filtru Angular
    ```
    
**[Înapoi sus](#table-of-contents)**

## Generatorul Yeoman
###### [Style [Y260](#style-y260)]

Poți folosi [generatorul Yeoman HotTowel](http://jpapa.me/yohottowel) pentru a crea o aplicație ce servește ca un punct de plecare pentru Angular ce urmează acest ghid stilistic.

1. Instalează generator-hottowel

  ```
  npm install -g generator-hottowel
  ```

2. Creează un nou folder și intră în el

  ```
  mkdir myapp
  cd myapp
  ```

3. Rulează generatorul

  ```
  yo hottowel helloWorld
  ```

**[Înapoi sus](#table-of-contents)**

## Rutarea
Rutarea pe partea de client e importantă pentru creerea unui flow de navigație între view-uri și view-uri compuse ce sunt făcute din mai multe șabloane și directive.

###### [Style [Y270](#style-y270)]

  - Folosește [AngularUI Router](http://angular-ui.github.io/ui-router/) pentru rutare pe client.

    *De ce?*: UI Router oferă toate funcționalitățile unui Angular router plus niște trăsături în plus incluzând rute fiu și stări.

    *De ce?*: Sintaxa e destul de similară cu cea a Angular router, ceea ce face ușoară migrarea spre UI Router.

  - Notă: Poți folosi un provider precum cel arătat mai jos - `routerHelperProvider` - pentru a ajuta la configurarea stărilor între fișiere, în timpul fazei de rulare.

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

  - Definește rute pentru view-uri în modulul în care sunt. Fiecare modul ar trebui să definească rutele pentru view-urile din modulul respectiv. 

    *De ce?*: Fiecare modul ar trebui să fie capabil să funcționeze pe cont propriu.

    *De ce?*: Când ștergi un modul sau adaugi un modul, aplicația va conține doar rute ce pointează spre view-uri existente.

    *De ce?*: Acest lucru face activarea sau dezactivare anuor porțiuni ale aplicației fără griji despre rute orfane.

**[Înapoi sus](#table-of-contents)**

## Automatizarea Task-urilor
Folosește [Gulp](http://gulpjs.com) sau [Grunt](http://gruntjs.com) pentru creerea de task-uri automate. Gulp tinde spre cod în locul configurării, în timp ce Grunt tinde spre configurare în locul codului. Eu personal prefer Gulp, fiindcă consider că e mai ușor de scris și citit, dar amândouă sunt excelente.

> Află mai multe despre gulp și șabloane pentru automatizarea task-urilor în [cursul meu Gulp de pe Pluralsight](http://jpapa.me/gulpps)

###### [Style [Y400](#style-y400)]

  - Folosește automatizarea taskurilor pentru listarea definițiilor de module `*.module.js` înaintea oricăror altor fișiere JavaScript din aplicație.

    *De ce?*: Angular are nevoie ca definițiile de module să fie înregistrate înainte ca acestea să fie folosite.

    *De ce?*: Numirea modulelor cu un pattern specific, precum `*.module.js` face mai ușoară luarea lor și listarea lor prima dată.

    ```javascript
    var clientApp = './src/client/app/';

    // Întotdeaună procesează fișierele de module prima dată
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Înapoi sus](#table-of-contents)**

## Filtre

###### [Style [Y420](#style-y420)]

  - Evită folositrea filtrelor pentru scanarea tuturor proprietăților unui obiect complex sau graf. Folosește filtre pentru proprietăți selecte.

    *De ce?*: Filtrele pot fi foarte ușor abuzate și pot foarte ușor afecta performanța dacă nu sunt folosite corect, de exemplu când un filtru procesează un graf de obiect mare și adânc. 

**[Înapoi sus](#table-of-contents)**

## Angular docs
## Documentația Angular
Pentru orice altceva, referință API, vezi [documentația Angular](//docs.angularjs.org/api).

**[Înapoi sus](#table-of-contents)**