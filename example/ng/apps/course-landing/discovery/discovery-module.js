define(['angular',
        './discovery-directive',
        './discovery-service'
    ],

    function (angular) {
        'use strict';

        angular
            .module('courseLanding.discovery', [
                'courseLanding.discovery.discoveryDirective',
                'courseLanding.discovery.discoveryService'
            ]);
    }
);