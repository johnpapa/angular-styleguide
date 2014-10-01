define(['angular'], ['./announcement-api'], function(angular) {
    'use strict';

    angular.module('courseTakingApp.announcement.announcementForm',['courseTakingApp.announcement.announcementApi'])
        .controller('AnnouncementController',AnnouncementController)
        .directive('announcementPane',announcementPaneDirective);

    AnnouncementController.$inject = ['$scope', 'Announcement'];

    function AnnouncementController($scope, Announcement) {
        $scope.announcements = Announcement.getAnnouncements();
    }

    function announcementPaneDirective() {
        var directive = {
            template: '<div ng-repeat="items in announcements"></div>',
            restrict: 'EA'
        };

        return directive;
    }
});
