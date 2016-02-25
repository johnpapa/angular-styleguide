# Angular 2 Style Guide **D R A F T**
Style Guides require experience building applications with the tools. My style guide for Angular 1 was based on years of experience with Angular 1, collaboration with other Angular experts, and conributions from the Angular core team. Nobody has the same massive experience with Angular 2, and thus the Angular 2 Style Guide is a work in progress.

My intent is to release the guide as a living document. Guidelines that we are comfortable recommending will be included. Be wary and definately ask questions when someone, including me, publishes a guide :)

## Angular Team Endorsed
Special thanks to Igor Minar, lead on the Angular team, for reviewing, contributing feedback, and entrusting me to shepherd this guide.

## Purpose
*Opinionated Angular style guide for teams by [@john_papa](//twitter.com/john_papa)*

If you are looking for an opinionated style guide for syntax, conventions, and structuring Angular applications, then step right in. These styles are based on my development experience with [Angular](//angularjs.org), presentations, [Pluralsight training courses](http://app.pluralsight.com/author/john-papa) and working in teams.

The purpose of this style guide is to provide guidance on building Angular applications by showing the conventions I use and, more importantly, why I choose them.

>If you like this guide, check out my Angular 2 First Look course **coming soon** to Pluralsight.

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

  - Define 1 component per file, recommended to be less than 500 lines of code.

  *Why?*: One component per file promotes easier unit testing and mocking.

  *Why?*: One component per file makes it far easier to read, maintain, and avoid collisions with teams in source control.

  *Why?*: One component per file avoids hidden bugs that often arise when combining components in a file where they may share variables, create unwanted closures, or unwanted coupling with dependencies.

  The following example defines the `app` module and its dependencies, defines a component, and defines a factory all in the same file.

  **example coming soon**

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

  - Use unique naming conventions with separators for sub-modules.

  *Why?*: Unique names help avoid module name collisions. Separators help define modules and their submodule hierarchy. For example `app` may be your root module while `app.dashboard` and `app.users` may be modules that are used as dependencies of `app`.

### Definitions (aka Setters)
###### [Style [A2-021](#style-a2-021)]

## Components

### Bindable Members Up Top
###### [Style [A2-033](#style-a2-033)]

  - Place bindable members at the top of the component, alphabetized, and not spread through the component code.

    *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of the component can be bound and used in the View.

    *Why?*: Setting anonymous functions in-line can be easy, but when those functions are more than 1 line of code they can reduce the readability. Defining the functions below the bindable members (the functions will be hoisted) moves the implementation details down, keeps the bindable members up top, and makes it easier to read.

  **example coming soon**

### Defer Logic to Services
###### [Style [A2-035](#style-a2-035)]

  - Defer logic in a component by delegating to services.

    *Why?*: Logic may be reused by multiple components when placed within a service and exposed via a function.

    *Why?*: Logic in a service can more easily be isolated in a unit test, while the calling logic in the component can be easily mocked.

    *Why?*: Removes dependencies and hides implementation details from the component.

    *Why?*: Keeps the component slim, trim, and focused.

  **example coming soon**

### Keep Components Focused
###### [Style [A2-037](#style-a2-037)]

  - Define a component for a view, and try not to reuse the component for other views. Instead, move reusable logic to factories and keep the component simple and focused on its view.

    *Why?*: Reusing components with several views is brittle and good end-to-end (e2e) test coverage is required to ensure stability across large applications.

  **example coming soon**

**[Back to top](#table-of-contents)**

## Services

### Singletons
###### [Style [A2-040](#style-a2-040)]

  - Services are singletons and should be used for sharing data and functionality.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Single Responsibility
###### [Style [A2-050](#style-a2-050)]

  - Services should have a [single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is encapsulated by its context. Once a service begins to exceed that singular purpose, a new one should be created.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Singletons
###### [Style [A2-051](#style-a2-051)]

  - Factories are singletons and return an object that contains the members of the service.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Accessible Members Up Top
###### [Style [A2-052](#style-a2-052)]

  - Expose the callable members of the service (its interface) at the top

    *Why?*: Placing the callable members at the top makes it easy to read and helps you instantly identify which members of the service can be called and must be unit tested (and/or mocked).

    *Why?*: This is especially helpful when the file gets longer as it helps avoid the need to scroll to see what is exposed.

    *Why?*: Setting functions as you go can be easy, but when those functions are more than 1 line of code they can reduce the readability and cause more scrolling. Defining the callable interface via the returned service moves the implementation details down, keeps the callable interface up top, and makes it easier to read.

  **example coming soon**

**[Back to top](#table-of-contents)**

## Data Services

### Separate Data Calls
###### [Style [A2-060](#style-a2-060)]

  - Refactor logic for making data operations and interacting with data to a service. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    *Why?*: The component's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the component be simpler and more focused on the view.

    *Why?*: This makes it easier to test (mock or real) the data calls when testing a component that uses a data service.

    *Why?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as `$http`. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a component), also making it easier to change the implementation.

  **example coming soon**

**[Back to top](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [A2-120](#style-a2-120)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.component.ts`)
    * the registered component name with Angular (`Component`)

    *Why?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Why?*: The naming conventions should simply help you find your code faster and make it easier to understand.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Feature File Names
###### [Style [A2-121](#style-a2-121)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.ts`.

    *Why?*: Provides a consistent way to quickly identify components.

    *Why?*: Provides pattern matching for any automated tasks.

### Test File Names
###### [Style [A2-122](#style-a2-122)]

  - Name test specifications similar to the component they test with a suffix of `spec`.

    *Why?*: Provides a consistent way to quickly identify components.

    *Why?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Component Names
###### [Style [A2-123](#style-a2-123)]

  - Use consistent names for all components named after their feature. Use UpperCamelCase for components, as they are constructors.

    *Why?*: Provides a consistent way to quickly identify and reference components.

    *Why?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Component Name Suffix
###### [Style [A2-124](#style-a2-124)]

  - Append the component name with the suffix `Component`.

    *Why?*: The `Component` suffix is more commonly used and is more explicitly descriptive.

    ```typescript
    /**
     * recommended
     */

    // avengers.component.ts
    export class AvengersComponent { }
    ```

### Service Names
###### [Style [A2-125](#style-a2-125)]

  - Use consistent names for all services named after their feature. Use UpperCamelCase for services. Only suffix service and factories with `Service` when it is not clear what they are (i.e. when they are nouns).

    *Why?*: Provides a consistent way to quickly identify and reference services.

    *Why?*: Clear service names such as `logger` do not require a suffix.

    *Why?*: Service names such as `avengers` are nouns and require a suffix and should be named `AvengersService`.

  **example coming soon**

**[Back to top](#table-of-contents)**

### Directive Component Names
###### [Style [A2-126](#style-a2-126)]

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    *Why?*: Provides a consistent way to quickly identify and reference components.

    **example coming soon**

**[Back to top](#table-of-contents)**

### Routes
###### [Style [A2-129](#style-a2-129)]

  - Separate route configuration into a routing component file.

  **example coming soon**

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

## Modularity

### Many Small, Self Contained Modules
###### [Style [A2-160](#style-a2-160)]

  - Create small modules that encapsulate one responsibility.

    *Why?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally. This means we can plug in new features as we develop them.

  **example coming soon**

**[Back to top](#table-of-contents)**

## File Templates and Snippets
Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

### Visual Studio Code

  - [Visual Studio Code](https://code.visualstudio.com/) snippets that follow these styles and guidelines.

**[Back to top](#table-of-contents)**

## Angular CLI

**[Back to top](#table-of-contents)**

## Routing
Client-side routing is important for creating a navigation flow between views and composing views that are made of many smaller templates and directives.

**[Back to top](#table-of-contents)**

## Angular docs
For anything else, API reference, check the [Angular 2 documentation](//angular.io).

**[Back to top](#table-of-contents)**
