# AngularJS водич на кодирање

*Своеволен AngularJS водич на кодирање за тимови од [@john_papa](//twitter.com/john_papa)*

Доколку барате своеволен стил на кодирање за синтакса, конвенции и структурирање на AngularJS апликации, тогаш сте на правилното место.
Овие стилови се базирани на моето искуство во развој на [AngularJS](//angularjs.org), презентации, [Pluralsight тренинг курсеви](http://pluralsight.com/training/Authors/Details/john-papa) и работа во тимови.

>Ако ви се допаѓа овој водич, тогаш проверете ми го курсот [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) на Pluralsight.

Целта на овој водич на кодирање е да овозможи насока во развој на AngularJS апликации преку конвенциите што јас ги користам, и уште поважно, зошто ги користам.

## Величествена заедница и заслуга
Никогаш не работи во вакуум. Јас сметам дека AngularJS заедницата е неверојатна група кои се страсни за споделување искуство. Како резултат, јас и мојот пријател кој е AngularJS експерт, Todd Motto соработувавме со многу стилови и конвенции. Се согласуваме на повеќето, додека на останатите се разликуваме. Ве охрабрувам да ги погледнете на [Todd's  guidelines](https://github.com/toddmotto/angularjs-styleguide) со цел да добиете осет за неговиот пристап и како се споредува.

Многу од моите водичи произлегоа од многу сесии во програмираење во пар со [Ward Bell](http://twitter.com/wardbell). Иако не се сложуваме секогаш, мојот пријател Ward секако влијаеше во последната еволуција на овој водич.

## Погледнете ги водичите во пробната апликација
Иако овој водич ги објаснува "што", "зошто" и "како", јас сметам дека е полезно да ги запазиме во практика. Овој водич е придружен од пробна апликација која ги следи овие стилови и модели. Можете да ја најдете [пробната апликација (наречена modular) тука](https://github.com/johnpapa/ng-demos) во папката 'modular'. Не се колебајте да ја земете, да ја клонирате и форкувате. [Инструкции за да ја започнете се во своете readme](https://github.com/johnpapa/ng-demos/tree/master/modular)


##Преводи 
[Преводи од овој AngularJS водич на кодирање](./i18n) се одржувани од заедницата и можете да ги најдете тука.

## Содржина

  1. [Single Responsibility](#single-responsibility)
  1. [IIFE](#iife)
  1. [Modules](#modules)
  1. [Controllers](#controllers)
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
  1. [AngularJS Docs](#angularjs-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Single Responsibility

### Правило од 1

  - Дефинирај 1 компонента во датотека.  

 	Следниот пример го дефинира `app` модулот и неговите зависности, дефинира контролер, и дефинира фабрика, сé во една датотека  

  ```javascript
  /* избегнувајте */
  angular
    	.module('app', ['ngRoute'])
    	.controller('someController' , someController)
    	.factory('someFactory' , someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```
    
	Истите компоненти сега се разделени во свои датотеки.

  ```javascript
  /* препорачано */
  
  // app.module.js
  angular
    	.module('app', ['ngRoute']);
  ```

  ```javascript
  /* препорачано */
  
  // someController.js
  angular
    	.module('app')
    	.controller('SomeController' , SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* препорачано */
  
  // someFactory.js
  angular
    	.module('app')
    	.factory('someFactory' , someFactory);
  	
  function someFactory() { }
  ```

**[Врати се на содржина](#table-of-contents)**

## IIFE
### JavaScript Closures

  - Вгнездете ги AngularJS компоненти во Immediately Invoked Function Expression (IIFE). 
  
  *Зошто?*: IIFE не ги покажува променливите на глобално ниво. Ова помага при спречување да променливите и декларациите на функциите да живеат подолго од очекуваното на глобалното ниво, што исто така помага во избегнување на судири на променливи со исто име.

  *Зошто?*: Кога вашиот код е минифициран и поставен во една датотека за да биде ажуриран на продукцискиот сервер тогаш може да се појават судири на локални и глобални променливи. IIFE ве заштитува од двата случаи овозможувајќи ниво на променливи во една датотека.

  ```javascript
  /* избегнувајте */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // logger функцијата е додадена како глобална променлива  
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // storage функцијата е додадена како глобална променлива
  function storage() { }
  ```

  
  ```javascript
  /**
   * препорачано 
   *
   * нема заборавени глобални променливи
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

  - Забелешка: Со цел да се скрати кодот, остатокот од примерите во овој водич нема да го прикажат IIFE 
  
  - Забелешка: IIFE's го спречува кодот за тестирање од пристап до приватните членови како регуларни изрази или помошни функции кои потребни се да бидат директно тестирани во изолација. Сепак можете да ги тестирате овие преку членови кои можат да се пристапат или да ги изложите преку своја компонента. На пример, со поставување тие помошни функции, регуларни изрази или константи во своја фабрика или константа.

**[Назад кон содржината](#table-of-contents)**

## Modules

### Избегнувајте судири во именување

  - Користите уникатни шаблони на именување со разделувачи за под-модулите. 

  *Зошто?*: Со уникатни имиња избегнувате судири на модули со исто име. Разделувачи ги одредуваат модулите и нивната хиерархија на подмодули. На пример `app` е главниот модул додека `app.dashboard` и `app.users` се модули кои можно е да се зависни од `app`.

### Дефинирање (познати како Setters)

  - Декларирај модули без променлива користејќи ја setter синтаксата. 

	*Зошто?*: Со 1 компонента во датотека, реткост е да поставиш нова променлива во модулот.
  
  ```javascript
  /* избегнувајте*/
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

	Наместо тоа, употреби ја едноставната setter синтакса.

  ```javascript
  /* препорачано */
  angular
    	.module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getters

  - Кога употребувате модул, избегнувајте користење на променливa. Наместо тоа употребете врзување со getter синтакса.

	*Зошто?* : Ова создава читлив код и избегнува судири на променливи или протекувања.

  ```javascript
  /* избегнувајте */
  var app = angular.module('app');
  app.controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

  ```javascript
  /* препорачано */
  angular
      .module('app')
      .controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

### Setting vs Getting

  - Само еднаш создади и земај го за сите други инстанци.
	
	*Зошто?*: Модул треба еднаш да биде создаден, и од тој момент да биде само превземен.
  	  
	  - Употреби `angular.module('app', []);` за да создадеш модул.
	  - Употреби  `angular.module('app');` за да го превземеш тој модул. 

### Именувани vs Анонимни функции

  - Употреби именувани функции наместо да проследиш анонимни функции како повратни повици (callback). 

	*Зошто?*: Ова создава читлив код, кој е полесен за дебагирање и го намалува бројот на вгнездени повратни повици.

  ```javascript
  /* избегнувајте */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* препорачано */

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

**[Назад кон содржината](#table-of-contents)**

## Controllers

### controllerAs синтакса во Изглед

  - Употреби ја [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) синтаксата наместо `класичниот контролер со $scope` синтакса.

	*Зошто?*: Контролерите се создаваат, се ажурираат и потоа се пристапуваат преку единствена нова инстанца. `controllerAs` синтаксата е поблиску до JavaScript конструктор наспроти `класичната $scope синтакса`.

  *Зошто?*: Го промовира користењето на "dotted" објект во Прегледот (на пример `customer.name` наместо `name`), што е поконтекстуално, полесно за читање и избегнува проблеми со референцирање кои може да се појават без "dotting".

	*Зошто?*: Помага при избегнување на `$parent` повици во Прегледи со вгнездени контролери.

  ```html
  <!-- избегнувајте -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- препорачано -->
  <div ng-controller="Customer as customer">
     {{ customer.name }}
  </div>
  ```

### controllerAs синтакса во контролери

  - Употреби `controllerAs` наместо `класичен контролер со $scope` синтакса. 

  - `controllerAs` синтакса користи `this` во контролерите што се поврзува со `$scope`

  *Зошто?*: `controllerAs` е синтаксички поубав од `$scope`. Вие сеуште може да се поврзете со Прегледот и да ги пристапите `$scope` методите.  

  *Зошто?*: Ви помага да избегнете употреба на `$scope` методи во контролерот кога е подобро да ги избегнете или преместите во фабрика. `$scope` може да употребите во фабрика или во контролер само кога ви е потребен. На пример, кога објавувате/пријавувате настани со употреба на [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), или [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) подобро е да ги преместите во фабрика и да ја повикате неа во контролерот.

  ```javascript
  /* избегнувајте */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* препорачано - но провери ја следната секција */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs со vm

  - Употребете нова променлива за `this` кога употребувате `controllerAs` синтакса. Одлучете се за постојано име на променлива како на пример `vm`, што е кратеница за ViewModel.
  
  *Зошто?*: `this` зборот е контекстуален и може да ја промени својата состојба кога се употребува во функција која е во контролерот. Со употреба на нова променлива за `this`, се избегнува овој проблем.

  ```javascript
  /* избегнувајте */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* препорачано */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Забелешка: Можете да ги избегнете предупредувањата на [jshint](http://www.jshint.com/) со поставување коментар над таа линија на код. 
    
  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```
   
  Забелешка: Кога создавате watches во контролерот кога ја користите `controller as` синтаксата, тогаш можете да го надгледувате `vm.*` членот со следната синтакса. (Создавање watches претпазливо бидејќи можат да додадат товар на digest циклусот.)

  ```javascript
  $scope.$watch('vm.title', function(current, original) {
      $log.info('vm.title was %s', original);
      $log.info('vm.title is now %s', current);
  });
  ```

### Поврзување на членовите на почеток

  - Постави ги членовите кои ќе се поврзат според алфабетски редослед. Наместо да бидат поставени низ кодот во контролерот.
  
    *Зошто?*: Поставување на поврзувањата на почетокот го прави кодот полесен за читање и помага за да го најдеш кој член од контролерот е поврзан и употребуван во Прегледот. 

    *Зошто?*: Поставување на анонимни функции во ист ред е лесно, но доколку тие функции се подолги од 1 линија код тогаш може да ја намалат читливоста. Со дефинирање на функциите под поврзаните членови (функциите ќе бидат земени) горе и нивните имплементациите доле го прави кодот полесен за читање. 

  ```javascript
  /* избегнувајте*/
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
  /* препорачано */
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

    ![Controller Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-1.png)

  Забелешка: Ако функцијата е 1 линија код, можете да ја поставите горе се додека читливоста не се наруши.

  ```javascript
  /* избегнувајте */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /** 
           * линии 
           * на
           * код
           * нарушуваат
           * читливост
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* препорачано */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 линија е ОК
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Декларација на функции за да ја скрие имплементацијата

  - Употребу декларации на функции за да ги скриеш нивните имплементации. Нека членовите за поврзување останат горе. Кога треба да поврзеш функција во контролерот, посочи ја кон декларацијата на таа функција која се појавува подоле во датотеката. Ова е директно поврзано со секцијата Поврзување на членови на почеток. За повеќе детали, проверете го [овој пост](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).
    
    *Зошто?*: Поставување членови за поврзување на почеток го прави кодот полесен за читање и лесно да забележиме кој член од контролерот може да биде повзан и искористен во Прегледот. (Исто како погоре.)

    *Зошто?*: Поставување на имплементацијата на функцијата подоле во датотеката ја поместува комплексноста надвор од преглед со цел да ги забележиме поважните работи на почетокот.

    *Зошто?*: Декларации на функции се превземени со цел да не се грижиме дали функцијата е декларирана пред да е дефинирана. (како што е со изрази на функции).

    *Зошто?*: Нема потреба да се грижиме дали нашиот код ќе се скрши доколку ги приместиме `var a` пред `var b` доколку `a` зависи од `b`.     

    *Зошто?*: Редоследот е значаен со функциски изрази.

  ```javascript
  /** 
   * избегнувајте
   * употреба на функциски изрази
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

  Забележете дека значајните работи се распрснати во претходниот пример. Во следниот пример, забележете дека важните работи се на почетокот. На пример, членовите во контролерот како `vm.avengers` и `vm.title`. Имплементацијата е подоле. Ова е полесно за читање.

  ```javascript
  /*
   * препорачано
   * употреба на декларација на функции
   * и членови на поврзување на почеток.
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

### Одлагање Логика во Контролерот

  - Одлагајте логика на во контролерот со делегирање до сервиси и фабрики.

    *Зошто?*: Логиката може да биде повторно искористена кога е во сервис, од повеќе контролери и изложена преку функција.

    *Зошто?*: Логиката во сервис е полесно изолирана во тестирањето, додека повикаување на истата во тој контролер лесно може да се лажира.

    *Зошто?*: Се ослободува од зависностите и ја крие имплементацијата од контролерот.

  ```javascript
  /* избегнувајте */
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
  /* препорачано */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit() { 
         return creditService.check();
      };
  }
  ```

### Контролерите треба да бидат фокусирани

  - Дефинирајте контролер за преглед, и пробајте да не го искористите истиот за други прегледи. Наместо тоа, преместете ја повторно употребливата логика во фабрики и поставете го тој контролер фокусиран за својот преглед. 
  
    *Why?*: Повторно искористување на контролери со повеќе прегледи е лесно кршливо и тешко за одржување стабилност низ повеќе апликации во е2е тестирање.

### Назначување Контролери

  - Кога контролерот е во пар со прегледот и кога било кој од нив треба да биде повторно искористен од други контролери или прегледи тогаш дефинирај ги контролерите со нивните рута. 
    
    Забелешка: Доколку Прегледот е вчитан преку други начини наместо рути, тогаш искористете ја `ng-controller="Avengers as vm"` синтаксата. 

    *Зошто?*: Преку поставување на контролерот во пар во рутата се овозможува други рути да започнат други парови од контролери и прегледи. Кога контролерите се назначени со прегледот со [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), тогаш тој преглед е секогаш поврзан со истиот контролер.

 ```javascript
  /* избегнувајте - кога потребна е употреба на рути и динамички пар*/

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
  /* препорачано */

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

**[Назад кон содржината](#table-of-contents)**

## Services

### Singletons

  - Сервиси се инстанцирани со `new` зборот, и се употребуваат со `this` за јавни методи и променливи. Бидејќи се слични со фабрики, користете фабрика за конзистентност. 
  
    Забелешка: [Сите AngularJS сервиси се singletons](https://docs.angularjs.org/guide/services). Тоа значи дека има само една инстанца од сервис за injector.

  ```javascript
  // сервис
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
  // фабрика
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

**[Назад кон содржината](#table-of-contents)**

## Factories

### Единствена одговорност

  - Фабрики треба да имаат [единствена одговорност](http://en.wikipedia.org/wiki/Single_responsibility_principle), што е обопштена од својот контекст. Чим фабриката ја надмине единствената цел, тогаш нова фабрика треба да биде создадена.

### Singletons

  - Фабрики се singletons и враќаат објект што ги содржини членовите од тој сервис.
  
    Забелешка: [Сите AngularJS сервиси се singletons](https://docs.angularjs.org/guide/services).

### Членовите за пристап на почеток

  - Изложи ги членовите на сервисот кои треба да се повикаат (неговиот интерфејс) на почетокот, користејќи ја техниката [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Зошто?*: Поставување на повикувачките членови на почетокот го прави кодот полесен за читање и помага при лесно забележување на кои членови можат да се повикаат и мораат да бидат тестирани (и/или излажани при тестирање). 

    *Зошто?*: Ова е посебно значајно кога датотеката станува подолга и ја намалува потребата од scrolling за да забележиме што е изложено.

    *Зошто?*: Поставување функции во редослед е лесно, но кога тие се повеќе од 1 линија код тогаш може да ја нарушат читливоста и создадат повеќе scrolling. Дефинирање на повикувачкиот интерфејс со враќање на сервисот ја сокрива имплементацијата, го поставува интерфејсот на почеток што го прави кодот лесен за читање.

  ```javascript
  /* избегнувајте */
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
  /* препорачано */
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
 
 На овој начин поврзувањата се пресликуваат низ објектот, примитивните вредности не можат да се ажурираат самостојно со употреба на Revealing шаблонот на модули.

    ![Фабрики искористуваат "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Декларации на функции ја кријат имплементацијата

  - Употребете декларации на функции за да ја сокриете имплементацијата. Нека пристапните членови на фабриката бидат поставени на почеток. Додека имплементацијата на декларациите на функциите биде поставена подоле во датотеката. За повеќе детали, посочете со до [овој пост](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Зошто?*: Поставување на пристапните членови на почеток е лесно за читање и помага при лесно забележување на кои функции на фабриката можат да се пристапат од надвор.

    *Зошто?*: Поставување на имплементацијата подоле во датотеката ја крие комплексноста со цел да може полесно да се забележат најважните работи на почетокот.

    *Зошто?*: Декларации на функции се поврзани така што нема потреба од грижа доколку се користи функцијата пред да биде дефинирана (како што е примерот со функциски изрази).

    *Зошто?*: Никогаш нема да има потреба од грижа со декларации на функции и дали поместување на `var a` пред `var b` ќе го скрши кодот доколку `a` зависи од `b`.     

    *Зошто?*: Редоследот е значаен за функциски изрази. 

  ```javascript
  /**
   * избегнувајте
   * употреба на функциски изрази
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // имплементација
      };

      var getAvengerCount = function() {
          // имплементација
      };

      var getAvengersCast = function() {
         // имплементација
      };

      var prime = function() {
         // имплементација
      };

      var ready = function(nextPromises) {
          // имплементација
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
   * препорачано
   * употреба на функциски декларации
   * и пристапни членови на почеток.
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
         // имплементација
      }

      function getAvengerCount() {
          // имплементација
      }

      function getAvengersCast() {
         // имплементација
      }

      function prime() {
          // имплементација
      }

      function ready(nextPromises) {
          // имплементација
      }
  }
  ```

**[Назад кон содржината](#table-of-contents)**

## Data Services

### Одделени податочни повици

  - Рефакторирај ја логиката со податочни операции и интеракција на податоците во фабриката. Податочни сервиси се одговорни за XHR повици, локално складирање, поставување во меморија и останати податочни операции.

    *Зошто?*: Одговорноста на контролерот е во презентацијата и собирање информации за прегледот. Нема потреба да се засега како ги добива податоците, само да знае кого да праша за нив. Одделување на податочните сервиси ја преместува логиката за пристап на податоците на податочниот сервис, додека контролерот е поедноставен и фокусиран на прегледот.

    *Зошто?*: Полесно тестирање (вистинско или лажно) на податочни повици кога се тестира контролер кој употребува податочен сервис.

    *Зошто?*: Имплементацијата на податочен сервис може да биде конкретен на справување со податочното складиште. Ова може да вклучува заглавија, како да зборува со податоците, или други сервиси како $http. Одделување на логиката во податочен сервис ја енкапсулира оваа логика во единечно место, криејќи ја имплементацијата од надворешните потрошувачи (на пример, контролер) и со тоа се поедноставува промената на имплементацијата.

  ```javascript
  /* препорачано */

  // фабрика на податочен сервис
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
    
    Забелешка: Податочниот сервис е повикан од потрошувачите како контролери, криејќи ја имплементацијата од нив, како што е покажано подоле.

  ```javascript
  /* препорачано */

  // контролер ја повикува фабриката за податочниот сервис
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

### Вратете Promise од податочни повици

  - Кога повикувате податочен сервис кој враќа promise како што е $http, вратете promise во вашата повикувачка функција.

    *Зошто?*: Можете да врзете повеќе promise заедно со повеќе акции над податоците откако податочниот повик заврши и го прифати или одбие promise-от.

  ```javascript
  /* препорачано */

  activate();

  function activate() {
      /**
       * Чекор 1
       * Прашај ја getAvengers функцијата за
       * avenger податокот и чекај на promise
       */
      return getAvengers().then(function() {
          /**
           * Чекор 4
           * Извршете акција на последниот promise
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Чекор 2
         * Повикај го податочниот сервис за податоците и чекан
         * на promise-от
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Чекор 3
                 * постави го податокот и реши го promise
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Назад кон содржината](#table-of-contents)**

## Directives
### Ограничувајте се на 1 на датотека

  - Создадете една директива по датотека. Именувајте ја според директивата. 

    *Зошто?*: Полесно е да ги споите повеќе директиви во една датотека, но потешко да ги разделите тие со цел да бидат споделени низ апликации, модули или само еден модул. 

    *Зошто?*: Една директива по датотека е полесна за одржување.

  ```javascript
  /* избегнувајте */
  /* directives.js */

  angular
      .module('app.widgets')

      /* order директива која е специфична за order модулот */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales директива која може да се користи низ sales апликацијата */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* spinner директива која може да се користи низ повеќе апликации */
      .directive('sharedSpinner', sharedSpinner);


  function orderCalendarRange() {
      /* имплементација */
  }

  function salesCustomerInfo() {
      /* имплементација */
  }

  function sharedSpinner() {
      /* имплементација */
  }
  ```

  ```javascript
  /* препорачано */
  /* calendarRange.directive.js */

  /**
   * @desc order директива која е специфична за модулот во компанијата Acme
   * @пример <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* имплементација */
  }
  ```

  ```javascript
  /* препорачано */
  /* customerInfo.directive.js */

  /**
   * @desc spinner директива која може да се користи низ апликацијата во компанијата Acme
   * @пример <div acme-sales-customer-info></div>
   */    
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* implementation details */
  }
  ```

  ```javascript
  /* препорачано */
  /* spinner.directive.js */

  /**
   * @desc spinner директива која може да се користи низ повеќе апликации во компанијата Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* имплементација */
  }
  ```

    Забелешка: Постојат повеќе начини на именување на директиви, посебно што можат да се искористат во широк или краток обем. Одлучете се за еден кој ја прави директивата и нејзиното име јасно и различно. Има неколку примери подоле, но посоветувајте се до секцијата за именување.

### Ограничете DOM манипулација

  - Кога манипулирате директно со DOM, употребете директива. Ако можат да се употребат други начини, како CSS за стилови или [анимациски сервиси](https://docs.angularjs.org/api/ngAnimate), Angular темплејти, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) или [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), тогаш употребете ги тие. На пример, ако директивата само се појавува/исчезнува, тогаш употребете ngHide/ngShow. 

    *Зошто?*: Манипулација на DOM е тешка да се тестира, дебагира и притоа постојат подобри начини. (на пример CSS, анимации, темплејти)

### Обезбедете уникатен префикс на директивата

  - Обезбедете краток, уникатен и описен префикс на директивата како `acmeSalesCustomerInfo` што е декларирана во HTML како `acme-sales-customer-info`.

    *Зошто?*: Уникатниот краток префикс ја идентификува смислата на директивата и нејзиното потекло. На пример, префиксот `cc-` може да укажува дека директивата дел од CodeCamper апликацијата додека `acme-` може да укажува дека директивата е за компанијата Acme. 

    Забелешка: Избегнувајте `ng-` бидејќи тие се резервирани за директивите на AngularJS. Проучете најчесто употребувани директиви со цел да избегнувате судири со имињата, како `ion-` за [Ionic Framework](http://ionicframework.com/). 

### Ограничете се на Елементи и Атрибути

  - Кога создавате директива која има смисла како единечен елемент, тогаш ограничете ја на `E` (сопствен елемент) и како опција `A` (сопствен атрибут). Обично, ако треба да биде сопствена контролна единка, тогаш `A` е препорачливо. Најчести водичи дозволуваат `EA`, но насочете се кон имплементација како елемент кога е самостоен и како атрибут доколку го подобрува постоечкиот DOM елемент.

    *Зошто?*: Има смисла.

    *Зошто?*: Иако овозможуваме директивите да се користат како класи, доколку навистина директивата се употребува како елемент тогаш има повеќе смисла да се користи како елемент или во најмал случај, како атрибут.

    Note: EA е стандардно за AngularJS 1.3 +

  ```html
  <!-- избегнувајте -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* избегнувајте */
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
  <!-- препорачано -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```
  
  ```javascript
  /* препорачано */
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

### Директиви и ControllerAs

  - Употребете `controller as` синтакса со директива доколку сакате да бидете во согласност со `controller as` на прегледот и неговиот контролер.

    *Зошто?*: Има смисла, и не е тешко..

    Забелешка: Директивата подоле прикажува некои од начините кои можете да употребите scope во link функцијата и контролерите на директивата. Јас го внесов темплејтот со цел да го прикажам примерот.

    Забелешка: Што се однесува до dependency injection, проверете [Рачна Идентификација на Зависности](#manual-annotating-for-dependency-injection).

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
          // Внесување $scope за споредба
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

**[Назад кон содржината](#table-of-contents)**

## Resolving Promises for a Controller

### Активација на Promises во контролерот

  - Решете се со логиката за започнување на контролерот во `activate` функцијата.
     
    *Зошто?*: Поставување на почетна логика во согласно место во контролерот е полесно за лоцирање, полесно за тестирање и го оневозможува распределувањето на почетната логика низ целиот контролер.

    Забелешка: Доколку условно треба да ја спречите патеката пред употреба на контролерот, тогаш решете ја патеката.
    
  ```javascript
  /* избегнувајте */
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
  /* препорачано */
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

### Решавање на патеката преку Promises

  - Кога контролер зависи на решавање на promise, решете ги сите зависности во `$routeProvider` пред логиката на контролерот да биде извршена. Ако треба опционално да ја спречите патеката пред да биде контролерот активиран, решете ја патеката.

    *Зошто?*: Контролерот може да зависи од податоци пред да се изврши. Овој податок може да дојде преку promise од сопствена фабрика или [$http](https://docs.angularjs.org/api/ng/service/$http). Со употреба на [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) ќе овозможиме promise да се реши пред логиката на контролерот да биде извршена, така што може да зависи од акција во податокот.

  ```javascript
  /* избегнувајте */
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
  /* подобро */

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

    Забелешка: Примерот на `movieService` не е безбеден за минификација. За детали како да го направите безбеден за минификација, прегледајте ги секциите за [dependency injection](#manual-annotating-for-dependency-injection) и [minification and annotation](#minification-and-annotation).

**[Назад кон содржината](#table-of-contents)**

## Manual Annotating for Dependency Injection

### Опасно за минифкација

  - Избегнувајте употреба на кратенки за декларација на зависности без употреба на безбеден пристап за минификација.
  
    *Зошто?*: Параметрите на компонентата (e.g. контролер, фабрика, итн) ќе бидат претворени во исчезнати променливи. На пример, `common` и `dataservice` може да постанат `a` или `b` и да не бидат најдени од AngularJS.

    ```javascript
    /* избегнувајте - опасно за минифкација*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Овој код може да произведе исчезнати променливи и кога ќе биде минифициран да создаде грешки при извршување.

    ```javascript
    /* избегнувајте - опасно за минификација*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Рачна идентификација на зависности

  - Употребете `$inject` за рачна идентификација на вашиоте зависности во AngularJS компонентите.
  
    *Зошто?*: Оваа техника се користи во [`ng-annotate`](https://github.com/olov/ng-annotate), што ја препорачувам за автоматизација на создавање на безбедни зависности при минификација. Доколку `ng-annotate` забележи зависност доколку постои, нема да ја повтори.

    *Зошто?*: Ова ги заштитува вашите зависности од можноста да бидат изгубени при минификација. На пример, `common` и `dataservice` можат да постанат `a` or `b` и да не можат да бидат најдени од AngularJS.

    *Зошто?*: Избегнувајте вметнување зависности во иста линија се додека тешко се читаат во листата. Исто така може да биде збунувачко дека низата се повеќе зборови во иста линија додека крајниот член е функција.

    ```javascript
    /* избегнувајте */
    angular
        .module('app')
        .controller('Dashboard', 
            ['$location', '$routeParams', 'common', 'dataservice', 
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);      
    ```

    ```javascript
    /* избегнувајте */
    angular
      .module('app')
      .controller('Dashboard', 
         ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* препорачано */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Забелешка: Кога вашата фунјција е под return линијата, тогаш $inject функцијата може да биде недостижна (ова е возможно да се случи во директива). Можете да го решите со преместување на $inject над return линијата или со употребување на алтернативна низа од зависности. 

    Забелешка: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) воведе својство каде кое го поставува `$inject` каде може да се достигне.

    ```javascript
    // во дефиницијата на директивата
    function outer() {
        return {
            controller: DashboardPanel,
        };

        DashboardPanel.$inject = ['logger']; // Недостижно
        function DashboardPanel(logger) {
        }
    }
    ```

    ```javascript
    // inside a directive definition
    function outer() {
        DashboardPanel.$inject = ['logger']; // достижно
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Рачна идентификација на зависностите преку решавање на патеки

  - Употребете $inject за рачна идентификација на зависностите преку решавање на патеки во AngularJS компоненти.
  
    *Зошто?*: Оваа техника ги разделува анонимните функции за решавање на патеката, кое е полесно за читање.

    *Зошто?*: `$inject` линијата може лесно да го претходи решавачот, подобрувајќи ја безбедноста при минификација.

    ```javascript
    /* препорачано */
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

**[Назад кон содржината](#table-of-contents)**

## Minification and Annotation

### ng-annotate

  - Употребете [ng-annotate](//github.com/olov/ng-annotate) за [Gulp](http://gulpjs.com) или [Grunt](http://gruntjs.com) и поставете го коментарот `/** @ngInject */` над функциите кои им се потребни автоматизиран dependency injection.
  
    *Зошто?*: Го заштитува вашиот код од загуба на зависности при минификација.

    *Зошто?*: Употреба на [`ng-min`](https://github.com/btford/ngmin) е застарено. 

    >Јас преферирам Gulp бидејќи сметам е полесен за пишување, читање и дебагирање.

    Следниот код користи заштитни мерки при минификација на зависности.

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

    Кога следниот код ќе помине низ ng-annotate, ќе го произведе следниот излез со `$inject` анотација и ќе постане безбеден при минификација.

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

    Забелешка: Доколку `ng-annotate` забележи дека постои injection (на пример `@ngInject`), нема да ја повтори `$inject` линијата на кодот погоре.

    Забелешка: Кога употребувате решавање на патеки, може да поставите префикс на функцијата за решавање, на пример `/* @ngInject */`, и ќе произведе правилно анотиран код со безбедни зависности при минификација.

    ```javascript
    // Со употреба на @ngInject анотација
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

    > Забелешка: Со почеток на AngularJS 1.3 употребете го параметарот `ngStrictDi` на [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) директивата. Доколку е застапен, injector-от ќе биде создаден во "strict-di" мод оневозможувајќи ја апликацијата да започне и да ги повика функциите кои не користат експлицитна анотација. (овие не се безбедни од минификација). Со логирање на информациите во конзола од дебагирање ќе ви помогне да ги најдете тие функции.
    `<body ng-app="APP" ng-strict-di>`

### Употребете Gulp или Grunt за ng-annotate

  - Употребете [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) или [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) во автоматизиран build task. Внесете `/* @ngInject */` пред функцијата која има зависности.
  
    *Зошто?*: ng-annotate ќе ги фати повеќето зависности, но понекогаш потребни се навестувања во својата `/* @ngInject */` синтакса.

    Следниот код е припер за gulp задача која употребува ngAnnotate

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;
        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // Анотација пред uglify за правилна минификација.
            .pipe(ngAnnotate({
                // true помага за @ngInject да знае каде не се користи.
                // Не работи со resolve, така да мора експлицитно да се постави
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[Назад кон содржината](#table-of-contents)**

## Exception Handling

### Декоратори

  - Употребете [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), при конфигурација со употреба на [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) сервис, на [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) сервисот за да извршите лични акции кога ќе се случи исклучок.
  
    *Зошто?*: Овозможува постојан начин да се справи со исклучоци кои AngularJS не може да ги фати во development-time или run-time.

    Забелешка: Друга опција е да се прескокне сервисот наместо да се користи декоратор. Ова е добра опција, но доколку сакате да го задржите стандардното однесување и проширите, тогаш препорачливо е да користите декоратор.

  	```javascript
    /* препорачано */
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
             * Може да ја додадете грешката на колекцијата на сервиси,
             * додади грешки на $rootScope, логирај грешки на далечен веб сервер,
             * или логирај локално. Или фрлете го. Од вас зависи.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  	```

### Ловци на исклучоци

  - Создадете фабрика која изложува интерфејс за да улови и грациозно да се справи со исклучокот.

    *Зошто?*: Обезбедува самостоен начин да ги улови исклучоците кои може да бидат фрлени во вашиот код.(на пример при XHR повици или пад на Promise).

    Забелешка: Ловецот на исклучоци е добар за ловење и реагирање на специфични исклучоци од повици кои можат да фрлат таков исклучок. На пример, кога правите XHR повик за да ги примите податоците од далечен веб сервии и сакате да фатите било какви исклучоци од тој сервер и да реагирате различно за секој од нив.

    ```javascript
    /* препорачано */
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

### Грешки при рутирање

  - Справете се и логирајте сите рутирачки грешки со употреба на [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Зошто?*: Обезбедува постојан начин да се справи со сите рутирачки грешки.

    *Зошто?*: Обезбедува подобро искуство за корисникот доколку се случи грешка при рутирање и вие ги пренесете на пријателска патека каде можат да забележат повеќе детали како да се вратат на минатата акција без грешка.

    ```javascript
    /* препорачано */
    function handleRoutingErrors() {
        /**
         * Прекин на патека:
         * Доколку настане грешка, оди на контролната страна.
         * Обезбеди излез доколку не успее по втор пат.
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

**[Назад кон содржината](#table-of-contents)**

## Naming

### Водич во именување

  - Употребете самостојни имиња за сите компоненти следејќи го шаблонот кој ја опишува функцијата и после (опционално) неговиот тип. Мојот препорачан шаблон е `feature.type.js`. Постојат две имиња за повеќето датотеки:
    *   името на датотеката (`avengers.controller.js`)
    *   регистрираната компонента во Angular (`AvengersController`)
 
    *Зошто?*: Конвенциите при именување им помага на тимот за конзистентен начин да ги најдат компонентите при прв поглед. Конзистентност во проект е значајно. Конзистентност во тимот е важно. Конзистентност низ компанијата обезбедува огромна ефикасност.

    *Зошто?*: Конвенцијата при именување треба едностанво да ви помогне побрзо да го најдете кодот и полесно да го разберете. 

### Имиња на датотеки по функција

  - Употребете конзистентни имиња за сите компоненти следејќи шаблон што ја опишува функцијата на компонентата и после (опционално) нејзиниот тип. Мојата препорака е `feature.type.js`.

    *Зошто?*: Обезбедува конзистентен начин за лесна идентификација на компоненти.

    *Зошто?*: Обезбедува шаблон за совпаѓање на автоматизирани задачи.

    ```javascript
    /**
     * чести опции
     */

    // Контролери
    avengers.js
    avengers.controller.js
    avengersController.js

    // Сервиси/Фабрики
    logger.js
    logger.service.js
    loggerService.js
    ```

    ```javascript
    /**
     * препорачано
     */

    // controllers
    avengers.controller.js
    avengers.controller.spec.js

    // Сервиси/Фабрики
    logger.service.js
    logger.service.spec.js

    // Константи
    constants.js
    
    // Дефиниција на модули
    avengers.module.js

    // Рути
    avengers.routes.js
    avengers.routes.spec.js

    // Конфигурација
    avengers.config.js
    
    // Директиви
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

  Забелешка: Други чести конвенции е именување на контролерот датотеките без зборот `controller` во датотеката како `avengers.js` наместо `avengers.controller.js`. Сите други конвенции покажуваат употреба на суфикс на типот. Контролерите се најчестиот тип компонента така што заштедува на пишување и сеуште лесно препознатливо. Препорачувам да се одлучите со 1 конвенција и бидете конзистентен со тимот.

    ```javascript
    /**
     * препорачано
     */
    // Контролери
    avengers.js
    avengers.spec.js
    ```

### Имиња на датотеки за тестови

  - Имињата на тестовите се слични со компонентата што ја тестираат со додавање на суфикс `spec`.  

    *Зошто?*: Обезбедува конзистентен начин за лесно препознавање компоненти.

    *Зошто?*: Обезбедува шаблонско совпаѓање за [karma](http://karma-runner.github.io/) или други тест фрејморкови.

    ```javascript
    /**
     * препорачано
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Имиња на контролер

  - Употребете конзистентни имиња за сите контролери именувани по нивните функции. Користете UpperCamelCase за контролери, бидејќи се контруктори.

    *Зошто?*: Обезбедува конзистентен начин за лесно препознавање и референцирање контролери.

    *Зошто?*: UpperCamelCase е конвенција за препознавање објекти кои можат да се инстанцираат со конструктор.

    ```javascript
    /**
     * препорачано
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```
    
### Суфикс на името на контролерот

  - Додадете суфикс `Controller` на името или без него. Одберете едно, не двете.

    *Зошто?*: `Controller` суфиксот е почесто користен и експлицитно описен.

    *Зошто?*: Без суфиксот е концизен и контролерот често може лесно да се пронајде без суфиксот.

    ```javascript
    /**
     * препорачано: Опција 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers(){ }
    ```

    ```javascript
    /**
     * препорачано: Опција 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Имиња на фабрики

  - Употребете конзистентни имиња за сите фабрики според нивната функција. Употребете camel-casing за сервиси и фабрики.

    *Зошто?*: Обезбедува конзистентен начин за брзо препознавање и референцирање фабрики.

    ```javascript
    /**
     * препорачано
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

### Имиња на директиви

  - Употребете конзистентни имиња за сите директиви со употреба на camel-case. Употребете краток префикс за да опише во која зона припаѓа директивата. (неколку примери се компаниски префикси или проект префикс).

    *Зошто?*: Обезбедува конзистентен начин за брзо препознавање и референцирање на компоненти.

    ```javascript
    /**
     * препорачано
     */

    // avenger.profile.directive.js    
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Модули

  -  Кога постојат повеќе модули, името на главниот модул е `app.module.js` додека другите зависни модули се именувани според тоа што претставуваат. На пример, админ модул е именувам `admin.module.js`. Соодветниот регистрирани имиња на модули би биле `app` и `admin`. Апликација со еден модул би била наречена `app.js`, без модул прекарот.

    *Зошто?*: Апликација со 1 модул е именувана `app.js`. Тоа е апликацијата, па зошто да не бидеме супер едноставни.
 
    *Зошто?*: Обезбедува конзистентност за повеќе модуларни апликации како и проширување до огромни апликации.

    *Зошто?*: Обезбедува лесен начин да се автоматизираат задачите за создавање на дефинициите на модулите, па потоа сите останати angular датотеки (пакување на датотеки).

### Конфигурација

  - Разделете ја конфигурацијата по модул во своја датотека, именувана по модулот. На пример, конфигурациската датотека за модулот `app` е именувана `app.config.js`. Конфигурација за модул `admin.module.js` е `admin.config.js`.

    *Зошто?*: Ја разделува конфигурацијата од дефиницијата на модулот, компонентите и имплементацијата.

    *Зошто?*: Обезбедува лесна идентификација на конфигурацијата на модулот.

### Патеки

  - Разделете ги конфигурациите на патеките во посебна датотека. Примери како `app.route.js` за главниот модул и `admin.route.js` за `admin` модулот. Дури во помали апликации, преферирам да останат разделени од останатата конфигурација. Алтернатива би била да користиме подолги имиња како `admin.config.route.js`.

**[Назад кон содржината](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT

  - Поставете ја пликацијата така што `L` (брзо лоцирање на кодот), `I` (идентификација на кодот со поглед), `F` (најрамна структура што можете) и `T` (обидете се да останете DRY). Структурата треба да ги задоволува овие 4 основни водичи. 

    *Зошто LIFT?*: Обезбедува конзистентна структура која лесно се скалира, која е модуларна, и лесно може да ја зголеми ефикасноста на програмерите преку брзо лоцирање на кодот. Друг начин да ја проверите вашата структура е да се запрашате: Колку брзо можете да ги отворите и работите во сите датотека со одредена функција?

    Кога забележувам дека мојата структура е незадоволителна, се навраќам на LIFT водичите
  
    1. `L` (лоцирање на вашиот код е лесно)
    2. `I` (идентифицирање на кодот со поглед)
    3. `F` (рамна структура колку што можеме)
    4. `T` (обидете се да останеме DRY (Не Се Повторувај) или T-DRY)

### Лоцирање

  - Лоцирање на вашиот код треба да биде интуитивно, едноставно и брзо.

    *Зошто?*: Сметам дека е најважно за проект. Доколку тимот не може да брзо ги пронајде датотеките кои им се потребни да работат, тогаш не можат да работат ефикасно и структурата треба да се промени. Можете да го знаете името на датотеката или каде се наоѓаат сродните датотеки, така што доколку ги поставите на најинтуитивното место во блискост меѓу себе би се заштедило многу време. Описна структура на папки може да помогне.

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

### Идентификација

  - Кога ќе погледнете во датотека, би требало одма да знаете што содржи и претставува.

    *Зошто?*: Ќе поминете помалку време на пребарување на кодот и со тоа поефикасен. Доколку тоа значи подолги имиња, нека биде така. Бидете описни со имињата на датотеките и нека содржината биде во една компонента. Избегнувајте датотеки со повеќе контролери, сервиси или мешавина од нив. Постои исклучок на 1 компонента по датотека кога постојат мали функционалности поврзани една со друга кои сеуште можат лесно да се идентифицираат.

### Рамна структура

  - Одржувајте рамна структура на папки колку што можете повеќе. Кога ќе се појават 7+ датотеки, започнете со поделба.

    *Зошто?*: Никој не би сакал да пребарува низ 7 нивоа од папки за да пронајде датотека. Размислете за мениа на веб страни... било што подлабоко од 2, треба да се размисли подобро во разделба. Во структурата не постои правило за број на папки, но кога папка има 7-10 датотеки, време е да се создадат подпапки. Нека биде поставена како што ви е удобно. Користете порамна структура се додека не е очигледно (со помош на LIFT) да создадете нова папка.

### T-DRY (Обидете се да останете DRY)

  - Бидете, но се во нормални граници без загуба на читливост.

    *Зошто?*: Да останете DRY е важно, но не е значајно доколку жртвувате на другите водичи во LIFT и зошто го нарекувам T-DRY. Не би сакал да пишувам session-view.html за преглед бидејќи очигледно е дека е преглед. Доколку не е очигледно под конвенција, тогаш ќе го именувам.

**[Назад кон содржината](#table-of-contents)**

## Application Structure

### Целокупните водиши

  - Имајте блиска и широка визија на вашата имплементација. Со други зборови, започнете со мали компоненти и запазете каде се насочува апликацијата во иднината. Целокупниот код на апликацијата е во корен-папката наречена `app`. Целата содржина е 1 датотека по функција. Секој контролер, сервис, модул, преглед е во своја датотека. Сите 3rd party скрипти поставете ги во друга папка, не во `app` папката. Јас ги немам напишано нив и не би сакал да имам неред во мојата апликација (`bower_components`, `scripts`, `lib`).

    Забелешка: Најдете повеќе детали и расудувања за структурата во [овој оригинален пост за структура на апликација](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Изглед

  - Поставете компоненти која го отсликуваат целокупниот изглед на апликацијата во папката `layout`. Овде може да имаме поделеност на посебни секции од прегледот и контролер кој ќе биде контејнер за неговата апликација, навигација, мениа, области со содржина и други региони. 

    *Зошто?*: Го организира целиот изглед во единствено место кое може да се употребува низ целата апликација.

### Папки-По-Функција структура

  - Создадете папки според нивната функција. Кога папката ќе порасне 7+ датотеки, почнете да размислувате за нови папки. Вашиот праг може да биде различен, така да поставете како што е препорачано.

    *Зошто?*: Програмерот може да го лоцира кодот, идентификува секоја датотека што претставува, структурата останува рамна и не постојат повторувачки или непотребни имиња. 

    *Зошто?*: LIFT водичите се покриени.

    *Зошто?*: Помага при нередот во апликацијата со оганизација на содржината со помош на LIFT водичите.

    *Зошто?*: Кога постојат многу датотеки, полесно е да ги лоцирате со конзистентна структура на папки и потешко со рамна структура на истите папки.

    ```javascript
    /**
     * препорачано
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

      ![Пробна апликација пример](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Забелешка: Не употребувајте структура со папка-по-тип. Со ова ќе се движите низ повеќе папки кога работите на функционалност што станува потешко како што апликацијата има повеќе од 5, 10 или 25 прегледи и контролери (за други функционалности), а со тоа и потешко за лоцирање на датотеките на таа функционалност.

    ```javascript
    /* 
    * избегнувајте
    * алтернативен папка-по-тип
    * Препорачаувам "папка-по-функционалност"
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

**[Назад кон содржината](#table-of-contents)**

## Modularity
  
### Многу мали, само содржани модулу

  - Создадете мали модули кои содржат една одговорност.

    *Зошто?*: Модуларни апликации се полесни за внесување на зависности во нив и овозможува за тимовите да ја прошират апликацијата вертикално во инкременти. Ова значи дека може да внесуваме нови функционалности како што ги развиваме.

### Создадете модул за апликацијата

  - Создадете корен модул за апликацијата која улога е да ги содржи сите модули и функционалности на вашата апликација. Именувајте го според вашето име на апликација.

    *Зошто?*: AngularJS охрабруба модуларност и поделба на грижи. Со создавање на корен модул на вашата апликација чија улога е да се поврзе со другите модули овозможува јасен начин за вклучување и исклучување модули од вашата апликација.

### Нека апликацискиот модул остане лесен

  - Внесете логика за поврзување на апликацијата во корен модулот. Нека функционалноста биде во останатите модули.

    *Зошто?*: Со додавање на додатни улоги на корен модулот на апликацијата за земање на податоиц, прикажување изгледи и други логики кои не се поврзани со поврзување на модулите во апликацијата, се отежнува процесот на повторно искористување на функционалности како и нивно вклучување/исклучување.

### Областите за функционалност се Модулите

  - Создадете модули кои ги претставуваат областите на функционалности, како изгледот, повторно искористливи и заеднички сервиси, контролни табли и функционалности специфични за апликацијата (на пример, корисници, админ, продажба).

    *Зошто?*: Само содржани модули можат да се вклучат/исклучат без многу проблеми.

    *Зошто?*: Спринтови или итерации може да се фокусираат на функционалности и нивните области, а да се вклучат во апликацијата на крајот од спринтот или итерацијата.

    *Зошто?*: Со разделба на областите на функционалности во модули овозможува полесно тестирање на модулите во изолација и повторно искористување на кодот.

### Повторно употребливи блокови се Модули

  - Создадете модули кои претставуваат повторно реискористливи блокови од апликацијата за заеднички сервиси како справување со исклучоци, логирање, дијагностика, безбедност и локално зачувување на податоци.

    *Зошто?*: Овие типови на функционалности се потребни во многу апликации, така што со одделување во нивните модули овозможува да бидат генерични и повторно употребливи во други апликации.

### Зависности на модули

  - Корен модулот на апликацијата зависи од функционалностите и нејзините модули, функционалните модули немаат директни зависности додека модулите потребни низ многу апликации зависат од генеричките модули.

    ![Модуларност и Зависности](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Зошто?*: Главниот модул на апликацијата содржи манифест од брзо идентифицирани функционалности на апликацијата.

    *Зошто?*: Модулите потребни низ повеќе апликации полесно се споделуваат. Функционалностите генерално зависат на истите генерички модули, кои се вметнати во еден модул. (`app.core` во сликата).

    *Зошто?*: Интра-Апликациски функционалности како податочни сервиси кои се споделени се лесни за лоцирање и споделување во `app.core` (изберете го вашето омилено име за овој модул).

    Забелешка: Ова е стратегија за конзистентност. Постојат многу добри опции. Одберете една што е конзистентна, што ги следи AngularJS правилата за зависности, а лесно за одржување и скалабилност.

    > Моите структури се разликуваат малку низ проекти, но сите ги запазуваат правилата за структура и модуларност. Имплементацијата може да се разликува во зависност од функционалностите и тимот. Со други зборови, не се засегајте на буквалната структура се додека ја оправдува вашата структура за конзистентност, одржливост и ефикасност. 

**[Назад кон содржината](#table-of-contents)**

## Startup Logic

### Конфигурација
  - Внесете го кодот во [конфигурацијата на модулот](https://docs.angularjs.org/guide/module#module-loading-dependencies) што мора да биде извршен пред почетокот на апликацијата. Идеални кандидати се провајдери и константи.

    *Зошто?*: Имаме помалку места за конфигурација на апликацијата.

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

### Извршувачки блокови

  - Било каков код што треба да се изврши кога ќе започне апликацијата треба да биде поставен во фабрика, изложен преку функција или вгнезден во [извршувачки блок](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Зошто?*: Код во извршувачки блок е тежок за тестирање. Поставување на истиот во фабрика е полесен за абстракција и лажење во тестирање.

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

**[Назад кон содржината](#table-of-contents)**

## Angular $ Wrapper Services

### $document и $window

  - Употребете [`$document`](https://docs.angularjs.org/api/ng/service/$document) и [`$window`](https://docs.angularjs.org/api/ng/service/$window) наместо `document` и `window`.

    *Зошто?*: Овие сервиси се завиткани од Angular и полесни за тестирање него со употреба на document и window во тестовите. Ова помага да се излажат document и window во самите тестови.

### $timeout и $interval

  - Употребете [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) и [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) наместо `setTimeout` и `setInterval` .

    *Зошто?*: Овие сервиси се завиткани од Angular и полесни се за тестирање. Исто така се ракува со AngularJS digest циклусот што овозможува полесно ажурирање на поврзаните податоци.

**[Назад кон содржината](#table-of-contents)**

## Testing
Тестирање на единки се справува со чистење на кодот и затоа внесов неколку препораки во основи на тестирање во линковите подоле кои содржат повеќе информации за нив.

### Напишете тестови со Сценарија

  - Напишете неколку тестови за секое сценарио. Започнете со празен тест и внесете код како што пишувате код за сценариото.

    *Зошто?*: Со пишување на описи за тестовите се дефинира што ќе биде сценариото, што ќе прави и не прави, а и како ќе одреди дали е успешно.

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

### Библиотеки за тестирање

  - Употребете [Jasmine](http://jasmine.github.io/) или [Mocha](http://visionmedia.github.io/mocha/) за тестирање на единки.

    *Зошто?*: И Jasmine и Mocha се широко употребувани во AngularJS заедницата. И двете се стабилни, добро одржувани и овозможуваат робустни функции за тестирање.

    Забелешка: Кога користите Mocha, исто така не заборавајте да употребите assert библиотека како што е [Chai](http://chaijs.com).

### Извршувач на тестови

  - Употребете [Karma](http://karma-runner.github.io) како извршувач на тестови.

    *Зошто?*: Karma е лесна за подесување за еднаш или автоматски кога ќе го промениш кодот.

    *Зошто?*: Karma се поврзува во вашиот Continuous Integration процес само по себе или со помош од Grunt или Gulp.

    *Зошто?*: Некои IDE почнуваат да го вградуваат Karma во нив, како [WebStorm](http://www.jetbrains.com/webstorm/) и [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Зошто?*: Karma работи добро со автоматизација на задачите кои водечки алатки се [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) или [Gulp](http://www.gulpjs.com) (со [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing и Spying

  - Употребете [Sinon](http://sinonjs.org/) за stubbing и spying.

    *Зошто?*: Sinon работи добро со Jasmine и Mocha и ги проширува нивните stubbing и spying функционалности.

    *Зошто?*: Sinon овозможува полесно менување меѓу Jasmine и Mocha, доколку сакате да ги пробате двете.

### Без Пребарувач

  - Употребете [PhantomJS](http://phantomjs.org/) за да ги извршувате тестовите на вашиот сервер.

    *Зошто?*: PhantomJS е пребарувач кој ги започнува тестовите без потреба од кориснички интерфејс. Така што нема потреба да инсталирате Chrome, Safari, IE, или други пребарувачи на вашиот сервер. 

    Забелешка: Сепак потребно е да ги извршите тестовите на сите пребарувачи во вашата околина како и вашата целна група.

### Анализа на код

  - Извршете JSHint на вашиот код. 

    *Зошто?*: Тестовите се код. JSHint лесно ги прикажува грешките во квалитетот на кодот што може да предизвика неправилно извршување на тестовите.

### Изменете ги променливите на JSHint за правила на тестови

  - Олабавете ги правилата за вашиот тест код со цел да ви дозволи да користите глобални променливи како `describe` и `expect`.

    *Зошто?*: Вашите тестови се код и им е потребно истото внимание како вашиот продукциски код. Сепак, глобални променливи, како тие подоле, кои се користат од фрејмворкот за тестирање можат да бидат исклучени да не се проверуваат во вашите тестови.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Алатки за тестирање](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Назад кон содржината](#table-of-contents)**

## Animations

### Употреба

  - Употребете суптилни [анимации со AngularJS](https://docs.angularjs.org/guide/animations) да преминете низ состојбите на прегледите и главните визуелни елементи. Вклучете го [ngAnimate модулот](https://docs.angularjs.org/api/ngAnimate). Трите главни точки се суптилност, глаткост и беспрекорност.

    *Зошто?*: Суптилни анимации го подобруваат искуството на корисникот кога се употребуваат правилно.

    *Зошто?*: Суптилни анимации ги подобруваат перформансите како што имаме премин низ прегледи.

### Втора подточка

  - Употребете кратки анимации. Јас најчесто започнувам со 300ms и го изменувам се додека не е соодветно.

    *Зошто?*: Долги анимации може да имаат обратен ефект на искуството на корисникот со тоа што прикажуваме дека нашата апликација е со бавни перформанси.

### animate.css

  - Употребете [animate.css](http://daneden.github.io/animate.css/) за конвенционални анимации.

    *Зошто?*: Анимациите на animate.css се први, глатки и лесни да се додадат во вашата апликација.

    *Зошто?*: Обезбедува конзистентност во вашите анимации.

    *Зошто?*: animate.css се широко употребувани и тестирани.

    Забелешка: Проверете те го [овој одличчен пост од Matias Niemelä за AngularJS анимации](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Назад кон содржината](#table-of-contents)**

## Comments

### jsDoc

  - Доколку планирате да направите документација, употребете го [`jsDoc`](http://usejsdoc.org/) со чија синтакса ќе документирате функциски имиња, нивен опис, нивни параметри и што враќа. Употребете `@namespace` и `@memberOf` за да се израмни со вашата апликациска структура.

    *Зошто?*: Можете да генерирате (и регенерирате) документација од вашиот код, наместо да ја пишувате од почеток.

    *Зошто?*: Обезбедува конзистентност со употреба на често употребувана алатка во софтерската индустрија.

    ```javascript
    /**
     * Фабрика за логирање
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

**[Назад кон содржината](#table-of-contents)**

## JS Hint

### Употребете датотека на можните опции

  - Употребете JS Hint за проверување на вашиот JavaScript код и не заборавајте да ја измените JS Hint датотеката на можни опции која мора да биде вклучена во вашиот управувач на изворниот код. Погледнете ја [JS Hint документација](http://www.jshint.com/docs/) за детали на можните опции.

    *Зошто?*: Обезбедува прво предупредување пред да го пратите кодот до управувачот на изворниот код.

    *Зошто?*: Обезбедува конзистентност во вашиот тим.

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

**[Назад кон содржината](#table-of-contents)**

## Constants

### Глобални од продавачот

  - Создадете AngularJS константа за глобалните променливи од библиотеки кои не се ваши.

    *Зошто?*: Обезбедува начин да ги внесете библиотеките кои се глобални. Ова го подобрува тестирањето на кодот што овозможува лесно да забележите кои зависности се во вашите компоненти (се справува со протекување на абстракции). Исто така овозможува да ги излажирате овие зависности, каде има смисла да направите.

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

**[Назад кон содржината](#table-of-contents)**

## File Templates and Snippets
Употребете датотечни шаблони и кратки кодови за да следите конзистентен стил и шаблон во вашиот код. Евен неколку шаблони и/или кратки кодови од IDE и едитори за веб развој.

### Sublime Text

  - AngularJS кратки кодови кои ги следат овие водичи и стилови на код. 

    - Симнете ги [Sublime Angular кратки кодови](assets/sublime-angular-snippets.zip) 
    - Поставете ги во вашата Packages папка
    - Рестартирајте го Sublime 
    - Во JavaScript датотека напишете ја следната команда и потоа кликнете на `TAB`
 
    ```javascript
    ngcontroller // создава Angular контролер
    ngdirective // создава Angular директива
    ngfactory // создава Angular фабрика
    ngmodule // создава Angular модул
    ```

### Visual Studio

  - AngularJS датотечни шаблони што ги следат овие стилови и водичи на код можат да бидат најдени на [SideWaffle](http://www.sidewaffle.com)

    - Симнете ја [SideWaffle](http://www.sidewaffle.com) Visual Studio екстензија (vsix file)
    - Извршете ја vsix датотека
    - Рестартирајте го Visual Studio

### WebStorm

  - AngularJS кратки кодови и датотечни шаблони кои ги следат овие стилови и водичи на код. Можете да ги внесете во вашите WebStorm подесувања:

    - Симнете ги [WebStorm AngularJS датотечни шаблони и кратки кодови](assets/webstorm-angular-file-template.settings.jar) 
    - Отворете го WebStorm и одберете го `File` менито
    - Одберете го `Import Settings`
    - Одберете ја датотеката и кликнете `OK`
    - Во JavaScript датотека пишете ги следните команди и потоа кликнете на `TAB`:

    ```javascript
    ng-c // создава Angular контролер
    ng-f // создава Angular фабрика
    ng-m // создава Angular модул
    ```

**[Назад кон содржината](#table-of-contents)**

## AngularJS Docs
За се останато, референцирајте се до неговото API во [Angular документацијата](//docs.angularjs.org/api).

## Contributing

Отворете Issue прво за да дискутираме за можни промени/додатоци. Доколку имате прашања со водичот, слободно отворете Issue во складиштето. Доколку најдете пропуст, создадете Pull Request. Идеата е да ја одржуваме содржината ажурирана и со функционалноста на github да си помогнеме во проширување на приказната со Issue и PR, кои може да се пронајдат од Google. Зошто? Бидејќи шансите се доколку имате прашање, може и некој друг да го има истото! Можете да научите повеќе за начинот на кој придонесуваме.

*Со придонесување до ова складиште, се придржувате вашата содржина да биде да подлежи на лиценцата на ова складиште.*

### Процес
    1. Дискусирајте за промените во Issue. 
    1. Отворете Pull Request, поставете референца до Issue и објаснете ја промената и како додава на вредност.
    1. Pull Request ќе биде оценето и биде или споено или одбиено.

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

**[Назад кон содржината](#table-of-contents)**
