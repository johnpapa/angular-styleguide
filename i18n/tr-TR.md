# Angular Stil Rehberi

*[@john_papa](//twitter.com/john_papa)'dan Takımlar için seçeneklendirilmiş stil rehberi*

Eğer Angular projeleriniz için seçeneklendirilmiş bir sintaks, yöntem ve yapılandırma rehberi arıyorsanız, buyrun gelin. Bu stiller benim [Angular](//angularjs.org) sunumlarım, [Pluralsight eğitim kurslarım](http://pluralsight.com/training/Authors/Details/john-papa) ve takım çalışmalarımdan edindiğim deneyimlerle oluşturulmuştur.

Bu rehberin amacı, kullandığım yöntemleri göstererek, hatta daha önemlisi neden bu yöntemleri seçtiğimi açıklayarak, Angular aplikasyonlarınızı geliştirirken size yol göstermektir.

>Eğer bu rehberi beğendiyseniz, [Angular Patterns: Clean Code](http://jpapa.me/ngclean) isimli kursuma Pluralsight sitesinden bir bakın. Bu rehberle pekiltirici olacaktır.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Topluluğun Aşmışlığı ve Referanslar
Asla izole olarak çalışmayın. Angular topluluğunu, deneyimlerini paylaşma konusunda tutukulu buluyorum. Örneğin, arkadaşım ve bir Angular uzmanı Todd Motto ile birçok stil ve yöntem üzerinde işbirliği yaptık. Birçoğunda hemfikir olduk, birkaçında farklı yollar izledik. [Todd'un rehberi'ni](https://github.com/toddmotto/angularjs-styleguide) de onun yaklaşımını anlamak ve karşılaştırma yapmak için incelemenizi öneririm

Bir çok yöntem [Ward Bell](http://twitter.com/wardbell) ile yaptığımız eşli programlama seanslarında ortaya çıktı. Arkadaşım Ward bu rehberin nihai evrimine büyük katkılarda bulundu.

## Örnek uygulama üzerinde yöntemler
Bu rehber *ne*, *neden* ve *nasıl* sorularına odaklanırken, yöntemleri deneyimlemenin yardımcı olacaığını düşünüyorum. Bu rehbere, bu rehberdeki yöntemleri ve tasarım desenlerini kullanan örnek bir uygulama eşlik ediyor. Bu uygulamayı [burada](https://github.com/johnpapa/ng-demos), `modular` klasörünün altında bulabilirsiniz. Üzerinde denemeler yapmaktan çekinmeyin. [Çalıştırma talimatları readme dosyasındadır](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Çeviriler
[Bu Angular rehberinin çevirileri](https://github.com/johnpapa/angular-styleguide/tree/master/i18n) gönüllü yardımcılar tarafından sağlanmaktadır

## İçerik

  1. [Tek İşlevsellik](#single-responsibility)
  1. [IIFE](#iife)
  1. [Modüller](#modules)
  1. [Kontrolörler (Controller)](#controllers)
  1. [Servisler](#services)
  1. [Factory'ler](#factories)
  1. [Veri Servisleri](#data-services)
  1. [Direktifler (Directives)](#directives)
  1. [Promise'leri Kontrolörler için çözümleme](#resolving-promises-for-a-controller)
  1. [Bağımlılık yerleştirmesinin manüel anotasyonu](#manual-annotating-for-dependency-injection)
  1. [Sıkıştırma ve Anotasyon](#minification-and-annotation)
  1. [Kuraldışı durum işleme](#exception-handling)
  1. [İsimlendirme](#naming)
  1. [Uygulama yapısı ve LIFT Prensibi](#application-structure-lift-principle)
  1. [Uygulama Yapısı](#application-structure)
  1. [Modülerlik](#modularity)
  1. [Başlangıç Mantığı](#startup-logic)
  1. [Angular $ sarmalayıcı servisleri](#angular--wrapper-services)
  1. [Testler](#testing)
  1. [Animasyonlar](#animations)
  1. [Yorumlar](#comments)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Sabit değerler](#constants)
  1. [Dosya Şablonları ve Snippetler](#file-templates-and-snippets)
  1. [Yeoman ana yapı üreticisi](#yeoman-generator)
  1. [Yönlendirme](#routing)
  1. [Görev Otomasyonu](#task-automation)
  1. [Filtreler](#filters)
  1. [Angular Docs](#angular-docs)
  1. [Katkıda bulunmak](#contributing)
  1. [Lisans](#license)

## Tek İşlevsellik

### Kural 1
###### [Stil [Y001](#style-y001)]

  - Her dosyaya yalnızca bir komponent tanımlayın.
  Göreceğimiz örnek `app` modülünü ve bağımlılıklarını, konrolörünü ve fabrikasını aynı dosyada tanımlıyor.
  
  ```javascript
  /* sakınılacak stil */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```
  
  Bu örnekte ise aynı komponentler farklı dosyalara ayrılmış durumdalar

  ```javascript
  /* önerilen stil */

  // app.module.js
  angular
      .module('app', ['ngRoute']);
  ```

  ```javascript
  /* önerilen stil */

  // someController.js
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* önerilen stil */

  // someFactory.js
  angular
      .module('app')
      .factory('someFactory', someFactory);

  function someFactory() { }
  ```

**[İçerik Listesi](#icerik-listesi)**

## IIFE
### JavaScript Kapsamları(Closures)
###### [Stil [Y010](#style-y010)]
  - Angular komponentlerinizi Hemen Çalışan Fonksiyon İfadeleri (HÇFİ) ile kapsayın 
  > *Not: Hemen Çalışan Fonksiyon İfadeleri İngilizcede (Immediately Invoked Function Expression) olarak geçer. Bu fonksiyon bloğu içerisinde kalan kısım, tanımlanmasının ardından hemen çalıştırılır, fonksiyonun çağrılmasını beklemez* 

  *Neden?*: HÇFİ değişkenleri evrensel olarak tanımlanmaktan çıkarır. Bu yöntem değişkenlerin ve fonksiyonların evrensel olarak beklenenden daha uzun tanımlı kalmasını ve aynı isimde olan değişken ve fonksiyonlarla çakışmasını engeller. 
  
  *Neden?*: Kodunuz sıkıştırıldığı zaman ve üretim ortamın için tek bir javascript dosyası halinde paketlendiğinde, birçok yerel ve evrensel değişken için çakışma hataları alabilirsiniz. HÇFİ sizi bu çakışmalara karşı korur ve her dosya için kendi değişken kapsamını tanımlar.

  ```javascript
  /* sakınılacak stil */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // logger fonksiyonu evrensel olarak tanımlanıyor
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // storage fonksiyonu evrensel olarak tanımlanıyor
  function storage() { }
  ```

  ```javascript
  /**
   * önerilen stil
   *
   * evrensel tanımlamamız yok
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

  - Not: Dökümanın sadeliğini korumak namına, bundan sonraki örneklerin HÇFİ fonksiyonları içinde tanımlandığını farzedin. 

  - Not: HÇFİ'ler test kodunuzun fonksiyona özel değişkenlere erişmenizi engeller (Regular Expression, Yardımcı fonksiyonlar gibi). O yüzden bu fonksiyonları kendi başlarına test etmek daha iyidir. Ama yine de bu özel fonksiyonları komponentin dışından erişilebilir kılarak test edebilirsiniz.

**[İçerik Listesi](#icerik-listesi)**

## Modüller

### İsim Çakışmalarından Kaçının
###### [Stil [Y020](#style-y020)]

  - Alt modüller için eşsiz isimlendirme yöntemleri kullanın.

  *Neden?*: Eşsiz isimler modül isimlerinin çakışmasını engeller. Ayraçlar modüller ve alt modüller arasındaki hiyerarşiyi kurmaya yardımcı olur. Örneğin `app` sizin ana modülünüz olsun. `app.dashboard` ve `app.users` modülleri alt modülleriniz olur ve `app` modülüne bağımlılık olarak eklenirler.

### Modül Tanımlama Yöntemi (Setters)
###### [Stil [Y021](#style-y021)]

  - Modüllerinizi bir değişkene atama yapmadan setter sintaksını kullanarak tanımlayın.

  *Neden?*: Her komponent için bir dosya yöntemi ile, nadiren modülünüzü bir değişkene atama ihtiyacı hissedersiniz. 

  ```javascript
  /* kaçınılacak stil */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Setter sintaksı kullanımı

  ```javascript
  /* önerilen stil */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Modüle Ulaşma Yöntemi
###### [Stil [Y022](#style-y022)]

  - Modülünüze ulaşıp kullanırken değişkene atamak yerine getter sintaksını zincirleyerek kullanın.

  *Neden?*: Bu yöntem kodunuzu daha okunabilir kılar ve değişken çakışmalarını ve sızıntılarını engeller.

  ```javascript
  /* kaçınılacak stil */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* önerilen stil */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Yaratma ve Kullanma
###### [Stil [Y023](#style-y023)]

  - Modülünüzü sadece bir kere yaratın ve diğer durumlar için getter sintaksını kullanın.

  *Neden?*: Modül sadece birkere yaratılmalıdır. Sonrasında bu yaratılan modül kullanılırç

  ```javascript
  /* önerilen stil */

  // modül yaratılır
  angular.module('app', []);

  // modül kullanılır
  angular.module('app');
  ```

### İsimli ve Anonoim Fonksiyonlar
###### [Style [Y024](#style-y024)]

  - Modülünüzün komponentlerinin fonksiyonlarını isimli fonksiyonlar olarak tanımlayın.

  *Neden?*: Bu yöntem kodunuzu daha okunabilir kılar ve hata ayıklamak için kolaylık sağlar. Ayrcıa iç içe geçmiş fonksiyon bloklarının önüne geçcer.

  ```javascript
  /* kaçınılacak stil */
  angular
      .module('app')
      .controller('Dashboard', function() { })
      .factory('logger', function() { });
  ```

  ```javascript
  /* önerilen stil */

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

**[İçerik Listesi](#icerik-listesi)**

## Kontrolörler (Controllers)

### controllerAs View Sintaksı
###### [Stil [Y030](#style-y030)]

  - [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) sintaksını klasik $scope'lu kntrolöer sintaksına tercih edin. 

  *Neden?*: Kontrolörler `new` kelimesi ile yaratılır ve uygulamanız içerisinde sadece bir örneği bulunur. `controllerAs` yöntemi JavaScript'in constructor yapısına daha yakındır.

  *Nden?*: View katmanında noktalı notasyonun kullanımını teşvik eder. (örneğin `customer.name` yerine `name`). Bu yöntem daha kolay okunur ve referans problemlerinin oluşmasını engeller.

  *Neden?*: İçiçe olan kontrolörlerde veriye ulaşırken `$parent` kullanmanızı engeller.

  ```html
  <!-- kaçınılacak stil -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- önerilen stil -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs Kontrolör Sintaksı
###### [Stil [Y031](#style-y031)]

  - `controllerAs` sintaksını klasik $scope'lu kntrolöer sintaksına tercih edin.

  - `controllerAs` sintaksı kontrolör içerisinde `this` kelimesini kullanır ve $scope'a bağlanırç

  *Neden?*: `controllerAs` `$scope` için bir sintaks süslemedir. Hala View'a bağlayabilir ve `$scope` fonksiyonlarına ulaşabilirsiniz.

  *Neden?*: `$scope` metodlarının bir Factory içerisinde tanımlanıp kontrolör içerisinde çağrılmasındansa, kontrolör içerisinde direk kullanılması eğilimine engel olur. `$scope`'u kontrolör içerisinde sadece ihtiyaç olduğunda kullanın. Örneğin [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) veya [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) kullanırkenö bunları bir factory içine taşıyıp, kontrolör içerisinden çağırın.

  ```javascript
  /* kaçınılan stil */
  function Customer($scope) {
      $scope.name = {};
      $scope.sendMessage = function() { };
  }
  ```

  ```javascript
  /* önerilen stil - ama bir sonraki bölüme bakın */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

### vm ile controllerAs
###### [Stil [Y032](#style-y032)]

  - `controllerAs` sintaksını kullanırken `this` kelimesi için yakalayıcı bir değişken kullanın. `vm` gibi tutarlı bir isim seçin. `vm`, ViewModel'in kısaltılmışıdır.

  *Neden?*: `this` kelimesi kullanıldığı yere göre içeriğini değiştirebilir. Baştan yakalayıcı bir değişkene atayarak hep aynı içeriği tutması sağlanır.

  ```javascript
  /* kaçınılan stil */
  function Customer() {
      this.name = {};
      this.sendMessage = function() { };
  }
  ```

  ```javascript
  /* önerilen stil */
  function Customer() {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function() { };
  }
  ```

  Not: [jshint](http://www.jshint.com/) uyarılarını kodun üstüne yorum ekleyerek engelleyebilirsiniz. Eğer fonksiyonunu UpperCasing yöntemi ile isimlendirdiyse buna ihtiyaç olmaz. Çünkü bu yöntem bu fonksiyonun bir constructor fonksiyonu olduğunu belirtir, ki Angular kontrolörleri de bir constructor fonksiyonudur.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Not: vm değişkenlerini izlerken ($watch) aşağıdaki sintaksı kullanabilirsiniz. (İzleme yaratırken dikkatli olunmalıdır. Çümkü digest cycle'a yük bindrir.)

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

### Bağlanacaklar Yukarı
###### [Style [Y033](#style-y033)]

  - Bağlanacak olan değişkenleri kontrolör fonksiyonuzda aflabetik sıralanmış olarak tepeye koyun. Kod içerisinde dağılmış olarak bırakmayın.

    *Neden?*: Bağlancak değişkenleri tepeye koymak kod okunabilirliğini arttırır ve bir bakışta View'a hangi değişkenlerin bağlanacağını görebilirsiniz.

    *Neden?*: Anonim fonksiyonlar yaratmak hızlı ve kolaydır, ama bu fonksiyonlar bir satırdan fazla olurlarsa okunabilirliği düşürürler. Fonksiyonları bağlanabilir değişkenlerin altında tanımlarsanız (JavaScript'in hoisting özelliği ile yukarı taşınacaklardır) kodun okunması daha kolay olur. 

  ```javascript
  /* kaçınılacak stil */
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
  /* önerilen stil */
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

  Not: Eğer fonksiyon bir satıra sığıyorsa, okunabilirlik etkilenmez ve bağlanacak değişkenlerle beraber tutulabilir. 

  ```javascript
  /* kaçınılacak stil */
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
  /* önerilen stil */
  function Sessions(sessionDataService) {
      var vm = this;

      vm.gotoSession = gotoSession;
      vm.refresh = sessionDataService.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

### Fonksiyon Tanımlamaları ve İmplementasyon Detaylarının Saklanması
###### [Stil [Y034](#style-y034)]

  - Fonksiyon tanımlamalarınızı implementasyon detaylarını saklamak için kullanın. View'a bağlanacak öğeleri yukarıda tanımlayın. Kontrolörünüzde bir fonksiyonu bağlama ihtiyacı hissettiğinizde, bu öğeyi bir fonksiyon tanımlamasına eşitleyin. Fonksiyonun implementasyon detaylarını kodun ileriki satırlarında yapın. Bu direk olarak "Bağlanacaklar Yukarı" başlığı ile ilintili. Daha fazla detay için bu [makaleme](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) bakabilirsiniz.

    *Neden?*: Bağlanacak öğeleri yukarı taşımak okumayı kolaylaştırır ve kontrolöer içerisinde hangi öğelerin View'a bağlandığını anında görmemizi sağlar.

    *Neden?*: Fonksiyonun implementasyonunu dosya içerisinde daha aşağılara taşımak kompleks kısımları göz önünden uzak tutar ve asıl önemli olan kısma odaklanmayı sağlarç 

    *Neden?*: Fonksiyon tanımlamaları(declerations) JavaScript'in *hoisting* özelliğinden faydalandığı için fonksiyonun tanımlamasından önce çağrılmasından endişe duymaya gerek yoktur. (Fonksiyon eşitlemeleri(expression) için bu durum geçerli değildir)

    *Neden?*: Fonksiyon tanımlamaları ile değişkenlerin yerlerini değiştirirken kodunuz kırılır mı diye endişe duymaya gerek yoktur. 

    *Neden?*: Fonksiyon eşitlemelerinde sıra önemlidir.

  ```javascript
  /**
   * kaçınılacak stil
   * Fonksiyon eşitlemeleri kullanmak.
   */
  function Avengers(avengersService, logger) {
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

  Bir önceki örnekte önemli olan noktaların kod içerisinde nasıld dağıldığına dikkat edin. Aşağıdaki örnekte, önemli olan kısım yukarıda toplanmıştır. Örneğin, kontrolöere bağlı `vm.avengers` ve `vm.title` öğeleri. İmplementasyonun detayları aşağıda yer alıyor. Kodu okumak böyle daha kolay.

  ```javascript
  /*
   * önerilen stil
   * Fonksiyon tanımlamaları kullanarak
   * bağlanacakları yukarı taşımak.
   */
  function Avengers(avengersService, logger) {
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

### Mantıksal kodu Kontrolörlerden Servislere Kaydırın
###### [Style [Y035](#style-y035)]

  - Kontrolör içerisindeki mantıksal kodu servisler ve factory'ler aracılığıyle yönetin. 

    *Neden?*: Mantıksal kod servislere taşınırsa farklı kontrolörlerde tekrar terkrar kullanılabilir.

    *Neden?*: Servise taşınmış mantıksal kod daha kolay test edilebilir ve kontrolör içerisinde kolayca taklit edilebilir(mocking)

    *Neden?*: Kontrolörden bağımlılıkları kaldırır ve implementasyon detaylarını gizler.

    *Neden?*: Kontrolörü kısa ve öz tutar.

  ```javascript

  /* kaçınılacak stil */
  function Order($http, $q, config, userInfo) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;

      function checkCredit() {
          var settings = {};
          // Konfigürasyonlardan URL'yi al
          // Gerekli header'ları belirler
          // URL'yi gerekli parametrelerle hazırla
          // Kullanıcıyı belirleyecek veriyi ekle ki bu kullanıcı için doğru limit bulunsun
          // CORS desteklemeyen tarayıcılar için JSONP kullan
          return $http.get(settings)
              .then(function(data) {
               // Response ile gelen JSON objesinden maksimum kalan tutarı al
                 vm.isCreditOk = vm.total <= maxRemainingAmount
              })
              .catch(function(error) {
                 // Hatayı işlet
                 // Tekrar dene? Başka bir servisi dene?
                 // Kullanıcıya anlayabileceği uygun bir hata göster
              });
      };
  }
  ```

  ```javascript
  /* önerilen stil */
  function Order(creditService) {
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

### Kontrolörün Odağını Koruyun
###### [Stil [Y037](#style-y037)]

  - Bir kontrolörü bir view tanımlayın ve başka view'lar için kullanmaya çalışmayın. Onun yerine tekrar kullanılabilir mantıksal kodu farcory'lere taşıyıp, kontrolörü sade ve view'a odaklı bırakın.

    *Neden?*: Kontrolörleri değişik view'larla birlikte kullanmak kodu kırılgan yapar ve iyi bir uçtan uca test kapsamı için kararlılık gereklidir.

### Kontrolör Atamaları
###### [Stil [Y038](#style-y038)]

  - Eğer bir kontrolör bir view ile eşleşmek zorunda ise ve o view başka kontrolörler tarafından da kullanılıyorsa, o zaman kontrolörü router serviyesinde tanımlayın.

    Not: Eğer view router dışında başka biryerden yükleniyorsa, view içerisinde `ng-controller="Avengers as vm"` sintaksını kullanın.

    *Neden?*: Kontrolörü router ile eşlemek, farklı route'ların farklı kontrolör ve view eşlerini çağırmasına olanak sağlar. Eğer kontrolör [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController) yöntemi kullanılarak view ile eşlendiyse, o view hep o kontrolörü kullanacaktır.

 ```javascript
  /* kaçınılacak stil */

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
  /* önerilen stil */

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

**[İçerik Listesi](#icerik-listesi)**

## Servisler

### Singleton
###### [Stil [Y040](#style-y040)]

  - Servisler `new` kelimesi ile yaratılır, Paylaşımlı metod ve değişkenler için `this` kelimesini kullanın. Servisler Factory'lere çok benzedikleri için, tutarlılık açısından servisler yerine factory kullanın.
  
    Not: [Bütün Angular servisleri singleton yapıdadır](https://docs.angularjs.org/guide/services). Bu yaratılan servisin aynı anda tek bir örneğinin injectörler tarafından kullanıldığı anlamına gelir.

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

**[İçerik Listesi](#icerik-listesi)**

## Factory'ler

### Tek Sorumluluk
###### [Stil [Y050](#style-y050)]
  
  - Factory'lerin tek sorumluluğu olmalıdır [single responsibility](http://en.wikipedia.org/wiki/Single_responsibility_principle), ve kendi içeriğini kapsamalıdır. Factory sorumluluğunun dışına taşmaya başlarsa, bu yeni sorumluluk için ayrı bir factory yaratılmalıdır.

### Singleton
###### [Stil [Y051](#style-y051)]
  
  - Factoryler singleton yapıdadır ve servisin metodları ve değişkenlerinin bulunduğu objeleri dönerler.

    Not: [Bütün Angular servisleri singleton yapıdadır](https://docs.angularjs.org/guide/services).

### Ulaşışabilirler Yurkarı!
###### [Style [Y052](#style-y052)]
  
  - Servisin çağrılabilen metodlarını  [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) yapısını kullanarak kodun tepesinde tanımlayın.

    *Neden?*: Çağrılabilen metodları kodun tepesinde tanımlamak okunabilirliği arttırır ve bir bakışta bu servisin hangi metodlarının dışarıdan çağırılabileceğini anlamamıza yardımcı olur. Ayrıca hangi metodların unit testlerinin yazılması gerektiği hakkında fikir verir.

    *Neden?*: Bu yöntem özellikle dosya uzamaya başladığında daha da yardımcı olur. Hangi metodların çağrılabilir olduğunu görmek için aşağıya kadar kaymamızı engeller.

    *Neden?*: Fonksiyonları olduğu yerde tanımlamak kolay olabilir, ama fonksiyonlar bir satırdan daha uzun olmaya başladıklarında okunabilirliği azaltırlar ve aşağı doğru daha fazla kaydırma yapmanıza sebep olurlar. Çağrılabilecek metodları tepede tanımlayıp implementasyon detaylarını aşağıda yapmak okunabilirliği arttırır.

  ```javascript
  /* kaçınılacak stil */
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
  /* önerilen stil */
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

  Primitif değerler revealing module pattern yöntemi kullanıldığında güncellenemezler.

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/above-the-fold-2.png)

### Fonksiyon Tanımlamaları ve İmplementasyon Detaylarının Saklanması
###### [Stil [Y053](#style-y053)]

  - Fonksiyon tanımlamalarınızı implementasyon detaylarını saklamak için kullanın. View'a bağlanacak öğeleri yukarıda tanımlayın. Kontrolörünüzde bir fonksiyonu bağlama ihtiyacı hissettiğinizde, bu öğeyi bir fonksiyon tanımlamasına eşitleyin. Fonksiyonun implementasyon detaylarını kodun ileriki satırlarında yapın. Bu direk olarak "Bağlanacaklar Yukarı" başlığı ile ilintili. Daha fazla detay için bu [makaleme](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) bakabilirsiniz.

    *Neden?*: Bağlanacak öğeleri yukarı taşımak okumayı kolaylaştırır ve kontrolöer içerisinde hangi öğelerin View'a bağlandığını anında görmemizi sağlar.

    *Neden?*: Fonksiyonun implementasyonunu dosya içerisinde daha aşağılara taşımak kompleks kısımları göz önünden uzak tutar ve asıl önemli olan kısma odaklanmayı sağlarç 

    *Neden?*: Fonksiyon tanımlamaları(declerations) JavaScript'in *hoisting* özelliğinden faydalandığı için fonksiyonun tanımlamasından önce çağrılmasından endişe duymaya gerek yoktur. (Fonksiyon eşitlemeleri(expression) için bu durum geçerli değildir)

    *Neden?*: Fonksiyon tanımlamaları ile değişkenlerin yerlerini değiştirirken kodunuz kırılır mı diye endişe duymaya gerek yoktur. 

    *Neden?*: Fonksiyon eşitlemelerinde sıra önemlidir.

  ```javascript
  /**
   * kaçınılacak stil
   * Fonksiyon eşitlemelerini kullanarak
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
          // implementasyon detayları
      };

      var getAvengerCount = function() {
          // implementasyon detayları
      };

      var getAvengersCast = function() {
         // implementasyon detayları
      };

      var prime = function() {
         // implementasyon detayları
      };

      var ready = function(nextPromises) {
          // implementasyon detayları
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
   * önerilen stil
   * Fonksiyon tanımlamaları kullanarak
   * ve ulaşılabilir metodları yukarıda tanımlayarak.
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
          // implementasyon detayları
      }

      function getAvengerCount() {
          // implementasyon detayları
      }

      function getAvengersCast() {
          // implementasyon detayları
      }

      function prime() {
          // implementasyon detayları
      }

      function ready(nextPromises) {
          // implementasyon detayları
      }
  }
  ```

**[İçerik Listesi](#icerik-listesi)**

## Veri Servisleri

### Veri İsteklerinizi Ayırın
###### [Style [Y060](#style-y060)]

  - Veri işlemlerinizi ve işleme mantığınızı bir factory servisine alarak kodunuzu düzenleyin. Veri servislerini sadece ajax çağrıları, verileri lokal depo ya da bellekte saklama, veya diğer veri işlemlerinden sorumlu olacak şekilde tasarlayın.

    *Neden?*: Kontrolörün görevi sadece view için gerekli verileri toplamaktır. Bu verilerin nasıl edinildiği ile ilgilenmez, sadece bu verileri nereden temin edeceğini bilir. Veri servislerini ayırmak, veri işleme mantığını servise taşır ve kontrolörün daha basit kalmasını ve sadece view'a odaklı kalmasını sağlar.
    
    *Neden?*: Bu yöntemle veri servisi kullanan kontrolörlerin test edilebilmesini kolaylaştırır.

    *Neden?*: Veri servisi implementasyonu veri havuzlarını yönetmek için çok belirgin bir kod yapısına sahiptir. Bu, veri ile nasıl iletişilebileceğini anlatan header'lar yada `$http` gibi başka servisler içerebilir. Veri işleme mantığını ayırıp bir veri servisinde toplamak bu işlemlerin tek bir yerden yönetilmesini ve implementasyonun bu servisi kullananlardan (örneğin kontolörler) saklanmasını sağlar. Ayrıca implementasyonu değiştirmek kolaylaşır.

  ```javascript
  /* önerilen stil */

  // veri servisi factory'si
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

    Note: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.
    Not: Veri servisi kontrolör gibi onu kullanan yerlerden çağrılır ve aşağıdaki örnekteki gibi implementasyon detaylarını kullanılan yerlerden saklar.

  ```javascript
  /* önerilen stil */

  // veri servisi factroy'sini çağıran kontrolör
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

### Veri Çağrılarının Sonucunda bir Promise Döndürün
###### [Style [Y061](#style-y061)]

  - Promise döndüren bir veri servisini çağırdığınızda, siz de çağrıyı yapan fonksiyona bir Promise döndürün.

    *Why?*: Böylece Promise'lerinizi zincirleyebilirsiniz ve veri çağrısı bitip çöczümlendiğinde sonuca göre aksiyon alabilirsiniz.

  ```javascript
  /* önerilen stil */

  activate();

  function activate() {
      /**
       * 1. Adım
       * getAvengers fonksiyonundan avenger
       * verisini isteyin ve promise'i bekleyin
       */
      return getAvengers().then(function() {
          /**
           * 4. Adım
           * Son promise'in sonunda bir aksiyon al
           */
          logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
        /**
         * 2. Adım
         * Veri servisinden veriyi iste ve
         * promise'i bekle
         */
        return dataservice.getAvengers()
            .then(function(data) {
                /**
                 * 3. Adım
                 * Veriyi kaydet ve promise'i çözümle
                 */
                vm.avengers = data;
                return vm.avengers;
        });
  }
  ```

**[İçerik Listesi](#icerik-listesi)**

## Direktifler (Directives)
### Bir Dosyaya Bir Direktif
###### [Stil [Y070](#style-y070)]

  - Create one directive per file. Name the file for the directive.

  - Her bir direktif için ayrı bir dosya yaratın ve dosyanın adını direktifin adı ile aynı tutun.

    *Why?*: Bütün direktifleri bir dosya içerisinde toplamak kolaydır, ancak daha sonra bu direktifleri ayırıp farklı uygulamalarda, modüllerde kullanmak zorlaşır.

    *Why?*: Her dosyada bir direktifin olması sürdürülebilirliği kolaylaştırır.

    > Not: "**En iyi uygulama**: Direktifler kendilerini temizlemelilerdir. `element.on('$destroy', ...)` ya da `scope.$on('$destroy', ...)` kullanarak direktif kaldırıldığında bir temizlik fonksiyonu çalıştırabilirsiniz" ... Angular dökümantasyonundan.

  ```javascript
  /* sakınılacak stil */
  /* directives.js */

  angular
      .module('app.widgets')

      /* order modülüne özel direktif */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales uygulamasının heryerinde kullanılabilecek bir direktif */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* bütün uygulamalarda kullanılabilecek bir direktif */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* İmplementasyon detayları */
  }

  function salesCustomerInfo() {
      /* İmplementasyon detayları */
  }

  function sharedSpinner() {
      /* İmplementasyon detayları */
  }
  ```

  ```javascript
  /* önerilen stil */
  /* calendarRange.directive.js */

  /**
   * @desc order modülüne özel direktif
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* İmplementasyon detayları */
  }
  ```

  ```javascript
  /* önerilen stil */
  /* customerInfo.directive.js */

  /**
   * @desc uygulama içerisinde heryede kullanılabilecek sales direktifi
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* İmplementasyon detayları */
  }
  ```

  ```javascript
  /* önerilen stil */
  /* spinner.directive.js */

  /**
   * @desc bütün uygulamalarda kullanılabilecek spinner direktifi
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* İmplementasyon detayları */
  }
  ```

    Note: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and its file name distinct and clear. Some examples are below, but see the [Naming](#naming) section for more recommendations.

    Not: Direktifler için birçok isimlendirme seçeneği mevcut, özellikle dar ya da geniş kapsamda kullanılanlar için. Direktifi ve dosya ismini belirgin ve açık ifade edecek isimler seçin. Aşağıda bazı örnekler bulabilirsiniz, ama daha fazla tavsiye için [İsimlendirme](#naming) bölümüne bakın.

### Direktif İçerisinde DOM Değişiklikleri
###### [Stil [Y072](#style-y072)]

  - DOM'a direk olark müdahele etmek için direktif kullanın. Eğer CSS kullanmak ya da [animasyon servisleri](https://docs.angularjs.org/api/ngAnimate), Angular şablonlandırma, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) ya da [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide) ile amacınıza ulaşabiliyorsanız bu yöntemleri tercih edin. Örneğin eğer bir direktif sadece bir elemanı saklayıp gösteriyorsa ngHide/ngShow kullanın.

    *Why?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)
    *Neden?*: DOM değişikliklerini test ve debug etmek güç olabilir, ve genellikle daha iyi bir yöntem bulabilirsiniz (örneğin CSS, animasyon, şablonlar)

### Eşsiz Bir Direktif Ön eki Kullanın
###### [Stil [Y073](#style-y073)]

  - Eşsiz, kısa ve tanımlayıcı bir ön ek kullanın. Örneğin `acmeSalesCustomerInfo`. HTML'de `acme-sales-customer-info` şeklinde tanımlanır.

    *Neden?*: Eşsiz ön ek direktifin kapsamını ve orijinini ifade eder. Örneğin `cc-` direktifin CodeCamper uygulamasına ait olduğunu ifade ederken, `acme-` bu direktifin Acme firmasına ait olduğunu ifade edevilir

    Note: Avoid `ng-` as these are reserved for Angular directives. Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/).
    
    Not: `ng-` Angular tafafından kullanıldığı için bu ön eki kullanmaktan kaçının. Ön ekinizi belirlemeden önce çakışmaların önüne geçmek için iyice araştırın. Örneğin `ion-` ön eki [Ionic Framework](http://ionicframework.com/) tarafından kullanılmaktadır.

### Direktifinizin Yazım Türünü Element ve Attribute Olarak Sınırlayın
###### [Stil [Y074](#style-y074)]

  - When creating a directive that makes sense as a stand-alone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when it's stand-alone and as an attribute when it enhances its existing DOM element.
  
  - Kendi başına element olarak anlamlı bir direktif yaratırken restrict `E` (özel element) ve tercihen restrict `A` (özel attribute) kullanın. Genellikle, eğer kendi kendini kontrol eden bir direktif ise `E` uygun olur. Genel olarak `EA` kullanmaya izin verilir ama eğer direktif tek başına bir element ise element(E) olarak, hazırda var olan bir element'i iyileştiren bir direktifse attribute(A) olarak sınırlamaya yönelin.

    *Neden?*: Çünkü mantıklı.

    *Neden?*: Direktifi class olarak da kullanmaya olanak sağlansa da, eğer direktif gerçekten kendi başına bir element olarak davranıyorsa element(E) olarak sınırlamak ya da en azından attribute(A) olarak sınırlamak mantıklı olur.

    Not: EA, Angular 1.3 + için varsayılan sınırlandırma seçeneğidir.

  ```html
  <!-- sakınılacak stil -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* sakınılacak stil */
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
  <!-- önerilen stil -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* önerilen stil */
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

### Direktifler ve controllerAs
###### [Stil [Y075](#style-y075)]

  - Tutarlı olmak için direktifle birlikte `controller as` sintaksını kullanın.

    *Neden?*: Mantıklı ve zor değil.

    Not: Aşağıdaki örnek scope'u link ve direktif kontrolörü içerisinde controllerAs yöntemi ile nasıl kullanılacağını gösterir. Örneğin bölünmemesi amacı ile HTML şablonunu direktif içerisinde tuttum.

    Not: Bağımlılık Enjeksiyonu (Dependency Injection) ile ilgili olarak , [Manuel Olarak Bağımlılıkları Belirlemek](#manual-annotating-for-dependency-injection) kısmına bakın.

    Not: Direktifin kontrolörünün direktifin kapsamının(closure) dışında olduğunu unutmayın. Bu stil `return`'den sonra enjeksiyonların ulaşılamaz şekilde yaratılması probleminin önüne geçer.

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
      // Kıyaslama yapmak için $scope enjecte ediliyor
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

    Not: Ayrıca kontrolörü link fonksiyonuna enjekte ederken isimlendirebilirsiniz ve böylece direktif attribute'larına kontrolörün elemanları olarak erişebilirsiniz.

  ```javascript
  // Yukarıdaki örneğe alternatif
  function linkFunc(scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
  }
  ```

###### [Stil [Y076](#style-y076)]

  - `controller as` sintaksını kullanırken `bindToController = true` seçeneğini kullanın. Bu dış $scope'u direktifin kontrolör $scope'una bağlamanızı sağlar.

    *Why?*: It makes it easy to bind outer scope to the directive's controller scope.
    *Neden?*: Dış $scope'u direktifin kontrolörünün $scope'una bağlamayı kolaylaştırır.

    Not: `bindToController` özelliği Angular 1.3.0 ile birlikte gelmiştir.

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

**[İçerik Listesi](#icerik-listesi)**

## Promise'i Kontrolör İçerisine Çözümlemek
### Kontrolör Aktifleştirme Promise'leri
###### [Stil [Y080](#style-y080)]

  - Kontrolörün başlangıç mantığını `activate` fonksiyonu içerisinde çözün.

    *Neden?*: Başlangıç mantığını kontrolör içerisinde tutarlı bir yerde tutmak yerini bulmayı kolaylaştırır, test için tutarlı hale getirir ve başlangıç mantığını kontrolör içerisinde dağıtmaya yardımcı olur.

    *Neden?*: `activate` fonksiyonu başlangıç mantığını controller/View baştan başlatılmak istendiğinde tekrar kullanmaya elverişli hale getirir, mantığı bir arada tutar, kullanıcıyı View'a daha hızlı ulaştırır, `ng-view` ya da `ui-view` için animasyonları kolaylaştırır ve kullanıcıya daha hızlı hissettirir.

    Not: Eğer durumsal olarak route'u kontrolör başlamadan önce iptal etmek istiyorsanız [route resolve](#style-y081) kullanın.

  ```javascript
  /* sakınılacak stil */
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
  /* önerilen stil */
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

### Promise'leri Route için Çözümlemek
###### [Stil [Y081](#style-y081)]

  - Bir controller aktive olmadan önce bir promise'in çözülmesine bağlı ise, o bağımlılıkları `$routeProvider` içerisinde controller çalışmaya başlamadan önce çözün. Eğer durumsal olarak bir route'un controller çalışmadan önce iptal olmasını istiyorsanız, route resolver kullanın.

  - View'a geçiş yapmadan önce geçişi iptal etmek istiyorsanız route resolver kullanın.

    *Neden?*: Bir controller yüklenmeden önce veri yüklenmesi ihtiyacında olabilir. Bu veri bir bir factory aracılığı ile promise'den ya da [$http](https://docs.angularjs.org/api/ng/service/$http)'den gelebilir. [route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) kullanmak promise'in controller çalıştırılmadan önce çözümlenmesini sağlar, böylece controller promise'den gelen veriye göre aksiyon alabilir.

    *Neden?*: Kod route'dan ve controller'ın aktivasyon fonksiyonundan sonra çalıştırılır. View hemen yüklenir. Data binding aktivasyon promise'i çözümlendikten hemen sonra yapılır. Bir “meşgul” animasyonu view geçişi esnasında gösterilebilir (`ng-view` veya `ui-view`)

    Note: Kod route'dan önce promise aracılığı ile çalıştırılır. Reject olan promise route'u iptal eder. Resolve olması view'ın route promise'inin çözülmesini bekletir. Bir meşgul” animasyonu resolve'dan önce ve view geçişi süresince gösterilebilir. Eğer view'ın daha hızlı yüklenmesini istiyorsanız ve view'ın yüklenebilir olup olmadığını kontrol ettiğiniz bir nokta yok ise [controller `activate` tekniği](#style-y080)'ni kullanın.

  ```javascript
  /* sakınılacak stil */
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
  /* daha iyi stil */

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

    Not: Aşağıdaki örnek route resolve'un bir isimli fonksiyonuna işaret ettiğini gösterir, debug etmesi ve dependency injection kontrolü daha kolaydır.

  ```javascript
  /* çok daha iyi stil */

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
    Note: Örnek kodun `movieService` bağımlılığı minification işlemi için uygun değildir. Minification uyumlu hale getirme detayları için [dependency injection](#manual-annotating-for-dependency-injection) ve [minification and annotation](#minification-and-annotation) bölümlerine bakın.

**[İçerik Listesi](#icerik-listesi)**

## Manuel Annotation ve Dependency Injection

### Minification Uyumluluk
###### [Stil [Y090](#style-y090)]

  - Bağımlılıkları belirlerken kısayol sintaksını kullanmaktan kaçının.

    *Why?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by Angular.
    
    *Neden?*: Component'e aid değişkenler (controller, factory, etc) minification işlemi sonrası karıştırılmış değişkenlere çevrilecektir. Örneğin, `common` ve `dataservice`, `a` ve `b` değişkenlerine dönüşebilir ve Angular tarafından bulunamayabilir.

    ```javascript
    /* sakınılacak stil - minification uyumlu değil*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    function Dashboard(common, dataservice) {
    }
    ```

    Bu kod minificationdan sonra karışık değişkenler üretebilir ve runtime hataları ile karşılaşabilirsiniz.

    ```javascript
    /* sakınılacak stil - minification uyumlu değil*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

### Manuel Olarak Bağımlılıkları Tanımlamak
###### [Stil [Y091](#style-y091)]

  - Angular component'lerinize manuel olarak bağımlılıklarınızı tanımlamak için `$inject` kullanın.

    *Neden?*: Bu teknik [`ng-annotate`](https://github.com/olov/ng-annotate) tarafından kullanılan tekniği taklit eder, ki benim minification uyumlu bağımlılıkları otomatik olarak yaratmak için önerdiğim yöntemdir. Eğer `ng-annotate` bir bağımlılığın daha önceden eklendiğini farkederse, bu bağımlılığı çoklamaz.

    *Neden?*: Bu bağımlılıklarınızın minification sürecinde değiştirilirken hataya açık hale gelmelerini engeller. `common` ve `dataservice`, `a` ve `b` haline gelebilir ve Angular tarafından bulunamayabilir.

    *Neden?*: Uzun array listelerini okumak zor olacağından satıriçinde bağımlılık tanımlamaktan kaçının. Ayrıca array'iniz string serilerinden oluşurken son elemanının bir fonksiyon olması kafa karıştırıcı olabilir.

    ```javascript
    /* kaçınılacak stil */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard($location, $routeParams, common, dataservice) {}
            ]);
    ```

    ```javascript
    /* kaçınılacak stil */
    angular
      .module('app')
      .controller('Dashboard',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    ```javascript
    /* önerilen stil */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard($location, $routeParams, common, dataservice) {
    }
    ```

    Not: Eğer fonksiyonunuz bir return statement'ının altındaysa `$inject` ulaşılmaz hale gelebilir (directive içerisinde bu durum gerçekleşebilir). Bunu controller'ı directive dışarısına taşıyarak çözebilirsiniz.

    ```javascript
    /* sakınılacak stil */
    // directive tanımlaması içerisinde
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
    /* önerilen stil */
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

### Manuel Olarak Route Resolver Bağımlılıklarını Tanımlamak
###### [Stil [Y092](#style-y092)]

  - Angular component'lerinize manuel olarak bağımlılıklarınızı tanımlamak için `$inject` kullanın.

    *Neden?*: Bu teknik route resolver için anonim fonksiyonu kırar ve okunmasını kolaylaştırır.

    *Neden?*: `$inject` kolayca resolver öncesine konulabilir ve bağımlılıkları minification için uygun hale getiirir.

    ```javascript
    /* önerilen stil */
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

**[İçerik Listesi](#icerik-listesi)**

## Minification ve Annotation

### ng-annotate
###### [Stil [Y100](#style-y100)]

  - [Gulp](http://gulpjs.com) ya da [Grunt](http://gruntjs.com) ile birlikte [ng-annotate](//github.com/olov/ng-annotate) kullanın ve otomatik dependency injection'a ihtiyacı olan fonksiyonları `/* @ngInject */` ile yorumlayın

    *Neden?*: Bu kodunuzu minification uyumlu yazılması unutulmuş bağımlılıklara karşı korur.

    *Neden?*: [`ng-min`](https://github.com/btford/ngmin) artık kullanılmıyor

    >Ben kişisel olarak Gulp kullanmayı tercih ediyorum. Yazması, okuması ve debug etmesi çok daha kolay.

    Aşağıdaki kod minification uyumlu bağımlılıklar içermemektedir.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }
    ```

    Yukarıdaki kod ng-annotate ile çalıştırıldığı zaman ürettiği kod `$inject` annotation'unu içerecek ve minification uyumlu hale gelecek.

    ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers(storage, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero() {
            var hero = avengerService.find(vm.heroSearch);
            storage.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storage', 'avengerService'];
    ```

    Not: Eğer `ng-annotate` bağımlılığın daha önceden eklendiğini anlarsa, `$inject` kodunu çoğaltmayacaktır.

    Not: Yukarıdaki kod ng-annotate ile çalıştırıldığı zaman ürettiği kod `$inject` annotation'unu içerecek ve minification uyumlu hale gelecek.

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

    > Note: Angular 1.3'den itibaren [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive'inin `ngStrictDi` parametresini minification uyumlu olmayan bağımlılıkları yakalamak için kullanabilirsiniz. Bu parametre aktif olduğu zaman injector "strict-di" modunda yaratılacak ve uygulamanın açık annotation kullanmayan fonksiyonların çalışmamasını sağlayacak. Debbuging bilgisi konsola yazılacak ve problemi yaratan fonksiyonu bulacaktır. Ben `ng-strict-di` parametresini sadece debugging için kullanmayı tercih ediyorum.
    `<body ng-app="APP" ng-strict-di>`

### ng-annotate için Gulp ya da Grunt Kullanın
###### [Stil [Y101](#style-y101)]

  - Otomatik derleme görevleriniz için [gulp-ng-annotate](https://www.npmjs.org/package/gulp-ng-annotate) ya da [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) kullanın. Bağımlılığı olan fonksiyonların başına `/* @ngInject */` satırını koyun.

    *Neden?*: ng-annotate çoğu bağımlılığı yakalayacaktır, ama bazen `/* @ngInject */` sintaksı ile done vermenizi bekler.

    Takip eden kod gulp ve ngAnnotate kullanımına örnektir

    ```javascript
    gulp.task('js', ['jshint'], function() {
        var source = pkg.paths.js;

        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js', {newLine: ';'}))
            // uglify etmeden önce annotate edin ki kod düzgün minified olsun.
            .pipe(ngAnnotate({
                // true helps add where @ngInject is not used.
                // Resolve ile birlikte çalışmaz. Orası için kesin olarak belirtilmelidir
                add: true
            }))
            .pipe(bytediff.start())
            .pipe(uglify({mangle: true}))
            .pipe(bytediff.stop())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pkg.paths.dev));
    });

    ```

**[İçerik Listesi](#icerik-listesi)**

## Exception Yakalama

### decorator'ler
###### [Stil [Y110](#style-y110)]

  - [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) servisinin config aşamasında [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator) kullanın, [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) servisinde exception'u yakaladığınız zaman alacağınız özel aksiyonları tanımlayın.

    *Neden?*: Geliştirme ve çalıştırma esnasında Angular tarafından yakalanamayan exception'ları yakalamak için tutarlı bir yol sağlar.

    Note: Diğer bir yöntem ise decorator kullanmak yerine servisi override etmektir. Bu da iyi bir seçenektir, ancak eğer varsayılan davranışı korumak istiyorsanız. Davranışı değiştirmek istiyorsanız decorator tavsiye edilir.

    ```javascript
    /* önerilen stil */
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
             * Hatayı service'in kolleksiyonuna ekleyebilirsiniz,
             * $rootScope'a ekleyebilirsiniz, uzaktaki bir sunucuya yazabilirsiniz
             * ya da lokal olarak loglayabilirsiniz. Ya da direk console'a yazdırabilirsinz. Tamamen size kalmış.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Exception Yakalayıcılar
###### [Style [Y111](#style-y111)]

  - Exceptionları yakalamak ve yönetmek için bir interface döndüren factory servisi yazın.

    *Neden?*: Kodunuzda fırlatılan exceptionların yakalanması için tutarlı bir yol sağlar (e.g. during XHR calls or promise failures).

    Not: Exception yakalayıcı çağrılarınızda fırlatılabilecek exceptionları yakalamak ve aksiyon almak için iyi bir yöntemdir. Örneğin, uzaktaki bir web servisinden veri almak için bir XHR çağrısı yaparken, o sunucudan fırlatılan exceptionları yakalamak ve buna göre aksiyon almak isteyebilirsiniz.

    ```javascript
    /* önerilen stil */
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

### Route Hataları
###### [Style [Y112](#style-y112)]

  - Bütün routing hatalarını [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError) kullanarak yakalayın ve loglayın.

    *Neden?*: Bütün routing hatalarını yakalamak için tutarlı bir yöntem.

    *Neden?*: Potensiyel olarak bir routing hatası yakalandığında kullanıcıları hatanın detayları ve nereye yönlenebileceklerini gördüğü bir sayfaya yönlendirmek daha iyi bir kullanıcı deneyimi sağlar.

    ```javascript
    /* önerilen stil */
    var handlingRouteChangeError = false;

    function handleRoutingErrors() {
        /**
         * Route iptali:
         * Hata olduğunda dashboard ekranına git
         * Eğer iki kere denenirse bir çıkış yapısı sun.
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
                 * Tercih olarak özel bir servis ya da $log kullanarak logla.
                 * (Özel servisi inject etmeyi unutma)
                 */
                logger.warning(msg, [current]);

                /**
                 * Routing hatası aldığında başka bir sayfaya yönlendir.
                 */
                $location.path('/');

            }
        );
    }
    ```

**[İçerik Listesi](#icerik-listesi)**

## İsimlendirme

### İsimlendirme Rehberi
###### [Stil [Y120](#style-y120)]

  - Bütün componentler için, tipini ve içeriğini belirten tutarlı isimler kullanın. Benim tavsiye ettiğim şablon `içerik.tip.js`. Çoğu asset için genelde 2 isim vardır:
    * dosya adı (`avengers.controller.js`)
    * Angular'a kayıt olan component ismi (`AvengersController`)

    *Neden?*: İsimlendirme gelenekleri arananın bir bakışta bulunması için tutarlı bir yol sunar. Proje genelinde tutarlılık hayatidir. Takım içerisinde tutartlılık önemlidir. Şirket içersinde tutartlılık ise inanılmaz bir verim sağlar.

    *Neden?*: İsimlendirme geleneği, aradığınız kodu basitçe bulmanızı sağlar ve anlaşılmasını kolaylaştırır.

### İçerik Dosya İsimleri
###### [Stil [Y121](#style-y121)]

  - Bütün componentler için, tipini ve içeriğini belirten tutarlı isimler kullanın.

    *Neden?*: Component'leri hızlı bir şekilde tanımlamak için tutarlı bir yol sunar.

    *Neden?*: Otomatik görevlerde dosya isimleri için pattern matching sağlar.

    ```javascript
    /**
     * yaygın seçenekler
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
     * önerilen stil
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

  Note: Another common convention is naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. All other conventions still hold using a suffix of the type. Controllers are the most common type of component so this just saves typing and is still easily identifiable. I recommend you choose 1 convention and be consistent for your team. My preference is `avengers.controller.js`.
  
  Note: Controller dosyalarını isimlendirirken yaygın olan bir diğer gelenek ise `controller` kelimesini dosya isminden çıkarıp `avengers.controller.js` yerine `avengers.js` olarak bırakmaktır. Diğer bütün componentler için son ek tutulur. Controller'lar en yaygın kullanılan component tipidir, bu yüzden `controller` kelimesini çıkartmak bizi fazladan yazı yazmaktan kurtarır ve hala kolayca component'in ne olduğunu anlamamızı sağlar. Benim tavsiyen tek bir geleneğe sadık kalın ve takımınız içerisinde tutarlı olun. Benim tercihim `avengers.controller.js`.

    ```javascript
    /**
     * önerilen stil
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

### Test Dosyası İsimleri
###### [Style [Y122](#style-y122)]

  - Test dosyalarını, test ettikleri component'in ismi ve `spec` son eki ile isimlendirin.

    *Neden?*: Component'leri hızlı bir şekilde tanımlamak için tutarlı bir yol sunar.
    
    *Neden?*: [karma](http://karma-runner.github.io/) ya da diğer test araçları için bir pattern matching yapısı sunar.

    ```javascript
    /**
     * önerilen stil
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

### Controller İsimleri
###### [Style [Y123](#style-y123)]

  - Bütün controller'lar için içeriklerini ifade eden tutarlı isimlar kullanın. Contructor oldukları için UpperCamelCase yöntemini kullanın.

    *Neden?*: Controller'ları hızlıca ilişkilendirmek için tutarlı bir yol sunar.

    *Neden?*: UpperCamelCase isimlendirme yöntemi constructor kullanarak yaratılan objeler için gelenekseldir.

    ```javascript
    /**
     * önerilen stil
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController() { }
    ```

### Controller İsmi Son Eki
###### [Style [Y124](#style-y124)]

  - Controller ismine `Controller` son eki ekleyin.

    *Neden?*: `Controller` son eki daha yaygın kullanılıyor ve daha açıklayıcı.

    ```javascript
    /**
     * önerilen stil
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController() { }
    ```

### Factory ve Service İsimleri
###### [Style [Y125](#style-y125)]

  - Bütün Service'ler ve Factory'ler için içeriklerini ifade eden tutarlı isimler kullanın. İsimlendirme yöntemi olarak camel-case kullanın. `$` ön ekini kullanmaktan kaçının.  Ne oldukları tam olarak anlaşılmıyor ise `Service` son ekini kullanın.

    *Neden?*: Factory'leri hızlıca ilişkilendirmek için tutarlı bir yol sunar.

    *Neden?*: Angular ile birlikte gelen `$` ön ekini kullanan servisler ile çakışmayı önler.

    *Neden?*: Ne olduğu açık olan `logger` gibi servis isimleri son eke ihtiyaç duymaz.

    *Why?*: Service names such as `avengers` are nouns and require a suffix and should be named `avengersService`.
    *Neden?*: `avengers` gibi servis isimleri isimdir ve son eke ihtiyaç duyar. `avengersService` olarak isimlendirilmelidir.

    ```javascript
    /**
     * önerilen stil
     */

    // logger.service.js
    angular
        .module
        .factory('logger', logger);

    function logger() { }
    ```

    ```javascript
    /**
     * önerilen stil
     */

    // credit.service.js
    angular
        .module
        .factory('creditService', creditService);

    function creditService() { }

    // customer.service.js
    angular
        .module
        .service('customersService', customersService);

    function customersService() { }
    ```

### Directive İsimleri
###### [Stil [Y126](#style-y126)]

  - Bütün directive'leri camel-case yöntemini kullanarak tutarlı bir şekilde isimlendirin. Directive'in nereye ait olduğunu belirten kısa ön ekler kullanın (firma ya da proje isimlerinin kısaltılmış hali örnek olabilir).

    *Neden?*: Component'leri hızlıca ilişkilendirmek için tutarlı bir yol sunar.

    ```javascript
    /**
     * önerilen stil
     */

    // avenger-profile.directive.js
    angular
        .module
        .directive('xxAvengerProfile', xxAvengerProfile);

    // usage is <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() { }
    ```

### Modüller
###### [Stil [Y127](#style-y127)]

  - Eğer birden fazla modülünüz varsa, ana modül ismi `app.module.js` olarak isimlendirilir ve diğer tüm bağımlılık modülleri sundukları özellikleri ifade edecek şekilde isimlendirlir. Örneğin, admin modülü `admin.module.js` olarak isimlendirilir. Kayıtlı modül isimlerimi `app` ve `admin` olur.

    *Neden?*: Birçok modülü olan uygulamalar ya da genişleyen büyük uygulamalar için tutarlılık sağlar.

    *Neden?*: Otomatik görevler içerisinde bütün dosyaları birleştiriyorsanız, önce modülleri daha sonra diğer angular dosyalarını sıralamanıza yardımcı olur.

### Konfigürasyonlar
###### [Style [Y128](#style-y128)]

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`). A configuration for a module named `admin.module.js` is named `admin.config.js`.
  
  - Modül konfigüreasyonunu ayrı bir dosyada modülün ismi ile bulundurun. `app` modülünün konfigürasyon dosyasının adı `app.config.js` olmalıdır (ya da basitçe `config.js`). `admin.module.js`'nün konfigürasyon dosyası `admin.config.js` olarak isimlendirilir.

    *Neden?*: Konfigürasyonları modül tanımlamalarından, component'lerden ve çalışan koddan ayırır.

    *Neden?*: Modül konfigürasyonlarının yerinin anlaşılmasını kolaylaştırır.

### Route'lar
###### [Stil [Y129](#style-y129)]

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this separation from the rest of the configuration.
  
  - Route konfigürasyonlarını ayrı bir dosyaya alın. Ana modül için `app.route.js` ve `admin` modülü için `admin.route.js` şeklinde. Küçük uygulamalar için bile ben bu ayrıma gitmeyi tercih ediyorum.

**[İçerik Listesi](#icerik-listesi)**

## Uygulama Yapısında LIFT Prensibi
### LIFT
###### [Stil [Y140](#style-y140)]

  - Uygulamanızı, kodunuzu kolayca bulup (`L`ocate), bir bakışta tanımlayıp (`I`dentify), en az dallanmış selikde klasörlediğiniz (`F`lattest structure) ve kendinizi tekrar etmediğiniz (`T`ry to stay DRY) bir şekilde yapılandırın. Yapnınız bu 4 temel prensibi izlemeli.

    *Neden LIFT?*: Kolaylıkla büyüyebilen tutarlı bir yapı sunar, modülerdir  ve kodlara kolayca ulaşmayı sağlayarak yazılımcı verimini arttırır. Yapınızı kontrol etmenin bir başka yöntemi ise kendinize: Bir özellik eklemek için ihtiyacım olan dosyaları kolayca bulup açabiliyor muyum? diye sormanızdır

    Yapımdan memnun olmadığım zamanlarda geri dönüp LIFT prensibinin kurallarını tekrar gözden geçiriyorum

    1. Kodunuzu kolayca bulabiliyor musunuz? (`L`ocating our code is easy)
    2. Bir bakışta ne iş yaptığını tanımlayabiliyor musunuz? (`I`dentify code at a glance)
    3. Çok dallanmamış bir klasör yapınız mı var? (`F`lat structure as long as we can)
    4. Bir işi tekrar tekrar yapıyor musunuz? (`T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY)

### Yer Tespiti
###### [Stil [Y141](#style-y141)]

  - Kodunuzun kolayca tahmin edilebilir bir yerde ve hızlıca ulaşılabilir olduğundan emin olun.

    *Neden?*: Bunun bir proje için çok önemli olduğunu düşünüyorum. Eğer takımınız çalışacağı dosyaları kolayca bulamıyorlarsa, verimli bir şekilde çalışamıyorlarsa yapınız değişmeli demektir. Bir dosyanın ve onunla ilintili olan dosyaların nerede olduğunu bilmiyor olabilirsiniz. Dosyları ve ilintili olan dosyaları kolayca tahmin edilebilecek bir klasöre koymak çok zaman kazanmanızı sağlar. Betimleyici bir klasör yapısı size bunu sağlar.

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

### Tanımlama
###### [Stil [Y142](#style-y142)]

  - Bir dosyaya baktğınız anda onun ne içerdiğini ve temsil ettiğini anlamalısınız.

    *Neden?*: Kodun ne yaptığını anlamak için daha az didiklersiniz ve daha verimli olursunuz. Eğer bunun için daha uzun dosya isimlerine ihtiyaç duyarsanız varsın öyle olsun. Dosya isimleriniz açıklayıcı olsun ve içerisinde sadece bir component bulundursun. Birçok servis ve controller içeren dosyalardan uzak durun. Her dosyada tek bir component kuralının istisnası ancak çok küçük ve ilintili component'lerin aynı dosyada bulunması olabilir.

### Düz Klasör Yapısı
###### [Stil [Y143](#style-y143)]

  - Olabildiğince dallanmayan bir klasör yapısı kurun. 7'den fazla dosya bir klasörde oluyorsa alt klasörlere bölmeyi düşünün. 

    *Neden?*: Hiçkimse bir dosya bulmak için yedi kat klasör gezmek istemez. Websitelerindeki menüleri düşünün… 2 kademeden derin bir menü yapmadan önce iyice düşünmek gerekir. Klasör yapılarında böyle kesin bir sayı yoktur, ancak bir klasörde 7-10 dosya olursa, alt klasörlere bölmeyi düşünmeye başlayabiliriz. Bu sizin rahat hissetmeniz ile ilgilidir. Gerçekten anlamlı olmadıkça alt klasör oluşturmayın ve düz klasör yapısını koruyun.

### Kendini Tekrar Etmemeye Çalışma (Try to Stick to DRY)
###### [Stil [Y144](#style-y144)]

  - Kendinizi tekrar etmeyin, ama abartıp okunabilirliği azaltmayın.

    *Neden?*: Kendini tekrar etmemek önemlidir, ama LIFT'in diğer prensiplerini bozuyorsa önemini yitirir, o yüzden kendinizi tekrar etmemeye çalışın diyorum. Mesela session-view.html diye isimlendirmek istemiyorum çünkü bir view dosyası olduğu çok açık. Eğer açık değilse ya da geleneğiniz buysa o zaman böyle isimlendirin.

**[İçerik Tablosu](#icerik-listesi)**

## Uygulama Yapısı

### Genel
###### [Stil [Y150](#style-y150)]

  - Kısa vadeli düşünerek implementasyon yapın ama vizyonunuzu uzun vadeli tutun. Diğer bir deyişle, küçük parçalarla başlayın ama uygulamanın nereye doğru gittiğini aklınızda tutun. Uygulamanın bütün kodu `app` adlı bir klasör altında duracak. Bütün içerik bir dosyaya bir özellik şeklinde olacak. Her controller, servis, modül ve view kendi dosyalarında olacaklar. Bütün 3. parti kütüphaneler başka bir klasör altında toplanmalı, `app` klasörü altında değil. O kodları ben yazmadım ve benim uygulamamı karmaşıklaştırmasını istemiyorum (ör. `bower_components`, `scripts`, `lib`).

    Not: Bu yapının hakkında daha fazla bilgi istiyorsanız: [uygulama yapısı hakkındaki orjinal makalem](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout (yerleşim)
###### [Stil [Y151](#style-y151)]

  - Genel yerleşimi belirleyen bütün component'leri `layout` klasörü altına koyun. Buna ana view ve controller dosyası , navigasyon, menüler, içerik alanları ve diğer alanlar dahil olabilir.

    *Nden?*: Büyün yerleşim öğelerinizi tek bir yerde toplar ve bütün uygulama içerisinde tekrar kullanabilirsiniz.

### Özelliklere Göre Klasör Yapısı
###### [Stil [Y152](#style-y152)]

  - İçerdikleri özelliğe göre klasör isimleri verin. Eğer bir klasör 7'den fazla dosya içermeye başlarsa bir alt klasör yaratmayı düşünün. Alt klasöre bölme limitiniz farklı olabilir, kendinize göre ayarlayın.

    *Neden?*: Bir yazılımcı kodun yerini bulabilir, tek bakışta ne iş yaptığını anlayabilir, klasör yapısı olabildiğince düz olur ve tekrar eden ve gereksiz isimler olmaz.

    *Neden?*: LIFT prensiplerinin hepsini kapsar.

    *Neden?*: İçeriği organize ederek uygulamanın karmaşıklaşmasını azaltır ve LIFT prensipleri ile örtüştürür.

    *Neden?*: Eğer 10'dan fazla dosya varsa bunların yerini tespit etmek tutarlı bir klasör yapısı ile düz klasör yapısına göre daha kolay olur.

    ```javascript
    /**
     * önerilen stil
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

      ![Örnek Uygulama Yapısı](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-2.png)

      Not: Uygulamanızı tipe göre klasör yapısı ile oluşturmayın. Bu yüzden bir özellik üzerinde çalışırken birden çok klasör içerisinde çalışmanız gerekir ve dosya sayısı arttıkça sizi hantallaştırır. Özelliğe göre klasör yapısına göre dosyaları bulmak daha zordur.

    ```javascript
    /*
    * sakınılacak stil
    * Tipe Göre Klasör yöntemi.
    * Bunun yerine ben İçeriğe Göre Klasörleme yöntemini tercih ediyorum.
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

**[İçerik Listesi](#icerik-listesi)**

## Modülerlik

### Küçük, Kendi Başına Yeterli Modüller
###### [Stil [Y160](#style-y160)]

  - Tek işlevsellik içeren küçük modüller yaratın.

    *Neden?*: Modüler uygulamalar ile "ekle çalıştır" yapmak daha kolaydır. Takım olarak geliştirmeye olanak sağlar ve dikey kesitlerde uygulamayı beraber geliştirebilirsiniz. Bu sayede yeni bir özelliik geliştirildiğinde uygulamaya hemen ekleyebiliriz.  

### Bir App Modülü Yaratın
###### [Stil [Y161](#style-y161)]

  - Bir ana uygulama modülü yaratın ve bunun rolü  diğer bütün modülleri ve özellikleri bir araya getirmek olsun. Bu modülü uygulamanızın adı ile isimlendirin.

    *Neden?*: Angular modülerliği ve ayrıştırma desenlerini destekler. Bütün modüllerinizi bir arada tutan ana bir modül yaratmak çok basit bir şekilde bu modüllere ekleme yada bazılarını çıkarmanıza olanak sağlar.


### App Modülünü Sade Tutun
###### [Stil [Y162](#style-y162)]

  - Sadece bütün modülleri bir araya getirme mantığını buraya koyun. Özellikleri modüller kendi içlerinde tutsunlar.

    *Neden?*: App modülüne diğer modülleri birbirine bağlamak dışında veri alma, view gösterme ya da başka işleyiş mantıkları koymanız App modülünüzü bulandırır ve özellik setlerinin tekrar kullanılmasını yada kapsam dışına alınmasını zorlaştırır.

    *Neden?*: App modülü bu uygulamanın hangi modüllerden oluştuğunu gösteren bir manifesto haline gelir.

### Özellik Kapsamları ve Modüller
###### [Stil [Y163](#style-y163)]

  - Özellik kapsamlarını ifade eden modüller yaratın; yerleşim, tekrar kullanılan ve paylaşılan servisler, dashboard ve uygulamaya özel özellikler gibi (Ör. kullanıcılar, admin, satış).

    *Neden?*: Kendi başına yeterli modüller uygulamaya çok küçük pürüzlerle eklenir.

    *Neden?*: Sprint'ler ve iterasyonlar özellik geliştirmeye odaklanabilir ve sprint ya da iterasyon sonunda özellik uygulamaya eklenebilir.
    
    *Neden?*: Özellik kapsamlarını modüllere ayırmak onları izole şekilde daha kolay test edilebilir hale getirir ve tekrar kullanılmalarını kolaylaştırır.

### Tekrar Kullanılabilir Bloklar Modüllerdir
###### [Stil [Y164](#style-y164)]

  - Tekrar kullanılabilir uygulama blokları için modüller yaratın. Örneğin exception yakalam, loglama, güvenlik, sistem kontrolü, lokal veri depolama gibi.

    *Neden?*: Bu tarz özelliklere birçok uygulamada ihtiyaç duyulur. Bunları ayrı kendi modüllerinde ayrı tutmak uygulamalar arasında tekrar kullanılmalarına olanak sağlar.

### Modül Bağımlılıkları
###### [Stil [Y165](#style-y165)]

  - Ana uygulama modülü uygulamaya özel modüllere ve paylaşılan, tekrar kullanılabilen modüllere bağlıdır.

    ![Modülerlik ve Bağımlılık](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/assets/modularity-1.png)

    *Neden?*: Uygulama ana modülü uygulamanın özelliklerini içeren kolayca tanımlanabilen bir manifestodur.

    *Neden?*: Her özellik kapsamı nelere bağımlı olduğunu gösteren bir manifesto içerir, böylece başka uygulamalar içerisine bağımlılık olarak eklendiğinda hala çalışmaya devam eder.

    *Neden?*: Paylaşılan veri servisleri gibi uygulamalar arası özellikler kolay bulunabilir ve `app.core`'dan kolay bir şekilde paylaşılabilir (Bu modül için favori isminizi seçin).

    Not: Bu tutarlılığı sağlamak için bi stratejidir. Bunun için birçok iyi seçenek mevcut. Angular'ın bağımlılık kurallarını izleyen, kolay yönetilebilen ve genişleyebilen tutarlı olan birtanesini seçin.

    > Benim yapılarım projelerim arasında pek fazla değişmez ama hepsi yapı ve modülerlik için bu rehberi izler. İmplementasyon özelliklere ve takıma göre değişkenlik gösterebilir. Bir başka deyişle, kelimesi kelimesine bir yapıya tutunmayın ama tutarlılığı, yönetilebilirliği ve verimi göz önünde bulundurarak yapınızı ayaralayın.

    > Küçük bir uygulamada, özelliklerin direk bağımlılığı olmadığı, paylaşılan bütün bağımlılıkları ana modüle koymayı düşünebilirsiniz. Bu küçük uygulamaları daha kolay yönetilebilir hale getirir, ama bu uygulamada kullanılan modülleri bu uygulama dışında kullanmayı zorlaştırır.

**[İçerik Listesi](#icerik-listesi)**

## Startup Logic

### Configuration
###### [Style [Y170](#style-y170)]

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidates include providers and constants.

    *Why?*: This makes it easier to have less places for configuration.

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

**[Back to top](#icerik-listesi)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle Angular's digest cycle thus keeping data binding in sync.

**[Back to top](#icerik-listesi)**

## Testing
Unit testing helps maintain clean code, as such I included some of my recommendations for unit testing foundations with links for more information.

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Why?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

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

    *Why?*: Both Jasmine and Mocha are widely used in the Angular community. Both are stable, well maintained, and provide robust testing features.

    Note: When using Mocha, also consider choosing an assert library such as [Chai](http://chaijs.com). I prefer Mocha.

### Test Runner
###### [Style [Y192](#style-y192)]

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Why?*: Karma is easy to configure to run once or automatically when you change your code.

    *Why?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt or Gulp.

    *Why?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Why?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)) and [Gulp](http://www.gulpjs.com). When using Gulp, use [Karma](https://github.com/karma-runner/karma) directly and not with a plugin as the API can be called directly.

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

  - Use [Sinon](http://sinonjs.org/) for stubbing and spying.

    *Why?*: Sinon works well with both Jasmine and Mocha and extends the stubbing and spying features they offer.

    *Why?*: Sinon makes it easier to toggle between Jasmine and Mocha, if you want to try both.

    *Why?*: Sinon has descriptive messages when tests fail the assertions.

### Headless Browser
###### [Style [Y194](#style-y194)]

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Why?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server.

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

### Code Analysis
###### [Style [Y195](#style-y195)]

  - Run JSHint on your tests.

    *Why?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.

### Alleviate Globals for JSHint Rules on Tests
###### [Style [Y196](#style-y196)]

  - Relax the rules on your test code to allow for common globals such as `describe` and `expect`. Relax the rules for expressions, as Mocha uses these.

    *Why?*: Your tests are code and require the same attention and code quality rules as all of your production code. However, global variables used by the testing framework, for example, can be relaxed by including this in your test specs.

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

  - Place unit test files (specs) side-by-side with your client code. Place specs that cover server integration or test multiple components in a separate `tests` folder.

    *Why?*: Unit tests have a direct correlation to a specific component and file in source code.

    *Why?*: It is easier to keep them up to date since they are always in sight. When coding whether you do TDD or test during development or test after development, the specs are side-by-side and never out of sight nor mind, and thus more likely to be maintained which also helps maintain code coverage.

    *Why?*: When you update source code it is easier to go update the tests at the same time.

    *Why?*: Placing them side-by-side makes it easy to find them and easy to move them with the source code if you move the source.

    *Why?*: Having the spec nearby makes it easier for the source code reader to learn how the component is supposed to be used and to discover its known limitations.

    *Why?*: Separating specs so they are not in a distributed build is easy with grunt or gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.js
                             /customers.controller.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[Back to top](#icerik-listesi)**

## Animations

### Usage
###### [Style [Y210](#style-y210)]

  - Use subtle [animations with Angular](https://docs.angularjs.org/guide/animations) to transition between states for views and primary visual elements. Include the [ngAnimate module](https://docs.angularjs.org/api/ngAnimate). The 3 keys are subtle, smooth, seamless.

    *Why?*: Subtle animations can improve User Experience when used appropriately.

    *Why?*: Subtle animations can improve perceived performance as views transition.

### Sub Second
###### [Style [Y211](#style-y211)]

  - Use short durations for animations. I generally start with 300ms and adjust until appropriate.

    *Why?*: Long animations can have the reverse affect on User Experience and perceived performance by giving the appearance of a slow application.

### animate.css
###### [Style [Y212](#style-y212)]

  - Use [animate.css](http://daneden.github.io/animate.css/) for conventional animations.

    *Why?*: The animations that animate.css provides are fast, smooth, and easy to add to your application.

    *Why?*: Provides consistency in your animations.

    *Why?*: animate.css is widely used and tested.

    Note: See this [great post by Matias Niemelä on Angular animations](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[Back to top](#icerik-listesi)**

## Comments

### jsDoc
###### [Style [Y220](#style-y220)]

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

**[Back to top](#icerik-listesi)**

## JS Hint

### Use an Options File
###### [Style [Y230](#style-y230)]

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

**[Back to top](#icerik-listesi)**

## JSCS

### Use an Options File
###### [Style [Y235](#style-y235)]

  - Use JSCS for checking your coding styles your JavaScript and be sure to customize the JSCS options file and include in source control. See the [JSCS docs](http://www.jscs.info) for details on the options.

    *Why?*: Provides a first alert prior to committing any code to source control.

    *Why?*: Provides consistency across your team.

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

**[Back to top](#icerik-listesi)**

## Constants

### Vendor Globals
###### [Style [Y240](#style-y240)]

  - Create an Angular Constant for vendor libraries' global variables.

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

###### [Style [Y241](#style-y241)]

  - Use constants for values that do not change and do not come from another service. When constants are used only for a module that may be reused in multiple applications, place constants in a file per module named after the module. Until this is required, keep constants in the main module in a `constants.js` file.

    *Why?*: A value that may change, even infrequently, should be retrieved from a service so you do not have to change the source code. For example, a url for a data service could be placed in a constants but a better place would be to load it from a web service.

    *Why?*: Constants can be injected into any angular component, including providers.

    *Why?*: When an application is separated into modules that may be reused in other applications, each stand-alone module should be able to operate on its own including any dependent constants.

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

**[Back to top](#icerik-listesi)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Sublime Text
###### [Style [Y250](#style-y250)]

  - Angular snippets that follow these styles and guidelines.

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

  - Angular file templates that follow these styles and guidelines can be found at [SideWaffle](http://www.sidewaffle.com)

    - Download the [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix file)
    - Run the vsix file
    - Restart Visual Studio

### WebStorm
###### [Style [Y252](#style-y252)]

  - Angular snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    - Download the [WebStorm Angular file templates and snippets](assets/webstorm-angular-file-template.settings.jar?raw=true)
    - Open WebStorm and go to the `File` menu
    - Choose the `Import Settings` menu option
    - Select the file and click `OK`
    - In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

### Atom
###### [Style [Y253](#style-y253)]

  - Angular snippets that follow these styles and guidelines.
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

  - Angular snippets that follow these styles and guidelines.
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
    ngstate      // creates an Angular UI Router state defintion
    ngconfig     // defines a configuration phase function
    ngrun        // defines a run phase function
    ngroute      // defines an Angular ngRoute 'when' definition
    ngtranslate  // uses $translate service with its promise
    ```

### vim
###### [Style [Y255](#style-y255)]

  - vim snippets that follow these styles and guidelines.

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

  - [Visual Studio Code](http://code.visualstudio.com) snippets that follow these styles and guidelines.

    - Download the [VS Code Angular snippets](assets/vscode-snippets/javascript.json?raw=true)
    - copy snippets to snippet directory, or alternatively copy and paste the snippets into your existing ones

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ```

**[Back to top](#icerik-listesi)**

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

**[Back to top](#icerik-listesi)**

## Routing
Client-side routing is important for creating a navigation flow between views and composing views that are made of many smaller templates and directives.

###### [Style [Y270](#style-y270)]

  - Use the [AngularUI Router](http://angular-ui.github.io/ui-router/) for client-side routing.

    *Why?*: UI Router offers all the features of the Angular router plus a few additional ones including nested routes and states.

    *Why?*: The syntax is quite similar to the Angular router and is easy to migrate to UI Router.

  - Note: You can use a provider such as the `routerHelperProvider` shown below to help configure states across files, during the run phase.

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

  - Define routes for views in the module where they exist. Each module should contain the routes for the views in the module.

    *Why?*: Each module should be able to stand on its own.

    *Why?*: When removing a module or adding a module, the app will only contain routes that point to existing views.

    *Why?*: This makes it easy to enable or disable portions of an application without concern over orphaned routes.

**[Back to top](#icerik-listesi)**

## Task Automation
Use [Gulp](http://gulpjs.com) or [Grunt](http://gruntjs.com) for creating automated tasks.  Gulp leans to code over configuration while Grunt leans to configuration over code. I personally prefer Gulp as I feel it is easier to read and write, but both are excellent.

> Learn more about gulp and patterns for task automation in my [Gulp Pluralsight course](http://jpapa.me/gulpps)

###### [Style [Y400](#style-y400)]

  - Use task automation to list module definition files `*.module.js` before all other application JavaScript files.

    *Why?*: Angular needs the module definitions to be registered before they are used.

    *Why?*: Naming modules with a specific pattern such as `*.module.js` makes it easy to grab them with a glob and list them first.

    ```javascript
    var clientApp = './src/client/app/';

    // Always grab module files first
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[Back to top](#icerik-listesi)**

## Filters

###### [Style [Y420](#style-y420)]

  - Avoid using filters for scanning all properties of a complex object graph. Use filters for select properties.

    *Why?*: Filters can easily be abused and negatively affect performance if not used wisely, for example when a filter hits a large and deep object graph.

**[Back to top](#icerik-listesi)**

## Angular docs
For anything else, API reference, check the [Angular documentation](//docs.angularjs.org/api).

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

**[Back to top](#icerik-listesi)**
