define(['angular', './common/comment/module', './common/course-learning/module'],
  function(angular) /*invoke*/ {
    'use strict'

    angular.module('common', [
      'common.comment',
      'common.courseLearningGoal'
    ])
  });