(function() {
    'use strict';

    angular
        .module('$moduleName$')
        .factory('$factoryName$', $factoryName$);

    $factoryName$.$inject = ['$dependency$'];

    /* @ngInject */
    function $factoryName$($dependency$) {
        var service = {
            $functionName$: $functionName$
        };
        return service;

        ////////////////

        function $functionName$() {
            $END$
        }
    }

})();
