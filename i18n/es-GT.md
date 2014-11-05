# Guía de estilo AngularJS

*Guía «obstinada» de estilos AngularJS para equipos por [@john_papa](//twitter.com/john_papa)*

>La [versión original en Inglés](http://jpapa.me/ngstyles) es la fuente de la verdad, como tal es mantenida y actualizada primero.

Si estás buscando una guía «obstinada» para estilos de sintaxis, convenciones, y estructuración de aplicaciones AngularJS, entonces pasa adelante. Esta guía está basada en mi experiencia desarrollando con [AngularJS](//angularjs.org), presentaciones, [cursos de entrenamiento Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) y trabajando en equipo. 

>Si te gusta esta guía, échale un vistazo a mi curso [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) en Pluralsight.

El propósito de esta guía de estilo es proveer orientación en la construcción de aplicaciones AngularJS mostrando las convenciones que yo utilizo y, más importante, por qué las he elegido. 

## Créditos y una Alucinante Comunidad
Nunca trabaje en el vacío. He encontrado que la comunidad AngularJS es un grupo increíble a los que les apasiona compartir experiencias. Como tal, Todd Motto (un amigo y experto en AngularJS) y yo hemos colaborado en muchos estilos y convenciones. Nosotros concordamos la mayoría de las veces, y algunas discrepamos. Te invito a echar un vistazo a las [Directrices de Todd](https://github.com/toddmotto/angularjs-styleguide) para tener una idea de su enfoque y cómo se compara.

Muchos de mis estilos han sido producto de muchas sesiones de programación en pareja que [Ward Bell](http://twitter.com/wardbell) y yo hemos tenido. A pesar que no siempre hemos estado de acuerdo, mi amigo Ward ciertamente ayudó influenciando la última evolución de esta guía.

## Mira los Estilos en una Aplicación de ejemplo
Mientras que esta guía explica el *qué*, *cómo* y *por qué*, Encuentro sumamente útil el verlo en práctica. Esta guía se encuentra acompañada por una aplicación de ejemplo que sigue estos estilos y patrones. Puedes encontrar la [aplicación de ejemplo (llamada modular) aquí](https://github.com/johnpapa/ng-demos) en la carpeta `modular`. Siéntete libre de tomarlo, clonarlo y *forkearlo*. [Las instrucciones para ejecutarla están es su archivo readme](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Traducciones 
[Las traducciones de esta guía de estilo Angular](../i18n) son mantenidos por la comunidad y se encuentran aquí.

> **Notas de la traducción en español:** Algunos de los títulos así como algunos términos se mantendrán en inglés, porque si deseas investigar en un buscador mas sobre cada tema en el futuro, tal búsqueda en inglés dará un resultado **mucho** mejor.
>
> Después del título habrá una ayuda de traducción, cuando sea necesario, ya que algunos términos son más fáciles de entender cuando no son traducidos.
>
> Para posibles errores de escritura y/o traducción, por favor enviar un pull-request!.

## Tabla de contenido

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
  1. [Documentación de AngularJS](#angularjs-docs)
  1. [Colaboraciones](#contributing)
  1. [Licencia](#license)

## Single Responsibility
o *Única Responsabilidad*

### La regla del 1

  - Definir 1 componente por archivo.  

 	El siguiente ejemplo define el módulo `app` y sus dependencias, define un controller, y define un factory todo en el mismo archivo.  

  ```javascript
  /* evita */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```
    
	Los mismos componentes, pero ahora separados en sus propios archivos.

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
    	.controller('SomeController' , SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recomendado */
  
  // someFactory.js
  angular
    	.module('app')
    	.factory('someFactory' , someFactory);
  	
  function someFactory() { }
  ```

**[Ir hacia arriba](#table-of-contents)**

## IIFE
### JavaScript Closures

  - Encierra los componentes AngularJS en una Immediately Invoked Function Expression (IIFE Expresión de función ejecutada inmediatamente). 
  
  *¿Por qué?*: Una IIFE quita las variables del ámbito global. Esto ayuda a prevenir declaraciones de funciones y variables que puedan vivir mas tiempo de lo esperado en el ámbito global, Lo que también ayuda a prevenir colisión de variables.

  *¿Por qué?*: Cuando tu código es «minificado» y empaquetado en un único archivo para ser publicado en un servidor de producción,podrías tener colisión de variables y muchas variables globales. Una IIFE te protege de estas dos cosas proveyendo un ámbito de variables distinto por cada archivo.

  ```javascript
  /* evita */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // la función logger es agregada como una variable global
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // la función storage es agregada como una variable global  
  function storage() { }
  ```

  
  ```javascript
  /**
   * recomendado 
   *
   * ninguna global se queda atrás 
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

  - Nota: Únicamente por brevedad, en el resto de ejemplos de esta guía se podrá omitir la sintaxis IIFE. 
  
  - Nota: Las IIFE evitan que el código de pruebas alcance miembros privados como expresiones regulares o funciones auxiliares que a menudo es mejor probarlas por pruebas unitarias que les pertenecen directamente a ellas. Sin embargo puedes probar estas por medio de miembros de acceso o exponiéndolas por medio de su propio componente. Por ejemplo: colocando funciones auxiliares, expresiones regulares o constantes en sus propios factory o constant.

**[Ir hacia arriba](#table-of-contents)**

## Modules
o *Módulos*

### Evitando colisión de nombres

  - Utiliza una única convención de nombres con separadores por sub-módulos. 

  *¿Por qué?*: Nombres únicos ayudan a evitar la colisión de nombres de módulos. Los separadores ayudan a definir módulos y su jerarquía de sub-módulos. Por ejemplo `app` puede ser tu módulo principal mientras que `app.dashboard` y `app.users` pueden ser módulos que son usados como dependencias de `app`. 

### Definiciones (también conocidos como Setters)

  - Declara módulos sin una variable, usando la sintaxis de asignación (setter). 

	*¿Por qué?*: Con 1 componente por archivo, raramente habrá necesidad de introducir una variable para el módulo.
	
  ```javascript
  /* evita */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

	En su lugar utiliza la sintaxis simple de asignación.

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

  - Cuando estés utilizando un módulo evita usar una variable y en su lugar usa el encadenamiento con la sintaxis *getter*.

	*¿Por qué?*: Esto produce código más legible y evita colisión de variables o fugas.

  ```javascript
  /* evita */
  var app = angular.module('app');
  app.controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

  ```javascript
  /* recomendado */
  angular
      .module('app')
      .controller('SomeController' , SomeController);
  
  function SomeController() { }
  ```

### Setting vs Getting

  - Solamente asigna una vez y obtén en todas las demás circunstancias.
	
	*¿Por qué?*: Un módulo debe ser creado una única vez, entonces obtenlo a partir de ese punto y después de eso.
  	  
	  - Usa `angular.module('app', []);` para asignar un módulo.
	  - Use  `angular.module('app');` para obtener un módulo. 

### Funciones Anónimas vs Nombradas

  - Usa funciones nombradas en lugar de pasar una función anónima como un callback. 

	*¿Por qué?*: Esto produce código más legible, es mucho más fácil de depurar, y reduce la cantidad de código callback anidado.

  ```javascript
  /* evita */
  angular
      .module('app')
      .controller('Dashboard', function() { });
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

**[Ir hacia arriba](#table-of-contents)**

## Controllers
o *Controladores*

### Sintaxis controllerAs en Vistas

  - Utiliza la sintaxis [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) en lugar de la sintaxis `clásica de controller con $scope`. 

	*¿Por qué?*: los Controllers son construidos, levantados con un "new", y proveen una única instancia nueva, y la sintaxis `controllerAs` es mas cercana a un constructor JavaScript que la sintaxis `clasica de $scope`. 

	*¿Por qué?*: Esta promueve el uso de bindings a un objeto con "punto" en la vista (p. ej. `customer.name` en lugar de `name`), lo que es mas contextual, fácil de leer, y evita cualquier problema de referencia que puede ocurrir sin "puntear".

	*¿Por qué?*: Ayuda a evitar el uso de llamadas `$parent` en vistas con controllers anidados.

  ```html
  <!-- evita -->
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

### Sintaxis controllerAs en Controller

  - Usa la sintaxis `controllerAs` en lugar de la sintaxis `clásica de controller con $scope`. 

  - La sintaxis `controllerAs` usa `this` dentro de los controllers lo que lo deja ligado al `$scope`

  *¿Por qué?*: `controllerAs` es sintácticamente mas agradable que el `$scope`. Aún puedes enlazar y acceder a métodos del `$scope` en la vista.  

  *Por qué?*: Ayuda a evitar la tentación de usar métodos del `$scope` dentro de un controller cuando podría ser mejor evitarlos o moverlos a un factory. Considera usar `$scope` en un factory, o en un controller solo si es necesario. Por ejemplo cuando se publican o suscriben eventos usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), u [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considera mover estos usos a un factory e invocar estos factories desde el controller. 

  ```javascript
  /* evita */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado - pero mira la siguiente sección */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs con vm

  - Usa una variable de captura para `this` cuando estés utilizando la sintaxis `controllerAs`. elige un nombre consistente para la variable como `vm`, que es estándar para ViewModel.
  
  *¿Por qué?*: La palabra clave `this` es contextual y cuando es usada en una función dentro de un controller puede cambiar su contexto. Capturando el contexto de `this` evita tropezarse con este problema.

  ```javascript
  /* evita */
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

  Nota: Pueden evitar cualquier advertencia de [jshint](http://www.jshint.com/) colocando el comentario de abajo por encima de la linea de código. 
    
  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```
   
  Nota: Cuando creamos watches en un controller usando `controller as`, pueden capturar el miembro de `vm.*` usando la siguiente sintaxis. (Crear watches con precaución ya que agregan mas carga al ciclo de procesamiento.)

  ```javascript
  $scope.$watch('vm.title', function(current, original) {
      $log.info('vm.title was %s', original);
      $log.info('vm.title is now %s', current);
  });
  ```

### Miembros enlazables (Bindable) en la parte superior

  - Coloca los miembros enlazables en la parte superior del controller, en orden alfabético, y no dispersos por el código del controller.
  
    *¿Por qué?*: Colocando los miembros enlazables en la parte superior hace más fácil la lectura y ayuda a identificar instantáneamente qué miembros del controller pueden ser enlazados y utilizados en la vista.

    *¿Por qué?: Asignar funciones anónimas en-linea puede ser fácil, pero cuando estas funciones son más de 1 linea de código pueden reducir la legibilidad. Definiendo estas funciones por debajo de los miembros enlazables (las funciones serán alzadas *javascript hoisting*) moviendo los detalles de la implementación hacia abajo, manteniendo los miembros enlazables en la parte superior, y los hace más fácil de leer. 

  ```javascript
  /* evita */
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

  Nota: Si la función es de 1 linea considera mantenerla en la parte superior, mientras que la longitud no afecte la legibilidad.

  ```javascript
  /* evita */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /** 
           * lineas 
           * de
           * código
           * afectando
           * legibilidad
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

### Declaraciones de Funciones para Ocultar los Detalles de Implementación

  - Usa declaraciones de funciones para ocultar los detalles de la implementación. Mantén los miembros enlazables en la parte superior. Cuando necesitas enlazar una función en un controller, apunta esta a una declaración de función que aparece mas abajo en el archivo. Esto esta asociado directamente a la sección de Miembros Enlazables en la parte superior. Para mas detalles mira [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).
    
    *¿Por qué?*: Colocando los miembros enlazables en la parte superior los hace mas fácil de leer y ayuda a identificar inmediatamente qué miembros del controller pueden ser enlazados y usados en la Vista. (lo mismo que antes.)

    *¿Por qué?*: Colocando los detalles de la implementación de una función mas abajo en el archivo mueve la complejidad fuera de la vista entonces puedes ver las cosas importantes en la parte superior.

    *¿Por qué?*: La declaración de una función es alzada (*javascript hoisting*) entonces no hay que preocuparse por el uso de una función antes de su definición (cosa que no se puede con las function expressions).

    *¿Por qué?*: Nunca debes preocuparte que si mueves las declaraciones de las funciones `var a` antes que `var b` se arruinará tu código porque `a` depende de `b`.     

    *¿Por qué?*: El orden es crítico con las function expressions. 

  ```javascript
  /** 
   * evita 
   * Usando function expressions.
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

  Nota que las cosas importantes están dispersas en el ejemplo anterior. In el ejemplo de abajo, nota que las cosas importantes están en la parte superior. Por ejemplo, los miembros enlazables del controller como `vm.avengers` y `vm.title`. Los detalles de la implementación están por debajo. Esto es simplemente mas fácil de leer.

  ```javascript
  /*
   * recomendado
   * Usando declaraciones de funciones
   * y miembros enlazables en la parte superior.
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

### Abstraer la lógica del Controller

  - Abstraer la lógica en un controller delegándola a servicios y factories.

    *¿Por qué?*: La lógica puede ser reutilizada por múltiples controllers cuando es colocada en un servicio y expuesta vía una función.

    *¿Por qué?*: La lógica en un servicio puede ser mas fácil de aislar en una prueba unitaria, mientras las llamadas a la lógica en el controller pueden ser facilmente «mockeadas».

    *¿Por qué?*: Remueve dependencias y oculta detalles de implementación del controller.

  ```javascript
  /* evita */
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
  /* recomendado */
  function Order(creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.total = 0;

      function checkCredit() { 
         return creditService.check();
      };
  }
  ```

### Manten los Controllers enfocados

  - Define un controller por vista, y trata de no reutilizar el controller para otras vistas. En su lugar, mueve la lógica reutilizable a factories y mantén el controller simple y enfocado en su vista.
  
    *¿Por qué?*: Reutilizando controllers con múltiples vistas es frágil y una buena cobertura de código end to end (e2e) es requerida para garantizar la estabilidad a través de aplicaciones de gran escala.

### Asignando Controllers

  - Cuando un controller debe ser emparejado con una vista y cualquiera de los componentes puede ser reutilizado por otro controlador o vista, define controllers junto con sus rutas.
    
    Nota: Si una Vista es cargada por medio de otra y no solo por una ruta, entonces usa la sintaxis `ng-controller="Avengers as vm"`. 

    *¿Por qué?*: Emparejando el controller en la ruta permite que diferentes rutas invoquen diferentes parejas de controllers y vistas. Cuando los controllers son asignados en la vista utilizando [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), esa vista está siempre asociada con el mismo controller.

  ```javascript
  /* evita - cuando usamos con una ruta y deseamos emparejar dinámicamente */

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

**[Ir hacia arriba](#table-of-contents)**


## Services
o *Servicios*

### Singletons

  - Los Servicios son instanciados con la palabra clave `new`, utiliza `this` para métodos y variables públicas. Debido a que esto es muy similar a las factories, utiliza una factory en su lugar por consistencia. 
  
    Nota: [Todos los servicios AngularJS son singletons](https://docs.angularjs.org/guide/services). Esto quiere decir que hay solamente una instancia del servicio dado por inyector.

  ```javascript
  // servicio
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

**[Ir hacia arriba](#table-of-contents)**

## Factories
o *Fábricas*

### Single Responsibility
o *Única responsabilidad*

  - Los Factories deberían de tener una [sola responsabilidad](http://en.wikipedia.org/wiki/Single_responsibility_principle), que es encapsulada por su contexto. Toda vez un factory comienza a exceder su singular proposito, un nuevo factory debería ser creado.

### Singletons

  - Los Factories son singletons y retornan un objeto que contiene miembros de un servicio.
  
    Nota: [Todos los servicios AngularJS son singletons](https://docs.angularjs.org/guide/services).

### Miembros Accesibles Al Inicio

  - Expone los miembros invocables del servicio (su interfaz) al inicio, usando una técnica derivada del [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript). 

    *¿Por qué?*: Colocando los miembros invocables al inicio hace más facil de leer y facilita instantaneamente la identificación de qué miembros del servicio pueden ser invocados y pueden ser probados con tests unitarios (y/o mockeados). 

    *¿Por qué?*: Esto es especialmente útil cuando el archivo resulta demasiado largo por lo que ayuda a evitar tener que scrolear para ver que está expuesto.

    *¿Por qué?*: Asginar funciones a medida que se avanza puede ser fácil, pero cuando estas funciones son de más de 1 linea de código estas pueden reducir la legibilidad y causar mas scrolling. Definiendo la interfaz invocable vía el servicio retornado mueve los detalles de la implementación hacia abajo, mantiene la interfaz invocable en la parte superior y hace más fácil la lectura.

  ```javascript
  /* evita */
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

  Esta forma de los bindings son reflejados a través del objeto host, los valores primitivos no pueden ser actualizados solamente utilizando el patrón revealing module.

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Function Declarations para Ocultar Detalles de Implementación

  - Utiliza function declarations para ocultar detalles de implementación. Mantén los miembros accesibles en la parte superior del factory. Apunta estos a function declarations que aparecen mas adelante en el archivo. Para más detalles mira [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    *¿Por qué?*: Colocando los miembros accesibles al inicio los hace más fácil de leer y te ayuda instantaneamente a identificar a que funciones del factory puedes acceder externamente.

    *¿Por qué?*: Colocando los detalles de la implementación de una función más adelante en el archivo mueve la compejidad fuera de la vista por lo que pueden ver las cosas importantes al inicio.

    *¿Por qué?*: Las declaraciones de funciones son alzadas (javascript hoisting) por lo que no hay que preocuparse acerca del uso de funciones antes de ser definidas (lo que socedería con expresiones de función).

    *¿Por qué?*: Nunca tendrás que preocuparte con declaración de funciones que si moviendo `var a` antes de `var b` pueda romper tu código porque `a` depende de `b`.

    *¿Por qué?*: El orden es crítico con expresiones de función 

  ```javascript
  /**
   * evita
   * Usando expresiones de función
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // los detalles de la implementación van aquí
      };

      var getAvengerCount = function() {
          // los detalles de la implementación van aquí
      };

      var getAvengersCast = function() {
         // los detalles de la implementación van aquí
      };

      var prime = function() {
         // ilos detalles de la implementación van aquí
      };

      var ready = function(nextPromises) {
          // los detalles de la implementación van aquí
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
   * Usando declaraciones de funciones
   * y los miembros accesibles al inicio.
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
         // los detalles de la implementación van aquí
      }

      function getAvengerCount() {
          // los detalles de la implementación van aquí
      }

      function getAvengersCast() {
         // los detalles de la implementación van aquí
      }

      function prime() {
          // los detalles de la implementación van aquí
      }

      function ready(nextPromises) {
          // los detalles de la implementación van aquí
      }
  }
  ```

**[Ir hacia arriba](#table-of-contents)**

## Data Services
o *Servicios de datos*

### Separar las Llamadas a Datos

  - Refactorizar la lógica para hacer las operaciones de datos e interacciones con datos a un factory. Haz los servicios de datos responsables de las llamadas XHR, local storage, stashing en memoria o cualquier otra operación de datos.

    *¿Por qué?*: La responsabilidad de los controller es de presentacion y obtención de información para la vista. No le debería de importar cómo son obtenidos los datos, solamente conocer cómo debe preguntar por ellos. Separando los servicios de datos mueve la lógica de cómo obtenerlos hacia el servicio de datos, y le permite al controller ser más simple y enfocarse más en la vista.

    *¿Por qué?*: Esto hace mas fácil probar (mock o real) las llamadas a los datos cuándo probamos un controller que usa un servicio de datos.

    *¿Por qué?*: La implementación de un servicio de datos puede tener mucho código específico para manejar el repositorio de datos. Esto puede incluir headers, cómo hablar con los datos, u otros servicios como el $http. Separando la lógica en un servicio de datos encapsula esta lógica en un único lugar ocultando la implementación de consumidores externos (tal vez un controller), además hace mas fácil de cambiar la implementación.

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
    
    Nota: El servicio de datos es llamado desde los consumidores, como un controller, ocultando la implementacion a estos consumidores, como se muestra a continuación.

  ```javascript
  /* recomendado */

  // controller llamando al dataservice factory
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

### Retornar una Promise (Promesa) desde una Llamada de Datos

  - Cuándo se llamas un servicio de datos que retorna una promesa como el $http, retorna una promesa en tu función también.

    *¿Por qué?*: Puedes encadenar promesas juntas y ralizar acciones adicionales despues de que la llamada de datos se complete y la promesa sea rechazada o resuelta.

  ```javascript
  /* recomendado */

  activate();

  function activate() {
      /**
       * Paso 1
       * Consultar a la función getAvengers por los
       * datos de los avenger y esperar por la promesa
       */
      return getAvengers().then(function() {
          /**
           * Paso 4
           * Ejecutar una accion al resolver la promesa final
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Paso 2
         * Consultar al servicio de datos por los datos y esperar
         * por la promesa
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Paso 3
                 * asignar los datos y resolver la promesa
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[Ir hacia arriba](#table-of-contents)**

## Directives
o *Directivas*

### Limitar 1 Por Archivo

  - Create one directive per file. Name the file for the directive. 

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

    Note: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and it's file name distinct and clear. Some examples are below, but see the naming section for more recommendations.

### Limit DOM Manipulation

  - When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow. 

    *Why?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

### Provide a Unique Directive Prefix

  - Provide a short, unique and descriptive directive prefix such as `acmeSalesCustomerInfo` which is declared in HTML as `acme-sales-customer-info`.

    *Why?*: The unique short prefix identifies the directive's context and origin. For example a prefix of `cc-` may indicate that the directive is part of a CodeCamper app while `acme-` may indicate a directive for the Acme company. 

    Note: Avoid `ng-` as these are reserved for AngularJS directives.Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/). 

### Restrict to Elements and Attributes

  - When creating a directive that makes sense as a standalone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when its standalone and as an attribute when it enhances its existing DOM element.

    *Why?*: It makes sense.

    *Why?*: While we can allow the directive to be used as a class, if the directive is truly acting as an element it makes more sense as an element or at least as an attribute.

    Note: EA is the default for AngularJS 1.3 +

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

  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    *Why?*: It makes sense and it's not difficult.

    Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place. 

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

**[Ir hacia arriba](#table-of-contents)**

## Resolving Promises for a Controller

### Controller Activation Promises

  - Resolve start-up logic for a controller in an `activate` function.
     
    *Why?*: Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    Note: If you need to conditionally cancel the route before you start use the controller, use a route resolve instead.
    
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

### Route Resolve Promises

  - When a controller depends on a promise to be resolved, resolve those dependencies in the `$routeProvider` before the controller logic is executed. If you need to conditionally cancel a route before the controller is activated, use a route resolver.

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

    Note: The code example's dependency on `movieService` is not minification safe on its own. For details on how to make this code minification safe, see the sections on [dependency injection](#manual-annotating-for-dependency-injection) and on [minification and annotation](#minification-and-annotation).

**[Ir hacia arriba](#table-of-contents)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.
  
    *Why?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by AngularJS.

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

  - Use `$inject` to manually identify your dependencies for AngularJS components.
  
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

  - Use $inject to manually identify your route resolver dependencies for AngularJS components.
  
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

**[Ir hacia arriba](#table-of-contents)**

## Minification and Annotation

### ng-annotate

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) and comment functions that need automated dependency injection using `/** @ngInject */`
  
    *Why?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

    *Why?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated 

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

        function storeHero(){
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

        function storeHero(){
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

  - Use [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) or [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. Inject `/* @ngInject */` prior to any function that has dependencies.
  
    *Why?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.

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

**[Ir hacia arriba](#table-of-contents)**

## Exception Handling

### decorators

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.
  
    *Why?*: Provides a consistent way to handle uncaught AngularJS exceptions for development-time or run-time.

    Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

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

  - Create a factory that exposes an interface to catch and gracefully handle exceptions.

    *Why?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

    Note: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a remote web service and you want to catch any exceptions from that service and react uniquely.

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

  - Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

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

**[Ir hacia arriba](#table-of-contents)**

## Naming

### Naming Guidelines

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    *   the file name (`avengers.controller.js`)
    *   the registered component name with Angular (`AvengersController`)
 
    *Why?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Why?*: The naming conventions should simply help you find your code faster and make it easier to understand. 

### Feature File Names

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`.

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

  - Name test specifications similar to the component they test with a suffix of `spec`.  

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

### Controller Names

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

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
    
### Controller Name Suffix

  - Append the controller name with the suffix `Controller` or with no suffix. Choose 1, not both.

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

### Factory Names

  - Use consistent names for all factories named after their feature. Use camel-casing for services and factories.

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

### Directive Component Names

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

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

### Modules

  -  When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named `admin.module.js`. The respective registered module names would be `app` and `admin`. A single module app might be named `app.js`, omitting the module moniker.

    *Why?*: An app with 1 module is named `app.js`. It is the app, so why not be super simple.
 
    *Why?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *Why?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *Why?*: Separates configuration from module definition, components, and active code.

    *Why?*: Provides a identifiable place to set configuration for a module.

### Routes

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration. An alternative is a longer name such as `admin.config.route.js`.

**[Ir hacia arriba](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT

  - Structure your app such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should follow these 4 basic guidelines. 

    *Why LIFT?*: Provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When I find my structure is not feeling comfortable, I go back and revisit these LIFT guidelines
  
    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

### Locate

  - Make locating your code intuitive, simple and fast.

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

### Identify

  - When you look at a file you should instantly know what it contains and represents.

    *Why?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *Why?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)

  - Be DRY, but don't go nuts and sacrifice readability.

    *Why?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it. 

**[Ir hacia arriba](#table-of-contents)**

## Application Structure

### Overall Guidelines

  -  Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app (`bower_components`, `scripts`, `lib`).

    Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions. 

    *Why?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed. 

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

**[Ir hacia arriba](#table-of-contents)**

## Modularity
  
### Many Small, Self Contained Modules

  - Create small modules that encapsulate one responsibility.

    *Why?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally.  This means we can plug in new features as we develop them.

### Create an App Module

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *Why?*: AngularJS encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Why?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

### Feature Areas are Modules

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Why?*: Self contained modules can be added to the application will little or no friction.

    *Why?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Why?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code. 

### Reusable Blocks are Modules

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Why?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

### Module Dependencies

  - The application root module depends on the app specific feature modules, the feature modules have no direct dependencies, the cross-application modules depend on all generic modules.

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-1.png)

    *Why?*: The main app module contains a quickly identifiable manifest of the application's features. 

    *Why?*: Cross application features become easier to share. The features generally all rely on the same cross application modules, which are consolidated in a single module (`app.core` in the image).

    *Why?*: Intra-App features such as shared data services become easy to locate and share from within `app.core` (choose your favorite name for this module).

    Note: This is a strategy for consistency. There are many good options here. Choose one that is consistent, follows AngularJS's dependency rules, and is easy to maintain and scale.

    > My structures vary slightly between projects but they all follow these guidelines for structure and modularity. The implementation may vary depending on the features and the team. In other words, don't get hung up on an exact like-for-like structure but do justify your structure using consistency, maintainability, and efficiency in mind. 

**[Ir hacia arriba](#table-of-contents)**

## Startup Logic

### Configuration
  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidaes include providers and constants.

    *Why?*: This makes it easier to have a less places for configuration.

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

  - Any code that needs to run when an application starts should be declared in a factory, exposed via a function, and injected into the [run block](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Why?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

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

**[Ir hacia arriba](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[Ir hacia arriba](#table-of-contents)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

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

### Testing Library

  - Use [Jasmine](http://jasmine.github.io/) or [Mocha](http://visionmedia.github.io/mocha/) for unit testing.

    *Why?*: Both Jasmine and Mocha are widely used in the AngularJS community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com).

### Test Runner

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Why?*: Karma is easy to configure to run once or automatically when you change your code.

    *Why?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Why?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Why?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (with [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing and Spying

  - Use Sinon for stubbing and spying.

    *Why?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Why?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

### Headless Browser

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Why?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server. 

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis

  - Run JSHint on your tests. 

    *Why?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`.

    *Why?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[Ir hacia arriba](#table-of-contents)**

## Animations

### Usage

  - Use subtle [animations with AngularJS](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Why?*: Subtle animations can improve User Experience when used appropriately.

    *Why?*: Subtle animations can improve perceived performance as views transition.

### Sub Second

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.  

    *Why?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Why?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Why?*: Provides consistency in your animations.

    *Why?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on AngularJS animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Ir hacia arriba](#table-of-contents)**

## Comments

### jsDoc

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *Why?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Why?*: Provides consistency using a common industry tool.

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

**[Ir hacia arriba](#table-of-contents)**

## JS Hint

### Use an Options File

  - Use JS Hint for linting your JavaScript and be sure to customize the JS Hint options file and include in source control. See the [JS Hint docs](http://www.jshint.com/docs/) for details on the options.

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

**[Ir hacia arriba](#table-of-contents)**

## Constants

### Vendor Globals

  - Create an AngularJS Constant for vendor libraries' global variables.

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

**[Ir hacia arriba](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text

  - AngularJS snippets that follow these styles and guidelines. 

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

### Visual Studio

  - AngularJS file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm

  - AngularJS snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

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

**[Ir hacia arriba](#table-of-contents)**

## Documentación de AngularJS
Para algo más, referencias de la API, échale un ojo a la [documentación de Angular](//docs.angularjs.org/api).

## Colaboraciones

Primero abre un issue para discutir cambios/adiciones potenciales. Si tienes consultas acerca de la guía, siéntete libre de dejarlas como un issue en el repositorio. Si encuentras un error tipográfico, crea un pull request. La idea es mantener el contenido actualizado y usar las características nativas de github para ayudar a contar la historia con los issues y los pull requests, estos son completamente «buscables» vía google. ¿Por qué? porque las probabilidades indican de que si tienes una consulta, ¡alguien más la tendrá también! puedes aprender más aquí acerca de cómo colaborar.

*Para colaborar con este repositorio debes estar de acuerdo con que tu contenido disponible sea sujeto a la licencia de este repositorio.*

### Proceso
    1. Discute el cambio en un Issue. 
    1. Abre un Pull Request, referencia el issue, y explica el cambio así como el por qué éste agrega valor.
    1. El Pull Request será evaluado y posteriormente integrado o rechazado.

## Licencia

_tldr; Usa esta guía. Las atribuciones son apreciadas._

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

**[Ir hacia arriba](#table-of-contents)**
