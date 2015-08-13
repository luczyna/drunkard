(function() {
    'use strict';

    angular
        .module('drunkard.localstorage', [])
        .factory('localstore', localStrFactory);

    //////
    //////

    function localStrFactory() {

        var ls = {
            settings: {}
        };

        var things = {
            set: set,
            get: get,
            update: updateSettings
        };

        function set() {
            //update teh localStorage
            var json = JSON.stringify(ls);
            window.localStorage.setItem('drunkard', json);
        }

        function get(what) {
            return ls[what];
        }

        function updateSettings(what, whatWith) {
            ls[what] = whatWith;
            /* jshint validthis: true */
            this.set();
        }

        function setupLocalStorage() {
            // the namespace will be drunkard
            var store = window.localStorage.getItem('drunkard');
            if (store === null) {
                ls.settings.isNewUser = true;
                var json = JSON.stringify(ls);
                window.localStorage.setItem('drunkard', json);
                return false;
            } else {
                if (store.length) {
                    var value = JSON.parse(store);
                    ls = value;
                    return value;
                } else {
                    return false;
                }
            }
        }

        setupLocalStorage();

        return things;
    }
    
})();