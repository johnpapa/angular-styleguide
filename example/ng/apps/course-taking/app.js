define(['angular', './discussion/discussion-module', './announcement/announcement-module'],
  function(angular) /*invoke*/ {
    'use strict'

    angular.module('courseTakingApp', [
      'courseTakingApp.announcement',
      'courseTakingApp.discussion'
    ])
  });
