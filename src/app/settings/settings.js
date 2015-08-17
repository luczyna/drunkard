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
    function SettingsCtrl($scope, settings) {
        /* jshint validthis: true */
        var svm = this;

        svm.inputs = {
            psychadelic: false,
            colourBlind: false
        };

        svm.updateSettings = updateSettings;

        initSettings();

        ///

        function updateSettings() {
            settings.setSettings(svm.inputs);
        }

        function initSettings() {
            svm.inputs.psychadelic = settings.isPsychadelic();
            svm.inputs.colourBlind = settings.isColourBlind();
        }
    }
})();
