(function() {
    'use strict';

    angular
        .module('${moduleName}')
        .controller('${ControllerName}', ${ControllerName});

    ${ControllerName}.${DS}inject = [${dependencyInjection}];

    /* @ngInject */
    function ${ControllerName}(${dependency}) {
        var vm = this;
        vm.title = '${ControllerName}';

        activate();

        ////////////////

        function activate() {
            
        }
    }

})();