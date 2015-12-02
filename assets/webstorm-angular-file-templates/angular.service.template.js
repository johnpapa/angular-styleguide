(function() {
    'use strict';

    angular
        .module('${moduleName}')
        .service('${ServiceName}', ${ServiceName});

    ${ServiceName}.${DS}inject = [${dependencyInjection}];

    /* @ngInject */
    function ${ServiceName}(${dependency}) {
        this.${functionName} = ${functionName};

        ////////////////

        function ${functionName}() {
            
        }
    }

})();