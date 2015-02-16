# Guía de estilo AngularJS

*Guía de estilos colaborativa de AngularJS para equipos por [@john_papa](//twitter.com/john_papa)*

Si estás buscando una guía colaborativa sobre sintaxis, convenciones y estructura de aplicaciones con AngulRJS, este es el sitio. Estos estilos están basados en mi experiencia desarrollando con [AngularJS](//angularjs.org), persentaciones, [Cursos en Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) y trabajando en equipo. 

El propósito de esta guía de estilos es proporcionar una guía de cómo construir aplicaciones con AngularJS enseñando convenciones que uso y, lo más importante, el porqué. 

>Si te gusta esta guía, écha un vistazo al curso de Pluralsight [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean).

  [![AngularJs Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)
  
## Asombrosa comunidad y créditos
Nunca trabajes solo. Personalmente, la comunidad de AngularJS es un increíble grupo que apasionado por compartir experiencias. Como por ejemplo, mi amigo y experto AngularJS Todd Motto, con el que he colaborado en muchas de los estilos y convenciones. Estamos de acuerdo en la mayoría, y en otras no. Te recomiendo que le eches un vistazo a [Todd's guidelines](https://github.com/toddmotto/angularjs-styleguide) para que le des sentido a ésta guía y la compares.

Muchos de los estilos han salido de las muchas sesiones de pair programming que [Ward Bell](http://twitter.com/wardbell) y yo hemos tenido. Aunque no siempre coincidimos, mi amigo Ward me ha ayudado con la última evolución de ésta guía.

## Mira los estilos en la aplicación de ejemplo
Mientras que esta guía explica el *qué*, *por qué* y *cómo*, me resulta útil verlos en práctica. Ésta guía viene acompañada de una aplicación de ejemplo que sigue los estilos y patrones. La puedes encontrar en [aplicación de ejemplo (llamada modular) aquí](https://github.com/johnpapa/ng-demos) dentro del directorio `modular`. Siéntete libre de cogerla, hacerle clone o un fork. [Instrucciones de cómo arrancarla en su readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

## Traducciones
[Traducciones de ésta guía de estilos Angular](https://github.com/johnpapa/angularjs-styleguide/tree/master/i18n) son mantenidas por la comunidad y las puedes encontrar aquí.

## Tabla de contenidos

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
  1. [Yeoman Generator](#yeoman-generator)
  1. [Routing](#routing)
  1. [Task Automation](#task-automation)
  1. [AngularJS Docs](#angularjs-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Single Responsibility o Responsabilidad Única

### La regla del 1
###### [Style [Y001](#style-y001)]

  - Define 1 componente por archivo.

  El siguiente ejemplo define el módulo `app` y sus dependencias, define un controller, y defines una factory todo en el mismo archivo.

  ```javascript
  /* evitar */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);
    
  function SomeController() { }

  function someFactory() { }
  ```

  Los mismos componentes están separados en su propio archivo.

  ```javascript
  /* recomendado */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* recomendado */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomendado */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);
    
  function someFactory() { }
  ```

**[Volver arriba](#table-of-contents)**

## IIFE
### JavaScript Closures
###### [Style [Y010](#style-y010)]

  - Envuelve los componentes AngularJS en una expersiónb de función que se invoca inmediatamente Immediately Invoked Function Expression (IIFE). 

  *¿Por qué?*: Una IIFE elimina las variables del scope global. Esto ayuda a prevenir que las variables y las declaraciones de funciones vivan más de lo esperado en el scope global, evitando así colisión de variables.

  *¿Por qué?*: Cuando tu código se minimiza y se empaqueta en un archivo único para desplegar al servidor de producción, podrías tener colisión de variables y muchas variables globales. Una IIFE te protege contra ambos, creando una scope por cada archivo.

  ```javascript
  /* evitar */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // La función logger es añadida como variable global
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // la función storage es añadida como variable global
  function storage() { }
  ```

  ```javascript
  /**
   * recomendado 
   *
   * así no dejamos ninguna variable global
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

  - Nota: Para acortar únicamente, el resto de ejemplo de esta guía podrían omitir la sintaxis IIFE. 

  - Nota: IIFE previente que el código de los tests llegue a sus variables privadas, como expresiones regulares o funciones de ayuda que normalmente vienen bien para hacer pruebas por sí solas. Sin embargo, puedes acceder a ellas creando accesorios o accediendo a través de sus componentes. Por ejemplo, poniendo las funciones de ayuda, expresiones regulares o constantes en su propia factory.

**[Volver arriba](#table-of-contents)**

## Modules

### Evitando la colisión de nombres
###### [Style [Y020](#style-y020)]

  - Use una convención de nombres única con separadores para los sub-módulos. 

  *¿Por qué?*: Nombres únicos ayudan a evitar colisiones en los nombres de módulos. Los separadores ayudan a definir los módulos y la jerarquía de sus sub-módulos. Por ejemplo `app` puede ser tu módulo raiz y `app.dashboard` y `app.users` pueden ser módulos que dependen de `app`. 

### Definitions (aka Setters)
###### [Style [Y021](#style-y021)]

  - Declara los módulos sin usar la variable, usando la sintaxis de los setters. 

  *¿Por qué?*: Con un componente por archivo, es raro que necesitemos introducir una variable para el módulo.
  
  ```javascript
  /* evitar */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  En su lugar usa la sintaxis de los setters

  ```javascript
  /* recomendado */
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

  - Cuando usemos un módulo, evita usar la variable y usando su getter en su lugar.

  *¿Por quñe?*: Esto hace más legible el código y evita que las variables colisionen.

  ```javascript
  /* evitar */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomendado */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs Getting
###### [Style [Y023](#style-y023)]

  - Setea sólo una vez y usa get para el resto de instancias.

  *¿Por qué?*: Un módulo debe ser creado sólo una vez y recuperado desde ese punto.

    - Usa `angular.module('app', []);` para setear un módulo.
    - Usa `angular.module('app');` para recuperar un módulo. 

### Funciones anónimas vs funciones con nombre
###### [Style [Y024](#style-y024)]

  - Usa funciones con nombre en lugar de pasar una función anónima en el callback. 

  *¿Por qué?*: Así el código es más legible, es más fácil de debugear, y reduce la cantidad de código anidado en los callbacks.

  ```javascript
  /* evitar */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* recomendado */

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

**[Volver arriba](#table-of-contents)**

## Controllers

### controllerAs View Syntax
###### [Style [Y030](#style-y030)]

  - Usa la sintaxis [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) en lugar del `clásico controller con $scope`. 

  *¿Por qué?*: Los Controllers se construyen, renuevan y proporcionan una nueva única instancia, y la sintaxis `controllerAs` se acerca más a eso que con la `sintaxis clásico de $scope`. 

  *¿Por qué?*: Enlazas el uso del objeto con el "punto" a la View (ej. `customer.name` en lugar de `name`), así es más contextual, fácil de leer y evitas problemas de referencia que pueden aparecer con el "punto".

  *¿Por qué?*: Ayuda a evitar usar `$parent` en las Views con controllers anidados.

  ```html
  <!-- evitar -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recomendado -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs Controller Syntax
###### [Style [Y031](#style-y031)]

  - Usa la sintaxis `controllerAs` en lugar del `cláxico controller con $scope`. 

  - La sintaxis `controllerAs` usa `this` dentro de los controllers que se asocian al `$scope`

  *¿Por qué?*: `controllerAs` es azucar sintáctico sobre el `$scope`. Puedes enlazar a la vista y acceder a los métodos del `$scope`.

  *¿Por qué?*: Ayuda a evitar la tentación de usar los métodos del `$scope` dentro de un controller cuando debería ser mejor evitar usarlos o moverlos a una factory. Considera usar `$scope` en una factory, o en un controlador sólo cuando sea necesario. Por ejemplo cuando publicas y te suscribes a eventos usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), o [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considera mover estos usos a una factory e invocarlos desde el controller. 

  ```javascript
  /* evitar */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado - pero mira la sección siguiente */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs with vm
###### [Style [Y032](#style-y032)]

  - Usa una variable para capturar `this` cuando uses la sintaxis `controllerAs`. Elige un nombre de variable consistente como `vm`, de ViewModel.
  
  *¿Por qué?*: La palabra `this` es contextual y cuando es usada dentro de una función en un controller puede cambiar su contexto. Capturando el contexto de `this` te evita encontrarte este problema.

  ```javascript
  /* evitar */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Nota: Puedes evitar los warnings de [jshint](http://www.jshint.com/) escribiendo un comentario encima de la línea de c´pdigo. Sin embargo no hace falta si el nombre de la función empieza por mayúsculas, ya que esa es la convención para las funciones de los constructores, que es lo que un controller en Angular es.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Nota: Cuando crees watches en un controller usando `controller as`, puedes observar la variable `vm.*` usando la siguiente sintaxis.(Crea los watchers con precación ya que añaden mucha carca al ciclo de digest)

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

### Bindable Members Up Top
###### [Style [Y033](#style-y033)]

  - Coloca las asociaciones en la parte superior del controller, por orden alfabético y no separados a lo largo del código del controller.

    *¿Por qué?*: Colocar las variables asignables arriba hace más fácil la lectura y te ayuda a identificar qué variables del controlador pueden ser asociadas y usadas en la View.

    *¿Por qué?*: Setear funciones anónimas puede ser fácil, pero cuando esas funciones tienen más de una línea de código se hace menos legible. Definiendo las funciones bajo a las variables, hace que los detalles de implementación estén abajo, deja las variables arriba y las funciones abajo.

  ```javascript
  /* evitar */
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
  /* recomendado */
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

  Nota: Si la función es de una línea, déjala arriba, siempre y cuando no afecte en la legibilidad.

  ```javascript
  /* evitar */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /** 
           * líneas 
           * de
           * código
           * que afectan a
           * la legibilidad
           */
      };
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ```javascript
  /* recomendado */
  function Sessions(dataservice) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Function Declarations to Hide Implementation Details
###### [Style [Y034](#style-y034)]

  - Declara funciones para ocultar detalles de implementación. Mantén las variables asignables arriba. Cuando necesites asignar una función a un controlador referencia una función que aparezca después en el archivo. Esto está directamente relacionado con la sección: Bindable Members Up Top. Para más detalles mira [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *¿Por qué?*: Colocar las variables asignables arriba hace más fácil la lectura y te ayuda a identificar qué variables del controlador pueden ser asociadas y usadas en la View.

    *¿Por qué?*: Colocar los detalles de implementación de una función al final del deja la complejidad fuera de la vista, con las cosas importantes arriba.

    *¿Por qué?*: Evitamos problemas usando funciones antes de ser definidas.

    *¿Por qué?*: No tendrás que propcuparte de que si pones `var a` antes de `var b` se rompa el código porque `a` dependa de `b`.

    *¿Por qué?*: El orden es crítico para las funciones

  ```javascript
  /** 
   * evitar 
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

  Nótese que lo importante está disperso en el ejemplo anterior. En el siguiente ejemplo, lo importante está arriba. Por ejemplo, las variables asociadas al controller como `vm.avengers` y `vm.title`. Los detalles de implementación están debajo. Así es más fácil de leer.

  ```javascript
  /*
   * recomendado
   * Usando declaraciones de funciones y 
   * asignandola a las variables arriba.
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

### Defer Controller Logic
###### [Style [Y035](#style-y035)]

  - Difiera la lógica dentro de un controller delegándola en services y factories.

    *¿Por qué?*: La lógica podría ser reutilizada por varios controllers cuando la colocas en un service y la expones como una función.

    *¿Por qué?*: La lógica en un servicio puede ser aislada en un test unitario, mientras que la lógica de llamadas en un controller se puede mockear fácilmente.

    *¿Por qué?*: Elimina dependencias y esconde detalles de implementación del controller.

  ```javascript

  /* evitar */
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
  /* recomendado */
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

### Keep Controllers Focused
###### [Style [Y037](#style-y037)]

  - Define un controller para una vista, no intentes reutilizar el controller para otras views. En lugar de eso, mueve la lógica que se pueda reutilizar en factories y deja el controller simple, enfocándose en su view. 

    *¿Por qué?*: Reutilizar controllers con varias views es arriesgado y necesitarías un buen end to end (e2e) test para asegurar que todo funciona bien en la aplicación.

### Assigning Controllers
###### [Style [Y038](#style-y038)]

  - Cuando un controller debe ser asociado a una view y cada componente puede ser reutilizado por otros controllers o views, define controllers con sus rutas. 

    Nota: Si una View es cargada por otra además de por la ruta, entonces usa la sintaxis `ng-controller="Avengers as vm"`. 

    *¿Por qué?*: Emparejar el controller en la ruta permite a diferentes rutas invocar diferentes pares de controllers y views. Cuando los controllers son asignados en la view usando [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), esa view siempre estará asociada al mismo controller.

 ```javascript
  /* evitar - cuando se use con una ruta y queramos asociarlo dinámicamente */

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
  /* recomendado */

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

**[Volver arriba](#table-of-contents)**

## Services

### Singletons
###### [Style [Y040](#style-y040)]

  - Los Services son instanciados con un `new`, usan `this` para los métodos públicos y las variables. Ya que son muy similares a las factories, usa una factory en su lugar por consistencia.

    Nota: [Todos los servicios AngularJS son singletons](https://docs.angularjs.org/guide/services). Esto significa que sólo hay una instancia de un servicio por inyector.

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

**[Volver arriba](#table-of-contents)**

## Factories

### Single Responsibility
###### [Style [Y050](#style-y050)]

  - Las factories deben tener una [responsabilidad única](http://en.wikipedia.org/wiki/Single_responsibility_principle), que es encapsulada por su contexto. Cuando una factory empiece a exceder el principio de responsabilidad única, una nueva factory debe ser creada.

### Singletons
###### [Style [Y051](#style-y051)]

  - Las Factories son singletos y devuelven un objeto que contiene las variables del servicio.

    Nota: [Todos los servicios AngularJS son singletons](https://docs.angularjs.org/guide/services).

### Accessible Members Up Top
###### [Style [Y052](#style-y052)]

  - Expón las variables que se llaman del servicio (su interfaz) arriba, usando la técnica deribada de [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *¿Por qué?*: Colocar los elementos que se llamand arriba hace más fácil la lectura y te ayuda a identificar los elementos del servicio que se pueden llamar y se deben testear (y/o mockear). 

    *¿Por qué?*: Es especialmente útil cuando el archivo se hace más largo, ya que ayuda a evitar el scroll para ver qué se expone.

    *¿Por qué?*: Setear las funciones puede ser fácil, pero cuando tienen más de una línea ser reduce la legibilidad. Definiendo la interfaz mueve los detalles de implementación abajo, mantiene la interfaz que se llama arriba y lo hace más fácil de leer.

  ```javascript
  /* evitar */
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
  /* recomendado */
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

  De esta forma se asocian los enlaces desde el objeto que lo mantiene, los valores primitivos no se pueden modificar por si solos usando este patrón

    ![Factories Usando "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Function Declarations to Hide Implementation Details
###### [Style [Y053](#style-y053)]

  - Declara funciones para esconder detalles de implementación. Manten los elementos accesibles en la parte superior de la factory. Referencia a los que aparezcan después en el archivo. Para más detalles visita [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *¿Por qué?*: Coloca los elementos accesibles en la parte superior para hacerlo más fácil de leer y ayudarte instantáneamente a identificar qué funciones de la factory te pueden ayudar externamente.

    *¿Por qué?*: Colocar los detalles de implementación de una función al final del archivo mueve esa complegidad fuera de la vista, de esta forma puedes dejar lo importante arriba.

    *¿Por qué?*: Las declaraciones de las funciones son "hoisted" de esta forma no hay problemas en usar una función antes de su definición (como la habría si fuera una expresión).

    *¿Por qué?*: No tendrás que propcuparte de que si pones `var a` antes de `var b` se rompa el código porque `a` dependa de `b`.

    *¿Por qué?*: El orden es crítico para las expresiones 

  ```javascript
  /**
   * evitar
   * Usar function expressions
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
   * recomendado
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

**[Volver arriba](#table-of-contents)**

## Data Services

### Separate Data Calls
###### [Style [Y060](#style-y060)]

  - Refactoriza la lógica para hacer operaciones e interaciones con datos en una factory, que los servicios responsables de las peticiones XHR, local storage, memoria o cualquier otra operación con datos.

    *¿Por qué?*: La responsabilidad del controller es la presentación y recoger la información para la view. No debe importarle cómo se consiguen los datos, sólo saber cómo conseguirlos. Separando los servicios de datos movemos la lógica de cómo conseguirlos al servicio de datos, y deja el controller simple, enfocandose en la vista.

    *¿Por qué?*: Lo hace más fácil de testear (mock o real) las llamadas de datos cuando testeamos un controller que usa un servicio de datos.

    *¿Por qué?*: La implementación del servicio de datos puede tener código muy específico para usar el repositorio de datos. Podría incluir cabeceras, cómo hablar a los datos, u otros servicios como $http. Separando la lógica en servicios de datos encapsulamos la lógica en un único lugar, escondiendo la implementación de sus consumidores externos (quizá un controller), de esta forma es más fácil cambiar la implementación.

  ```javascript
  /* recomendado */

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
    
    Nota: El servicio de datos es llamado desde los consumidores, como el controller, escondiendo la implementación del consumidor como se muestra a continuación.

  ```javascript
  /* recomendado */

  // controller llamando a la factory del servicio de datos
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

### Return a Promise from Data Calls
###### [Style [Y061](#style-y061)]

  - Cuando llamamos a servicios de datos que devuelven una promesa como $http, devuelve una promesa en la llamada de tu función también.

    *¿Por qué?*: Puedes encadenar promesas y hacer algo cuando la llamada se complete y resuelva o rechaze la promesa.

  ```javascript
  /* recomendado */

  activate();

  function activate() {
      /**
       * Step 1
       * Pide a la función getAvengers por los datos
       * de los vengadores y espera la promesa
       */
      return getAvengers().then(function() {
          /**
           * Step 4
           * Ejecuta una acción cuando se resuelva la promesa final
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Step 2
         * Pide al servicio de datos los datos y espera
         * por la promesa
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Step 3
                 * setea los datos y resuelva la promesa
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Volver arriba](#table-of-contents)**

## Directives
### Limit 1 Per File
###### [Style [Y070](#style-y070)]

  - Crea una directiva por archivo. Llama al archivo como la directiva. 

    *¿Por qué?*: Es muy fácil colocar todas las directivas en un archivo, pero será más difícil de partir para ser compartida entre aplicaciones, modulos o para un simple módulo.

    *¿Por qué?*: Una directiva por archivo es fácil de mantener.

  ```javascript
  /* evitar */
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
  /* recomendado */
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
  /* recomendado */
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
  /* recomendado */
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

    Nota: Hay muchas formas de llamar a las directivas, especialmente cuando pueden ser usadas en scopes específicas. Elige un nombre que tenga sentido para la directiva y que su archivo sea distintivo y claro. Hemos visto algunos ejemplos antes, pero veremos más en la sección de cómo nombrar.

### Manipulate DOM in a Directive
###### [Style [Y072](#style-y072)]

  - Cuando manipules DOM directamente, usa una directiva. Si hay alguna alternativa como usando un CSS para cambiar el estilo o el [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) o [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), Entonces úsalos en su lugar. Por ejemplo, si la directiva sólo muestra o esconde elementos, usa ngHide/ngShow. 

    *¿Por qué?*: Manipular el DOM puede ser dificil de testear, debugear y normalmente hay mejores maneras (e.g. CSS, animations, templates)

### Provide a Unique Directive Prefix
###### [Style [Y073](#style-y073)]

  - Proporciona prefijo corto, único y descriptiovo como `acmeSalesCustomerInfo` que se declara en el HTML como `acme-sales-customer-info`.

    *¿Por qué?*: El prefijo corto y único identifica el contexto de la directiva y el origen. Por ejemplo el prefijo `cc-` puede indicar que la directiva en particular es parte de la aplicación CodeCamper, mientras que `acme-` pudiera indicar que la directiva es de la compañía Acme. 

    Nota: Evita `ng-` ya que está reservado para las directivas AngularJS. Estudia sabiamente las directivas usadas para evitar conflictos de nombres, como `ion-` de [Ionic Framework](http://ionicframework.com/). 

### Restrict to Elements and Attributes
###### [Style [Y074](#style-y074)]

  - Cuando crees directivas que tengan sentido como elemento, restringe `E` (elemento personalizado) y opcionalmente restringe `A` (atributo personalizado). Generalmente, si puede ser su control propio, `E` es apropiado, La guía genera es permitir `EA` pero intenta implementarlo como un elemento cuando sea un elemento único y como un atributo cuando añada elementos a su propio DOM.

    *¿Por qué?*: Tiene sentido.

    *¿Por qué?*: Mientras permitamos que una directiva sea usada como una clase, si esa directiva realmente estáa actuando como un elemento, tiene sentido que sea un elemento, o al menos un atributo.

    Nota: En AngularJS 1.3 + EA es el valor por defecto

  ```html
  <!-- evitar -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* evitar */
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
  <!-- recomendado -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```
  
  ```javascript
  /* recomendado */
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

  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    *¿Por qué?*: It makes sense and it's not difficult.

    Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place. 

    Note: Regarding dependency injection, see [Manually Identify Dependencies](#manual-annotating-for-dependency-injection).

    Note: Note that the directive's controller is outside the directive's closure. This style eliminates issues where the injection gets created as unreachable code after a `return`.

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

###### [Style [Y076](#style-y076)]

  - Use `bindToController = true` when using `controller as` syntax with a directive when you want to bind the outer scope to the directive's controller's scope.

    *¿Por qué?*: It makes it easy to bind outer scope to the directive's controller scope.

    Note: `bindToController` was introduced in Angular 1.3.0. 

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

**[Volver arriba](#table-of-contents)**

## Resolving Promises for a Controller

### Controller Activation Promises
###### [Style [Y080](#style-y080)]

  - Resolve start-up logic for a controller in an `activate` function.
     
    *¿Por qué?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    *¿Por qué?*: The controller `activate` makes it convenient to re-use the logic for a refresh for the controller/View, keeps the logic together, gets the user to the View faster, makes animations easy on the `ng-view` or `ui-view`, and feels snappier to the user.

    Note: If you need to conditionally cancel the route before you start use the controller, use a [route resolve](#style-y081) instead.
    
  ```javascript
  /* evitar */
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
  /* recomendado */
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

### Route Resolve Promises
###### [Style [Y081](#style-y081)]

  - When a controller depends on a promise to be resolved before the controller is activated, resolve those dependencies in the `$routeProvider` before the controller logic is executed. If you need to conditionally cancel a route before the controller is activated, use a route resolver.

  - Use a route resolve when you want to decide to cancel the route before ever transitioning to the View.

    *¿Por qué?*: A controller may require data before it loads. That data may come from a promise via a custom factory or [$http](https://docs.angularjs.org/api/ng/service/$http). Using a [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) allows the promise to resolve before the controller logic executes, so it might take action based on that data from the promise.

    *¿Por qué?*: The code executes after the route and in the controller’s activate function. The View starts to load right away. Data binding kicks in when the activate promise resolves. A “busy” animation can be shown during the view transition (via ng-view or ui-view)

    Note: The code executes before the route via a promise. Rejecting the promise cancels the route. Resolve makes the new view wait for the route to resolve. A “busy” animation can be shown before the resolve and through the view transition. If you want to get to the View faster and do not require a checkpoint to decide if you can get to the View, consider the [controller `activate` technique](#style-y080) instead.

  ```javascript
  /* evitar */
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
        var vm = this;
        vm.movies = moviesPrepService.movies;
  }
  ```

    Note: The example below shows the route resolve points to a named function, which is easier to debug and easier to handle dependency injection.

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
    Note: The code example's dependency on `movieService` is not minification safe on its own. For details on how to make this code minification safe, see the sections on [dependency injection](#manual-annotating-for-dependency-injection) and on [minification and annotation](#minification-and-annotation).

**[Volver arriba](#table-of-contents)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification
###### [Style [Y090](#style-y090)]

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.
  
    *¿Por qué?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    This code may produce mangled variables when minified and thus cause runtime errors.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
###### [Style [Y091](#style-y091)]

  - Use `$inject` to manually identify your dependencies for AngularJS components.
  
    *¿Por qué?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), which I recommend for automating the creation of minification safe dependencies. If `ng-annotate` detects injection has already been made, it will not duplicate it.

    *¿Por qué?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

    *¿Por qué?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function. 

    ```javascript
    /* evitar */
    angular
        .module('app')
        .controller('Dashboard', 
            ['$location', '$routeParams', 'common', 'dataservice', 
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* evitar */
    angular
      .module('app')
      .controller('Dashboard', 
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);
      
    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* recomendado */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Note: When your function is below a return statement the $inject may be unreachable (this may happen in a directive). You can solve this by either moving the $inject above the return statement or by using the alternate array injection syntax. 

    Note: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduced a feature where it moves the `$inject` to where it is reachable.

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

### Manually Identify Route Resolver Dependencies
###### [Style [Y092](#style-y092)]

  - Use $inject to manually identify your route resolver dependencies for AngularJS components.

    *¿Por qué?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

    *¿Por qué?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

    ```javascript
    /* recomendado */
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

**[Volver arriba](#table-of-contents)**

## Minification and Annotation

### ng-annotate
###### [Style [Y100](#style-y100)]

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/** @ngInject */`
  
    *¿Por qué?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

    *¿Por qué?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated 

    >I prefer Gulp as I feel it is easier to write, to read, and to debug.

    The following code is not using minification safe dependencies.

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

    When the above code is run through ng-annotate it will produce the following output with the `$inject` annotation and become minification-safe.

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

    Note: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

    Note: When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

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

    > Note: Starting from AngularJS 1.3 use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code.
    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate
###### [Style [Y101](#style-y101)]

  - Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
    *¿Por qué?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

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

**[Volver arriba](#table-of-contents)**

## Exception Handling

### decorators
###### [Style [Y110](#style-y110)]

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.
  
    *¿Por qué?*: Provides a consistent way to handle uncaught AngularJS exceptions for development-time or run-time.

    Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

    ```javascript
    /* recomendado */
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

    *¿Por qué?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

    Note: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

    ```javascript
    /* recomendado */
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

    *¿Por qué?*: Provides a consistent way handle all routing errors.

    *¿Por qué?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or recovery options.

    ```javascript
    /* recomendado */
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

**[Volver arriba](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [Y120](#style-y120)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.controller.js`)
    * the registered component name with Angular (`AvengersController`)
 
    *¿Por qué?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *¿Por qué?*: The naming conventions should simply help you find your code faster and make it easier to understand. 

### Feature File Names
###### [Style [Y121](#style-y121)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`.

    *¿Por qué?*: Provides a consistent way to quickly identify components.

    *¿Por qué?*: Provides pattern matching for any automated tasks.

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

  Note: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team.

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

  - Name test specifications similar to the component they test with a suffix of `spec`.

    *¿Por qué?*: Provides a consistent way to quickly identify components.

    *¿Por qué?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

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

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    *¿Por qué?*: Provides a consistent way to quickly identify and reference controllers.

    *¿Por qué?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers() { }
    ```

### Controller Name Suffix
###### [Style [Y124](#style-y124)]

  - Append the controller name with the suffix `Controller` or with no suffix. Choose 1, not both.

    *¿Por qué?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

    *¿Por qué?*: Omitting the suffix is more succinct and the controller is often easily identifiable even without the suffix.

    ```javascript
    /**
     * recommended: Option 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers() { }
    ```

    ```javascript
    /**
     * recommended: Option 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Factory Names
###### [Style [Y125](#style-y125)]

  - Use consistent names for all factories named after their feature. Use camel-casing for services and factories.

    *¿Por qué?*: Provides a consistent way to quickly identify and reference factories.

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

### Directive Component Names
###### [Style [Y126](#style-y126)]

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    *¿Por qué?*: Provides a consistent way to quickly identify and reference components.

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

  - When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`. 

    *¿Por qué?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *¿Por qué?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration
###### [Style [Y128](#style-y128)]

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *¿Por qué?*: Separates configuration from module definition, components, and active code.

    *¿Por qué?*: Provides a identifiable place to set configuration for a module.

### Routes
###### [Style [Y129](#style-y129)]

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration. 

**[Volver arriba](#table-of-contents)**

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

    *¿Por qué?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly, they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

    *¿Por qué?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat
###### [Style [Y143](#style-y143)]

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *¿Por qué?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - Be DRY, but don't go nuts and sacrifice readability.

    *¿Por qué?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it. 

**[Volver arriba](#table-of-contents)**

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  - Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions. 

    *¿Por qué?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed. 

    *¿Por qué?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names. 

    *¿Por qué?*: The LIFT guidelines are all covered.

    *¿Por qué?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *¿Por qué?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

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

      Note: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

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

**[Volver arriba](#table-of-contents)**

## Modularity

### Many Small, Self Contained Modules
###### [Style [Y160](#style-y160)]

  - Create small modules that encapsulate one responsibility.

    *¿Por qué?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally. This means we can plug in new features as we develop them.

### Create an App Module
###### [Style [Y161](#style-y161)]

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *¿Por qué?*: AngularJS encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *¿Por qué?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

    *¿Por qué?*: The app module becomes a manifest that describes which modules help define the application. 

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *¿Por qué?*: Self contained modules can be added to the application with little or no friction.

    *¿Por qué?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *¿Por qué?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code. 

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *¿Por qué?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - The application root module depends on the app specific feature modules and any shared or reusable modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *¿Por qué?*: The main app module contains a quickly identifiable manifest of the application's features. 

    *¿Por qué?*: Each feature area contains a manifest of what it depends on, so it can be pulled in as a dependency in other applications and still work. 

    *¿Por qué?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind. 

    > In a small app, you can also consider putting all the shared dependencies in the app module where the feature modules have no direct dependencies. This makes it easier to maintain the smaller application, but makes it harder to reuse modules outside of this application.

**[Volver arriba](#table-of-contents)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidates include providers and constants.

    *¿Por qué?*: This makes it easier to have a less places for configuration.

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

    *¿Por qué?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Volver arriba](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *¿Por qué?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *¿Por qué?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Volver arriba](#table-of-contents)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *¿Por qué?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

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

    *¿Por qué?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

### Test Runner
###### [Style [Y192](#style-y192)]

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *¿Por qué?*: Karma is easy to configure to run once or automatically when you change your code.

    *¿Por qué?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *¿Por qué?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *¿Por qué?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - Use [Sinon](http://sinonjs.org/) for stubbing and spying.

    *¿Por qué?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *¿Por qué?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *¿Por qué?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server. 

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - Run JSHint on your tests. 

    *¿Por qué?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *¿Por qué?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

### Organizing Tests
###### [Style [Y197](#style-y197)]

  - Place unit test files (specs) side-by-side with your client code. Place specs that cover server integration or test multiple components in a separate `tests` folder.

    *¿Por qué?*: Unit tests have a direct correlation to a specific component and file in source code. 

    *¿Por qué?*: It is easier to keep them up to date since they are always in sight. When coding whether you do TDD or test during development or test after development, the specs are side-by-side and never out of sight nor mind, and thus more likely to be maintained which also helps maintain code coverage.

    *¿Por qué?*: When you update source code it is easier to go update the tests at the same time.

    *¿Por qué?*: Placing them side-by-side makes it easy to find them and easy to move them with the source code if you move the source.

    *¿Por qué?*: Having the spec nearby makes it easier for the source code reader to learn how the component is supposed to be used and to discover its known limitations.

    *¿Por qué?*: Separating specs so they are not in a distributed build is easy with grunt or gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.spec.js
                             /customers.controller-detail.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Volver arriba](#table-of-contents)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *¿Por qué?*: Subtle animations can improve User Experience when used appropriately.

    *¿Por qué?*: Subtle animations can improve perceived performance as views transition.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate. 

    *¿Por qué?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css
###### [Style [Y212](#style-y212)]

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *¿Por qué?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *¿Por qué?*: Provides consistency in your animations.

    *¿Por qué?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Volver arriba](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *¿Por qué?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *¿Por qué?*: Provides consistency using a common industry tool.

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

**[Volver arriba](#table-of-contents)**

## JS Hint

### Use an Options File
###### [Style [Y230](#style-y230)]

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

    *¿Por qué?*: Provides a first alert prior to committing any code to source control.

    *¿Por qué?*: Provides consistency across your team.

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

**[Volver arriba](#table-of-contents)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - Create an AngularJS Constant for vendor libraries' global variables.

    *¿Por qué?*: Provides a way to inject vendor libraries that otherwise are globals. This improves code testability by allowing you to more easily know what the dependencies of your components are (avoids leaky abstractions). It also allows you to mock these dependencies, where it makes sense.

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

    *¿Por qué?*: A value that may change, even infrequently, should be retrieved from a service so you do not have to change the source code. For example, a url for a data service could be placed in a constants but a better place would be to load it from a web service.

    *¿Por qué?*: Constants can be injected into any angular component, including providers.

    *¿Por qué?*: When an application is separated into modules that may be reused in other applications, each stand-alone module should be able to operate on its own including any dependent constants. 

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

**[Volver arriba](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - AngularJS snippets that follow these styles and guidelines. 

    - Download the [Sublime Angular snippets](assets/sublime-angular-snippets.zip?raw=true) 
    - Place it in your Packages folder
    - Restart Sublime 
    - In a JavaScript file type these commands followed by a `TAB`
 
    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective // creates an Angular directive
    ngfactory // creates an Angular factory
    ngmodule // creates an Angular module
    ```

### Visual Studio
###### [Style [Y251](#style-y251)]

  - AngularJS file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - AngularJS snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    - Download the [WebStorm AngularJS file templates and snippets](assets/webstorm-angular-file-template.settings.jar?raw=true) 
    - Open WebStorm and go to the `File` menu
    - Choose the `Import Settings` menu option
    - Select the file and click `OK`
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

**[Volver arriba](#table-of-contents)**

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

**[Volver arriba](#table-of-contents)**

## Routing
Client-side routing is important for creating a navigation flow between views and composing views that are made of many smaller templates and directives.

###### [Style [Y270](#style-y270)]

  - Use the [AngularUI Router](http://angular-ui.github.io/ui-router/) for client-side routing.

    *¿Por qué?*: UI Router offers all the features of the Angular router plus a few additional ones including nested routes and states.

    *¿Por qué?*: The syntax is quite similar to the Angular router and is easy to migrate to UI Router.

###### [Style [Y271](#style-y271)]

  - Define routes for views in the module where they exist. Each module should contain the routes for the views in the module.

    *¿Por qué?*: Each module should be able to stand on its own.

    *¿Por qué?*: When removing a module or adding a module, the app will only contain routes that point to existing views.

    *¿Por qué?*: This makes it easy to enable or disable portions of an application without concern over orphaned routes.

**[Volver arriba](#table-of-contents)**

## Task Automation
Use [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) for creating automated tasks. Gulp leans to code over configuration while Grunt leans to configuration over code. I personally prefer Gulp as I feel it is easier to read and write, but both are excellent.

###### [Style [Y400](#style-y400)]

  - Use task automation to list module definition files `*.module.js` before all other application JavaScript files.

    *¿Por qué?*: Angular needs the module definitions to be registered before they are used.

    *¿Por qué?*: Naming modules with a specific pattern such as `*.module.js` makes it easy to grab them with a glob and list them first.

    ```javascript
    var clientApp = './src/client/app/';

    // Always grab module files first
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Volver arriba](#table-of-contents)**

## AngularJS docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

### Process
    1. Discuss the changes in a GitHub issue. 
    2. Open a Pull Request against the develop branch, reference the issue, and explain the change and why it adds value.
    3. The Pull Request will be evaluated and either merged or declined.

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

**[Volver arriba](#table-of-contents)**
