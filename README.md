# AngularJS Style Guide

*Opinionated AngularJS style guide for teams by [@john_papa](//twitter.com/john_papa)*

Looking for an opinionated style guide for syntax, conventions, and structuring AngularJS applications. Then step right in. The styles contained here are based on on my experience with [AngularJS](//angularjs.org), presentations, Pluralsight training courses and working in teams. 

The purpose of this style guide is to provide guidance on building AngularJS applications by showing the conventions I use and , more importantly, why I choose them. 

## Community Awesomeness
Never work in a vacuum. I find that the AngularJS community is an incredible group who are passionate about sharing experiences. As such, a friend  and  AngularJS expert Todd Motto and I have collaborated on many styles and conventions. We agree on most, and some we diverge. I encourage you to check out [Todd's  guidelines](https://github.com/toddmotto/angularjs-styleguide) to get a sense for his approach and how it compares.


## Table of Contents

  1. [Separations of Concerns](#separation-of-concerns)
  1. [Modules](#modules)
  1. [Controllers](#controllers)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Resolving Promises for a Controller](#resolving-promises-for-a-controller)
  1. [Manual Dependency Injection](#manual-dependency-injection)
  1. [Minification and Annotation](#minification-and-annotation)
  1. [Exception Handling](#exception-handling)
  1. [Application Structure](#application-structure)
  1. [Modularity](#modularity)
  1. [Angular $ Wrapper Services](#angular-$-wrapper-services)
  1. [Comments](#comments)
  1. [Angular Docs](#angular-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Separation of Concerns

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

## Modules

  - **Definitions (aka Setters)**: Declare modules without a variable using the setter syntax. 

	*Why?*: With 1 component per file, there is rarely a need to introduce a variable for the module.
	
    ```javascript
    /* avoid */
    var app = angular.module('app', [
        'ngAnimate',
        'ngRoute',
        'app.shared'
        'app.dashboard'
    ]);
    ```

	Instead use the simple getter syntax.

    ```javascript
    /* recommended */
    angular
    	.module('app', [
        'ngAnimate',
        'ngRoute',
        'app.shared'
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

  - **IIFE**: Wrap AngularJS components in an Immediately Invoked Function Expression (IIFE). 
  
	*Why?*: An IIFE removes variables from the global scope. This helps prevent variables and function declarations from living longer than expected in the global scope, which also helps avoid variable collisions.
  
    ```javascript
    (function () {
      angular
        .module('app')
        .factory('logger', logger);

      function logger () { }
    })();
    ```

  - Note: For brevity only, the rest of the examples in this guide may omit the IIFE syntax. 

**[Back to top](#table-of-contents)**

## Controllers

  - **controllerAs View Syntax**: Use the `controllerAs` syntax over the `classic controller with $scope` syntax. 

	*Why?*: Controllers are constructed, newed up, and provide a single new instance, and the `controllerAs` syntax is closer to that of a JavaScript constructor than the `classic $scope syntax`. 

	*Why?*: It promotes the use of binding to a "dotted" object in the View (e.g. `customer.name` instead of `name`), which is more contextual, easier to read, and avoids any reference issues that may occur without "dotting".

	*Why?*: Helps avoid using `$parent` calls in Views with nested controllers.

	*Why?*: It promotes the use of binding to a "dotted" object in the View (e.g. `customer.name` instead of `name`), which is more contextual, easier to read, and avoids any reference issues that may occur without "dotting".

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

  *Why?*: Helps avoid the tempation of using `$scope` methods inside a controller when it may otherwise be better to avoid them or move them to a factory. Consider using `$scope` in a factory, or if in a controller just when needed. For example when publishing and subscribing events using `$emit`, `$broadcast`, or `$on` consider moving these uses to a factory and invoke form the controller. 

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

  - **controllerAs with vm**: Use a capture variable for `this` when using the `controllerAs` syntax. Choose a conssitent variable name such as `vm`, which stands for ViewModel.
  
    *Why?*: The `this` keyword is contextual and when used within a function inside a controller may change its context. Capturing the context of `this` avoids encountering this problem.

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

  - Note: You can avoid any jshint warnings by placing the comment below above the line of code. 
    
  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```
 
  - **Bindable Members Up Top**: Place bindable members at the top of the controller, alphabetized, and not spread through the controller code.
  
    *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of the controller can be bound and used in the View. 

    *Why?*: Setting anonymous functions inline can be easy, but when those functions are more than 1 line of code they can reduce the readability. Defining the functions below the bindable members (the functions will be hoisted) moves the implementation details down, keeps the bindable members up top, and makes it easier to read.

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

  - **Defer Controller Logic**: Defer logic in a controller by delegating to services and factories.

    *Why?*: Logic may be reused by multiple controllers when placed within a service and exposed via a function.

    *Why?*: Logic in a service can more easily be isolated in a unit test, while the calling logic in the controller can be easily mocked.

    *Why?*: Removes dependencies and hides implementations details from the controller.

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

  - **Assigning Controllers**: When a controller must be paired with a view and either component may be re-used by other controllers or views, define controllers along with their routes. 
    
    - Note: If a View is loaded via another means besides a route, then use the `ng-controller="Avengers as vm"` syntax. 

    *Why?*: Pairing the controller in the route allows different routes to invoke different pairs of controllers and views. When controllers are assigned in the view using `ng-controller`, that view is always associated with the same controller.

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
    <div>
    </div>
    ```

**[Back to top](#table-of-contents)**

## Services

  - **Singletons**: Services are instantiated with the `new` keyword, use `this` for public methods and variables. Can also use a factory, which I recommend for consistency. 
  
  - Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services). This means that there is only one instance of a given service per injector.

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

**[Back to top](#table-of-contents)**

## Factories

  - **Single Responsibility**: Factories should have a [single responsibility](http://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a factory begins to exceed that singular purpose, a new factory should be created.

  - **Singletons**: Factories are singletons and return an object that contains the members of the service.
  
  - Note: [All AngularJS services are singletons](https://docs.angularjs.org/guide/services).

  - **Public Members Up Top**: Expose the callable members of the service (it's interface) at the top, using a technique derived from the [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *Why?*: Placing the callable members at the top makes it easy to read and helps you instantly identify which members of the service can be called and must be unit tested (and/or mocked). 

    *Why?*: This is especially helpful when the file gets longer as it helps avoid the need to scroll to see what is exposed.

    *Why?*: Setting functions as you go can be easy, but when those functions are more than 1 line of code they can reduce the readability and cause more scrolling. Defining the callable interface via the returned service moves moves the implementation details down, keeps the callable interface up top, and makes it easier to read.


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

  - This way bindings are mirrored across the host Object, primitive values cannot update alone using the revealing module pattern

**[Back to top](#table-of-contents)**

## Resolving Promises for a Controller

  - **Controller Activation Promises**: Resolve start-up logic for a controller in an `activate` function.
     
    *Why?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.
    
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

  - **Route Resolve Promises**: When a controller depends on a promise to be resolved, resolve those dependencies in the `$routeProvider` before the controller logic is executed.

    *Why?*: A controller may require data before it loads. That data may come from a promise via a custom factory or $http. Using a route resolve allows the promise to resolve before the controller logic executes, so it might take action based on that data from the promise.

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

**[Back to top](#table-of-contents)**

  - **Resolve for All Routes**: 
  TODO

**[Back to top](#table-of-contents)**

## Manual Dependency Injection

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


  - **Manually Identify Dependencies**: Use $inject to manually identify your dependencies for AngularJS components.
  
      *Why?*: This technique mirrors the technique used by `ng-annotate`, which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

      *Why?*: This safeguards your dependencies from being vulernable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

      *Why?*: Avoid creating inline dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function. 

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

**[Back to top](#table-of-contents)**

## Minification and Annotation

  - **ng-annotate**: Use [ng-annotate](//github.com/olov/ng-annotate) for Gulp or Grunt and comment functions that need automated dependency injection using `/** @ngInject */`
  
      *Why?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

      *Why?*: `ng-min` is deprecated 

  - The following code is not using minification safe dependencies.

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

  - When the above code is run through ng-annotate it will produces the following output with the `$inject` annotation and become minification-safe.

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

  - Note: If `ng-annotate` detects injection has already been made (e.g. @ngInject was detected), it will not duplicate the `$inject` code.

  - **Use Gulp or Grunt for ng-annotate**: Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
      *Why?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

    - The following code is an example of a gulp task using ngAnnotate

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

**[Back to top](#table-of-contents)**

## Exception Handling
TODO

**[Back to top](#table-of-contents)**

## Application Structure
TODO

**[Back to top](#table-of-contents)**

## Modularity
TODO

**[Back to top](#table-of-contents)**

## Angular $ Wrapper Services

  - **$document and $window**: Use `$document` and `$window` instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This help syou avoid having to mock document and window yourself.

  - **$timeout and $interval**: Use `$timeout` and `$interval` instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in synch.

**[Back to top](#table-of-contents)**

## Comments

  - **jsDoc**: If planning to produce documentation, use jsDoc syntax to document function names, description, params and returns

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

## AngularJS docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions.

## License

#### (The MIT License)

Copyright (c) 2014 John Papa

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
