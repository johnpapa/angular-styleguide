(function() {
    'use strict';

    angular
        .module('$moduleName$')
        .controller('$ControllerName$', $ControllerName$);

    $ControllerName$.$inject = ['$dependency$'];

    /* @ngInject */
    function $ControllerName$($dependency$) {
        var vm = this;
        vm.title = '$ControllerName$';

        activate();

        ////////////////

        function activate() {
            $END$
        }
    }

})();

