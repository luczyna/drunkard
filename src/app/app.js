(function () {
    'use strict';

    angular
        .module('drunkard', [
            'ui.router',
            'drunkard.templates',
            'drunkard.localstorage',
            'drunkard.canvasService',
            'drunkard.testingService',
            'drunkard.configConstants',
            'ngAnimate',
            'ngTouch',

            //views
            'drunkard.test',
            'drunkard.settings',
            'drunkard.navigation'
        ])
        .config(myAppConfig)
        .run(run)
        .controller('AppCtrl', AppCtrl);

    //////


    /* @ngInject */
    function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        // $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(false);
    }

    /* @ngInject */
    function run() {}


    /* @ngInject */
    function AppCtrl($scope, $state) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | drunkard';
            }

            $scope.$broadcast('pageTitle', toState);
        });
    }
})();
