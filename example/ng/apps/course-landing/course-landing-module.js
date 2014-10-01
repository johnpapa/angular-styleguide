define(['angular',
        './course-landing-directive',
        './course-landing-service'
    ],

    function (angular) /*invoke*/ {
        'use strict';

        angular
            .module('courseLanding', [
                'courseLanding.courseLandingDirective',
                'courseLanding.courseLandingService'
            ]);
    }
);