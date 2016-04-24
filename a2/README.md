# Angular 2 Style Guide **D R A F T**
Style Guides require experience building applications with the tools. My style guide for Angular 1 was based on years of experience with Angular 1, collaboration with other Angular experts, and contributions from the Angular core team. Nobody has the equivalent  massive experience with Angular 2, and thus the Angular 2 Style Guide is a work in progress.

My intent is to release the guide as a living document. Guidelines that we are comfortable recommending will be included. Be wary and definitely ask questions when someone, including me, publishes a guide :)

## Angular Team Endorsed
Special thanks to Igor Minar, lead on the Angular team, for reviewing, contributing feedback, and entrusting me to shepherd this guide.

## Purpose
*Opinionated Angular style guide for teams by [@john_papa](//twitter.com/john_papa)*

If you are looking for an opinionated style guide for syntax, conventions, and structuring Angular applications, then step right in. These styles are based on my development experience with [Angular](//angularjs.org), presentations, [Pluralsight training courses](http://app.pluralsight.com/author/john-papa) and working in teams.

The purpose of this style guide is to provide guidance on building Angular applications by showing the conventions I use and, more importantly, why I choose them.

>If you like this guide, check out my [Angular 2 First Look course on Pluralsight](http://jpapa.me/a2ps1stlook).

![Angular 2 First Look](https://s3-us-west-2.amazonaws.com/johnpapa-blog-images/a2-first-look-app.gif)

## Community Awesomeness and Credit
Never work in a vacuum. I find that the Angular community is an incredible group who are passionate about sharing experiences. Many of my styles have been from the many pair programming sessions [Ward Bell](https://twitter.com/wardbell) and I have had. My friend Ward has certainly helped influence the ultimate evolution of this guide.

##Translations
Translations of this Angular 2 style guide are maintained by the community. Due to the in flux nature of this guide, I will hold off on accepting contributions for the time being. But I hope to get the same amazing contributions we had for the v1 of the guide!

## Table of Contents

  1. [Single Responsibility](#single-responsibility)
  1. [Modules](#modules)
  1. [Components](#components)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Data Services](#data-services)
  1. [Naming](#naming)
  1. [Application Structure LIFT Principle](#application-structure-lift-principle)
  1. [Application Structure](#application-structure)
  1. [File Templates and Snippets](#file-templates-and-snippets)
  1. [Angular CLI](#angular-cli)
  1. [Routing](#routing)
  1. [Angular Docs](#angular-docs)

## Single Responsibility

### Rule of 1
###### [Style [A2-001](#style-a2-001)]

  - Define 1 component per file, recommended to be less than 400 lines of code.

  *Why?*: One component per file promotes easier unit testing and mocking.

  *Why?*: One component per file makes it far easier to read, maintain, and avoid collisions with teams in source control.

  *Why?*: One component per file avoids hidden bugs that often arise when combining components in a file where they may share variables, create unwanted closures, or unwanted coupling with dependencies.

  The following example defines the `AppComponent`, handles the bootstrapping, and shared functions all in the same file.
  
  The key is to make the code more reusable, easier to read, and less mistake prone.

  ```javascript
  /* avoid */
  import { bootstrap } from 'angular2/platform/browser';
  import { Component, OnInit } from 'angular2/core';

  @Component({
    selector: 'my-app',
    template: `
        <h1>{{title}}</h1>
        <pre>{{heroes | json}}</pre>  
      `,
    styleUrls: ['app/app.component.css']
  })
  export class AppComponent implements OnInit{
    title = 'Tour of Heroes';

    heroes: Hero[] = [];

    ngOnInit() {
      getHeroes().then(heroes => this.heroes = heroes);
    }
  }

  bootstrap(AppComponent, []);

  function getHeroes() {
    return // some promise of data;
  }  
  ```
  
  The same components are now separated into their own files.

  ```javascript
  /* recommended */

  // main.ts
  import { bootstrap } from 'angular2/platform/browser';
  import { AppComponent } from './app.component';

  bootstrap(AppComponent, []);
  ```
  
  ```javascript
  /* recommended */

  // app.component.ts
  import { Component, OnInit } from 'angular2/core';

  import { Hero } from './hero';
  import { HeroService } from './hero.service';

  @Component({
    selector: 'my-app',
    template: `
        <pre>{{heroes | json}}</pre>  
      `,
    styleUrls: ['app/app.component.css'],
    providers: [HeroService]
  })
  export class AppComponent implements OnInit{
    heroes: Hero[] = [];

    constructor(private _heroService: HeroService) {}
    
    ngOnInit() {
      this._heroService.getHeroes().then(heroes => this.heroes = heroes);
    }
  }
  ```

  ```typescript
  /* recommended */

  // hero.service.ts
  import { Injectable } from 'angular2/core';
  import { HEROES } from './mock-heroes';

  @Injectable()
  export class HeroService {
    getHeroes() {
      return Promise.resolve(HEROES);
    }
  }
  ```

  ```javascript
  /* recommended */

  // hero.ts
  export class Hero {
    id: number;
    name: string;
  }
  ```
  
  As the app grows, this rule becomes even more important.

**[Back to top](#table-of-contents)**

### Small Functions
###### [Style [A2-002](#style-a2-002)]

  - Define small functions, no more than 75 LOC (less is better).

  *Why?*: Small functions are easier to test, especially when they do one thing and serve one purpose.

  *Why?*: Small functions promote reuse.

  *Why?*: Small functions are easier to read.

  *Why?*: Small functions are easier to maintain.

  *Why?*: Small functions help avoid hidden bugs that come with large functions that share variables with external scope, create unwanted closures, or unwanted coupling with dependencies.

**[Back to top](#table-of-contents)**

## Modules

### Avoid Naming Collisions
###### [Style [A2-020](#style-a2-020)]

  - Use unique naming conventions.

  *Why?*: Unique names help avoid module name collisions. We import and export modules by the file in which they are contained. Thus the name of the files and their folders is important.

  *Why?*: Names of folders and files should clear convey their intent. For example, `app/speakers/speaker-list.component.ts` may contain a component that manages a list of speakers. The folder and file names clearly convey the meaning, and thus the module import is clear as `import { SpeakerListComponent } from './speakers/speaker-list.component'`.

## Components

### Member Sequence
###### [Style [A2-033](#style-a2-033)]

  - Place properties up top, then public functions, then private functions, alphabetized, and not spread through the component code.

    *Why?*: Placing members in a consistent sequence makes it easy to read and helps you instantly identify which members of the component serve which purpose.

  ```typescript
  /* recommended */
  export class ToastComponent implements OnInit {
    // private fields
    private _defaults = {
      title: '',
      message: 'May the Force be with You'
    };
    private _toastElement: any;

    // public properties
    title: string;
    message: string;

    // ctor
    constructor(toastService: ToastService) {
      toastService.activate = this.activate.bind(this);
    }

    // public functions
    activate(message = this._defaults.message, title = this._defaults.title) {
      this.title = title;
      this.message = message;
      this._show();
    }

    ngOnInit() {
      this._toastElement = document.getElementById('toast');
    }

    // private functions
    private _hide() {
      this._toastElement.style.opacity = 0;
      window.setTimeout(() => this._toastElement.style.zIndex = 0, 400);
    }
    
    private _show() {
      console.log(this.message);
      this._toastElement.style.opacity = 1;
      this._toastElement.style.zIndex = 9999;

      window.setTimeout(() => this._hide(), 2500);
    }
  }
  ```

### Defer Logic to Services
###### [Style [A2-035](#style-a2-035)]

  - Defer logic in a component by delegating to services.

  - Define a component for a view, and try not to reuse the component for other views. Instead, move reusable logic to factories and keep the component simple and focused on its view.

    *Why?*: Logic may be reused by multiple components when placed within a service and exposed via a function.

    *Why?*: Logic in a service can more easily be isolated in a unit test, while the calling logic in the component can be easily mocked.

    *Why?*: Removes dependencies and hides implementation details from the component.

    *Why?*: Keeps the component slim, trim, and focused.

  ```typescript
  // avoid
  export class SessionListComponent implements OnInit {
    sessions: Session[];

    constructor(private _http: Http) { }

    getSessions() {
      this.sessions = [];
      this._http.get(sessionsUrl)
        .map((response: Response) => <Session[]>response.json().data)
        .catch(this._exceptionService.catchBadResponse)
        .finally(() => this._spinnerService.hide())
        .subscribe(sessions => this.sessions = sessions);
    }
    

    ngOnInit() {
      this.getSessions();
    }
  }
  ```
  
  ```typescript
  // recommended
  export class SessionListComponent implements OnInit {
    sessions: Session[];

    constructor(private _sessionService: SessionService) { }

    getSessions() {
      this.sessions = [];
      this._sessionService.getSessions()
        .subscribe(sessions => this.sessions = sessions);
    }

    ngOnInit() {
      this.getSessions();
    }
  }
  ```

**[Back to top](#table-of-contents)**

## Services

### Singletons
###### [Style [A2-040](#style-a2-040)]

  - Services are singletons and should be used for sharing data and functionality.

  ```typescript
  // service  
  import { Injectable } from 'angular2/core';
  import { Session } from './session';

  @Injectable()
  export class HeroService {
    constructor(private _http: Http) { }

    getHeroes() {
      return this._http.get('api/sessions')
        .map((response: Response) => <Session[]>response.json().data)
    }
  }
  ```

### Providing a Service
###### [Style [A2-041](#style-a2-041)]

  - Services should be provided to the Angular 2 injector at the top-most component where they will be shared. 
 
    *Why?*: The Angular 2 injector is hierarchical.

    *Why?*: When providing the service to a top level component, that instance is shared and available to all child components of that top level component.
 
    *Why?*: This is ideal when a service is sharing methods and has no state, or state that must be shared.
    
    *Why?*: This is not ideal when two different components need different instances of a service. In this scenario it would be better to provide the service at the component level that needs the new and separate instance.
    
  ```typescript
  /* recommended */

  // app.component.ts
  import { Component } from 'angular2/core';

  import { SpeakerListComponent } from './speakers/speaker-list.component';
  import { SpeakerService } from './common/speaker.service';

  @Component({
    selector: 'my-app',
    template: `
        <my-speakers></my-speakers>  
      `,
    directives: [SpeakerListComponent],
    providers: [SpeakerService]
  })
  export class AppComponent { }
  ```
  
  ```typescript
  /* recommended */

  // speaker-list.component.ts
  import { Component, OnInit } from 'angular2/core';

  import { SpeakerService } from './common/speaker.service';
  import { Speaker } from './common/speaker';

  @Component({
    selector: 'my-speakers',
    template: `
        <pre>{{speakers | json}}</pre>  
      `
  })
  export class SpeakerListComponent implements OnInit{
    speakers: Speaker[] = [];

    constructor(private _speakerService: SpeakerService) {}

    ngOnInit() {
      this._speakerService.getSpeakers().then(speakers => this.speakers = speakers);
    }
  }
  ```
  
**[Back to top](#table-of-contents)**

### Single Responsibility
###### [Style [A2-042](#style-a2-050)]

  - Services should have a [single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a service begins to exceed that singular purpose, a new one should be created.

**[Back to top](#table-of-contents)**

## Data Services

### Separate Data Calls
###### [Style [A2-050](#style-a2-050)]

  - Refactor logic for making data operations and interacting with data to a service. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    *Why?*: The component's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the component be simpler and more focused on the view.

    *Why?*: This makes it easier to test (mock or real) the data calls when testing a component that uses a data service.

    *Why?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as `$http`. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a component), also making it easier to change the implementation.

  ```typescript
  // recommended
  export class SessionListComponent implements OnInit {
    sessions: Session[];
    filteredSessions = this.sessions;

    constructor(private _sessionService: SessionService) { }

    getSessions() {
      this.sessions = [];
      this._sessionService.getSessions()
        .subscribe(sessions => {
          this.sessions = this.filteredSessions = sessions;
        },
        error => {
          console.log('error occurred here');
          console.log(error);
        },
        () => {
          console.log('completed');
        });
    }

    ngOnInit() {
      this.getSessions();
    }
  }
  ```

**[Back to top](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [A2-100](#style-a2-100)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.component.ts`)
    * the registered component name with Angular (`Component`)

    *Why?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Why?*: The naming conventions should simply help you find your code faster and make it easier to understand.

**[Back to top](#table-of-contents)**

### File Names
###### [Style [A2-101](#style-a2-101)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. A recommended pattern is `feature.type.ts`.

  - use dashes to separate words and dots to separate the descriptive name from the type.

    *Why?*: Provides a consistent way to quickly identify components.

    *Why?*: Provides pattern matching for any automated tasks.

    ```
    // recommended

    // Bootstrapping file and main entry point
    main.ts
    
    // Components
    speakers.component.ts
    speaker-list.component.ts
    speaker-detail.component.ts

    // Services
    logger.service.ts
    speaker.service.ts
    exception.service.ts
    filter-text.service.ts
    
    // Models
    session.ts
    speaker.ts    
    
    // Pipes
    ellipsis.pipe.ts
    init-caps.pipe.ts
    ```
    
### Test File Names
###### [Style [A2-102](#style-a2-102)]

  - Name test specifications similar to the component they test with a suffix of `spec`.

    *Why?*: Provides a consistent way to quickly identify components.

    *Why?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```
    // recommended

    // Components
    speakers.component.spec.ts
    speaker-list.component.spec.ts
    speaker-detail.component.spec.ts

    // Services
    logger.service.spec.ts
    speaker.service.spec.ts
    exception.service.spec.ts
    filter-text.service.spec.ts
    
    // Pipes
    ellipsis.pipe.spec.ts
    init-caps.pipe.spec.ts
    ```

**[Back to top](#table-of-contents)**

### Component Names
###### [Style [A2-103](#style-a2-103)]

  - Use consistent names for all components named after their feature. Use UpperCamelCase for components' symbols. Match the name of the component to the naming of the file

    *Why?*: Provides a consistent way to quickly identify and reference components.

    *Why?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    ```typescript
    AppComponent            //app.component.ts
    SpeakersComponent       //speakers.component.ts
    SpeakerListComponent    //speaker-list.component.ts
    SpeakerDetailComponent  //speaker-detail.component.ts
    ```

**[Back to top](#table-of-contents)**

### Suffixes
###### [Style [A2-104](#style-a2-104)]

  - Append the component name with the suffix `Component`.

    *Why?*: The `Component` suffix is more commonly used and is more explicitly descriptive.

    ```typescript
    // recommended

    // speaker-list.component.ts
    export class SpeakerListComponent { }
    ```

### Service Names
###### [Style [A2-110](#style-a2-110)]

  - Use consistent names for all services named after their feature. Use UpperCamelCase for services. Only suffix service and factories with `Service` when it is not clear what they are (e.g. when they are nouns).

    *Why?*: Provides a consistent way to quickly identify and reference services.

    *Why?*: Clear service names such as `logger` do not require a suffix.

    *Why?*: Service names such as `Credit` are nouns and require a suffix and should be named with a suffix when it is not obvious if it is a service or something else. 

    ```typescript
    SpeakerService // speaker.service.ts
    CreditService  // credit.service.ts
    Logger         // logger.service.ts
    ```
    
**[Back to top](#table-of-contents)**

## Routing
Client-side routing is important for creating a navigation flow between a component tree hierarchy, and composing components that are made of many other child components.

**[Back to top](#table-of-contents)**

### Component Router
###### [Style [A2-130](#style-a2-130)]

  - Separate route configuration into a routing component file, also known as a component router.

  - Use a `<router-outlet>` in the component router, where the routes will have their component targets display their templates.
  
  - Focus the logic in the component router to the routing aspects and its target components. Extract other logic to services and other components.
  
    *Why?*: A component that handles routing is known as the component router, thus this follows the Angular 2 routing pattern.
    
    *Why?*: A component that handles routing is known as the componenter router.

    *Why?*: The `<router-outlet>` indicates where the tempalte should be displayed for the target route.
    
    ```typescript
    import { Component } from 'angular2/core';
    import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

    import { SpeakersComponent, SpeakerService } from './^speakers';
    import { DashboardComponent } from './^dashboard';
    import { NavComponent } from './layout/nav.component';

    @Component({
      selector: 'my-app',
      templateUrl: 'app/app.component.html',
      styleUrls: ['app/app.component.css'],
      directives: [ROUTER_DIRECTIVES, NavComponent],
      providers: [
        ROUTER_PROVIDERS,
        SpeakerService
      ]
    })
    @RouteConfig([
      { path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },
      { path: '/speakers/...', name: 'Speakers', component: SpeakersComponent },
    ])
    export class AppComponent { }
    ```

**[Back to top](#table-of-contents)**

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

    *Why?*: I find this to be super important for a project. If the team cannot find the files they need to work on quickly, they will not be able to work as efficiently as possible, and the structure needs to change. You may not know the file name or where its related files are, so putting them in the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

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

    *Why?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when I have a set of very small features that are all related to each other, they are still easily identifiable.

### Flat
###### [Style [Y143](#style-y143)]

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *Why?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is an obvious value (to help the rest of LIFT) in creating a new folder.

### T-DRY (Try to Stick to DRY)
###### [Style [Y144](#style-y144)]

  - Be DRY, but don't go nuts and sacrifice readability.

    *Why?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT, which is why I call it T-DRY. I don’t want to type session-view.html for a view because, well, it’s obviously a view. If it is not obvious or by convention, then I name it.

**[Back to top](#table-of-contents)**

## Application Structure

### Overall Guidelines
###### [Style [A2-150](#style-a2-150)]

  - Have a near term view of implementation and a long term vision. In other words, start small but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each component, service, pipe is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder. I didn't write them and I don't want them cluttering my app.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Layout
###### [Style [A2-151](#style-a2-151)]

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and component may act as the container for the app, navigation, menus, content areas, and other regions.

    *Why?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure
###### [Style [A2-152](#style-a2-152)]

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed.

    *Why?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names.

    *Why?*: The LIFT guidelines are all covered.

    *Why?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *Why?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

  **example coming soon**

**[Back to top](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Visual Studio Code

  - [Visual Studio Code](https://code.visualstudio.com/) snippets that follow these styles and guidelines.
  
    - [Snippets for VS Code](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
    
    [![Use Extension](https://github.com/johnpapa/vscode-angular2-snippets/raw/master/images/use-extension.gif)](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)


**[Back to top](#table-of-contents)**

## Angular CLI

**[Back to top](#table-of-contents)**

## Angular docs
For anything else, API reference, check the [Angular 2 documentation](//angular.io).

**[Back to top](#table-of-contents)**
