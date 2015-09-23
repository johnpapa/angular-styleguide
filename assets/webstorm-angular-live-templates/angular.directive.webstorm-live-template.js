(function() {
    'use strict';

    angular
        .module('$moduleName$')
        .directive('$directiveName$', $directiveName$);

    $directiveName$.$inject = ['$dependency$'];

    /* @ngInject */
    function $directiveName$ ($dependency$) {
        var directive = {
            bindToController: true,
            controller: $ControllerName$,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
            $END$
        }
    }

})();
