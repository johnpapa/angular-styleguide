define([
  'angular',
  './course-learning-api'
], function(angular) / {
  'use strict';

  angular
    .module('common.courseLearningGoal.learningGoal', [
      'common.courseLearningGoal.studentLearningGoalApi',
      'common.courseLearningGoal.courseLearningGoalApi'
    ])
    .controller('LearningGoalController', LearningGoalController);

  LearningGoalController.$inject = ['$scope', 'CourseLearningGoal', 'StudentLearningGoal'];

  function LearningGoalController($scope, CourseLearningGoal, StudentLearningGoal) {
  }
});