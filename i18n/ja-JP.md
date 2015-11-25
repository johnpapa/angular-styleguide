# Angular スタイルガイド

*[@john_papa](//twitter.com/john_papa)によるチームのための頑固なAngularスタイルガイド*

もしあなたがAngularのシンタックス、規約、そしてアプリケーション構成のための頑固なスタイルガイドを探しているなら、どうぞいらっしゃい！本スタイルは、[Angular](//angularjs.org)を用いた私の開発経験やプレゼンテーション、[Pluralsight training courses](http://pluralsight.com/training/Authors/Details/john-papa) 、そしてチームでの作業に基づいたものです。

このスタイルガイドの目的は、私が実践している規約だけでなく、私がそれを行う理由を示すことによって、Angularアプリケーションを構築する手引きとなることです。

>もしあなたがこのガイドを気に入ったのなら、Pluralsightにある [Angular Patterns: Clean Code](http://jpapa.me/ngclean) の私のコースもチェックして下さい。

[![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Community Awesomeness and Credit
あなたは決して1人でありません！Angularのコミュニティは、自身の経験を共有することに情熱的な素晴らしい集団です。実際、友人でありAngularのエキスパートでもある Todd Motto と私は、共同で多くのスタイルや規約をまとめました。一部意見が分かれましたが、概ね合意できるものでした。彼のアプローチと本スタイルとの比較のため、是非 [Todd's guidelines](https://github.com/toddmotto/angularjs-styleguide) をチェックすることをお勧めします。

ここで紹介する多くのスタイルは、数多くのペアプログラミングのセッション [Ward Bell](http://twitter.com/wardbell) および私自身が既に持っていたアイデアによるものです。いつも意見が一致した訳ではないですが、友人のWardはこのガイドの最終的な発展に大きく貢献してくれました。

## See the Styles in a Sample App
このガイドは"何を"、"なぜ"、"どのように"行えば良いかという説明をしますが、合わせて実践的に見ていくことが理解に役立つはずです。本ガイドは、スタイルやパターンに沿ったサンプルアプリケーションを [`modular`のディレクトリ](https://github.com/johnpapa/ng-demos) に用意しています。ここから自由に取得しcloneやforkをしてもらって構いません。また [readmeに実行のためのインストラクション](https://github.com/johnpapa/ng-demos/tree/master/modular) もあります。

## Translations
[Translations of this Angular style guide](https://github.com/johnpapa/angular-styleguide/tree/master/i18n) がコミュニティによってメンテナンスされており、そこで翻訳を参照することができます。

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

  - ファイル毎に一つのコンポーネントを定義して下さい。

　次の例は`app`モジュールとその依存、コントローラの定義とファクトリーの定義の全てが同じファイルに定義されています。

  ```javascript
  /* avoid */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```

  コンポーネント単位でファイルに分割します。

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

  - Angularのコンポーネントを即時関数式(Immediately Invoked Function Expression:IIFE)で包んで下さい。

  *なぜ ?*: IIFEを用いると変数はグローバルスコープになりません。それにより、変数がグローバルスコープの中で期待以上に長く生存してしまうことを防ぐことがでます。また変数同士の衝突も避けることができます。

  *なぜ ?*: コードをMinifyして一つのファイルにしてプロダクションのサーバーにデプロイするときに、変数の衝突や多数のグローバル変数の存在が問題を起こすかもしれません。IIFEはファイル毎にスコープを持つため、これらの問題を防ぐことができます。

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

  - Note: 簡潔にするため, 以下に続くコードの例ではIIFEのシンタックスを省略させて下さい。

  - Note: テストコードは正規表現や単体テスト向けに有効なヘルバー関数のようになプライベートなメンバにしばしばアクセスしますが、IIFEはそのアクセスへの妨げとなります。しかしながら、アクセス可能なメンバを通してテストをすることや独立したコンポーネント経由でこれらを公開してしまうことでテストが可能になります。例えば、ヘルバー関数、正規表現、もしくは定数をAngularのファクトリや定数として用意してしまう方法があります。

**[Back to top](#table-of-contents)**

## Modules

### Avoid Naming Collisions
###### [Style [Y020](#style-y020)]

  - サブモジュールにセパレータを用いたユニークな命名規則を用いて下さい。

  *なぜ ?*: ユニークな名前は衝突を防ぐことができます。セパレータはモジュールやそのサブモジュールの階層を定義するのに役立ちます。例えば、`app` はルートとなるモジュールであり、`app.dashboard` または `app.users` は `app` と依存のあるモジュールかもしれません。

### Definitions (aka Setters)
###### [Style [Y021](#style-y021)]

  - セッターを用いて変数を使うことなくモジュールを定義して下さい。

  *なぜ ?*: 1ファイル1コンポーネントの原則下では、モジュールの宣言で変数が必要となるケースは非常に稀です。

  ```javascript
  /* avoid */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  代わりに下記のようなシンプルなセッターのシンタックスを用いて下さい。

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

  - モジュールを用いるときは変数を使うことを避け、代わりにゲッターを使ったチェーンを用いて下さい。

  *なぜ ?*: 可読性の高いコードとなり変数の衝突やリークを防ぐことができます。

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

  - 一度だけsetして、その他のインスタンスでは全てgetして下さい。

  *なぜ ?*: モジュールは一度だけ生成され、それ以降は取得のみが行われるべきです。

    - モジュールのsetには`angular.module('app', []);` を用いる。
    - モジュールのgetには `angular.module('app');` を用いる。

### Named vs Anonymous Functions
###### [Style [Y024](#style-y024)]

  - コールバックとして、無名関数ではなく有名関数を渡して下さい。

  *なぜ ?*: 可読性の高いコードとなりデバッグが容易となります。またネスト化されたコールバックの量を減らせます。

  ```javascript
  /* avoid */
  angular
      .module('app')
      .controller('Dashboard', function() { })
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

### controllerAs View Syntax
###### [Style [Y030](#style-y030)]

  - `典型的な$scopeを使ったcontroller`のシンタックスよりも、[`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) を用いて下さい。

  *なぜ ?*: 全く新規にControllersが生成されると、 単一の新しいインスタンスが生成されます。`controllerAs` のシンタックスは、`典型的な$scopeを使ったcontroller`のシンタックスよりも、JavaScriptのコンストラクタにより近いものとなります。

  *なぜ ?*: ビューの中で"ドット."によるバインディングが容易となり、(例えば、`name` の代わりに `customer.name` となることで)様々な状況に対応可能となり可読性が高まります。また、"ドット."を使わない場合に起こりうる参照の問題を避けることができます。

  *なぜ ?*: ネスト化されたコントローラを使ったビューの中で`$parent` の呼び出しを避けるのに役立ちます。

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

### controllerAs Controller Syntax
###### [Style [Y031](#style-y031)]

  - `典型的な$scopeを用いたコントローラ`のシンタックスよりも、`controllerAs`のシンタックスを用いて下さい。

  - `controllerAs`のシンタックスを用い、$scopeにバインドされるコントローラの内部で`this`を用いて下さい。

  *なぜ ?*: `controllerAs`は、`$scope`の糖衣構文(シンタックスシュガー)となるので、`$scope`が引き続きビューにバインドされます。そのため`$scope`のメソッドも利用することができます。

  *なぜ ?*: コントローラ内部で`$scope`のメソッドを利用したいときに、それを自体を避けた方が良いかもしくはファクトリに移動した方が良いことがあります。そのようなときに、コントローラの中に押し込めてしまいたい誘惑を遠ざけるのに役立ちます。ファクトリの中で$scopeを使うことや必要なときに限ってコントローラの中で`$scope`を用いることを検討して下さい。 例えば、[`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit) や [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) もしくは [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) を使ってイベントのpublishとsubscribeを行うときは、その実装をファクトリに移動するかまたはコントローラから呼び出すといった形を検討して下さい。

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

### controllerAs with vm
###### [Style [Y032](#style-y032)]

  - `controllerAs` シンタックスを用いるときは、`this`をキャプチャした変数を用いて下さい。ビューモデルを表す`vm`のような一貫性のある名前を選んで下さい。

  *なぜ ?*: `this` キーワードはコンテキストに応じて変化するので、コントローラの関数の中で使われるときにはコンテキストが変更されるかもしれません。`this`のコンテクストをキャプチャすることで、このような問題を避けることができます。

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

  Note: コメントをコードの上部に入れることで [jshint](http://www.jshint.com/) のwarningsを避けることができます。 しかし関数がアッパーケースの場合には不要です。規約的にはそれはコンストラクタであり、Angularではコントローラに当たります。

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Note: `controller as`を用いたコントローラの中で watch を作成したときは、次のシンタックスで `vm.*` のメンバを watch することができます。(digestのサイクルに追加の負荷がかかることに注意してwatchを作成します。)

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

  - バインドするメンバをコントローラの先頭でアルファベット順に配置し、コントローラのコードの中に分散させないで下さい。

    *なぜ ?*: バインドするメンバを先頭に書くことで可読性が上がり、コントローラのどのメンバがバインドされ、ビューの中で使われるのかが即座に特定できます。

    *なぜ ?*: インラインで無名関数をセットするのは容易ですが、一行以上の関数の場合は可読性が下がります。バインドするメンバの下に関数を定義し(関数は巻き上げられます)、実装の詳細は下へ移動します。そうすることで、バインドするメンバを先頭に置いたまま可読性を上げることができるでしょう。

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

    ![Controller Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-1.png)

  Note: もし関数がワンライナーであれば、可読性に影響が無い限り上に置いたままにすることを検討して下さい。

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

### Function Declarations to Hide Implementation Details
###### [Style [Y034](#style-y034)]

  - 実装の詳細を隠すために関数宣言を用いて下さい。またバインドされるメンバを先頭に置いて下さい。コントローラの中で関数をバインドするときは、その関数がファイルの後方に現れる関数宣言を指すようにします。これは、「Bindable Members Up Top」のセクションと直接対応しています。 詳細は[このポスト](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) を参照して下さい。

    *なぜ ?*: バインドするメンバを先頭に書くことで可読性が上がり、コントローラのどのメンバがバインドされ、ビューの中で使われるのかが即座に特定できます(上記と同じ)。

    *なぜ ?*: 関数の実装の詳細をファイルの後方に置くことでviewから複雑さを排除し、重要なものがファイルの先頭で見えるようになります。

    *なぜ ?*: 関数宣言が巻き上げられるので(関数式でありがちな)関数を宣言する前に利用してしまう懸念がありません。

    *なぜ ?*: `var b` の前に`var a` を移動するという関数宣言が`a` が `b` に依存しているからといってコードが壊れてしまう心配する必要は決してありません。

    *なぜ ?*: 関数式では順番がクリティカルです。

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

  重要な事が続く例に散りばめられていることに着目して下さい。下記の例では、重要な物が先頭にあるのが分かります。例えば、`vm.avengers` や `vm.title` がコントローラにバインドされています。そして実装の詳細がその下にあります。これにより可読性が上がっています。

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

### Defer Controller Logic to Services
###### [Style [Y035](#style-y035)]

  - サービスやファクトリに委譲することで、コントローラの中のロジックを遅延させて下さい。

    *なぜ ?*: ロジックがサービス内に配置されて関数経由で利用可能になれば、複数のコントローラによって再利用されるかもしれません。

    *なぜ ?*: 単体テスト上でサービス内のロジックは簡単に分離できます。そのためコントローラの呼び出しロジックを容易にモック化がすることができます。

    *なぜ ?*: 依存性を取り除きコントローラから実装の詳細を隠すことができます。

    *なぜ ?*: コントローラをスリムに整えて、そしてフォーカスさせて下さい。

  ```javascript

  /* avoid */
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
  /* recommended */
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

  - 一つのビューに一つのコントローラを定義し、他のビューで再利用を試みないで下さい。代わりに再利用可能なロジックをファクトリに移動し、コントローラをシンプルにビューにフォーカスさせて下さい。

    *なぜ ?*: 複数のビューを持つコントローラを再利用することは脆く、大規模なアプリケーション上で安定性を確保するためには、高いカバレッジのエンドツーエンドテストが必須となります。

### Assigning Controllers
###### [Style [Y038](#style-y038)]

  - コントローラは必ずビューとペアとなる必要があります。どちらかのコンポーネントが他のコントローラやビューによって最利用可能であるときは、ルーティングに沿ってコントローラを定義して下さい。

    Note: もしビューがルーティング以外の別の方法でロードされているなら、`ng-controller="Avengers as vm"` のシンタックスを利用して下さい。

    *なぜ ?*: ルーティングによりコントローラのペアリングを行うことで、ルーティングによって異なるコントローラとビューのペアを呼び出すことが出来ます。コントローラが[`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController)を使ってビューにアサインされたときには、そのビューはいつも同じコントローラにアサインされます。

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

### Singletons
###### [Style [Y040](#style-y040)]

  - サービスは`new`キーワードでインスタンス化されます。パブリックメソッドや変数には`this`を使って下さい。これらはファクトリも同様ですが、一貫性のためにはサービスの代わりにファクトリを用いて下さい。

    Note: [全てのAngularのサービスはシングルトンです](https://docs.angularjs.org/guide/services)。 これはつまり、作成されたサービスはインジェクター毎に単一インスタンスしか存在しないことを意味しています。

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

  - ファクトリは[単一責任](http://en.wikipedia.org/wiki/Single_responsibility_principle)であるべきであり、そのコンテキストに応じてカプセル化されます。ファクトリが一つの目的を超えて利用され始めた場合は、新しいファクトリが作成されるべきです。

### Singletons
###### [Style [Y051](#style-y051)]

  - ファクトリはシングルトンであり、そのサービスのメンバを含むオブジェクトを返して下さい。

    Note: [全てのAngularのサービスはシングルトンです](https://docs.angularjs.org/guide/services)。

### Accessible Members Up Top
###### [Style [Y052](#style-y052)]

  - 呼び出し可能なサービスのメンバ(そのインターフェイス)を先頭に公開します。このテクニックは [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) に由来しています。

    *なぜ ?*: 呼び出し可能なメンバを先頭に置くことは可読性に優れ、どのサービスのメンバが呼び出し可能で単体テストされる(モックされる)べきなのかを即座に特定するのに役立ちます。

    *なぜ ?*: これは何が公開されているかを見るためにスクロールが必要なるほどファイルが長い場合に特に有効です。

    *なぜ ?*: セッターの関数では簡単ですが、関数宣言が一行以上のコードからなる場合には可読性が下がりスクロールが必要となります。サービスからの戻り値を用いて呼び出し可能なインターフェイスの定義をすることで、実装の詳細を下に移動できます。また、インターフェイスの定義が先頭に置かれることで、可読性を上げることができます。
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

  このバインディングの方法はホストオブジェクト全体で反映されます。このrevealing module パターンを使うことで単独でプリミティブの値を更新することは出来なくなります。
    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angularjs-styleguide/master/assets/above-the-fold-2.png)

### Function Declarations to Hide Implementation Details
###### [Style [Y053](#style-y053)]

  - 実装の詳細を隠すために関数宣言を用いて下さい。ファクトリのアクセス可能なメンバを先頭に置いて下さい。それらのメンバがファイルの後方に現れる関数宣言を指すようにします。詳細は[このポスト](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) を参照して下さい。

    *なぜ ?*: アクセス可能なメンバを先頭に書くことで可読性が上がり、ファクトリの中でどの関数が外部からアクセス可能なのか即座に特定できます。

    *なぜ ?*: 実装の詳細をファイルの後方に置くことでviewから複雑さを排除し、重要なものがファイルの先頭で見えるようになります。

    *なぜ ?*: 関数宣言が巻き上げられるので、(関数式であるような)関数を宣言する前に利用してしまう懸念がありません。

    *なぜ ?*: `var b` の前に`var a` を移動するという関数宣言が、`a` が `b` に依存しているからといってコードが壊れてしまう心配する必要は決してありません。

    *なぜ ?*: 関数式では順番がクリティカルです。

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

  - データオペレーションやファクトリとのデータのインタラクションのようなロジックをリファクタリングして下さい。XHRの呼び出し、ローカルストレージ、メモリへの退避などのデータオペレーションを担うデータサービスを作成して下さい。

    *なぜ ?*: コントローラの責任は、プレゼンテーションとビューのために必要な情報を集めることです。どのようにデータを取得するかは気にせず、ただ単に誰に問い合わせれば良いかを知っているだけです。 データサービスの分割によってどのようにデータを取得するかというロジックをデータサービスに移動し、コントローラをよりシンプルにビューにフォーカスさせて下さい。

    *なぜ ?*: データサービスを用いるコントローラをテストする際に、(モックまたは本物の)データの呼び出しを容易にテストできます。

    *なぜ ?*: データサービスの実装は、データリポジトリを取り扱う非常にスペシフィックなコードとなります。 このコードには、ヘッダ、データリポジトリの利用方法、もしくは`$http`のような他のサービスを含むでしょう。そのようなロジックをデータサービスへ分割し、他のconsumers (おそらくコントローラ) から実装の詳細を隠すように一つの場所へカプセル化します。そうすることで、実装の変更も容易になります

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

    Note: データサービスがコントローラのような consumers から呼び出されますが、下記で示されるように実装はconsumersから隠されます。

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

### Return a Promise from Data Calls
###### [Style [Y061](#style-y061)]

  - `$http`のようなpromiseを返すデータサービスを呼び出すときは、それを呼び出す関数も同様にpromiseを返して下さい。

    *なぜ ?*: promiseを一緒にチェーンすることで、データの呼び出しが完了した後にさらなるアクションを行い、そのpromiseをresolveもしくはrejectすることができます。

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

  - ファイル毎に一つのディレクティブを作って下さい。ディレクティブ名でファイル名を付けて下さい。

    *なぜ ?*: 全てのディレクティブを一つのファイルに押し込めるのは容易ですが、アプリ間、モジュール間、たった一つのモジュールと共有する場合でも抜き出すのは難しくなります。

    *なぜ ?*: ファイル毎に一つのディレクティブにすることで、メンテナンスが容易になります。

    Note: "**Best Practice**: ディレクティブは自身でクリーンナップされるべきです。ディレクティブが削除されたときにクリーンナップの関数を実行するために、`element.on('$destroy', ...)` や `scope.$on('$destroy', ...)`"を用いて下さい ... Angularのドキュメンテーションより。


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

    Note: スコープが狭いか広いかに応じて、ディレクティブには多くの命名オプションがあります。ディレクティブだと理解され、そのファイル名の区別がつきやすく内容が明解であるような名前を一つ選んで下さい。いくつかの例が下記に登場しますが、より推奨される名前に関しては[Naming](#naming)のセクションを参照して下さい。

### Manipulate DOM in a Directive
###### [Style [Y072](#style-y072)]

  - DOMを直接操作する場合にはディレクティブを使って下さい。もしもスタイルをセットするためのCSSや [animation services](https://docs.angularjs.org/api/ngAnimate)、Angularテンプレート、 [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) や [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide) といった代替の方法があれば、代わりにそれを用いるのでも良いです。例えば、ディレクティブが単純に表示と非表示を行うものであれば、ngHide/ngShowを使って下さい。

    *なぜ ?*: DOM操作はテストやデバッグが難しいため、しばしば良いアプローチ(例えば、CSS、アニメーション、テンプレート)があります。

### Provide a Unique Directive Prefix
###### [Style [Y073](#style-y073)]

  - 簡潔でユニークで内容をよく表すディレクティブのプリフィックスを付けて下さい。例えば、HTMLで`acme-sales-customer-info`のように宣言されれば、`acmeSalesCustomerInfo`のようになります。

    *なぜ ?*: ユニークで簡潔なプリフィックスは、ディレクティブのコンテキストと由来を特定します。例えば、`cc-` というプリフィックスは、CodeCamperアプリを示し、`acme-` は Acme companyのためのディレクティブであることを示します。

    Note: `ng-` のようなAngularのdirectivesのためにリザーブされているものは避けて下さい。 名前の衝突を避けるため、[Ionic Framework](http://ionicframework.com/)の`ion-`のように、幅広く利用されているディレクティブを調査して下さい。

### Restrict to Elements and Attributes
###### [Style [Y074](#style-y074)]

  - スタンドアロンで成り立つ要素のようなディレクティブを作るときは、restrictプロパティに`E` (カスタム要素) を指定し、必要に応じて `A` (カスタム属性)を指定して下さい。一般的に、スタンドアロンでコントロールできるものであれば `E` が適しています. 一般的なガイドラインとして `EA` は許されますが、スタンドアロンのときは要素として実装される方が好ましく、既存のDOM操作の拡張のためには属性として実装される方が好ましいです。

    *なぜ ?*: 理にかなっているからです。

    *なぜ ?*: 私たちはディレクティブをクラスとして使うことを許していますが、もしディレクティブが要素として働いているのであれば、要素の方がより理にかなっていますし、また少なくとも属性としても理にかなうはずです。

    Note: Angular 1.3 +では、EAがデフォルトです。

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

  - ディレクティブが一貫性を保てるように、ビューとコントローラのペアリングで用いられる`controller as`を用いて下さい。

    *なぜ ?*: 理にかなっていますし、難しくありません。

    Note: 下記のディレクティブは、controllerAsを用いてlinkやディレクティブのコントローラの中でscopeを使う方法を示しています。全てが一箇所に収まるようにテンプレートをインラインで入れています。

    Note: 依存性の注入(dependency injection)に関しては、[Manually Identify Dependencies](#manual-annotating-for-dependency-injection)を参照して下さい。

    Note: ディレクティブのコントローラがディレクティブのクロージャーの外にあることに注意して下さい。この書き方によって注入が`return`の後で到達不能なコードを生成してしまう問題を回避することができます。

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

    Note: コントローラをlink関数に注入して、ディレクティブの属性をコントローラのプロパティとしてアクセスすることも可能です。

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

  - `controller as`シンタックスをディレクティブで用い、外側のscopeをディレクティブのコントローラのscopeにバインドしたいときは `bindToController = true` を使って下さい。

    *なぜ ?*: 外側のscopeをディレクティブのコントローラのscopeにバインドした方が容易です。

    Note: `bindToController`はAngular 1.3.0で導入されました。

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

  - `activate`関数でコントローラのスタートアップロジックを解決して下さい。

    *なぜ ?*: スタートアップロジックをコントローラの中の一貫性の取れた場所へと置くことでテストの場所を特定し、より一貫性のとれたテストを行うことを容易にします。またコントローラ全体にアクティベーションのロジックが分散してしまうのを避けるのにも役立ちます。

    *なぜ ?*: コントローラの`activate`は、コントローラ/ビューのリフレッシュするためのロジックを再利用するのに便利です。またロジックを一緒にまとめることで、ユーザがビューに早くたどり着けます。`ng-view` や `ui-view`へアニメーションを入れるのも容易となるので、ユーザはキビキビとした動作だと感じます。

    Note: もしコントローラを使い始める前に条件的にルーティングをキャンセルする必要があるなら、代わりに [route resolve](#style-y081) を用いて下さい。

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
###### [Style [Y081](#style-y081)]

  - コントローラがアクティベイトされる前にpromiseが解決されることに依存しているときは、コントローラのロジックが実行される前に`$routeProvider`の中でそれらの依存が解決されます。もしコントローラがアクティベイトされる前に条件的にルーティングをキャンセルしたい場合は、route resolveを用いて下さい。

  - ビューへ遷移する前にルーティングのキャンセルを判断したいときは、route resolveを用いて下さい。

    *なぜ ?*: コントローラが読み込まれる前にデータが必要となるかもしれません。そのデータはカスタムのファクトリや[$http](https://docs.angularjs.org/api/ng/service/$http)から返るpromiseから取得するかもしれません。[route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) を使うと、コントローラがロジックを実行する前にpromiseを解決することができるため、 promiseから取得したデータに基づいてアクションを取ることができます。

    *なぜ ?*: ルーティングとコントローラのactivate関数の後にコードが実行されて、ビューが直ちにロードされます。アクティベイトされたpromiseがresolveされるとデータバインディングがキックされます。ビューが遷移している間(`ng-view`や`ui-view`で)"busy"なアニメーションが表示されます。

    Note: promiseの後に、ルーティングが行われる前にコードが実行されます。もしそのpromiseがrejectされるとルーティングはキャンセルされます。resolveによって新しいビューはルーティングが解決されるのを待ちます。resolve及びビューの遷移が終わるまで"busy" なアニメーションが表示されます。より早くビューを表示したい場合で、かつビューを表示するかどうかのチェックポイントが不要な場合は、代わりに [controller `activate` technique](#style-y080) を用いることを検討して下さい。

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
      var vm = this;
      vm.movies = moviesPrepService.movies;
  }
  ```

    Note: 下記の例はルーティングのresolveが有名関数を指し示しています。そのためデバッグが容易になり依存性の注入が扱いやすくなっています。


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

  function moviesPrepService(movieService) {
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
    Note: このコード例にある`movieService`への依存は、minificationセーフではありません。どのようにコードをminificationセーフにするかの詳細は[dependency injection](#manual-annotating-for-dependency-injection) と [minification and annotation](#minification-and-annotation)を参照して下さい。

**[Back to top](#table-of-contents)**

## Manual Annotating for Dependency Injection

### UnSafe from Minification
###### [Style [Y090](#style-y090)]

  - minificationセーフなアプローチを用いずにショートカットで依存を宣言するシンタックスは避けて下さい。

    *なぜ ?*: コンポーネント(つまり、コントローラやファクトリなど)に対するパラメータはマングル化された変数に変換されます。例えば、`common` や `dataservice`は、`a` もしくは `b` になるかもしれず、Angularが見つけられないかもしれません。

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    このコードはMinifyされたときにマングルされた変数が生成され実行エラーになるかもしれません。

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Manually Identify Dependencies
###### [Style [Y091](#style-y091)]

  - Angularコンポーネントの依存を手動で特定するために`$inject`を使って下さい。

    *なぜ ?*: このテクニックは[`ng-annotate`](https://github.com/olov/ng-annotate)で用いられており、そしてそれは自動でminificationセーフな依存を生成することを勧めています。もし`ng-annotate` が注入がすでに行われたことを検出すると再生成をスキップします。

    *なぜ ?*: このテクニックは、パラメータがマングルされたときにminificationの問題に対して脆弱であることから依存性を守ります。例えば、`common` や　`dataservice` が `a` や `b` になるかもしれず、Angularが見つけられないかもしれません。

    *なぜ ?*: 配列で読むのが難しいほと長いリストになる場合には、インラインで依存性を生成することを避けて下さい。さらに依存のリストは配列が文字列の連続からなる一方で、最後の要素がコンポーネントの関数となり紛らわしいです。

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

    Note: 関数がreturn文の下にあるとき、`$inject`が到達可能になるかもしれません(これはディレクティブで起こるかもしれません)。これはコントローラをディレクティブの外側へ移動することによって解決できます。

    ```javascript
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

  - Angularのコンポーネントのroute resolverの依存性を手動で特定するために`$inject`を使って下さい。

    *なぜ ?*: このテクニックは、route resolverを無名関数として外に出すことで可読性を上げることができます。

    *なぜ ?*: `$inject`の文をただ前に置くことによって、resolverがいかなる依存性もminificationセーフにします。

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

  - [Gulp](http://gulpjs.com)や[Grunt](http://gruntjs.com)のために[ng-annotate](//github.com/olov/ng-annotate)を使って下さい。自動の依存性の注入が必要となる関数に`/** @ngInject */`というコメントをいれて下さい。

    *なぜ ?*: このことはminificationセーフなプラクティスを利用していない依存性からコードを守ります。

    *なぜ ?*: [`ng-min`](https://github.com/btford/ngmin)は非推奨です。

    >私は読み書きとデバッグが容易なためGulpの方を好みます。

    次のコードはminificationセーフな依存性注入を使っていません。

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

    上記のコードにng-annotateを実行すると、次の`$inject`が付与された出力が生成され、その出力はminificationセーフになります。

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

    Note: もし`ng-annotate`が注入がすでに行われていることを検出すると(例えば、`@ngInject` が検出されると)、 `$inject`が入ったコ−ドを重複して生成しません。

    Note:　route resolverを用いるときは、resolverの関数の先頭に `/* @ngInject */` に付けることができます。注入された依存性がminificationセーフになるような適切にアノテーションのついたコードを生成します。

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

    > Note: 潜在的にminificationセーフでない依存性を検出するためにAngular 1.3から導入された、[`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp)のディレクティブの`ngStrictDi`パラメータを用いることができます。現在のinjectorが"strict-di"モードで生成されたとき、アプリケーションが明示的にアノテーションの付いていない関数(これらはminificationセーフではありません)の呼び出しは失敗します。デバッグ情報がログとしてconsoleに出力されるので、問題のあるコードを見つけ出すのに役立ちます。私は、`ng-strict-di`をデバッグ用途でのみ利用することを好みます。

    `<body ng-app="APP" ng-strict-di>`

### Use Gulp or Grunt for ng-annotate
###### [Style [Y101](#style-y101)]

  - 自動ビルドのタスクの中で[gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) もしくは [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) を使って下さい。依存性を持つどの関数よりも前に`/* @ngInject */` を注入して下さい。

    *なぜ ?*: ng-annotate は大半の依存性を捕捉しますが、`/* @ngInject */`のシンタックスを使ったヒントが時々必要となリます。

    次のコードは、ngAnnotateを使ったgulpタスクの例です。

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

  - 例外が発生したときに[`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler)サービスを上書きし、カスタムのアクションを実行するために、configの呼び出し時に[`$provide`](https://docs.angularjs.org/api/auto/service/$provide) サービスの[decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator)を使って下さい。

    *なぜ ?*: 開発時や実行時に捕捉されていないAngularの例外をハンドルする一貫した方法を与えます。

    Note: もう一つのオプションは、decoratorを使う代わりにサービスをオーバーライドすることです。これも有効なオプションですが、もしデフォルトの動作をキープしたい場合または拡張したい場合はdecoratorがお勧めです。

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

  - 例外を捕捉し丁寧にハンドルするインターフェイスを公開するファクトリを作って下さい。

    *なぜ ?*: コードが投げられる可能性のある例外(例えば、XHR呼び出しやpromiseのfailuresなど)を捕捉するため一貫した方法を与えます。

    Note: 例外のキャッチャーは、例外が発生するかもしれない呼び出しに対して、特定の例外を捕捉しそれに応じて処理をする際に有効です。例えば、リモートのWebサービスからデータを取得するXHRを呼び出すときに、それらのサービスから発生するいかなる例外も捕捉し一意に対応したい場合です。

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

  - [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError)を使って全てのルーティングのエラーをハンドルしてログにして下さい。

    *なぜ ?*: 全てのルーティングのエラーをハンドルする一貫した方法を与えます。

    *なぜ ?*: もしルーティングエラーが発生した際に、詳細な情報もしくはリカバリーのオプションが備わったユーザフレンドリーな画面にルーティングできれば、より良いユーザエクスペリエンスになる可能性があります。

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

  - 全てのコンポーネントに対して、特徴や(オプションで)その型を表すパターンに沿った一貫性のある名前を使って下さい。私のお勧めは、`feature.type.js`です。大半のアセットに対して二つの命名箇所があります。
    * ファイル名 (`avengers.controller.js`)
    * Angularに登録するコンポーネント名 (`AvengersController`)

    *なぜ ?*: 命名規則は一目見ただけでコンテンツが見つかるような一貫した方法を与えます。一貫性はプロジェクトにとって極めて重要なことでありチームにとって大切なことです。また会社全体でとても大きな効率性に繋がります。

    *なぜ ?*: 命名規則はコードをより早く発見し、そしてより簡単に理解する助けになります。

### Feature File Names
###### [Style [Y121](#style-y121)]

  - 全てのコンポーネントに対して、特徴や(オプションで)その型を表すパターンに沿った一貫性のある名前を使って下さい。私のお勧めは、`feature.type.js`です。

    *なぜ ?*: 素早くコンポーネントを特定できる一貫した方法を与えます。

    *なぜ ?*: 自動タスクためのパターンマッチングが可能となります。

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

  Note: 別の命名規則は `avengers.controller.js` というファイル名から`controller`を取り除いて命名することです。 その他の全ての規則はサフィックスを使い続けるものです。コントローラは最も共通なコンポーネントであり、タイピングの量を減らしながらも依然として特定しやすいままになります。どれか一つを選びチーム内で一つの命名規則に統一することを勧めます。私の好みは`avengers.controller.js`です。

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

  - コンポーネントと同様、テストするコンポーネントにサフィックスとして`spec`を付与した形でテストのスペックを命名して下さい

    *なぜ ?*: コンポーネントを素早く特定する一貫した方法を与えます。

    *なぜ ?*: [karma](http://karma-runner.github.io/)やその他のテストランナーでパターンマッチングが可能となります。

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

  - 全てのコントローラにそれらの機能から取った一貫した名前を付けて下さい。コントローラのコンストラクタには、アッパーキャメルケースを使って下さい。

    *なぜ ?*: 素早くコントラーを特定し参照できる一貫した方法を与えます。

    *なぜ ?*: アッパーキャメルケースはコンストラクタを使ってインスタンスを生成されたオブジェクトを特定する規約的な方法です。

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

  - コントローラに`Controller`という名前を挿入して下さい。

    *なぜ ?*: `Controller`のサフィックスは、広く使われており明らかに直接内容を説明している。

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

### Factory Names
###### [Style [Y125](#style-y125)]

  - 全てのファクトリに対して、機能に沿った一貫性の取れた名前を用いて下さい。サービスやファクトリ名にはキャメルケースを用いて下さい。`$`から始まるファクトリやサービス名を避けて下さい。

    *なぜ ?*: 参照するべきファクトリを素早く特定する一貫性の取れた方法を与えます。

    *なぜ ?*: ビルトインされている`$`から始まるファクトリやサービス名との衝突を避けられます。

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

  - 全てのディレクトリにキャメルケースで一貫性を取れた名前を用いて下さい。そのディレクティブが属する範囲を表す短いプリフィックス(例としては会社やプロジェクトのプリフィックス)を用いて下さい。

    *なぜ ?*: 参照するべきコンポーネントと素早く特定する一貫性の取れた方法を与えます。

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

  - 複数のモジュールがあるとき、メインとなるモジュールのファイルは`app.module.js`と命名し、他に依存のあるモジュールはそれが表す内容に応じて命名して下さい。 例えば、adminのモジュールは`admin.module.js`と命名します。registerされるモジュール名はそれぞれ`app`と`admin`になります。

    *なぜ ?*: 複数のモジュールからなるアプリまたは大規模なアプリケーションへ拡張される際に一貫性を与えます。

    *なぜ ?*: 自動化タスクを用いることで、定義されている全てのモジュールを最初にロードし、それから他のAngularのファイルを(bundlingのため)ロードするための簡単な方法を与えます。

### Configuration
###### [Style [Y128](#style-y128)]

  - モジュールのコンフィギュレーションをそれぞれのモジュールに沿って命名されたファイルに分離して下さい。メインの`app`のモジュールのコンフィグレーションは`app.config.js`と命名して下さい。(もしくは単純に`config.js`)。 モジュールの名前が`admin.module.js`であれば、そのコンフィグレーションは`admin.config.js`と命名します。

    *なぜ ?*: モジュールの定義やコンポーネント、アクティブなコードからコンフィグレーションを分離できます。

    *なぜ ?*: モジュールのコンフィグレーションを設定するための場所を特定できます。

### Routes
###### [Style [Y129](#style-y129)]

  - ルーティングのコンフィグレーションをそれぞれのファイルに分離して下さい。例えば、メインのモジュールが`app.route.js`であれば、`admin`のモジュールは、`admin.route.js`になります。例え小さいアプリであっても、私は他コンフィグレーションからルーティングを分離することを好みます。

**[Back to top](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT
###### [Style [Y140](#style-y140)]

  - コードを素早く`L`ocate(配置する)するため、一目見ただけでそのコードを`I`dentify(特定する)ため、できる限り`F`lattestに保ち`、なるべくDRYになるように(`T`ry)アプリケーションを構造化して下さい。アプリケーションの構造はこれらの４つのガイドラインに従うべきです。

    *なぜ LIFT?*: 一貫性のとれた構造によって十分にスケールしモジュール化され、コードの所在を素早く見つけられることで開発の効率性も上がります。アプリの構造をチェックするもう一つ方法は、次のことを自身に聞いてみることです：ある機能に対して、どのくらい素早く全ての関連ファイルを開き、そして変更できるでしょうか。

    もし自分の構造が良いと思えなかったら、立ち戻ってこれらのLIFTのガイドラインを見直して下さい。

    1. コードを容易に`L`ocatingできること
    2. 一目見ただけでコードを`I`dentifyできること
    3. できる限りコードを`F`latな構造にすること
    4. DRY(Don’t Repeat Yourself)のままになるように(`T`ry) or T-DRY

### Locate
###### [Style [Y141](#style-y141)]

  - コードの配置を直感的に単純に素早く行えるようにして下さい。

    *Why?*: これはプロジェクトにとって極めて重要なことです。もしチームが彼らが変更するべきファイルを素早く見つけることができなければ、最大限効率的に働くことができなくなってしまいます。そのようなときは構造を変更する必要があります。ファイル名が分からない、もしくは関連のファイルがわからないようであれば、ファイルを最も直感的で相互に近い位置に置くことができれば、大幅な時間の削減となります。理解しやすいフォルダ構成はそのようなにときに役立ちます。

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

  - ファイルを参照したときに、そのファイルが何を含み何をしようとしているか即座に理解できるべきです。

    *なぜ ?*: コードを探し中身をかいつまんで見ている際に費やす時間が少なくなることでより効率的になります。 これはより長いファイル名を求めているのであれば、そうするべきということです。内容をよく表すファイル名を付けて、ファイルの中のコンテンツはたった一つのコンポーネントのみにします。複数のコントローラやサービス、またはそれらが一つのファイルの中で混在することを避けて下さい。 さもなければ、これらはファイル毎に一つのコンポーネントであるというルールを逸脱してしまいます。ルールを守ることで、全てが相互に関係しているような非常に小さい機能の集まりがあったときも、依然としてファイルを簡単に特定することができます。

### Flat
###### [Style [Y143](#style-y143)]

  - できる限りフォルダ構成をフラットに保って下さい。7個以上のファイルがある場合は、分割を検討し始めて下さい。

    *なぜ ?*: ファイルを見つけるために７階層以上のファイルを探したい人はいません。 Webサイトのメニューについて考えると、2つ以上に深い階層には再考の余地があります。 1つのフォルダの構成では、厳格な数のルールは無いですが、フォルダが7-10のファイルから成るときには、サブフォルダを作るときかもしれません。自分が快適であるレベルに基づいて決めれば良いです。 新しいフォルダを作成する明らかな(残りのLIFTに役立つための)レベルまではフラットな構造を使って下さい。

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - DRYにして下さい。だがそれに捉われすぎて可読性を犠牲にしてはいけません。

    *なぜ ?*: DRYであることは大切ですが、決定的に重要なことではありません。もしLIFTの中の何か一方を犠牲にするのであれば、それを私はT-DRYと呼んでいます。一つのビューをsession-view.htmlとタイプしたくはありません。なぜならそれは明らかにビューだからです。 明らかにではない場合もしくは規則による場合、そのように命名します。

**[Back to top](#table-of-contents)**

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  - 実装に関する短期的な視点と長期的なビジョンを持って下さい。言い換えると、小さく始めるが、アプリがどの方向に向かっているかををしっかりと把握することです。 全てのアプリケーションのコードは`app`という名前のルートのディレクトリ配下に置いて下さい。どのコンテンツもファイル毎に一機能として下さい。コントローラ、サービス、モジュール、ビューのそれぞれを独立したファイルにして下さい。全てのサードパーティのベンダーのスクリプトは別のルートのディレクトリの下に置き、`app`ディレクトリ配下には置かないで下さい。私はそのスクリプトを書いていないですし、それが自分のアプリを散らかしてしまうことも望んでいません(`bower_components`, `scripts`, `lib`)。

    Note: この構造の詳細や理由などは[this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/)を参照して下さい。

### Layout
###### [Style [Y151](#style-y151)]

  - アプリケーションの全体のレイアウトを定義するコンポーネントは、`layout`というフォルダの中に置いて下さい。このディレクトリにはビューのテンプレートやナビゲーション、メニュー、コンテンツエリア、その他の場所でコンテナとして振舞うコントローラを含むかもしれません。

    *なぜ ?*: 全てのレイアウトを一箇所に配置することで、アプリケーション全体で再利用可能になります。

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - 特徴を表す名前でフォルダを作成して下さい。フォルダが7つ以上のファイルを含むように肥大化してきた時、それらのためにフォルダを作ることを検討して下さい。人により閾値は違うかもしれないので必要に応じて調整して下さい。

    *なぜ ?*: ディベロッパーがコードを配置し、一目見ただけでそれぞれのファイルが何をしているかが理解できます。またできる限りフラットな構造を保つことで、重複も無駄の無い名前にすることができます。

    *なぜ ?*: LIFTのガイドラインが全てカバーされます。

    *なぜ ?*: コンテンツを整理しLIFTのガイドラインに沿って維持し続けることで、アプリが散らかってしまうことを避けることができます。

    *なぜ ?*: 大量のファイル(10個以上)があるときに、それらを一貫性の取れたフォルダに配置することは簡単ですが、フラットな構造で配置するのは難しいでしょう。

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

      ![Sample App Structure](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-2.png)

      Note: folders-by-typeを使って構造化をしてはいけません。一つの機能が、5、10、25以上のビューやコントローラ(また他の機能)からなるときにアプリが肥大化してきます。そのとき複数のフォルダに移動する必要がありますが、ファイルを配置するのはfolder-by-featureよりも難しいでしょう。

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

  - 一つの責任をカプセル化した小さいモジュールを作って下さい。

    *なぜ ?*: モジュール化されたアプリケーションは、開発チームがアプリケーションの垂直なスライスを簡単に組み立てインクリメンタルにロールアウトすることができます。 つまり開発した新しい機能をプラグイン化することができます。

### Create an App Module
###### [Style [Y161](#style-y161)]

  - 全てのモジュールと機能を統合することを担うアプリケーションのルートなるモジュールを作って下さい。これにアプリケーション名をつけて下さい。

    *なぜ ?*: Angularはモジュール化と分割のパターンを推奨しています。他のモジュールを結びつけるアプリケーションのルートモジュールを作ることは、 モジュールの追加や削除を行う簡単な方法を与えます。

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - アプリケーションのモジュールの中でロジックは統合する箇所にのみに置いて下さい。それぞれのモジュールの中の機能はそのままにして下さい。

    *なぜ ?*: アプリケーションのルートにリモートのデータ取得、ビューの表示、もしくはアプリケーションに統合と関係のない他のロジックなどの役割を加えることは、アプリをより混沌とさせ、機能のセットを再利用もしくは無効にすることをより難しくします。

    *なぜ ?*: ルートのモジュールは、どのモジュールがアプリケーションを構成するかを記述するマニュフェストになります。

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - 再利用可能で共有される機能エリアでモジュールを作成して下さい。レイアウトのように、サービスやダッシュボード、アプリケーションスペシフィックな機能(例えば、カスタマー、アドミン、セールス)がそれに該当します。

    *なぜ ?*: 自己完結型のモジュールは衝突が少ないか全く無い形でアプリケーションに追加することができます。

    *なぜ ?*: スプリントやイテレーション中は機能エリアにフォーカスし、スプリントやイテレーションの終わりでは、それらの機能をオンにできます。

    *なぜ ?*:機能エリアでモジュールに分割することで、コードの分離と再利用が可能となり、モジュールのテストが容易になります。

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - 再利用可能なアプリケーションのブロックでモジュールを作成して下さい。例外のハンドリング、ログ、ダイアグ、セキュリティ、ローカルデータの退避のような共通のサービスがそれに該当します。

    *なぜ ?*: これらの機能は多くのアプリケーションで必要となり、それぞれモジュールとして分離し続けることによって、ジェネリックになりアプリケーション間で再利用可能となります。

### Module Dependencies
###### [Style [Y165](#style-y165)]

  - ルートのモジュールは、アプリケーションスペシフィックなモジュールや共有または再利用されるモジュールに依存します。

    ![Modularity and Dependencies](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-1.png)

    *なぜ ?*: メインのアプリケーションのモジュールは、アプリケーションの機能を素早く特定可能なマニュフェストを含みます。

    *なぜ ?*: それぞれの機能エリアはそれが何と依存しているかを示したマニフェストを含んでいます。そのお陰で機能エリアは依存性を取得することができ、例え他のアプリケーションの中であっても動作します。

    *なぜ ?*: データを共有するサービスのようなアプリ内の機能は、`app.core`(このモジュールは好きな名前を選んで下さい)のようにまとめることで、簡単に位置を特定または共有することが可能です。

    Note: これは一貫性のためのストラテジーです。ここには多くの良いオプションがあります。Angularの依存のルールに沿って一貫性をとるためにその一つを選ぶことで メンテナンスしスケールさせることが容易になります。

    > 　私のストラクチャはプロジェクト間で少しだけ変わっていますが、ストラクチャやモジュール化に関してはこのガイドラインに沿っています。実装は、機能やチームに依存して変わるかもしれません。言い換えれば、同等のストラクチャにこだわってるのではなく、一貫性やメンテナンス性、効率性を念頭に置いて正しいことを行うということです。

    > 小さいアプリでは、共有される全ての依存を機能的なモジュールと直接的な依存を持たないモジュールの中に入れてしまうことも検討して下さい。この方法は、小さいアプリケーションのメンテナンスをより容易にしますが、アプリの外からそのモジュールを再利用することは難しくなります。

**[Back to top](#table-of-contents)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - angularのアプリが走る前にコンフィグが設定される[module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies)のコードを注入して下さい。 providerやconstantsが含まれるのが理想的です。

    *なぜ ?*: コンフィグレーションをする箇所がより少なくなります。

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

  - アプリケーションが起動されるときに実行されるどのコードもファクトリで宣言され、関数経由で公開され、[run block](https://docs.angularjs.org/guide/module#module-loading-dependencies)として注入されるべきです。

    *なぜ ?*: コードをrunのブロックに直接いれてしまうとテストするのが難しくなります。ファクトリに置くことで抽象化しモック化することが容易になります。

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

  -  `document`と`window`の代わりに[`$document`](https://docs.angularjs.org/api/ng/service/$document)と[`$window`](https://docs.angularjs.org/api/ng/service/$window)を使って下さい。

    *なぜ ?*: これらのサービスはAngularによってラップされているので、直接documentやwindowを使うよりはテスタブルになります。これにより自分自身でdocumentやwindowをモックすることを避けることができます。

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - `setTimeout` と `setInterval`の代わりに[`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout)と[`$interval`](https://docs.angularjs.org/api/ng/service/$interval)を使って下さい。

    *なぜ ?*: これらのサービスはAngularによってラップされているのでよりテスタブルになります。またAngularのdigestのサイクルでハンドルされるので、データバインディングが同期され続けます。

**[Back to top](#table-of-contents)**

## Testing
単体テストはクリーンなコードを維持するのに役立ちます。より詳細な情報は、私のお薦めするいくつかの単体テストの基礎をリンク付きで紹介しています。

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - 全てのストーリーのテストを書いて下さい。 空のテストから始めてストーリ毎にコードを書き中身を埋めて下さい。

    *なぜ ?*: テストのデスクリプションを書くことは、ストーリが何をして、何をしないのか、何をもって成功とみなすのかを明確に定義するのに役立ちます。

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

  - 単体テストには [Jasmine](http://jasmine.github.io/) もしくは [Mocha](http://mochajs.org) を使って下さい。

    *なぜ ?*: Jasmine と Mocha はAngularのコミュニティで幅広く使われています。双方とも安定しており、十分メンテされており、ロバストなテスト機能が与えられます。

    Note: Mochaを用いるときは、合わせて[Chai](http://chaijs.com)といったアサートのライブラリを選ぶことを検討して下さい。私はMochaを好みます。

### Test Runner
###### [Style [Y192](#style-y192)]

  - テストランナーとしては[Karma](http://karma-runner.github.io)を使って下さい。

    *なぜ ?*: Karmaは一度だけ実行するか、コードが変更されたときに自動的に実行するかを簡単に設定することができます。

    *なぜ ?*: Karmaは自前のテストランナーもしくはGruntやGulpを用いた継続的なインテグレーションのプロセスに容易に接続することができます。

    *なぜ ?*: [WebStorm](http://www.jetbrains.com/webstorm/) や [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225)などのいくつかのIDEはKarmaを統合し始めています。

    *なぜ ?*: Karmaは[Grunt](http://www.gruntjs.com) (と [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com) (と [gulp-karma](https://github.com/lazd/gulp-karma))といった自動化のタスク上で正しく動作します。

### Stubbing and Spying
###### [Style [Y193](#style-y193)]

  - スタブやスパイのために [Sinon](http://sinonjs.org/) を使って下さい。

    *なぜ ?*: SinonはJasminとMochaと一緒に正しく動作し、スタブやスパイの機能を拡張します。

    *なぜ ?*: もしJasmineとMochaの両方を試したければ、Sinonはそれらを簡単に切り替えることができます。

    *なぜ ?*: テストがアサーションに失敗したときにSinonは叙述的なメッセージとなります。

### Headless Browser
###### [Style [Y194](#style-y194)]

  - サーバ上でテストを実行するときは [PhantomJS](http://phantomjs.org/) を使って下さい。

    *なぜ ?*: PhantomJSはヘッドレスブラウザであり、"visual"なブラウザを必要とすることなくテストを実行するのに役立ちます。 ChromeやSafari、IEや他のブラウザをサーバにインストールする必要はありません。

    Note: それでも尚、ターゲットとなるユーザの環境で全てのブラウザ上でテストをするべきです。

### Code Analysis
###### [Style [Y195](#style-y195)]

  - テスト上でJSHintを実行して下さい。

    *なぜ ?*: テストもコードです。JSHintはテストが正しく動作しないかもしれないコードの品質の問題を特定するのに役立ちます。

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - 　テストコードでは、`describe`や`expect`といった共通のグローバルな変数を許すようにルールを緩めて下さい。

    *なぜ ?*: テストもコードであり、プロダクションのコードと同様に注意が払われ、コードの品質のルールが必要となります。しかしながら、テストのフレームワークで用いられるグローバル変数は、例えば、テストのスペックに以下を含むことによって緩められます。 Mochaが行っているように式にもルールを緩めて下さい。

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Or you can add the following to your JSHint Options file.

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Testing Tools](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/testing-tools.png)

### Organizing Tests
###### [Style [Y197](#style-y197)]

  - 単体テストのファイル(スペック)はクライアントコードと横並びで置いて下さい。サーバのインテグレーションや複数のコンポーネントのテストをカバーするスペックは`tests`のフォルダに置いて下さい。

    *なぜ ?*: 単体テストは特定のコンポーネントとソースファイルに直接の相関があります。

    *なぜ ?*: いつも見えるところにそれらを置いて最新にしておく方がより簡単です。 TDDか開発中にテストをするか開発後にテストするに関わらず、コーディングをするときは、スペックが横に並びにあり、見えなくなることも気にならなくなることもないようにして下さい。こうすることで、よりメンテナンスされるようになり、コードのカバレッジも上がるでしょう。

    *なぜ ?*: ソースコードをアップデートするとき、同時にテストもアップデートした方が簡単です。

    *なぜ ?*: 横並びに置くことは見つけることを簡単にしソースを移動するときに合わせて動かすことができます。

    *なぜ ?*: 近くにスペックファイルを置くことは、ソースコードのリーダーがそのコンポーネントがどのように使われるかを学ぶことや既知の制限が簡単に知ることが容易となります。

    *なぜ ?*: gruntやgulpを使えば配布用のビルドに含まれないようにスペックを分割することは簡単です。

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

  - ビューや主要なビュジアルの要素で、ステート間を遷移するために、さりげない[animations with Angular](https://docs.angularjs.org/guide/animations)を使って下さい。[ngAnimate module](https://docs.angularjs.org/api/ngAnimate)を含めて下さい。三つの鍵はさりげなさ、スムーズさ、そしてシームレスです。

    *なぜ ?*: さりげないアニメーションは、適切に使われることでユーザエクスペリエンスを改善します。

    *なぜ ?*: さりげないアニメーションは、ビューの遷移の際に感じるパフォーマンスを改善します。

### Sub Second
###### [Style [Y211](#style-y211)]

  - デュレーションの短いアニメーションを使って下さい。私は大体300ミリ秒からはじめて適切なところまで調整します。

    *なぜ ?*: 長いアニメーションはアプリケーションが遅い印象を与え、ユーザエクスペリエンスや体感のパフォーマンス上では逆効果になります、

### animate.css
###### [Style [Y212](#style-y212)]

  - 慣習的なアニメーションには[animate.css](http://daneden.github.io/animate.css/)を使って下さい。

    *なぜ ?*: animation.cssが提供するアニメーションは速く、スムーズで、アプリケーションへの追加が容易です。

    *なぜ ?*: アニメーションに一貫性を持たせます。

    *なぜ ?*: animate.cssは広く利用されておりテストされています。

    Note: この[Matias NiemeläによるAngularのアニメーションの素晴らしいポスト](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)を見て下さい。

**[Back to top](#table-of-contents)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

  - もしドキュメントの作成を計画しているのなら、関数名、説明、引数、そして戻り値を記述するために[`jsDoc`](http://usejsdoc.org/)のシンタックスを使って下さい。アプリケーションの構造に合わせて`@namespace`や`@memberOf`を使って下さい。

    *なぜ ?*: フルスクラッチでドキュメントを書く代わりに、コードからドキュメントを生成(再生成)できます。

    *なぜ ?*: 共通の生産性の高いツールを使うことで一貫性を保てます。

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

  - JavaScriptのコードにlintをかけるためにJS Hintを使って下さい。JS Hintのオプションを必ずカスタマイズしてソースコード管理に含めて下さい。詳細なオプションは[JS Hint docs](http://www.jshint.com/docs/)を参照して下さい。

    *なぜ ?*: ソース管理にコードをコミットする前に最初にアラートが上がります。

    *なぜ ?*: チームに一貫性が生まれます。

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

  - コーディングスタイルをチェックするためにJSCSを使って下さい。 JSCSのオプションファイルを必ずカスタマイズし、ソースファイル管理に含めるようにして下さい。詳細なオプションは、[JSCS docs](http://www.jscs.info)を参照して下さい。

    *なぜ ?*: ソースコード管理にファイルを込みとする前に最初のアラートが上がるようになります

    *なぜ ?*: あなたのチームに一貫性が生まれます。

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

        "validateJSDoc": {
            "checkParamNames": true,
            "requireParamTypes": true
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

  - vendorのライブラリのグローバル変数のためにAngularの定数を作って下さい。

    *なぜ ?*: グローバルになってしまうvendorのライブラリを注入するための方法を与えます。 これによりコンポーネントが持っている依存性をより簡単に把握することで(抽象性の破綻を避け)、コードのテスタビリティが改善されます。さらに理にかなうように、これらのコンポーネントをモックでテストできるようになります。

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

  - 変更されず他のサービスに依存しない値のために定数を使って下さい。定数が複数のアプリケーションで再利用されるモジュールだけに使われるときは、モジュールの後ろに定数とわかるファイル名でモジュール毎にファイル定数を置いて下さい。これが必要となるまでは、メインモジュールの`constants.js`のファイルに定数を置いて下さい。

    *なぜ ?*: 変更されるかもしれない値は、たとえ頻繁でなかったとしてもサービスから取得されるべきです。そうすることでソースコードを変更する必要がなくなります。例えば、データサービスのためのURLを定数で置くときは、Webサービスからロードする方がより良い場所になるでしょう。

    *なぜ ?*: 定数はプロバイダーを含めたAngularのコンポーネントの中に注入可能です。

    *なぜ ?*: アプリケーションが他のアプリケーションからも再利用される可能性のあるモジュールに分割されるときに、依存のある定数をそれぞれのモジュール上で保持することで、モジュールが単独で定数を運用できるようにするべきです。

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

一貫性のあるスタイルやパターンに従うため、ファイルテンプレートもしくはスニペットを使って下さい。ここにいくつかのWeb開発のエディターやIDEsのためのテンプレート、もしくはスニペットがあります。

### Sublime Text
###### [Style [Y250](#style-y250)]

  - 本スタイルやガイドラインに沿ったAngularのスニペット

    - [Sublime Angular snippets](assets/sublime-angular-snippets?raw=true)をダウンロード
    - Packagesフォルダに置く
    - Sublimeを再起動
    - JavaScriptのファイルのタイプで`TAB`に続いて下記のコマンドを打ちます。

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

  - 本スタイルやガイドラインに沿ったAngularのファイルのテンプレートが[SideWaffle](http://www.sidewaffle.com)で公開されています。

    -  [SideWaffle](http://www.sidewaffle.com) で Visual Studio extension (vsixファイル) をダウンロード
    - vsixファイルを実行
    - Visual Studioの再起動

### WebStorm
###### [Style [Y252](#style-y252)]

  - 本スタイルやガイドラインに沿ったAngularスニペットとファイルテンプレート。WebStormのsettingsへインポートできます。

    - [WebStorm Angular file templates and snippets](assets/webstorm-angular-file-template.settings.jar?raw=true)をダウンロード
    - WebStormを開き、 `File`メニューを開く
    - メニューオプションから`Import Settings`を選ぶ
    - ファイルを選択し、`OK`をクリック
    - JavaScriptのファイルタイプで`TAB`に続いて下記のコマンドを打ちます。

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

### Atom
###### [Style [Y253](#style-y253)]

  - 本スタイルとガイドラインに沿ったAngularスニペット
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    - Atomを開き、Package Managerを開く (Packages -> Settings View -> Install Packages/Themes)
    - 'angularjs-styleguide-snippets'のパッケージを検索
    - パッケージをインストールするために'Install'をクリック

  - JavaScriptのファイルタイプで、`TAB`に続いて下記のコマンドを打ちます。

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

  - 本スタイルとガイドラインに沿ったAngularのスニペット
    - [Brackets Angular snippets](assets/brackets-angular-snippets.yaml?raw=true)をダウンロード
    - Brackets Extension マネージャー ( File > Extension manager )
    - ['Brackets Snippets (by edc)'](https://github.com/chuyik/brackets-snippets)をインストール
    - bracketsの右側にある電球をクリック
    - `Settings`をクリックして`Import`
    - ファイルを選択してChoose the file and select to skip or override
    - `Start Import`をクリック

  - JavaScriptのファイルタイプで`TAB`に続いて下記のコマンドを打ちます。

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
    ngstate      // creates an Angular UI Router state defintion
    ngconfig     // defines a configuration phase function
    ngrun        // defines a run phase function
    ngroute      // defines an Angular ngRoute 'when' definition
    ngtranslate  // uses $translate service with its promise
    ```

### vim
###### [Style [Y255](#style-y255)]

  - 本スタイルやガイドラインに沿ったvimのスニペット

    - [vim Angular snippets](assets/vim-angular-snippets?raw=true)をダウンロード
    - [neosnippet.vim](https://github.com/Shougo/neosnippet.vim)をセット
    - スニペットをsnippetディレクトリにコピー

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter
    ```
**[Back to top](#table-of-contents)**

## Yeoman Generator
###### [Style [Y260](#style-y260)]

このスタイルガイドに沿ったAngularのアプリケーションを作る良いスタートポイントとして、[HotTowel yeoman generator](http://jpapa.me/yohottowel)を使うことができます。

1. generator-hottowelをインストール

  ```
  npm install -g generator-hottowel
  ```

2. 新規フォルダを作成し、そのディレクトリに移動

  ```
  mkdir myapp
  cd myapp
  ```

3. ジェネレータの実行

  ```
  yo hottowel helloWorld
  ```

**[Back to top](#table-of-contents)**

## Routing
ビューと数多くの小さいテンプレートおよびディレクティブを持つビューの組み合わせからなるビューの間のナビゲーションのフローを作るために、クライアントサイドのルーティングは重要です。

###### [Style [Y270](#style-y270)]

  - クライアントサイドのルーティングには[AngularUI Router](http://angular-ui.github.io/ui-router/) を使って下さい。

    *なぜ ?*: UI RouterはAngularのルーターが持つ全ての機能プラス、ネスト化されたルーティングやステートなどいくつかの追加機能があります。

    *なぜ ?*: シンタックスはAngularのルータと非常に似ており、UI Routerへ容易に移行できます。
  - Note: 以下に示されるように`routerHelperProvider`のようなプロバイダーを用いることができます。それはrunフェーズでファイルを跨ってstateを設定する際に役立ちます。

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

  -  ビューが存在するモジュールの中でビューのためのルーティングを定義して下さい。それぞれのモジュールはモジュール内のビューのためのルーティングを含むべきです。

    *なぜ ?*: それぞれのモジュールが独立して成り立つべきである。

    *なぜ ?*: モジュールの削除と追加が行われるときに、アプリケーションは存在するビューを示すルーティングだけを含むでしょう。

    *なぜ ?*: このことは親のないルーティングが出来てしまう懸念を持たずに、アプリケーションの一部分を有効にしたり無効にしたりするのを簡単にします。

**[Back to top](#table-of-contents)**

## Task Automation

自動タスクの生成に[Gulp](http://gulpjs.com)または[Grunt](http://gruntjs.com)を使って下さい。Gulpはコンフィグレーションをコーディングでリーンに行えます。一方で、Gruntはコードをコンフィグレーションでリーンに行うことができます。個人的には読みやすくまた書きやすいGulpを好みますが両者とも素晴らしいです。

> 私の[Gulp Pluralsight course](http://jpapa.me/gulpps)でGulpについてやタスクの自動化についてより学ぶことができます。

###### [Style [Y400](#style-y400)]

  - その他全てのアプリケーションのJavaScriptファイルに先立って、モジュール定義ファイルの`*.module.js`をリスト化する自動化タスクを使って下さい。

    *なぜ ?*: Angularはそれらが使用される前にモジュール定義を登録する必要があります。

    *なぜ ?*: `*.module.js`のように特定のパターンで命名されたモジュールは、容易にグラブしさらにリストの先頭で列挙することができます。

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

  - 複雑なオブジェクトグラフの全てプロパティをスキャンするようなフィルタの使用を避けて下さい。選ばれたプロパティに対してフィルタを用いて下さい。

    *なぜ ?*: フィルタは簡単に誤用されます。適切に用いられない場合、例えばフィルタが大きくて深いオブジェクトのグラフを読みだす時などパフォーマンス上にネガティブな効果があります。

**[Back to top](#table-of-contents)**

## Angular docs
その他の情報、APIリファレンス、については、[Angular documentation](//docs.angularjs.org/api)をチェックして下さい。

## Contributing

Open an issue first to discuss potential changes/additions. If you have questions with the guide, feel free to leave them as issues in the repository. If you find a typo, create a pull request. The idea is to keep the content up to date and use github’s native feature to help tell the story with issues and PR’s, which are all searchable via google. Why? Because odds are if you have a question, someone else does too! You can learn more here at about how to contribute.

*By contributing to this repository you are agreeing to make your content available subject to the license of this repository.*

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
