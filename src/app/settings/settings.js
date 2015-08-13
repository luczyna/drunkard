(function () {
    'use strict';

    angular
        .module('drunkard.settings', [])
        .config(settingsConfig)
        .controller('SettingsCtrl', SettingsCtrl);

    //////

    /* @ngInject */
    function settingsConfig($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings',
            views: {
                "main": {
                    controller: 'SettingsCtrl as svm',
                    templateUrl: 'settings/settings.tpl.html'
                }
            },
            data: {
                pageTitle: 'Settings'
            }
        });
    }

    /* @ngInject */
    function SettingsCtrl($scope) {
        /* jshint validthis: true */
        var svm = this;

        svm.inputs = {
            psychadelic: false,
            colourBlind: false
        };
    }
})();