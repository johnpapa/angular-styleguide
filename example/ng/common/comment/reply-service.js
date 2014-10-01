define(['angular'], function (angular) {
    'use strict';
    angular.module('common.comment.replyService')
        .factory('ReplyService', ReplyService);

    function ReplyService() {
        return {
            doesSomething: doesSomething
        };

        function doesSomething(){}
    }
});