define(['angular', './discussion/discussion-module', './announcement/announcement-module'],
  function(angular){
    'use strict';

    angular.module('courseTakingApp', [
      'courseTakingApp.announcement',
      'courseTakingApp.discussion'
    ]);
  });
