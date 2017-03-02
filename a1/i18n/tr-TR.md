# Angular Stil Rehberi

## Angular Ekibinden Destek
Angular takım lideri Igor Minar'a, rehberimi incelediği, geri bildirimde bulunduğu ve rehber olma görevini bana emanet ettiği için özellikle teşekkür ederim.

##Amaç 
*[@john_papa](//twitter.com/john_papa)'dan Takımlar için seçeneklendirilmiş stil rehberi*

Eğer Angular projeleriniz için seçeneklendirilmiş bir sintaks, yöntem ve yapılandırma rehberi arıyorsanız, buyrun gelin. Bu stiller benim [Angular](//angularjs.org) sunumlarım, [Pluralsight eğitim kurslarım](http://pluralsight.com/training/Authors/Details/john-papa) ve takım çalışmalarımdan edindiğim deneyimlerle oluşturulmuştur.

Bu rehberin amacı, kullandığım yöntemleri göstererek, hatta daha önemlisi neden bu yöntemleri seçtiğimi açıklayarak, Angular uygulamalarınızı geliştirirken size yol göstermektir.

>Eğer bu rehberi beğendiyseniz, [Angular Patterns: Clean Code](http://jpapa.me/ngclean) isimli kursuma Pluralsight sitesinden bir bakın. Bu rehberle pekiltirici olacaktır.

  [![Angular Patterns: Clean Code](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/ng-clean-code-banner.png)](http://jpapa.me/ngclean)

## Topluluğun Aşmışlığı ve Referanslar
Asla izole olarak çalışmayın. Angular topluluğunu, deneyimlerini paylaşma konusunda tutkulu buluyorum. Örneğin, arkadaşım ve bir Angular uzmanı Todd Motto ile birçok stil ve yöntem üzerinde işbirliği yaptık. Birçoğunda hemfikir olduk, birkaçında farklı yollar izledik. [Todd'un rehberi'ni](https://github.com/toddmotto/angularjs-styleguide) de onun yaklaşımını anlamak ve karşılaştırma yapmak için incelemenizi öneririm

Bir çok yöntem [Ward Bell](http://twitter.com/wardbell) ile yaptığımız eşli programlama seanslarında ortaya çıktı. Arkadaşım Ward bu rehberin nihai evrimine büyük katkılarda bulundu.

## Örnek uygulama üzerinde yöntemler
Bu rehber *ne*, *neden* ve *nasıl* sorularına odaklanırken, yöntemleri deneyimlemenin yardımcı olacaığını düşünüyorum. Bu rehbere, bu rehberdeki yöntemleri ve tasarım desenlerini kullanan örnek bir uygulama eşlik ediyor. Bu uygulamayı [burada](https://github.com/johnpapa/ng-demos), `modular` klasörünün altında bulabilirsiniz. Üzerinde denemeler yapmaktan çekinmeyin. [Çalıştırma talimatları readme dosyasındadır](https://github.com/johnpapa/ng-demos/tree/master/modular).

##Çeviriler
[Bu Angular rehberinin çevirileri](https://github.com/johnpapa/angular-styleguide/tree/master/i18n) gönüllü yardımcılar tarafından sağlanmaktadır

## İçerik Listesi

  1. [Tek İşlevsellik](#tek-islevsellik)
  1. [IIFE](#iife)
  1. [Modüller](#moduller)
  1. [Controller'lar](#controllerlar)
  1. [Servisler](#servisler)
  1. [Factory'ler](#factoryler)
  1. [Veri Servisleri](#veri-servisleri)
  1. [Directive'ler](#directiveler)
  1. [Promise'leri Controller'lar İçin Çözümlemek](#promiseleri-controllerlar-icin-cozumlemek)
  1. [Dependency Injection ve Manuel Annotation](#dependency-injection-ve-manuel-annotation)
  1. [Minification ve Annotation](#minification-ve-annotation)
  1. [Exception Yakalama](#exception-yakalama)
  1. [İsimlendirme](#isimlendirme)
  1. [Uygulama Yapısı ve LIFT Prensibi](#uygulama-yapisi-ve-lift-prensibi)
  1. [Uygulama Yapısı](#uygulama-yapisi)
  1. [Modülerlik](#modulerlik)
  1. [Başlangıç Mantığı](#baslangic-mantigi)
  1. [Angular Servisleri](#angular-servisleri)
  1. [Testler](#testler)
  1. [Animasyonlar](#animasyonlar)
  1. [Yorumlar](#yorumlar)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Constant'lar](#constantlar)
  1. [Dosya Şablonları ve Snippetler](#dosya-sablonlari-ve-snippetler)
  1. [Yeoman Anayapı Üreticisi](#yeoman-anayapı-ureticisi)
  1. [Routing](#routing)
  1. [Görev Otomasyonu](#gorev-otomasyonu)
  1. [Filtreler](#filtreler)
  1. [Angular Dökümantasyonu](#angular-dokumantasyonu)
  1. [Katkıda Bulunmak](#katkida-bulunmak)
  1. [Lisans](#lisans)

## Tek İşlevsellik

### Kural 1
###### [Stil [Y001](#style-y001)]

  - Her dosyaya yalnızca bir component tanımlayın.
  Göreceğimiz örnek `app` modülünü ve bağımlılıklarını, conroller'ını ve factory'sini aynı dosyada tanımlıyor.
  
  ```javascript
  /* sakınılacak stil */
  angular
      .module('app', ['ngRoute'])
      .controller('SomeController', SomeController)
      .factory('someFactory', someFactory);

  function SomeController() { }

  function someFactory() { }
  ```
  
  Bu örnekte ise aynı component'lar farklı dosyalara ayrılmış durumdalar

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
  - Angular component'larınızı Hemen Çalışan Fonksiyon İfadeleri (HÇFİ) ile kapsayın 
  > *Not: Hemen Çalışan Fonksiyon İfadeleri İngilizcede (Immediately Invoked Function Expression) olarak geçer. Bu fonksiyon bloğu içerisinde kalan kısım, tanımlanmasının ardından hemen çalıştırılır, fonksiyonun çağrılmasını beklemez* 

  *Neden?*: HÇFİ değişkenleri global olarak tanımlanmaktan çıkarır. Bu yöntem değişkenlerin ve fonksiyonların global olarak beklenenden daha uzun tanımlı kalmasını ve aynı isimde olan değişken ve fonksiyonlarla çakışmasını engeller. 
  
  *Neden?*: Kodunuz sıkıştırıldığı zaman ve üretim ortamın için tek bir javascript dosyası halinde paketlendiğinde, birçok yerel ve global değişken için çakışma hataları alabilirsiniz. HÇFİ sizi bu çakışmalara karşı korur ve her dosya için kendi değişken kapsamını tanımlar.

  ```javascript
  /* sakınılacak stil */
  // logger.js
  angular
      .module('app')
      .factory('logger', logger);

  // logger fonksiyonu global olarak tanımlanıyor
  function logger() { }

  // storage.js
  angular
      .module('app')
      .factory('storage', storage);

  // storage fonksiyonu global olarak tanımlanıyor
  function storage() { }
  ```

  ```javascript
  /**
   * önerilen stil
   *
   * global tanımlamamız yok
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

  - Not: HÇFİ'ler test kodunuzun fonksiyona özel değişkenlere erişmenizi engeller (Regular Expression, Yardımcı fonksiyonlar gibi). O yüzden bu fonksiyonları kendi başlarına test etmek daha iyidir. Ama yine de bu özel fonksiyonları component dışından erişilebilir kılarak test edebilirsiniz.

**[İçerik Listesi](#icerik-listesi)**

## Modüller

### İsim Çakışmalarından Kaçının
###### [Stil [Y020](#style-y020)]

  - Alt modüller için eşsiz isimlendirme yöntemleri kullanın.

  *Neden?*: Eşsiz isimler modül isimlerinin çakışmasını engeller. Ayraçlar, modüller ve alt modüller arasındaki hiyerarşiyi kurmaya yardımcı olur. Örneğin `app` sizin ana modülünüz olsun. `app.dashboard` ve `app.users` modülleri alt modülleriniz olur ve `app` modülüne bağımlılık olarak eklenirler.

### Modül Tanımlama Yöntemi (Setters)
###### [Stil [Y021](#style-y021)]

  - Modüllerinizi bir değişkene atama yapmadan setter sintaksını kullanarak tanımlayın.

  *Neden?*: Her component için bir dosya yöntemi ile, nadiren modülünüzü bir değişkene atama ihtiyacı hissedersiniz. 

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

  - Modülünüzün component'lerinin fonksiyonlarını isimli fonksiyonlar olarak tanımlayın.

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

## Controller'lar

### controllerAs View Sintaksı
###### [Stil [Y030](#style-y030)]

  - [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) sintaksını klasik $scope'lu controller sintaksına tercih edin. 

  *Neden?*: Controller'lar `new` kelimesi ile yaratılır ve uygulamanız içerisinde sadece bir örneği bulunur. `controllerAs` yöntemi JavaScript'in constructor yapısına daha yakındır.

  *Neden?*: View katmanında noktalı notasyonun kullanımını teşvik eder. (örneğin `customer.name` yerine `name`). Bu yöntem daha kolay okunur ve referans problemlerinin oluşmasını engeller.

  *Neden?*: İçiçe olan controller'larda veriye ulaşırken `$parent` kullanmanızı engeller.

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

### controllerAs Controller Sintaksı
###### [Stil [Y031](#style-y031)]

  - `controllerAs` sintaksını klasik $scope'lu controller sintaksına tercih edin.

  - `controllerAs` sintaksı controller içerisinde `this` kelimesini kullanır ve $scope'a bağlanırç

  *Neden?*: `controllerAs` `$scope` için bir sintaks süslemedir. Hala View'a bağlayabilir ve `$scope` fonksiyonlarına ulaşabilirsiniz.

  *Neden?*: `$scope` metodlarının bir Factory içerisinde tanımlanıp controller içerisinde çağrılmasındansa, controller içerisinde direk kullanılması eğilimine engel olur. `$scope`'u controller içerisinde sadece ihtiyaç olduğunda kullanın. Örneğin [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit), [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast) veya [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) kullanırkenö bunları bir factory içine taşıyıp, controller içerisinden çağırın.

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

  Not: [jshint](http://www.jshint.com/) uyarılarını kodun üstüne yorum ekleyerek engelleyebilirsiniz. Eğer fonksiyonunu UpperCasing yöntemi ile isimlendirdiyse buna ihtiyaç olmaz. Çünkü bu yöntem bu fonksiyonun bir constructor fonksiyonu olduğunu belirtir, ki Angular controller'ları de bir constructor fonksiyonudur.

  ```javascript
  /* jshint validthis: true */
  var vm = this;
  ```

  Not: vm değişkenlerini izlerken ($watch) aşağıdaki sintaksı kullanabilirsiniz. ($watch yaratırken dikkatli olunmalıdır. Çümkü digest cycle'a yük bindrir.)

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

  - Bağlanacak olan değişkenleri controller fonksiyonuzda aflabetik sıralanmış olarak tepeye koyun. Kod içerisinde dağılmış olarak bırakmayın.

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

    ![Controller Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-1.png)

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

  - Fonksiyon tanımlamalarınızı implementasyon detaylarını saklamak için kullanın. View'a bağlanacak öğeleri yukarıda tanımlayın. Controller'ınızda bir fonksiyonu bağlama ihtiyacı hissettiğinizde, bu öğeyi bir fonksiyon tanımlamasına eşitleyin. Fonksiyonun implementasyon detaylarını kodun ileriki satırlarında yapın. Bu direk olarak "Bağlanacaklar Yukarı" başlığı ile ilintili. Daha fazla detay için bu [makaleme](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) bakabilirsiniz.

    *Neden?*: Bağlanacak öğeleri yukarı taşımak okumayı kolaylaştırır ve controlller içerisinde hangi öğelerin View'a bağlandığını anında görmemizi sağlar.

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

  Bir önceki örnekte önemli olan noktaların kod içerisinde nasıl dağıldığına dikkat edin. Aşağıdaki örnekte, önemli olan kısım yukarıda toplanmıştır. Örneğin, controller'a bağlı `vm.avengers` ve `vm.title` öğeleri. İmplementasyonun detayları aşağıda yer alıyor. Kodu okumak böyle daha kolay.

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

### Mantıksal kodu Controller'lardan Servislere Kaydırın
###### [Style [Y035](#style-y035)]

  - Controller içerisindeki mantıksal kodu servisler ve factory'ler aracılığıyle yönetin. 

    *Neden?*: Mantıksal kod servislere taşınırsa farklı controller'larda tekrar terkrar kullanılabilir.

    *Neden?*: Servise taşınmış mantıksal kod daha kolay test edilebilir ve controller içerisinde kolayca taklit edilebilir(mocking)

    *Neden?*: Controller'dan bağımlılıkları kaldırır ve implementasyon detaylarını gizler.

    *Neden?*: Controller'ı kısa ve öz tutar.

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

### Controller'ın Odağını Koruyun
###### [Stil [Y037](#style-y037)]

  - Bir controller'ı bir view tanımlayın ve başka view'lar için kullanmaya çalışmayın. Onun yerine tekrar kullanılabilir mantıksal kodu farcory'lere taşıyıp, controller'ı sade ve view'a odaklı bırakın.

    *Neden?*: Controller'ları değişik view'larla birlikte kullanmak kodu kırılgan yapar ve iyi bir uçtan uca test kapsamı için kararlılık gereklidir.

### Controller Atamaları
###### [Stil [Y038](#style-y038)]

  - Eğer bir controller bir view ile eşleşmek zorunda ise ve o view başka controller'lar tarafından da kullanılıyorsa, o zaman controller'ı router serviyesinde tanımlayın.

    Not: Eğer view router dışında başka biryerden yükleniyorsa, view içerisinde `ng-controller="Avengers as vm"` sintaksını kullanın.

    *Neden?*: Controller'ı router ile eşlemek, farklı route'ların farklı controller ve view eşlerini çağırmasına olanak sağlar. Eğer controller [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController) yöntemi kullanılarak view ile eşlendiyse, o view hep o controller'ı kullanacaktır.

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

### Ulaşılabilirler Yukarı!
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

    ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-2.png)

### Fonksiyon Tanımlamaları ve İmplementasyon Detaylarının Saklanması
###### [Stil [Y053](#style-y053)]

  - Fonksiyon tanımlamalarınızı implementasyon detaylarını saklamak için kullanın. View'a bağlanacak öğeleri yukarıda tanımlayın. Controller'ınızda bir fonksiyonu bağlama ihtiyacı hissettiğinizde, bu öğeyi bir fonksiyon tanımlamasına eşitleyin. Fonksiyonun implementasyon detaylarını kodun ileriki satırlarında yapın. Bu direk olarak "Bağlanacaklar Yukarı" başlığı ile ilintili. Daha fazla detay için bu [makaleme](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code) bakabilirsiniz.

    *Neden?*: Bağlanacak öğeleri yukarı taşımak okumayı kolaylaştırır ve controller içerisinde hangi öğelerin View'a bağlandığını anında görmemizi sağlar.

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

    *Neden?*: Controller'ın görevi sadece view için gerekli verileri toplamaktır. Bu verilerin nasıl edinildiği ile ilgilenmez, sadece bu verileri nereden temin edeceğini bilir. Veri servislerini ayırmak, veri işleme mantığını servise taşır ve controller'ın daha basit kalmasını ve sadece view'a odaklı kalmasını sağlar.
    
    *Neden?*: Bu yöntemle veri servisi kullanan controller'ların test edilebilmesini kolaylaştırır.

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
    Not: Veri servisi controller gibi onu kullanan yerlerden çağrılır ve aşağıdaki örnekteki gibi implementasyon detaylarını kullanılan yerlerden saklar.

  ```javascript
  /* önerilen stil */

  // veri servisi factroy'sini çağıran controller
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

    *Neden?*: Böylece Promise'lerinizi zincirleyebilirsiniz ve veri çağrısı bitip çöczümlendiğinde sonuca göre aksiyon alabilirsiniz.

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

## Directive'ler
### Bir Dosyaya Bir Directive
###### [Stil [Y070](#style-y070)]

  - Her bir directive için ayrı bir dosya yaratın ve dosyanın adını directive'in adı ile aynı tutun.

    *Neden?*: Bütün directive'leri bir dosya içerisinde toplamak kolaydır, ancak daha sonra bu directive'leri ayırıp farklı uygulamalarda, modüllerde kullanmak zorlaşır.

    *Neden?*: Her dosyada bir directive'in olması sürdürülebilirliği kolaylaştırır.

    > Not: "**En iyi uygulama**: Directive'ler kendilerini temizlemelilerdir. `element.on('$destroy', ...)` ya da `scope.$on('$destroy', ...)` kullanarak directive kaldırıldığında bir temizlik fonksiyonu çalıştırabilirsiniz" ... Angular dökümantasyonundan.

  ```javascript
  /* sakınılacak stil */
  /* directives.js */

  angular
      .module('app.widgets')

      /* order modülüne özel directive */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales uygulamasının heryerinde kullanılabilecek bir directive */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* bütün uygulamalarda kullanılabilecek bir directive */
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
   * @desc order modülüne özel directive
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
   * @desc uygulama içerisinde heryede kullanılabilecek sales directive'i
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
   * @desc bütün uygulamalarda kullanılabilecek spinner directive'i
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

    Not: Directive'ler için birçok isimlendirme seçeneği mevcut, özellikle dar ya da geniş kapsamda kullanılanlar için. Directive'i ve dosya ismini belirgin ve açık ifade edecek isimler seçin. Aşağıda bazı örnekler bulabilirsiniz, ama daha fazla tavsiye için [İsimlendirme](#naming) bölümüne bakın.

### Directive İçerisinde DOM Değişiklikleri
###### [Stil [Y072](#style-y072)]

  - DOM'a direk olark müdahele etmek için directive kullanın. Eğer CSS kullanmak ya da [animasyon servisleri](https://docs.angularjs.org/api/ngAnimate), Angular şablonlandırma, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) ya da [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide) ile amacınıza ulaşabiliyorsanız bu yöntemleri tercih edin. Örneğin eğer bir directive sadece bir elemanı saklayıp gösteriyorsa ngHide/ngShow kullanın.

    *Neden?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)
    *Neden?*: DOM değişikliklerini test ve debug etmek güç olabilir, ve genellikle daha iyi bir yöntem bulabilirsiniz (örneğin CSS, animasyon, şablonlar)

### Eşsiz Bir Directive Ön eki Kullanın
###### [Stil [Y073](#style-y073)]

  - Eşsiz, kısa ve tanımlayıcı bir ön ek kullanın. Örneğin `acmeSalesCustomerInfo`. HTML'de `acme-sales-customer-info` şeklinde tanımlanır.

    *Neden?*: Eşsiz ön ek directive'in kapsamını ve orijinini ifade eder. Örneğin `cc-` directive'in CodeCamper uygulamasına ait olduğunu ifade ederken, `acme-` bu directive'in Acme firmasına ait olduğunu ifade edevilir

    Note: Avoid `ng-` as these are reserved for Angular directives. Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/).
    
    Not: `ng-` Angular tafafından kullanıldığı için bu ön eki kullanmaktan kaçının. Ön ekinizi belirlemeden önce çakışmaların önüne geçmek için iyice araştırın. Örneğin `ion-` ön eki [Ionic Framework](http://ionicframework.com/) tarafından kullanılmaktadır.

### Directive'inizin Yazım Türünü Element ve Attribute Olarak Sınırlayın
###### [Stil [Y074](#style-y074)]

  - When creating a directive that makes sense as a stand-alone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when it's stand-alone and as an attribute when it enhances its existing DOM element.
  
  - Kendi başına element olarak anlamlı bir directive yaratırken restrict `E` (özel element) ve tercihen restrict `A` (özel attribute) kullanın. Genellikle, eğer kendi kendini kontrol eden bir directive ise `E` uygun olur. Genel olarak `EA` kullanmaya izin verilir ama eğer directive tek başına bir element ise element(E) olarak, hazırda var olan bir element'i iyileştiren bir directive'se attribute(A) olarak sınırlamaya yönelin.

    *Neden?*: Çünkü mantıklı.

    *Neden?*: Directive'i class olarak da kullanmaya olanak sağlansa da, eğer directive gerçekten kendi başına bir element olarak davranıyorsa element(E) olarak sınırlamak ya da en azından attribute(A) olarak sınırlamak mantıklı olur.

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

### Directive'ler ve controllerAs
###### [Stil [Y075](#style-y075)]

  - Tutarlı olmak için directive'le birlikte `controller as` sintaksını kullanın.

    *Neden?*: Mantıklı ve zor değil.

    Not: Aşağıdaki örnek scope'u link ve directive controller'ı içerisinde controllerAs yöntemi ile nasıl kullanılacağını gösterir. Örneğin bölünmemesi amacı ile HTML şablonunu directive içerisinde tuttum.

    Not: Bağımlılık Enjeksiyonu (Dependency Injection) ile ilgili olarak , [Manuel Olarak Bağımlılıkları Belirlemek](#manual-annotating-for-dependency-injection) kısmına bakın.

    Not: Directive'in controller'ının directive'in kapsamının(closure) dışında olduğunu unutmayın. Bu stil `return`'den sonra enjeksiyonların ulaşılamaz şekilde yaratılması probleminin önüne geçer.

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

    Not: Ayrıca controller'ı link fonksiyonuna enjekte ederken isimlendirebilirsiniz ve böylece directive attribute'larına controller'ın elemanları olarak erişebilirsiniz.

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

  - `controller as` sintaksını kullanırken `bindToController = true` seçeneğini kullanın. Bu dış $scope'u directive'in controller $scope'una bağlamanızı sağlar.

    *Neden?*: Dış $scope'u directive'in controller'ın $scope'una bağlamayı kolaylaştırır.

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

## Promise'leri Controller'lar İçin Çözümlemek
### Controller Aktifleştirme Promise'leri
###### [Stil [Y080](#style-y080)]

  - Controller'ın başlangıç mantığını `activate` fonksiyonu içerisinde çözün.

    *Neden?*: Başlangıç mantığını controller içerisinde tutarlı bir yerde tutmak yerini bulmayı kolaylaştırır, test için tutarlı hale getirir ve başlangıç mantığını controller içerisinde dağıtmaya yardımcı olur.

    *Neden?*: `activate` fonksiyonu başlangıç mantığını controller/View baştan başlatılmak istendiğinde tekrar kullanmaya elverişli hale getirir, mantığı bir arada tutar, kullanıcıyı View'a daha hızlı ulaştırır, `ng-view` ya da `ui-view` için animasyonları kolaylaştırır ve kullanıcıya daha hızlı hissettirir.

    Not: Eğer durumsal olarak route'u controller başlamadan önce iptal etmek istiyorsanız [route resolve](#style-y081) kullanın.

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

## Dependency Injection ve Manuel Annotation

### Minification Uyumluluk
###### [Stil [Y090](#style-y090)]

  - Bağımlılıkları belirlerken kısayol sintaksını kullanmaktan kaçının.

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

## Uygulama Yapısı ve LIFT Prensibi
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

      ![Örnek Uygulama Yapısı](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-2.png)

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

    ![Modülerlik ve Bağımlılık](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/modularity-1.png)

    *Neden?*: Uygulama ana modülü uygulamanın özelliklerini içeren kolayca tanımlanabilen bir manifestodur.

    *Neden?*: Her özellik kapsamı nelere bağımlı olduğunu gösteren bir manifesto içerir, böylece başka uygulamalar içerisine bağımlılık olarak eklendiğinda hala çalışmaya devam eder.

    *Neden?*: Paylaşılan veri servisleri gibi uygulamalar arası özellikler kolay bulunabilir ve `app.core`'dan kolay bir şekilde paylaşılabilir (Bu modül için favori isminizi seçin).

    Not: Bu tutarlılığı sağlamak için bi stratejidir. Bunun için birçok iyi seçenek mevcut. Angular'ın bağımlılık kurallarını izleyen, kolay yönetilebilen ve genişleyebilen tutarlı olan birtanesini seçin.

    > Benim yapılarım projelerim arasında pek fazla değişmez ama hepsi yapı ve modülerlik için bu rehberi izler. İmplementasyon özelliklere ve takıma göre değişkenlik gösterebilir. Bir başka deyişle, kelimesi kelimesine bir yapıya tutunmayın ama tutarlılığı, yönetilebilirliği ve verimi göz önünde bulundurarak yapınızı ayaralayın.

    > Küçük bir uygulamada, özelliklerin direk bağımlılığı olmadığı, paylaşılan bütün bağımlılıkları ana modüle koymayı düşünebilirsiniz. Bu küçük uygulamaları daha kolay yönetilebilir hale getirir, ama bu uygulamada kullanılan modülleri bu uygulama dışında kullanmayı zorlaştırır.

**[İçerik Listesi](#icerik-listesi)**

## Başlangıç Mantığı

### Konfigürasyon
###### [Stil [Y170](#style-y170)]

  - Kodunuzu, uygulamanız başlamadan önce çalışacak olan [modül konfigürasyonu](https://docs.angularjs.org/guide/module#module-loading-dependencies) içine koyun. Buraya koyulması beklenenler provider'lar ve constant'lardır.

    *Neden?*: Bu yöntem konfigürasyonların yapılacağı yerleri azaltmayı sağlar.

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

### Run Blokları
###### [Stil [Y171](#style-y171)]

  - Uygulama başladığında çalışması gereken her kod bloğu bir fonksiyon ile dışarı açılan factory içerisinde tanımlanmalıdır, ve [run bloğuna](https://docs.angularjs.org/guide/module#module-loading-dependencies) inject edilmelidir.

    *Neden?*: Run bloğu içerisinde boşta duran bir kod zor test edilir. Bir factory içerisine koymak soyutlaştırmayı ve mock'lamayı kolaylaştırır.

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

**[İçerik Listesi](#icerik-listesi)**

## Angular Servisleri

### $document ve $window
###### [Stil [Y180](#style-y180)]

  - `document` ve `window` yerine [`$document`](https://docs.angularjs.org/api/ng/service/$document) ve [`$window`](https://docs.angularjs.org/api/ng/service/$window) kullanın.

    *Neden?*: Bu servisler Angular tarafından yaratılmıştır ve document ve window'a göre daha kolay test edilebilirler. Bu kendiniz için mock document ve window oluşturmanızı engeller.

### $timeout and $interval
###### [Stil [Y181](#style-y181)]

  - `setTimeout` and `setInterval` yerine [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) ve [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) kullanın.

    *Neden?*: Bu servisler Angular tarafından yaratılmıştır, daha kolay test edilebilirler ve Angular'ın digest cycle'ını yönetebilir ve veriyi senkronize tutabilirler.

**[İçerik Listesi](#icerik-listesi)**

## Test

Unit Test yapmak temiz kodu yönetmeye yardımcı olur, bu yüzden benim unit test temelleri için önerilerimi linkler ve daha fazla detay ile paylaşıyorum.

### Testlerinizi Senaryolar İle Yazın
###### [Stil [Y190](#style-y190)]

  - Her senaryo için test kümeleri yazın. Boş bir test ile başlayın ve kodu yazarken içini doldurun.

    *Neden?*: Test tanımlamalarını yazmak senaryonuzun ne yapacağını, ne yapmayacağını ve başarısını nasıl ölçeceğinizi tanımlamaya yardımcı olur.

    ```javascript
    it('Avengers controller`ı tanımlı olmalı', function() {
        // TODO
    });

    it('İsme göre filtrelendiğinde 1 Avenger bulmalı', function() {
        // TODO
    });

    it('10 Avenger olmalı', function() {
        // TODO (mock veri?)
    });

    it('Avengerları XHR ile dönmeli', function() {
        // TODO ($httpBackend?)
    });

    // and so on
    ```

### Test Kütüphanesi
###### [Stil [Y191](#style-y191)]

  - Unit testleriniz için [Jasmine](http://jasmine.github.io/) ya da [Mocha](http://mochajs.org) kullanın.

    *Neden?*: Jasmine ve Mocha, ikisi de Angular topluluğu tarafından yaygınca kullanılmaktadır. İkisi de istikrarlı, iyi yönetilir, ve sağlam test özellikleri sunuyorlar.

    Not: Mocha kullanırken ayrıca [Chai](http://chaijs.com) gibi bir assert kütüphanesi kullanmayı gözönünde bulundurun. Ben Mocha'yı tercih ediyorum.

### Test Çalıştırıcı
###### [Stil [Y192](#style-y192)]

  - Test çalıştırıcısı olarak [Karma](http://karma-runner.github.io)'yı kullanın.

    *Neden?*: Karma kolay ayarlanabilir ve kodunuzu değiştirdiğinizde otomatik olarak ya da birkereliğine çalışabilir bir araçtır.

    *Neden?*: Karma kendi başına ya da Grunt veya Gulp aracılığı ile Continuous Integration sisteminize kolaylıkla dahil olabilir.

    *Neden?*: [WebStorm](http://www.jetbrains.com/webstorm/) ve [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225) gibi bazı IDE'ler Karma ile entegre olmaya başladılar.

    *Neden?*: Karma, [Grunt](http://www.gruntjs.com) ([grunt-karma](https://github.com/karma-runner/grunt-karma) ile) ve [Gulp](http://www.gulpjs.com) gibi otomatik görev yönetici devleri ile uyumlu çalışır. Gulp kullanırken [Karma](https://github.com/karma-runner/karma)'yı direk olarak API'si ile kullanabilirsiniz.

    ```javascript
    /* önerilen stil */

    // Karman'nın direk kullanıldığı Gulp örneği
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

### Stubbing ve Spying
###### [Stil [Y193](#style-y193)]

  - Stubbing ve spying [Sinon](http://sinonjs.org/) kullanın.

    *Neden?*: Sinon, Jasmine ve Mocha ile uyumlu çalışır ve sundukları stubbing ve spying özelliklerini genişletir.

    *Neden?*: Sinon, Jasmine ve Karma arasında kolay geçiş sağlar, eğer ikisini de kullanmak istiyorsanız.

    *Neden?*: Sinon, assert'ler hata verdiğin güzel açıklamalı hata mesajları üretir.

### Head'siz Tarayıcı
###### [Stil [Y194](#style-y194)]

  - Testlerinizi sunucu üzerinde çalıştırmak için [PhantomJS](http://phantomjs.org/) kullanın.
    
    *Neden?*: PhantomJS head'siz bir tarayıcıdır ve testlerinizi görsel bir tarayıcıya ihtiyaç duymadan çalıştırabilir. Böylece sunucunuza Chrome, Safari, IE ya da başka bir tarayıcı yüklemek zorunda kalmazsınız.

    Not: Siz yine de hedef kitlenizin kullanacağı tarayıcıları kendi ortamınızda test etmelisiniz.

### Kod Analizi
###### [Stil [Y195](#style-y195)]

  - Run JSHint on your tests.
  - Testlerinizde JSHint kullanın.

    *Neden?*: Testler de koddur. JSHint kodun hatılı çalışmasına sebep olan kod kalitesi problemlerini denetler.

### JSHint Kurallarını Testler İçin Hafifletmek
###### [Stil [Y196](#style-y196)]

  - `describe` ve `expect` gibi yaygın kullanılan global'lere izin vermesi için kurallarınızı hafifletin. Expression'ları Mocha kullandığı için onları kontrol eden kuralları da hafifletin.

    *Neden?*: Testleriniz de birer koddur ve üretim ortamındaki kodunuz gibi onlar da aynı ilgi ve kod kalitesini hakeder. Ancak, test için test frameworkleri tarafından kullanılan global değişkenler için bu kurallar hafifletilmelidir.

    ```javascript
    /* jshint -W117, -W030 */
    ```
    Or you can add the following to your JSHint Options file.
    Ya da aşağıdaki ayarları JSHint konfigürasyon dosyanıza ekleyebilirsiniz

    ```javascript
    "jasmine": true,
    "mocha": true,
    ```

  ![Test Araçları](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/testing-tools.png)

### Testleri Organize Etmek
###### [Stil [Y197](#style-y197)]

  - Test dosyalarınızı(specs) test ettiğiniz dosyalarla yanyana koyun. Birçok component'i ve sunucu entegrasyonunu test eden kodları `tests` klasörüne koyun.

    *Neden?*: Unit testlerin kaynak kodundaki component ile doğrudan ilişkisi vardır.

    *Neden?*: Sürekli gözönünde olduklarından güncel tutmak kolay olacaktır. TDD de yapsanız, kod yazarken ya da yazdıktan sonra da test yazsanız, kaynak kodu dosyanızla yanyana olan test dosyası gözünüzden ve aklınızdan kaçmaz, ve böylece güncellenme olasılığı ve kodunuzun test kapsamı artar.

    *Neden?*: Kaynak kodunu güncellediğinizde test kodunu da güncellemeniz kolaylaşır.

    *Neden?*: Kaynak kodu ile yanyana koymak test kodlarını bulmayı kolaylaştırır ve taşırken onunla birlikte gitmesini sağlar.

    *Neden?*: Testi yakınlarda tutmak, kaynak kodu okuyan kişinin component'in ne yaptığını ve limitlerini keşfetmesi için testi de okumasını kolaylaştırır.

    *Neden?*: Yayına çıkacak kodun içerisinde testlerin bulunmamasını sağlamak grunt ve gulp ile kolay olur.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.js
                             /customers.controller.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

**[İçerik Listesi](#icerik-listesi)**

## Animasyonlar

### Kullanım
###### [Stil [Y210](#style-y210)]

  - [Angular ile animasyonlar](https://docs.angularjs.org/guide/animations) state'ler arası ve birincil görsel elemanlar için kullanılıyor ise hafif olmalı. [ngAnimate module](https://docs.angularjs.org/api/ngAnimate) modülünü projenize dahil edin. 3 anahtar özellik: hafif, pürüzsüz, teklemeyen.

    *Neden?*: Uygun kullanıldığında hafif animasyonlar kullanıcı deneyimini arttırır.

    *Neden?*: Hafif animasyonlar view geçişleri sırasında hissedilen performansı arttırır.

### Saniyenin Altında
###### [Stil [Y211](#style-y211)]

  - Animasyonlarınızı kısa sürelerde tamamlayın. Ben genellikle 300ms ile başlarım ve duruma göre ayarlarım.

    *Neden?*: Uzun animasyonlar kullanıcı deneyimi ve hissedilen performans üzerinde yavaş bir uygulamaymış gibi algılanıp ters etki yaratabilir. 

### animate.css
###### [Stil [Y212](#style-y212)]

  - Geleneksel animasyonlar için [animate.css](http://daneden.github.io/animate.css/) kullanın.

    *Neden?*: animate.css'in sunduğı animasyonlar hızlı, akıcı ve uygulamanıza kolay eklenebilir.

    *Neden?*: Animasyonlarınızda tutarlılık sağlar.

    *Neden?*: animate.css yaygınca kullanılıyor ve test edilmiş.

    Not: Bu müthiş makaleye göz gezdirin: [Matias Niemelä Angular animations anlatıyor](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html)

**[İçerik Listesi to top](#icerik-listesi)**

## Yorumlar

### jsDoc
###### [Stil [Y220](#style-y220)]

  - Kodunuz için dökümantasyon yaratmayı planlıyorsanız, [`jsDoc`](http://usejsdoc.org/) sintaksını kullanın. Fonksiyon isimleri, açıklamaları, parametreleri ve ne döndürdüklerini listeleyebilirsiniz. `@namespace` ve `@memberOf` anahtar kelimelerini uygulamanızın yapısı ile eşleştirmek için kullanın.

    *Neden?*: Sıfırdan yazmak yere kodunuz üzerinden dökümantasyonunuzu yaratabilirsiniz.

    *Neden?*: Yaygın bir araç kullanmak tutarlılık sağlar.

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
       * @desc Uygulama geneli için logger
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
           * @param {String} msg Loglanacak mesaj
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

**[İçerik Listesi](#icerik-listesi)**

## JS Hint

### Bir Seçenek Dosyası Kullanın
###### [Stil [Y230](#style-y230)]

  - JavaScript Kod denetleyicisi olarak JS Hint kullanın ve JS Hint seçeneklerini kendinize göre ayarlamayı unutmayın. Seçeneklerin detayları için [JS Hint dökümantasyonuna](http://www.jshint.com/docs/) bakın.

    *Neden?*: Kodunuzu versiyon kontrol sistemine göndermeden önce size bir ilk uyarı verir.

    *Neden?*: Takımınız içinde tutarlılık oluşturur.

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

**[İçerik Listesi](#icerik-listesi)**

## JSCS

### Bir Seçenek Dosyası Kullanın
###### [Stil [Y235](#style-y235)]

  - Kod yazım stilinizi kontrol etmek için JSCS kullanın ve JSCS seçeneklerini kendinize göre ayarlamayı unutmayın. Seçeneklerin detayları için [JSCS dökümantasyonuna](http://www.jscs.info) bakın.

    *Neden?*: Kodunuzu versiyon kontrol sistemine göndermeden önce size bir ilk uyarı verir.

    *Neden?*: Takımınız içinde tutarlılık oluşturur.

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

**[İçerik Listesi](#icerik-listesi)**

## Constant'lar

### 3. Parti Kütüphane Global'leri
###### [Stil [Y240](#style-y240)]

  - 3. parti kütüphanelerin global değişkenleri için birer Angular constant'ı tanımlayın.

    *Neden?*: 3. parti kütüphaneleri kodunuza inject etmek için bir yol yaratır. Component'lerinizin bağımlılıklarını daha kolay anlamanızı sağlayarak kodunuzun test edilebilirliğini arttırır. (abstraction sızıntılarını engeller). Ayrıca bu bağımlılıkları mock'layabilmenizi sağlar.

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

###### [Stil [Y241](#style-y241)]

  - Değişmeyen ve başka servislerden gelmeyen değerler için constants kullanın. Eğer bu constant'lar birden fazla uygulamada kullanılabilecek bir modüle için yaratılıyor ise, her modül için constant'ları  modül ile aynı isme sahip bir dosyaya koyun. Bu durum gerekli olmadığı takdirde, constant'ları ana modül içerisinde `constants.js` dosyasında tutun. 

    *Neden?*: Değişme olasılığı olan, çok nadir de olsa, değerler bir servisten alınmalıdır, çünkü bu sayede kaynak kodunuzu değiştirmek zorunda kalmazsınız. Örneğin, bir veri servisi için url adresi constant içine yerleştirilebilir, ama daha iyi bir seçenek bunu bir web servisten yüklemek olacaktır.

    *Neden?*: Constant'lar angular component'lerine inject edilebilir, buna provider'lar dahildir.

    *Neden?*: Bir uygulama başka uygulamalarda kullanılabilecek modüllere ayrıldığında, her biri kendi başına bağımlı olduğu constant'lar ile birlikte çalışabilecek durumda olmalıdır.

    ```javascript
    // Bütün uygulama tarafından kullanılan constant'lar
    angular
        .module('app.core')
        .constant('moment', moment);

    // Sadece satış modülünün kullandığı constant'lar
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[İçerik Listesi](#icerik-listesi)**

## Dosya Şablonları ve Snippet'ler

Tutarlı pattern'ler ve stiller için dosya şablonları ve snippet'ler kullanın. Burada bazı web geliştirme editörleri ve IDE'leri için şablon ve snippet'leri bulabilirsiniz.

### Sublime Text
###### [Stil [Y250](#style-y250)]

  - Bu stil ve rehberleri izleyen Angular snippet'leri

    - [Sublime Angular snippet'leri](assets/sublime-angular-snippets?raw=true) indirin
    - Packages klasörünün içine koyun
    - Sublime'ı baştan başlatın
    - JavaScript dosyalarında bu komutlardan sonra `TAB` tuşuna basın

    ```javascript
    ngcontroller // Angular controller'ı yaratır
    ngdirective  // Angular directive'i yaratır
    ngfactory    // Angular factory'si yaratır
    ngmodule     // Angular modülü yaratır
    ngservice    // Angular service'i yaratır
    ngfilter     // Angular filtresi yaratır
    ```

### Visual Studio
###### [Stil [Y251](#style-y251)]

  - Bu stil ve rehberleri izleyen Angular snippet'leri [SideWaffle](http://www.sidewaffle.com) adresinde bulunabilir

    - [SideWaffle](http://www.sidewaffle.com) Visual Studio extension (vsix dosyası) indirin
    - vsix dosyasını çalıştırın
    - Visual Studio'yu baştan başlatın

### WebStorm
###### [Stil [Y252](#style-y252)]

  - Bu stil ve rehberleri izleyen Angular snippet'leri. Webstorm ayarlarınızdan içeri aktarabilirsiniz:

    - [WebStorm Angular dosya şablonları ve snippet'leri](assets/webstorm-angular-file-template.settings.jar?raw=true)'ni indirin
    - WebStorm'u açın ve `File` menüsüne gidin
    - `Import Settings` seçeneğini seçin
    - Dosyayı seçin ve `OK` tuşuna basın
    - JavaScript dosyalarında bu komutlardan sonra `TAB` tuşuna basın

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

### Atom
###### [Stil [Y253](#style-y253)]

  - Bu stil ve rehberleri izleyen Angular snippet'leri.
    ```
    apm install angularjs-styleguide-snippets
    ```
    ya da
    - Atom'u açın, Pakey yöneticisini açın (Packages -> Settings View -> Install Packages/Themes)
    - 'angularjs-styleguide-snippets' paketini aratın
    - 'Install' tuşuna basıp paketi yükleyin

  - JavaScript dosyalarında bu komutlardan sonra `TAB` tuşuna basın

    ```javascript
    ngcontroller // Angular controller'ı yaratır
    ngdirective // Angular directive'i yaratır
    ngfactory // Angular factory'si yaratır
    ngmodule // Angular modülü yaratır
    ngservice // Angular service'i yaratır
    ngfilter // Angular filtresi yaratır
    ```

### Brackets
###### [Stil [Y254](#style-y254)]

  - Bu stil ve rehberleri izleyen Angular snippet'leri.
    - [Brackets Angular snippet'leri](assets/brackets-angular-snippets.yaml?raw=true)'ni indirin
    - Brackets Extension Yöneticisini açın ( File > Extension manager )
    - ['Brackets Snippet'leri (by edc)'](https://github.com/chuyik/brackets-snippets)'ni yükleyin
    - brackets'in sağ tarafındaki ampule tıklayın
    - `Settings`'e tıklayın ve `Import` seçeneğini seçin
    - Dosyayı seçin
    - `Start Import` seçeneğini seçin

  - JavaScript dosyalarında bu komutlardan sonra `TAB` tuşuna basın

    ```javascript
    // These are full file snippets containing an IIFE
    ngcontroller // Angular controller'ı yaratır
    ngdirective  // Angular directive'i yaratır
    ngfactory    // Angular factory'si yaratır
    ngapp        // Angular modülü yaratır
    ngservice    // Angular service'i yaratır
    ngfilter     // Angular filtresi yaratır

    // These are partial snippets intended to chained
    ngmodule     // Angular module getter'i yaratır
    ngstate      // Angular UI Router tanımlayıcısı yaratır
    ngconfig     // konfigürasyon tanımlama fonksiyonu yaratır
    ngrun        // run bloğu tanımlama fonksiyonu yaratır
    ngroute      // Angular ngRoute 'when' tanımlama fonksiyonu yaratır
    ngtranslate  // $translate servisini promise'ile kullanan şablon yaratır
    ```

### vim
###### [Stil [Y255](#style-y255)]

  - Bu stil ve rehberleri izleyen Angular vim snippet'leri.

    - [vim Angular snippet'leri](assets/vim-angular-snippets?raw=true)'ni indirin
    - [neosnippet.vim](https://github.com/Shougo/neosnippet.vim) dosyasını indirin
    - snippet'leri snippet klasörüne kopyalayın


  - Bu stil ve rehberleri izleyen Angular vim UltiSnips snippet'leri.

    - [vim Angular UltiSnips snippet'leri](assets/vim-angular-ultisnips?raw=true)'ni indirin
    - [UltiSnips](https://github.com/SirVer/ultisnips) dosyasını indirin
    - snippet'leri UltiSnips klasörüne kopyalayın

    ```javascript
    ngcontroller // Angular controller'ı yaratır
    ngdirective  // Angular directive'i yaratır
    ngfactory    // Angular factory'si yaratır
    ngmodule     // Angular modülü yaratır
    ngservice    // Angular service'i yaratır
    ngfilter     // Angular filtresi yaratır
    ```

### Visual Studio Code

###### [Stil [Y256](#style-y256)]

  - [Visual Studio Code](http://code.visualstudio.com) stil ve rehberleri izleyen Angular vim snippet'leri

    - [VS Code Angular snippet'leri](assets/vscode-snippets/javascript.json?raw=true)'ni indirin
    - copy snippets to snippet directory, or alternatively copy and paste the snippets into your existing ones
    - snippet'leri snippet klasörüne kopyalayın, alternatif olarak snippetleri şu andaki snippetlerinizin olduğu yere kopyala/yapıştır yapın

    ```javascript
    ngcontroller // Angular controller'ı yaratır
    ngdirective  // Angular directive'i yaratır
    ngfactory    // Angular factory'si yaratır
    ngmodule     // Angular modülü yaratır
    ngservice    // Angular service'i yaratır
    ```

**[İçerik Listesi](#icerik-listesi)**

## Yeoman Generator
###### [Stil [Y260](#style-y260)]

[HotTowel yeoman üreticisi](http://jpapa.me/yohottowel)'ni Angular uygulamanız için bir başlangıç noktası yaratmak için ve stilleri takip etmek için kullanabilirsiniz.

1. generator-hottowel'ı yükleyin

  ```
  npm install -g generator-hottowel
  ```

2. Yeni bir klasör yaratın ve o klasörün içine girin

  ```
  mkdir myapp
  cd myapp
  ```

3. Üreticiyi çalıştırın

  ```
  yo hottowel helloWorld
  ```

**[İçerik Listesi](#icerik-listesi)**

## Routing

Kullanıcı tarafında, küçük şablonlar ve directive'lerden oluşan view geçişleri için yapılan routing önemlidir.

###### [Stil [Y270](#style-y270)]

  - Kullanıcı tarafındaki routing için [AngularUI Router](http://angular-ui.github.io/ui-router/)'ı kullanın.

    *Neden?*: UI Router Angular router'ın sağladığı bütün özellikleri sağlar ayrıca iç içe route ve state'ler için olanak sağlar.

    *Neden?*: Angular router sintaksına çok benzer ve UI Router'a geçiş yapmak kolaydır.

  - Not: `routerHelperProvider` gibi bir provider kullanarak dosyalar arası state konfigürasyonlarını ayarlama yapabilirsiniz.

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

###### [Stil [Y271](#style-y271)]

  - View'lar için route'ları modül içerisinde tanımlayın. Her modül kend view'ları için gerekli olan route'ları barındırmalıdır.

    *Neden?*: Her modül kendi başına yeterli olmalıdır.

    *Neden?*: Bir modülü kaldırırken ya da eklerken, uygulama sadece var olan view'lara giden route'ları içermelidir.

    *Neden?*: Bu uygulamanın bazu bölümlerini açıp kaparken etrafta ulaşılamayacak route'lar kalmasını engeller.

**[İçerik Listesi](#icerik-listesi)**

## Görev Otomasyonu
Otomatik görevler yaratmak için [Gulp](http://gulpjs.com) ya da [Grunt](http://gruntjs.com) kullanın. Gulp convention over configuration paradigmasını benimserken, Grunt configuration over code prensibini benimser. Ben şahsen Gulp'ı tercih ediyorum. Yazması ve okuması daha kolay geliyor, ama ikisi de çok başarılılar.

> [Gulp Pluralsight kursu](http://jpapa.me/gulpps)mda gulp ve otomatik görevler hakkında daha çok şey öğrenebilirsiniz.

###### [Stil [Y400](#style-y400)]

  - Modül tanımlayıcı dosyalarını `*.module.js` diğer bütün uygulama JavaScript dosyalarından önce listelemek için otomatik görevleri kullanın.

    *Neden?*: Angular modüllerin kullanılmadan önce kayıt olmasını bekler.

    *Neden?*: Modülleri `*.module.js` gibi belirgin bir tarz ile isimlendirmeniz onları yakalamanızı ve listelemenizi kolaylaştırır.

    ```javascript
    var clientApp = './src/client/app/';

    // Always grab module files first
    var files = [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js'
    ];
    ```

**[İçerik Listesi](#icerik-listesi)**

## Filtreler

###### [Stil [Y420](#style-y420)]

  - Komplek objelerin bütün property'lerini taramak için filtreleri kullanmaktan kaçının. Filtreleri property'leri seçmek için kullanın.

    *Neden?*: Filtrelerin kullanımı kolaylıkla suistimal ediliyor ve uygulamanın performansını kötü etkiliyor. Örneğin bir filtrenin büyük ve derin bir objeyi taraması.

**[İçerik Listesi](#icerik-listesi)**

## Angular dökümantasyonu

Burada anlatılanların dışındaki herşey için ve API referansı için [Angular dökümantasyonu](//docs.angularjs.org/api)'na bakın.

## Katkıda bulunma

Potensiyel değişiklik/eklemeler için öncelikle bir issue açın. Eğer rehber hakkında sorularınız varsa, onları da issue olarak açabilirsiniz. Eğer bir yazım hatası bulursanız pull request açın. Anafikir içeriği güncel tutmak ve github'ın kendi özelliklerini kullanarak bu işi issuelar ve pull request'lerle ilerletmek, bunların hepsi google tarafından indeksleniyor ve aramalar da çıkıyor. Neden? Çünkü bir sorunuz var ise, aynı soruyu başkası da soruyor olabilir! Burada nasıl katkıda bulunabileceğinize dair daha fazla bigi bulabilirsiniz.

*Bu repository'ye katkıda bulunarak içeriğinizin bu repository'nin lisansına dahil olduğunu kabul etmiş bulunursunuz.*

### Süreç
    1. Değişiklikleri bir issue ile tartışın.
    2. Bir Pull Request açın, issue'yu referans gösterin, ve değişikliği açıklayın. Bu değişiklik nasıl bir değer katıyor?
    3. Pull Requestiniz incelenecektir ve ya merge edilecek ya da geri çevrilecektir.

## Lisans

_uzun lafın kısası; Bu rehberi kullanın. Katkılarınız makbule geçecektir._

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

**[İçerik Listesi](#icerik-listesi)**
