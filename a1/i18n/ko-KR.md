# Angular Style Guide

## Angular Team의 지지를 받습니다.
Angular 팀의 리더인 Igor Minar 에게 특별히 감사합니다. 이 스타일 가이드를 위해 리뷰, 기여, 피드백을 해주었고 저를 믿어주고 이끌어 주었습니다.

## Purpose
*팀환경을 위한 방향을 제시하는 Angular 스타일 가이드 by [@john_papa](//twitter.com/john_papa)*

만약 Angular [Angular](//angularjs.org) 어플리케이션의 문법, 컨벤션, 구조화를 위한 스타일 가이드를 찾고 있다면 제대로 오셨습니다. 여기 제시된 스타일들은 제 팀 단위 개발 경험, 프레젠테이션, [Pluralsight training courses](http://pluralsight.com/training/Authors/Details/john-papa)를 토대로 만들어졌습니다.

이 스타일 가이드의 목적은 Angular 어플리케이션을 만드는 길잡이 역할을 하기 위함이며 더 나아가 왜 내가 이런 것들을 선택했는지 보여주기 위함입니다.
>만약 이 가이드가 마음에 든다면 Pluralsight 에 올려놓은 저의 강의를 참고하시기 바랍니다. [Angular Patterns: Clean Code](http://jpapa.me/ngclean)

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Community Awesomeness and Credit
저는 Angular 커뮤니티의 대단함을 알게 되었습니다. 그들은 자신들의 경험을 공유하는데 열정적이기 때문입니다. 나의 친구이자 Angular 전문가인 Todd Motto 와 나는 많은 스타일과 컨벤션을 위해 공동작업을 하였습니다. 대부분 우리는 서로 동의하였지만 어떤 부분에서는 의견이 갈렸습니다. Todd의 접근방법이 궁금하고 이를 비교해보고 싶으신 분들은 다음 링크에 가서 확인해보시면 좋을 것 같습니다 [Todd's guidelines](https://github.com/toddmotto/angularjs-styleguide).

제 스타일의 많은 부분은 [Ward Bell](http://twitter.com/wardbell) 과 함께했던 2인 1조의 개발 세션을 통해서 많이 가져왔습니다. 저의 친구 Ward는 이 가이드의 원초적인 전개에 많은 도움을 주었습니다.

## See the Styles in a Sample App
예제 앱에 적용된 스타일을 참고하세요.
이 가이드가 무엇을, 왜, 어떻게 하는지 다 설명을 하겠지만, 실제로 적용된 것을 보는 게 더 도움이 될 거라고 봅니다. 이 가이드에 제시된 스타일과 양식을 따르는 예제 앱이 함께 제공되고 있습니다. 여기에 가시면 modular 라는 해당 [예제 앱을 modular](https://github.com/johnpapa/ng-demos) 라는 폴더 안에서 보실 수 있습니다. 가서 코드를 확인하시고, 복제하시고, 개입도 해보시기 바랍니다. [실행하는 방법은 readme 에 작성되어 있습니다.](https://github.com/johnpapa/ng-demos/tree/master/modular)

##Translations
커뮤니티를 통해 유지보수가 되는 [Angular 스타일 가이드의 번역문](https://github.com/johnpapa/angular-styleguide/tree/master/i18n)들은 여기에서 보실 수 있습니다.

## Table of Contents

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
  1. [JSCS](#jscs)
  1. [Constants](#constants)
  1. [File Templates and Snippets](#file-templates-and-snippets)
  1. [Yeoman Generator](#yeoman-generator)
  1. [Routing](#routing)
  1. [Task Automation](#task-automation)
  1. [Filters](#filters)
  1. [Angular Docs](#angular-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Single Responsibility

### Rule of 1
###### [Style [Y001](#style-y001)]

  - 각각의 파일에 컴포넌트를 저장하세요.

  아래 예제는 'app' 모듈과 종속모듈을 정의하고 컨트롤러, 팩토리를 모두 한 파일에서 저장합니다.

  ```javascript
  /* avoid */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  컴포넌트들은 각각의 파일에 따로 저장되었습니다.

  ```javascript
  /* recommended */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* recommended */

  // some.controller.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommended */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[Back to top](#table-of-contents)**

## IIFE
### JavaScript Closures
###### [Style [Y010](#style-y010)]

  - Angular 컴포넌트들은 즉시 호출 함수구문을 이용해 감싸도록 합니다. (IIFE)

  *이유*: IIFE 방식은 글로벌 범위 변수들을 제거합니다. 이 방법을 통해서 글로벌 범위에서 변수와 함수 선언들이 예상 밖으로 오랫동안 유지되어 메모리를 잠식하는 것을 방지합니다. 또한 이 방법은 글로벌 변수들의 충돌도 막아줍니다.

  *이유*: 실 서버로 코드가 배포되기 전 코드는 최소화하고 묶어져서 하나의 파일로 만들어집니다. 이 때 변수의 충돌이나 너무 많은 글로벌 변수로 문제가 생길 수 있습니다. IIFE는 각각 파일마다 변수 범위를 제공하여 이를 막아줍니다.

  ```javascript
  /* avoid */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // logger function is added as a global variable
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // storage function is added as a global variable
  function storage() { }
  ```

  ```javascript
  /**
   * recommended
   *
   * no globals are left behind
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

  - 주의: 나머지의 예제들에서는 코드를 간결하게 하기 위해서 IIFE를 사용하지 않을 것입니다. 실제 사용할 때는 IIFE로 하세요.

  - 주의: IIFE는 유닛 테스트를 위한 테스트 코드들이 Angular 표현이나 헬퍼 함수들 같은 프라이빗 함수나 변수들에 접근을 못하게 할 수도 있습니다. 하지만 이런 경우 퍼블릭 함수나 변수를 통해서 접근하거나 이 프라이빗 속성들을 노출함으로 테스트를 진행할 수 있습니다. 예를 들어 factory 나 불변 상수에 헬퍼 함수나 레귤러 익스프레션 또는 불변 상수를 옮김으로 가능합니다.

**[Back to top](#table-of-contents)**

## Modules

### Avoid Naming Collisions
###### [Style [Y020](#style-y020)]

  - 하위 모듈을 위해 구분자와 함께 유일한 이름을 지정하세요.

  *이유*: 유일, 독특한 이름들은 모듈이름이 충돌하는 것을 방지합니다. 구분자는 그 모듈과 하위모듈 구조를 정의하는데 도움이 됩니다. 예를 들어 'app' 은 당신의 루트 모듈이라면 'app.dashboard'와 'app.users'는 'app' 모듈이 사용하는 하위모듈의 이름으로 지정할 수 있습니다.

### Definitions (aka Setters)
###### [Style [Y021](#style-y021)]

  - 세터 구문을 사용하여 반환된 모듈을 변수에 저장하지마세요.

  *이유*: 1 파일에 1 컴포넌트를 넣을 경우, 변수에 넣어서 그 변수를 재사용하는 일은 없다고 봐야합니다.

  ```javascript
  /* avoid */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  대신 간단한 세터 구무을 사용하고, 체인으로 나머지 부분을 처리하세요.

  ```javascript
  /* recommended */
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

  - 모듈을 이용할 때, 변수에 할당하는 것을 피하고 그 대신 게터 구문을 이용한 체이닝을 사용하세요.

  *이유*: 이렇게 해야 더 이해하기 쉽고 변수 충돌이나 누출을 방지할 수 있습니다.

  ```javascript
  /* avoid */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommended */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs Getting
###### [Style [Y023](#style-y023)]

  - 한 번만 set 하고 나머지 인스턴스를 위해서는 get을 사용하세요.

  *이유*: 모듈은 한 번만 만들어지고 설정되어야 하고, 그 후로는 그 모듈을 받아와서 사용해야 합니다.

  ```javascript
  /* recommended */

  // to set a module
  angular.module('app', []);

  // to get a module
  angular.module('app');
  ```

### Named vs Anonymous Functions
###### [Style [Y024](#style-y024)]

  - 콜백 함수를 넘길 때 변수로 할당된 함수를 사용하고 익명 함수 사용을 피하세요.

  *이유*: 이렇게 하면 이해하기 좋은 코드가 작성되어 고치기 훨씬 쉽습니다. 그리고 네스티드 콜백 양을 줄일 수 있습니다.

  ```javascript
  /* avoid */
  angular
      .module('app')
      .controller('DashboardController', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recommended */

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

**[Back to top](#table-of-contents)**

## Controllers

### controllerAs View Syntax
###### [Style [Y030](#style-y030)]

  - '전형적인 $scope 을 사용한 콘트롤러' 대신 [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) 구문을 사용하세요.


  *이유*: 컨트롤러는 새로이 만들어진 하나의 객채 생성하여 리턴합니다. 그리고 `controllerAs` 구문은 `전형적인 $scope 구문` 보다 더 자바스크립트의 생성자와 흡사하게 작동합니다.


  *이유*: 이는 뷰에서 해당 변수를 사용할 때 점 접근자를 이용한 속성에 대한 바인딩의 사용을 조장하게 됩니다.(e.g. `name` 대신 `customer.name` ) 이는 후에 점 접근자를 사용하지 않아서 발생할 수 있는 참조 오류를 피할 수 있게 해주며 문맥상으로 훨씬 이해가 쉬운 코드를 작성하게 도와줍니다.


  *이유*: 이는 네스티드 컨트롤러의 뷰에서 `$parent` 호출의 사용을 피할 수 있게 해줍니다.

  ```html
  <!-- avoid -->
  <div ng-controller="CustomerController">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recommended -->
  <div ng-controller="CustomerController as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs Controller Syntax
###### [Style [Y031](#style-y031)]

  - `전형적인 컨트롤러 `$scope` 구문 대신 `controllerAs` 구문을 사용하세요.

  - `controllerAs` 구문은 `$scope` 에 바인딩 하기위해 컨트롤러 안에서 `this`를 사용합니다.

  *이유*: `controllerAs`는 `$scope` 보다 통어적인 장점입니다. 이를 이용하더라도 계속해서 view 에 바인드 할 수 있고 `$scoep`에도 접근이 가능합니다..

  *이유*: 이는 컨트롤러 안에서 더 나은 방법을 사용하거나, factory에 메서드를 옮기고 컨트롤러에서 factory를 참조하는 것이 더 나은 방법임에도 불구하고 `$scope` 메서드를 사용하게되는 유혹을 피할 수 있도록 도와줍니다. 컨트롤러 내에서 `$scope`을 사용하는 것은 꼭 필요할 때만 하도록 하세요. 예를 들어 퍼블리싱과 섭스크라이빙 이벤트는 [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), 또는 [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on)를 사용하세요.

  ```javascript
  /* avoid */
  function CustomerController($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recommended - but see next section */
  function CustomerController() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs with vm
###### [Style [Y032](#style-y032)]

  - `controllerAs` 구문을 사용할 때는 `this`를 이용해 capture 변수를 사용하세요.

  *이유*: `this` 예약어는 구문 변수로 컨트롤러 안의 함수에서 사용될 때 그 값이 변경될 수 있기 때문입니다. `this`를 다른 변수에 캡쳐한 후 사용하면 이 문제를 피할 수 있습니다.


  ```javascript
  /* avoid */
  function CustomerController() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recommended */
  function CustomerController() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  주의: 특정 코드의 바로 윗줄에 특정 코맨트를 추가함으로서 [jshint](http://www.jshint.com/) 경고를 무시하게 할 수 있습니다. 하지만 함수의 이름이 대문자일 경우에는 불필요합니다. 이 경우 함수는 생성자로 여겨지고 그 자체가 Angular에서 컨트롤러이기 때문입니다.


  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  주의: `controller as`를 이용하여 watch를 만들 때는 아래의 구문을 이용하여 `vm.*` 에 대한 watch를 할 수 있습니다. (watch는 추가적인 실행 사이클을 필요로 할 수 있기 때문에 사용할 때는 주의를 기울이세요.)

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

  주의: 대량의 코드에 대한 작업을 할 경우에, 인식과 검색에 대한 오버해드를 줄이는데 도움을 줄 수 있도록 서술적인 이름을 사용하도록 하세요. 그렇다고 부담될 정도의 긴 이름은 피해주세요.

  ```html
  <!-- avoid -->
  <input ng-model="customerProductItemVm.text">
  ```

  ```html
  <!-- recommended -->
  <input ng-model="productVm.id">
  ```

### Bindable Members Up Top
###### [Style [Y033](#style-y033)]

  - 바인딩이 가능한 맴버들을 가장 위쪽으로 올리세요. 알파벳 순서로 정렬하세요. 코드 전체에 선언 부분을 섞어서 정렬하지 마세요.

    *이유*: 바인딩할 맴버를 위쪽에 올려두면 뷰에서 어떤 맴버를 사용하는지 즉각적으로 구분하는데 도움이 되고 코드 읽기가 쉬워집니다.

    *이유*: 인라인 익명함수의 세팅이 쉬워집니다. 하지만 이런 함수들의 코드 길이가 1줄을 넘어가면 읽기가 어려워 집니다. 함수 선언은 바인딩 맴버들 아래쪽에 하세요. (함수들은 끌어올려질 거에요) 함수 정의는 아래쪽에 하세요. 바인더블 맴버들을 위쪽에 두세요. 그러면 코드 읽기가 쉬워집니다.

  ```javascript
  /* avoid */
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
  /* recommended */
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

    !["Above the Fold"를 사용하는 컨트롤러](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-1.png)

  주의: 만약 코드 가독성에 영향을 주지않고 1줄이라면 그냥 위쪽에 두어도 됩니다.

  ```javascript
  /* avoid */
  function SessionsController(data) {
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
  }
  ```

  ```javascript
  /* recommended */
  function SessionsController(sessionDataService) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = sessionDataService.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  }
  ```

### Function Declarations to Hide Implementation Details
###### [Style [Y034](#style-y034)]

  - 함수 선언문을 사용하여 구체적인 구현내용을 숨기세요. 바인딩 맴버들은 위쪽에 두세요. 컨트롤러 안에서 함수를 바인딩 하려면 파일 아래쪽에 위치한 함수 선언문을 참조하도록 하세요. 이렇게 하면 바인더블 섹션에 직접적으로 묶여지게 됩니다. 좀 더 구체적인 정보는 여기를 참고하세요 [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *이유*: 바인딩할 맴버를 위쪽에 올려두면 뷰에서 어떤 맴버를 사용하는지 즉각적으로 구분하는데 도움이 되고 코드 읽기가 쉬워집니다.

    *이유*: 구체적인 함수 내용을 파일 아래쪽에 옮겨두면 뷰의 복잡성을 줄여줍니다. 그래서 중요한 내용을 상단에서 볼 수 있습니다.

    왜: 함수 선언은 인터프리터에 의해서 나중에 위쪽으로 올려집니다. 그래서 아래서 선언된 함수를 위쪽에서 참조하는 것은 문제가 없습니다. (함수 선언문을 사용하는 것과 마찬가지 효과 입니다.)

    왜: 함수 선언문을 사용할 경우 함수의 참조 순서에 의해서 코드가 실행중단 되는 것을 걱정하지 않아도 됩니다. 함수 표현의 경우 `var a`에서 `var b`를 참조할 경우 코드는 런타임 오류로 멈추게 된다.

    *이유*: 함수 표현에서는 순서가 아주 중요합니다.

  ```javascript
  /**
   * avoid
   * Using function expressions.
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

  다음 예제에는 중요한 것들이 두루 포함되어 있습니다. 아래의 예제에서, 중요한 것들은 위쪽에 두었습니다. `vm.avengers` 나 `vm.title` 같은 컨트롤러 바인딩 맴버들을 의미합니다. 구체적인 구현은 아래쪽에 두었습니다. 이렇게 하면 코드 읽기가 쉬워집니다.

  ```javascript
  /*
   * recommend
   * Using function declarations
   * and bindable members up top.
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

  - 컨트롤러에서 service 와 factory 로 로직을 넘겨서 처리하도록 하세요.

    *이유*: 함수로 노출하는 서비스에 로직을 넣을 경우 다양한 컨트롤러에서 참조하여 재활용이 가능하기 때문입니다.

    *이유*: 서비스에 넣어진 로직은 유닛 테스트용으로 분리가 쉽게 됩니다. 컨트롤러 안에서 로직을 호출하는 것도 쉽게 흉내낼 수 있습니다.

    *이유*: 디펜던시를 없애고 구체적 구현을 컨트롤러로 부터 감출 수 있습니다.

    *이유*: 컨트롤러를 슬림하고 간결하고 포커스 되어있도록 유지할 수 있습니다.

  ```javascript

  /* avoid */
  function OrderController($http, $q, config, userInfo) {
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
  /* recommended */
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

### Keep Controllers Focused
###### [Style [Y037](#style-y037)]

  - 한 뷰를 위해 한 컨트롤러를 정의하세요. 다른 뷰를 위해 컨트롤러를 재사용하지마세요. 대신 재사용 가능한 로직을 팩토리에 넣고 컨트롤러를 간단하고 뷰에 포커스 되도록 유지하세요.

    *이유*: 한 컨트롤러를 여러 뷰에서 사용하는 것은 불안정합니다. 좋은 end-to-end (e2w) 테스트 시험 범위는 큰 어플리케이션 전반적인 안정성을 요구합니다.

### Assigning Controllers
###### [Style [Y038](#style-y038)]

  - 한 컨트롤러가 한 뷰와 쌍을 이루어야 할 때 그리고 컴포넌트가 다른 컨트롤러나 뷰에서 재사용 되어야 할 때, 라우트에서 컨트롤러를 정의하세요.

    주의: 만약 뷰가 라우트가 아닌 다른 방법으로 로딩 되었을 때는 `ng-controller="Avengers as vm" 구문을 사용하세요.

    *이유*: 라우트에서 컨트롤러를 엮는 방법은 컨트롤러와 뷰를 엮을 때 다른 라우트를 사용할 수 있도록 합니다. 컨트롤러의 할당이 [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController) 이 태그를 이용한 것이라면, 그 뷰는 항상 동일한 컨트롤러와 작동하게 됩니다.

 ```javascript
  /* avoid - when using with a route and dynamic pairing is desired */

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
  /* recommended */

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

**[Back to top](#table-of-contents)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - 서비스는 `new` 키워드를 통해 인스턴스화 됩니다. `this`를 사용하여 public 메소드와 변수에 접근합니다. 이는 팩토리와 흡사하기 때문에 일관성 있게 팩토리를 사용하도록 하세요.

    주의: [모든 Angular 서비스는 싱글톤](https://docs.angularjs.org/guide/services). 인젝터 당 주어진 서비스의 인스턴스는 하나만 존재한다는 뜻입니다.

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

**[Back to top](#table-of-contents)**

## Factories

### Single Responsibility
###### [Style [Y050](#style-y050)]

  - 팩토리는 캡슐화 되어 단 [하나의 책임](http://en.wikipedia.org/wiki/Single_responsibility_principle)만 가져야 합니다. 팩토리가 단일 목적을 넘어 사용되게 된다면 다른 팩토리를 만들어야 합니다.

### Singletons
###### [Style [Y051](#style-y051)]

  - 팩토리는 싱글톤이고 서비스의 맴버들을 가진 오브젝트를 리턴합니다.

    주의: [모든 Angular 서비스들은 싱글톤](https://docs.angularjs.org/guide/services).

### Accessible Members Up Top
###### [Style [Y052](#style-y052)]

  - 노출하고 싶은 호출 가능한 맴버(인터페이스)들은 서비스의 위쪽에 위치시키세요. 여기 링크에서 제시하는 방식을 사용하세요. [모듈 패턴 파해치기](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    *이유*: 호출 가능한 맴버들을 상단에 배치하는 것은 가독성을 높여주고 어떤 맴버들이 외부로 노출되고 호출 될 수 있는지 그리고 단위 테스트를 해야하는지 순식간에 파악가능하도록 해줍니다.

    *이유*: 특히 파일이 길어져서 노출 함수나 변수를 알아차리기 위해 스크롤 해야하는 것을 방지하게 됩니다.

    *이유*: 코드 작성을 진행하면서 바로 함수를 세팅하는게 쉬울 수 있습니다. 하지만 그 함수들이 한줄 이상이 되면 가독성이 떨어지고 스크롤을 많이 사용해야 합니다. 리턴되는 서비스에 호출 가능한 인터페이스를 정의하는 것은 구현 부분을 아래로 배치되도록 합니다. 위쪽에 호출 가능한 인터페이스를 배치하는 것은 읽기 쉬운 코드를 만들어 줍니다.

  ```javascript
  /* avoid */
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
  /* recommended */
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

  호스트 오브젝트 내에서 이런 식의 바인딩이 반영이 되어서, 원시 값들은 모듈 패턴 노출 방식으로 업데이트 되지 않습니다.

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-2.png)

### Function Declarations to Hide Implementation Details
###### [Style [Y053](#style-y053)]

  - 함수 정의를 사용하여 구체적 구현내용을 숨기세요. 노출시키고 싶은 맴버들을 상단에 배치하세요. 상단의 맴버에서 아래쪽에 정의된 함수들을 할당하세요. 더 자세한 정보는 여기를 보세요. [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *이유*: 상단에 접근 가능한 맴버들을 배치함으로서 읽기 쉬운 코드를 만들어주고 외부에서 접근 가능한 팩토리 함수를 즉각적으로 알아볼 수 있도록 도와줍니다.

    *이유*: 구체적 함수 정의 부분을 파일의 아래쪽에 배치함으로 뷰의 복잡성을 이동시키고 중요한 것들을 상단에서 바로 볼 수 있습니다.

    *이유*: 함수 정의 부분은 아래쪽에 두더라도 인터프리터에 의해서 상단으로 끌어올려집니다. 그래서 정의되기 전에 호출 또는 참조되어도 문제가 발생하지 않아요. (함수 표현으로 할 경우 문제가 될 수 있죠.)

    *이유*: 함수 정의로 할 경우 순서에 상관이 없기 때문에 아무 위치에서 호출해도 걱정할 필요가 없습니다.

    *이유*: 함수 표현으로 할 경우 순서에 의해서 코드가 깨질 수 있기 때문에 중요합니다.

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

**[Back to top](#table-of-contents)**

## Data Services

### Separate Data Calls
###### [Style [Y060](#style-y060)]

  - 데이터 통신 부분은 팩토리에게 부여하세요. 데이터 서비스들이 XHR 호출, 로컬 저장소, 메모리 저장 등 모든 데이터 조작을 책임지도록 하세요.

    *이유*: 컨트롤러의 책무는 정보를 모아서 뷰를 통해 화면을 그리는 것입니다. 컨트롤러가 데이터를 가져오는 과정에 개입하는 것은 좋지 않아요. 다만 어느 구성요소에게 요구해야 할지만 알면 됩니다. 데이터 서비스로 데이터를 어떻게 가져올지 분리하고 컨트롤러는 간단하게 하고 뷰에 더욱 집중하도록 하세요.

    *이유*: 데이터 서비스를 사용하는 컨트롤러를 테스트할 때 이렇게 하면 (mock or real) 테스트가 모두 쉬워집니다.

    *이유*: 데이터 서비스 구현 부분은 아주 구체적, 특정적인 코드일 가능성일 수 있습니다. 이는 헤더, 통신 방식 또는 `$http` 같은 다른 서비스를 이용할 수도 있습니다. 컨트롤러 같은 실제 사용자들에게서 이를 분리하는 것은 구현 방식을 나중에 변경할 때에도 좋습니다.

  ```javascript
  /* recommended */

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

    중요: 아래처럼, 컨트롤러 같은, 호출 부에서 데이터 서비스를 호출하여 사용하는 것은 구현 코드를 감추어 줍니다.

  ```javascript
  /* recommended */

  // controller calling the dataservice factory
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

### Return a Promise from Data Calls
###### [Style [Y061](#style-y061)]

  - `$http` 처럼 프라미스를 리턴하는 데이터 서비스를 호출 할 때는, 호출 받는 함수에서 프라미스를 리턴하세요.

    *이유*: 프라미스를 되받게 되면 프라미스에 체인 호출을 하여 계속해서 데이터 호출 완료 후의 흐름을 작성할 수 있습니다.

  ```javascript
  /* recommended */

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

**[Back to top](#table-of-contents)**

## Directives
### Limit 1 Per File
###### [Style [Y070](#style-y070)]

  - 파일 하나당 하나의 디렉티브만 정의하세요. 파일 이름을 디렉티브 이름으로 저장하세요.

    *이유*: 하나의 파일에 모든 디렉티브 정의를 넣으면 쉬울 수 있습니다. 하지만 앱 전체, 특정 모듈들 혹은 한 모듈에서 재사용되는 부분만 꺼내어 활용하는 것은 너무 어렵게 됩니다.

    *이유*: 하나의 파일에 하나의 디렉티브를 넣으면 관리가 쉬워집니다.

    > 주의: "**베스트 프랙티스**: 디렉티브들은 자기 일이 끝난 후에 청소를 해야 합니다. `element.on('$destroy', ...)` 또는 `scope.$on('$destroy', ...)`를 사용해서 디렉티브가 제거되었을 경우에 청소할 수 있습니다." ... Angular 문서에서 발췌

  ```javascript
  /* avoid */
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
  /* recommended */
  /* calendar-range.directive.js */

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
  /* recommended */
  /* customer-info.directive.js */

  /**
   * @desc sales directive that can be used anywhere across the sales app at a company named Acme
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
  /* recommended */
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

    주의: 디렉티브는 다양한 범위에서 사용이 가능하기 때문에, 이름을 지을 때 선택지가 너무 많습니다. 디렉티브와 디렉티브 파일명이 명확하고 선명한 것을 고르세요. 아래 몇몇 예제를 보시고 더욱 다양한 추천방식은 여기를 참고하세요 [Naming](#naming).

### Manipulate DOM in a Directive
###### [Style [Y072](#style-y072)]

  - DOM을 직접 다루게 되었다면, 디렉티브를 사용하세요. 만약 CSS나 [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide) 등의 방식을 사용할 수 있다면 이를 사용하세요. 예를 들, 만약 디렉티브의 기능이 간단히 보여줌, 숨김 기능만 있다면 ngHide/ngShow를 사용하세요.

    *이유*: DOM을 다루는 코드는 테스트, 수정이 어렵고 대부분 더 나은 구현 방법이 존재합니다. (e.g. CSS, 애니매이션, 템플릿)

### Provide a Unique Directive Prefix
###### [Style [Y073](#style-y073)]

  - `acmeSalesCustomerInfo` 가 HTML에서 `acme-sales-customer-info`로 정의 되는 것 처럼 유일하고 짧고 설명적인 접두어를 사용하세요.

    *이유*: 유일하고 짧은 접두어는 디렉티브의 문맥과 출신을 파악하게 해줍니다. 예를 들어 `cc-`는 아마 CodeCamper 앱을 지칭하려고 사용되었을 수 있습니다. 또한 `acme-`는 Acme company에서 사용된 디렉티브를 지칭할 수 있습니다.

    주의: `ng-`는 Angular 디렉티브로 예약되어 있기 때문에 사용하지 마세요. 넓게 검색한 후에 충돌이 없는지 확인하고 사용하세요. `ion-` 같은 경우 [Ionic Framework](http://ionicframework.com/) 프로젝트의 접두어로 사용되고 있으니까요.

### Restrict to Elements and Attributes
###### [Style [Y074](#style-y074)]

  - 혼자서 사용될 수 있다고 판단되는 디렉티브를 만들 때는 restrict `E` (custom element)를 사용하세요. 어트리뷰트를 만들려먼 restrict `A` (custom attribute)를 사용하세요. 대부분, 자신이 컨트롤 하려면 `E`가 적당합니다. 일반적 가이드라인은 `EA` 이지만 홀로 사용되는 엘레멘트 이거나 이미 존재하는 DOM 엘레멘트를 향상시키기 위해서 속성을 변경하는 경우에는 따로 나누어 구현하세요.

    *이유*: 그게 적합하기 때문입니다.

    *이유*: 우리가 디렉티브가 클래스로 사용되도록 할 수도 있지만, 만약 디렉티브가 진짜 엘레멘트나 어트리뷰트 처럼 작동하고 그럴 때 더 적합하다고 생각된다면 말입니다.

    주의: Angular 1.3+에서 기본값은 EA입니다.

  ```html
  <!-- avoid -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* avoid */
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
  /* recommended */
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

  - 일관되게 컨트롤러와 뷰를 연결시킬 때 `controller as` 구문을 사용하세요.

    *이유*: 어렵지도 않고 그게 적합하기 때문이죠.

    주의: 아래 있는 디렉티브는 controllerAs를 사용해서 링크나 디렉티브 컨트롤러 안에서 스콥을 사용하는 방법을 명시하고 있습니다. 한 곳에서 다 보여주기 위해서 인라인 템플릿을 사용했습니다.

    주의: 종속 인젝션을 고려할 때는 여기를 참고하세요. [수동 종속 명시](#manual-annotating-for-dependency-injection).

    주의: 디랙티브의 컨트롤러는 디렉티브 클로져의 외부에 존재한다는 것을 기억하세요. 이 방식은 `return` 이후에 injection이 만들어지고 접근이 불가하게 되는 문제를 막아줍니다.

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
          // note: This would be 'ExampleController' (the exported controller name, as string)
          // if referring to a defined controller in its separate file.
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

    주의: 링크 함수로 컨트롤러를 인젝트 할 때 컨트롤러의 이름을 정할 수 있습니다. 그리고 그 컨트롤러의 프로퍼티 형식으로 디렉티브 어트리뷰트에 접근이 가능합니다.

  ```javascript
  // Alternative to above example
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```

###### [Style [Y076](#style-y076)]

  - 디렉티브에서 `controller as`를 사용할 때 `bindToController = true`를 사용하면 컨트롤러의 스콥을 외부 스콥에 바인딩할 수 있습니다.

    *이유*: 외부 스콥을 쉽게 디렉티브의 컨트롤러 스콥에 바인딩할 수 있습니다.

    주의: `bindToController`는 Angular 1.3.0 부터 사용이 가능합니다.

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

**[Back to top](#table-of-contents)**

## Resolving Promises for a Controller
### Controller Activation Promises
###### [Style [Y080](#style-y080)]

  - 컨트롤러의 시작-준비 로직을 `activate` 함수 안에 넣으세요.

    *이유*: 시작-준비 로직을 컨트롤러 안의 일관된 부분에 위치 시키세요. 이는 일관성 있는 테스트를 하게 해주고, 시작-준비 코드가 군데군데 퍼지는 것을 막아줍니다.

    *이유*: `activate` 함수를 만들어두면 컨트롤러/뷰를 새로고침하는 곳에서 재사용하기가 편리합니다. 그리고 필요한 코드들이 함께 있도록 해주고, 사용자가 뷰에 빠르게 도달하도록 해줍니다. `ng-view` 나 `ui-view`에서 애니매이션을 만들기가 쉬워지고 사용자들이 인터페이스가 즉각적이라고 느껴지게 해줍니다.

    주의: 만약 컨트롤러를 사용하기 전 시점에서 라우팅을 조건적으로 취소해야 한다면 [route resolve](#style-y081)를 대신 사용하세요.

  ```javascript
  /* avoid */
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
  /* recommended */
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

### Route Resolve Promises
###### [Style [Y081](#style-y081)]

  - 컨트롤러가 활성화되기 전에 프라미스 값이 구해져야 한다면, 컨트롤러 로직이 실행되기 전에 `$routeProvider`에서 종속 값들을 다 구하도록 하세요. 만약 컨트롤러가 활성화되기 전에 라우트를 조건적으로 중단해야 한다면, 라우트 resolver를 이용하세요.


  - 화면의 변화가 일어나기 전에 라우틀를 취소해야 할지 말지 결정해야 한다면 라우트 resolve를 이용하세요.

    *이유*: 컨트롤러가 로드되기 전에 데이터를 필요로 할 수도 있기 때문입니다. 그 데이터는 특정 팩토리나 [$http](https://docs.angularjs.org/api/ng/service/$http)를 통해서 프라미스부터 올 수 있습니다. [라우트 resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)는 컨트롤러 로직이 실행되기 전 프라미스를 구할 수 있도록 해줍니다. 그래서 프라미스를 구한 후 특정 액션을 취할 수 있습니다.

    *이유*: 코드는 라우트와 컨트롤러의 준비-시작 함수 다음 실행이 됩니다. 뷰는 바로 로드가 시작됩니다. 데이터 바인딩은 활성 프라미스가 구해지면 시작됩니다. "busy" 애니매이션은 뷰의 변경 중 보여질 수 있습니다. (`ng-view` or `ui-view`를 통해서)

    주의: 코드는 프라미스를 통해서 라우트 전에 실행됩니다. 프라미스를 거절하면 라우팅을 중단합니다. Resolve는 라우트가 값을 가져오기 전까지 다음 화면이 기다리게 합니다. "busy" 애니매이션은 화면 변경 중, resolve 전에 보여질 수 있습니다. 뷰에 좀 더 빨리 도달하기를 원하고, 뷰에 갈 수 있는지 체크포인트가 필요하다면, [컨트롤러 `activate` 테크닉](#style-y080)를 대신 고려하세요.

  ```javascript
  /* avoid */
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
  /* better */

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

    주의: 아래 예제는, 라우트 resolve 가 함수 정의를 가르키고 있음을 보여줍니다. 이는 디버깅과 디펜던시 인젝션을 핸들 하기 쉽게 해줍니다.

  ```javascript
  /* even better */

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

    주의: 예제의 `movieService` 의존성은 코드 최소화에 안전하지 않습니다. 코드 최소화에 안전하도록 만들려면 여기를 참고하세요. [dependency injection](#manual-annotating-for-dependency-injection), [minification and annotation](#minification-and-annotation).

**[Back to top](#table-of-contents)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification
###### [Style [Y090](#style-y090)]

  - 최소화-안전 접근법을 사용하지 않으면서 의존성 정의 단축 문법을 사용하지 않도록 하세요.

    *이유*: 컨트롤러나 팩토리 같은 컴포넌트에 전달되는 파라미터들은 최소화된 이름으로 변경되어 버립니다. 예를 들어 `common` 과 `dataservice`는 `a` 또는 `b` 처럼 Angular에서 발견될 수 없게 되어버립니다.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    function DashboardController(common, dataservice) {
    }
    ```

    이 코드는 최소화된 변수명으로 런타임 에러를 발생시킬 수 있습니다.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('DashboardController', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
###### [Style [Y091](#style-y091)]

  - `$inject`를 사용하여 수동적으로 Angular 의존성을 정의하세요.

    *이유*: 이 방법은 [`ng-annotate`](https://github.com/olov/ng-annotate)에서 이용된 기술을 반영합니다. 또한 최소화 안전 의존성코드를 자동으로 최소화 시킬 때 추천합니다. 만약 `ng-annotate`이 이미 인젝션이 된 것을 탐지하면 반복해서 인잭션 하지 않게 됩니다.

    *이유*: 이 방법은 파라미터이 이름이 최소화 재생성 되었을 때 망가지기 쉬운 문제로 부터 보호해줍니다. `common` 와 `dataservice`는 `a` or `b`로 변경될 것이고 이는 Angular에서 찾을 수 없는 키워드입니다.

    *이유*: 어레이 형식의 한 줄 의존성 정의는 읽기가 어려우므로 피해야 합니다. 그리고 마지막 항목은 함수로 넘겨질 경우 앞쪽의 스트링으로 넘겨진 것들과 헷갈리기 쉽습니다.

    ```javascript
    /* avoid */
    angular
        .module('app')
        .controller('DashboardController',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* avoid */
    angular
      .module('app')
      .controller('DashboardController',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recommended */
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function DashboardController($location, $routeParams, common, dataservice) {
    }
    ```

    주의: `$inject` 실행 부분이 return 명령어 아래쪽에 위치할 경우, 실행되지 않게 됩니다. (이는 디렉티브에서 발생할 수 있습니다.) 이를 해결하기 위해서는 컨트롤러를 디렉티브의 바깥쪽에 위치시키면됩니다.

    ```javascript
    /* avoid */
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
    /* recommended */
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

  - `$inject`를 사용하면 수동으로 Angular 컴포넌트의 라우트 resolver 의존성을 구분하게 합니다.

    *이유*: 이 방법은 익명 함수를 라우트 resolver로부터 분리하여 읽기 쉬운 코드로 만들어줍니다.

    *이유*: `$inject` 구문은 의존성 최소화 안전화를 다루기 위해 쉽게 resolver로 진행할 수 있습니다.

    ```javascript
    /* recommended */
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

**[Back to top](#table-of-contents)**

## Minification and Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com)를 사용할 때 [ng-annotate](//github.com/olov/ng-annotate)를 사용하세요. 그리고 `/* @ngInject */`이 코맨트 함수를 사용하여 자동화된 의존성 인젝션을 사용하세요.

    *이유*: 최소화-안전 방식을 사용하지 않는 의존성 정의를 지켜줍니다.

    *이유*: [`ng-min`](https://github.com/btford/ngmin)는 제외 되었습니다.

    >나는 Gulp를 선호합니다. 작성하고 읽고 디버깅하기 쉽다고 생각합니다.

    아래 코드는 최소화 안전 의존성코드를 사용하지 않습니다.

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
    위의 코드가 포함된 코드가 ng-annotate를 거치게 되면 `$inject` 부분을 생성하게 되어 최소화 안전 코드가 됩니다.

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

    주의: 만약 `ng-annotate` 가 이미 인잭션 코드가 있음을 발견하면 이를 재생성하지 않습니다 (`@ngInject`를 발견하면).

    주의: 라우트 resolver를 사용할 경우 그 함수에도 `/* @ngInject */`를 사용할 수 있습니다. 이것은 적당한 구문을 생성하여 최소화 안전 의존성을 지켜줍니다.

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

    > 주의: Angular 1.3 부터는 [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) 디랙티브의 `ngStrictDi` 파라미터를 사용하면 잠재적으로 빠뜨려진 최소화 안전 코드를 찾아낼 수 있습니다. 이를 사용하면 "strict-di" 모드에서 만들어진 인젝터는 어플리케이션이 명시적 함수 구문을 사용하지 않는 함수를 호출하면 실행 실패를 유발 할 수 있습니다 (이는 최소화 안전하지 않습니다). 디버깅 시 이를 발생시킨 코드를 추적할 수 있는 정보를 콘솔에 뿌려줍니다. 나는 디버깅 시에만 `ng-strict-di`를 사용하는 것을 선호합니다.
    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate
###### [Style [Y101](#style-y101)]

  - [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate)를 사용하여 자동화 코드생성을 하세요. 의존성을 가지고 있는 모든 함수의 앞부분에 `/* @ngInject */`를 넣으세요.

    *이유*: ng-annotate는 대부분의 의존성을 잡아냅니다. 하지만 가끔 `/* @ngInject */`를 이용한 힌트가 필요할 수 있습니다.

    아래 코드는 ngAnnotate를 이용하는 걸프 작업의 예입니다.

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

**[Back to top](#table-of-contents)**

## Exception Handling

### decorators
###### [Style [Y110](#style-y110)]

  - 설정하는 부분에서 [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) 서비스를 사용할 때 [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator)를 사용하여 [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) 서비스를 이용하여 예외가 발생했을 때 대처하세요.

    *이유*: 개발기간과 실행시간에 발견되지 않은 Angular 예외를 일관되게 처리하도록 합니다.

    주의: 다른 방법으로는 decorator를 사용하지 않고 기존 서비스를 덮어쓰기 하는 것입니다. 이 방법은 나름 좋습니다. 하지만 기본적인 방법을 사용하면서 확장하고 싶다면 decorator를 추천합니다.

    ```javascript
    /* recommended */
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

  - 예외를 우아하게 처리하고 싶다면 팩토리를 만들어서 인터페이스를 노출하는 식으로 사용하세요.

    *이유*: 예를 들어 XHR 호출이나 프라미스 실패 시, 좀 더 일관적인 방식으로 코드에서 발생한 예외를 잡아줍니다.

    주의: 예외 캐쳐는 당신이 예상했던 호출에서 특정 예외가 발생했을 때 그것을 잡아내고 대처하는데 좋습ㄴ디ㅏ. 예를 들어 원격 웹 서비스에 접속해서 데이터를 가져오는 XHR 호출을 만들 때 그 서비스로 부터 예외를 받아서 특정한 방식으로 대처할 수 있습니다.

    ```javascript
    /* recommended */
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

  - [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError)를 사용하여 라우팅 에러를 다루고 기록할 수 있습니다.

    *이유*: 라우팅 에러를 일관적인 방법으로 처리할 수 있습니다.

    *이유*: 잠재적으로 더 나은 사용자 경험을 제공합니다. 사용자가 라우팅 에러를 마주하게 되면 좀 더 친숙한 페이지로 안내하거나 복구 선택도 가능하게 할 수 있습니다.

    ```javascript
    /* recommended */
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

**[Back to top](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [Y120](#style-y120)]

  - 다음의 패턴을 참고하여 모든 컴포넌트 파일 이름을 만드세요. 컴포넌트의 기능을 설명하는 이름에 (선택적으로) 그 것의 타입을 더 하면 됩니다. 제가 추천하는 이름은 `feature.type.js` 이런 식입니다. 대부분 다음과 같은 2 가지의 이름을 가지게 됩니다:
    * 파일 이름 (`avengers.controller.js`)
    * Angular 에 등록되는 컴포넌트 이름 (`AvengersController`)

    *이유*: 이름 짓는 규칙을 가지게 되면 금방 원하는 정보의 위치를 찾을 수 있습니다.
    프로젝트를 일관되게 하는 것은 필수적입니다. 팀 전체가 일관되는 것은 중요합니다. 회사 전체가 일관된 것은 어마한 효과를 가져옵니다.

    *이유*: 이름 규칙을 가지게 되면 일단 코드를 찾고 이해하는 데 매우 도움이 됩니다.

### Feature File Names
###### [Style [Y121](#style-y121)]

  - 다음의 패턴을 참고하여 모든 컴포넌트 파일이름을 만드세요. 컴포넌트의 기능을 설명하는 이름에 (선택적으로) 그것의 타입을 더 하면 됩니다. 제가 추천하는 이름은 `feature.type.js` 이런 식입니다.

    *이유*: 컴포넌트를 찾는데 매우 일관적인 빠른 방법을 제공합니다.

    *이유*: 자동화 업무를할 때 파일 선택의 패턴을 동일하게 사용할 수 있습니다.

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

  주의: 또 다른 컨트롤러를 이름 짓는 통용 관습으로는 `controller`라는 단어를 제외하는 것입니다. `avengers.controller.js`가 아닌 `avengers.js` 처럼 말이죠. 다른 대부분의 컴포넌트들은 접미사를 그대로 사용하게 둡니다. 컨트롤러가 제일 흔하게 사용되는 컴포넌트 타입이기 때문에 controller라고 명시하지 않아도 쉽게 구분할 수 있습니다. 이 중 한 가지 관습을 선택한 다음 전체 팀이 모두 같은 관습을 사용하도록 하기를 권장합니다. 제가 선호하는 방식은 `avengers.controller.js` 입니다.

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

  - 테스트 명세파일을 이름 지을 때는 추가 접미사 `spec`를 붙여서 만듭니다.

    *이유*: 일관적으로 빠르게 해당 컴포넌트를 찾을 수 있습니다.

    *이유*: [karma](http://karma-runner.github.io/)나 다른 테스트 러너에게 패턴 매칭으로 테스트 파일을 선택할 수 있게 할 수 있습니다.

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

  - 컨트롤러 이름을 지을 때는 그의 기능을 따서 일관된 이름을 짓도록 합니다. 생성자를 이름 지을 때는 대문자 캐멀 케이스를 사용하세요.

    *이유*: 일관된 방식으로 찾아내고 참조할 수 있도록 합니다.

    *이유*: 대문자 캐멀 케이스는 생성자로 구별되는 오브젝트를 구별하는 방식입니다.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController() { }
    ```

### Controller Name Suffix
###### [Style [Y124](#style-y124)]

  - 컨트롤러 이름에 `Controller`라는 접미사를 붙여주세요.

    *이유*: `Controller`접미사를 사용하는 것은 좀 더 일반적이고 또한 좀 더 명시적으로 설명적이기 때문입니다.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Factory and Service Names
###### [Style [Y125](#style-y125)]

  - 각각의 기능에 따라 팩토리와 서비스의 이름을 일관적으로 지어주세요. 대문자 캐멀 케이싱을 사용하세요. `$`를 접두어로 사용하는 것은 피하세요. 예를 들어 이름이 명사이거나 다른 이유로 이름 자체가 뭘 하는지 모호한 경우에만 접미사로 `Service`를 사용하세요.

    *이유*: 일관된 방식으로 팩토리를 찾아내고 참조할 수 있도록 합니다.

    *이유*: `$` 접두어가 붙어있는 내장된 팩토리와 서비스들과 이름 충돌이 일어나지 않도록 하세요.

    *이유*: `logger`같은 서비스는 굉장히 목적이 뚜렷하기 때문에 접미어가 필요하지 않습니다.

    *이유*: `avengers`같은 서비스 이름은 명사이고 확실한 기능이 떠오르지 않기 때문에 `avengersService`처럼 접미어를 붙여야 합니다.

    ```javascript
    /**
     * recommended
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

    ```javascript
    /**
     * recommended
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
  - 캐멀 캐이스를 이용해서 디렉티브 이름을 일관적으로 지어주세요. 짧은 접두어를 사용하여 이 디렉티브가 어떤 프로젝트 혹은 회사에 소속되어 있는지 알려주세요.

    *이유*: 일관된 방식으로 컴포넌트를 찾아내고 참조할 수 있도록 합니다.

    ```javascript
    /**
     * recommended
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

  - 여러개의 모듈이 존재할 경우, 중심이 되는 모듈은 `app.module.js` 로 이름을 짓고, 다른 의존 모듈들은 각자의 대표 기능을 따서 이름을 지으면 됩니다. 예를 들어 어드민 모듈은 `admin.module.js`으로 말이죠. 각가의 등록된 이름은 `app`과 `admin`이 될 겁니다.

    *이유*: 큰 어플리케이션으로 확장하기 위해서 여러 모듈을 사용할 때 일관성을 유지할 수 있습니다.

    *이유*: 자동화 작업을 위해 모듈 정의를 모두 로드하고, (바인딩을 위한) 모든 다른 angular 파일을 로드하는 것을 쉽게 만들어 줍니다.

### Configuration
###### [Style [Y128](#style-y128)]

  - 모듈의 이름을 따서 만든 파일에 설정 부분을 분리해서 넣도록 합니다. 중심 모듈인 `app`모듈의 설정파일은 `app.config.js`가 될 겁니다. (또는 간단히 `config.js`) `admin.module.js` 의 설정 파일은 `admin.config.js`이 됩니다.

    *이유*: 설정 파일을 모듈 정의, 컴포넌트, 작동 코드로 부터 분리합니다.

    *이유*: 모듈 설정 부분을 구분할 수 있는 곳을 제공합니다.

### Routes
###### [Style [Y129](#style-y129)]

  - 라우팅 설정 부분을 따로 만들어서 저장합니다. 예를 들어 `app.route.js`는 중심 모듈의 라우팅, `admin.route.js`는 `admin`모듈의 라우팅 설정이 됩니다. 비록 작은 앱이라도 저는 분리해서 저장하는 것을 선호합니다.

**[Back to top](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT
###### [Style [Y140](#style-y140)]

  - 앱을 구조적으로 만들게 되면 당신은 코드를 빠르게 `L`위치 추적 할 수 있고, 한눈에 `I`구분할 수 있고, `F`단순한 구조를 유지할 수 있고, DRY(반복하지 마세요)를 `T`유지할 수 있습니다. 구조는 다음 4 가지 가이드라인을 따르면 됩니다.

    LIFT *이유*: 규모를 잘 조절할 수 있는 일관된 구조를 제공합니다. 코드를 쉽게 찾을 수 있으므로 개발자의 효율을 쉽게 증대시킵니다. 다음 질문을 함으로서 앱이 구조가 잘 갖추어 져 있는지 확인할 수 있습니다.

    만약 다음 가이드라인에 적합하지 않는 부분이 있다고 느껴지면, 위로 돌아가서 LIFT 가이드라인을 다시 살펴보세요.

    1. `L`코드를 쉽게 찾아낼 수 있음
    2. `I`첫눈에 구분할 수 있음
    3. `F`단순한 구조를 유지할 수 있음
    4. `T`반복작업을 피할 수 있음

### Locate
###### [Style [Y141](#style-y141)]

  - 코드를 찾아내는 방법을 간단하고, 직관적이고 빠르게 해야 합니다.

    *이유*: 저는 이 부분이 어마어마하게 중요하다는 것을 알게 되었습니다. 팀 사람들이 그들이 필요한 파일을 빨리 찾을 수 없다면, 최대의 효율을 내서 일할 수 없습니다. 구조는 변경되어야 합니다. 간혹 당신은 파일명을 알 수 없고 어떤 파일과 관련이 있는지 알 수 없습니다. 그래서 최고의 직관적인 위치나 그 근처의 위치에 파일을 두는 것은 어마어마한 시간을 아껴줍니다. 설명적인 폴더 구조는 이를 도와줄 수 있습니다.

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

  - 파일명을 보면 즉시 그 안에 뭐가 있고 어떤 기능을 담고 있는지 알 수 있어야 합니다.

    *이유*: 파일을 찾으러 다니면서 소비되는 시간이 줄어들수록 업무의 효율은 증가합니다. 만약 그러다가 파일명이 길어진다면, 그냥 길게 쓰세요. 파일명이 충분히 설명적이어도 되고 그 안의 내용은 그 설명에 부합하는 1개의 컴포넌트 기능이어야 합니다. 한 파일 안에 여러 컨트롤러나 여러 서비스 또는 그 두 가지 들이 여럿 들어있으면 안 됩니다. 가끔 1파일 규칙을 어기게 되는 경우가 있습니다. 여러 가지의 작은 기능들인데 서로 관련되어 있는 경우입니다. 하지만 그렇게 하더라고 쉽게 구별할 수 있기 때문입니다.

### Flat
###### [Style [Y143](#style-y143)]

  - 최대한 수평적 구조를 갖도록 하세요. 7개 이상의 파일을 갖게 되면, 나눌 수 있도록 고려해보세요.

    *이유*: 7층의 폴더구조를 오가며 파일을 찾는 일은 쉽지가 않습니다. 웹사이트의 메뉴를 생각해보세요 ... 2단계 이상이 된다면 심각하게 재고를 해야 합니다. 폴더 구조에서는 그런 엄격한 룰은 존재하지 않지만, 한 폴더 안에 7-10개의 파일이 존재한다면, 하위 폴더를 만들 적절한 시기일 수 있습니다. 자신이 편하게 느끼는 정도로 말이죠. 명백한 이유가 있다면 하위 폴더를 만들되 그전까지는 나머지 LIFT를 지키기 위해 폴더를 수평적으로 유지하세요.

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - 반복작업 하지마세요. 그렇다고 너무 오버해서 가독성을 희생하지도 마세요.

    *이유*: 반복작업을 하지 않는 것은 중요합니다. 하지만 다른 LIFT 요소를 희생해야 한다면 그리 과하게 DRY를 지킬 필요는 없습니다. 그래서 저는 T-DRY 라고 명명합니다. (try-DRY) 나는 session-view.html 이라고 view를 위해 이름짓고 싶지 않습니다. 왜냐면 명백히 이것은 view 이기 때문이죠. 만약 이것이 명백하지 않고 다른 관습에 의한 게 아니라면 저는 그렇게 이름을 지을 겁니다.

**[Back to top](#table-of-contents)**

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  - 구현을 위한 생각을 가지되, 멀리 보고 고려하세요. 달리 말하자면, 작게 시작하지만 앞으로 얼마나 커질 수 있을지 항상 기억하세요. 모든 앱 코드는 `app`이라는 최상위 폴더에 들어갈 겁니다. 한 파일 안에는 한 가지 기능만 들어갑니다. 컨트롤러, 서비스, 모듈, 뷰는 각각의 파일을 가지고 그안에 넣습니다. 제 3의 외부 코드들은 `app`폴더가 아닌 다른 상위 폴더를 가지게 하세요. 내가 작성한 코드가 아니니 그 것들이 제 앱을 어지럽히기 원치 않으니까요 (`bower_components`, `scripts`, `lib`).
    주의: 구조를 만드는 것에 좀 더 구체적인 이유를 알고 싶으면 여기를 참고하세요. [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - 어플리케이션의 전체 레이아웃을 정의하는 컴포넌트는 `layout`이라는 폴더 안에 넣어주세요. 이는 쉘 뷰나 컨트롤러를 포함할 수 있고 앱, 네비게이션, 메뉴, 내용 부분, 그리고 다른 부분을 감사는 컨테이너로 역할을 할수 있습니다.

    *이유*: 레이아웃과 관련된 모든 것들을 한 곳에 넣어두고 전체 어플리케이션에서 재사용을 하도록 정리하세요.

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - 폴더를 만들 때는 그 기능을 따서 이름을 지으세요. 폴더가 점점 커져서 7개 파일 이상 가지게 되면 따로 폴더를 만들기를 고려하세요. 기준은 사람마다 다를 수 있습니다. 필요에 따라 조절하면서 진행하세요.

    *이유*: 개발자는 한눈에 각 코드의 위치를 파악하고 어떤 용도로 필요한지 구별할 수 있습니다. 최대한 폴더 구조가 수평적일수록 반복적이고 불필요한 이름이 적게 사용되게 됩니다.

    *이유*: LIFT 가이드 라인에 다 만족됩니다.

    *이유*: 코드 내용들을 LIFT 가이드라인을 다 만족하도록 정리하면 복잡하게 어질러질 가능성을 줄여줍니다.

    *이유*: 만약 많은 파일을 위치시켜야 한다면 일관적인 구조라면 쉽게 위치시킬 수 있지만 수평적 구조에서는 좀 더 어려울 수 있습니다.

    ```javascript
    /**
     * recommended
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

      ![심플한 앱 구조](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-2.png)

      주의: 타입별로 묶어서 폴더를 만드는 식으로 앱 구조를 만들지 마세요. 한 가지 기능에 대해서 일하려면 여러 폴더를 옮겨 다녀야 합니다. 이는 앱이 5, 10 또는 25 이상의 뷰와 컨트롤러(또는 다른 기능들)를 갖게되면 기능으로 나뉜 폴더일 경우보다 금방 거추장스러워 집니다.


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

**[Back to top](#table-of-contents)**

## Modularity

### Many Small, Self Contained Modules
###### [Style [Y160](#style-y160)]

  - 한 가지에 대해서 책임을 캡슐화하는 작은 모듈들을 만드세요.

    *이유*: 모듈화된 어플리케이션은 끼우고 사용하는 방법을 쉽게 합니다. 어플리케이션의 수직적 조각을 만들도록 도와주는데 이는 점차 역할을 합니다. 이것은 우리가 몇 가지 기능을 개발하는 동시에 조립해서 사용할 수 있다는 뜻입니다.

### Create an App Module
###### [Style [Y161](#style-y161)]

  - 중심적 역할을 하는 근본 모듈을 만들어서 모든 나머지 모듈과 기능들을 조직하고 협업되도록 하세요. 이 모듈의 이름은 전체 어플리케이션의 이름을 따서 지으세요.

    *이유*: Angular는 모듈화와 분리 패턴을 권장합니다. 근본 모듈을 만들어서 이 모듈이 다른 모듈들을 사용하게 함으로써 전체 모듈에 새로운 모듈을 추가하는 등의 작업을 직관적으로 만들어줍니다.

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - 어플리케이션 모듈에는 조직하는 로직만 넣도록 합니다. 기능들은 각각의 모듈에 들어가게 합니다.

    *이유*: 어플리케이션을 구성하는 로직 외, 원격 데이터를 가져오거나 뷰를 보여주거나 등의 로직을 근본 모듈에 넣게 되면 기능 모듈들을 재사용 어렵게 하고 기능을 잠시 꺼두기 어렵게 합니다.

    *이유*: 근본 모듈은 이 앱을 정의하는데 어떤 모듈들이 도움을 주는지 설명하는 목록이 됩니다.

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - 레이아웃 같은 기능 구역을 나타내는 모듈들, 재사용 가능하고 공유가 가능한 서비스, 대시보드, 특화된 기능들을 모듈로 만드세요 (예를 들어 고객, 어드민, 판매).

    *이유*: 자극 자족적인 모듈들은 어플리케이션에 아주 작은 충돌 혹은 아무 충돌 없이 추가될 수 있습니다.

    *이유*: 스프린트나 이터레이션은 기능 구역에 집중될 수 있고 마지막 부분에 켜질 수 있습니다.

    *이유*: 기능 구역을 구분하여 모듈화 하는것은 고립되고 재사용 코드로서 모듈 테스트에서 사용하기 쉽게 합니다.

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - 예외처리, 로깅, 진단, 보안, 그리고 로컬 데이터 저장 등의 일반적인 서비스들은 재사용 가능한 어플리케이션 블럭으로 모듈화 될 수 있습니다.

    *이유*: 이런 성격의 기능들은 많은 어플리케이션에서 사용될 수 있습니다. 이런 부분들을 분리하여 각각 모듈로 만들어두면 다른 어플리케이션에서 일반적인 부분으로 두루 사용될 수 있습니다.

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - 어플리케이션의 루트 모듈은 앱 특화된 기능모듈 그리고 재사용되고 공유된 모듈들에 의존하게 됩니다.

    ![모듈화 그리고 의존성](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-1.png)

    *이유*: 주요 앱 모듈은 어플리케이션의 기능들을 빠르게 구분할 수 있는 목록을 가지고 있습니다.

    *이유*: 각각의 기능 구역은 자신이 의존하고 있는 모듈의 목록을 가지고 있습니다. 이는 다른 어플리케이션에서 작동될 때 그 모듈을 참조함으로 문제없이 작동할 수 있습니다.

    *이유*: 공유 데이터 서비스 같은 인트라-앱 기능은 `app.core`(자신이 선호하는 이름으로 지으세요)라는 모듈에 넣어두면 찾기도 쉽고 공유하기도 쉽습니다.

    주의: 이것은 일관성을 위한 전략입니다. 다른 많은 좋은 옵션들도 있습니다. 어떤 것이든 일관되고 Angular의 의존성 규칙을 따르고, 유지보수가 쉽고 확장성이 있다면 선택해도 됩니다.

    > 내가 사용하는 구조는 프로젝트마다 조금씩 다릅니다. 하지만 모두 이 구조화, 모듈화에 대한 가이드라인을 지킵니다. 실제 구현방식은 팀마다 조금씩 다를 수 있습니다. 다르게 표현하자면, 완전히 똑같은 구조를 사용하려고 애쓰다가 전체를 거부하지 마세요. 일관성과 유지보수 그리고 효율을 마음에 두면서 자신의 구조를 직접 판단해보세요.

    > 또한 작은 앱들에서는 공유되는 의존 모듈들을 앱 모듈 폴더에 넣는 것도 고려하세요. 단 기능 모듈들이 직접 의존하지 않는 경우에 입니다. 이렇게 하면 작은 앱들은 유지하기가 쉽습니다. 하지만 다른 어플리케이션에서 이 모듈을 재사용하는것은 어려워 집니다.

**[Back to top](#table-of-contents)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Angular 앱을 실행하기 전에 인젝트 코드는 [모듈 설정](https://docs.angularjs.org/guide/module#module-loading-dependencies)에 설정되어 있어야 합니다. 이상적인 위치는 프로바이더와 상수 입니다.

    *이유*: 이는 설정하는 부분을 간결하게 합니다. 설정이 여기저기 퍼져있으면 유지보수하기 힘들고 헷갈리수 있습니다.

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

  - 어떠한 코드든 어플리케이션이 실행 될 때 실행되어야 한다면, 팩토리로 정의되어서 함수로 노출이 되고 [run block](https://docs.angularjs.org/guide/module#module-loading-dependencies)에 인젝트 되어야 합니다.

    *이유*: 실행 구역에 직접 작성된 코드는 테스트하기 어렵습니다. 팩토리에 넣어두면 추상화하고 흉내내기가 쉽습니다.

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

  - `document` 와 `window` 대신 [`$document`](https://docs.angularjs.org/api/ng/service/$document) 와 [`$window`](https://docs.angularjs.org/api/ng/service/$window)를 사용하세요.

    *이유*: 이 서비스들은 Angular에 의해서 감추어집니다. 그리고 window와 document를 사용해서 테스트 하는 것 보다 테스트를 쉽게 해줍니다. 또한 document와 window를 흉내 내도록 코드를 만들어야 하는것을 피하게 해줍니다.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - `setTimeout` 와 `setInterval` 대신 [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) 와 [`$interval`](https://docs.angularjs.org/api/ng/service/$interval)를 사용하세요.

    *이유*: 이 서비스들은 Angular에 의해서 감추어집니다. 데이터 바인딩을 유지시켜주기 때문에 테스트하기 좋고 Angular의 실행 주기를 다루는데 더 쉽습니다.

**[Back to top](#table-of-contents)**

## Testing
단위 테스팅은 깨끗한 코드를 유지하도록 도와줍니다. 여기에 단위 테스팅을 위한 약간의 권장 사항을 링크와 함께 제공하려고 합니다.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.
  - 모든 각각의 스토리를 위해서 테스트 세트를 작성하세요. 빈 테스트로 시작을 하고 스토리에 맞추어 코드를 작성하면서 채워나가세요.

    *이유*: 테스트 설명을 작성함으로 스스로의 스토리가 어떻게 작동해야 하고 어떻게 작동하지 말아야 하는지 투명하게 정의할 수 있습니다. 그리고 성공을 어떻게 측정해야 하는지도 포함됩니다.

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

  - [Jasmine](http://jasmine.github.io/) 또는 [Mocha](http://mochajs.org)를 사용하여 단위 테스트를 하세요.

    *이유*: Jasmine과 Mocha 모두 Angular 커뮤니티에서 두루 사용되고 있습니다. 둘다 안정적이고 잘 유지보수 되고 있으며 확실하게 기능 테스트를 할 수 있습니다.

    주의: 모카를 사용할 경우 [Chai](http://chaijs.com)와 같은 assert 라이브러리를 선택하세요. 저는 개인적으로 Mocha를 선호합니다.

### Test Runner
###### [Style [Y192](#style-y192)]

  - [Karma](http://karma-runner.github.io)를 테스트 실행자로 사용하세요.

    *이유*: Karma는 설정하기 쉽고 그냥 한 번 실행할 수도 있고 코드가 변경되면 자동으로 실행할 수 도 있습니다.

    *이유*: Karma는 그 자체로 또는 Grunt나 Gulp를 이용하여 지속적인 통합을 연결해 진행하기 쉽도록 해줍니다.

    *이유*: 어떤 IDE들은 Karma와 통합하기 시작했습니다. [WebStorm](http://www.jetbrains.com/webstorm/), [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225)

    *이유*: [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com)와 같은 자동화 선두주자들과 협업이 아주 좋습니다. Gulp를 사용한다면 [Karma](https://github.com/karma-runner/karma)를 플러그인을 사용하지 않고 직접적으로 API를 호출할 수 있습니다.

    ```javascript
    /* recommended */

    // Gulp example with Karma directly
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

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - 스터빙이나 스파잉을 위해서는 [Sinon](http://sinonjs.org/)를 사용하세요.

    *이유*: Sinon은 Jasmine과 Mocha 둘다와 잘 작동하고 스터빙과 스파잉 기능을 이용해 확장할 수 있습니다.

    *이유*: Sinon은 Jasmine과 Mocha 사이에서 왔다 갔다 하기 쉽게 해줍니다. 만약 둘다 시도해보고 싶은 경우에 말이죠.

    *이유*: 만약 테스트가 실패하면 Sinon은 설명적인 메시지를 보여줍니다.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - 테스트를 서버에서 실행하고 싶다면 [PhantomJS](http://phantomjs.org/)를 이용하세요.

    *이유*: PhantomJS는 "시각적" 브라우저를 필요로 하지 않고 테스트를 브라우저에서 실행할 수 있도록 도와줍니다. 크롬이나 사파리 IE 또는 어떠한 브라우저도 설치할 필요가 없습니다.

    주의: 대상 고객을 위해서 자신의 설치환경에서 모든 브라우저를 테스트해야 합니다. PhantomJS 테스트를 했다고 안심하면 안된다는 말입니다.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - 테스트에 JSHint를 사용하세요.

    *이유*: 테스트역시 코드입니다. JSHint는 테스트 코드의 질을 보증하고 테스트가 부정확하게 진행되는 것을 막아줍니다.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - `describe`와 `expect`같은 일반적인 글로벌 함수를 통과시키기 위해서 JSHint규칙을 완화하세요. Mocha 가 사용하는 표현식에 대한 규칙도 완화하세요.

    *이유*: 테스트 코드들도 실서버에 사용될 코드와 같은 주의와 질을 요구합니다. 하지만 테스트 코드에서 사용된 테스팅 프레임워크의 글로벌 변수같은 경우 아래 코드를 테스트 스팩에 포함하여 룰을 완화할 수 있습니다.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Or you can add the following to your JSHint Options file.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![테스팅 도구들](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/testing-tools.png)


### Organizing Tests
###### [Style [Y197](#style-y197)]

  - 단위 테스트 파일들을 자신의 클라이언트 코드와 쌍으로 띄워두세요. 서버 통합을 확인하거나 여러 컴포넌트의 테스트 요건을 분리된 `tests` 폴더에 넣어두세요.

    *이유*: 단위 테스트는 소스 코드의 특정 컴포넌트와 파일들과 직접적인 상호작용을 합니다.

    *이유*: 항상 눈에 보여지게 됨으로 최신으로 유지하기가 쉽습ㄴ디ㅏ. TDD 또는 개발중 테스트 또는 개발 후 테스트 중 어떤 것을 사용하든 테스트 스팩은 나란히 보여지고 눈에서 멀어지기 어렵고 마음에서도 멀어지기 어렵습니다. 그러니 코드를 테스팅하는 코드도 유지보수하기 쉬워집니다.

    *이유*: 소스코드를 수정하게 될 때 테스트도 동시에 수정하기가 매우 쉽습니다. 한폴더에 있고 보여지니까요.

    *이유*: 나중에 소스코드를 옮기게 되어도 코드와 나란히 있기 때문에 함께 옮기기도 쉽고 편합니다.

    *이유*: 테스트 스팩을 곁에 두는 것은 코드를 파악하려는 사람에게 컴포넌트가 어떻게 동작하게 만들어졌는지 한계는 무엇인지 파악하기 쉽게 합니다.

    *이유*: Grunt나 gulp를 이용하면 배포 서버에 올려지는 코드에서 테스트 스팩코드를 분리하는게 어렵지 않습니다.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.js
                             /customers.controller.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Back to top](#table-of-contents)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - 자연스러운 [Angular 애니매이션](https://docs.angularjs.org/guide/animations)을 사용하여 화면의 상태와 주요한 시각적 요소에 변화를 주세요. [ngAnimate 모듈](https://docs.angularjs.org/api/ngAnimate)를 포함하세요. 3 가지 중요 포인트는 자연스럽게, 부드럽게, 끊김없이 입니다.

    *이유*: 적합하게 사용된 자연스러운 애니매이션은 사용자 경험을 향상시킵니다.

    *이유*: 자연스러운 애니매이션은 티날정도로 화면의 변화를 향상시킵니다.

### Sub Second
###### [Style [Y211](#style-y211)]

  - 애니매이션은 짧게 사용하세요. 저는 보통 300ms 로 시작해서 적당하다 싶게 조절합니다.

    *이유*: 긴 애니메이션은 유저 경험에 반대 영향을 줄 수 있고 늦게 반응하는 어플리케이션이라는 시각효과를 줌으로서 인지 성능에 안좋은 영향을 줍니다.

### animate.css
###### [Style [Y212](#style-y212)]

  - 평범한 애니메이션을 위해서는 [animate.css](http://daneden.github.io/animate.css/)를 사용하세요.

    *이유*: animate.css이 제공하는 애니메이션들은 빠르고 부드럽고 쉽게 사용할 수 있습니다.

    *이유*: 애니매이션이 일관되게 사용되도록 해줍니다.

    *이유*: animate.css 널리 사용되고 있고 테스트 되었습니다.

    주의: [Angular 애니메이션에 대한 좋은 포스팅 by Matias Niemelä](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html) 여기를 참고하세요.

**[Back to top](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - 프로그램 문서를 만들고자 한다면, [`jsDoc`](http://usejsdoc.org/) 구문을 사용하여 함수이름 설명, 파라미터 리턴값 등을 명세하세요. `@namespace` 와 `@memberOf`를 사용하여 앱 구조와 맞추세요.

    *이유*: 문서를 처음부터 다 작성하지말고 코드로 부터 문서를 만들거나 재생성 할 수 있습니다.

    *이유*: 널리알려진 산업 툴을 사용함으로 일관성을 유지할수있습니다.

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

  - JS Hint를 사용하여 JavaScript 코드를 청소하세요. JS Hint 옵션 파일을 수정하고 소스 컨트롤에 추가하세요. 구체적인 옵션은 여기를 참고하세요 [JS Hint docs](http://www.jshint.com/docs/).

    *이유*: 소스 컨트롤에 코드를 전송하기 전에 경고를 받을 수 있습니다.

    *이유*: 팀 전체적으로 일관성을 유지할 수있습니다.

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

## JSCS

### Use an Options File
###### [Style [Y235](#style-y235)]

  - JSCS를 사용하여 JavaScript의 코딩 스타일을 체크하세요. JSCS 옵션파일을 수정하고 소스 컨트롤에 함께 넣어두세요. 더 많은 옵션 정보를 위해서는 여기를 확인하세요 [JSCS docs](http://www.jscs.info).

    *이유*: 소스 컨트롤에 코드를 전송하기 전에 경고를 받을 수 있습니다.

    *이유*: 팀 전체적으로 일관성을 유지할 수있습니다.

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

**[Back to top](#table-of-contents)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - 외부 라이브러리의 글로벌 변수를 위해서 Angular 상수를 생성하세요.

    *이유*: 외부 라이브러리를 글로벌 변수에 만들지 않고 인젝트 하는 방법을 제공합니다. 이렇게 하면 의존성 컴포넌트알게 되기 때문에 코드의 테스트 용이성이 높아집니다. (누설된 추상화를 방지) 또한 필요한 부분에 의존 컴포넌트들을 흉내내기 쉽게 해줍니다.

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

  - 변하지 않고 다른 서비스로부터 오지 않는 값들은 불변 상수를 이용하세요. 다양한 어플리케이션에서 재사용될 수 있는 모듈 내에서 사용되는 불변상 수들은 모듈의 이름을 딴 상수 파일을 만들어서 넣어두세요. 이 작업이 필요하기 전까지는 불변 상수는 메인 모듈의 `constants.js` 파일에 넣어두면 됩니다.

    *이유*: 자주 변하지 않더라도 변할 가능성이 있는 값들은 서비스로부터 받아서 사용해야 소스코드를 변경하지 않아도 되게 됩니다. 예를 들어 데이터를 받아오는 url 값은 상수로 저장해서 사용할 수도 있지만, 더 좋은 곳은 웹서비스로 부터 받아오는 것입니다.

    *이유*: 불변 상수는 브로바이더를 포함한 어떤 angular 컴포넌트에도 인젝트 될 수 있습니다.

    *이유*: 어떤 어플리케이션이 모듈화되어서 분리되어있다면 다른 어플리케이션에서 재사용 될 수 있습니다. 각각의 독립적인 모듈은 각각의 의존 상수를 불러옴으로 작동할 수 있어야 합니다.

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

**[Back to top](#table-of-contents)**

## File Templates and Snippets
파일 템플릿이나 스니펫을 사용하면 일관적인 스타일과 패턴을 지킬수 있습니다. 웹 개발용 에디터와 IDE들에서 사용 가능한 템플릿과 스니펫을 알려 드리겠습니다.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Angular 스니팻은 이 스타일과 가이드라인을 따릅니다.

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

  - Angular 파일 템플릿은 이 스타일과 가이드라인을 따릅니다 [SideWaffle](http://www.sidewaffle.com).

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Angular 라이브 템플릿들은 이 스타일과 가이드라인을 따릅니다.

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

  *각각의 템플릿 또한 여기서 다운받을 수 있습니다. [webstorm-angular-live-templates](assets/webstorm-angular-live-templates?raw=true)*

### Atom
###### [Style [Y253](#style-y253)]

  - Angular 스니팻은 이 스타일과 가이드라인을 따릅니다.
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

  - Angular 스니팻은 이 스타일과 가이드라인을 따릅니다.

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

  - Angular 스니팻은 이 스타일과 가이드라인을 따릅니다.

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

  - [Visual Studio Code](http://code.visualstudio.com) 스니팻은 이 스타일과 가이드라인을 따릅니다.

    - Download the [VS Code Angular snippets](assets/vscode-snippets/javascript.json?raw=true)
    - copy snippets to snippet directory, or alternatively copy and paste the snippets into your existing ones

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ```

**[Back to top](#table-of-contents)**

## Yeoman Generator
###### [Style [Y260](#style-y260)]

[HotTowel yeoman generator](http://jpapa.me/yohottowel)를 이용하여 앱을 만들면 이 스타일 가이드를 따르는 앱의 시작 부분을 생성하여 줍니다.

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

**[Back to top](#table-of-contents)**

## Routing
클라이언트-사이드 라우팅은 화면과 작은 템플릿과 디렉티브들로 구성된 합성 뷰 사이의 네비게이션 흐름을 생성하는데 중요합니다.

###### [Style [Y270](#style-y270)]

  - 클라이언트-사이드 라우팅을 위해서는 [AngularUI 라우터](http://angular-ui.github.io/ui-router/)를 사용하세요.

    *이유*: UI 라우터는 Angular 라우터의 모든 기능을 제공하고 추가적으로 내포 라우터, 상태를 제공합니다.

    *이유*: 구문법은 Angular 라우터와 매우 흡사하고 UI Router로 갈아타기 쉽게 되어있습니다.

  - 주의: `routerHelperProvider` 와 같은 프로바이더를 사용하여 진행 단계간에 파일들의 전체적인 설정을 도울 수 있습니다.

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

  - 뷰를 위한 라우팅 값을 모듈 안에 넣어두세요. 각각의 모듈은 뷰를 위한 라우팅 정보를 모듈 안에 두어야 합니다.

    *이유*: 각각의 모듈은 단독적으로 실행될 수 있어야 합니다.

    *이유*: 모듈을 제거하거나 추가할 때, 앱은 존재하는 뷰에 대해서만 라우팅 포인트를 가지고 있어야 합니다.

    *이유*: 홀로 남겨진 라우트가 생길 염려없이 어플리케이션의 부분을 활성화 비활성화 하기 쉽도록 해줍니다.

**[Back to top](#table-of-contents)**

## Task Automation
[Gulp](http://gulpjs.com) 또는 [Grunt](http://gruntjs.com)를 사용하여 자동화 처리를 사용하세요. Gult는 설정보다는 코드 자체에 무게를 더 주는 반면 Grunt는 설정을 더 중요하게 생각합니다. 개인적으로는 읽고 작성하기가 쉬워서 Gulp를 선호합니다. 하지만 둘다 정말 멋집니다.

> 여기를 참고하여 gulp 자동화 업무 패턴을 배우세요 [Gulp Pluralsight course](http://jpapa.me/gulpps).

###### [Style [Y400](#style-y400)]

  - 업무 자동화를 이용하여 `*.module.js` 패턴의 모듈 정의 파일을 리스팅 하세요.

    *이유*: Angular는 모듈이 등록되어 사용되기 전에 모듈 정의가 필요합니다.

    *이유*: `*.module.js`와 같은 패턴을 이용하여 모듈 이름을 지어놨기 때문에 찾아내기 쉽습니다.

    ```javascript
    var clientApp = './src/client/app/';

    // Always grab module files first
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Back to top](#table-of-contents)**

## Filters

###### [Style [Y420](#style-y420)]

  - 복잡한 오브젝트 그래프의 모든 프로퍼티를 스캔하기 위한 필터 사용을 자제하세요. 프로퍼티를 선택하기 위해 필터를 사용하세요.

    *이유*: 현명하게 사용되지 못한 필터는 남용될 수 있고 성능에 부정적 영향을 줄 수 있습니다. 예를 들어 크고 깊은 오브젝트 그래프를 필터로 걸르면 안 됩니다.

**[Back to top](#table-of-contents)**

## Angular docs
나머지 부분, API 참고는 [Angular 문서](//docs.angularjs.org/api)여기로 가시면 됩니다.

## Contributing

수정과 추가를 위해서는 이슈를 먼저 발행하시기 바랍니다. 이 가이드에 질문이 있으면 리파지토리에 이슈를 남겨주세요. 오타를 발견하면 pull request를 만들어주세요. 이렇게 하는 이유는 github의 기능을 최대한 사용해서 이슈와 PR이 어떻게 이루어 졌는지를 알려주기 위함입니다. 이런 정보는 구글로 검색도 가능합니다. 왜냐구요? 이상하게도 당신이 질문이 있다면 다른사람들도 그런 질문을 가지기 때문입니다. 여기서 어떻게 기여할 수 있는지 배울 수 있습니다.

*이 저장소에 기여함으로서 당신의 콘텐츠가 이 저장소의 라이센트의 대상이 됨을 동의합니다.*

### Process
    1. Discuss the changes in a GitHub issue.
    2. Open a Pull Request, reference the issue, and explain the change and why it adds value.
    3. The Pull Request will be evaluated and either merged or declined.

## License

_tldr; Use this guide. Attributions are appreciated._

### Copyright

Copyright (c) 2014-2015 [John Papa](http://johnpapa.net)

### (The MIT License)
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
