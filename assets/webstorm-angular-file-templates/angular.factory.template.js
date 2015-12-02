(function() {
    'use strict';

    angular
        .module('${moduleName}')
        .factory('${factoryName}', ${factoryName});

    ${factoryName}.${DS}inject = [${dependencyInjection}];

    /* @ngInject */
    function ${factoryName}(${dependency}) {
        var service = {
            ${functionName}: ${functionName}
        };
        return service;

        ////////////////

        function ${functionName}() {
            
        }
    }

})();