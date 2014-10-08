# AngularJS Style Guide

*Opinionated AngularJS style guide for teams by [@john_papa](//twitter.com/john_papa)*

If you are looking for an opinionated style guide for syntax, conventions, and structuring AngularJS applications, then step right in. These styles are based on my development experience with [AngularJS](//angularjs.org), presentations, [Pluralsight training courses](http://pluralsight.com/training/Authors/Details/john-papa) and working in teams. 

The purpose of this style guide is to provide guidance on building AngularJS applications by showing the conventions I use and, more importantly, why I choose them. 

## Community Awesomeness and Credit
Never work in a vacuum. I find that the AngularJS community is an incredible group who are passionate about sharing experiences. As such, a friend  and  AngularJS expert Todd Motto and I have collaborated on many styles and conventions. We agree on most, and some we diverge. I encourage you to check out [Todd's  guidelines](https://github.com/toddmotto/angularjs-styleguide) to get a sense for his approach and how it compares.

Many of my styles have been from the many pair programming sessions [Ward Bell](http://twitter.com/wardbell) and I have had. While we don't always agree, my friend Ward has certainly helped influence the ultimate evolution of this guide.

## See the Styles in a Sample App
While this guide explains the *what*, *why* and *how*, I find it helpful to see them in practice. This guide is accompanied by a sample application that follows these styles and patterns. You can find the [sample application (named modular) here](https://github.com/johnpapa/ng-demos) in the `modular` folder. Feel free to grab it, clone it, or fork it. [Instructions on running it are in its readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

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
  1. [Manual Dependency Injection](#manual-dependency-injection)
  1. [Minification and Annotation](#minification-and-annotation)
  1. [Exception Handling](#exception-handling)
  1. [Naming](#naming)
  1. [Application Structure LIFT Principle](#application-structure-lift-principle)
  1. [Application Structure](#application-structure)
  1. [Modularity](#modularity)
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

  - **Rule of 1**: Define 1 component per file.  

 	The following example defines the `app` module and its dependencies, defines a controller, and defines a factory all in the same file.  

    ```javascript
    /* avoid */
    angular
      	.module('app', ['ngRoute'])
      	.controller('SomeController' , SomeController)
      	.factory('someFactory' , someFactory);
    	
    function SomeController() { }

    function someFactory() { }
    ```
    
	The same components are now separated into their own files.

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

**[Back to top](#table-of-contents)**

## IIFE
  - **IIFE**: Wrap AngularJS components in an Immediately Invoked Function Expression (IIFE). 
  
  *Why?*: An IIFE removes variables from the global scope. This helps prevent variables and function declarations from living longer than expected in the global scope, which also helps avoid variable collisions.

  *Why?*: When your code is minified and bundled into a single file for deployment to a production server, you could have collisions of variables and many global variables. An IIFE protects you against both of these by providing variable scope for each file.

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

  - Note: For brevity only, the rest of the examples in this guide may omit the IIFE syntax. 
  
  - Note: IIFE's prevent test code from reaching private members like regular expressions or helper functions which are often good to unit test directly on their own. However you can test these through accessible members or by exposing them through their own component. For example placing helper functions, regular expressions or constants in their own factory or constant.

**[Back to top](#table-of-contents)**

## Modules

  - **Avoid Naming Collisions**: Use unique naming conventions with separators for sub-modules. 

  *Why?*: Unique names help avoid module name collisions. Separators help define modules and their submodule hierarchy. For example `app` may be your root module while `app.dashboard` and `app.users` may be modules that are used as dependencies of `app`. 

  - **Definitions (aka Setters)**: Declare modules without a variable using the setter syntax. 

	*Why?*: With 1 component per file, there is rarely a need to introduce a variable for the module.
	
    ```javascript
    /* avoid */
    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'app.shared',
        'app.dashboard'
    ]);
    ```

	Instead use the simple setter syntax.

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

  - **Getters**: When using a module, avoid using a variables and instead use   chaining with the getter syntax.

	*Why?* : This produces more readable code and avoids variables collisions or leaks.

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

  - **Setting vs Getting**: Only set once and get for all other instances.
	
	*Why?*: A module should only be created once, then retrieved from that point and after.
  	  
  	  - Use `angular.module('app', []);` to set a module.
  	  - Use  `angular.module('app');` to get a module. 

  - **Named vs Anonymous Functions**: Use named functions instead of passing an anonymous function in as a callback. 

	*Why?*: This produces more readable code, is much easier to debug, and reduces the amount of nested callback code.

    ```javascript
    /* avoid */
    angular
        .module('app')
        .controller('Dashboard', function() { });
        .factory('logger', function() { });
    ```

    ```javascript
    /* recommended */

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

**[Back to top](#table-of-contents)**

## Controllers

  - **controllerAs View Syntax**: Use the [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) syntax over the `classic controller with $scope` syntax. 

	*Why?*: Controllers are constructed, "newed" up, and provide a single new instance, and the `controllerAs` syntax is closer to that of a JavaScript constructor than the `classic $scope syntax`. 

	*Why?*: It promotes the use of binding to a "dotted" object in the View (e.g. `customer.name` instead of `name`), which is more contextual, easier to read, and avoids any reference issues that may occur without "dotting".

	*Why?*: Helps avoid using `$parent` calls in Views with nested controllers.

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

  - **controllerAs Controller Syntax**: Use the `controllerAs` syntax over the `classic controller with $scope` syntax. 

  - The `controllerAs` syntax uses `this` inside controllers which gets bound to `$scope`

	  *Why?*: `controllerAs` is syntactic sugar over `$scope`. You can still bind to the View and still access `$scope` methods.  

	  *Why?*: Helps avoid the temptation of using `$scope` methods inside a controller when it may otherwise be better to avoid them or move them to a factory. Consider using `$scope` in a factory, or if in a controller just when needed. For example when publishing and subscribing events using [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), or [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) consider moving these uses to a factory and invoke from the controller. 

    ```javascript
    /* avoid */
    function Customer($scope) {
        $scope.name = {};
        $scope.sendMessage = function() { };
    }
    ```

    ```javascript
    /* recommended - but see next section */
    function Customer() {
        this.name = {};
        this.sendMessage = function() { };
    }
    ```

  - **controllerAs with vm**: Use a capture variable for `this` when using the `controllerAs` syntax. Choose a consistent variable name such as `vm`, which stands for ViewModel.
  
    *Why?*: The `this` keyword is contextual and when used within a function inside a controller may change its context. Capturing the context of `this` avoids encountering this problem.

    ```javascript
    /* avoid */
    function Customer() {
        this.name = {};
        this.sendMessage = function() { };
    }
    ```

    ```javascript
    /* recommended */
    function Customer() {
        var vm = this;
        vm.name = {};
        vm.sendMessage = function() { };
    }
    ```

    - Note: You can avoid any [jshint](http://www.jshint.com/) warnings by placing the comment below above the line of code. 
    
    ```javascript
    /* jshint validthis: true */
    var vm = this;
    ```
   
    - Note: When creating watches in a controller using `controller as`, you can watch the `vm.*` member using the following syntax. (Create watches with caution as they add more load to the digest cycle.)

    ```javascript
    $scope.$watch('vm.title', function(current, original) {
        $log.info('vm.title was %s', original);
        $log.info('vm.title is now %s', current);
    });
    ```

  - **Bindable Members Up Top**: Place bindable members at the top of the controller, alphabetized, and not spread through the controller code.
  
    *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of the controller can be bound and used in the View. 

    *Why?*: Setting anonymous functions in-line can be easy, but when those functions are more than 1 line of code they can reduce the readability. Defining the functions below the bindable members (the functions will be hoisted) moves the implementation details down, keeps the bindable members up top, and makes it easier to read. 

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

      - Note: If the function is a 1 liner consider keeping it right up top, as long as readability is not affected.

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

  - **Function Declarations to Hide Implementation Details**: Use function declarations to hide implementation details. Keep your bindable members up top. When you need to bind a function in a controller, point it to a function declaration that appears later in the file. This is tied directly to the section Bindable Members Up Top. For more details see [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).
    
    *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of the controller can be bound and used in the View. (Same as above.)

    *Why?*: Placing the implementation details of a function later in the file moves that complexity out of view so you can see the important stuff up top.

    *Why?*: Function declaration are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).

    *Why?*: You never have to worry with function declarations that moving `var a` before `var b` will break your code because `a` depends on `b`.     

    *Why?*: Order is critical with function expressions 

    ```javascript
    /** 
     * avoid 
     * Using function expressions.
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

  - Notice that the important stuff is scattered in the preceding example.
  - In the example below, notice that the important stuff is up top. For example, the members bound to the controller such as `vm.avengers` and `vm.title`. The implementation details are down below. This is just easier to read.

    ```javascript
    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
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

  - **Defer Controller Logic**: Defer logic in a controller by delegating to services and factories.

    *Why?*: Logic may be reused by multiple controllers when placed within a service and exposed via a function.

    *Why?*: Logic in a service can more easily be isolated in a unit test, while the calling logic in the controller can be easily mocked.

    *Why?*: Removes dependencies and hides implementations details from the controller.

    ```javascript
    /* avoid */
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
    /* recommended */
    function Order(creditService) {
        var vm = this;
        vm.checkCredit = checkCredit;
        vm.total = 0;

        function checkCredit() { 
           return creditService.check();
        };
    }
    ```

  - **Keep Controllers Focused**: Define a controller for a view, and try not to reuse the controller for other views. Instead, move reusable logic to factories and keep the controller simple and focused on its view. 
  
    *Why?*: Reusing controllers with several views is brittle and good end to end (e2e) test coverage is required to ensure stability across large applications.

  - **Assigning Controllers**: When a controller must be paired with a view and either component may be re-used by other controllers or views, define controllers along with their routes. 
    
    - Note: If a View is loaded via another means besides a route, then use the `ng-controller="Avengers as vm"` syntax. 

    *Why?*: Pairing the controller in the route allows different routes to invoke different pairs of controllers and views. When controllers are assigned in the view using [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), that view is always associated with the same controller.

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
    <div ng-controller="Avengers as vm">
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

  - **Singletons**: Services are instantiated with the `new` keyword, use `this` for public methods and variables. Since these are so similar to factories, use a factory instead for consistency. 
  
    - Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services). This means that there is only one instance of a given service per injector.

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

  - **Single Responsibility**: Factories should have a [single responsibility](http://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a factory begins to exceed that singular purpose, a new factory should be created.

  - **Singletons**: Factories are singletons and return an object that contains the members of the service.
  
    - Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services).

  - **Accessible Members Up Top**: Expose the callable members of the service (it's interface) at the top, using a technique derived from the [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Why?*: Placing the callable members at the top makes it easy to read and helps you instantly identify which members of the service can be called and must be unit tested (and/or mocked). 

    *Why?*: This is especially helpful when the file gets longer as it helps avoid the need to scroll to see what is exposed.

    *Why?*: Setting functions as you go can be easy, but when those functions are more than 1 line of code they can reduce the readability and cause more scrolling. Defining the callable interface via the returned service moves the implementation details down, keeps the callable interface up top, and makes it easier to read.

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

  - This way bindings are mirrored across the host object, primitive values cannot update alone using the revealing module pattern

      ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

  - **Function Declarations to Hide Implementation Details**: Use function declarations to hide implementation details. Keep your acessible members of the factory up top. Point those to function declarations that appears later in the file. For more details see [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *Why?*: Placing accessible members at the top makes it easy to read and helps you instantly identify which functions of the factory you can access externally.

    *Why?*: Placing the implementation details of a function later in the file moves that complexity out of view so you can see the important stuff up top.

    *Why?*: Function declaration are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).

    *Why?*: You never have to worry with function declarations that moving `var a` before `var b` will break your code because `a` depends on `b`.     

    *Why?*: Order is critical with function expressions 

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

  - **Separate Data Calls**: Refactor logic for making data operations and interacting with data to a factory. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    *Why?*: The controller's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the controller be simpler and more focused on the view.

    *Why?*: This makes it easier to test (mock or real) the data calls when testing a controller that uses a data service.

    *Why?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as $http. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a controller), also making it easier to change the implementation.

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
    - Note: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.

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
                .then(function(data) {
                    vm.avengers = data;
                    return vm.avengers;
                });
        }
    }      
    ```

- **Return a Promise from Data Calls**: When calling a data service that returns a promise such as $http, return a promise in your calling function too.

    *Why?*: You can chain the promises together and take further action after the data call completes and resolves or rejects the promise.

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
- **Limit 1 Per File**: Create one directive per file. Name the file for the directive. 

    *Why?*: It is easy to mash all the directives in one file, but difficult to then break those out so some are shared across apps, some across modules, some just for one module. 

    *Why?*: One directive per file is easy to maintain.

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
    /* recommended */
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

    - Note: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and it's file name distinct and clear. Some examples are below, but see the naming section for more recommendations.

- **Limit DOM Manipulation**: When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow. 

    *Why?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

- **Provide a Unique Directive Prefix**: Provide a short, unique and descriptive directive prefix such as `acmeSalesCustomerInfo` which is declared in HTML as `acme-sales-customer-info`.

    *Why?*: The unique short prefix identifies the directive's context and origin. For example a prefix of `cc-` may indicate that the directive is part of a CodeCamper app while `acme-` may indicate a directive for the Acme company. 

    - Note: Avoid `ng-` as these are reserved for AngularJS directives.Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/). 

- **Restrict to Elements and Attributes**: When creating a directive that makes sense as a standalone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when its standalone and as an attribute when it enhances its existing DOM element.

    *Why?*: It makes sense.

    *Why?*: While we can allow the directive to be used as a class, if the directive is truly acting as an element it makes more sense as an element or at least as an attribute.

    - Note: EA is the default for AngularJS 1.3 +

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

- **Directives and ControllerAs**: Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    *Why?*: It makes sense and it's not difficult.

    - Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place. 

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
            controllerAs: 'exVm'
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
            console.log('LINK: scope.exVm.min = %i', scope.exVm.min);
            console.log('LINK: scope.exVm.max = %i', scope.exVm.max);
        }
    }
    ```

    ```html
    /* example.directive.html */
    <div>hello world</div>
    <div>max={{exVm.max}}<input ng-model="exVm.max"/></div>
    <div>min={{exVm.min}}<input ng-model="exVm.min"/></div>
    ```

**[Back to top](#table-of-contents)**

## Resolving Promises for a Controller

  - **Controller Activation Promises**: Resolve start-up logic for a controller in an `activate` function.
     
    *Why?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    - Note: If you need to conditionally cancel the route before you start use the controller, use a route resolve instead.
    
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

  - **Route Resolve Promises**: When a controller depends on a promise to be resolved, resolve those dependencies in the `$routeProvider` before the controller logic is executed. If you need to conditionally cancel a route before the controller is activated, use a route resolver.

    *Why?*: A controller may require data before it loads. That data may come from a promise via a custom factory or [$http](https://docs.angularjs.org/api/ng/service/$http). Using a [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) allows the promise to resolve before the controller logic executes, so it might take action based on that data from the promise.

    ```javascript
    /* avoid */
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

    - Note: The code example's dependency on `movieService` is not minification safe on its own. For details on how to make this code minification safe, see the sections on [dependency injection](#manual-dependency-injection) and on [minification and annotation](#minification-and-annotation).

**[Back to top](#table-of-contents)**

## Manual Annotating for Dependency Injection

  - **UnSafe from Minification**: Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.
  
      *Why?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    - This code may produce mangled variables when minified and thus cause runtime errors.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

  - **Manually Identify Dependencies**: Use `$inject` to manually identify your dependencies for AngularJS components.
  
      *Why?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

      *Why?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

      *Why?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function. 

    ```javascript
    /* avoid */
    angular
        .module('app')
        .controller('Dashboard', 
            ['$location', '$routeParams', 'common', 'dataservice', 
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);      
    ```

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

    - Note: When your function is below a return statement the $inject may be unreachable (this may happen in a directive). You can solve this by either moving the $inject above the return statement or by using the alternate array injection syntax. 

    - Note: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduced a feature where it moves the `$inject` to where it is reachable.

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

  - **Manually Identify Route Resolver Dependencies**: Use $inject to manually identify your route resolver dependencies for AngularJS components.
  
      *Why?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

      *Why?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

    ```javascript
    /* recommended */
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

**[Back to top](#table-of-contents)**

## Minification and Annotation

  - **ng-annotate**: Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/** @ngInject */`
  
      *Why?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

      *Why?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated 

      >I prefer Gulp as I feel it is easier to write, to read, and to debug.

    - The following code is not using minification safe dependencies.

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

    - When the above code is run through ng-annotate it will produce the following output with the `$inject` annotation and become minification-safe.

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

    - Note: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

    - When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

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

    - Note: Starting from AngularJS 1.3 use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code.
    `<body ng-app="APP" ng-strict-di>`

  - **Use Gulp or Grunt for ng-annotate**: Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
      *Why?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

    - The following code is an example of a gulp task using ngAnnotate

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

  - **decorators**: Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.
  
      *Why?*: Provides a consistent way to handle uncaught AngularJS exceptions for development-time or run-time.

      - Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

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

  - **Exception Catchers**: Create a factory that exposes an interface to catch and gracefully handle exceptions.

      *Why?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

      - Note: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

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

  - **Route Errors**: Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

      *Why?*: Provides a consistent way handle all routing errors.

      *Why?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or  recovery options.

    ```javascript
    /* recommended */
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

**[Back to top](#table-of-contents)**

## Naming

  - **Naming Guidelines**: Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    *   the file name (`avengers.controller.js`)
    *   the registered component name with Angular (`AvengersController`)
 
    *Why?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Why?*: The naming conventions should simply help you find your code faster and make it easier to understand. 

  - **Feature File Names**: Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`.

      *Why?*: Provides a consistent way to quickly identify components.

      *Why?*: Provides pattern matching for any automated tasks.

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

  - Alternative: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team.

    ```javascript
    /**
     * recommended
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

  - **Test File Names**: Name test specifications similar to the component they test with a suffix of `spec`.  

      *Why?*: Provides a consistent way to quickly identify components.

      *Why?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```javascript
    /**
     * recommended
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

  - **Controller Names**: Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

      *Why?*: Provides a consistent way to quickly identify and reference controllers.

      *Why?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

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
    
  - **Controller Name Suffix**: Append the controller name with the suffix `Controller` or with no suffix. Choose 1, not both.

      *Why?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

      *Why?*: Omitting the suffix is more succinct and the controller is often easily identifiable even without the suffix.

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


  - **Factory Names**: Use consistent names for all factories named after their feature. Use camel-casing for services and factories.

      *Why?*: Provides a consistent way to quickly identify and reference factories.

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

  - **Directive Component Names**: Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

      *Why?*: Provides a consistent way to quickly identify and reference components.

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

  - **Modules**:  When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`. A single module app might be named `app.js`, omitting the module moniker.

    *Why?*: An app with 1 module is named `app.js`. It is the app, so why not be super simple.
 
    *Why?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *Why?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

  - **Configuration**: Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *Why?*: Separates configuration from module definition, components, and active code.

    *Why?*: Provides a identifiable place to set configuration for a module.

  - **Routes**: Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration. An alternative is a longer name such as `admin.config.route.js`.

**[Back to top](#table-of-contents)**

## Application Structure LIFT Principle
  - **LIFT**: Structure your app such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should follow these 4 basic guidelines. 

      *Why LIFT?*: Provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When I find my structure is not feeling comfortable, I go back and revisit these LIFT guidelines
  
    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

  - **Locate**: Make locating your code intuitive, simple and fast.

      *Why?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly,  they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

  - **Identify**: When you look at a file you should instantly know what it contains and represents.

      *Why?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

  - **Flat**: Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

      *Why?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

  - **T-DRY (Try to Stick to DRY)**: Be DRY, but don't go nuts and sacrifice readability.

      *Why?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it. 

**[Back to top](#table-of-contents)**

## Application Structure

  - **Overall Guidelines**:  Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    - Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

  - **Layout**: Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions. 

    *Why?*: Organizes all layout in a single place re-used throughout the application.

  - **Folders-by-Feature Structure**: Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed. 

    *Why?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names. 

    *Why?*: The LIFT guidelines are all covered.

    *Why?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *Why?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

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

      - Note: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

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

**[Back to top](#table-of-contents)**

## Modularity
  
  - **Many Small, Self Contained Modules**: Create small modules that enapsulate one responsibility.

    *Why?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally.  This means we can plug in new features as we develop them.

  - **Create an App Module**: Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *Why?*: AngularJS encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

  - **Keep the App Module Thin**: Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Why?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

  - **Feature Areas are Modules**: Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Why?*: Self contained modules can be added to the application will little or no friction.

    *Why?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Why?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code. 

  - **Reusable Blocks are Modules**: Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Why?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

  - **Module Dependencies**: The application root module depends on the app specific feature modules, the feature modules have no direct dependencies, the cross-application modules depend on all generic modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Why?*: The main app module contains a quickly identifiable manifest of the application's features. 

    *Why?*: Cross application features become easier to share. The features generally all rely on the same cross application modules, which are consolidated in a single module (`app.core` in the image).

    *Why?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    - Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    >> My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind. 

**[Back to top](#table-of-contents)**

## Angular $ Wrapper Services

  - **$document and $window**: Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

  - **$timeout and $interval**: Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Back to top](#table-of-contents)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

  - **Write Tests with Stories**: Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Why?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

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

  - **Testing Library**: Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://visionmedia.github.io/mocha/) for unit testing.

    *Why?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

  - **Test Runner**: Use [Karma](http://karma-runner.github.io) as a test runner.

    *Why?*: Karma is easy to configure to run once or automatically when you change your code.

    *Why?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Why?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Why?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

  - **Stubbing and Spying**: Use Sinon for stubbing and spying.

    *Why?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Why?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

  - **Headless Browser**: Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Why?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server. 

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

  - **Code Analysis**: Run JSHint on your tests. 

    *Why?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

  - **Alleviate Globals for JSHint Rules on Tests**: Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *Why?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /*global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Back to top](#table-of-contents)**

## Animations

  - **Usage**: Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Why?*: Subtle animations can improve User Experience when used appropriately.

    *Why?*: Subtle animations can improve perceived performance as views transition.

  - **Sub Second**: Use short durations for animations. I generally start with 300ms and adjust until appropriate.  

    *Why?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

  - **animate.css**: Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Why?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Why?*: Provides consistency in your animations.

    *Why?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Back to top](#table-of-contents)**

## Comments

  - **jsDoc**: If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns

    *Why?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Why?*: Provides consistency using a common industry tool.

    ```javascript
    angular
        .module('app')
        .factory('logger', logger);

    /**
     * @name logger
     * @desc Application wide logger
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

    *Why?*: Provides a first alert prior to committing any code to source control.

    *Why?*: Provides consistency across your team.

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

    *Why?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

**[Back to top](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

  - **Sublime Text**: AngularJS snippets that follow these styles and guidelines. 

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

  - **Visual Studio**: AngularJS file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

  - **WebStorm**: AngularJS snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

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

**[Back to top](#table-of-contents)**

## AngularJS docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

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
