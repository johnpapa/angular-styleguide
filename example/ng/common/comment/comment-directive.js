define(['angular'], function(angular) /*invoke*/ {
  'use strict';
  angular
    .module('common.comment.commentDirective',[])
    .directive('comment', commentDirective);

  function commentDirective() {
    var directive = {
      link: link,
      templateUrl: './comment.tpl.html',
      restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
      /* */
    }
  }

});