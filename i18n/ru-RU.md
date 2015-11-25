# Руководство по стилям для AngularJS

*Angular соглашения по стилям для команд разработчиков, предложенные [@john_papa](//twitter.com/john_papa)*

Если вам нужны стандарты написания кода, соглашения, и руководства структурирования приложений AngularJS, то вы находитесь в правильном месте. Эти соглашения основаны на моем опыте программирования на [AngularJS](//angularjs.org), на моих презентациях [Pluralsight training courses](http://pluralsight.com/training/Authors/Details/john-papa), а также на совместной работе в командах разработчиков.

Главной целью этого документа является желание предоставить вам наиболее полные инструкции для построения приложений AngularJS. Рекомендуя данные соглашения, я стараюсь акцентировать ваше внимание на цели и причины, зачем их нужно придерживаться.

>Если это руководство вам понравится, то вы можете также оценить мой курс [Angular Patterns: Clean Code](http://jpapa.me/ngclean), который размещен на сайте Pluralsight.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Признательность сообществу и коллегам
Никогда не работайте в вакууме. Я считаю AngularJS-сообщество невероятно открытым, которое активно обменивается опытом и заботится об этом. Также как и мой друг Todd Motto (отличный Angular эксперт), я работал со многими стилями и соглашениями. Мы с ним сходимся во многом, но иногда и противоречим друг другу. Я предлагаю вам ознакомиться с курсом [Todd's guidelines](https://github.com/toddmotto/angularjs-styleguide) дабы почувствовать разницу подходов.

Многие из моих стилей взяты в ходе моих программистских сессий с [Ward Bell](http://twitter.com/wardbell). А так как мы не всегда были согласны друг с другом, то мой друг Ward оказал очень сильное влияние на эволюцию и окончательную редакцию этого документа.

## Смотрите стили и шаблоны в приложении-примере
Пока данное руководство объясняет *что*, *почему* и *как*, я сразу же показываю, как это работает на практике. Все, что я предлагаю и описываю сопровождается примером-приложения, которое соблюдает и демонстрирует приведенные стили и шаблоны. Вы можете найти [пример приложения (имя modular) здесь](https://github.com/johnpapa/ng-demos) в папке `modular`. Свободно скачивайте, клонируйте и перемещайте эти примеры в свои хранилища. [Инструкциии по запуску примеров находятся в файлах readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

## Переводы
[Переводы данного руководства по Angular-стилям](https://github.com/johnpapa/angularjs-styleguide/tree/master/i18n) поддерживаются соообществом разработчиков и могут быть найдены здесь.

## Table of Contents

  1. [Единственная обязанность (Single Responsibility)](#single-responsibility)
  1. [IIFE](#iife)
  1. [Модули (Modules)](#modules)
  1. [Контроллеры (Controllers)](#controllers)
  1. [Сервисы (Services)](#services)
  1. [Фабрики (Factories)](#factories)
  1. [Сервисы данных (Data Services)](#data-services)
  1. [Директивы (Directives)](#directives)
  1. [Resolving Promises for a Controller (Работа с Объектами Promise в Контроллерe)](#resolving-promises-for-a-controller)
  1. [Manual Annotating for Dependency Injection (Аннотация для Внедренной Зависимости)](#manual-annotating-for-dependency-injection)
  1. [Minification and Annotation (Минификация и аннотация)](#minification-and-annotation)
  1. [Exception Handling (Обработка Исключений)](#exception-handling)
  1. [Naming (Именования)](#naming)
  1. [Application Structure LIFT Principle (Структура Приложения по Приниципу LIFT)](#application-structure-lift-principle)
  1. [Application Structure (Структура Приложения)](#application-structure)
  1. [Modularity (Модульность)](#modularity)
  1. [Startup Logic (Логика Запуска Приложения)](#startup-logic)
  1. [Angular $ Wrapper Services (Angular и Интерфейсные Сервисы)](#angular--wrapper-services)
  1. [Testing (Тестирование)](#testing)
  1. [Animations (Анимации)](#animations)
  1. [Comments (Комментарии)](#comments)
  1. [JSHint](#js-hint)
  1. [Constants (Константы)](#constants)
  1. [File Templates and Snippets (Шаблоны Файлов и Сниппеты)](#file-templates-and-snippets)
  1. [Yeoman Generator](#yeoman-generator)
  1. [Routing (Маршрутизация)](#routing)
  1. [Task Automation (Автоматизация)](#task-automation)
  1. [Angular Docs (Angular документация)](#angularjs-docs)
  1. [Contributing (Сотрудничество)](#contributing)
  1. [License](#license)

## Single Responsibility

### Правило 1
###### [Style [Y001](#style-y001)]

  - Определяйте 1 компонент в одном файле.

  В следующем примере в одном и том же файле определяется модуль(module) `app` вместе с его зависимостями, определяется контроллер(controller), а также сервис(factory).

  ```javascript
  /* избегайте этого */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  А теперь каждый компонент разнесен в свой отдельный файл.

  ```javascript
  /* рекомендовано */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* рекомендовано */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* рекомендовано */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[К Содержанию](#table-of-contents)**

## IIFE
### Замыкания JavaScript
###### [Style [Y010](#style-y010)]

  - Оборачивайте компоненты Angular в Немедленно Исполняемые Функции(IIFE - Immediately Invoked Function Expression).

  *Зачем?*: IIFE удаляют переменные из глобальной области видимости. Этот прием не дает существовать переменным и функциям дольше, чем это необходимо в глобальной области видимости. Иначе это может вызвать непредсказуемые коллизии во время исполнения всего приложения.

  *Зачем?*: Когда ваш код будет сжат и упакован (bundled and minified) в один файл для размещения его на рабочем сервере, то коллизий станет намного больше, чем их было до минификации. IIFE защитит ваш код, обеспечивая область видимости переменных только в немедленно исполняемых функциях(IIFE), которые оборачивают ваш код.

  ```javascript
  /* избегайте этого */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // функция logger добавлена как глобальная переменная
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // функция storage добавлена как глобальная переменная
  function storage() { }
  ```

  ```javascript
  /**
   * рекомендовано
   *
   * больше нет глобальных переменных
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

  - Замечание: Только для краткости, в остальных примерах мы не будем прописывать синтаксис с функциями IIFE.

  - Замечание: IIFE не дает тестировать приватный код, так как предотвращает доступ к нему, например, регулярные выражения или вспомогательные функции, которые нужно оттестировать в модульных тестах (unit test) напрямую. Как выход, вы можете тестировать через специальные методы, используемые только в тестах (accessible members) или выставить нужные внутренние функции в собственном компоненте. Например, поместите вспомогательные функции, регулярные выражения или константы в собственную фабрику(factory) или константу(constant).

**[К Содержанию](#table-of-contents)**

## Modules

### Избегайте коллизий имен
###### [Style [Y020](#style-y020)]

  - Используйте конвенцию уникальных имен с разделителями для подмодулей.

  *Почему?*: Уникальные имена помогают избежать коллизий в именах модулей. Разделители определяет сам модуль и его подмодульную иерархию. Например, `app` может быть вашим корневым модулем, а модули `app.dashboard` и `app.users` могут использоваться как имена модулей, зависимые от `app`.

### Сеттеры (Setters)
###### [Style [Y021](#style-y021)]

  - Объявляйте модули без переменных, используйте сеттеры (setters).

  *Почему?*: Так как обычно в файле 1 компонент, поэтому вряд ли потребуется вводить переменную для модуля.

  ```javascript
  /* избегайте этого */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Используйте простой синтаксис сеттера.

  ```javascript
  /* рекомендовано */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Геттеры (Getters)
###### [Style [Y022](#style-y022)]

  - Когда нужно использовать модуль, избегайте использования переменных, а используйте вместо этого цепочку геттеров.

  *Почему?*: Так вы производите более читаемый код, а также избегаете утечек и коллизий переменных.

  ```javascript
  /* избегайте этого */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* рекомендовано */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Определение и получение модулей
###### [Style [Y023](#style-y023)]

  -  Определите модуль один раз и получайте его во всех других сущностях.

  *Почему?*: Модуль должен быть определен только один раз, а потом используйте его во всех остальных местах.

    - Используйте `angular.module('app', []);` для определения модуля.
    - Используйте `angular.module('app');` чтобы получить модуль.

### Именованные или Анонимные Функции
###### [Style [Y024](#style-y024)]

  - Используйте именованные функции, не передавайте анонимные функции обратного вызова в качестве параметров.

  *Почему?*: Так вы производите более читаемый код, его легче отлаживать, и это уменьшает число вложенных функций обратного вызова.

  ```javascript
  /* избегайте этого */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* рекомендовано */

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

**[К Содержанию](#table-of-contents)**

## Controllers

### Синтаксис controllerAs в представлении
###### [Style [Y030](#style-y030)]

  - Используйте синтаксис [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/), который работает поверх синтаксиса `классический контроллер со $scope`.

  *Почему?*: Контроллер создается, как JavaScript-объект с ключевым словом "new" и затем предоставляется этот единственный экземпляр объекта. То есть синтаксис `controllerAs` намного ближе и похожее на конструктор языка JavaScript, чем `классический синтаксис $scope`.

  *Почему?*: Это позволяет использовать в представлении связывание на свойство объекта "через точку" (например вместо `name` будет `customer.name`), что является более концептуальным, проще для чтения, и помогает избегать многих ссылочных проблем, которые могут возникнуть без использования "точки".

  *Почему?*: Помогает избежать использование вызовов `$parent` в представлениях с вложенными контроллерами.

  ```html
  <!-- избегайте этого -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- рекомендовано -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### Синтаксис controllerAs в контроллере
###### [Style [Y031](#style-y031)]

  - Используйте синтаксис `controllerAs` поверх синтаксиса `классический контроллер со $scope`.

  - Синтаксис `controllerAs` использует внутри контроллеров ключевую переменную `this`, которая привязывается к `$scope`.

  *Почему?*: `controllerAs` - это только синтаксический сахар поверх `$scope`. Вы все равно можете использовать связывание в представлениях и все равно имеете доступ к методам `$scope`.

  *Почему?*: Избавляет от искушения использования методов `$scope` внутри контроллера, когда это не требуется явно, и это позволяет перенести методы в фабрику(factory). Предпочтительнее использовать `$scope` в фабрике, а в контроллере только если это действительно необходимо. Например, когда мы подписываемся и рассылаем события с помощью [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), or [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) перенесите эти сервисы в фабрику, и вызывайте методы фабрики в контроллере.

  ```javascript
  /* избегайте этого */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* рекомендовано - но изучите следующую секцию */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### Синтаксис controllerAs с переменной vm
###### [Style [Y032](#style-y032)]

  - Сохраните `this` в переменную, когда используете синтаксис `controllerAs`. Выберите постоянное имя для переменной, такое как `vm`, что будет значить ViewModel.

  *Почему?*: Ключевое слово `this` контекстное, и когда его потребуется использовать внутри любой другой функции контроллера, то его содержимое будет другим. Сохранение `this` в переменной `vm` позволит избежать этих проблем.

  ```javascript
  /* избегайте этого */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* рекомендовано */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Замечание: Вы можете избежать любые [jshint](http://www.jshint.com/) предупреждения, если разместите над строкой кода комментарий, как приведенный ниже в примере. Это не требуется, если функция названа с помощью ВерхнегоРегистра(UpperCasing), так как согласно этой конвециии, это значит, что функция является контруктором контроллера Angular.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Замечание: Когда создаете наблюдающие функции(watcher) в контроллерах типа `controller as`, вы можете наблюдать за переменной следующего вида `vm.*`. (Создавайте наблюдающие функции с предупреждением, что они создают дополнительную нагрузку на цикл digest.)

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

### Привязываемые Члены Сверху
###### [Style [Y033](#style-y033)]

  - Помещайте привязываемые члены в верхней части контроллера, в алфавитном порядке, и не раскидывайте их в коде контроллера где попало.

    *Почему?*: Размещение привязываемых членов наверху, упрощает чтение и позволяет мгновенно определить, какие члены контроллера привязаны и используются в представлении.

    *Почему?*: Написание анонимных функций по месту использования может конечно и проще, но когда такие функции содержат много строк кода, то это значительно снижает читабельность кода. Определяйте функции ниже привязываемых членов, тем самым вы перенесете детали реализации вниз отдельно. Функции определяйте как hoisted, то есть они будут подняты наверх области видимости. А привязываемые члены наверху повысят читабельность кода.

  ```javascript
  /* избегайте этого */
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
  /* рекомендовано */
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

  Замечание: Если функция однострочная, то разместите ее и наверху, но так чтобы это не усложняло читабельность.

  ```javascript
  /* избегайте этого */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * эти
           * строки
           * кода
           * ухудшают
           * читабельность
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* рекомендовано */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // одна строка, все OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Определения Функций Для Скрытия Деталей Реализации
###### [Style [Y034](#style-y034)]

  - Используйте определения функций для скрытия деталей реализации. Держите свои привязываемые члены наверху. Если нужно в контроллере сделать функцию привязываемой, укажите это в группе привязываемых членов и ссылайтесь на данную функцию, которая реализована ниже. Это подробно описано в секции Привязываемые Члены Сверху. Подробнее смотрите  [здесь](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Почему?*: Размещение привязываемых членов наверху делает код читабельнее, и позволяет мгновенно определить, какие члены привязаны и используются в представлении. (Выше описано тоже самое.)

    *Почему?*: Размещение деталей реализации функции внизу скрывает эту сложность ниже и таким образом все важные вещи находятся на видном месте сверху.

    *Почему?*: Функции определены как hoisted (определены в самом верху области видимости), поэтому не надо заботиться об их использовании перед объявлением, так как это было бы с объявлениями выражений функций (function expressions).

    *Почему?*: Вам не надо волноваться, о том в каком порядке объявлены функции. Также как и изменение порядка функций не будет ломать код из-за зависимостей.

    *Почему?*: С выражениями функций(function expressions) порядок будет критичен.

  ```javascript
  /**
   * избегайте этого
   * Использование выражений функций (function expressions).
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

  Заметьте, в предыдущем примере важный материал размещен в контроллере в разных местах. А в примере ниже, все важные моменты размещены сверху, в нашем случае, это члены, привязанные к контроллеру такие как `vm.avengers` и `vm.title`. Подробности реализации смещены вниз. Такой код проще читать.

  ```javascript
  /*
   * рекомендовано
   * Объявления функций и
   * привязанные члены смещены вверх.
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

### Логика Контроллера Отдельно
###### [Style [Y035](#style-y035)]

  - Переносите логику контроллера в сервисы и фабрики.

    *Почему?*: Логика может использоваться несколькими контроллерами, если она помещена в сервис и выставлена в виде функции.

    *Почему?*: Вся логика в сервисе может быть легко изолирована в модульном тесте, а вызовы этой логики в контроллере могут фиктивно реализованы (mocked).

    *Почему?*:  Из контроллера удаляются зависимости и скрываются подробности реализации.

  ```javascript

  /* избегайте этого */
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
  /* рекомендовано */
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

### Один Контроллер - Одно Представление
###### [Style [Y037](#style-y037)]

  - Определяйте контроллер для одного представления, и не пытайтесь использовать этот контроллер для других представлений. Вместо этого, выносите повторно используемую логику в фабрики. Старайтесь держать контроллер простым и сфокусированным только на свое представление.

    *Почему?*: Использование контроллера с несколькими представлениями хрупко и ненадежно. А для больших приложений  требуется хорошее покрытие тестами end to end (e2e) для проверки стабильности.

### Получение Контроллеров
###### [Style [Y038](#style-y038)]

  - Когда контроллер и его представление уже создано, и если нужно что-то повторно использовать (контроллер и представление), определяйте экземпляр контроллера вместе с его маршрутом (route).

    Замечание: Если представление загружается не через маршрут, тогда используйте синтаксис `ng-controller="Avengers as vm"`.

    *Почему?*: Указание экземпляра контроллера в определении маршрута позволяет различным маршрутам вызывать различные пары контроллеров и представлений. А когда контроллеры указаны в представлении с помощью [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), то представление будет всегда ассоциировано с одним и тем же контроллером.

 ```javascript
  /* избегайте этого - когда используется маршрут и необходимо динамическое назначение контроллера и представления */

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
  /* рекомендовано */

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

**[К Содержанию](#table-of-contents)**

## Services

### Синглтоны
###### [Style [Y040](#style-y040)]

  - Сервисы создаются с помощью ключевого слова `new`. Используйте `this` для публичных методов и переменных. Так как они очень похожи на фабрики, то используйте фабрики для согласованности.

    Замечание: [Все Angular сервисы являются синглтонами](https://docs.angularjs.org/guide/services). Это значит, что создается только один экземпляр сервиса на один инжектор.

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

**[К Содержанию](#table-of-contents)**

## Factories

### Единственная Обязанность (Single Responsibility)
###### [Style [Y050](#style-y050)]

  - Фабрики дожны иметь [единственную обязанность](http://en.wikipedia.org/wiki/Single_responsibility_principle), это следует из их контекста. Если фабрика начинает превышать ту цель для которой она создана, то нужно создать другую фабрику.

### Синглтон
###### [Style [Y051](#style-y051)]

  - Фабрики это синглтоны, которые возвращают объект, содержащий свойства и методы сервиса.

    Замечание: [Все Angular сервисы являются синглтонами](https://docs.angularjs.org/guide/services).

### Доступные Члены Наверх
###### [Style [Y052](#style-y052)]

  - Помещайте вызываемые члены сервиса (интерфейс) наверх, используя технику  [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *Почему?*: Размещение вызываемых членов в верхней части улучшает читабельность и дает вам возможность быстро определить, какие члены сервиса могут быть вызваны и должны быть модульно оттестированы (либо фиктивно имплементированы - mocked).

    *Почему?*: Это особенно полезно, когда файл становится очень длинным, и вынуждает прокручивать текст кода, чтобы посмотреть, какие методы или свойства сервис предоставляет.

    *Почему?*: Размещение функций в обычном прямом порядке может быть и проще, но когда эти функции становятся многострочными, это снижает читабельность и вынуждает много скроллить. Определяя вызываемый интерфейс(в виде возвращаемого сервиса), вы убираете детали реализации вниз. А размещенный сверху интерфейс улучшает читабельность.

  ```javascript
  /* избегайте этого */
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
  /* рекомендовано */
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

Такой способ привязки реализовывается во всем объекте, и приватные члены не моут быть изменены из-за примененного паттерна  Revealing Module.

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Определения Функций для Скрытия Деталей Реализации
###### [Style [Y053](#style-y053)]

  - Используйте определения функций, чтобы скрыть детали реализации. Держите вызываемые члены фабрики в верхней части. Свяжите их с определениями функций, которые расположены ниже в файле. Подробную информацию смотрите [здесь](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Почему?*: Размещение вызываемых членов в верхней части улучшает читабельность и помогает быстро определить, какие функции фабрики могут быть вызваны извне.

    *Почему?*: Размещение функций с деталями реализации в нижней части файла выносит сложные вещи из поля зрения, так что только важные детали вы видите в верхней части файла.

    *Почему?*: Функции определены в самом верху области видимости (hoisted), то есть их можно вызывать до их определения. (что было бы не возможно с выражениями функций)

    *Почему?*: Вам не надо беспокоиться о порядке определений функций. Перестановка зависимых друг от друга функций не ломает код.

    *Почему?*: А для выражений функций порядок критичен.

  ```javascript
  /**
   * избегайте этого
   * Использование выражений функций
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
          // детали реализации здесь
      };

      var getAvengerCount = function() {
          // детали реализации здесь
      };

      var getAvengersCast = function() {
         // детали реализации здесь
      };

      var prime = function() {
         // детали реализации здесь
      };

      var ready = function(nextPromises) {
          // детали реализации здесь
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
   * рекомендовано
   * Использование определений функций
   * и вызываемые члены расположены в верхней части.
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
          // детали реализации здесь
      }

      function getAvengerCount() {
          // детали реализации здесь
      }

      function getAvengersCast() {
          // детали реализации здесь
      }

      function prime() {
          // детали реализации здесь
      }

      function ready(nextPromises) {
          // детали реализации здесь
      }
  }
  ```

**[К Содержанию](#table-of-contents)**

## Data Services

### Отделите вызовы данных
###### [Style [Y060](#style-y060)]

  - Делайте рефакторинг логики работы с данными и взаимодействия этих данных с фабрикой. Создавайте сервисы данных, ответственных за вызовы XHR, локальное хранилище(local storage), работу с памятью или за любые другие операции с данными.

    *Почему?*: Ответственность контроллера - это предоставление или сбор информации для представления. Он не должен заботиться о том, как работать с данными, он только должен знать кого попросить об этом. В сервисы для данных переносится вся логика работы с данными. Это делает контроллер более простым и более сфокусированным для работы с представлением.

    *Почему?*: Это позволяет более проще тестировать (фиктивно или реально) вызовы данных в контроллере, который использует сервис для данных.

    *Почему?*: Реализация сервиса данных может иметь очень специфичный код для операций с хранилищем данных. Могут использоваться заголовки для взаимодействовия с данными, или другие сервисы типа $http. Логика в сервисе данных инкапсулируется в одном месте и скрывает реализацию для внешних потребителей (контроллеров), также будет гораздо проще изменить реализацию в случае необходимости.

  ```javascript
  /* рекомендовано */

  // фабрика сервиса данных
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

    Замечание: Сервис данных вызывается потребителем (контроллером), и скрывает реализацию от потребителя. Это показано ниже.

  ```javascript
  /* рекомендовано */

  // контроллер вызывает фабрику сервиса данных
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

### Возвращение Объекта Promise для Контроллера
###### [Style [Y061](#style-y061)]

  - Если сервис данных возвращает promise типа $http, то в вызывающей функции возвращайте promise тоже.

    *Почему?*: Вы можете объединить в цепочку объекты promise, и после того как вызов данных закончится, выполнить дальнейшие действия для принятия или отклонения объекта promise.

  ```javascript
  /* рекомендовано */

  activate();

  function activate() {
      /**
       * Шаг 1
       * Запрашиваем функцию getAvengers function
       * для получения данных и ждем promise
       */
      return getAvengers().then(function() {
          /**
           * Шаг 4
           * Выполняем действие принятия финального объекта promise
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Шаг 2
         * Запрашиваем сервис для данных
         * и ждем promise
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Шаг 3
                 * инициализируем данные и принимаем promise
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[К Содержанию](#table-of-contents)**

## Directives
### Одна Директива - Один Файл
###### [Style [Y070](#style-y070)]

  - Создавайте только одну директиву в файле. Называйте файл именем директивы.

    *Почему?*: Конечно можно поместить директивы в один файл. Но потом их трудно будет разделить по приложениям, и по модулям. Например, нужна будет только одна из директив для определенного модуля.

    *Почему?*: Одну директиву в файле легче поддерживать.

  ```javascript
  /* избегайте этого */
  /* directives.js */

  angular
      .module('app.widgets')

      /* директива для заказа, которая специфична для модуля заказов */
      .directive('orderCalendarRange', orderCalendarRange)

      /* директива продажи, которая может быть использована везде в модуле продаж */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* директива крутилки (spinner), которая может быть использована во всех модулях */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* детали реализации */
  }

  function salesCustomerInfo() {
      /* детали реализации */
  }

  function sharedSpinner() {
      /* детали реализации */
  }
  ```

  ```javascript
  /* рекомендовано */
  /* calendarRange.directive.js */

  /**
   * @desc директива заказа, которая специфична модулю заказов в компании Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* детали реализации */
  }
  ```

  ```javascript
  /* рекомендовано */
  /* customerInfo.directive.js */

  /**
   * @desc директива продажи, которая может быть использована везде в модуле продаж компании Acme
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
  /* рекомендовано */
  /* spinner.directive.js */

  /**
   * @desc директива крутилки (spinner), которая может быть использована во всех модулях компании Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* детали реализации */
  }
  ```

    Замечание: Существует много способов для именования директив, особенно это зависит от широты области использования (локально или глобально). Выбирайте тот способ, который определяет директиву и ее файл четко и ясно. Несколько примеров будет ниже, но в основном смотрите рекомендации в секции именований.

### Манипулирование Элементами DOM в Директиве
###### [Style [Y072](#style-y072)]

  - Используйте директивы, если нужно манипулировать элементами DOM напрямую. Но если существуют альтернативные способы, то используйте лучше их. Например, для изменения стилей используйте CSS, для эффектов [сервисы анимации](https://docs.angularjs.org/api/ngAnimate), для управления видимостью используйте [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) и [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide).

    *Почему?*: Манипулирование элементами DOM тяжело тестить, отлаживать, и зачастую существуют более лучшие способы для реализации поставленной задачи (например CSS, анимации, шаблоны)

### Добавляйте Директивам Уникальный Префикс
###### [Style [Y073](#style-y073)]

  - Добавляйте директивам короткий, уникальный, пояснительный префикс, такой как `acmeSalesCustomerInfo`, директива будет объявлена в HTML как `acme-sales-customer-info`.

    *Почему?*: Уникальный короткий префикс говорит о контексте и происхождении директивы. Например, префикс `cc-` может рассказать нам, что директива является частью приложения CodeCamper, а `acme-` это директива для компании Acme.

    Замечание: Не используйте префикс `ng-` для своих директив, так как он зарезервирован для директив AngularJS. Также исследуйте префиксы широко используемых директив для избежания конфликтов имен, например, префикс `ion-` используется для директив [Ionic Framework](http://ionicframework.com/).

### Ограничивайте Элементы и Атрибуты
###### [Style [Y074](#style-y074)]

  - При создании директивы, которая планируется как самостоятельный элемент, применяйте ограничение `E` (разработано, как элемент) или по необходимости ограничение `A` (разработано, как атрибут). В основном, если директива разрабатывается как элемент, ограничения `E` вполне достаточно. Хотя Angular позволяет использовать `EA`, но все же лучше определится как реализовывать директиву, либо как самостоятельный отдельный элемент, либо как атрибут для улучшения функциональности существующего DOM-элемента.

    *Почему?*: Это имееет смысл.

    *Почему?*: Конечно мы можем использовать директиву в атрибуте class, но если директива действует как элемент, то лучше объявлять ее как элемент, ну или по крайней мере как атрибут.

    Замечание: EA используется по умолчанию для Angular 1.3 +

  ```html
  <!-- избегайте этого -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* избегайте этого */
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
  <!-- рекомендовано -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* рекомендовано */
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

### Директивы и ControllerAs
###### [Style [Y075](#style-y075)]

  - Используйте синтактис`controller as` в директиве, чтобы директива была согласована с использованием синтаксиса `controller as` в паре контроллера и представлении.

    *Почему?*: Это имет смысл и не так сложно.

    Замечание: Директива ниже демонстрирует некоторые способы, при которых вы можете использовать объект $scope внутри ссылки и контроллере директивы. Я сделал инлайновый шаблон для того, чтобы держать все в одном месте.

    Замечание: Что касается внедренной зависимости, смотрите [Определение зависимостей вручную](#manual-annotating-for-dependency-injection).

    Замечание: Заметьте, что контроллер директивы находится снаружи самой директивы. Такой подход исключает проблемы, когда инжектор создается в недосягаемом кодe после, например, 'return'.

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
      // Внедрение $scope сразу для параметра сравнения
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

**[К Содержанию](#table-of-contents)**

##  Resolving Promises for a Controller

###  Активация объектов promise в контроллере
###### [Style [Y080](#style-y080)]

  - Размещайте стартовую начальную логику для контроллера в функции `activate`.

    *Почему?*: Размещение стартовой логики в согласованом месте контроллера позволяет ее быстрее находить, более согласованно тестить, и позволить не разбразывать по всему контроллеру логику активации.

    *Почему?*: Функция `activate` делает удобным повторное использование логики для обновления контроллера/представления, держит все логику вместе, делает более быстрой работу пользователя с представлением, делает анимацию более простой в директивами `ng-view` и `ui-view`, ну и делает ориентирование разработчика в коде более энергичным и быстрым.

    Замечание: Если вам нужно при каком-то условии отменить маршрут перед началом использования контроллера, используйте для этого [route resolve](#style-y081).

  ```javascript
  /* избегайте этого */
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
  /* рекомендовано */
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

### Работа с Объектами Promise в Маршрутах
###### [Style [Y081](#style-y081)]

  - Если контроллер зависит от объекта promise, от результата которого зависит активация контроллера, то разрешайте/получайте эти зависимости в `$routeProvider`, перед тем как логика контроллера будет выполена. Если вам нужно по какому-то условию отменить маршрут перед активацией контроллера, то используйте обработчик маршрутов.

  - Используйте обработчик маршрутов, если вы решили в последствии отменить маршут до перехода к представлению.

    *Почему?*: Контроллер может потребовать данные перед своей загрузкой. Эти данные могут прийти из promise объекта через пользовательскую фабрику или [$http](https://docs.angularjs.org/api/ng/service/$http). Использование [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) дает возможность объекту promise разрешиться перед тем, как логика контроллера выполнится, тогда мы сможем выполнить действие, зависящее от результата объекта promise.

    *Почему?*: Код выполняется после маршрута и в активационной функции контроллера. После этого, сразу же начинает загружаться представление. Связывание данных начинается, когда активационнный объект promisе разрешился/выполнился. Анимация "прогресса" может быть показана время передачи представления (via ng-view or ui-view).

    Замечание: Код запускается перед маршрутом через объект promise. Отклонение promise отменяет маршрут. Разрешение заставляет ожидать новое представление, когда маршрут разрешится. Анимация “прогресса” может быть показана перед разрешением и через передачу представления. Если вам нужно получить представление быстрее и вам не нужна точка решения, получать ли представление, используйте тогда [controller `activate` technique](#style-y080).

  ```javascript
  /* избегайте этого */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // не определено
      vm.movies;
      // определено асинхронно
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }
  ```

  ```javascript
  /* это лучше */

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

    Замечание: В примере ниже показано, как разрешение маршрута указывает на именованную функцию, которую легче отлаживать и легче оперировать встроенной зависимостью.

  ```javascript
  /* еще лучше */

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
    Замечание: Пример кода зависимости от `movieService` не безопасен для минификации. Подробности от том как сделать этот код безопасным для минификации, смотрите секции [dependency injection](#manual-annotating-for-dependency-injection) и [minification and annotation](#minification-and-annotation).

**[К Содержанию](#table-of-contents)**

## Manual Annotating for Dependency Injection

### Уязвимости от Минификации
###### [Style [Y090](#style-y090)]

  - Избегайте объявления зависимостей без использования безопасного для минификации подхода.

    *Почему?*: Параметры для компонент (типа контроллер, фабрика и т.п.) будут преобразованы в усеченные переменные. Например, `common` и `dataservice` превратятся `a` или `b` и не будут найдены средой AngularJS.

    ```javascript
    /* избегайте этого - не безопасно для минификации */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    После минификации будут производится усеченные переменные и это будет вызывать ошибки выполнения.

    ```javascript
    /* избегайте этого- не безопасно для минификации */
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Определяйте Зависимости Вручную
###### [Style [Y091](#style-y091)]

  - Используйте `$inject` для ручного определения ваших зависимостей для AngulaJS.

    *Почему?*: Этот техника отражает технику использованную в [`ng-annotate`](https://github.com/olov/ng-annotate), которую я рекомендую для автоматического создания зависимостей, безопасных для минификации. Если `ng-annotate` обнаруживает вставку(injection), которая уже была, то она не будет продублирована.

    *Почему?*: Это гарантирует вашим зависимостям защиту от повреждений, которую может нанести минификация, путем урезания и укорачивания переменных. Например, `common` и `dataservice` превратятся `a` и `b`, и не будут найдены средой AngularJS.

    *Почему?*: Избегайте создания однострочных зависимостей в виде длинных списков, которые трудно читаемы в массиве. Еще в вводят в конфуз, то что такие массивы состоят из элементов строк, а последний элемент - это функция.

    ```javascript
    /* избегайте этого */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* избегайте этого */
    angular
      .module('app')
      .controller('Dashboard',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* рекомендовано */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Замечание: Если функция снизу является возращаемым значением, то $inject может быть недостижымым (это может случится в директиве). Это можно решить перемещением $inject выше, чем возращаемое значение, либо использовать альтернативный синтаксис массива вставок.

    Замечание: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) ввело возможность, когда `$inject` переносится туда, где оно доступно.

    ```javascript
    // внутри определения директивы
    function outer() {
        return {
            controller: DashboardPanel,
        };

        DashboardPanel.$inject = ['logger']; // Недоступный код
        function DashboardPanel(logger) {
        }
    }
    ```

    ```javascript
    // внутри определения директивы
    function outer() {
        DashboardPanel.$inject = ['logger']; // Доступный код
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Определяйте Маршрутных Обработчиков Зависимостей Вручную
###### [Style [Y092](#style-y092)]

  - Используйте $inject, чтобы вручную определить ваш маршрутный обработчик зависимостей для компонентов AngularJS.

    *Почему?*: Эта техника убирает анонимные функции для маршрутных обработчиков, делая чтение такого код проще.

    *Почему?*: Оператор $inject` может предшествовать обработчику для того, чтобы сделать любую минификацию зависимостей безопасной.

    ```javascript
    /* рекомендовано */
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

    moviePrepService.$inject = ['movieService'];
    function moviePrepService(movieService) {
        return movieService.getMovies();
    }
    ```

**[К Содержанию](#table-of-contents)**

## Minification and Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Используйте [ng-annotate](//github.com/olov/ng-annotate) для [Gulp](http://gulpjs.com) или [Grunt](http://gruntjs.com) и комментируйте функции, которые нуждаются в автоматической вставке зависимостей, используйте `/** @ngInject */`.

    *Почему?*: Это гарантирует, что в вашем коде нет зависимостей, которые не используют защиту для повреждений от минификации.

    *Почему?*: [`ng-min`](https://github.com/btford/ngmin) не рекомендуется для применения, выводится из употребления

    >Я предпочитаю Gulp, так как для меня он проще для чтения, написания кода и отладки.

    Следующий код не использует защиту зависимостей от минификации.

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

    Если код выше запустить через ng-annotate, то будет произведен код с аннотацией `$inject`, и код станет устойчив к минификации.

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

    Замечание: Если `ng-annotate` обнаруживает вставки которые уже сделаны (например `@ngInject` был обнаружен), он не будет дублирован в коде `$inject`.

    Замечание: Если используется маршрутный обработчик, то вы можете перед встраиваемой функцией подставить `/* @ngInject */` и это будет производить корректный аннотационный код, делающий каждую вставленную зависимость безопасной для минификации.

    ```javascript
    // Используем @ngInject аннотацию
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

    > Замечание: Начиная с Angular 1.3 используйте [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) директивный параметр `ngStrictDi`. При наличии инжектора будет создан режим "strict-di", который не даст приложению работать, если обнаружит функции, которые не используют явные аннотации (например, для защиты от минификации). Отладочная информация будет отображаться в консоли, чтобы помочь разработчику выявить код, ломающий приложение.
    `<body ng-app="APP" ng-strict-di>`

### Используйте Gulp или Grunt для ng-annotate
###### [Style [Y101](#style-y101)]

  - Используйте [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) или [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) для автоматических билдов. Вставляйте `/* @ngInject */` перед любой функцией, которая имеет зависимости.

    *Почему?*: ng-annotate будет отлавливать большинство зависимостей, но иногда требуются вставлять подсказки в виде синтаксиса `/* @ngInject */`.

    Следующий код является примером gulp задания с использованием ngAnnotate.

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

**[К Содержанию](#table-of-contents)**

## Exception Handling

### декораторы
###### [Style [Y110](#style-y110)]

  - Используйте [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), во время конфигурации, применяя сервис [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), пользовательские действия будут происходить в сервисе [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler), если произойдут исключения.

    *Почему?*: Это дает постоянный надежный способ обработки необработанных исключений Angular во время разработки и во время выполнения.

    Замечание: Другим способом является переопределение сервиса, вместо использования декоратора. Это прекрасный способ, но если вы хотите сохранить поведение по умолчанию, и просто дополнить это поведение, то декоратоор крайне рекомендуем.

    ```javascript
    /* рекомендовано */
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
             * Здесь можно добавить ошибку в сервисную коллекцию,
             * добавить ошибки в $rootScope, логировать ошибки на удаленный сервер
             * или записывать их локально. Или просто бросить ошибку дальше. Это полностью зависит от вас.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Обработчики Исключений
###### [Style [Y111](#style-y111)]

  - Создайте фабрику, которая предоставит интерфейс для перехвата и изящной обработки исключений.

    *Почему?*: Это дает постоянный и надежный способ для перехвата исключений, которые могут возникнуть в вашем коде (например, во время вызовов объекта XHR или сбоев в работе объектов promise).

    Замечание: Перехватчик исключений хорош для отлавливания и реагирования на специфические исключения для вызовов, про которые вы точно знаете, что они могут бросить только одно исключение. Например, вы делаете вызов XHR для получения данных с удаленного сервера и хотите поймать все исключения этого сервиса и обработать их индивидуально.

    ```javascript
    /* рекомендовано */
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

### Маршрутные ошибки
###### [Style [Y112](#style-y112)]

  - Обрабатывайте и логгируйте все маршрутные ошибки используя [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Почему?*: Это дает постоянный и устойчивый способ обработки всех маршрутных ошибок.

    *Почему?*: Потенциально мы получим лучший способ обработки маршрутных ошибок и научимся перенаправлять их на более дружественный экран описания ошибки с большими подробностями и указаниями к восстановлению до нормальной ситуации.

    ```javascript
    /* рекомендовано */
    function handleRoutingErrors() {
        /**
         * Отмена маршрута:
         * Во время маршрутной ошибки, мы переходим на информационную панель.
         * Не забудьте реализовать выход, если происходит попытка перехода дважды.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                /**
                 * Опционально мы можем записать логи, используя пользовательский сервис или $log.
                 * (Не забудьте инжектировать пользовательский сервис)
                 */
                logger.warning(msg, [current]);
            }
        );
    }
    ```

**[К Содержанию](#table-of-contents)**

## Naming

### Рекомендации для именований
###### [Style [Y120](#style-y120)]

  - Используйте согласованные имена для всех компонентов по шаблону, который описывает особенность(feature) компонента, а затем (опционально) его тип. Я рекомендую шаблон - `feature.type.js`. Существует два типа имен для большинства случаев:
    * имя файла (`avengers.controller.js`)
    * имя компонента, которое зарегистрировано Angular (`AvengersController`)

    *Почему?*: Соглашения об именованиях дает постояннный надежный способ поиска содержимого быстрым беглым взглядом. Согласованность в проекте жизненно важна. Согласованность в команде очень важна. Согласованность между компаниями дает огромную эффективность.

    *Почему?*: Соглашения об именованиях просто должны помочь найти вам свой код быстрее, и сделать его проще для понимания.
### Характерные Имена Файлов
###### [Style [Y121](#style-y121)]

  - Используйте согласованные имена для всех компонентов используя шаблон, который описывает компонентную особенность, затем опционально его тип. Я рекомендую шаблон - `feature.type.js`.

    *Почему?*: Это надежный способ для быстрой идентификации компонентов.

    *Почему?*: Автоматизирует рабочий процесс.

    ```javascript
    /**
     * общие настройки
     */

    // Контроллеры
    avengers.js
    avengers.controller.js
    avengersController.js

    // Сервисы/Фабрики
    logger.js
    logger.service.js
    loggerService.js
    ```

    ```javascript
    /**
     * рекомендовано
     */

    // контроллеры
    avengers.controller.js
    avengers.controller.spec.js

    // сервисы/фабрики
    logger.service.js
    logger.service.spec.js

    // константы
    constants.js

    // определение модуля
    avengers.module.js

    // маршруты
    avengers.routes.js
    avengers.routes.spec.js

    // конфигурация
    avengers.config.js

    // директивы
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

  Замечание: Другим общим соглашением является именование файлов контроллера без слова `controller`, например, называем файл `avengers.js` вместо `avengers.controller.js`. Все остальные соглашения все же должны содержать суффикс типа. Просто контроллеры наиболее общий тип компонентов, и таким образом, мы экономим время печатая имя, но контроллеры все равно прекрасно идентифицируются. Я рекомендую выбрать один тип соглашения и быть на одной волне со своей командой.

    ```javascript
    /**
     * рекомендовано
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Имена Тестовых Файлов
###### [Style [Y122](#style-y122)]

  - Имя тестовой спецификации подобно имени компонента, которая его тестит, только к ней еще добавляется суффикс `spec`.

    *Почему?*: Это надежный способ для быстрой идентификации компонентов.

    *Why?*: Это шаблон соответствующий [karma](http://karma-runner.github.io/) или другим движкам для запуска тестов.

    ```javascript
    /**
     * рекомендовано
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Имена Контроллеров
###### [Style [Y123](#style-y123)]

  - Используйте согласованные имена для всех контроллеров, именованных по их характерной особенности. Используйте  UpperCamelCase (ВерхнийВерблюжийРегистр) для контроллеров, так как они являются конструкторами.

    *Почему?*: Это дает надежный и понятный способ для быстрой идентификации и применения контроллеров.

    *Почему?*: UpperCamelCase является традиционным форматом для идентификации объектов, которые могут быть созданы с помощью конструктора.

    ```javascript
    /**
     * рекомендовано
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers() { }
    ```

### Суффикс Имени Контроллера
###### [Style [Y124](#style-y124)]

  - Добавляйте к имени контроллера суффикс `Controller` или не добавляйте. Выберите одно правило т придерживайтесь его везде.

    *Почему?*: Суффикс `Controller` более общеупотребим и наиболее явно описателен.

    *Почему?*: Если не указывать суффикс, то получатся более краткие имена, но контроллеры все равно будут легко идентифицируемы, даже без суффикса.

    ```javascript
    /**
     * рекомендовано: Вариант 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers() { }
    ```

    ```javascript
    /**
     * рекомендовано: Вариант 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Имена Фабрик
###### [Style [Y125](#style-y125)]

  - Используйте согласованные имена для всех фабрик, именуйте их по характерной особенности. Используйте camel-casing для сервисов и фабрик.

    *Почему?*: Это дает надежный и понятный способ для быстрой идентификации и применения фабрик.

    ```javascript
    /**
     * рекомендовано
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

### Имена Директивных Компонент
###### [Style [Y126](#style-y126)]

  - Используйте согласованные имена для всех директив, применяя camel-case. Добавляйте короткий префикс для описания области, которой эти директивы принадлежат (иногда это может быть префикс компании, иногда префикс проекта).

    *Почему?*: Это дает надежный и понятный способ для быстрой идентификации и применения компонент.

    ```javascript
    /**
     * рекомендовано
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // применять так <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Модули
###### [Style [Y127](#style-y127)]

  - Если разрабатываются несколько модулей, файл главного модуля будет называться `app.module.js`, а другие модули получат свое название по своему назначению (то что они представляют). Например, модуль администрирования будет назван `admin.module.js`. Соответствующие зарегистрированные имена модулей будут `app` и `admin`.

    *Почему?*: Это дает согласованность для многих модулей приложения, а также позволяет расширяться в огромные приложения.
    *Почему?*: Получаем простой способ автоматизировать работу для первоначальной загрузки всех модульных определений, а затем уже остальных файлов angular.

### Конфигурация
###### [Style [Y128](#style-y128)]

  - Отделяйте конфигурационную информацию от модуля в отдельном файле, называйте такой файл по названию модульного файла. Конфигурационный файл для главного `app` модуля называем `app.config.js` (или просто `config.js`). Конфигурацию для модуля `admin.module.js` называем соответственно `admin.config.js`.

    *Почему?*: Конфигурация отделяется от определения модуля, компонентов и активного кода.

    *Почему?*: Мы получаем идентифицируемое место для установки конфигурации модуля.

### Маршруты
###### [Style [Y129](#style-y129)]

  - Выделяйте конфигурацию маршрута в свой собственный файл. Примеры могут быть такими: `app.route.js` для главного модуля и `admin.route.js` для модуля `admin`. Даже в маленьких приложениях я предпочитаю такое разделение от остальной конфигурации.

**[К Содержанию](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT
###### [Style [Y140](#style-y140)]

  - Структура вашего приложения должна быть построена таким образом, чтобы вы могли: `L` - размещать ваш код быстро (`L`ocate your code quickly), `I` - идентифицировать код практически с первого взгляда (`I`dentify the code at a glance), `F` - держать структуру плоской, насколько это возможно (keep the `F`lattest structure you can), и стараться оставаться DRY (Don’t Repeat Yourself) - Не Повторяйте Себя - (`T`ry to stay DRY - Don’t Repeat Yourself). Структура должна придерживаться этим основным 4 правилам.

    *Почему LIFT?*: Получаем согласованную структуру, которая хорошо масштабируется, разбита на модули, и легко позволяет увеличить эффективность разработчика, путем быстрого нахождения кода. Другой способ проверить структуру вашего приложения - это спросить себя: Как быстро я могу открыть все сооответствующие файлы, чтобы работать над нужной функциональностью?

    Когда я чувствую, что работать с моей структурой некомфортно, я возвращаюсь к принципам LIFT.

    1. `L`Размещать наш код легко  (`L`ocating our code is easy)
    2. `I`Идентифицировать код быстро (`I`dentify code at a glance)
    3. `F`Держать структуру ровной как можно дольше (`F`lat structure as long as we can)
    4. `T`Старайтесь оставаться DRY или T-DRY (Don’t Repeat Yourself)  - Не Повторяйте Себя (`T`ry to stay DRY - Don’t Repeat Yourself)

### Размещение
###### [Style [Y141](#style-y141)]

  - Размещайте свой код интуитивно, просто и быстро.

    *Почему?*: Я считаю, это должно быть супер важно для проекта. Если команда не может быстро найти файлы, с которыми нужно работать, то команда не будет работать настолько эффективно, насколько это возможно. Такая структура должна быть изменена. Если не можете найти файл по имени, а также сопутствующие файлы, тогда поместите их в наиболее интуитивно подходящее место, рядом друг другом, и это сэкономит кучу времени. Описательная структура папок может помочь с этим.

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

### Идентификация
###### [Style [Y142](#style-y142)]

  - Когда вы смотрите на файл вы должны мгновенно знать и понимать, что он содержит и представляет.

    *Почему?*: Вы потратите меньше времени на охоту и клевание кода, и станете более эффективным. Если для этого потребуется более длинные имена файлов, то пусть будет так. Делайте имена файлов описательными, и держите в файле только один компонент. Не размещайте в файле несколько контроллеров, несколько сервисов или вообще смесь всего. Могут быть конечно отклонения от правила одного компонента в файле, напрмер, когда я прописываю в одном файле очень маленькие сущности, которые связаны друг с другом, но они все равно очень легко идентифицируемы.

### Плоская структура
###### [Style [Y143](#style-y143)]

  - Держите структуру папок плоской, как можно дольше. Когда у вас больше 7 файлов, начните думать о разделении.

    *Почему?*: Никто не хочет искать файл в семи уровнях папок. Вспомните о меню на веб-сайтах … все что глубже второго уровня требует серьезного размышления. В организации структуры папок нет жестких правил, но если папка содержит 7-10 файлов, нужно делать подпапку. Основывайтесь на уровне вашего комфорта. Используйте плоскую структуру, пока не станет точно очевидно, что нужно создать новую папку (и это поможет соблюсти принципы LIFT).

### T-DRY (Try to Stick to DRY) T-DRY (Старайтесь придерживаться принципов DRY)
###### [Style [Y144](#style-y144)]

  - Примечание переводчика: Аббревиатура DRY значит Don`t Repeat Yourself (Не повторяйте себя).

  - Придерживайтесь DRY, но не сходите с ума и не жертвуйте читабельностью.

    *Почему?*: Быть DRY - это важно, но не критично, если в жертву приносятся другие принципы LIFT. Поэтому я и назвал это T-DRY (Try DRY - попытайтесь быть DRY). Напрмер, я не хочу печатать session-view.html для представления, потому что и так понятно, что это представление(view). Но если это не очевидно или это определено соглашением, тогда нужно давать полное  имя.

**[К Содержанию](#table-of-contents)**

## Application Structure

### Общее руководство
###### [Style [Y150](#style-y150)]

  - Имейте короткую перспективу реализации и долгосрочное видение проекта. Другими словами, начинайте с малого, но держите всегда в голове, куда развивается ваше приложение. Весь код приложения идет в корневую папку `app`. Все содержимое распределяется, как один компонент на один файл. Каждый контроллер, сервис, модуль, представление - каждый в своем файле. Все скрипты сторонних производителей помещаются в другую корневую папку, а не в папку `app`. Я их не писал и я не хочу, чтобы они загромождали мое приложение (`bower_components`, `scripts`, `lib`).

    Замечание: Найти более подробную информацию и объяснение структуры: [тут оригинальная статья о структуре приложения](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Общие элементы
###### [Style [Y151](#style-y151)]

  - Размещайте компоненты, которые определяют общий каркас приложения в папке `layout`. Там могут быть представление-оболочка и контроллер, которые являются контейнером для приложения, навигация, меню, регионы содержимого (content areas) и другие общие элементы.

    *Почему?*: Так организуются все элементы общего назначения, которые размещаются в одном месте и используются во всем приложении.

### Структура Папки-по-Функциональностям (Folders-by-Feature)
###### [Style [Y152](#style-y152)]

  - Создавайте папки и называйте их по функциональным особенностям, которые они представляют и реализуют. Если папка растет и превышает семь файлов, то начинайте рассматривать возможность создания новой папки. Ваш порог может быть разный, так что регулируйте такую структуру по необходимости.

    *Почему?*: Разработчик легко ориентируется в коде, быстро определяет, что каждый файл реализует. В приложении поддерживается плоская структура, насколько это возможно. Повторяющиеся и избыточные имена отсутствуют.

    *Почему?*: Правила LIFT выполнены все.

    *Почему?*: Помогает уменьшить приложение, путем устранения неразберихи. Содержимое организуется понятно и соблюдаются принципы LIFT.

    *Почему?*: Когда набралось много файлов (более 10), то их размещение в структуре последовательных согласованных папок намного проще, чем в плоской структуре .

    ```javascript
    /**
     * рекомендовано
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

      ![Пример Структуры Приложения](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Замечание: Не используйте структуру папки-по-типу. Так файлы одной функциональности разбрасываются по нескольким папкам, и далее все быстро становится очень громоздким. Как только в приложении создаются 5, 10, или 25+ представлений и контроллеров (и других компонентов), то работа становится очень сложной, в отличиии от структуры папки-по-функциональностям.

    ```javascript
    /*
    * избегайте этого
    * Альтернативный способ "папки-по-типу".
    * Я рекомендую "папки-по-функциональностям".
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
            dataservice.j
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

**[К Содержанию](#table-of-contents)**

## Modularity

### Много Маленьких Самодостаточных Модулей
###### [Style [Y160](#style-y160)]

  - Создавайте небольшие модули, которые включают в себя одну ответственность.

    *Почему?*: Модульные приложения позволяют легко подключать и отключать модули, это дает командам разработчиков строить вертикальные срезы приложения и раскатывать их постепенно. Это значит, мы можем добавлять новые модули в приложение по мере их готовности.

### Создайте Модуль Приложения
###### [Style [Y161](#style-y161)]

  - Создайте корневой модуль приложения, который будет собирать вместе все модули и функциональности вашего приложения. Назовите этот модуль именем вашего приложения.

    *Почему?*: Angular специально разработан для поддержки модульности и принципов разделения сущностей. А создание корневого модуля приложения, который связывает все ваши остальные модули вместе, предоставляет очень простой способ добавления и удаления модулей из приложения.

### Держите Модуль Приложения Тонким
###### [Style [Y162](#style-y162)]

  - Поместите в модуль приложения только логику сборки приложения. Функциональности оставте в их собственных модулях.

    *Почему?*: Добавление дополнительных ролей в корень приложения, типа получения или удаления данных, отображение представлений или другой подобной логики, не связанной со сборкой частей приложения вместе, загрязняет модуль приложения, а сами добавленные функциональности будет труднее повторно использовать или отключить.

    *Почему?*: Модуль приложения становится манифестом, который описывает какие модули подключаются к приложению.

### Функциональные Области и Модули
###### [Style [Y163](#style-y163)]

  - Создавайте модули, которые представляют функциональные области, такие как папка общей компоновки (layout), повторно используемые и общие сервисы, информационные панели, и специфические функциональности приложения (типа клиенты, администратор, продажи).

    *Почему?*: Автономные модули могут быть добавлены с небольшиими доработками или вообще без них.

    *Почему?*: Спринты или итерации могут сосредоточиться на функциональных областях, и включить их по завершению спринта или итерации.

    *Почему?*: Оформление функциональных областей в модули позволяет проще их тестировать в изолированном или повторно используемом коде.

### Повторно Используемые Блоки и Модули
###### [Style [Y164](#style-y164)]

  - Создавайте модули, которые представляют из себя повторно используемые блоки приложения для общих сервисов таких как обработка исключений, логгирование, диагностика, безопасность и локальная работа с данными.

    *Почему?*: Эти типы функциональностей нужны во многих приложениях. Поэтому держите их отдельно в своих собственных модулях, применяйте универсально и повторно используйте во многих приложениях.

### Зависимости модулей
###### [Style [Y165](#style-y165)]

  - Корневой модуль приложения зависит от специфичных функциональных модулей и от любых общих или повторно используемых модулей.

    ![Модульность и Зависимости](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Почему?*: Главный модуль приложения содержит хорошо читаемый манифест функциональностей приложения.

    *Почему?*: Каждая функциональная область содержит манифест, поясняющий от чего она зависит, таким образом эта область может быть подключена к любому приложению вместе с ее зависимостями и все будет работать.

    *Почему?*: Функциональности приложения для внутреннего пользования (intra-app) такие как общие сервисы данных становится проще размещать и делится из модуля `app.core` (выберите это имя для такого модуля).

    Замечание: Это стратегия для согласованности. Здесь очень много хороших вариантов. Выберите тот, который следует правилам зависимостей AngularJS, и его проще поддерживать и масштабировать.

    > Мои структуры слегка отличаются от проекта к проекту, но они всегда следовали этим руководствам структуры и модульности. Реализация может менятся в зависимости от особенностей проекта и команды. Другими словами, не зацикливайтесь на точных воспроизведениях структуры. Регулируйте свою структуру учитывая согласованность, способность поддерживать код и эффективность.

    > В небольшом приложении вы можете конечно объединить все общие зависимости в модуль приложения, где функциональные модули не имеют прямых зависимостей. Это проще поддерживать в маленьких приложениях, использовать это вне приложения будет очень затруднительно.

**[К Содержанию](#table-of-contents)**

## Startup Logic

### Конфигурация
###### [Style [Y170](#style-y170)]

  - Вставьте код в [конфигурацию модуля](https://docs.angularjs.org/guide/module#module-loading-dependencies), который должен быть сконфигурирован перед запуском angular-приложения. Идеальные кандидаты для этого - провайдеры и константы.

    *Почему?*: Чем меньше мест для конфигурации, тем лучше.

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

### Блоки Run
###### [Style [Y171](#style-y171)]

  - Весь код, который должен запуститься, во время старта приложения, должен быть объявлен в фабрике, предоставлен в виде функции, и вставлен в [блок run](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Почему?*: Если код поместить сразу в блок run, то его будет тяжело тестить. Размещение кода в фабрике облегчает абстрагирование и использование фиктивных объектов для тестов.

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

**[К Содержанию](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Используйте [`$document`](https://docs.angularjs.org/api/ng/service/$document) и [`$window`](https://docs.angularjs.org/api/ng/service/$window) вместо `document` и `window`.

    *Почему?*: Эти сервисы являются оберткой среды Angular, они более проще тестируются, чем объекты document и window. Это дает вам возможность не создавать самим фиктивные объекты document and window.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Используйте [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) и [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) вместо `setTimeout` и `setInterval` .

    *Почему?*: Эти сервисы являются оберткой среды Angular, они более легко тестируемы и еще они обрабатываются циклом digest среды AngularJS, таким образом синхронизируя данные.

**[К Содержанию](#table-of-contents)**

## Testing
Модульное тестирование помогает поддерживать чистый код. Я включил некоторые мои рекомендации по основам модульного тестирования в виде ссылок для более подробной информации.

### Пишите Тесты с Историями
###### [Style [Y190](#style-y190)]

  - Пишите набор тестов для каждой истории. Начните пустой тест и заполняйте его по мере написания кода для истории.

    *Почему?*: Описания тестов помогают ясно определить, что ваша история будет делать, чего не будет, и как вы можете оценить успешность тестов.

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

### Библиотеки для тестирования
###### [Style [Y191](#style-y191)]

  - Используйте [Jasmine](http://jasmine.github.io/) или [Mocha](http://mochajs.org) для модульного тестирования.

    *Почему?*: И Jasmine и Mocha широко распространены в сообществе AngularJS. Обе они стабильны, хорошо поддерживаются, и предоставляют отличные возможности для тестирования.

    Замечание: Если используется Mocha, то дополнительно нужно использовать assert-библиотеку, например [Chai](http://chaijs.com).

### Движок Запуска Тестов
###### [Style [Y192](#style-y192)]

  - Используйте [Karma](http://karma-runner.github.io) в качестве движка для запуска тестов.

    *Почему?*: Karma просто конфигурируется, она просто запускается вручную или автоматически (как только вы измените код).

    *Почему?*: Karma просто внедряется в ваш процесс Continuous Integration, как самостоятельно, так и через Grunt или Gulp.

    *Почему?*: Некоторые средства разработки (IDE) начали интегрировать в себя библиотеку Karma, это - [WebStorm](http://www.jetbrains.com/webstorm/) и [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Почему?*: Karma очень хорошо работает с такими лидерами автоматизации как [Grunt](http://www.gruntjs.com) (вместе [grunt-karma](https://github.com/karma-runner/grunt-karma)) и [Gulp](http://www.gulpjs.com) (вместе [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing и Spying
###### [Style [Y193](#style-y193)]

  - Используйте [Sinon](http://sinonjs.org/) для stubbing и spying.

    *Почему?*: Sinon хорошо работает и с Jasmine и с Mocha. Он расширяет возможности stubbing и spying, которые предлагают Jasmine и Mocha.

    *Почему?*: Sinon просто переключается между Jasmine и Mocha, это если вы хотите использовать сразу обе библиотеки.

### Невизуальный Браузер
###### [Style [Y194](#style-y194)]

  - Используйте [PhantomJS](http://phantomjs.org/) для запуска тестов на сервере.

    *Почему?*: PhantomJS - невизуальный браузер, который помогает запускать тесты, не используя обычные визуальные браузеры. Таким образом, вам не нужно устанавливать на ваш сервер Chrome, Safari, IE, или другие браузеры.

    Замечание: Все же проведите тесты на всех браузерах, особенно на браузерах вашей целевой аудитории.

### Анализ Кода
###### [Style [Y195](#style-y195)]

  - Запустите JSHint на ваших тестах.

    *Почему?*: Тесты это код. JSHint помогает идентифицировать проблемы качества кода, которые могут причиной некорректной работы тестов.

### Разрешите Глобальные Переменные для Правил JSHint на Тестах
###### [Style [Y196](#style-y196)]

  - Смягчите правила для кода ваших тестов, чтобы разрешить общие глобальные переменные такие как `describe` и `expect`.

    *Почему?*: Ваши тесты - это код и он требует того же самого внимания и соблюдения правил качества, как и весь ваш рабочий код. Все же, глобальные переменные используются средой тестирования, и правила для них нужно ослабить в спецификации тестов.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Средства Тестирования](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

### Организация Тестов
###### [Style [Y197](#style-y197)]

  - Размещайте файлы модульных тестов (specs) рядом со своим клиентским кодом. А тестовые файлы (specs), которые покрывают интеграцию с сервером или тестируют сразу несколько компонентов, в отдельной папке `tests`.

    *Почему?*: Модульные тесты имеют прямое отношение к определенному компоненту и файлу с исходным кодом.

    *Почему?*: Так легче держать тесты актуальными, потому что они всегда на виду. Во время написания кода, применяете ли вы технику TDD или тестируете во время разработки или тестируете после разработки, тестовые файлы (specs) всегда рядом, они никогда не пропадают не из вида не из мыслей. Таким образом, тестам будет всегда уделено внимание, а это поможет поддерживать покрытие кода тестами.

    *Почему?*: Когда вы изменяете исходный код, всегда проще сразу обновить тесты.

    *Почему?*: Размещение файла кода и теста рядом упрощает их поиск и в случае необходимости, перенос в другое место обоих файлов не составляет большого труда.

    *Почему?*: Отделить тестовые файлы(specs), так чтобы они не попали в рабочую сборку можно с помощью grunt или gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.spec.js
                             /customers.controller-detail.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[К Содержанию](#table-of-contents)**

## Animations

### Применение
###### [Style [Y210](#style-y210)]

  - Используйте subtle [анимации AngularJS](https://docs.angularjs.org/guide/animations) чтобы перемещать состояния представлений и первичные визуальные элементы. Подключите [модуль ngAnimate](https://docs.angularjs.org/api/ngAnimate). Есть три ключа - тонкий (subtle), плавный (smooth), цельный (seamless).

    *Почему?*: При правильном использовании тонкая анимация может улучшить удобство работы.

    *Почему?*: Тонкие анимации могут улучшить воспринимаемую эффективность при изменениии представлений.

### Длительность Анимаций
###### [Style [Y211](#style-y211)]

  - Используйте короткую длительность анимаций. Я в основном начинаю с 300 миллисекунд и регулирую до нужного состояния.
    *Почему?*: Долгие анимации могут иметь обратный эффект для пользователя, приложение будет восприниматься как медленно работающее.

### animate.css
###### [Style [Y212](#style-y212)]

  - Используйте [animate.css](http://daneden.github.io/animate.css/) для обычных анимаций.

    *Почему?*: Анимации, предоставляемые animate.css, быстрые, плавные и их легко добавить в приложение.

    *Почему?*: Это дает согласованность ваших анимаций.

    *Почему?*: animate.css широко используем и оттестирован.

    Замечание: Посмотрите эту [замечательную статью от Matias Niemelä об анимациях AngularJS](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[К Содержанию](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - Если планируется производство документации, используйте синтаксис [`jsDoc`](http://usejsdoc.org/) для документирования имен функций, описаний, параметров и возвращаемых значений. Используйте `@namespace` и `@memberOf` для соответствия структуре приложения.

    *Почему?*: Вы можете сгенерировать (и перегенерировать) документацию из вашего кода, чтобы не писать ее с нуля.

    *Почему?*: С помощью общеиспользуемого промышленного инстумента вы получаете согласованность.

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

**[К Содержанию](#table-of-contents)**

## JS Hint

### Используйте Файл Настроек
###### [Style [Y230](#style-y230)]

  - Используйте JS Hint для проверки вашего кода JavaScript и проверьте файл настроек самого JS Hint, а также включите этот файл с систему управления исходным кодом (source control). Смотрите [JS Hint docs](http://www.jshint.com/docs/) для точного описания настроек.

    *Почему?*: Если код некорректен, то получаем предупреждения, перед тем, как отправить изменения в систему управления исходным кодом.

    *Почему?*: Обеспечивается согласованность для всей команды.

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

**[К Содержанию](#table-of-contents)**

## Constants

### Глобальные Переменные Сторонних Производителей (Vendors)
###### [Style [Y240](#style-y240)]

  - Создайте константы Angular для глобальных переменных из библиотек сторонних производителей.

    *Почему?*: Предоставляет способ подключить сторонние библиотеки, которые являются глобальными переменными. Это улучшает тестируемость кода, позволяя вам проще узнать, какие зависимости есть у ваших компонентов. Это также позволит вам, создать фиктивные объекты этих зависимостей, если это нужно.

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

  - Используйте константы для значений, которые не изменяются и не приходят из другого сервиса. Если константы используются в модуле, который может быть использован в нескольких приложениях, то поместите константу в файле, названному по имени модуля. В противном случае держите константы в главном модуле в файле `constants.js`.

    *Почему?*: Значение может измениться, возможно это редкая ситуация, но допустим сервис возвращает нам значение, и таким образом мы не будем менять наш рабочий код, использующий этот сервис. Напрмер, url для сервиса данных мог бы быть помещен в константы, но лучше загружать его из веб сервиса.

    *Почему?*: Константы могут быть инжектированы в любой angular-компонент, включая провайдеры.

    *Почему?*: Когда приложение разделено на модули, которые могут быть использованы в других приложениях, каждый отдельный модуль должен быть способен оперировать своими собственными зависимыми константами.

    ```javascript
    // Константы используются во всем приложении
    angular
        .module('app.core')
        .constant('moment', moment);

    // Константы используются в модуле продаж
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[К Содержанию](#table-of-contents)**

## File Templates and Snippets
Используйте шаблоны файлов и сниппеты, чтобы соблюсти согласованность стилей и инструкций. Здесь есть шаблоны и/или сниппеты для некоторых веб-редакторов и интегрированных средств разработки (IDE).

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Angular сниппеты, которые соблюдают приведенные здесь стили и руководства.

    - Скачайте [Sublime Angular сниппеты](assets/sublime-angular-snippets.zip?raw=true)
    - Поместите все в вашу папку Packages
    - Перезапустите Sublime
    - В файле JavaScript напечатайте следующие команды после клавиши `TAB`

    ```javascript
    ngcontroller // создает контроллер Angular
    ngdirective // создает директиву Angular
    ngfactory // создает фабрику Angular
    ngmodule // создает модуль Angular
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - Шаблоны файлов AngularJS, которые соблюдают приведенные здесь стили и руководства, можно найти на [SideWaffle](http://www.sidewaffle.com)

    - Скачайте [SideWaffle](http://www.sidewaffle.com) это расширение к Visual Studio (файл vsix)
    - Запустите файл vsix
    - Перезапустите Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Angular сниппеты и шаблоны файлов, которые соблюдают приведенные здесь стили и руководства. Вы можете импортировать их в свои настройки WebStorm:

    - Скачайте [WebStorm Angular шаблоны файлов и сниппетов](../assets/webstorm-angular-file-template.settings.jar?raw=true)
    - Откройте WebStorm и перейдите в меню `File`
    - Выберите пункт меню `Import Settings`
    - Выберите файл и нажмите `OK`
    - В файле JavaScript напечатайте следующие команды после клавиши `TAB`:

    ```javascript
    ng-c // создает контроллер Angular
    ng-f // создает фабрику Angular
    ng-m // создает модуль Angular
    ```

**[К Содержанию](#table-of-contents)**

## Yeoman Generator
###### [Style [Y260](#style-y260)]

Вы можете использовать [HotTowel yeoman generator](http://jpapa.me/yohottowel) для создания приложений Angular, которые являются стартовой точкой разработки и соблюдают правила данного руководства.

1. Установите generator-hottowel

  ```
  npm install -g generator-hottowel
  ```

2. Создайте новую папку и перейдите в нее.

  ```
  mkdir myapp
  cd myapp
  ```

3. Запустите генератор

  ```
  yo hottowel helloWorld
  ```

**[К Содержанию](#table-of-contents)**

## Routing
Клиентская маршрутизация важна для создания навигации между представлениями, а также компоновкой представлений, которые состоят из небольших маленьких шаблонов и директив.

###### [Style [Y270](#style-y270)]

  - Используйте [AngularUI Router](http://angular-ui.github.io/ui-router/) для клиентской маршрутизации.

    *Почему?*: UI Router реализует все возможности маршрутизатора Angular, плюс предлагает дополнительную функциональность, включая вложенные маршруты и состояния.

    *Почему?*: Синтаксис почти такой же, как и у маршрутизатора Angular, и несложно мигрировать на UI Router.

###### [Style [Y271](#style-y271)]

  - Определяйте маршруты для всех представлений в модуле, где они есть. Каждый модуль должен содержать маршруты для всех своих представлений.

    *Почему?*: Каждый модуль должен быть независим.

    *Почему?*: Когда мы удаляем или добавляем модуль, то приложение должно содержать только те маршруты, которые указывают на существующие представления.

    *Почему?*: Так мы можем включать или исключать части приложения, не заботясь о том, что у нас останутся маршруты на несуществующие представления.

**[К Содержанию](#table-of-contents)**

## Task Automation
Используйте [Gulp](http://gulpjs.com) или [Grunt](http://gruntjs.com) для создания автоматизированных процессов. Gulp работает по принципу код главнее конфигурации, а Grunt наоборот конфигурация главнее кода. Я лично предпочитаю Gulp, так как мне кажется его проще читать и писать, но на самом деле они оба отличные инструменты автоматизации.

###### [Style [Y400](#style-y400)]

  - Используйте автоматизацию для сборки всех файлов с определениями модуля `*.module.js` перед всеми остальными JavaScript-файлами приложения.

    *Почему?*: Angular должен зарегистрировать все определения модулей, перед тем как их использовать.

    *Почему?*: Именование модулей по специальному шаблону `*.module.js` упрощает их поиск и сборку в единую группу, для того чтобы подключить их первыми.

    ```javascript
    var clientApp = './src/client/app/';

    // Всегда собираем файлы модулей первыми
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[К Содержанию](#table-of-contents)**

## Angular Docs
Для дополнительной информации, описания API, смотрите [документацию Angular](//docs.angularjs.org/api).

## Contributing

Сначала откройте issie и объясните вопрос/проблему для того, чтобы обсудить потенциальные изменения/добавления. Если у вас есть вопросы по этому руководству, вы можете свободно задавать их, создавая в хранилище issues. Если вы нашли опечатку, создайте pull request. Идея в том, чтобы содержимое всегда дежать актуальным и используя возможности системы Github, помочь рассказать историю с вопросами или проблемами и распространить ее, чтобы она была доступна через поиск Google. Почему? Потому что, если у вас был такой вопрос, то вполне вероятно, что кто-то тоже ищет решение на этот же вопрос! Вы можете узнать больше здесь о том как можно сотрудничать.

*Добавляя материал в данное хранилище вы согласны с тем, ваше содержимое будет доступно согласно приведенной ниже лицензии.*

### Процесс
    1. Обсудите изменения в Issue.
    2. Откройте Pull Request, сделайте ссылку на issue, объясните изменения и их ценность.
    3. Pull Request будет проверен и далее принят или отклонен.

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

**[К Содержанию](#table-of-contents)**
