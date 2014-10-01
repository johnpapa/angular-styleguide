define(['angular',
    'angular',
    '../common/comment/module'
  ],
  function(angular) /*invoke*/ {
    'use strict'

     angular.module('courseLandingApp', [
      'ngRoute',
      'ngAnimate',
      'common.comment'
      ]);
  });