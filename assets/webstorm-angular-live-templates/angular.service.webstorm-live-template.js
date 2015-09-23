(function() {
    'use strict';

    angular
        .module('$moduleName$')
        .service('$ServiceName$', $ServiceName$);

    $ServiceName$.$inject = ['$dependency$'];

    /* @ngInject */
    function $ServiceName$($dependency$) {
        this.$functionName$ = $functionName$;

        ////////////////

        function $functionName$() {
            $END$
        }
    }

})();
