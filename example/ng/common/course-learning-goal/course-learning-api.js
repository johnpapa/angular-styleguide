define(['angular'], function(angular) {
    "use strict";

  // StudentLearningGoalApi factory
  angular.module('common.courseLearningGoal.courseLearningApi')
    .factory('StudentLearningGoal', CourseLearningGoalApi);

  CourseLearningGoalApi.$inject = ['$http'];

  function CourseLearningGoalApi($http) {

    return {
      getGoals: getGoals
    };

    function getGoals() {
      return $http.get('/api/goals')
        .then(getGoalsComplete)
        .catch(getFailed);
    }

    function getGoalsComplete(response) {
      return response.data.results;
    }

    function getFailed(error) {
    }
  }
});