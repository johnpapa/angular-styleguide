define(['angular', './comment/comment-module', './course-learning-goal/course-learning-goal-module'],
    function (angular) /*invoke*/ {
        "use strict";

        angular.module('common', [
            'common.comment',
            'common.courseLearningGoal'
        ]);
    });