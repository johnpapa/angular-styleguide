define(['angular'], function (angular) {
    'use strict';
    angular
        .module('courseLanding.courseLandingDirective', [])
        .directive('courseLanding', courseLandingDirective);

    function courseLandingDirective() {
        var directive = {
            link: link,
            templateUrl: './course-landing-directive.tpl.html',
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
            /* */
        }
    }
});