(function() {
    'use strict';

    angular
        .module('${moduleName}')
        .directive('${directiveName}', ${directiveName});

    ${directiveName}.${DS}inject = [${dependencyInjection}];

    /* @ngInject */
    function ${directiveName}(${dependency}) {
        var directive = {
            bindToController: true,
            controller: ${ControllerName},
            controllerAs: '${vm}',
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            
        }
    }

    ${ControllerName}.${DS}inject = [${dependencyInjection}];

    /* @ngInject */
    function ${ControllerName}(${dependency}) {
        
    }

})();