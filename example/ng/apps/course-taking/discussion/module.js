define(['angular', './discussion-creation', './discussion-form'], function(angular) /*invoke*/ {
  'use strict';
  angular
    .module('courseTaking.discussion',[ 
      'courseTakingApp.discussion.discussionForm', 
      'courseTakingApp.discussion.discusionCreation']);
});