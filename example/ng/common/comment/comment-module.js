define(['angular',
    './reply-directive',
    './comment-directive',
    './reply-service'
  ],
  function(angular) /*invoke*/ {
      "use strict";

     angular
      .module('common.comment', [
        'common.comment.commentDirective',
        'common.comment.replyDirective',
        'common.comments.replyService'
      ]);
  });