define(['angular'], function(angular) {
  'use strict';

  // StudentLearningGoalApi factory
  angular.module('common.courseLearningGoal.courseLearningApi')
    .factory('StudentLearningGoal', StudentLearningGoalApi);

  CourseLearningGoalApi.$inject = ['$http'];

  function CourseLearningGoalApi($http) {

    return {
      getGoals: getGoals
    };

    function getGoals() {
      return $http.get('/api/goals')
        .then(getAvengersComplete)
        .catch(getAvengersFailed);
    }

    function getGoalsComplete(response) {
      return response.data.results;
    }

    function getFailed(error) {
      console.error('XHR Failed for getGoals.' + error.data);
    }
  }
});