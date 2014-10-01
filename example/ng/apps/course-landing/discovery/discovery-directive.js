define(['angular'], function (angular) {
    'use strict';
    angular
        .module('courseLanding.discovery.discoveryDirective', [])
        .directive('discovery', discoveryDirective);

    function discoveryDirective() {
        var directive = {
            link: link,
            templateUrl: './discovery.tpl.html',
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
            /* */
        }
    }
});