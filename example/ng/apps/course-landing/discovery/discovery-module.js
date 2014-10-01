define(['angular',
        './discovery-directive',
        './discovery-service'
    ],

    function (angular) {
        'use strict';

        angular
            .module('courseLanding.discovery', [
                'courseLanding.discovery.DiscoveryDirective',
                'courseLanding.discovery.DiscoveryService'
            ]);
    }
);