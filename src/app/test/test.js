(function () {
    'use strict';

    angular
        .module('drunkard.test', [])
        .config(testConfig)
        .controller('TestCtrl', TestCtrl);

    //////

    /* @ngInject */
    function testConfig($stateProvider) {
        $stateProvider.state('test', {
            url: '/',
            views: {
                "main": {
                    controller: 'TestCtrl as tvm',
                    templateUrl: 'test/test.tpl.html'
                }
            },
            data: {
                pageTitle: 'Burp'
            }
        });
    }

    /* @ngInject */
    function TestCtrl($scope, $timeout, $state, canvasing, exam) {
        /* jshint validthis: true */
        var tvm = this;

        tvm.message = {
            main: '',
            context: '',
            show: false
        };
        tvm.expletive = '';

        // stages of the test
        //   0 not started      1 primed
        //   2 started          3 add rule
        //   4 change rule      5 finish and present score
        tvm.stage = 0;
        tvm.ready = false;
        tvm.count = 5;

        tvm.canvasInteraction = canvasInteraction;
        tvm.primeTest = primeTest;
        tvm.startTest = startTest;


        init();

        ///

        function init() {
            tvm.message.main = 'Tap/Click the circle';
            tvm.message.context = 'Let\'s see how drunk you are';

            $timeout(function() {
                tvm.message.show = true;
                tvm.stage++;
                tvm.primeTest();
            }, 1000);
        }

        function primeTest() {
            $timeout(function() {
                canvasing.createBlip(null, true, 25).then(
                function() {
                    tvm.ready = true;
                }, function (error) {
                    console.log('error in canvas drawing');
                });
            }, 500);
        }

        function startTest() {
            testProblem();
        }

        function testProblem() {
            var radius = Math.floor(Math.random() * 10) + 15;
            canvasing.createBlip(false, false, radius).then(
            function() {
                tvm.ready = true;
            },
            function(error) {
                console.log('error with test canvas drawing');
            });
        }
        
        function canvasInteraction() {
            if (tvm.stage === 1 && tvm.ready) {
                // clear the blip
                tvm.ready = false;
                canvasing.eraseBlip().then(
                function() {
                    // we can go to the next stage
                    tvm.message.show = false;
                    tvm.stage++;
                    tvm.startTest();
                },
                function (error) {
                    console.log('error in canvas erasing');
                }
                );
            } else if (tvm.stage === 2 && tvm.ready) {
                tvm.ready = false;
                canvasing.eraseBlip().then(
                function() {
                    if (tvm.count > 1) {
                        tvm.count--;
                        testProblem();
                    } else {
                        // end of test round 1... now add rule?
                    }
                },
                function(error) {
                    console.log('error in canvas erasing');
                });
            } else if (tvm.stage === 3 && tvm.ready) {}
        }
    }
})();
