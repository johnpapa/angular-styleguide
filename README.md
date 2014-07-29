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

  - **controllerAs with vm**: Use a capture variable for `this` when using the `controllerAs` syntax. 
  
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
 
  - **Bindable Members Up Top**: Place bindable members at the top of the controller and not spread through the controller code.
  
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

    ```javascript
    /* avoid */
    function Customer ($scope) {
      var vm = this;
      vm.name = {};
      vm.sendMessage = sendMessage;

      function sendMessage () { 
        var msg = 'some message';
        $scope.$broadcast( /* */);
      };
    }
    ```

    ```javascript
    /* recommended */
    function Customer (messager) {
      var vm = this;
      vm.name = {};
      vm.sendMessage = sendMessage;

      function sendMessage () { 
        var msg = 'some message';
        messager.send(msg);
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