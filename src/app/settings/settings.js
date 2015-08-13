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
    function SettingsCtrl($scope, localstore) {
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
            localstore.update('settings', svm.inputs);
        }

        function initSettings() {
            // what are the settings in the localstorage?
            var storage = localstore.get('settings');

            if (storage && 
                storage.psychadelic !== undefined && 
                storage.colourBlind !== undefined) {
                    svm.inputs.psychadelic = storage.psychadelic;
                    svm.inputs.colourBlind = storage.colourBlind;
            } else {
                localstore.update('settings', svm.inputs);
            }
        }
    }
})();