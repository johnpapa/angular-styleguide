define(['angular'], function(angular) /*invoke*/ {
  'use strict';

  angular
    .module('common.comment.replyDirective', [])
    .directive('reply', replyDirective);

  function replyDirective() {
    var directive = {
      link: link,
      templateUrl: './reply.tpl.html',
      restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
      /* */
    }
  }

});