# Guia de Estilo AngularJS

*Guia de Estilo opinativo de Angular para times. Por [@john_papa](//twitter.com/john_papa)*

Se você procura por um guia de estilo opinativo para sintaxe, convenções e estruturação de aplicações AngularJS, então siga em frente! Estes estilos são baseados em minha experiência com desenvolvimento com [AngularJS](//angularjs.org), apresentações, [cursos de treinamento na Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) e trabalhando em equipe.



> Se você gostar deste guia, confira meu curso [Angular Patterns: Clean Code](http://jpapa.me/ngclean) na Pluralsight.

A proposta deste guia de estilo é fornecer uma direção na construção de aplicações Angular mostrando convenções que eu uso, e o mais importante, porque eu as escolhi.

## A Importância da Comunidade e Créditos

Nunca trabalhe sozinho. Acho que a comunidade Angular é um grupo incrível, apaixonado em compartilhar experiências. Dessa forma, Todd Motto, um amigo e expert em Angular e eu temos colaborado com vários estilos e convenções. Nós concordamos na maioria deles, e discordamos em alguns. Eu encorajo você a conferir o [guia do Todd](https://github.com/toddmotto/angularjs-styleguide) para ter uma noção sobre sua abordagem e como ela se compara a esta.

Vários de meus estilos vieram de várias sessões de pair-programming (programação pareada) que [Ward Bell](http://twitter.com/wardbell) e eu tivemos. Embora não concordemos sempre, meu amigo Ward certamente me ajudou influenciando na última evolução deste guia.

## Veja os estilos em um aplicativo de exemplo

Embora este guia explique o **o quê**, **porque** e **como**, acho útil ver tudo isso em prática. Este guia é acompanhado de uma aplicação de exemplo que segue estes estilos e padrões. Você pode encontrar a [aplicação de exemplo (chamada "modular") aqui](https://github.com/johnpapa/ng-demos) na pasta `modular`. Sinta-se livre para pegá-la, cloná-la e *forká-la*. [Instruções de como rodar o aplicativo estão em seu README](https://github.com/johnpapa/ng-demos/tree/master/modular).

> **Nota de tradução**: Os títulos originais de cada seção serão mantidos, pois caso você queira buscar mais sobre estes assuntos futuramente, fazendo tal busca em inglês será obtido um resultado **imensamente** melhor.
>
> Após o título, estará a tradução auxiliar, quando necessária, visto que alguns termos são mais facilmente entendidos quando não traduzidos, por fazerem parte do núcleo do estudo em questão.
>
> Para eventuais erros de digitação e/ou tradução, favor enviar um pull-request!

## Tabela de Conteúdo

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
  1. [Angular $ Wrapper Services](#angular--wrapper-services)
  1. [Testing](#testing)
  1. [Animations](#animations)
  1. [Comments](#comments)
  1. [JSHint](#js-hint)
  1. [Constants](#constants)
  1. [File Templates and Snippets](#file-templates-and-snippets)
  1. [Angular Docs](#angularjs-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Single Responsibility
ou *Responsabilidade Única*

### Regra nº 1

  - Defina um componente por arquivo.

  O exemplo seguinte define um módulo `app` e suas dependências, define um controller e define uma factory, todos no mesmo arquivo.

  ```javascript
  /* evite */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  Os mesmos componentes agora estão separados em seus próprios arquivos.

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## IIFE
### JavaScript Closures

  - Envolva os componentes Angular em uma *Immediately Invoked Function Expression (IIFE - Expressão de função imediatamente invocada)*.

  **Por que?** Uma IIFE remove as variáveis do escopo global. Isso ajuda a prevenir declarações de variáveis e funções de viverem por mais tempo que o esperado no escopo global, que também auxilia evitar colisões de variáveis.

  **Por que?** Quando seu código é minificado e empacotado dentro de um único arquivo para *deployment* no servidor de produção, você pode ter conflitos de variáveis e muitas variáveis globais. Uma IIFE o protege em todos estes aspectos provendo escopo de variável para cada arquivo.

  ```javascript
  /* evite */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // função logger é adicionada como uma variável global
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // função storage é adicionada como uma variável global
  function storage() { }
  ```


  ```javascript
  /**
   * recomendado
   *
   * nada global é deixado para trás
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

  - **Nota**: Apenas para agilizar, o resto dos exemplos neste guia omitirão a sintaxe IIFE.

  - **Nota**: IIFE impede que códigos de teste alcancem membros privados como expressões regulares ou funções auxiliares que são frequentemente boas para testes unitários. Entretanto, você pode testá-las através de membros acessíveis ou expondo-os pelo próprio componente. Por exemplo, colocando funções auxiliares, expressões regulares ou constantes em sua própria *factory* ou constante.

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Modules
ou *Módulos*

### Avoid Naming Collisions
ou *Evitando Colisão de Nomes*

  - Use uma única convenção de nomes com separadores para sub-módulos.

  **Por que?** Nomes únicos ajudam a evitar colisão de nomes no módulo. Separadores ajudam a definir a hierarquia de módulos e submódulos. Por exemplo, `app` pode ser seu módulo raiz, enquanto `app.dashboard` e `app.users` podem ser módulos que são usados como dependências de `app`.

### Definições (*aka Setters*)

> ps: **aka** é o acrônimo de **A**lso **K**nown** **A**s, de forma traduzida, **também conhecido como**.

  - Declare os módulos sem uma variável usando a sintaxe *setter*.

  **Por que?** Com 1 componente por arquivo, raramente será necessário criar uma variável para o módulo.

  ```javascript
  /* evite */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Ao invés, use a simples sintaxe *setter*.

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

### *Getters*

  - Quando usando um módulo, evite usar uma variável. Em vez disso, use encadeamento com a sintaxe *getter*.

  **Por que?** Isso produz um código mais legível e evita colisão de variáveis ou vazamentos.

  ```javascript
  /* evite */
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

### *Setting* vs *Getting*
ou *Definindo* vs *Obtendo*

  - Apenas *set* (configure) uma vez e *get* (receba) em todas as outras instâncias.

  **Por que?** Um módulo deve ser criado somente uma vez, então recupere-o deste ponto em diante.

	  - Use `angular.module('app', []);` para definir (*set*) um módulo.
	  - Use  `angular.module('app');` para pegar (*get*) este módulo.

### Named vs Anonymous Functions
ou *Funções Nomeadas vs Funções Anônimas*

  - Use funções nomeadas ao invés de passar uma função anônima como um callback.

  **Por que?** Isso produz um código mais legível, é muito fácil de *debugar*, e reduz a quantidade de callbacks aninhados no código.

  ```javascript
  /* evite */
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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Controllers
ou *Controladores*

### controllerAs View Syntax

  - Utilize a sintaxe [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) ao invés da sintaxe `clássica controller com $scope`.

	**Por que?**: Controllers são construídos, "iniciados", e fornecem um nova instância única, e a sintaxe `controllerAs` é mais próxima de um construtor JavaScript do que a `sintaxe clássica do $scope`.

	**Por que?**: Isso promove o uso do binding de um objeto "pontuado", ou seja, com propriedades na View (ex. `customer.name` ao invés de `name`), que é mais contextual, legível, e evita qualquer problema com referências que podem ocorrer sem a "pontuação"

	**Por que?**: Ajuda a evitar o uso de chamadas ao `$parent` nas Views com controllers aninhados.

  ```html
  <!-- evite -->
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

  - Utilize a sintaxe `controllerAs` ao invés da sintaxe `clássica controller com $scope`.

  - A sintaxe `controllerAs` usa o `this` dentro dos controllers que fica ligado ao `$scope`.

  **Por que?**: O `controllerAs` é uma forma mais simples de lidar com o `$scope`. Você ainda poderá fazer o bind para a View e ainda poderá acessar os métodos do `$scope`.

  **Por que?**: Ajuda a evitar a tentação de usar os métodos do `$scope` dentro de um controller quando seria melhor evitá-los ou movê-los para um factory. Considere utilizar o  `$scope` em um factory, ou em um controller apenas quando necessário. Por exemplo, quando publicar e subscrever eventos usando [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), ou [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) considere mover estes casos para um factory e invocá-los a partir do controller.

  ```javascript
  /* evite */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* recomendado - mas veja a próxima sessão */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### controllerAs with vm

  - Utilize uma variável de captura para o `this` quando usar a sintaxe `controllerAs`. Escolha um nome de variável consistente como `vm`, que representa o ViewModel.

  **Por  que?**: A palavra-chave `this` é contextual e quando usada em uma função dentro de um controller pode mudar seu contexto. Capturando o contexto do `this` evita a ocorrência deste problema.

  ```javascript
  /* evite */
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

  Nota: Você pode evitar qualquer [jshint](http://www.jshint.com/) warnings colocando o comentário abaixo acima da linha de código.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

 Nota: Quando watches são criados no controller utilizando o `controller as`, você pode observar o objeto `vm.*` utilizando a seguinte sintaxe. (Crie watches com cuidado pois eles deixam o ciclo de digest mais "carregado".)

  ```javascript
  $scope.$watch('vm.title', function(current, original) {
      $log.info('vm.title was %s', original);
      $log.info('vm.title is now %s', current);
  });
  ```

### Bindable Members Up Top

  - Coloque os objetos que precisam de bind no início do controller, em ordem alfabética, e não espalhados através do código do controller.

    **Por que?**: Colocar os objetos que precisam de bind no início torna mais fácil de ler e te ajuda a instantaneamente identificar quais objetos do controller podem ser utilizados na View.

    **Por que?**: Setar funções anônimas pode ser fácil, mas quando essas funções possuem mais de 1 linha do código elas podem dificultar a legibilidade. Definir as funções abaixo dos objetos que necessitam de bind (as funções serão elevadas pelo JavaScript Hoisting) move os detalhes de implementação para o final do controller, mantém os objetos que necessitam de bind no topo, e deixa o código mais fácil de se ler.

  ```javascript
  /* evite */
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

   Nota: Se a função possuir apenas 1 linha considere mantê-la no topo, desde que a legibilidade não seja afetada.

  ```javascript
  /* evite */
  function Sessions(data) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = function() {
          /**
           * linhas
           * de
           * código
           * afetam
           * a
           * legibilidade
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
      vm.refresh = dataservice.refresh; // 1 linha está OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Function Declarations to Hide Implementation Details

  - Utilize declarações de funções para esconder detalhes de implementação. Mantenha seus objetos que necessitam de bind no topo. Quando você precisar fazer o bind de uma função no controller, aponte ela para a declaração de função que aparece no final do arquivo. Ela está ligada diretamente aos objetos que precisam de bind no início do arquivo. Para mais detalhes veja [este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    **Por que?**: Colocar os objetos que precisam de bind no início torna mais fácil de ler e te ajuda a instantaneamente identificar quais objetos do controller podem ser utilizados na View. (Mesmo do item anterior.)

    **Por que?**: Colocar os detalhes de implementação de uma função no final do arquivo coloca a complexidade fora do foco, logo, você pode focar nas coisas importantes no topo.

    **Por que?**: Declarações de funções são içadas, logo, não existe problema de se utilizar uma função antes dela ser definida (como haveria com expressões de função).

    **Por que?**: Você nunca precisará se preocupar com declarações de funções quebrarem seu código por colocar `var a` antes de `var b` por que `a` depende de `b`.

    **Por que?**: A ordenação é crítica em expressões de função.

  ```javascript
  /**
   * evite
   * Usar expressões de funções.
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

  Note-se que as coisas importantes estão espalhadas no exemplo anterior. No exemplo abaixo, nota-se que as coisas importantes do javascript estão logo no topo. Por exemplo, os objetos que precisam de bind no controller como `vm.avengers` e `vm.title`. Os detalhes de implementação estão abaixo. Isto é mais fácil de ler.

  ```javascript
  /*
   * recomendado
   * Usar declarações de funções
   * e objetos que precisam de bind no topo.
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

  - Remova a lógica do controller delegando ela a services e factories.

    **Por que?**: A lógica pode ser reutilizada em múltiplos controllers quando colocada em um service e exposta através de uma função.

    **Por que?**: A lógica em um serviço pode ser mais facilmente isolada em um teste unitário, enquanto a lógica feita no controlador pode ser facilmente [mockada](http://www.thoughtworks.com/pt/insights/blog/mockists-are-dead-long-live-classicists).

    **Por que?**: Remove as dependências e esconde os detalhes de implementação do controlador.

  ```javascript
  /* evite */
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

### Keep Controllers Focused

  - Defina um controller para a view, e tente não reutilizar o controller para outras views. Ao invés disso, coloque as lógicas reaproveitáveis em factories e mantenha o controller simples e focado em sua view.

    **Por que?**: Reutilizar controllers em várias views é arriscado e um boa cobertura de testes end to end (e2e) é obrigatório para se garantir estabilidade em grandes aplicações.

### Assigning Controllers

  - Quando um controller deve ser pareado com sua view e algum componente pode ser reutilizado por outros controllers ou views, defina controllers juntamente de suas rotas.

    Nota: Se uma View é carregada de outra forma que não seja através de uma rota, então utilize a sintaxe `ng-controller="Avengers as vm"`.

    **Por que?**: Parear os controllers nas rotas permite diferentes rotas invocarem diferentes pares de controllers e views. Quando um controller é utilizado na view usando a sintaxe [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), esta view sempre será associada ao mesmo controller.

 ```javascript
  /* evite - quando utilizar com uma rota e emparelhamento dinâmico é desejado */

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Services
ou *Serviços*

### Singletons

  - Services são instanciados com a palavra-chave `new`, use `this` para métodos públicos e variáveis. Services são bastante similares a factories, use um factory para consistência.

    Nota: [Todos services em Angular são singletons](https://docs.angularjs.org/guide/services). Isso significa que há apenas uma instância do serviço para cada injetor.

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Factories
ou *Fábricas*

### Single Responsibility
ou *Responsabilidade Única*

  - Factories devem ter [responsabilidade única](http://en.wikipedia.org/wiki/Single_responsibility_principle), que é encapsulado pelo seu contexto. Assim que uma factory começa a exceder a proposta de singularidade, uma nova factory deve ser criada.

### Singletons

  - Factories são singletons e retornam um objeto que contém os membros do serviço.

    Nota: [Todos services em Angular são singletons](https://docs.angularjs.org/guide/services).

### Accessible Members Up Top
ou *Membros acessíveis no topo*

  - Exponha os membros que podem ser invocados no serviço (a interface) no topo, utilizando uma técnica derivada do [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

    **Por que?**: Colocando no topo os membros que podem ser invocados da factory, a leitura torna-se mais fácil e ajuda a identificar imediatamente quais membros da factory podem ser invocados e testados através de teste unitário (e/ou mock).

    **Por que?**: É especialmente útil quando o arquivo torna-se muito longo e ajuda a evitar a necessidade de rolagem para ver o que é exposto.

    **Por que?**: Definir as funções conforme você escreve o código pode ser fácil, mas quando essas funções tem mais que 1 linha de código, elas podem reduzir a leitura e causar rolagem. Definir a interface no topo do que pode ser invocado da factory, torna a leitura mais fácil e mantém os detalhes de implementação mais abaixo.

  ```javascript
  /* evite */
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

  Dessa forma, os bindings são espelhados através do objeto da interface da factory e os valores primitivos não podem ser atualizados sozinhos utilizando o revealing module pattern

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Function Declarations to Hide Implementation Details
ou *Declarações de função para esconder detalhes de implementação*

  - Use function declarations (declarações de função) para esconder detalhes de implementação. Mantenha os membros acessíveis da factory no topo. Aponte as function declarations que aparecem posteriormente no arquivo. Para mais detalhes leia [esse post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

    **Por que?**: Colocando os membros acessíveis no topo, a leitura torna-se mais fácil e ajuda a identificar imediatamente quais membros da factory podem ser acessados externamente.

    **Por que?**: Colocando os detalhes de implementação da função posteriormente no arquivo move a complexidade para fora da visão, permitindo que você veja as coisas mais importantes no topo.

    **Por que?**: Function declarations (declarações de função) são içadas (hoisted) para que não hajam preocupações em utilizar uma função antes que ela seja definida (como haveria com function expressions (expressões de função)).

    **Por que?**: Você nunca deve se preocupar com function declaration (declarações de função) onde `var a` está antes de `var b` vai ou não quebrar o seu código porque `a` depende de `b`.

    **Por que?**: A ordem é crítica com function expressions (expressões de função)

  ```javascript
  /**
   * evite
   * Utilizando function expressions (expressões de função)
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
         // detalhes de implementação
      };

      var getAvengerCount = function() {
          // detalhes de implementação
      };

      var getAvengersCast = function() {
         // detalhes de implementação
      };

      var prime = function() {
         // detalhes de implementação
      };

      var ready = function(nextPromises) {
          // detalhes de implementação
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
   * Utilizando function declarations (declarações de função)
   * e membros acessíveis no topo.
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
         // detalhes de implementação
      }

      function getAvengerCount() {
          // detalhes de implementação
      }

      function getAvengersCast() {
         // detalhes de implementação
      }

      function prime() {
          // detalhes de implementação
      }

      function ready(nextPromises) {
          // detalhes de implementação
      }
  }
  ```

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Data Services
ou *Serviços de dados*

### Separate Data Calls
ou *Chamadas de dados separadas*

  - A lógica de refatoração (refactor) para operações com dados e interação com dados na factory. Faça serviços de dados responsáveis por chamadas XHR, armazenamento local (local storage), armazenamento em memória (stashing) ou outras operações com dados.

    **Por que?**: A responsabilidade dos controladores (controllers) é para a apresentação e coleta de informações da view. Eles não devem se importar como os dados são adquiridos, somente como "perguntar" por eles. Separar os serviços de dados (data services), move a lógica de como adquiri-los para o serviço e deixa o controlador (controller) mais simples e focado na view.

    **Por que?**: Isso torna mais fácil testar (mock ou real) as chamadas de dados quando estiver testando um controlador (controller) que utiliza um serviço de dados (data service).

    **Por que?**: A implementação de um serviço de dados (data service) pode ter um código bem específico para lidar com o repositório de dados. Isso pode incluir cabeçalhos (headers), como comunicar com os dados ou outros serviços, como $http. Separando a lógica de dados em um serviço, coloca toda a lógica somente em um local e esconde a implementação de consumidores de fora (talvez um controlador (controller)), tornado mais fácil mudar a implementação.

  ```javascript
  /* recomendado */

  // factory de serviço de dados (data service factory)
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

    Nota: O serviço de dados (data service) é chamado pelos consumidores, como um controlador (controller), escondendo a implementação dos consumidores, como mostrado abaixo.

  ```javascript
  /* recomendado */

  // controlador chamando uma factory de serviço de dados
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
ou *Retorne uma promessa de chamadas de dados*

  - Quando chamar um serviço de dados (data service) que retorna uma promessa (promise), como o $http, retorne uma promessa (promise) na função que está chamando também.

    **Por que?**: Você pode encandear as promessas (promises) juntas e definir ações após a promessa (promise) da chamada do dado ser completada, resolvendo ou rejeitando a promessa (promise).

  ```javascript
  /* recomendado */

  activate();

  function activate() {
      /**
       * Passo 1
       * Chame a função getAvengers para os dados
       * dos vingadores (avengers) e espere pela promessa (promise)
       */
      return getAvengers().then(function() {
          /**
           * Passo 4
           * Faça uma ação resolvendo a promessa (promise) finalizada
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * Passo 2
         * Chame o serviço de dados (data service) e espere
         * pela promessa (promise)
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * Passo 3
                 * Atribua os dados e resolva a promessa (promise)
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

    **[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Directives
ou *Diretivas*

### Limit 1 Per File
ou *Limite 1 por arquivo*

  - Crie uma diretiva (directive) por arquivo. Nomeie o arquivo pela diretiva.

    **Por que?**: É fácil misturar todas as diretivas em um arquivo, mas é difícil depois separá-las, já que algumas são compartilhadas entre aplicativos, outras pelos módulos (modules) e algumas somente para um módulo.

    **Por que?**: Uma diretiva (directive) por arquivo é mais fácil de dar manutenção.

  ```javascript
  /* evite */
  /* directives.js */

  angular
      .module('app.widgets')

      /* diretiva de pedido (order) que é específica para o módulo de pedido */
      .directive('orderCalendarRange', orderCalendarRange)

      /* diretiva de vendas (sales) que pode ser usada em qualquer lugar do aplicativo de vendas */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* diretiva de spinner que pode ser usada em qualquer lugar dos aplicativos */
      .directive('sharedSpinner', sharedSpinner);


  function orderCalendarRange() {
      /* detalhes de implementação */
  }

  function salesCustomerInfo() {
      /* detalhes de implementação */
  }

  function sharedSpinner() {
      /* detalhes de implementação */
  }
  ```

  ```javascript
  /* recomendado */
  /* calendarRange.directive.js */

  /**
   * @desc diretiva de pedido (order) que é específica para o módulo de pedido em uma companhia chamada Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* detalhes de implementação */
  }
  ```

  ```javascript
  /* recomendado */
  /* customerInfo.directive.js */

  /**
   * @desc diretiva de spinner que pode ser usada em qualquer lugar de um aplicativo de vendas em uma companhia chamada Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* detalhes de implementação */
  }
  ```

  ```javascript
  /* recomendado */
  /* spinner.directive.js */

  /**
   * @desc diretiva de spinner que pode ser usada em qualquer lugar de aplicativo em uma companhia chamada Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* detalhes de implementação */
  }
  ```

    Nota: Há diferentes opções de nomear diretivas (directives), especialmente quando elas podem ser usadas em escopos (scopes) variados. Escolha uma que faça a diretiva e o nome do arquivo distinto e simples. Alguns exemplos são mostrados abaixo, mas veja a seção de nomeação para mais recomendações.

### Limit DOM Manipulation
ou *Limite a manipulação do DOM*

  - Quando estiver manipulando o DOM diretamente, utilize uma diretiva (directive). Se formas alternativas podem ser utilizadas, como: utilizar CSS para setar estilos ou [serviços de animação (animation services)](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) ou [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), então prefira utilizá-los. Por exemplo, se uma diretiva simplesmente esconde ou mostra um elemento, use ngHide/ngShow.

    **Por que?**: A manipulação do DOM pode ser difícil de testar, debugar, e há melhores maneiras (ex: CSS, animações (animations), templates).

### Provide a Unique Directive Prefix
ou *Forneça um prefixo único para as diretivas*

  - Forneça um curto, único e descritivo prefixo para a diretiva, como `acmeSalesCustomerInfo`, que é declarado no HTML como `acme-sales-customer-info`.

    **Por que?**: Um prefixo curto e único identifica o contexto e a origem da diretiva. Por exemplo, o prefixo `cc-` pode indicar que a diretiva é parte de um aplicativo da CodeCamper, enquanto a diretiva `acme-` pode indicar uma diretiva para a companhia Acme.

    Nota: Evite `ng-`, pois são reservadas para as diretivas do AngularJS. Pesquise largamente as diretivas utilizadas para evitar conflitos de nomes, como `ion-` que são utilizadas para o [Ionic Framework](http://ionicframework.com/).

### Restrict to Elements and Attributes
ou *Restringir para elementos e atributos*

  - Quando criar uma diretiva que faça sentido por si só como um elemento, utilize restrição `E` (elemento personalizado) e opcionalmente `A` (atributo personalizado). Geralmente, se ela pode ter o seu próprio controlador (controller), `E` é o apropriado. Em linhas gerais, `EA` é permitido, mas atente para a implementação como elemento quando faz sentido por si só e como atributo quando estende algo existente no DOM.

    **Por que?**: Faz sentido.

    **Por que?**: Nós podemos utilizar uma diretiva como uma classe (class), mas se a diretiva está realmente agindo como um elemento, faz mais sentido utilizar como um elemento, ou pelo menos como um atributo.

    Nota: EA é o padrão para o Angular 1.3 +

  ```html
  <!-- evite -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* evite */
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
ou *Diretivas e "ControladorComo"*

  - Utilize a sintaxe `controller as` com uma diretiva para consistência com o uso de `controller as` com os pares view e controlador (controller).

    **Por que?**: Faz sentido e não é difícil.

    Nota: A diretiva (directive) abaixo demonstra algumas maneiras que você pode utilizar escopos (scopes) dentro de link e controller de uma diretiva, utilizando controllerAs. Eu coloquei o template somente para manter tudo em um mesmo local.

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
          // Injetando $scope somente para comparação
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
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Resolving Promises for a Controller
ou *Resolvendo promessas para um controlador*

### Controller Activation Promises
ou *Ativação de promessas no controlador*

  - Resolva a lógica de inicialização no controlador (controller) em uma função `iniciar`.

    **Por que?**: Colocando a lógica de inicialização em um lugar consistente no controlador (controller), torna mais fácil de localizar, mais consistente para testar e ajuda a evitar o espalhamento da lógica de inicialização pelo controlador (controller).

    Nota: Se vocẽ precisa cancelar a rota condicionalmente antes de utilizar o controlador (controller), utilize uma resolução de rota (route resolve).

  ```javascript
  /* evite */
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

      iniciar();

      ////////////

      function iniciar() {
          return dataservice.getAvengers().then(function(data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
  }
  ```

### Route Resolve Promises
ou *Resolução de promessas na rota*

  - Quando o controlador (controller) depende de uma promessa ser resolvida, resolva as dependências no `$routeProvider` antes da lógica do controlador (controller) ser executada. Se vocẽ precisa cancelar a rota condicionalmente antes do controlador (controller) ser ativado, utilize uma resolução de rota (route resolve).

    **Por que?**: Um controlador (controller) pode precisar de dados antes de ser carregado. Esses dados podem vir de uma promessa (promise) através de uma factory personalizada ou [$http](https://docs.angularjs.org/api/ng/service/$http). Utilizar [resolução de rota (route resolve)](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) permite as promessas (promises) serem resolvidas antes da lógica do controlador (controller) ser executada, então ele pode executar ações através dos dados dessa promessa (promise).

  ```javascript
  /* evite */
  angular
      .module('app')
      .controller('Avengers', Avengers);

  function Avengers(movieService) {
      var vm = this;
      // não resolvida
      vm.movies;
      // resolvida assíncrona
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }
  ```

  ```javascript
  /* melhor */

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

    Nota: As dependências no código de exemplos do `movieService` não estão seguras para minificação. Para mais detalhes de como fazer o código seguro para minificação, veja as seções [injeção de dependência (dependency injection)](#manual-annotating-for-dependency-injection) e [minificação e anotação (minification and annotation)](#minification-and-annotation).

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Manual Annotating for Dependency Injection
ou *Anotação Manual para Injeção de Dependência*

### UnSafe for Minification
ou *Não seguro para Minificação*

  - Evite usar o atalho de sintaxe de declarar dependências sem usar uma abordagem segura para minificação.

    **Por que?**: Os parâmetros do componente (por ex. controller, factory, etc) serão convertidos em variáveis encurtadas. Por exemplo, `common` e `dataservice` podem virar `a` ou `b` e não serem encontrados pelo AngularJS.

    ```javascript
    /* evite - não seguro para minificação*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Este código pode produzir variáveis encurtadas quando minificado e, assim, causar erro em tempo de execução.

    ```javascript
    /* evite - não seguro para minificação*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
ou *Identifique Dependências Manualmente*

  - Use `$inject` para identificar manualmente suas dependências de componentes do AngularJS.

    **Por que?**: Esta técnica espelha a técnica usada por [`ng-annotate`](https://github.com/olov/ng-annotate), a qual eu recomendo para automatizar a criação de dependências seguras para minificação. Se `ng-annotate` detectar que a injeção já foi feita, ela não será duplicada.

    **Por que?**: Isto salvaguarda suas dependências de serem vulneráveis a problemas de minificação quando parâmetros podem ser encurtados. Por exemplo, `common` e `dataservice` podem se tornar `a` ou `b` e não serem encontrados pelo AngularJS.

    **Por que?**: Evite criar dependências in-line pois listas longas podem ser difíceis de ler no array. Além disso, pode ser confuso o array ser uma série de strings enquanto o último item é a função do componente.

    ```javascript
    /* evite */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* evite */
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

    Nota: Quando sua função estiver abaixo de um return o $inject pode ficar inacessível (isso pode acontecer em uma diretiva). Você pode resolver isso movendo o $inject para acima do return ou usando a sintaxe alternativa de injeção de array.

    Nota: [`ng-annotate 0.10.0`](https://github.com/olov/ng-annotate) introduziu um comportamento em que ele move o `$inject` para onde ele possa ser acessado.

    ```javascript
    // dentro da definição de diretiva
    function outer() {
        return {
            controller: DashboardPanel,
        };

        DashboardPanel.$inject = ['logger']; // inacessível
        function DashboardPanel(logger) {
        }
    }
    ```

    ```javascript
    // dentro da definição de diretiva
    function outer() {
        DashboardPanel.$inject = ['logger']; // acessível
        return {
            controller: DashboardPanel,
        };

        function DashboardPanel(logger) {
        }
    }
    ```

### Manually Identify Route Resolver Dependencies
ou *Identifique Dependências do Resolvedor de Rotas Manualmente*

  - Use $inject para identificar manualmente as dependências do seu resolvedor de rotas para componentes do AngularJS.

    **Por que?**: Esta técnica separa a função anônima do resolvedor de rota, tornando-a mais fácil de ler.

    **Por que?**: Uma chamada a `$inject` pode facilmente preceder o resolvedor para fazer qualquer dependência segura para minificação.

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

    moviePrepService.$inject =  ['movieService'];
    function moviePrepService(movieService) {
        return movieService.getMovies();
    }
    ```

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Minification and Annotation
ou *Minificação e Anotação*

### ng-annotate

  - Use [ng-annotate](//github.com/olov/ng-annotate) para [Gulp](http://gulpjs.com) ou [Grunt](http://gruntjs.com) e comente as funções que precisam de injeção de dependência automatizada usando `/** @ngInject */`

    **Por que?**: Isso protege seu código de qualquer dependência que pode não estar usando práticas seguras para minificação.

    **Por que?**: [`ng-min`](https://github.com/btford/ngmin) está deprecated.

    > Eu prefiro Gulp pois sinto que é mais fácil de escrever, de ler, e de debugar.

    O código a seguir não está usando dependências seguras para minificação.

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

    Quando o código acima é executado através de ng-annotate produzirá a seguinte saída com a anotação `$inject` e se tornará seguro para minificação.

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

    Nota: Se `ng-annotate` detectar que a injeção já foi feita (por ex. `@ngInject` foi detectado), o código do `$inject` não será duplicado.

    Nota: Quando usar um resolvedor de rotas você pode prefixar a função do resolvedor com `/* @ngInject */` o que produzirá código devidamente anotado, mantendo qualquer dependência injetada segura para minificação.

    ```javascript
    // Usando anotação @ngInject
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

    > Nota: A partir do Angular 1.3 use o parâmetro `ngStrictDi` da diretiva  [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp). Quando presente, o injetor será criado no modo "strict-di" fazendo com que a aplicação falhe ao tentar invocar funções que não usem anotação explícita de função (elas podem não ser seguras para minificação). Informação de debug será logada no console para ajudar a rastrear o código ofensivo.
    `<body ng-app="APP" ng-strict-di>`

### Utilize Gulp ou Grunt para o ng-annotate

  - Utilize [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) ou [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) para tarefas de build automatizadas. Injete `/* @ngInject */` antes de qualquer função que tenha dependências.

    **Por que?**: ng-annotate vai capturar todas as dependências, mas as vezes requer dicas utilizando a sintaxe `/* @ngInject */` .

    O código abaixo é um exemplo de uma task Gulp utilizando ngAnnotate

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Exception Handling
ou *Tratamento de exceção*

### decorators
ou *decoradores*

  - Utilize um [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), no seu config utilizando o serviço [`$provide`](https://docs.angularjs.org/api/auto/service/$provide), no serviço [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) para realizar ações customizadas quando um erro ocorrer.

    **Por que?**: Fornece um caminho consistente para manipular erros não tratados pelo Angular em tempo de desenvolvimento ou execução (run-time).

    Nota: Outra opção é sobrescrever o serviço ao invés de utilizar um decorator. Esta é uma boa opção, mas se você quer manter o comportamento padrão e estender, o decorator é recomendado.

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
             * Pode adicionar o erro para um serviço de coleções,
             * adicionar os erros no $rootScope, logar os erros em um servidor remoto
             * ou logar localmente. Ou lançar a exceção. Isso cabe interiamente à você.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  	```

### Exception Catchers
ou *Coletores de exceção*

  - Criar um factory que expôe uma interface para capturar e tratar adequadamente as exceções.

    **Por que?**: Fornece uma forma consistente de coletar exceções que podem ser lançadas no seu código (ex. durante uma chamada XHR ou uma promessa (promise) que falhou).

    Nota: O coletor de exceção é bom para coletar e reagir às exceções específicas das chamadas que você sabe que podem ser lançadas. Por exemplo, quando realizar uma chamada XHR que retorna dados de um serviço remoto e você quer coletar qualquer exceção desse serviço, reagindo de uma maneira única.

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

  - Gerencie e log todos os erros de routing utilizando o [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    **Por que?**: Fornece uma maneira consistente de gerenciar erros relacionados a routing.

    **Por que?**: Potencialmente fornece uma melhor experiência de usuário se um erro de routing ocorrer e você redirecionar o usuário para uma tela amigável com mais detalhes ou opções de recuperação.

    ```javascript
    /* recomendado */
    function handleRoutingErrors() {
        /**
         * Cancelamento de rota:
         * Quando houver erro no roteamento, vá para o dashboard.
         * Forneça uma cláusula de saída se ele tentar fazer isso 2 vezes.
         */
        $rootScope.$on('$routeChangeError',
            function(event, current, previous, rejection) {
                var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                /**
                 * Opcionalmente log usando um serviço customizado ou $log.
                 * (Não se esqueça de injetar o serviço customizado)
                 */
                logger.warning(msg, [current]);
            }
        );
    }
    ```

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Naming
ou *Nomenclatura*

### Diretrizes de Nomenclatura

  - Use nomes consistentes para todos os componentes seguindo um padrão que descreva a funcionalidade do componente e (opcionalmente) seu tipo. Meu padrão recomendado é `característica.tipo.js`. Existem dois nomes para a maioria dos componentes:
  	* o nome do arquivo (`avengers.controllers.js`)
  	* o nome de componente registrado pelo Angular (`AvengersController`)

	**Por que?**: As convenções de nomenclatura ajudam a fornecer uma maneira consistente de encontrar algo à primeira vista. Consistência dentro do projeto é vital. Consistência dentro de um time é importante. Consistência em toda a empresa proporciona uma enorme eficiência.

    **Por que?**: As convenções de nomenclatura deveriam simplesmente te ajudar a encontrar trechos do seu código mais rápido e torná-lo mais fácil de se entender.

### Feature File Names
ou *Nome para funcionalidades*

  - Use nomes consistentes para todos os componentes seguindo um padrão que descreve a funcionalidade do componente e, em seguida, (opcionalmente) o seu tipo. Meu padrão recomendado é  `feature.type.js`.

    *Por que?*: Fornece uma maneira consistente para identificar componentes mais rapidamente.

     *Por que?*: Fornece um padrão apropriado pra qualquer tarefa automatizada.

    ```javascript
    /**
     * opções comuns
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
     * recomendado
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

  Nota: Outra convenção comum é nomear arquivos dos controllers sem a palavra `controller` no nome do arquivo como` avengers.js` em vez de `avengers.controller.js`. Todas as outras convenções ainda mantêm o uso de um sufixo do tipo. Controllers são o tipo mais comum de componente, portanto isso só economiza digitação e ainda é facilmente identificável. Eu recomendo que você escolha uma convenção que seja mais coerente para sua equipe.

    ```javascript
    /**
     * recomendado
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Test File Names
ou *Nome para aquivos de testes*

  - Nomeie as especificações de testes de forma similar aos componentes que elas testam, com o sufixo `spec`.

    **Por que?**: Fornece um modo consistente para identificar rapidamente os componentes.

    **Por que?**: Fornece padrões de correspondência para o [karma](http://karma-runner.github.io/) ou outros test runners.

    ```javascript
    /**
     * recomendado
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Controller Names
ou *Nomes para controller*

  - Use nomes consistentes para todos os controllers nomeados após as sua funcionalidade. Use UpperCamelCase para os controllers, assim como para seus construtores.

    **Por que?**: Fornece um modo consistente para identificar e referenciar os controllers.

    **Por que?**: O UpperCamelCase é o modo mais comum para identificar objetos que serão instanciados através de construtores.

    ```javascript
    /**
     * recomendado
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengers', HeroAvengers);

    function HeroAvengers(){ }
    ```

### Controller Name Suffix
ou *sufixo "Controllers"*

  - Complemente o nome do controller com ou sem o sufixo `Controller`. Escolha uma opção, não ambas.

    **Por que?**: O sufixo `Controller` é mais usado e mais descritivo.

    ```javascript
    /**
     * recomendado: Opção 1
     */

    // avengers.controller.js
    angular
        .module
        .controller('Avengers', Avengers);

    function Avengers(){ }
    ```

    ```javascript
    /**
     * recomendado: Opção 2
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController(){ }
    ```

### Factory Names
ou *Nomes para factory*

  - Use nomes consistentes para todas as factories nomeadas após sua funcionalidade. Use a conveção camelCase para services e factories. Evite prefixos com `$`.

    **Por que?**: Fornece um modo consistente de identificar e referenciar rapidamente as factories.

    **Por que?**: Evite colisão de nomes com factories e services pré-programados que usam o prefixo `$`.

    ```javascript
    /**
     * recomendado
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger(){ }
    ```

### Directive Component Names
ou *Nomes para directive*

  - Use nomes consistentes para todas as directives usando a convenção camelCase. Use um prefixo curto para descrever a área a qual a directive pertence (como prefixo da compania ou do projeto).

    **Por que?**: Fornece um modo consistente de identificar e referenciar rapidamente os componentes.

    ```javascript
    /**
     * recomendado
     */

    // avenger.profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile(){ }
    ```

### Modules
ou *Módulos*

  - Quando há vários módulos, o arquivo principal deste módulo é nomeado `app.module.js`, enquanto os módulos dependentes são nomeados de acordo com o que eles representam. Por exemplo, um módulo admin é nomeado `admin.module.js`. Os nomes dos respectivos módulos registrados seriam `app` e `admin`.

    **Por que?**: Fornece consistência para múltiplos módulos, e para expansão para grandes aplicações.

    **Por que?**: Fornece um modo fácil para automação de tarefas, a fim de carregar todos as definições dos módulos em primeiro lugar, então os demais arquivos (empacotamento).

### Configuration
ou *Configuração*

  - Separe a configuração do módulo em seu próprio arquivo, nomeado após o módulo. Um arquivo de configuração para o módulo principal `app` é nomeado `app.config.js` (ou simplesmente `config.js`). Uma configuração para o módulo `admin.module.js` é nomeada `admin.config.js`.

    **Por que?**: Separa a configuração do módulo da definição, dos componentes e do código ativo.

    **Por que?**: Fornece um local identificável para definir as configurações de um módulo.

### Routes
ou *Rotas*

  - Separe as configurações das rotas em seus próprios arquivos. Os exemplos podem ser `app.route.js` para o módulo princial, e `admin.route.js` para o módulo `admin`. Mesmo nas menores aplicações, prefiro esta separação das demais configurações. Uma alternativa é um nome mais longo, como `admin.config.route.js`.

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Application Structure LIFT Principle
ou *Princípio da estrutura LIFT na aplicação*

### LIFT

  - Estruture a sua aplicação de um modo onde você possa: `L`ocate (Localizar) seu código rapidamente, `I`dentify (Identificar) o código facilmente, manter a estrutura a mais `F`lattest (Plana) que você conseguir, e `T`ry (Tentar) seguir o conceito de DRY (Don't Repeat Yourself - Não repita a si mesmo). A estrutura deve seguir essas 4 regras básicas.

    **Por que LIFT?**: Fornece uma estrutura consistente que escala bem, é modular, e torna mais fácil para aumentar a eficiência ao desenvolver, pois encontra-se o código rapidamente. Outra forma de verificar a estrutura da sua aplicação é se perguntar: Quão rápido é para você abrir e trabalhar em todos os arquivos relacionados com uma funcionalidade?

    Quando estou sentindo que não estou confortável com a minha estrutura, eu volto e revisito as regras do LIFT

    1. `L`ocating (Localizar) nosso código é fácil
    2. `I`dentify (Identificar) o código rapidamente
    3. `F`lat (Plano) - Deixar a estrutura a mais plana que conseguirmos
    4. `T`ry (Tentar) se manter DRY (Don’t Repeat Yourself - Não repita a si mesmo) ou T-DRY

### Locate
ou *Localizar*

  - Torne a localização do seu código: intuitiva, simples e rápida.

    **Por que?**: Acho que isso é super importante para um projeto. Se a equipe não pode encontrar rapidamente os arquivos que precisam para trabalhar, eles não serão capazes de trabalhar da forma mais eficiente possível, e a estrutura precisa mudar. Você pode não saber o nome do arquivo ou onde os arquivos relacionados estão, por isso, colocando-os nos locais mais intuitivos e próximos uns dos outros, economiza uma boa parcela de tempo. Uma pasta descrevendo a estrutura pode ajudá-lo.

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
ou *Identificar*

  - Quando você olhar para um arquivo, prontamente você deve saber o que ele contém e o que representa.

    **Por que?**: Você gasta menos tempo caçando e procurando por código, e torna-se mais eficiente. Se isso significa nomes de arquivos mais longos, então que assim seja. Seja descritivo nos nomes de arquivos e mantenha o conteúdo do arquivo somente com 1 componente. Evite arquivos com vários controladores (controllers), múltiplos serviços (services), ou uma mistura. Existem exceções de 1 regra por arquivo quando eu tenho um conjunto de recursos muito pequenos que estão todos relacionados uns aos outros, eles ainda são facilmente identificáveis.

### Flat
ou *Plano*

  - Mantenha uma estrutura plana de pastas o máximo que for possível. Quando você tiver 7 arquivos ou mais, comece a considerar separá-los.

    **Por que?**: Ninguém quer pesquisar 7 níveis de pastas para encontrar um arquivo. Pense sobre menus em web sites - nada mais profundo do que 2 níveis deve ser levado a sério. Em uma estrutura de pastas não há nenhum número mágico, mas quando uma pasta tem 7-10 arquivos, pode ser a hora de criar subpastas. Baseie-se no seu nível de conforto. Use uma estrutura mais plana até que haja um valor óbvio (para ajudar o resto do LIFT) na criação de uma nova pasta.

### T-DRY (Try to Stick to DRY)
ou *Tente manter-se em DRY - Não repita a si mesmo*

  - Mantenha-se DRY, mas não fique louco e sacrifique a legibilidade.

    **Por que?**: Não ficar se repetindo é importante, mas não é crucial se acabar sacrificando os outros itens do LIFT, por isso eu chamo de T-DRY (Tente não ficar se repetindo). Eu não quero escrever session-view.html para uma view, porque obviamente é uma view. Se não é óbvio ou uma convenção, então eu renomeio.

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Application Structure
ou *Estrutura da aplicação*

### Overall Guidelines
ou *Orientações gerais*

  - Tenha uma visão de curto prazo da implementação e uma visão de longo prazo. Em outras palavras, comece pequeno, mas tenha em mente o caminho que o aplicativo pode tomar. Todos do código do aplicativo vão em uma pasta raiz chamada `app`. Todo o conteúdo é feito com um recurso por arquivo. Cada controlador (controller), serviço (service), módulo (module), visão (view) está em seu próprio arquivo. Todos os scripts de terceiros são armazenados em uma outra pasta raiz e não na pasta `app`. Não foi eu que escrevi esses scripts, então eu não quero que eles baguncem meu aplicativo (`bower_components`,` scripts`, `lib`).

    Nota: Encontre mais detalhes sobre essa estrutura em [esse post original sobre a estrutura da aplicação](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout

  - Coloque os componentes que definem o layout geral do aplicativo em uma pasta chamada `layout`. Eles podem incluir uma view e uma controller que agem como recipiente para o app, navegação, menus, áreas de conteúdo, e outras regiões.

    **Por que?**: Organize todos os layouts em um único lugar reutilizado em toda a aplicação.

### Folders-by-Feature Structure
ou *Estrutura de Pastas-por-Recurso*

  - Crie pastas nomeadas para cada recurso que elas representam. Quando uma pasta cresce ao ponto de conter mais de 7 arquivos, comece considerar a criação de uma pasta para eles. O seu limite pode ser diferente, por isso, ajuste conforme necessário.

    **Por que?**: O desenvolvedor pode localizar o código, identificar o que cada arquivo representa em resumo, a estrutura é plana como deve ser, e não há nenhum nome repetido ou redundante.

    **Por que?**: As orientações LIFT estão todas sendo respeitadas.

    **Por que?**: Através da organização do conteúdo, ajuda a reduzir o app de tornar-se desordenado e mantêm alinhado com as diretrizes LIFT.

    **Por que?**: Quando há um grande número de arquivos (10+) localizá-los é mais fácil com estruturas de pastas consistentes e mais difícil em estruturas planas.

    ```javascript
    /**
     * recomendado
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

      ![Exemplo de estrutura na aplicação](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/modularity-2.png)

      Nota: Não estruture seu aplicativo usando pastas-por-tipo. Isto requer alternar entre várias pastas ao trabalhar em um recurso e fica difícil de manejar quando o aplicativo cresce rapidamente para 5, 10 ou 25+ views e controllers (e outros recursos), o que torna mais difícil do que pasta-por-recurso para localizar arquivos.

    ```javascript
    /*
    * evite
    * Alternativa pastas-por-tipo.
    * Eu recomendo "pastas-por-recurso".
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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Modularity
ou *Modularidade*

### Many Small, Self Contained Modules
ou *Muitos módulos pequenos e independentes*

  - Crie pequenos módulos que encapsulem uma única responsabilidade.

    **Por que?**: Aplicações modulares tornam fácil o acoplamento, pois permitem que as equipes de desenvolvimento construam fatias verticais das aplicações e juntem tudo de forma incremental. Isto significa que podemos acoplar novos recursos enquanto os desenvolvemos.

### Create an App Module
ou *Crie um módulo da aplicação*

- Crie um módulo raiz para a aplicação, cujo papel é: reunir todos os outros módulos e funcionalidades da sua aplicação. Nomeie ele de acordo com a sua aplicação.

    **Por que?**: Angular incentiva padrões de modularidade e de separação. Criando um módulo raiz da aplicação cujo papel é o de amarrar os outros módulos juntos, fica muito simples de adicionar ou remover módulos na sua aplicação.

### Keep the App Module Thin
ou *Mantenha o módulo da aplicação leve*

  - Somente coloque a lógica para reunir o aplicativo no módulo da aplicação. Deixe os recursos em seus próprios módulos.

    *Why?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.
    **Por que?**: Colocar funções adicionais na raiz da aplicação para obter dados remoto, modos de exibição, ou outra lógica não relacionada com o acoplamento do aplicativo, torna mais difícil reutilizar os recursos ou mesmo, desligá-los.

    **Por que?**: O módulo da aplicação torna-se um manifesto que descreve os módulos que ajudam a definir a aplicação.

### Feature Areas are Modules
ou *Áreas de recursos são módulos*

  - Crie módulos que representem áreas de recursos, como: layout, serviços compartilhados e reutilizados, dashboards e recursos específicos do aplicativo (por exemplo, clientes, administrativo, vendas).

    **Por que?**: Módulos independentes podem ser adicionados na aplicação com pouco ou nenhum esforço.

    **Por que?**: Sprints ou iterações podem focar em áreas de recursos e acoplá-los na aplicação ao fim da sprint ou iteração.

    **Por que²**: Separando as áreas de recursos em módulos, fica fácil de testar os módulos em isolamento e de reutilizar o código.

### Reusable Blocks are Modules
ou *Blocos reutilizáveis são módulos*

- Crie módulos que representam blocos reutilizáveis da aplicação para serviços comuns, como: tratamento de exceção, log, diagnósticos, segurança e armazenamento local.

    **Por que?**: Esses tipos de recursos são necessários em muitas aplicações, então mantê-los separados em seus próprios módulos os torna genéricos e assim, podem ser reutilizados em diferentes aplicações.

### Module Dependencies
ou *Dependências do módulo*

  - O módulo raiz da aplicação depende de módulos de recursos específicos do aplicativo e de qualquer módulo compartilhado ou reutilizado.

    ![Moduluaridade e Dependências](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-1.png)

    **Por que?**: O módulo principal do aplicativo contém um rápido manifesto para identificar os recursos da aplicação.

    **Por que?**: Cada área de recurso contém um manifesto mostrando as suas dependências, assim, ela pode ser colocada como uma dependência em outras aplicação e ainda continuar funcionando.

    **Por que?**: Recursos intra-aplicação como serviços compartilhados de dados, tornam-se muito mais fácil de localizar e compartilhar atráves do `app.core` (escolha o seu nome favorito para esse módulo).

    Nota: Essa é uma estratégia para consistência. Existem muitas outras boas opções. Escolha uma que seja consistente, que siga as regras de dependência do Angular, e que seja fácil de manter e escalar.

    > As minhas estruturas podem variar ligeiramente entre os projetos, mas todas elas seguem estas diretrizes para estrutura e modularidade. A implementação pode variar dependendo dos recursos e do time. Em outras palavras, não fique preso somente a uma estrutura mas justifique sua estrutura usando consistência, facilidade de manutenção e eficiência em mente.

    > Em um aplicativo pequeno, você também pode considerar colocar todas as dependẽncias compartilhadas no módulo principal do aplicativo, onde os módulos de recursos não tem dependências diretas. Isso torna mais fácil de manter a aplicação, mas torna mais difícil de reutilizar os módulos fora dessa aplicação.

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Angular $ Wrapper Services

### $document and $window

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle AngularJS's digest cycle thus keeping data binding in sync.

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Testing
Testes unitários ajudam a manter o código limpo, tal como, eu inclui algumas recomendações de fundamentos para testes unitários com links para mais informações.

### Escreva testes com Histórias(Stories)

  - Escreva um grupo de testes para cada história. Comece com um teste em branco e preencha-o conforme você for escrevendo o código para a história.

    *Por que?*: Escrevendo uma descrição de teste te ajudará a definir claramente o que a sua história vai fazer ou não vai fazer e como você poderá mensurar o sucesso.

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

### Library para Testes

  - Para teste unitários use [Jasmine](http://jasmine.github.io/) ou [Mocha](http://visionmedia.github.io/mocha/).

    *Por que?*: Ambos, Jasmine e Mocha são amplamente utilizados na comunidade AngularJS. Ambos são estáveis, são mantidos e provém features de teste robustas.

    Nota: Se escolher Mocha, também considere a escolha de uma Assert Library como [Chai](http://chaijs.com).

### Test Runner

  - Use [Karma](http://karma-runner.github.io) como seu test runner.

    *Por que?*: Karma é fácil de configurar para executar apenas uma vez ou automaticamente enquanto você altera seu código.

    *Por que?*: Karma se integra facilmente com seu processo de Integração Contínua ou através do Grunt ou Gulp.

    *Por que?*: Algumas IDE's estão começando a se integrar com o Karma, como [WebStorm](http://www.jetbrains.com/webstorm/) e [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Por que?*: Karma funciona muito bem com os líderes de automação de tarefas, como [Grunt](http://www.gruntjs.com) (com [grunt-karma](https://github.com/karma-runner/grunt-karma)) e [Gulp](http://www.gulpjs.com) (com [gulp-karma](https://github.com/lazd/gulp-karma)).

### Stubbing e Spying

  - Utilize Sinon para stubbing e spying.

    *Por que?*: Sinon funciona bem tanto com Jasmine quanto com Mocha e amplia as features de stubbing e spying que eles oferecem.

    *Por que?*: Sinon faz ficar mais fácil alternar entre Jasmine e Mocha, se você quiser tentar ambos.

### Headless Browser

  - Use [PhantomJS](http://phantomjs.org/) para executar seus testes no servidor.

    *Por que?*: PhantomJS é um headless browser que executa os testes sem um navegador "visual". Ou seja, você não precisa instalar Chrome, Safari, IE ou outros navegadores no seu servidor.

    Nota: Você deve continuar testando em todos os navegadores em seu ambiente, conforme apropriado para seu público alvo.

### Análise de Código

  - Execute JSHint no seus testes.

    *Por que?*: Testes são códigos. JSHint ajuda a identificar problemas de qualidade de código que podem fazer com que o teste execute de maneira errada.

### Ignore algumas regras globais do JSHint no seus testes

  - Faça com que as regras de teste permitam globais comuns, tais como `describe` e `expect`.

    *Por que?*: Seus testes são codigos e como tal necessitam da mesma atenção e regras de qualidade que todo o seu código de produção. No entanto, as variáveis globais usadas pelo framework de teste, por exemplo, podem ser ignoradas para que você as utilize em seus testes.

    ```javascript
    /* global sinon, describe, it, afterEach, beforeEach, expect, inject */
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/testing-tools.png)

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

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

    Note: See this [great post by Matias Niemelä on Angular animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Constants

*ou Constantes*

### Globais de terceiros (*vendors*)

  - Cria uma *Constant* no Angular para variáveis globais de bibliotecas de terceiros.

    *Por que?*: Fornece uma forma de injetar bibliotecas de terceiros que de outra forma seriam globais. Isso melhora a testabilidade do código permitindo a você conhecer mais facilmente quais dependências os seus componentes têm (evita vazamento de abstrações). Também permite que você simule estas dependências, o que faz sentido.

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text

  - Angular snippets that follow these styles and guidelines.

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

  - Angular file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm

  - Angular snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    - Download the [WebStorm Angular file templates and snippets](assets/webstorm-angular-file-template.settings.jar)
    - Open WebStorm and go to the `File` menu
    - Choose the `Import Settings` menu option
    - Select the file and click `OK`
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**

## Angular docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

### Process
    1. Discuss the changes in an Issue.
    1. Open a Pull Request, reference the issue, and explain the change and why it adds value.
    1. The Pull Request will be evaluated and either merged or declined.

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

**[De volta ao topo](#tabela-de-conte%C3%BAdo)**
