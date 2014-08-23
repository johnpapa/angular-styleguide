# AngularJS风格指南

*AngularJS风格指南[@john_papa](//twitter.com/john_papa)*

如果你正在寻找一些关于语法、约定和结构化的AngularJS应用的一个有建设性的风格指南，这个正适合你。这里所包含的风格是基于我用[AngularJS](//angularjs.org)、演讲、[Pluralsight培训课程](http://pluralsight.com/training/Authors/Details/john-papa)并且在团队中运用的一些经验。

这个风格指南的目的是通过展示我用到的约定给构建AngularJS应用提供指导，更加重要的是，我为什么要选择它们。

## Community Awesomeness and Credit
永远不要在真空下工作。我发现AngularJS社区是一个热衷于分享经验的令人难以置信的社区，因此，我的一个朋友、AngularJS专家Todd Motto和我合作了多种风格和惯例。我们同意其中的大多数，但是也有一些分歧。我鼓励你去看看[Todd的指引](https://github.com/toddmotto/angularjs-styleguide)，从其中了解他的做法和它们是如何比较的。

我的许多风格都是从大量的程序会话[Ward Bell](http://twitter.com/wardbell)和我所拥有的而来的，虽然我们并不总是能达成一致，但是Ward确实影响了本指南的最终演变。



## 目录

  1. [单一职责](#single-responsibility)
  1. [IIFE](#iife)
  1. [Modules](#modules)
  1. [Controllers](#controllers)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Data Services](#data-services)
  1. [Directives](#directives)
  1. [解决Controller的Promises](#resolving-promises-for-a-controller)
  1. [手动依赖注入](#manual-dependency-injection)
  1. [压缩和注释](#minification-and-annotation)
  1. [异常处理](#exception-handling)
  1. [命名](#naming)
  1. [应用程序结构LIFT原则](#application-structure-lift-principle)
  1. [应用程序结构](#application-structure)
  1. [模块化](#modularity)
  1. [Angular $ Wrapper Services](#angular--wrapper-services)
  1. [Testing](#testing)
  1. [Animations](#animations) 
  1. [Comments](#comments)
  1. [JSHint](#js-hint)
  1. [Constants](#constants)
  1. [AngularJS文档](#angularjs-docs)
  1. [贡献](#contributing)
  1. [许可](#license)

## 单一职责

  - **规则一**: 一个文件只定义一个组件。  

 	下面的一个例子在同一个文件中定义了一个`app`的module和它的一些依赖，定义了一个controller，一个factory。   

    ```javascript    
    /* avoid */    
    angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);
    	
    function SomeController() { }

    function someFactory() { }
    ```
    
	现在相同的组件被分割成单独的文件。

    ```javascript
    /* recommended */
    
    // app.module.js
    angular
    	.module('app', ['ngRoute']);
    ```

    ```javascript
    /* recommended */
    
    // someController.js
    angular
    	.module('app')
    	.controller('SomeController' , SomeController);

    function SomeController() { }
    ```

    ```javascript
    /* recommended */
    
    // someFactory.js
    angular
    	.module('app')
    	.factory('someFactory' , someFactory);
    	
    function someFactory() { }
    ```

**[返回顶部](#table-of-contents)**

## IIFE
  - **IIFE**: 把AngularJS组件包装到一个立即调用函数表达式中（IIFE）。 
  
  *为什么？*：把变量从全局作用域中删除了，这有助于防止变量和函数声明比预期在全局作用域中有更长的生命周期，也有助于避免变量冲突。

  *为什么？*：当你的代码为了发布而压缩了并且被合并到同一个文件中时，可能会有变量和很多全局变量的冲突，IIFE通过给每一个文件提供一个单独的作用域来保护你免受这些困扰。
  
    ```javascript
    /* recommended */
    // logger.js
    (function () {
      angular
        .module('app')
        .factory('logger', logger);

      function logger () { }
    })();

    // storage.js
    (function () {
      angular
        .module('app')
        .factory('storage', storage);

      function storage () { }
    })();
    ```

  - 注：为了简便起见，本指南余下的示例中将会省略IIFE语法。 

## Modules

  - **定义 (aka Setters)**: 不使用任何一个使用了setter语法的变量来定义modules。 

	*为什么?*: 在一个文件只有一个组件的条件下，很少有需要为一个模块引入一个变量。
	
    ```javascript
    /* avoid */
    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'app.shared',
        'app.dashboard'
    ]);
    ```

	用简单的getter语法来代替。

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

  - **Getters**: 当使用一个module的时候，避免使用一个变量，而是使用getter语法链接。

	*为什么？* : 这将产生更加易读的代码，并且可以避免变量冲突和泄漏。

    ```javascript
    /* avoid */
    var app = angular.module('app');
    app.controller('SomeController' , SomeController);
    
    function SomeController() { }
    ```

    ```javascript
    /* recommended */
    angular
      .module('app')
      .controller('SomeController' , SomeController);
    
    function SomeController() { }
    ```

  - **Setting vs Getting**: 只要设置一次，并且获取其它所有的实例。
	
	*为什么？*：一个module只能被创建一次，然后从该点恢复。
  	  
  	  - 用 `angular.module('app', []);` 设置一个module。
  	  - 用 `angular.module('app');` 获取一个module。 

  - **命名函数 vs 匿名函数**: 用一个命名函数而不是通过一个匿名函数作为回调函数。 

	*为什么？*：这将产生更加易读的代码，更加方便调试，减少嵌套回调函数的数量。

    ```javascript
    /* avoid */
    angular
      .module('app')
      .controller('Dashboard', function () { });
      .factory('logger', function () { });
    ```

    ```javascript
    /* recommended */

    // dashboard.js
    angular
      .module('app')
      .controller('Dashboard', Dashboard);

    function Dashboard () { }
    ```

    ```javascript
    // logger.js
    angular
      .module('app')
      .factory('logger', logger);

    function logger () { }
    ```

**[回到顶部](#table-of-contents)**

## Controllers

  - **controllerAs在View中的语法**: 使用[`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) 语法代替直接用经典的$scope定义的controller的方式。 

	*为什么？*：congtroller被构建的时候，就会有一个新的实例， `controllerAs` 的语法比`经典的$scope语法`更接近JavaScript构造函数

	*为什么？*：这促进在View中对绑定到’dotted‘的对象的使用（例如用`customer.name` 代替`name`），这将更有语境、更容易阅读，也避免了任何没有“dotting”而产生的引用问题。

	*为什么？*：有助于避免在有嵌套的controllers的Views中调用 `$parent`。

    ```html
    <!-- avoid -->
    <div ng-controller="Customer">
      {{ name }}
    </div>
    ```

    ```html
    <!-- recommended -->
    <div ng-controller="Customer as customer">
      {{ customer.name }}
    </div>
    ```

  - **controllerAs在controller中的语法**: 使用 `controllerAs` 语法代替 `classic controller with $scope` 语法。 

  - `controllerAs` 语法在controllers里面使用被绑定到`$scope`中的`this`。

	  *为什么？*：`controllerAs` 是`$scope`的语法修饰，你仍然可以绑定到View上并且访问 `$scope`的方法。 

	  *为什么？*：有助于避免在controller内部使用 `$scope`中的方法的诱惑，这能够更好地避免它们或把它们移到一个factory中。考虑到在factory中使用`$scope`，或者没办法的时候必须在controller中使用`$scope`，例如当使用[`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit)， [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast)，或者 [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on)来发布和订阅事件时，可以考虑把这些调用挪到factory当中，并从controller中调用。

    ```javascript
    /* avoid */
    function Customer ($scope) {
      $scope.name = {};
      $scope.sendMessage = function () { };
    }
    ```

    ```javascript
    /* recommended - but see next section */
    function Customer () {
      this.name = {};
      this.sendMessage = function () { };
    }
    ```

  - **controllerAs with vm**: 使用`controllerAs`语法时把`this` 赋值给一个捕获变量，选择一个相一致的名称，例如`vm`代表ViewModel。
    *为什么？*：`this`在不同的地方有不同的语义（就是作用域不同），在一个controller中的一个函数内部使用`this`时可能会改变它的上下文。用一个变量来捕获`this`的上下文从而可以避免遇到这个问题。

    ```javascript
    /* avoid */
    function Customer () {
      this.name = {};
      this.sendMessage = function () { };
    }
    ```

    ```javascript
    /* recommended */
    function Customer () {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function () { };
    }
    ```

  - 注：你可以按照下面的做法来避免 [jshint](http://www.jshint.com/)的警告。
    
  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```
 
  - **Bindable Members Up Top**: 把可绑定的成员放到controller的顶部，按字母排序，并且不要通过controller的代码传播。
  
    *为什么？*：把可绑定的成员放到顶部使代码更易读，并且帮助你可以马上判断controller中的哪些成员可以在View中绑定和使用。 

    *为什么？*：设置一个单行的匿名函数是很容易的，但是当这些函数的代码超过一行时，这将极大降低代码的可读性。把函数定义到可绑定成员下面（这些函数被提出来），把具体的代码细节放到下面，可绑定成员放到顶部，这会提高代码的可读性。 

    ```javascript
    /* avoid */
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
    /* recommended */
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

    - 注：如果一个函数就是一行，那么只要不影响可读性就把它放到顶部。

    ```javascript
    /* avoid */
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
    /* recommended */
    function Sessions(dataservice) {
        var vm = this;

        vm.gotoSession = gotoSession;
        vm.refresh = dataservice.refresh; // 1 liner is OK
        vm.search = search;
        vm.sessions = [];
        vm.title = 'Sessions';
    ```

  - **推迟Controller中的逻辑**: 通过委派到service和factory中来推迟controller中的逻辑。

    *为什么？*：把逻辑放到service中，并通过一个function暴露，就可以被多个controller重用。

    *为什么？*：把逻辑放到service中将会使单元测试的时候更加容易地把它们分离，相反，如果在controller中调用逻辑只会让这变得被别人嘲笑。

    *为什么？*：中删除依赖关系并且隐藏实现细节。

    ```javascript
    /* avoid */
    function Order ($http, $q) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit () { 
        var orderTotal = vm.total;
        return $http.get('api/creditcheck').then(function (data) {
            var remaining = data.remaining;
            return $q.when(!!(remaining > orderTotal));
        });
      };
    }
    ```

    ```javascript
    /* recommended */
    function Order (creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit () { 
        return creditService.check();
      };
    }
    ```

  - **Assigning Controllers**: 当一个controller必须匹配一个view时或者任何一个组件可能被其它controller或是view重用时，连同controller的route一起定义。 
    
    - 注：如果一个view是通过route外的其它形式加载的，那么就用`ng-controller="Avengers as vm"`语法。 

    *为什么？*：在route中匹配controller允许不同的路由调用不同的相匹配的controller和view，当在view中通过[`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController)分配controller时，这个view总是和相同的controller相关联。

   ```javascript
   
    /* avoid - when using with a route and dynamic pairing is desired */

    // route-config.js
    angular
      .module('app')
      .config(config);

    function config ($routeProvider) {
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
    /* recommended */

    // route-config.js
    angular
      .module('app')
      .config(config);

    function config ($routeProvider) {
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

**[返回顶部](#table-of-contents)**

## Services

  - **单例**: 用`new`实例化service，用`this`实例化公共方法和变量。也可以用factory，这是我推荐的保持一致性的做法。 
  
  - 注意：[所有的AngularJS services都是单例](https://docs.angularjs.org/guide/services)，这意味着每个injector都只有一个实例化的service。

    ```javascript
    // service

    angular
        .module('app')
        .service('logger', logger);

    function logger () {
      this.logError = function (msg) {
        /* */
      };
    }
    ```

    ```javascript
    // factory
    angular
        .module('app')
        .factory('logger', logger);

    function logger () {
      return {
        logError: function (msg) {
          /* */
        }
      };
    }
    ```

**[返回顶部](#table-of-contents)**

## Factories

  - **单一职责**: factory应该是[单一职责](http://en.wikipedia.org/wiki/Single_responsibility_principle)，这是由其上下文进行封装的。一旦一个factory将要处理超过单一的目的时，就应该创建一个新的factory。

  - **单例**: facotry是一个单例，它返回一个包含service成员的对象。
  
  - 注意：[所有的AngularJS services都是单例](https://docs.angularjs.org/guide/services)，这意味着每个injector都只有一个实例化的service。

  - **公共成员放到顶部**: 使用从[显露模块模式](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)派生出来的技术把service中可调用的成员暴露到顶部， 

    *为什么？*：把可调用的成员放到顶部使代码更加易读，并且让你可以立即识别service中的哪些成员可以被调用，哪些成员必须进行单元测试（或者被别人嘲笑）。 

    *为什么？*：当文件变长时，这将非常有用，因为这可以避免需要滚动才能看到暴露了哪些东西。

    *为什么？*：以你的方式设置函数是很容易的，但当函数代码超过一行时就会降低可读性并造成滚动。通过把实现细节放下面、可调用接口放到顶部的返回service的方式来定义可调用的接口，从而使代码更加易读。

    ```javascript
    /* avoid */
    function dataService () {
      var someValue = '';
      function save () { 
        /* */
      };
      function validate () { 
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
    function dataService () {
      var someValue = '';
      var service = {
        save: save,
        someValue: someValue,
        validate: validate
      };
      return service;

      ////////////
      function save () { 
        /* */
      };

      function validate () { 
        /* */
      };
    }
    ```

  - 这种绑定方式复制了宿主对象，原始值不会随着暴露模块模式的使用而更新。

  ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

**[返回顶部](#table-of-contents)**

## Data Services

  - **独立的数据调用**: 把进行数据操作和数据交互的逻辑放到factory中，数据服务负责XHR请求、本地存储、内存存储和其它任何数据操作。

    *为什么？*：controller的作用是查看view和收集view的信息，它不应该关心如何取得数据，只需要知道哪里需要用到数据。把取数据的逻辑分离到data service中能够让controller更简单、更专注于对view的控制。

    *为什么？*：使用这种方式使得测试数据调用这一块更加简单。

    *为什么？*：data service的实现可能有非常明确的代码来处理数据仓库，这可能包含headers、如何与数据交互或是其它service，例如$http。把逻辑分离到data service中，把逻辑封装到了一个单独的地方，这隐藏了外部消费者（可能是controller）对数据的直接操作，这使得改变执行更加容易。

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
    - 注意：data service是被消费者调用的（例如controller），隐藏了消费者的直接行为，如下所示。

    ```javascript
    /* recommended */

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
              .then(function (data) {
                  vm.avengers = data;
                  return vm.avengers;
              });
        }
    }      
    ```

- **从Data调用那里返回一个Promise**: 就像$http一样，当调用data service时返回一个promise，在你的调用函数中也返回一个promise。

    *为什么？*：你可以把promise链接到一起，在数据调用完成并且resolve或是reject这个promise后采取进一步的行为。

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
          .then(function (data) {
              /**
               * Step 3
               * set the data and resolve the promise
               */
              vm.avengers = data;
              return vm.avengers;
          });
    }
    ```

    **[返回顶部](#table-of-contents)**


## Directives
- **一个文件限制一个**: 在一个文件中只创建一个directive，并依照directive来命名文件。 

    *为什么？*：把所有directive放到一个文件中很容易，但是当一些directive是跨应用的，一些是跨模块的，一些仅仅在一个模块中使用时，想把它们独立出来是非常困难的。
    *为什么？*：一个文件一个directive也更加容易维护。

    ```javascript
    /* avoid */
    angular
      .module('app.widgets')

      /* order directive that is specific to the order module */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales directive that can be used anywhere across the sales app */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* spinner directive that can be used anywhere across apps */
      .directive('sharedSpinner', sharedSpinner);

      /* implementation details */
    ```

    ```javascript
    /* recommended */

    /**
     * @desc order directive that is specific to the order module at a company named Acme
     * @file calendarRange.directive.js
     * @example <div acme-order-calendar-range></div>
     */
    angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange)

    /**
     * @desc spinner directive that can be used anywhere across the sales app at a company named Acme
     * @file customerInfo.directive.js
     * @example <div acme-sales-customer-info></div>
     */    
    angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

    /**
     * @desc spinner directive that can be used anywhere across apps at a company named Acme
     * @file spinner.directive.js
     * @example <div acme-shared-spinner></div>
     */
    angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

      /* implementation details */
    ```

    - 注意：directive有很多命名选项，特别是从它们能够在一个狭隘的或者广泛的作用域中使用时，选择一个让directive和文件都清楚分明的名字。下面有一些例子，不过更多的建议去看命名章节。

- **限制DOM操作**: 当需要直接操作DOM的时候，使用directive。如果有替代方法可以使用，例如：使用CSS来设置样式、[animation services](https://docs.angularjs.org/api/ngAnimate)、Angular模板、[`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide)，那么就直接用这些即可。例如，如果一个directive只是想控制显示和隐藏，用ngHide/ngShow即可，但是如果directive还想做更多的事，在directive中结合使用hide和show将会提高性能，因为这能够减少watchers。 

    *为什么？*：DOM操作的测试和调试是很困难的，通常会有更好的方法（CSS、animations、templating）。

- **限制元素和属性**: 当创建一个directive需要作为一个独立元素是有意义时，允许限制`E`（自定义元素），可选限制`A`（自定义属性）。一般来说，如果它可能是它自己的控制，用`E`是合适的做法。一般原则是允许`EA`，但是当它是独立的时候这更倾向于作为一个元素来实施，当它是为了增强已存在的DOM元素时则更倾向于作为一个属性来实施。

    *为什么？*：这很有意义！

    *为什么？*：虽然我们允许directive被当作一个class来使用，但如果这个directive的行为确实像一个元素的话，那么把directive当作元素或者属性是更有意义的。

    ```html
    <!-- avoid -->
    <div class="my-calendar-range"></div>
    ```

    ```javascript
    /* avoid */
    angular
        .module('app.widgets')
        .directive('myCalendarRange', myCalendarRange);

    function myCalendarRange () {
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

    function myCalendarRange () {
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

**[返回顶部](#table-of-contents)**

## 解决Controller的Promises

  - **Controller Activation Promises**: 在`activate`函数中解决controller的启动逻辑。
     
    *为什么？*：把启动逻辑放在一个controller中固定的位置可以更方便定位、有更加一致性的测试，并能够避免在controller中到处都是激活逻辑。

    - 注意：如果你需要在开始使用controller之前有条件地取消路由，那么就用route resolve来代替。
    
    ```javascript
    /* avoid */
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
    /* recommended */
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

  - **Route Resolve Promises**: 当一个controller依赖于一个promise来解决，那么就在controller的逻辑执行之前在`$routeProvider`中解决这些依赖。如果你需要在controller被激活之前有条件地取消一个路由，那么就用route resolver。

    *为什么？*：controller在加载前可能需要一些数据，这些数据可能是从一个通过自定义factory或是[$http](https://docs.angularjs.org/api/ng/service/$http)的promise而来的。[route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)允许promise在controller的逻辑执行之前解决，因此它可能对从promise中来的数据做一些处理。 

    ```javascript
    /* avoid */
    angular
      .module('app')
      .controller('Avengers', Avengers);

    function Avengers (movieService) {
      var vm = this;
      // unresolved
      vm.movies;
      // resolved asynchronously
      movieService.getMovies().then(function (response) {
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

    function config ($routeProvider) {
      $routeProvider
        .when('/avengers', {
          templateUrl: 'avengers.html',
          controller: 'Avengers',
          controllerAs: 'vm',
          resolve: {
            moviesPrepService: function (movieService) {
                return movieService.getMovies();
            }
          }
        });
    }

    // avengers.js
    angular
      .module('app')
      .controller('Avengers', Avengers);

    function Avengers (moviesPrepService) {
      var vm = this;
      vm.movies = moviesPrepService.movies;
    }

    ```

**[返回顶部](#table-of-contents)**

## 手动依赖注入

  - **缩写的不安全性**: 声明依赖时避免使用不带安全压缩方法的缩写语法。
  
      *为什么？*：组件的参数（例如controller、factory等等）将会被转换成各种乱七八糟错误的变量。例如，`common`和`dataservice`可能会变成`a`或者`b`，但是这些转换后的变量在AngularJS中是找不到的。

    ```javascript
    /* avoid - not minification-safe*/
    angular
      .module('app')
      .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    - 这一段代码在压缩时会产生错误的变量，因此在运行时就会报错。

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

  - **手动添加依赖**: 用$inject手动添加AngularJS组件所需的依赖。
  
      *为什么？*：这种技术反映了使用[`ng-annotate`](https://github.com/olov/ng-annotate)的技术，这就是我推荐的对依赖关系进行自动化创建安全压缩的方式，如果`ng-annotate`检测到已经有了注入，那么它就不会再次重复执行。

      *为什么？*：可以避免依赖变成其它AngularJS找不到的变量，例如，`common`和`dataservice`可能会变成`a`或者`b`。

      *为什么？*：避免创建内嵌的依赖，因为一个数组中很长的列表是很难阅读的，此外，内嵌的方式也会让人感到困惑，比如数组是一系列的字符串，但是最后一个却是组件的function。 

    ```javascript
    /* avoid */
    angular
      .module('app')
      .controller('Dashboard', 
        ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recommended */
    angular
      .module('app')
      .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    - 注意：当你的函数处于一个return语句下，那么$inject可能无法访问（这回在directive中发生），你可以通过把$inject移到return语句上面或是用数组语法来解决这个问题。

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


**[返回顶部](#table-of-contents)**

## 压缩和注释

  - **ng-annotate**: 在[Gulp](http://gulpjs.com)或[Grunt](http://gruntjs.com)中使用[ng-annotate](//github.com/olov/ng-annotate)，用`/** @ngInject */`对需要自动依赖注入的function进行注释。
  
      *为什么？*：可以避免代码中使用到任何会造成不安全压缩的依赖的写法。

      *为什么？*：[`ng-min`](https://github.com/btford/ngmin)是不推荐的用法。 

    - 下面的代码没有使用压缩安全依赖。

    ```javascript
    angular
      .module('app')
      .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers (storageService, avengerService) {
      var vm = this;
      vm.heroSearch = '';
      vm.storeHero = storeHero;

      function storeHero(){
        var hero = avengerService.find(vm.heroSearch);
        storageService.save(hero.name, hero);
      }
    }
    ```

    - 当上面的代码通过ng-annotate运行时，就会产生如下的带有`$inject`注释的输出结果，这样的话压缩就会安全了。

    ```javascript
    angular
      .module('app')
      .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers (storageService, avengerService) {
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

    - 注意：如果`ng-annotate`检测到已经有注入了（例如发现了`@ngInject`），就不会重复生成`$inject`代码了。

    - 注意：从AngularJS 1.3 开始用[`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp)指令的 `ngStrictDi`参数，当以“strict-di”模式创建injector时，会导致应用程序无法调用不使用显示函数注释的函数（这也许不能安全压缩）。记录在控制台的调试信息可以帮助追踪出问题的代码。
    `<body ng-app="APP" ng-strict-di>`

  - **使用Gulp或Grunt结合ng-annotate**: 在自动化任务中使用[gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate)或[grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate)，把`/* @ngInject */`注入到任何有依赖关系函数的前面。
  
      *为什么？*：ng-annotate会捕获大部分的依赖关系，但是有时候需要借助于`/* @ngInject */`语法提示。

    - 下面的代码是gulp任务使用ngAnnotate的例子。

    ```javascript
    gulp.task('js', ['jshint'], function () {
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

**[返回顶部](#table-of-contents)**

## 异常处理

  - **修饰符**: 使用一个[decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator)，在配置的时候用[`$provide`](https://docs.angularjs.org/api/auto/service/$provide)服务，当发生异常时，在[`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler)服务中执行自定义的处理方法。
  
      *为什么？*：在开发时和运行时提供了一种统一的方式来处理未被捕获的AngularJS异常。

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
        return function (exception, cause) {
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

  - **异常捕获器**: 创建一个暴露了一个接口的factory来捕获异常并以合适方式处理异常。

      *为什么？*：提供了一个统一的方法来捕获代码中抛出的异常。

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
            return function (reason) {
                logger.error(message, reason);
            };
        }
    }
    ```

  - **路由错误**: 用[`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError)来处理并打印出所有的路由错误信息。

      *为什么？*：提供一个统一的方式来处理所有的路由错误。

      *为什么？*：当一个路由发生错误的时候，如果能把用户带到一个有更多细节或是恢复选项的友好界面的话将会带来更好的用户体验。

    ```javascript
    /* recommended */
    function handleRoutingErrors() {
        /**
         * Route cancellation:
         * On routing error, go to the dashboard.
         * Provide an exit clause if it tries to do it twice.
         */
        $rootScope.$on('$routeChangeError',
            function (event, current, previous, rejection) {
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

**[返回顶部](#table-of-contents)**

## 命名
  - **命名原则**: 遵循以描述组件功能，然后是类型（可选）的方式来给所有的组件提供统一的命名，我推荐的做法是`feature.type.js`。大多数文件都有2个名字。
    *   文件名 
    *   带有Angular的注册文件名
 
    *为什么？*：命名约定有助于为一目了然地找到内容提供一个统一的方式，在项目中和团队中保持统一性是非常重要的，保持统一性对于跨公司来说提供了巨大的效率。

    *为什么？*：命名约定应该只为代码的检索和沟通提供方便。 


  - **功能文件命名**: 遵循以描述组件功能，然后是类型（可选）的方式来给所有的组件提供统一的命名，我推荐的做法是`feature.type.js`。

    *为什么？*：为快速识别组件提供了统一的方式。

    *为什么？*：为任何自动化的任务提供模式匹配。

    ```javascript
    /**
     * common options 
     */

    // Controllers
    avengers.js
    avengers.controller.js
    avengersController.js
    avengersCtrl.js

    // Services/Factories
    logger.js
    logger.service.js
    loggerService.js
    loggerSvc.js
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

  - 另一种做法：另外一种常见的约定就是不要用`controller`这个词来给controller文件命名，例如不要用`avengers.controller.js`，而是用`avengers.js`。所有其它的约定都坚持使用类型作为后缀，但是controller是组件中最为常用的类型，因此这种做法的好处貌似仅仅是节省了打字，但是仍然很容易识别。我建议你为你的团队选择一种约定，并且要保持统一性。
  
    ```javascript
    /**
     * recommended
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

  - **测试文件命名**: 和组件命名差不多，带上一个`spec`后缀。 

      *为什么？*：为快速识别组件提供统一的方式。

      *为什么？*：为[karma](http://karma-runner.github.io/)或是其它测试运行器提供模式匹配。

    ```javascript
    /**
     * recommended
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

  - **Controller命名**: 为所有controller提供统一的名称，特征然后名字，鉴于controller是构造函数，所以要采用pascal-casing（每个单词首字母大写）的方式。

      *为什么？*：为快速识别和引用controller提供统一的方式。

      *为什么？*：Pascal-casing是常规的识别一个可以用构造函数来实例化的对象的方式。

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
      .module
      .controller('Avengers', Avengers);

    function Avengers(){ }    
    ```
    
  - **Factory命名**: 一样要统一，对service和factory使用camel-casing（驼峰式，第一个单词首字母小写，后面单词首字母大写）方式。

      *为什么？*：可以快速识别和引用controller。
    
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

  - **Directive组件命名**: 使用camel-case方式，用一个短的前缀来描述directive在哪个区域使用（一些例子中是使用公司前缀或是项目前缀）。

      *为什么？*：可以快速识别和引用controller。

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

  - **模块**: 当有很多的模块时，主模块文件命名成`app.module.js`，其它依赖模块以它们代表的东西来命名。例如，一个管理员模块命名成`admin.module.js`。它们各自的注册模块名字就是`app`和`admin`，一个单一的app模块也许被命名成省略了module尾巴的`app.js`。

    *为什么？*：一个只有一个模块的app命名成`app.js`，它就代表这个app，所以为什么不简单的呢？
 
    *为什么？*：给多模块的应用提供统一的方式，这也是为了扩展大型应用。

    *为什么？*：对使用任务来自动化加载所有模块的定义（先）和其它所有的angular文件（后）提供了一种简单的方式。

  - **配置**: 把一个模块的配置独立到它自己的文件中，以这个模块为基础命名。`app`模块的配置文件命名成`app.config.js`（或是`config.js`），`admin.module.js`的配置文件命名成`admin.config.js`。

    *为什么？*：把配置从模块定义、组件和活跃代码中分离出来。

    *为什么？*：为设置模块的配置提供了一个可识别的地方。

  - **路由**: 把路由的配置独立到单独的文件。主模块的路由可能是`app.route.js`，`admin`模块的路由可能是`admin.route.js`。即使是在很小的应用中，我也喜欢把路由的配置从其余的配置中分离出来。另一种方式是用一个很长的名字，例如`admin.config.route.js`。


**[返回顶部](#table-of-contents)**

## 应用程序结构的LIFT准则
  - **LIFT**: 构建一个可以快速定位（`L`ocate）代码、一目了然地识别（`I`dentify）代码、拥有一个平直（`F`lattest）的结构、尽量（`T`ry）坚持DRY（Don’t Repeat Yourself）的应用程序，其结构应该遵循这4项基本准则。

      *为什么是LIFT?*: 提供一个有良好扩展的结构，并且是模块化的，更快的找到代码能够帮助开发者提高效率。另一种检查你的app结构的方法就是问你自己：你能多块地打开涉及到一个功能的所有相关文件并开始工作？

    当我发现我的的代码结构很恶心的时候，我就重新看看LIFT准则。
  
    1. 轻松定位代码（L）
    2. 一眼识别代码（I）
    3. 平直的代码结构（层级不要太多）（F）
    4. 尽量保持不要写重复代码（T）

  - **Locate**: 更直观、更简单、更快捷地定位代码

      *为什么？*：我发现这对于一个项目是非常重要的，如果一个团队不能快速找到他们需要工作的文件，这将不能使团队足够高效地工作，那么这个代码结构就得改变。你可能不知道文件名或是相关的文件放在了哪里，那么就把他们放在最直观的地方，放在一起会节省大量的时间。一个参考目录结构。

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

  - **Identify**: 当你看到一个文件时你应该能够立即知道它包含了什么、代表了什么。

      *为什么？*：你花费更少的时间来了解代码代表了什么，并且变得更加高效。如果这意味着你需要更长的名字，那么就这么干吧。文件名一定要具有描述性，保持和文件内容互为一体。避免文件中有多个controller，多个service，甚至是混合的。

  - **Flat**: 尽可能长时间地保持一个平直的文件夹结构，如果你的文件夹层级超过7+，那么就开始考虑分离。

      *为什么？*：没有谁想在一个7级文件夹中寻找一个文件，你可以考虑一下网页导航栏有那么多层。文件夹结构没有硬性规则，但是当一个文件夹下的文件有7-10个，那么就是时候创建子文件夹了，文件夹的层级一定要把握好。一直使用一个平直的结构，直到确实有必要（帮助其它的LIFT）创建一个新的文件夹。

  - **T-DRY（尽量坚持DRY）**: 坚持DRY，但是不要疯了一样的做却牺牲了可读性。

      *为什么？*：保持DRY很重要，但是如果牺牲了其它LIFT，那么它就没那么重要了，这就是为什么说尽量坚持DRY。


**[返回顶部](#table-of-contents)**

## 应用程序结构
  - **总指南**: 有实施的短期看法和长远的目标，换句话说，从小处入手，但是要记住app的走向。app的所有代码都在一个叫做`app`的根目录下，所有的内容都遵循一个功能一个文件，每一个controller、service、module、view都是独立的文件，允许把一些小的、短的directive放到一个`directive.js`文件中。第三方脚本存放在另外的根文件夹中（`bower_components`, `scripts`, `lib`）。

  - **Layout**: 把定义应用程序总体布局的组件放到`layout`文件夹中，如导航、内容区等等。

    *为什么？*：复用。
    
  - **按功能划分文件夹结构**: 按照它们代表的功能来给创建的文件夹命名，当文件夹包含的文件超过7个（根据需要自行调整数量限制），就考虑新建文件夹。

    *为什么？*：开发者可以快速定位代码、快速识别文件代表的意思，结构尽可能平直，没有重复，没有多余名字。 

    *为什么？*：LIFT指南都包括在内。

    *为什么？*：通过组织内容和让它们保持和LIFT指导准则一致，帮助降低应用程序变得混乱的可能性。

    *为什么？*：超过10个文件时，在一个一致性的文件夹中很容易定位，但是在一个平直的文件夹结构中确实很难定位。

    ```javascript
    /**
     * recommended
     */

    app/
        app.module.js
        app.config.js
        app.routes.js
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
        sessions/
            sessions.html      
            sessions.controller.js
            session-detail.html
            session-detail.controller.js   
    ```

      - 注意：使用按类型划分文件夹结构是另一种常见的选择。不过这样的话，当做一个功能时，需要在多个文件夹中来回切换。当应用程序有5个、10个，甚至是25个以上的view、controller（或其他feature）时，这种方式将迅速变得不实用，这就使得它定位文件比按功能分文件夹的方式要困难的多。

    ```javascript
    /* 
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
        views/
            attendees.html     
            session-detail.html
            sessions.html      
            shell.html         
            speakers.html      
            speaker-detail.html
            topnav.html         
        services/       
            dataservice.js  
            localstorage.js
            logger.js   
            spinner.js
    ``` 
    
      
**[返回顶部](#table-of-contents)**

## 模块化
  
  - **许多小的、独立的模块**：创建只有一个职责的小模块。

    *为什么？*：模块化的应用程序很容易插入新的功能。

  - **创建一个App Module**： 创建一个应用程序的根模块，它的职责是把应用程序中所有的模块和功能都放到一起。

    *为什么？*：AngularJS鼓励模块化和分离模式。创建根模块的作用是把其它模块都绑定到一起，这为增加或是删除一个模块提供了非常简单的方法。

  - **保持App Module的精简**：app module中只放聚合其它模块的逻辑，具体功能在它们自己的模块中实现。

    *为什么？*：添加额外的代码（获取数据、展现视图、其它和聚合模块无关的代码）到app module中使app module变得很糟糕，也使得模块难以重用和关闭。

  - **功能区域就是模块**: 创建代表功能区的模块，例如布局、可重用、共享服务、仪表盘和app的特殊功能（例如客户、管理、销售）。

    *为什么？*：自包含的模块可以无摩擦地被添加到应用程序中。

    *为什么？*：冲刺或迭代可以专注于功能，在结束阶段启用它们。

    *为什么？*：分离功能为模块可以更容易测试。

  - **可重用的块就是模块**: Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *为什么？*：These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.
     
  - **Module Dependencies**: The application root module depends on the app specific feature modules, the feature modules have no direct dependencies, the cross-application modules depend on all generic modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *为什么？*：The main app module contains a quickly identifiable manifest of the application's features. 

    *为什么？*：Cross application features become easier to share. The features generally all rely on the same cross application modules, which are consolidated in a single module (`app.core` in the image).

    *为什么？*：Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    - Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    >> My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind.


**[返回顶部](#table-of-contents)**

## Angular $ Wrapper Services

  - **$document and $window**: Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *为什么？*：These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

  - **$timeout and $interval**: Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *为什么？*：These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Back to top](#table-of-contents)**

## Testing

Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

  - **Write Tests with Stories**: Write a set of tests for every story. Start with an empty test and fill them in as your write the code for the story.

    *为什么？*：Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

    ```javascript
    it('should have Avengers controller', function () {
        //TODO
    });

    it('should find 1 Avenger when filtered by name', function () {
        //TODO
    });

    it('should have 10 Avengers', function () {}
        //TODO (mock data?)
    });

    it('should return Avengers via XHR', function () {}
        //TODO ($httpBackend?)
    });

    // and so on
    ```

  - **Testing Library**: Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://visionmedia.github.io/mocha/) for unit testing.

    *为什么？*：Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

  - **Test Runner**: Use [Karma](http://karma-runner.github.io) as a test runner.

    *为什么？*：Karma is easy to configure to run once or automatically when you change your code.

    *为什么？*：Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *为什么？*：Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *为什么？*：Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

  - **Stubbing and Spying**: Use Sinon for stubbing and spying.

    *为什么？*：Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *为什么？*：Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

  - **Headless Browser**: Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *为什么？*：PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safaria, IE, or other browsers on your server. 

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

  - **Code Analysis**: Run JSHint on your tests. 

    **为什么？*：Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

  - **Alleviate JSHint Rules on Tests**: Relax the rules on your test code.

    **为什么？*：Your tests won't be run by your end users and do not require as strenuous of code quality rules. Global variables, for example, can be relaxed by including this in your test specs.

    ```javascript
    /*global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)


**[Back to top](#table-of-contents)**

## Animations

  - **Usage**: Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *为什么？*：Subtle animations can improve User Experience when used appropriately.

    *为什么？*：Subtle animations can improve perceived performance as views transition.

  - **Sub Second**: Use short durations for animations. I generally start with 300ms and adjust until appropriate.  

    *为什么？*：Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

  - **animate.css**: Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *为什么？*：The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *为什么？*：Provides consistency in your animations.

    *为什么？*：animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Back to top](#table-of-contents)**


## Comments

  - **jsDoc**: If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns

    *为什么？*：You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *为什么？*：Provides consistency using a common industry tool.

    ```javascript
    angular
      .module('app')
      .factory('logger', logger);

    /**
     * @name logger
     * @desc Application wide logger
     */
    function logger ($log) {
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
       */
      function logError(msg) {
        var loggedMsg = 'Error: ' + msg;
        $log.error(loggedMsg);
        return loggedMsg;
      };
    }
    ```

**[Back to top](#table-of-contents)**

## JS Hint

  - **Use an Options File**: Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

    *为什么？*：Provides a first alert prior to committing any code to source control.

    *为什么？*：Provides consistency across your team.

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

## Constants

  - **Vendor Globals**: Create an AngularJS Constant for vendor libraries' global variables.

    *为什么？*：Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

    ```javascript
    // constants.js

    /* global toastr:false, moment:false */
    (function () {
        'use strict';

        angular
            .module('app.core')
            .constant('toastr', toastr)
            .constant('moment', moment);
    })();
    ```

**[Back to top](#table-of-contents)**

## AngularJS docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repo. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. 为什么？ Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repo you are agreeing to make your content available subject to the license of this repo.*


  - **Process**
    1. Discuss the changes in an Issue. 
    1. Open a Pull Request, reference the issue, and explain the change and why it adds value.
    1. The Pull Request will be evaluated and either merged or declined.

## License

  - **tldr;** Use this guide. Attributions are appreciated, but not required. 

#### (The MIT License)

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

**[Back to top](#table-of-contents)**
