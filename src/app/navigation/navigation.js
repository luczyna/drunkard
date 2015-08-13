(function () {
    'use strict';

    angular
        .module('drunkard.navigation', [])
        .directive('drunkNav', navigationDirectice)
        .controller('NavCtrl', NavCtrl)
        .animation('.nav-link', navLinkAnimation);

    //////

    /* @ngInject */
    function navigationDirectice() {
        var nav = {
            restrict: 'A',
            templateUrl: 'navigation/navigation.tpl.html',
            controller: 'NavCtrl as nvm',
            replace: true,
            link: setUpNav
        };

        return nav;

        ///

        function setUpNav(scope, element, attr) {
            scope.nvm.element = element;
        }
    }

    /* @ngInject */
    function NavCtrl($scope, $timeout, $state, localstore) {
        /* jshint validthis: true */
        var nvm = this;
    }

    /* @ngInject */
    function navLinkAnimation() {}
})();
