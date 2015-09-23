(function() {
    'use strict';

    angular
        .module('$moduleName$')
        .filter('$filterName$', $filterName$);

    function $filterName$() {
        return $filterName$Filter;

        ////////////////

        function $filterName$Filter($parameters$) {
            return $parameters$;
        } $END$
    }

})();
