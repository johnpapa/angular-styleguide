# Angular Style Guide

*Dogmatischer Angular Styleguide für Teams von John Papa [@john_papa](//twitter.com/john_papa)*

Sind Sie auf der Suche nach einem dogmatischen Styleguide zur Syntax, zu Konventionen und zur Struktur von Angular-Anwendungen, dann treten Sie näher. Diese Vorlagen basieren auf meinen Erfahrungen mit [Angular](//angularjs.org), Präsentationen, [Pluralsight Trainingskursen](http://pluralsight.com/training/Authors/Details/john-papa) und der Arbeit in Teams.

Der Zweck dieses Styleguides ist es, eine Anleitung für die Erstellung von Angular-Anwendungen bereitzustellen, indem ich die Konventionen, die ich nutze, zeige und - wichtiger als das - beschreibe, warum ich sie wähle.

>Wenn Sie diese Anleitung mögen, dann besuchen Sie meinen Kurs [Angular Patterns: Clean Code] (http://jpapa.me/ngclean) auf Pluralsight, der eine Begleitung zu dieser Anleitung darstellt.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Außergewöhnliche Community und Anerkennung
Arbeite niemals im leeren Raum. Ich finde, dass die Angular-Community eine unglaubliche Gruppe ist, die ihre Erfahrung mit Leidenschaft teilt. Also haben ein Freund und Angular-Experte, Todd Motto, und ich viele Vorlagen und Konventionen zusammengetragen. Bei den meisten sind wir uns einig, und bei ein paar sind wir verschiedener Meinung. Ich möchte Sie ermutigen, sich [Todd's Guidelines](https://github.com/toddmotto/angularjs-styleguide) anzusehen, um ein Gespür für seinen Ansatz zu entwickeln und ihn vergleichen zu können.

Viele meiner Vorlagen entstanden aus Pair-Programming-Sessions, die [Ward Bell](http://twitter.com/wardbell) und ich hatten. Mein Freund Ward hat sicherlich die endgültige Entwicklung dieser Anleitung beeinflusst.

## Schauen Sie sich die Vorlagen in einer Beispielanwendung an
Während diese Anleitung das *Was*, *Warum* und *Wie* erklärt, finde ich es ebenso hilfreich, sie auch in der Praxis zu sehen. Diese Anleitung wird von einer Beispielanwendung begleitet, die diesen Vorlagen und Mustern folgt. Sie finden die [Beispielanwendung (namens "modular") hier] (https://github.com/johnpapa/ng-demos) im `modular`-Ordner. Fühlen Sie sich frei, diese zu holen, indem Sie sie clonen oder einen Fork erstellen.[Anweisungen, sie zum Laufen zu bringen, finden Sie im Readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Übersetzungen
[Übersetzungen dieses Styleguides](https://github.com/johnpapa/angular-styleguide/tree/master/i18n) werden von der Community hier verwaltet.

## Inhaltsverzeichnis

  1. [Single Responsibility](#single-responsibility)
  1. [IIFE](#iife)
  1. [Module](#module)
  1. [Controller](#controller)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Datenservices](#datenservices)
  1. [Direktiven](#direktiven)
  1. [Promises für einen Controller auflösen](#promises-für-einen-controller-auflösen)
  1. [Manuelle Code-Anmerkungen für das Einfügen von Abhängigkeiten (Dependency Injection)](#manuelle-code-anmerkungen-für-das-einfügen-von-abhängigkeiten-dependency-injection)
  1. [Minifizierung und Code-Anmerkungen](#minifizierung-und-code-anmerkungen)
  1. [Fehlerbehandlung](#fehlerbehandlung)
  1. [Namensgebung](#namensgebung)
  1. [Anwendungsstruktur: LIFT Prinzip](#anwendungsstruktur-das-lift-prinzip)
  1. [Anwendungsstruktur](#anwendungsstruktur)
  1. [Modularität](#modularität)
  1. [Startlogik](#startlogik)
  1. [Angular $ Wrapper Services](#angular--wrapper-services)
  1. [Testen](#testen)
  1. [Animationen](#animationen)
  1. [Kommentare](#kommentare)
  1. [JS Hint](#js-hint)
  1. [JSCS](#jscs)
  1. [Konstanten](#konstanten)
  1. [Dateitemplates und Snippets](#dateitemplates-und-snippets)
  1. [Yeoman Generator](#yeoman-generator)
  1. [Routing](#routing)
  1. [Automatisierung von Aufgaben](#automatisierung-von-aufgaben)
  1. [Filter](#filter)
  1. [Angular Dokumentation](#angular-dokumentation)
  1. [Beiträge](#beiträge)
  1. [Lizenz](#lizenz)

## Single Responsibility

### Rule of 1
###### [Style [Y001](#style-y001)]

  - Definiere eine Komponente pro Datei.

  Das folgende Beispiel definiert das `app`-Modul und seine Abhängigkeiten, einen Controller und eine Factory in ein und derselben Datei.

  ```javascript
  /* zu vermeiden */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  Die gleichen Komponenten sind nun in separaten Dateien untergebracht.

  ```javascript
  /* empfohlen */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* empfohlen */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* empfohlen */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Zurück zum Anfang](#table-of-contents)**

## IIFE
### JavaScript Closures
###### [Style [Y010](#style-y010)]

  - Packen Sie Angular-Komponenten in eine Funktion, die sich sofort selbst ausführt (Immediately Invoked Function Expression, kurz: IIFE).

  *Warum?*: Eine IIFE entfernt Variablen aus dem global scope. Dies verhindert, dass Variablen- und Funktionsdeklarationen länger als erwartet im global scope bleiben. Und es verhindert zusätzlich, Kollisionen bei Variablen zu verhindern.

  *Warum?*: Wird Ihr Code für das Deployment auf einem Produktionsserver minifiziert und in einer einzigen Datei zusammengepackt, kann es zur Kollision von Variablen (auch globalen) kommen. Eine IIFE schützt Sie hiervor, indem sie den Gültigkeitsbereich der Variablen auf die jeweilige Datei beschränkt.

  ```javascript
  /* zu vermeiden */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // Logger-Funktion wird als globale Variable hinzugefügt
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // Storage-Funktion wird als globale Variable hinzugefügt
  function storage() { }
  ```

  ```javascript
  /**
   * empfohlen
   *
   * es verbleiben keine globalen Variablen
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

  - Anmerkung: Nur zur Verkürzung des dargestellten Codes, wird beim Rest dieser Beispiele die IIFE-Syntax ausgelassen.

  - Anmerkung: IIFE's verhindern, dass Testcode private Elemente, wie reguläre Ausdrücke oder Hilfsfunktionen ansprechen können. Diese können oft gut direkt für sich selbst getestet werden. Sie können diese jedoch auch durch zugreifbare Elemente oder durch ihre eigene Komponente zugreifbar machen. Zum Beispiel können Sie Hilfsfunktionen, reguläre Ausdrücke oder Konstanten in ihrer eigenen Factory oder Konstante platzieren.

**[Zurück zum Anfang](#table-of-contents)**

## Module

### Namenskollisionen vermeiden
###### [Style [Y020](#style-y020)]

  - Benutzen Sie eindeutige Namenskonventionen mit Trennzeichen für Untermodule.

  *Warum?*: Eindeutige Namen helfen Kollisionen bei Modulnamen zu verhindern. Trennzeichen helfen bei der Definition von Modulen und deren Untermodul-Hierarchie. Zum Beispiel kann `app` Ihr Root-Modul sein, während `app.dashboard` und `app.users` Module sein können, die von `app` als Abhängigkeiten genutzt werden.

### Definitionen (auch: Setter)
###### [Style [Y021](#style-y021)]

  - Deklarieren Sie Module ohne eine Variable, indem Sie die Setter-Syntax verwenden.

  *Warum?*: Bei einer Komponente pro Datei besteht kaum die Notwendigkeit eine Variable für das Modul einzuführen.

  ```javascript
  /* zu vermeiden */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Nutzen Sie stattdessen die einfache Setter-Syntax.

  ```javascript
  /* empfohlen */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getter
###### [Style [Y022](#style-y022)]

  - Wenn Sie ein Modul nutzen, vermeiden Sie die Nutzung einer Variablen. Nutzen Sie stattdessen eine Verkettung mit der Getter-Syntax.

  *Warum?*: Dies führt zu mehr lesbarem Code und verhindert Variablenkollisionen oder Leaks.

  ```javascript
  /* zu vermeiden */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* empfohlen */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs. Getting
###### [Style [Y023](#style-y023)]

  - Nur einmal setzen und für alle anderen Instanzen lesen (get).

  *Warum?*: Ein Modul sollte nur einmal erstellt werden und ab diesem Punkt an nur noch gelesen werden.

    - Benutzen Sie `angular.module('app', []);` um das Modul zu erzeugen (set).
    - Benutzen Sie `angular.module('app');` um das Modul zu erhalten (get).

### Benannte vs. anonyme Funktionen
###### [Style [Y024](#style-y024)]

  - Benutzen Sie für Callbacks benannte Funktionen, anstatt eine anonyme Funktion zu übergeben.

  *Warum?*: Dies führt zu lesbarerem Code, ist einfach zu debuggen und verringert die Schachtelung des Callback-Codes.

  ```javascript
  /* zu vermeiden */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* empfohlen */

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

**[Zurück zum Anfang](#table-of-contents)**

## Controller

### controllerAs View-Syntax
###### [Style [Y030](#style-y030)]

  - Ziehen Sie die [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/)-Syntax der `klassischen Controller-Mit-$scope`-Syntax vor.

  *Warum?*: Controller werden immer wieder neu erstellt. Man erhält jedes Mal eine neue Instanz und die `controllerAs`-Syntax ist näher an der eines JavaScript-Konstruktors, als die `klassische Controller-Mit-$scope-Syntax`.

  *Warum?*: Es begünstigt die Bindung von "Punkt-Notierten" Objekten im View (z. B. `customer.name` statt `name`), was kontextbezogener und einfacher zu lesen ist und Referenzproblemen, die ohne diese "Punkt-Notation" auftreten können, vorbeugt.

  *Warum?*: Hilft die Nutzung von `$parent`-Aufrufen in Views und geschachtelten Controllern zu vermeiden.

  ```html
  <!-- zu vermeiden -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- empfohlen -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs Controller Syntax
###### [Style [Y031](#style-y031)]

  - Ziehen Sie die `controllerAs`-Syntax der `klassischen Controller-Mit-$scope-Syntax` vor.

  - Die `controllerAs`-Syntax nutzt `this` innerhalb des Controllers, welches an `$scope` gebunden wird.

  *Warum?*: `controllerAs` stellt eine syntaktische "Versüßung" `$scope` dar. Sie können immer noch Bindungen an dem View vornehmen und auf die `$scope`-Methoden zugreifen.

  *Warum?*: Hilft, die verführerische Nutzung von `$scope`-Methoden innerhalb eines Controllers zu unterbinden, wenn es besser wäre, sie zu vermeiden oder in eine Factory auszulagern. Man sollte die Nutzung von `$scope` in einer Factory oder einem Controller nur dann in Erwägung ziehen, wenn es notwendig ist. Wenn zum Beispiel Events mit [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) oder [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) abonniert oder publiziert werden, sollte man überlegen, diese nicht in eine Factory auszulagern und vom Controller aus auszulösen.

  ```javascript
  /* zu vermeiden */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* empfohlen - schauen Sie aber bitte im nächsten Abschnitt */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs mit vm
###### [Style [Y032](#style-y032)]

  - Benutzen Sie eine Variable, um `this` zu übernehmen, wenn Sie die `controllerAs`-Syntax verwenden. Wählen Sie einen konsistenten Variablennamen, wie `vm`, welcher für ViewModel steht.

  *Warum?*: Das `this`-Schlüsselwort ist kontextbezogen und kann diesen Kontext ändern, wenn es innerhalb einer Funktion eines Controllers verwendet wird. Wird der Kontext von `this` übernommen, wird dieses Problem verhindert.

  ```javascript
  /* zu vermeiden */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* empfohlen */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Anmerkung: Sie können jegliche [jshint](http://www.jshint.com/)-Warnungen unterbinden, indem Sie den Kommentar vor der Codezeile einfügen. Allerdingst ist dies nicht notwendig, wenn die Funktion großgeschrieben ist (UpperCasing). Diese Konvention besagt, dass es sich um eine Konstruktor-Funktion handelt, was einem Controller in Angular entspricht.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Anmerkung: Wenn Sie Watches in einem Controller einsetzen, der über `controller as` genutzt wird, können Sie die `vm.*`-Member über die folgende Syntax überwachen. (Erstellen Sie Watches mit Vorsicht, denn sie belasten den "digest cycle".)

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

### Zu bindende Bestandteile nach oben
###### [Style [Y033](#style-y033)]

  - Platzieren Sie zu bindende Elemente alphabetisch sortiert am Anfang des Controllers und nicht verteilt im Code des Controllers.

    *Warum?*: Die Platzierung von zu bindenden Elementen am Anfang verbessert die Lesbarkeit und hilft Ihnen, die zur Bindung und Nutzung in einem View vorgesehenen Elemente des Controllers schnell zu identifizieren.

    *Warum?*: Anonyme Funktionen einzusetzen kann einfach sein, aber wenn diese Funktionen die Länge von einer Zeile überschreiten, wird die Lesbarkeit des Codes verschlechtert. Die Definition der Funktionen unterhalb der Deklaration der zur Bindung vorgesehenen Elemente verschiebt die Details der Implementierung nach unten, hält die zu bindenden Elemente ganz oben und macht es lesbarer (die Funktionen werden quasi "hochgezogen").

  ```javascript
  /* zu vermeiden */
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
  /* empfohlen */
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

    ![Controller Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-1.png)

  Anmerkung: Falls eine Funktion aus nur einer Zeile bestehen sollte, können Sie sich überlegen, diese nach oben zu verlagern, so lange die Lesbarkeit nicht betroffen ist.

  ```javascript
  /* zu vermeiden */
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
  /* empfohlen */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Funktionsdeklarationen, um Details der Implementierung zu verbergen
###### [Style [Y034](#style-y034)]

  - Nutzen Sie Funktionsdeklarationen, um Implementierungsdetails zu verbergen. Halten Sie Ihre zur Bindung vorgesehenen Elemente oben. Wenn Sie eine Controller-Funktion zur Bindung vorsehen müssen, dann lassen Sie diese auf die Funktionsdeklaration zeigen, die weiter unten erscheint. Diese wird direkt an den Abschnitt mit den zur Bindung vorgesehenen Element geknüpft. Mehr erfahren Sie hier in [diesem Beitrag](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Warum?*: Die zur Bindung vorgesehenen Elemente am Anfang zu platzieren, erhöht die Lesbarkeit und hilft Ihnen die Elemente zu identifizieren, die gebunden und in einem View genutzt werden können. (Das Gleiche, wie zuvor.)

    *Warum?*: Das Platzieren der Implementierungsdetails einer Funktion weiter unten in der Datei hält diese Codemenge außer Sicht und Sie sehen die wichtigen Dinge am Anfang.

    *Warum?*: Funktionsdeklarationen werden "nach oben gezogen" (sog. Hoisting), so dass es keine Probleme damit gibt, ob eine Funktion vor ihrer Benutzung deklariert werden sollte (wie es bei Funktionsausdrücken der Fall wäre).

    *Warum?*: Sie müssen sich niemals Sorgen darum machen, wenn Sie in Funktionsdeklarationen `var a` vor `var b` platzieren, weil `a` von `b` abhängig ist.

    *Warum?*: Die Reihenfolge ist nur kritisch in Funktionsausdrücken.

  ```javascript
  /**
   * zu vermeiden
   * Nutzung von Funktionsausdrücken.
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

  Berücksichtigen Sie, dass die wichtigen Teile im vorangegangenen Beispiel verstreut sind. Im folgenden Beispiel befindet sich der wichtige Teil ganz oben: Beispielsweise die Elemente, die gebunden werden können, wie `vm.avengers` und `vm.title`. Die Implementierungsdetails befinden sich unterhalb, was eben einfacher zu lesen ist.

  ```javascript
  /*
   * empfohlen
   * Nutzung von Funktionsdeklarationen
   * und bindbaren Elementen weiter oben.
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

### Verlagern Sie Controller-Logik in Services
###### [Style [Y035](#style-y035)]

  - Verlagern Sie die Logik eines Controllers, indem Sie diese in Services oder Factories übertragen.

    *Warum?*: Die Logik kann von mehreren Controllern wiederverwendet werden, wenn sie in einem Service oder einer Factory untergebracht ist und über eine Funktion bereitgestellt wird.

    *Warum?*: Logik in einem Service kann in einem Unit-Test einfacher isoliert werden und die Aufruflogik des Controllers wird einfach simuliert.

    *Warum?*: Beseitigt Abhängigkeiten und versteckt die Implementierungsdetails vor dem Controller.

    *Warum?*: Hält den Controller schlank und richtet ihn auf seine Aufgabe aus.

  ```javascript

  /* zu vermeiden */
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
  /* empfohlen */
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

### Halten Sie die Controller auf ihre Aufgabe ausgerichtet
###### [Style [Y037](#style-y037)]

  - Definieren Sie einen Controller für einen View und versuchen Sie nicht, diesen Controller für weitere Views zu verwenden. Verlagern Sie stattdessen wiederzuverwendende Logik in Factories und halten Sie den Controller einfach und ausgerichtet auf seinen View.

    *Warum?*: Controller in mehreren Views wiederzuverwenden ist kritisch und bedingt eine gute End-Zu-End (e2e) Testabdeckung, um die Stabilität in großen Anwendungen zu garantieren.


### Controller zuweisen
###### [Style [Y038](#style-y038)]

  - Wenn ein Controller mit einem View verbunden werden muss und eine der beiden Komponenten aber von anderen Controllern oder Views wiederverwendet werden muss, dann sollten die Controller bei ihren Routen definiert werden.

    Anmerkung: Sollte eine View in einem anderen Kontext als einer Route geladen werden, dann benutzen Sie die `ng-controller="Avengers as vm"`-Syntax.

    *Warum?*: Wird der Controller innerhalb einer Route verbunden, dann ist es möglich, dass unterschiedliche Routen auch unterschiedliche Controller-View-Bindungen verwenden können. Sind Controller in einer View mit [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController) angebunden, dann ist diese View immer mit dem gleichen Controller verbunden.

 ```javascript
  /* zu vermeiden - bei Nutzung mit einer Route, wenn eine dynamische Verbindung gewünscht ist */

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
  /* empfohlen */

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

**[Zurück zum Anfang](#table-of-contents)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - Services werden mit dem `new`-Schlüsselwort instanziiert, und benutzen `this` für öffentliche Methoden und Variablen. Auch wenn sie den Factories so ähnlich sind, setzen Sie stattdessen aus Konsistenzgründen eine Factory ein.

    Anmerkung: [Alle Angular-Services sind Singletons](https://docs.angularjs.org/guide/services). Das bedeutet, dass es nur eine Instanz eines Services pro Injector gibt.

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

**[Zurück zum Anfang](#table-of-contents)**

## Factories

### Single Responsibility
###### [Style [Y050](#style-y050)]

  - Factories sollten [eine einzige Verantwortung](http://en.wikipedia.org/wiki/Single_responsibility_principle) haben, die in ihrem Kontext gekapselt ist. Wenn eine Factory einmal über diesen einzigen Zweck hinaus erweitert werden muss, dann sollte eine neue Factory erstellt werden.

### Singletons
###### [Style [Y051](#style-y051)]

  - Factories sind Singletons und liefern ein Objekt zurück, das die Bestandteile (Elemente) des Service beinhaltet.

    Anmerkung: [Alle Angular-Services sind Singletons](https://docs.angularjs.org/guide/services).

### Zugreifbare Bestandteile an den Anfang
###### [Style [Y052](#style-y052)]

  - Halten Sie die zugreifbaren Bestandteile eines Service (sein Interface) oben, indem Sie eine Technik anwenden, die aus [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) entlehnt ist.

    *Warum?*: Die zugreifbaren Bestandteile oben zu platzieren, erhöht die Lesbarkeit und hilft Ihnen, schnell zu identifizieren, welche Elemente des Service aufgerufen werden können und getestet (oder simuliert) werden müssen.

    *Warum?*: Dies ist besonders hilfreich, wenn die Datei länger wird, weil ein Scrollen unnötig wird, um zu sehen, was verfügbar ist.

    *Warum?*: Einfach nur Funktionen einzusetzen kann leicht sein. Wenn diese aber den Umfang einer Zeile überschreiben, kann dies die Lesbarkeit verringern und es muss mehr gescrollt werden. Ein aufrufbares Interface im zurückgelieferten Service zu definieren, verlagert die Implementierungsdetails nach unten, hält das aufrufbare Interface ganz oben und  macht es lesbarer.

  ```javascript
  /* zu vermeiden */
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
  /* empfohlen */
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

  So spiegeln sich die Bindungen im gesamten (beinhaltenden) Objekt wieder. Werte können nicht selbständig durch die Offenlegung des Modulmusters geändert werden.

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-2.png)

### Funktionsdeklarationen, um die Details der Implementierung zu verbergen
###### [Style [Y053](#style-y053)]

  - Benutzen Sie Funktionsdeklarationen, um die Details der Implementierung zu verbergen. Halten Sie Ihre zugreifbaren Bestandteile der Factory ganz oben. Lassen Sie diese auf Funktionsdeklarationen verweisen, die weiter unten in der Datei aufgeführt werden. Mehr erfahren Sie hier in [diesem Beitrag](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Warum?*: Zugreifbare Elemente am Anfang zu platzieren, erhöht die Lesbarkeit und hilft Ihnen, zu identifizieren, auf welche Funktionen der Factory von außen zugegriffen werden kann.

    *Warum?*: Das Platzieren der Implementierungsdetails einer Funktion weiter unten in der Datei, hält diese Codemenge außer Sicht und Sie sehen die wichtigen Dinge am Anfang.

    *Warum?*: Funktionsdeklarationen werden "nach oben gezogen" (sog. Hoisting), so dass es keine Probleme damit gibt, ob eine Funktion vor ihrer Benutzung deklariert werden sollte (wie es bei Funktionsausdrücken der Fall wäre).

    *Warum?*: Sie müssen sich niemals Sorgen darum machen, wenn Sie in Funktionsdeklarationen `var a` vor `var b` platzieren, weil `a` von `b` abhängig ist.

    *Warum?*: Die Reihenfolge ist kritisch in Funktionsausdrücken.

  ```javascript
  /**
   * zu vermeiden
   * Nutzung von Funktionsausdrücken
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
   * empfohlen
   * Nutzung von Funktionsdeklarationen und den zugreifbaren Elementen ganz oben
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

**[Zurück zum Anfang](#table-of-contents)**

## Datenservices

### Separate Datenzugriffe
###### [Style [Y060](#style-y060)]

  - Verlagern Sie die Datenzugriffslogik und die Operationen mit Daten in eine Factory Machen Sie die Datenservices verantwortlich für die XHR-Aufrufe, die lokale Speicherung, die Ablage im Speicher oder jede andere Datenoperation.

    *Warum?*: Die Verantwortung des Controllers liegt in der Zusammenstellung und Präsentation der Informationen für die und in der View. Er sollte sich nicht darum kümmern müssen, wie er die Daten bekommt, sondern wen er dazu ansprechen muss. Die Datenservices zu trennen verlagert die Logik der Datenermittlung in den Datenservice und belässt den Controller in seiner Einfachheit und seinem Fokus auf den View.

    *Warum?*: Das macht das Testen der Datenabrufe (simuliert oder real) einfacher, wenn man einen Controller testet, der einen Datenservice nutzt.

    *Warum?*: Datenservice-Implementierungen enthalten spezifischen Code, um die Daten zu handhaben. Dies können bestimmte Header sein, die beschreiben, wie mit den Datenquellen oder anderen Services wie `$http` kommuniziert werden muss. Die Separierung dieser Logik in einem Datenservice kapselt sie an einem einzigen Platz und verbirgt die Implementierung vor den Konsumenten dieses Service (z. B. einem Controller). Das macht es auch einfacher, die Implementierung auszutauschen.

  ```javascript
  /* empfohlen */

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

    Anmerkung: Der Datenservice wird von seinen Verbrauchern, wie einem Controller, angesprochen. Wie unten gezeigt, wird seine Implementierung vor den Verbrauchern verborgen.

  ```javascript
  /* empfohlen */

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

### Rücklieferung eines Versprechens ("Promise") von einem Datenabruf
###### [Style [Y061](#style-y061)]

  - Wenn Sie einen Datenservice ansprechen, der einen Promise wie `$http` zurückliefert, so liefern Sie in Ihrer aufrufenden Funktion ebenso einen Promise zurück.

    *Warum?*: Sie können die Promises aneinanderhängen und weitere Aktionen ausführen, wenn der Datenabruf beendet ist und den Promise im Erfolgsfall entweder auflöst oder bei Fehlschlagen zurückweist.

  ```javascript
  /* empfohlen */

  activate();

  function activate() {
      /**
       * Schritt 1
       * Bei der getAvengers Funktion nach den Avenger-Daten
       * fragen und auf den Promise warten
       */
      return getAvengers().then(function() {
          /**
           * Schritt 4
           * Aktion ausführen, um den finalen Promise aufzulösen
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Schritt 2
         * Beim Datenservice nach den Daten fragen und
         * auf den Promise warten
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Schritt 3
                 * ermittelte Daten einsetzen und den Promise auflösen
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[Zurück zum Anfang](#table-of-contents)**

## Direktiven
### Begrenzung auf Eine pro Datei
###### [Style [Y070](#style-y070)]

  - Erstellen Sie eine Direktive pro Datei. Benennen Sie die Datei nach der Direktive.

    *Warum?*: Es ist einfach, alle Direktiven in einer Datei zu halten, aber schwer, sie dann wieder herauszulösen sodass sie zwischen Anwendungen oder Modulen ausgetauscht werden können oder einfach nur in einem Modulzu genutzt werden.

    *Warum?*: Eine Direktive pro Datei ist einfach zu warten.

    > Anmerkung: "**Best Practice**: Direktiven sollten aufräumen. Sie können `element.on('$destroy', ...)` oder `scope.$on('$destroy', ...)` nutzen, um eine Bereinigungsfunktion auszuführen, wenn die Direktive entfernt wird." ... aus der Angular-Dokumentation.

  ```javascript
  /* zu vermeiden */
  /* directives.js */

  angular
      .module('app.widgets')

      /* Bestell-Direktive, die für das Bestell-Modul spezifisch ist */
      .directive('orderCalendarRange', orderCalendarRange)

      /* Verkaufs-Direktive, die überall in der Verkaufsanwendung genutzt werden kann */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* "Spinner"-Direktive, die in verschiedenen Anwendungen verwendet werden kann */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* Implementierungsdetails */
  }

  function salesCustomerInfo() {
      /* Implementierungsdetails */
  }

  function sharedSpinner() {
      /* Implementierungsdetails */
  }
  ```

  ```javascript
  /* empfohlen */
  /* calendarRange.directive.js */

  /**
   * @desc Bestell-Direktive, die speziell für das Bestell-Modul der Firma Acme bestimmt ist.
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* Implementierungsdetails */
  }
  ```

  ```javascript
  /* empfohlen */
  /* customerInfo.directive.js */

  /**
   * @desc Verkaufs-Direktive, die überall innerhalb der Verkaufsanwendung der Firma Acme genutzt werden kann
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* Implementierungsdetails */
  }
  ```

  ```javascript
  /* empfohlen */
  /* spinner.directive.js */

  /**
   * @desc "Spinner"-Direktive, die in jeder Anwendung der Firma Acme genutzt werden kann.
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* Implementierungsdetails */
  }
  ```

    Anmerkung: Es gibt viele Benennungsmöglichkeiten für Direktiven, weil sie in einem schmalen oder weiten Gültigkeitsbereich genutzt werden können. Wählen Sie eine, die den Namen der Direktive und ihren Dateinamen eindeutig und klar verständlich macht. Einige Beispiele befinden sich weiter unten, aber schauen Sie sich den Abschnitt zur [Namensgebung](#naming) an, um weitere Empfehlungen zu sehen.

### DOM-Maniuplation in einer Directive
###### [Style [Y072](#style-y072)]

  - Benutzen Sie zur direkten Manipulation des DOM eine Direktive. Wenn es alternative Wege gibt, wie zum Beispiel CSS, um Stile zu setzen oder [Animation Services](https://docs.angularjs.org/api/ngAnimate), Angular Templates, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) oder [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), dann nutzen Sie diese anstatt. Wenn die Direktive zum Beispiel einfach nur etwas versteckt oder zeigt, dann benutzen Sie ngHide/ngShow.

    *Warum?*: DOM-Manipulationen können schwer zu testen oder zu debuggen sein und es gibt oftmals bessere Wege (z. B. CSS, Animationen oder Templates)

### Vergeben Sie einen eindeutigen Präfix für eine Direktive
###### [Style [Y073](#style-y073)]

  - Vergeben Sie einen kurzen, eindeutigen und beschreibenden Präfix für die Direktive, wie `acmeSalesCustomerInfo`. Dieser würde in HTML als `acme-sales-customer-info` genutzt.

    *Warum?*: Der eindeutige kurze Präfix gibt den Kontext und den Ursprung der Direktive wieder. Ein Prefix wie `cc-` könnte ausweisen, dass die Direktive Teil einer "CodeCamper"-Anwendung ist, wohingegegen `acme-` auf eine Direktive der Firma Acme hinweisen könnte.

    Anmerkung: Vermeiden Sie `ng-`, weil dieser Präfix für Angular-Direktiven reserviert ist. Recherchieren Sie viel genutzte Direktiven, um einem Namenskonflikt wie zum Beispiel mit `ion-` für das [Ionic Framework](http://ionicframework.com/) vorzubeugen.

### Beschränken Sie Direktiven auf Elemente und Attribute
###### [Style [Y074](#style-y074)]

  - Beim Erstellen einer Direktive, die sinnvollerweise als alleinstehendes Element entwickelt werden kann, sollten Sie diese auf `E` (Custom Element) und optional auf `A` (Custom Attribute) beschränken. Wenn die Direktive ihr eigenes Control sein könnte, ist `E` generell angebracht. Die allgemeine Anweisung lautet, `EA` zu erlauben. Aber man sollte so entwickeln, als würde man ein alleinstehendes Element entwickeln, ein Attribut nur dann, wenn es ein existierendes DOM-Element erweitert.

    *Warum?*: Es macht Sinn.

    *Warum?*: Auch wenn wir es zulassen können, eine Direktive als Klasse zu verwenden: Wenn die Direktive tatsächlich wie ein Element agiert, macht es mehr Sinn, diese auch als Element zu entwickeln - oder gegebenenfalls als Attribut.

    Anmerkung: EA ist der Standard für Angular 1.3 +

  ```html
  <!-- zu vermeiden -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* zu vermeiden */
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
  <!-- empfohlen -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* empfohlen */
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

### Direktiven und ControllerAs
###### [Style [Y075](#style-y075)]

  - Benutzen Sie die `controller as`-Syntax bei einer Direktive, um `controller as` stimmig mit einer View-Controller-Zuweisung einsetzen zu können.

    *Warum?*: Es macht Sinn und ist nicht schwer.

    Anmerkung: Die folgende Direktive demonstriert einige Arten, in denen man "scope" innerhalb von "link"-Direktiven-Controllern einsetzt, die "controllerAs" nutzen. Ich habe das Template eingebunden, nur um alles an einem Platz zu haben.

    Anmerkung: Bezüglich Dependency Injection, schauen Sie sich bitte [Manually Identify Dependencies](#manual-annotating-for-dependency-injection) an.

    Anmerkung: Berücksichtigen Sie, dass sich der Controller einer Direktive außerhalb der "Closure" der Direktive befindet. Diese Richtlinie verhindert Probleme, bei denen die eingefügten Abhängigkeiten als nicht erreichbarer Code nach einem `return` generiert werden.

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
          controllerAs: 'vm',
          bindToController: true // because the scope is isolated
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
      // $scope wird nur zum Vergleich eingefügt (injiziert)
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

    Bemerkung Note: Sie können auch den Controller benennen, wenn Sie ihn in die link-Funktion einfügen und Attribute der Direktive als Properties des Controllers nutzen.

  ```javascript
  // Alternative zum obigen Beispiel
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```

###### [Style [Y076](#style-y076)]

  - Benutzen Sie `bindToController = true` wenn Sie die `controller as`-Syntax mit einer Direktive nutzen wollen und Sie das äußere Scope an das Scope des Controllers der Direktive binden wollen.

    *Warum?*: Es erleichtert die Bindung des äußeren Scope an das Scope des Controllers der Direktive.

    Anmerkung: `bindToController` wurde mit Angular 1.3.0 eingeführt.

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

**[Zurück zum Anfang](#table-of-contents)**

## Promises für einen Controller auflösen
### Promises beim Aktivieren eines Controllers
###### [Style [Y080](#style-y080)]

  - Verlagern Sie die Start-Logik eines Controllers in eine `activate`-Funktion.

    *Warum?*: Ist die Start-Logik an einem einheitlichen Platz innerhalb des Controllers, wird ihr Auffinden vereinfacht, sie ist besser zu testen und diese Methode hilft dabei, zu verhindern, dass die Startlogik überall im Controller verteilt ist.

    *Warum?*: Das `activate` ist eine komfortable Art und Weise, diese Logik für einen Refresh des Controllers / der View zu nutzen. Es hält die Logik zusammen, liefert den View schneller an den Benutzer, erleichtert Animationen mit `ng-view` oder `ui-view`, und macht auch einen flotteren Eindruck beim Benutzer.

    Anmerkung: Wenn Sie die Routennavigation bedingt abbrechen müssen, bevor der Controller gestartet wird, dann sollten Sie stattdessen ein [route resolve](#style-y081) nutzen.

  ```javascript
  /* zu vermeiden */
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
  /* empfohlen */
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

### Promises für Routen auflösen
###### [Style [Y081](#style-y081)]

  - Ist ein Controller abhängig von der Auflösung eines Promise, der vor der Aktivierung des Controllers aufgelöst sein muss, dann muss diese Abhängigkeit im `$routeProvider` aufgelöst werden, und zwar bevor die Controller-Logik ausgeführt wird. Wenn Sie eine Routen-Navigation bedingt abbrechen müssen, bevor der Controller aktiviert ist, nutzen Sie einen Route-Resolver.

  - Nutzen Sie ein "route resolve" wenn Sie bestimmen wollen, ob eine Routennavigation abgebrochen werden soll, bevor der View eingeblendet wird.

    *Warum?*: Es kann sein, dass ein Controller Daten benötigt, noch bevor er geladen wird. Diese Daten können von einem Promise aus einer Factory oder über [$http](https://docs.angularjs.org/api/ng/service/$http) kommen. Ein ["route resolve"](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) zu benutzen, ermöglicht, dass der Promise aufgelöst wird, bevor die Controller-Logik ausgeführt wird. Also kann es notwendig werden, eine Aktion aufgrund der Daten aus dem Promis auszuführen.

    *Warum?*: Der Code wird nach den Routennavigation innerhalb der activate-Funktion des Controllers ausgeführt. Der View wird ebenso geladen. Die Datenbindung steht, wenn der aktive Promise aufgelöst ist. Eine "Busy-Animation" kann während der Einblendung des views (via `ng-view` oder `ui-view`) angezeigt werden.

    Anmerkung: Der Code wird vor der Routennavigation über einen Promise ausgeführt. Wird der Promise zurückgewiesen, wird die Navigation abgebrochen. Resolve bewirkt, dass die neue View auf die Auflösung der Route wartet. Ein "Busy-Indikator" kann vor dem Auflösen und während der Einblendung des Views angezeigt werden. Wenn Sie den View schneller einblenden wollen und keinen Kontrollpunkt benötigen, an dem geprüft wird, ob der View überhaupt zur Verfügung steht, sollten Sie die [Controller `activate` Technik](#style-y080) in Betracht ziehen.

  ```javascript
  /* zu vermeiden */
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
  /* besser */

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

    Anmerkung: Das untenstehende Beispiel zeigt die Stellen, an denen die Route mit einer benannten Funktion aufgelöst wird. Das ist einfacher zu debuggen und vereinfacht auch die Handhabung von Dependency Injection.

  ```javascript
  /* noch besser */

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
    Anmerkung: Die Abhängigkeit von `movieService` im Code ist bei einer Minifizierung nicht sicher. Um Details zu sehen, wie dieser Code für eine sichere Minifizierung vorbereitet wird, schauen Sie sich den Abschnitt über [Dependency Injection](#manual-annotating-for-dependency-injection) und über [Minifizierung und Code-Anmerkungen](#minification-and-annotation) an.

**[Zurück zum Anfang](#table-of-contents)**

## Manuelle Code-Anmerkungen für das Einfügen von Abhängigkeiten (Dependency Injection)

### Unsichere Minifizierung
###### [Style [Y090](#style-y090)]

  - Vermeiden Sie es, die kurze Deklarationssyntax für Abhängigkeiten ohne einen für die Minifizierung sicheren Ansatz zu verwenden.

    *Warum?*: Die Parameter der Komponente (z. B. Controller, Factory, etc.) werden in abgekürzte Variablen gewandelt. So kann zum Beispiel aus `common` und `dataservice` ein `a` oder `b` werden, was von Angular nicht gefunden wird.

    ```javascript
    /* zu vermeiden - nicht sicher bei Minifizierung */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Dieser Code wird abgekürzte Variablen ergeben, wenn er minifiziert wird und deshalb Laufzeitfehler verursachen.

    ```javascript
    /* zu vermeiden - nicht sicher bei Minifizierung */
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Abhängigkeiten manuell identifizieren
###### [Style [Y091](#style-y091)]

  - Benutzen Sie `$inject` um Ihre Abhängigkeiten für Angular-Komponenten manuell zu identifizieren.

    *Warum?*: Dieses Verfahren spiegelt die Technik wieder, die von [`ng-annotate`](https://github.com/olov/ng-annotate) genutzt wird, welche ich für die Automatisierung der Erstellung von minifikationssicheren Abhängigkeiten empfehlen. Wenn `ng-annotate` erkennt, dass eine solche Deklaration vorgenommen wurde, wird diese nicht dupliziert.

    *Warum?*: Dies bewahrt Ihre Abhängigkeiten vor Problemen bei einer Minifizierung, bei der die Parameter abgekürzt werden. Zum Beispiel wird aus `common` und `dataservice` ein `a` oder `b`, was von Angular nicht gefunden wird.

    *Warum?*: Vermeiden Sie Abhängigkeiten direkt im Code in Form von langen Listen, da diese in Form eines Arrays schwer zu lesen sind. Dies kann auch zu Verwirrungen führen, weil dieses Array eine Liste von Strings ist, das letzte Element aber die Funktion der Komponente.

    ```javascript
    /* zu vermeiden */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* zu vermeiden */
    angular
      .module('app')
      .controller('Dashboard',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* empfohlen */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Anmerkung: Wenn sich Ihre Funktion unterhalb eines returns befindet, kann `$inject` unerreichbar werden (das kann in einer Direktive passieren). Sie können dies vermeiden, indem Sie den Controller aus der Direktive herauslösen.

    ```javascript
    /* zu vermeiden */
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
    /* empfohlen */
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

### Route Resolver Abhängigkeiten manuell identifizieren
###### [Style [Y092](#style-y092)]

  - Benutzen Sie `$inject` um die Abhängigkeiten in Ihrem Route Resolver für Angular-Komponenten zu identifizieren.

    *Warum?*: Diese Technik löst eine anonyme Funktion aus dem Route Resolver heraus und macht sie lesbarer.

    *Warum?*: Eine `$inject`-Anweisung kann einfach einem Resolver vorangestellt werden, um Abhängigkeiten bei Minifizierung sicher zu machen.

    ```javascript
    /* empfohlen */
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

**[Zurück zum Anfang](#table-of-contents)**

## Minifizierung und Code-Anmerkungen

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Benutzen Sie [ng-annotate](//github.com/olov/ng-annotate) für [Gulp](http://gulpjs.com) oder [Grunt](http://gruntjs.com) und versehen Sie die Funktionen mit den notwendigen `/** @ngInject */`-Kommentaren, die für die "automatische" Dependency Injection genutzt werden sollen.

    *Warum?*: Dies schützt Ihren Code vor Abhängigkeiten, die keiner minifizierungssicheren Technik entsprechen.

    *Warum?*: [`ng-min`](https://github.com/btford/ngmin) wird nicht mehr unterstützt.

    >Ich bevorzuge Gulp, weil es gefühlt einfacher zu schreiben, zu lesen und zu debuggen ist.

    Der folgende Code nutzt keine minifizierungssicheren Abhängigkeiten.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }
    ```

    Wird der obenstehende Code durch ng-annotate geschickt, wird folgende Ausgabe mit der `$inject`-Anmerkung erstellt und der Code wird minifizerungssicher.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storageService', 'avengerService'];
    ```

    Anmerkung: Entdeckt `ng-annotate` bereits vorhandene Kommentare (z. B. bei erkanntem `@ngInject`), werden die `$inject`-Befehle nicht dupliziert.

    Anmerkung: Wenn Sie einen Route Resolver nutzen, können Sie die Funktion des Resolvers mit `/* @ngInject */` markieren, und es wird eine korrekte Code-Anmerkung erstellt, die alle eingefügten Abhängigkeiten minifizierungssicher hält.

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

    > Anmerkung: Ab der 1.3er Version von Angular können Sie den `ngStrictDi` Parameter der [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp)-Direktive nutzen, um potentiell minfizierungsunsichere Abhängigkeiten aufzuspüren. Wurde eine solche Abhängigkeit entdeckt, dann wird der Injector im "strict-di"-Modus erstellt und verursacht Fehler beim Ausführen von Funktionen, die keine explizite Code-Anmerkung besitzen (was nicht minifizerungssicher ist). Debug-Informationen werden in der Konsole ausgegeben, um den betreffenden Code nachvollziehen zu können. Ich bevorzuge die Nutzung von `ng-strict-di` für das Debugging.
    `<body ng-app="APP" ng-strict-di>`

### Gulp oder Grunt für ng-annotate nutzen
###### [Style [Y101](#style-y101)]

  - Benutzen Sie [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) oder [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in einer automatisierten Build-Task. Fügen Sie `/* @ngInject */` vor jeder Funktion ein, die Abhängigkeiten hat.

    *Warum?*: ng-annotate erkennt die meisten Abhängigkeiten automatisch, benötigt manchmal aber Hinweise durch die `/* @ngInject */`-Syntax.

    Der folgende Code ist ein Beispiel für die Nutzung von ngAnnotage in einer Gulp-Task.

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;

        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Code-Anmerkung vor dem "Uglifying" einfügen, damit der Code korrekt minifiziert wird.
            .pipe(ngAnnotate({
                // "true" hilft dort eine Anmerkung einzufügen, wo @ngInject nicht genutzt wird. Die Notwendigkeit wird aus dem Code-Kontext geschlossen.
                // Funktioniert nicht bei "resolve", muss für diesen Fall also explizit gesetzt werden.
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[Zurück zum Anfang](#table-of-contents)**

## Fehlerbehandlung

### Decorator
###### [Style [Y110](#style-y110)]

  - Benutzen Sie einen [Decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator) während der Konfiguration, indem Sie den [`$provide`](https://docs.angularjs.org/api/auto/service/$provide)-Service im [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler)-Service ansprechen, um eigene Aktionen bei einem auftauchenden Fehler (einer Ausnahme) auszuführen.

    *Warum?*: Dies bietet einen stimmigen Weg, unbehandelte Angular-Fehler während der Entwicklung oder zur Laufzeit abzufangen.

    Anmerkung: Eine weitere Option neben der Benutzung eines Decorators, stellt das Überschreiben des Service dar. Diese Möglichkeit ist gut, wenn Sie aber das Standardverhalten beibehalten wollen, dann ist die Erweiterung mit einem Decorator angebracht.

    ```javascript
    /* empfohlen */
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
             * Der Fehler könnte zu einer Liste im Service oder
             * zum $rootScope hinzugefügt werden oder bei einem
             * Remote-Webserver oder lokal protokolliert oder
             * einfach wieder hart "geworfen" werden. Es obliegt
             * ganz Ihnen.
             *
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Komponente zum Abfangen von Fehlern (Ausnahmen)
###### [Style [Y111](#style-y111)]

  - Erstellen Sie eine Factory, die ein Inferface bereitstellt, mit dem Sie Fehler elegant abfangen und behandeln.

    *Warum?*: Dies bietet eine konsistente Methode, Fehler abzufangen, die in Ihrem Code geworfen werden (z. B. während eines XHR-Aufrufs oder bei Fehlern in einem Promise).

    Anmerkung: Eine Komponente, die die Fehler abfängt stellt eine gute Möglichkeit dar, Fehler an den Stellen abzufangen, von denen Sie wissen, dass sie auftreten können. Zum Beispiel, wenn Sie Daten über einen XHR-Aufruf von einem Webservice anfragen und Sie jegliche Art von Fehler, die von diesem Service zurückkommen, speziell behandeln wollen.

    ```javascript
    /* empfohlen */
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

### Routenfehler
###### [Style [Y112](#style-y112)]

  - Behandeln und protokollieren Sie alle Routingfehler mit [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Warum?*: Bietet einen stimmigen Weg, um alle Routingfehler zu behandeln.

    *Warum?*: Bietet potentiell die Möglichkeit die Akzeptanz beim Benutzer zu steigern, wenn ein Routingfehler auftritt und dieser auf informative Weise mit Möglichkeiten zur Behebung am Bildschirm angezeigt wird.

    ```javascript
    /* empfohlen */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Abbruch des Routings:
         * Gehe bei einem Routingfehler zurück zum Dashboard.
         * Biete eine Möglichkeit wieder auszusteigen, wenn dies
         * zweimal versucht wird.
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
                 * Optionales protokollieren über einen Logging-Service oder $log.
                 * (Der Logging-Service muss als Abhängigkeit eingefügt werden.)
                 */
                logger.warning(msg, [current]);

                /**
                 * Gehe bei einem Routingfehler zu einer anderen Route oder anderem Status.
                 */
                $location.path('/');

            }
        );
    }
    ```

**[Zurück zum Anfang](#table-of-contents)**

## Namensgebung

### Richtlinien der Namensgebung
###### [Style [Y120](#style-y120)]

  - Benutzen Sie stimmige Namen für alle Komponenten, einem Muster folgend, welches die Hauptfunktionen (Features) einer Komponente und dann (optional) ihren Typ beschreibt.
  Meine empfohlenes Muster ist `feature.typ.js`. Es gibt zwei zu vergebene Namen für die meisten Komponenten:
    * der Dateiname (`avengers.controller.js`)
    * der Name der bei Angular zu registrierenden Komponente (`AvengersController`)

    *Warum?*: Richtlinien der Namensgebung bieten einen stimmigen Weg, Inhalte auf einen Blick zu finden. Dabei ist die Stimmigkeit dieser Namensgebung innerhalb des Projekts auschlaggebend. Die Stimmigkeit innerhalb des Teams ist wichtig. Die Stimmigkeit innerhalb einer Firma bedeutet enorme Effizienz.

    *Warum?*: Die Konventionen der Namensgebung sollen helfen, Ihren Code schneller wiederzufinden und einfacher zu verstehen.

### Dateinamen von Features (Komponenten)
###### [Style [Y121](#style-y121)]

  - Benutzen Sie stimmige Namen für alle Komponenten, die einem Muster folgen: Hauptfunktion einer Komponente, und dann (optional) gefolgt vom Typ. Mein empfohlenes Muster ist `feature.typ.js`.

    *Warum?*: Bietet einen stimmigen Weg, Komponenten schnell zu identifizieren.

    *Warum?*: Bietet ein Suchmuster für alle automatisierten Aufgaben.

    ```javascript
    /**
     * allgemeine Optionen
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
     * empfohlen
     */

    // Controller
    avengers.controller.js
    avengers.controller.spec.js

    // Services / Factories
    logger.service.js
    logger.service.spec.js

    // Konstanten
    constants.js

    // Moduldefinitionen
    avengers.module.js

    // Routen
    avengers.routes.js
    avengers.routes.spec.js

    // Konfiguration
    avengers.config.js

    // Direktiven
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

  Anmerkung: Eine weitere allgemeine Konvention ist die Benennung einer Controller-Datei ohne das Wort `controller`, wie `avengers.js` anstelle von `avengers.controller.js`. Bei allen anderen Konventionen bleibt aber der Typ-Suffix. Da die Controller das Gros der Komponenten ausmacht, spart dies Tipparbeit und sie sind trotzdem einfach zu identifizieren. Ich empfehle Ihnen, dass Sie eine Konvention für sich auswählen, und diese im Team strikt anwenden. Ich bevorzuge `avengers.controller.js`.

    ```javascript
    /**
     * empfohlen
     */
    // Controller
    avengers.js
    avengers.spec.js
    ```

### Name von Dateien für Tests
###### [Style [Y122](#style-y122)]

  - Benennen Sie Testspezifikationen gemäß der Komponente, die getestet werden soll, gefolgt vom Suffix `spec`.

    *Warum?*: Bietet einen stimmigen Weg, Komponenten schnell zu identifizieren.

    *Warum?*: Bietet ein Suchmuster für [karma](http://karma-runner.github.io/) oder andere Testrunner.

    ```javascript
    /**
     * empfohlen
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Namen für Controller
###### [Style [Y123](#style-y123)]

  - Nutzen Sie stimmige Namen für alle Controller und benennen Sie diese nach ihrem Hauptmerkmal. Benutzen Sie UpperCamelCase für Controller, weil sie Konstruktoren sind.

    *Warum?*: Bietet einen stimmigen Weg, Controller schnell zu identifizieren und zu referenzieren.

    *Warum?*: UpperCamelCase ist eine Konvention, ein Objekt zu identifizieren, welches über einen Konstruktor instanziiert werden kann.

    ```javascript
    /**
     * empfohlen
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController() { }
    ```

### Namens-Suffix für Controller
###### [Style [Y124](#style-y124)]

  - Hängen Sie an einen Controllernamen den Suffix `Controller`.

    *Warum?*: Der `Controller`-Suffix ist üblich und explizit.

    ```javascript
    /**
     * empfohlen
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Namen für Factories
###### [Style [Y125](#style-y125)]

  - Nutzen Sie stimmige Namen für alle Factories und vergeben Sie diese nach deren Hauptfunktion. Benutzen Sie Camel-Casing für Services und Factories. Vermeiden Sie es, einer Factory oder einem Service ein `$` voranzustellen.

    *Warum?*: Bietet einen stimmigen Weg, Factories schnell zu identifizieren und zu referenzieren.

    *Warum?*: Verhindert Namenskollisionen mit eingebauten Factories und Serivces, die `$` als Präfix nutzen.

    ```javascript
    /**
     * empfohlen
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

### Namen für Direktiven
###### [Style [Y126](#style-y126)]

  - Benutzen Sie stimmige Namen für alle Direktiven gemäß der Camel-Case-Regel. Nutzen Sie einen kurzen Präfix, um den Bereich zu beschreiben, zu dem die Direktive gehört (Firmen- oder Projekt-Präfix).

    *Warum?*: Bietet einen stimmigen Weg, Direktiven schnell zu identifizieren und zu referenzieren.

    ```javascript
    /**
     * empfohlen
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Module
###### [Style [Y127](#style-y127)]

  - Beim Vorhandensein von mehreren Modulen, wird die Datei des Hauptmoduls `app.module.js` genannt, während Andere oder Module in Abhängigkeit nach dem benannt werden, was sie repräsentieren. Ein Admin-Modul wird zum Beispiel `admin.module.js` genannt. Die zugehörigen Namen für die Registrierung dieser Module wären `app` und `admin`.

    *Warum?*: Bietet Stimmigkeit bei Anwendungen mit mehreren Modulen und beim Erweitern zu einer größeren Anwendungen.

    *Warum?*: Bietet einen einfachen Weg, bei einer Automatisierung von Aufgaben, alle Moduldefinitionen zuerst zu laden, und dann erst die anderen Angular-Dateien (z. B. zum Packen (Bundling)).

### Konfiguration
###### [Style [Y128](#style-y128)]

  - Trennen Sie die Konfiguration vom Modul und lagern Sie diese in eine eigene Datei aus, die nach dem Modul benannt wird. Eine Konfigurationsdatei für das Hauptmodul `app` wird `app.config.js` genannt (oder einfach `config.js`). Eine Konfigurationsdatei für ein Modul namens `admin.module.js` wird `admin.config.js` genannt.

    *Warum?*: Trennt Konfiguration von der Moduldefinition, den Komponenten und dem "aktiven" Code.

    *Warum?*: Bietet einen leicht zu identifizierenden Platz, um die Konfiguration eines Moduls vorzunehmen.

### Routen
###### [Style [Y129](#style-y129)]

  - Verlagern Sie die Routenkonfiguration in eine separate Datei. Ein Beispiel könnte `app.route.js` für das Hauptmodul und `admin.route.js` für das `admin`-Modul sein. Auch in kleineren Anwendungen bevorzuge ich diese Trennung vom Rest der Konfiguration.

**[Zurück zum Anfang](#table-of-contents)**

## Anwendungsstruktur: Das LIFT-Prinzip
### LIFT
###### [Style [Y140](#style-y140)]

  - LIFT steht für `L`ocate (auffinden), `I`dentify (identifizieren), `F`lat (flach), T`ry to stay DRY` (versuchen Sie, Ihren Code nicht zu wiederholen). Das bedeutet also, Sie sollten Ihre Anwendung so strukturieren, dass Sie Ihren Code schnell auffinden und auf einen Blick identifizieren können, für was der Code gut ist. Dabei sollten Sie die Struktur so flach wie möglich halten. Vermeiden Sie es unbedingt, Ihren Code zu wiederholen.

    *Warum LIFT?*: Bietet eine konsistente und gut skalierbare Struktur, ist modular und macht es einfacher die Effizienz eines Entwicklers zu steigern, weil er seinen Code schneller finden kann. Prüfen Sie Ihre Anwendungsstruktur, indem Sie sich fragen: Wie schnell kann ich all die Dateien, die zu einem Feature gehören öffnen und mit ihnen arbeiten?"

    Falls ich mich mit meiner nicht mehr wohl fühle, dann schaue ich mir die LIFT-Anweisungen an:

    1. `L`ocating - Finde Deinen Code auf einfache und schnelle Art
    2. `I`dentify - Identifiziere Deinen Code auf einen Blick
    3. `F`lat - Halte die Struktur so flach wie möglich, solange es geht
    4. `T`ry to stay DRY (Don’t Repeat Yourself) - Versuche Deinen Code nicht zu wiederholen

### Locate (Code auffinden)
###### [Style [Y141](#style-y141)]

  - Gestalten Sie das Auffinden Ihres Codes intuitiv, einfach und schnell.

    *Warum?*: Ich finde diesen Punkt sehr wichtig für ein Projekt. Wenn ein Team die Dateien, an denen es dringend arbeiten muss, nicht ebenso schnell findet, kann es nicht effizient genug arbeiten. Die Struktur muss geändert werden. Zusammengehörende Dateien an der intuitivsten Stelle nahe beieinander zu platzieren, spart Ihnen einen Haufen Zeit. Eine beschreibende Struktur kann dabei helfen.

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

### Identify (Code identifizieren)
###### [Style [Y142](#style-y142)]

  - Wenn Sie einen Dateinamen sehen, sollten Sie sofort wissen, was die Datei beinhaltet und für was sie steht.

    *Warum?*: Sie brauchen weniger Zeit, um nach Ihrem Code zu suchen und werden so effizienter. Wenn das bedeutet, dass Sie längere Dateinamen brauchen, dann sei es so. Seien Sie beschreibend bei der Namensvergabe und sorgen Sie dafür, dass eine Datei nur eine Komponente enthält. Vermeiden Sie Dateien mir mehreren Controllern, Services oder gar mit beidem. Ich weiche von dieser Regel ab, wenn ich sehr kleine Features habe, die alle miteinander verbunden und leicht identifizierbar sind.

### Flat (flache Struktur)
###### [Style [Y143](#style-y143)]

  - Halten Sie die Verzeichnisstruktur so lange es geht so flach wie möglich. Sollten mehr als sieben Dateien in einem Verzeichnis stehen, denken Sie über eine Neuaufteilung nach.

    *Warum?*: Niemand will Dateien in einer Verzeichnisstruktur über sieben Ebenen suchen. Denken Sie an Menüs von Webseiten ... Alles, was über mehr als zwei Ebenen geht, sollte ernsthaft überdacht werden. Für eine Verzeichnisstruktur gibt es keine feste Regelung, aber sollte ein Verzeichnis sieben bis zehn Dateien enthalten, dann ist es vielleicht an der Zeit, Unterverzeichnisse einzurichten. Machen Sie es für sich selbst an Ihrem Wohlbefinden mit der Struktur fest. Benutzen Sie eine flachere Struktur, bis Sie den Punkt erreichen, an dem es Sinn macht, ein neues Verzeichnis zu erstellen.

### T-DRY (Versuchen Sie Ihren Code nicht zu wiederholen)
###### [Style [Y144](#style-y144)]

  - Seien Sie "DRY": Versuchen Sie Ihren Code nicht zu wiederholen. Aber übertreiben Sie es nicht, indem Sie die Lesbarkeit Ihres Codes dafür opfern.

    *Warum?*: Sich nicht ständig zu wiederholen ist wichtig, aber nicht entscheidend, wenn Sie dafür andere Punkte von LIFT opfern. Ich möchte für eine View nicht session-view.html tippen, da es ja öffentlich eine View ist. Wenn etwas nicht offensichtlich oder einer Konvention unterliegt, dann benenne ich es.

**[Zurück zum Anfang](#table-of-contents)**

## Anwendungsstruktur

### Allgemeine Richtlinien
###### [Style [Y150](#style-y150)]

  - Sie sollten eine kurzfristige und langfristige Sicht auf Ihre Implementierung haben. Das bedeutet: Fangen Sie klein an, behalten Sie dabei aber im Auge, wohin Sie mir Ihrer Anwendung wollen. Jeder Code der Anwendung wird in einem Stammverzeichnis namens `app` abgelegt. Für den Inhalt gilt: Ein Feature pro Datei. Jeder Controller, Service, jedes Modul, jede View befindet sich in ihrer/seiner eigenen Datei. Alle externen Scripts (3rd Party Bibliotheken) werden in einem anderen Stammverzeichnis, nicht aber im `app`-Verzeichnis abgelegt. Ich habe sie nicht geschrieben und ich möchte nicht, dass sie meine Anwendung durcheinander bringen.(`bower_components`, `scripts`, `lib`).

    Anmerkung: Sie finden mehr Details und Gründe für diese Struktur in [diesem Originalbeitrag zur Anwendungsstruktur](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Platzieren Sie Komponenten, die das allgemeingültige Layout der Anwendung ausmachen, in einem Verzeichnis namens `layout`. Dieses sollte eine Shell-View mit Controller enthalten. Der View agiert als Container für die Anwendung und enthält die Anwendung an sich: Navigation, Menüs, Bereiche für die Inhalte und andere Bereiche.

    *Warum?*: Organisieren Sie das Layout an einem einzigen Ort, damit es innerhalb der Anwendung von überall her genutzt werden kann.

### Verzeichnisse nach Hauptmerkmalen
###### [Style [Y152](#style-y152)]

  - Erstellen Sie Verzeichnisse gemäß der Hauptmerkmale, die sie darstellen. Wenn der Inhalt eines Verzeichnisses wächst und mehr als sieben Dateien fasst, sollten Sie darüber nachdenken, ein neues Verzeichnis zu erstellen. Dabei ist der Grenzwert aber individuell.

    *Warum?*: En Entwickler kann den gesuchten Code schnell auffinden, auf einen Blick identifizieren für was jede Datei steht, die Struktur ist so flach wie möglich und es gibt keine redundanten Namen.

    *Warum?*: Die LIFT-Richtlinien sind alle erfüllt.

    *Warum?*: Hilft zu verhindern, dass die Anwendung durcheinander gerät, weil der Inhalt nach den LIFT-Richtlinien organisiert ist.

    *Warum?*: Gibt es viele Dateien (mehr als zehn), ist es einfach, sie in einer konsistenten Verzeichnisstruktur zu finden, als in einer flachen Struktur.

    ```javascript
    /**
     * empfohlen
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

      ![Sample App Structure](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-2.png)

      Anmerkung: Strukturieren Sie Ihre Verzeichnisse nicht nach Typ. Das hat zur Folge, dass Sie sich in vielen Verzeichnissen bewegen müssen, um ein einziges Feature bearbeiten zu wollen. Vergrößert sich die Anwendung auf fünf, zehn oder gar mehr als 25 Views und Controller (und andere Features), wird es sehr schnell unhandlich, im Gegensatz zur Organisation der Verzeichnisse nach Features.

    ```javascript
    /*
    * zu vermeiden
    * Verzeichnisse-Nach-Typ-Alternativefolders-by-type.
    * Ich empfehle stattdessen "Verzeichnisse-Nach-Feature".
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

**[Zurück zum Anfang](#table-of-contents)**

## Modularität

### Viele kleine, eigenständige Module
###### [Style [Y160](#style-y160)]

  - Erstellen Sie kleine Module, die für eine einzige Aufgabe zuständig sind und diese in sich kapseln.

    *Warum?*: Modulare Anwendungen machen es möglich, dass Funktionsmerkmale (Features) einfach eingeklinkt werden können. Somit kann ein Entwicklungsteam vertikale Stücke einer Applikation sukzessive ausrollen. Das bedeutet, dass neue Funktionsmerkmale nach ihrer Entwicklung einfach eingeklinkt werden können.

### Erstellen Sie ein Modul für die Hauptanwendung (App-Modul)
###### [Style [Y161](#style-y161)]

  - Erstellen Sie ein Hauptmodul für die Anwendung, dessen Rolle es ist, alle Module und Funktionen der Anwendung zusammenzutragen. Nennen Sie das Modul nach Ihrer Anwendung.

    *Warum?*: Angular begünstigt Modularität und Muster für die Aufteilung von Code. Ein Hauptmodul für eine Anwendung zu erstellen, die andere Module zusammenzieht, ist ein einfacher Weg, um Module in eine Anwendung einzuklinken oder aus ihr auszuklinken.

### Halten Sie das App-Modul klein
###### [Style [Y162](#style-y162)]

  - Stellen Sie nur Logik ins App-Modul, die dazu dient, die Anwendungsbestandteile zusammenzuziehen. Features bleiben in ihren eigenen Feature-Modulen.

    *Warum?*: Weitere Logik außerhalb der ursprünglichen Aufgabe ins Hauptmodul einzubinden, wie zum Beispiel Datenabfragen, darstellen von Views, oder eine Logik, die nicht zum Zusammenziehen der Module dient, bringt Verwirrung. Es wird schwierig, diese Features zu verwalten und auch zu testen.

    *Warum?*: Das App-Modul wird zum Manifest, welches die Module aufführt, die die Applikation ausmachen.

### Funktionsbereiche sind Module
###### [Style [Y163](#style-y163)]

  - Erstellen Sie Module, die Funktionsbereiche darstellen, wie zum Beispiel das Layout, wiederverwendbare und allgemein verfügbare Services, Dashboards, und anwendungsspezifische Funktionsmerkmale (z. B. Kunden, Admin, Verkauf).

    *Warum?*: Eigenständige Module können reibungslos zur Anwendung hinzugefügt werden.

    *Warum?*: Sprints oder Iterationen können sich auf Funktionsbereiche beziehen. Diese können am Ende eines Sprints oder einer Iteration eingebunden werden.

    *Warum?*: Die Trennung von Funktionsbereichen in Module erleichtert das isolierte Testen der Module und deren Wiederverwendung.

### Wiederverwendbare Bausteine sind Module
###### [Style [Y164](#style-y164)]

  - Erstellen sie Module, die wiederverwendbare Applikationsbausteine für allgemeingültige Services, wie Fehlerbehandlung, Logging, Diagnostik, Sicherheit und lokale Datenablage, darstellen.

    *Warum?*: Diese Arten von Funktionen werden in vielen Anwendungen benötigt. Also können Sie durch die Trennung in ihre jeweiligen Module und aufgrund ihrer generischen Natur, von anderen Anwendungen verwendet werden.

### Modulabhängigkeiten
###### [Style [Y165](#style-y165)]

  - Das Hauptmodul einer Applikation ist abhängig von den applikationsspezifischen Funktionsmodulen und den allgemeingültigen oder wiederverwendbaren Modulen.

    ![Modularität und Abhängigkeiten](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-1.png)

    *Warum?*: Das Hauptmodul der Applikation enthält ein schnell ersichtliches Manifest der Anwendungsfunktionen.

    *Warum?*: Jeder Funktionsbereich enthält ein Manifest, aus dem ersichtlich wird, von was er abhängig ist. Der Inhalt dieses Manifests kann also als Abhängigkeit in andere Anwendungen eingebunden werden, wo er dann auch funktioniert.

    *Warum?*: Interne Anwendungsfunktionen wie allgemeingültige Datenservices werden einfach aufgefunden und innerhalb von `app.core` (wählen Sie ihren Lieblingsnamen für diese Modul) genutzt.

    Anmerkung: Dies ist eine Strategie, die die Konsistenz innerhalb einer Anwendung begünstigt. Es gibt hierzu viele gute Möglichkeiten. Wählen Sie eine für sich aus, die stimmig ist, den Regeln von Angular in Puncto Abhängigkeiten folgt und einfach zu verwalten und zu skalieren ist.

    > Meine Strukturen unterscheiden sich von Projekt zu Projekt, aber sie folgen allesamt diesen Richtlinien zur Struktur und Modularität. Auch die Implementierung kann sich in Abhängigkeit der benötigten Funktionen und dem Team unterscheiden. Mit anderen Worten: Bestehen Sie nicht auf die exakte Nachbildung der hier vorgestellten Struktur, sondern passen Sie sie Ihren Gegebenheiten an. Behalten Sie dabei Konsistenz, Wartbarkeit und Effizienz im Hinterkopf.

    > In einer kleinen Anwendung können Sie darüber nachdenken, alle allgemeinen Abhängigkeiten im Hauptmodul unterzubringen, in dem die Funktionsmodule dann keine direkten Abhängigkeiten haben. Das erleichtert die Wartung kleinerer Anwendungen, erschwert aber die Wiederverwendbarkeit von Modulen außerhalb der Anwendung.

**[Zurück zum Anfang](#table-of-contents)**

## Startlogik

### Konfiguration
###### [Style [Y170](#style-y170)]

  - Fügen Sie Ihren Code in die [Modulkonfiguration](https://docs.angularjs.org/guide/module#module-loading-dependencies) ein, die vor dem Start der Angular-Anwendung konfiguriert sein muss. Ideale Kandidaten hierfür sind Provider und Konstanten.

    *Warum?*: Es schränkt die Stellen ein, an denen konfiguriert wird.

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

### Run-Block
###### [Style [Y171](#style-y171)]

  - Jeder Code, der laufen muss, wenn eine Anwendung startet, sollte in einer Factory implementiert, über eine Funktion im Zugriff und in den sog. [Run-Block](https://docs.angularjs.org/guide/module#module-loading-dependencies) eingebunden sein.

    *Warum?*: Code, der sich direkt in einem Run-Block befindet, ist schwer testbar. Wird er in eine Factory ausgelagert, ist er besser zu abstrahieren und zu simulieren.

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

**[Zurück zum Anfang](#table-of-contents)**

## Angular $ Wrapper Services

### $document und $window
###### [Style [Y180](#style-y180)]

  - Benutzen Sie [`$document`](https://docs.angularjs.org/api/ng/service/$document) und [`$window`](https://docs.angularjs.org/api/ng/service/$window) anstelle von  `document` und `window`.

    *Warum?*: Diese Services werden von Angular umschlossen und sind somit besser zu testen als wenn document und window in Tests benutzt wird. Dies hilft zu vermeiden, document und windows simulieren zu müssen.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Benutzen Sie [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) und [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) anstelle von `setTimeout` und `setInterval` .

    *Warum?*: Diese Services werden von Angular umschlossen und sind besser zutesten. Sie nutzen Angulars "Digest-Cycle" und halten somit die Datenbindung synchron.

**[Zurück zum Anfang](#table-of-contents)**

## Testen
Unit-Tests tragen dazu bei, sauberen Code zu erhalten. Daher habe ich einige meiner Empfehlungen zu Unit-Test-Grundlagen als Links zur weiteren Information beigefügt.

### Schreiben Sie Tests pro Anforderung
###### [Style [Y190](#style-y190)]

  - Schreiben Sie Ihre Tests für jede Anforderung. Beginnen Sie mit einem leeren Test und füllen Sie diesen, während Sie den Code für die Anforderung schreiben.

    *Warum?*: Testbeschreibungen zu verfassen, hilft dabei festzulegen, was in der Anforderung passiert, was nicht passiert und wie ein Testerfolg gemessen werden kann.

    ```javascript
    it('Soll einen Avengers-Controller enthalten', function() {
        // TODO
    });

    it('Soll einen Avenger enthalten, wenn nach Namen gefiltert wird', function() {
        // TODO
    });

    it('Soll 10 Avengers enthalten', function() {
        // TODO (mock data?)
    });

    it('Soll Avengers über XHR zurückliefern', function() {
        // TODO ($httpBackend?)
    });

    // und so weiter
    ```

### Testbibliotheken
###### [Style [Y191](#style-y191)]

  - Nutzen Sie [Jasmine](http://jasmine.github.io/) oder [Mocha](http://mochajs.org) für Unit-Tests.

    *Warum?*: Die Nutzung von Jasmin und Mocha ist sehr verbreitet in der Angular-Community. Beide sind stabil, gut gepflegt und liefern robuste Testfunktionen.

    Anmerkung: Wenn Sie Mocha nutzen, sollten Sie in Erwägung ziehen, eine sogenannte Assert-Library, wie [Chai](http://chaijs.com) zu nutzen. Ich ziehe dem Mocha vor.

### Testrunner
###### [Style [Y192](#style-y192)]

  - Benutzen Sie [Karma](http://karma-runner.github.io) als Testrunner.

    *Warum?*: Karma lässt sich leicht konfigurieren, um einzeln oder automatisch bei Codeänderungen aufgerufen zu werden.

    *Warum?*: Karma hängt sich leicht von allein in einen CI-Prozess (in Grunt oder Gulb) ein.

    *Warum?*: Verschiedene IDEs wie [WebStorm](http://www.jetbrains.com/webstorm/) und [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225) haben damit begonnen, Karma einzubinden.

    *Warum?*: Karma arbeitet wunderbar mit Task-Managern für Automatisierte Aufgaben wie [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) und [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)) zusammen.

### Simulation durch "Stubbing" und "Spying"
###### [Style [Y193](#style-y193)]

  - Benutzen Sie [Sinon](http://sinonjs.org/) um Komponenten im Rahmen von "Stubbing" und "Spying" (Mocking) zu simulieren.

    *Warum?*: Sinon arbeitet wunderbar mit Jasmine und Mocha zusammen und erweitert deren Fähigkeiten der Simulation von Komponenten.

    *Warum?*: Sinon erleichtert den Wechsel zwischen Jasmine und Mocha, wenn Sie beide ausprobieren möchten.

    *Warum?*: Sinon liefert gut verständliche, beschreibende Meldung, für den Fall, dass ein Test fehlschlägt.

### Browser ohne Userinterface (Headless Browser)
###### [Style [Y194](#style-y194)]

  - Nutzen Sie [PhantomJS](http://phantomjs.org/), um Ihre Browsertests auf einem Server laufen zu lassen.

    *Warum?*: PhantomJS ist ein Browser, der kein Userinterface hat. Dies befähigt Sie, Browsertests ohne "sichtbaren" Browser durchzuführen. Sie müssen weder Chrome, noch Safari oder IE oder andere Browser auf Ihrem Server installieren.

    Anmerkung: Sie sollten trotzdem Tests auf allen Browsern in Ihrer Umgebung für Ihr Zielpublikum durchführen.

### Codeanalyse
###### [Style [Y195](#style-y195)]

  - Lassen Sie JSHint über ihre Tests laufen.

    *Warum?*: Tests sind Code. JSHint prüft die Codequalität und kann Qualitätsprobleme aufdecken, die dazu führen können, dass Tests nicht sauber laufen.

### Erleichternde Rahmenbedingungen fur JSHint und Regeln für Tests
###### [Style [Y196](#style-y196)]

  - Lockern sie die JSHint-Regeln für Ihren Testcode, damit `describe` und `expect` erlaubt werden. Lockern sie die Regeln auch für Ausdrücke, da Mocha diese benutzt.

    *Warum?*: Ihre Tests sind codiert und somit sollten Sie ihnen die gleiche Aufmerksamkeit in Puncto Codequalität widmen, wie Ihrem Produktionscode. Die Lockerung der Regeln für globale Variablen, die von Ihrem Test-Framework genutzt werden, erzielen Sie, wenn sie folgendes in Ihren Testcode einbinden.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    oder Sie fügen folgendes in die Datei mit Ihren JSHint Optionen ein.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/testing-tools.png)

### Tests organisieren
###### [Style [Y197](#style-y197)]

  - Halten Sie Unit-Tests bei Ihrem Client-Programmcode. Die Testspezifikationen für die Server-Integrationstests oder die Tests für mehrere Komponenten platzieren Sie am besten in einem separaten `tests`-Verzeichnis.

    *Warum?*: Unit-Tests stehen in direktem Bezug zu einer spezifischen Komponente und Datei im Quellcode.

    *Warum?*: Es ist einfacher, sie auf dem neuesten Stand zu halten, weil Sie sie immer im Blick haben. Während Sie programmieren (ob Sie jetzt TDD betreiben oder während oder nach der Entwicklung testen), sind die Testspezifikationen weder aus der Sicht noch aus Ihren Gedanken. Deshalb ist es wahrscheinlicher, dass sie auch gepflegt werden, das dazu beiträgt, die Abdeckung des Codes durch Tests zu verbessern.

    *Warum?*: Wenn Sie Code aktualisieren ist es einfacher, auch die Tests im gleichen Zuge zu aktualisieren.

    *Warum?*: Code und Tests nebeneinander zu halten erleichtert es, sie zu finden und beide bei Bedarf zu verschieben.

    *Warum?*: Werden die Testspezifikationen neben dem Code gehalten, wird es einem Leser leichter gemacht zu verstehen, wie die Komponente eingesetzt werden soll und er entdeckt ihre bekannten Einschränkungen.

    *Warum?*: Die Testspezifikationen beim Erstellen eines Installationspakets für die Anwendung vom restlichen Code zu trennen, erledigt man einfach mit grunt oder gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.spec.js
                             /customers.controller-detail.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Zurück zum Anfang](#table-of-contents)**

## Animationen

### Anwendung
###### [Style [Y210](#style-y210)]

  - Benutzen Sie die ["subtle" Animationen von Angular](https://docs.angularjs.org/guide/animations) um zwischen Status, Views oder primären sichtbaren Elementen hin und her zu wechseln. Binden Sie das [ngAnimate-Modul](https://docs.angularjs.org/api/ngAnimate) ein. Die drei Schlüssel hierzu sind "subtle", "smooth", "seamless".

    *Warum?*: Angulars "subtle" Animationen können die User-Experience erhöhen, wenn sie entsprechend eingesetzt werden.

    *Warum?*: Angulars "subtle" Animationen können die wahrgenommene Performance von View-Wechseln verbessern.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Nutzen Sie eine kurze Dauer für Animationen. Ich starte immer bei 300ms und passe diese dann entsprechend an.

    *Warum?*: Lange Animationen können sich negativ auf die wahrgenommene Performance auswirken und einen gegenteiligen Einfluss auf die User Experience haben und die Anwendung langsam aussehen lassen.

### animate.css
###### [Style [Y212](#style-y212)]

  - Benutzen Sie [animate.css](http://daneden.github.io/animate.css/) für konventielle Animationen.

    *Warum?*: Die Animationen von animate.css sind schnell, sanft und einfach zu Ihrer Anwendung hinzuzufügen.

    *Warum?*: Bietet Konsistenz Ihrer Animationen.

    *Warum?*: animate.css ist weit verbreitet und gut getestet.

    Anmerkung: Schauen Sie sich diesen [tollen Beitrag von Matias Niemelä über Angular Animationen](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html) an.

**[Zurück zum Anfang](#table-of-contents)**

## Kommentare

### jsDoc
###### [Style [Y220](#style-y220)]

  - Wenn sie eine Dokumentation planen, dann nutzen Sie die [`jsDoc`](http://usejsdoc.org/)-Syntax, um Funktionsnamen, Beschreibungen, Parameter und Rückgabewerte zu dokumentieren. Benutzen Sie `@namespace` und `@memberOf`, um Ihre Anwendungsstruktur mit abzubilden.

    *Warum?*: Sie können die Dokumentation immer wieder aus ihrem Code generieren, statt sie neu zu schreiben.

    *Warum?*: Bietet die Konsistenz eines Industriewerkzeugs.

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
       * @desc Anwendungsweiter Logger
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
           * @desc Protokolliert Fehler
           * @param {String} Meldung, die protokolliert wird
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

**[Zurück zum Anfang](#table-of-contents)**

## JS Hint

### Nutzen Sie eine Optionsdatei
###### [Style [Y230](#style-y230)]

  - Benutzen Sie JS Hint um Ihren JavaScript-Code zu prüfen (Linting) und versichern Sie sich, dass sie die Prüffunktion für sich angepasst haben und die Optionsdatei in Ihrer Quellcodeverwaltung abgelegt haben. Schauen Sie sich die [JS Hint Dokumentation](http://www.jshint.com/docs/) an, um mehr über die Optionen zu erfahren.

    *Warum?*: Erstattet erste Meldung, bevor Sie den Code in die Quellcodeverwaltung übertragen.

    *Warum?*: Bietet Konsistenz im ganzen Team.

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

**[Zurück zum Anfang](#table-of-contents)**

## JSCS

### Nutzung und Optionsdatei
###### [Style [Y235](#style-y235)]

  - Benutzen Sie JSCS um die Anwendung von Programmier-Richtlinien in Ihrem JavaScript-Code zu prüfen und versichern Sie sich, dass Sie die Prüffunktion für sich angepasst haben und die Optionsdatei in Ihrer Quellcodeverwaltung abgelegt haben. Schauen Sie sich die [JS Hint Dokumentation](http://www.jshint.com/docs/) an, um mehr über die Optionen zu erfahren.

    *Warum?*: Erstattet erste Meldung, bevor Sie den Code in die Quellcodeverwaltung übertragen.

    *Warum?*: Bietet Konsistenz im ganzen Team.

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
        "disallowMultipleLineStrings": null,
        "disallowTrailingComma": null,
        "requireCommaBeforeLineBreak": null,
        "requireDotNotation": null,
        "requireMultipleVarDecl": null,
        "requireParenthesesAroundIIFE": true
    }
    ```

**[Zurück zum Anfang](#table-of-contents)**

## Konstanten

### Globale Drittanbieter-Konstanten
###### [Style [Y240](#style-y240)]

  - Erstellen Sie eine Angular-Konstante für die globalen Variablen aus Bibliotheken von Drittanbietern.

    *Warum?*: Bietet einen Weg, Bibliotheken von Drittanbietern in einem sicheren Umfeld anzubieten, die andererseits "Globals" wären.  Dies verbessert die Testbarkeit, weil Sie so einfacher die Abhängigkeiten Ihres Codes erfahren (verhindert lückenhafte Abstraktionen). Auch die Simulation dieser Abhängigkeiten wird zugelassen, wo sie Sinn macht.

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

  - Benutzen Sie Konstanten für Werte, die sich nicht ändern und nicht aus einem anderen Service kommen. Wenn Konstanten nur für ein bestimmtes Modul gebraucht werden, welches zudem wiederverwendbar sein soll, dann platzieren Sie die Konstanten in einer Datei (pro Modul) und benennen Sie die Datei nach dem Modul. Bis dahin halten Sie die Konstanten im Hauptmodul in einer `constants.js`-Datei.

    *Warum?*: Ein Wert, der sich ändert - wenn auch nur unregelmäßig - sollte von einem Service ermittelt werden, so dass er nicht im Quellcode geändert werden muss. Zum Beispiel könnte eine URL für einen Datenservice in einer Konstanten abgelegt werden. Besser wäre es aber, diesen Wert über einen WebService zu ermitteln.

    *Warum?*: Konstanten können in jede Angular-Komponente (auch in einen Provider) eingefügt werden.

    *Warum?*: Ist eine Anwendung in Module unterteilt, die in anderen Anwendungen genutzt werden können, so sollte jedes alleinstehende Modul für sich selbst funktionieren, eingeschlossen seiner Konstanten.

    ```javascript
    // Konstanten für die gesamte Anwendung
    angular
        .module('app.core')
        .constant('moment', moment);

    // Konstanten, die nur vom Verkaufsmodul genutzt werden
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[Zurück zum Anfang](#table-of-contents)**

## Dateitemplates und Snippets
Nutzen Sie Templates oder Snippets, um stimmigen Richtlinien und Mustern zu folgen. Hier sind Templates oder Snippets für einige Editoren und IDEs zur Webentwicklung.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Angular Snippets, die diesen Mustern und Richtlinien folgen.

    - Laden Sie die [Sublime Angular Snippets](assets/sublime-angular-snippets?raw=true) heruntern
    - Platzieren Sie sie in Ihrem Package-Ordner
    - Starten Sie Sublime neu

  - Schreiben Sie einen dieser Befehle in einer JavaScript-Datei, gefolgt von einem `TAB`:

    ```javascript
    ngcontroller // erstellt einen Angular Controller
    ngdirective  // erstellt eine Angular Direktive
    ngfactory    // erstellt eine Angular Factory
    ngmodule     // erstellt ein Angular Modul
    ngservice    // erstellt einen Angular Service
    ngfilter     // erstellt einen Angular Filter
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - Angular Dateitemplates, die diesen Mustern und Richtlinien folgen, finden Sie unter [SideWaffle](http://www.sidewaffle.com)

    - Laden Sie die [SideWaffle](http://www.sidewaffle.com) Visual Studio Erweiterung (vsix file) herunter
    - Starten Sie die vsix-Datei
    - Starten Sie Visual Studio neu

### WebStorm
###### [Style [Y252](#style-y252)]

  - Angular Dateitemplates, die diesen Mustern und Richtlinien folgen. Sie können sie in Ihre WebStorm-Einstellungen importieren:

    - Laden Sie die [WebStorm Angular Dateitemplates und Snippets](assets/webstorm-angular-file-template.settings.jar?raw=true) herunter
    - Öffnen Sie WebStorm und gehen Sie ins `File`-Menü
    - Wählen Sie die `Import Settings` Menüoption
    - Wählen Sie die Datei aus und klicken Sie `OK`

  - Schreiben Sie einen dieser Befehle in einer JavaScript-Datei, gefolgt von einem `TAB`:

    ```javascript
    ng-c // erstellt einen Angular Controller
    ng-f // erstellt eine Angular Factory
    ng-m // erstellt ein Angular Modul
    ```

### Atom
###### [Style [Y253](#style-y253)]

  - Angular Dateitemplates, die diesen Mustern und Richtlinien folgen
    ```
    apm install angularjs-styleguide-snippets
    ```
    oder
    - Öffnen Sie Atom und öffnen Sie die Paketverwaltung (Packages -> Settings View -> Install Packages/Themes)
    - Suchen Sie nach dem Paket 'angularjs-styleguide-snippets'
    - Klicken Sie `Install`, um das Paket zu installieren

  - Schreiben Sie einen dieser Befehle in einer JavaScript-Datei, gefolgt von einem `TAB`:

    ```javascript
    ngcontroller // erstellt einen Angular Controller
    ngdirective // erstellt eine Angular Direktive
    ngfactory // erstellt eine Angular Factory
    ngmodule // erstellt ein Angular Modul
    ngservice // erstellt einen Angular Service
    ngfilter // erstellt einen Angular Filter
    ```

### Brackets
###### [Style [Y254](#style-y254)]

  - Angular Dateitemplates, die diesen Mustern und Richtlinien folgen
    - Laden Sie die [Brackets Angular snippets](assets/brackets-angular-snippets.yaml?raw=true) herunter
    - Brackets Extension Manager ( File > Extension manager )
    - Installieren Sie die ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets)
    - Klicken Sie die Glühbirne am rechten Rand vom "Gutter" in Brackets
    - Klicken Sie `Settings` und dann `Import`
    - Wählen Sie die Datei und danach `skip` oder `override`
    - Klicken Sie `Start Import`

  - Schreiben Sie einen dieser Befehle in einer JavaScript-Datei, gefolgt von einem `TAB`:

    ```javascript
    // Dies sind vollwertige Dateisnippets mit einer IIFE
    ngcontroller // erstellt einen Angular Controller
    ngdirective  // erstellt eine Angular Direktive
    ngfactory    // erstellt eine Angular Factory
    ngapp        // erstellt einen Angular Modul-Setter
    ngservice    // erstellt einen Angular Service
    ngfilter     // erstellt einen Angular Filter

    // Dies sind Teilsnippets, die zum Verketten gedacht sind:
    ngmodule     // erstellt einen Angular module getter
    ngstate      // erstellt eine Angular UI Router State-Definition
    ngconfig     // definiert eine Funktion für die Konfigurationsphase
    ngrun        // definiert eine Funktion für die Run-Phase
    ngroute      // definiert eine Angular ngRoute 'when'-Definition
    ngtranslate  // nutzt den $translate Service mit seinem Promise
    ```

### vim
###### [Style [Y255](#style-y255)]

  - vim-Snippets die diesen Mustern und Richtlinien folgen.

    - Laden Sie die [vim Angular snippets](assets/vim-angular-snippets?raw=true) herunter
    - Setzen Sie [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)
    - Kopieren Sie die Snippets ins Snippet-Verzeichnis

    ```javascript
    ngcontroller // erstellt einen Angular Controller
    ngdirective  // erstellt eine Angular Direktive
    ngfactory    // erstellt eine Angular Factory
    ngmodule     // erstellt ein Angular Modul
    ngservice    // erstellt einen Angular Service
    ngfilter     // erstellt einen Angular Filter
    ```
**[Zurück zum Anfang](#table-of-contents)**

## Yeoman Generator
###### [Style [Y260](#style-y260)]

Sie können den [HotTowel Yeoman Generator](http://jpapa.me/yohottowel) nutzen, um eine Anwendung als Startpunkt zu erstellen, die diesen Mustern und Richtlinien folgt.

1. Installieren Sie generator-hottowel

  ```
  npm install -g generator-hottowel
  ```

2. Erstellen Sie ein neues Verzeichnis und wechseln sie dort hin

  ```
  mkdir myapp
  cd myapp
  ```

3. Starten die den Generator

  ```
  yo hottowel helloWorld
  ```

**[Zurück zum Anfang](#table-of-contents)**

## Routing
Das Routing auf der Client-Seite ist für die Erstellung eines Navigationsflusses zwischen den Views und den zusammengestellten Views, die aus mehreren kleineren Vorlagen und Direktiven bestehen.

###### [Style [Y270](#style-y270)]

  - Benutzen Sie den [AngularUI Router](http://angular-ui.github.io/ui-router/) für das clientseitige Routing.

    *Warum?*: Der UI Router bietet alle Funktionen des Angular Routers und zusätzlich Weitere, wie geschachtelte Routen und Status.

    *Warum?*: Die Syntax ähnelt der des Angular Routers und ist einfach auf den UI Router umzustellen.

  - Anmerkung: Sie können einen Provider, wie den unten angeführten `routerHelperProvider` nutzen, um die Stati während der Startphase der Anwendung dateiübergreifend zu konfigurieren.

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

  - Definieren Sie die Routen für die Views in den Modulen, in denen sie enthalten sind. Jedes Modul sollte die Routen seiner Views enthalten.

    *Warum?*: Jedes Modul sollte für sich allein lauffähig sein.

    *Warum?*: Wird ein Modul zur Anwendung hinzugefügt oder aus ihr ausgeklinkt, enthält die Anwendung nur Routen, die zu vorhanden Views führen.

    *Warum?*: Dies erleichtert es, Teile eine Anwendung zu aktivieren oder zu deaktivieren, ohne dass man sich um verwaiste Routen Sorgen machen muss.

**[Zurück zum Anfang](#table-of-contents)**

## Automatisierung von Aufgaben
Nutzen Sie [Gulp](http://gulpjs.com) oder [Grunt](http://gruntjs.com), um Aufgaben zu automatisieren. Bei Gulp geht der Code vor Konfiguration, bei Grund Konfiguration vor Code. Ich persönlich bevorzuge Gulp, weil ich denke, es ist einfacher zu lesen und zu schreiben, aber beide sind erstklassig.

> Erfahren Sie mehr über Gulp und Muster für die Automatisierung von Aufgaben in meinem [Gulp Pluralsight Kurs](http://jpapa.me/gulpps)

###### [Style [Y400](#style-y400)]

  - Nutzen Sie die Automatisierung von Aufgaben, um die Moduldefinitionsdateien `*.module.js` vor allen anderen JavaScript-Dateien in der Anwendung aufzulisten.

    *Warum?*: Angular muss die Moduldefinitionen registrieren, bevor die Module benutzt werden können.

    *Warum?*: Das Benennen der Module gemäß des Musters `*.module.js`, vereinfacht es, diese zu filtern und zuerst aufzulisten.

    ```javascript
    var clientApp = './src/client/app/';

    // Immer zuerst die Moduldateien
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Zurück zum Anfang](#table-of-contents)**

## Filter

###### [Style [Y420](#style-y420)]

  - Vermeiden Sie es, Filter dazu zu nutzen, alle Eigenschaften in einem komplexen Objektgraphen zu prüfen. Nutzen Sie Filter um Eigenschaften auszuwählen.

    *Warum?*: Filter können sehr leicht missbraucht werden und dann die Performance einer Anwendung negativ beeinflussen, wenn Sie nicht überlegt eingesetzt werden. Zum Beispiel: Wenn ein Filter auf einen großen und tief geschachtelten Objektgraphen angewendet wird.

**[Zurück zum Anfang](#table-of-contents)**

## Angular Dokumentation
Für alles Andere und die, API-Referenz, schauen Sie bitte in der [Angular-Dokumentation](//docs.angularjs.org/api) nach.

## Beiträge

Öffnen Sie erst einen "Issue", um eventuelle Änderungen oder Erweiterungen zu diskutieren. Sollten Sie Fragen zu den Richtlinien haben, können Sie diese selbstverständlich als "Issue" im Repository hinterlassen. Wenn Sie einen Tippfehler finden, erstellen Sie ein Pull-Request. Die Idee ist es, den Inhalt aktuell zu halten und GitHubs Möglichkeiten zu nutzen, die Nachricht über "Issues" und PRs zu verbreiten, die über Google gefunden werden können. Warum? Weil es sein kann, dass nicht nur Sie, sondern auch andere die gleichen Fragen haben. Hier erfahren Sie mehr darüber, wie Sie beitragen können.

*Wenn Sie zu diesem Repository beitragen, erklären Sie sich damit einverstanden, dass Ihr Beitrag unter die Lizenz dieses Repository fällt.*

### Prozess
    1. Diskutieren Sie die Änderungen in einem GitHub-"Issue".
    2. Erstellen Sie in Pull-Request, beziehen Sie sich auf den "Issue" und erklären Sie die Änderung und warum sie Mehrwert bringt.
    3. Der Pull-Request wird geprüft und entweder aufgenommen oder abgelehnt.

## Lizenz

_tldr; Wenden Sie diese Richtlinien an. Beiträge sind willkommen._

### Copyright

Copyright (c) 2014-2015 [John Papa](http://johnpapa.net)

### (Die MIT-Lizenz)
Hiermit wird unentgeltlich jeder Person, die eine Kopie der Software und der zugehörigen Dokumentationen (die "Software") erhält, die Erlaubnis erteilt, sie uneingeschränkt zu benutzen, inklusive und ohne Ausnahme dem Recht, sie zu verwenden, kopieren, ändern, fusionieren, verlegen, verbreiten, unterlizenzieren und/oder zu verkaufen, und Personen, die diese Software erhalten, diese Rechte zu geben, unter den folgenden Bedingungen:

Der obige Urheberrechtsvermerk und dieser Erlaubnisvermerk sind in allen Kopien oder Teilkopien der Software beizulegen.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIESSLICH DER GARANTIE ZUR BENUTZUNG FÜR DEN VORGESEHENEN ODER EINEM BESTIMMTEN ZWECK SOWIE JEGLICHER RECHTSVERLETZUNG, JEDOCH NICHT DARAUF BESCHRÄNKT. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN ODER SONSTIGE ANSPRÜCHE HAFTBAR ZU MACHEN, OB INFOLGE DER ERFÜLLUNG EINES VERTRAGES, EINES DELIKTES ODER ANDERS IM ZUSAMMENHANG MIT DER SOFTWARE ODER SONSTIGER VERWENDUNG DER SOFTWARE ENTSTANDEN.

**[Zurück zum Anfang](#table-of-contents)**
