define(['angular', './learning-goal'], function(angular) {
  'use strict'; 
  angular
    .module('common.courseLearningGoal', [
      'common.courseLearningGoal.learningGoal',
      'common.courseLearningGoal.courseLearningGoalApi',
      'common.courseLearningGoal.studentLearningGoalApi'
    ]);
});