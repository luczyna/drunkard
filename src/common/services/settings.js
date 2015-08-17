(function() {
    'use strict';

    angular
        .module('drunkard.settingsService', [])
        .service('settings', settingsService);

    //////
    //////

    function settingsService(localstore) {
        /* jshint validthis: true */
        var self = this;

        // at least set to false for default
        self.settings = {
            isPsychadelic: false,
            isColourBlind: false
        };

        var things = {
            isPsychadelic: checkIfIsPsychadelic,
            isColourBlind: checkIfIsColourBlind,
            setPsycadelic: setPsycadelic,
            setColourBlind: setColourBlind,
            setSettings: setSettings
        };

        function initSettings() {
            // what are the settings in the localstorage?
            var storage = localstore.get('settings');

            if (storage && 
                storage.psychadelic !== undefined && 
                storage.colourBlind !== undefined) {
                    self.settings.isPsychadelic = storage.psychadelic;
                    self.settings.isColourBlind = storage.colourBlind;
            } else {
                localstore.update('settings', self.settings);
            }
        }

        initSettings();

        ///

        function checkIfIsPsychadelic() {
            return self.settings.isPsychadelic;
        }

        function checkIfIsColourBlind() {
            return self.settings.isColourBlind;
        }

        function setPsycadelic(toWhat) {
            self.settings.isPsychadelic = toWhat;
        }

        function setColourBlind(toWhat) {
            self.settings.isColourBlind = toWhat;
        }

        function setSettings(object) {
            this.setPsycadelic(object.psychadelic);
            this.setColourBlind(object.colourBlind);

            localstore.update('settings', object);
        }

        return things;
    }
    
})();
