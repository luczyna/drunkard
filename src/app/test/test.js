(function () {
    'use strict';

    angular
        .module('drunkard.test', [])
        .config(testConfig)
        .controller('TestCtrl', TestCtrl)
        .animation('.message', messageEntryAnimation)
        .animation('.playAgain', playAgainButtonAnimation)
        .animation('.expletive', expletiveAnimation);

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
    function TestCtrl($scope, $timeout, $state, canvasing, exam, expletives) {
        /* jshint validthis: true */
        var tvm = this;

        tvm.message = {
            main: '',
            context: '',
            show: false
        };
        tvm.expletive = '';
        tvm.showExpletive = false;
        tvm.endOfGame = false;

        // stages of the test
        //   0 not started      1 primed
        //   2 started          3 add rule
        //   4 change rule      5 finish and present score
        tvm.stage = 0;
        tvm.ready = false;
        tvm.count = 1;

        tvm.canvasInteraction = canvasInteraction;
        tvm.primeTest = primeTest;
        tvm.startTest = startTest;
        tvm.addRule = addRule;
        tvm.endTest = endTest;
        tvm.testAgain = testAgain;
        tvm.setExpletive = setExpletive;

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
                canvasing.createBlip(false, true, 25).then(
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

        function addRule() {}

        
        function canvasInteraction() {
            if (tvm.stage === 1 && tvm.ready) {
                erasingEntry(function() {
                    // we can go to the next stage
                    tvm.message.show = false;
                    tvm.stage++;
                    tvm.startTest();
                });
            } else if (tvm.stage === 2 && tvm.ready) {
                if (canvasing.wasClose(exam.getLastEntry())) {
                    tvm.setExpletive();
                }

                erasingEntry(function() {
                    if (tvm.count >= 1) {
                        tvm.count--;
                        testProblem();
                    } else {
                        // end of test round 1... now add rule?
                        // TODO think of real good rules
                        // and improve upon the spawning of entries
                        // right now, we'll just finish the test
                        tvm.stage = 5;
                        tvm.endTest();
                    }
                });
            } else if (tvm.stage === 3 && tvm.ready) {}
        }

        function erasingEntry(callback) {
            // clear the blip
            tvm.ready = false;
            var coord = canvasing.getCoordinates();
            var entry = exam.getLastEntry();

            entry.answered = new Date();
            entry.pinpoint.x = coord[0];
            entry.pinpoint.y = coord[1];

            canvasing.eraseBlip().then(
            function() {
                exam.updateLastEntry(entry);
                if (callback) {
                    callback();
                }
            },
            function (error) {
                console.log('error in canvas erasing');
            });
        }

        function endTest() {
            // show a message
            // show score 
            // allow user to go back
            tvm.message.main = 'Now we will judge you';
            tvm.message.context = null;

            $timeout(function() {
                //show - A
                tvm.message.show = true;

                $timeout(function() {
                    // hide - B
                    tvm.message.show = false;

                    $timeout(function() {
                        // empty - C                       
                        tvm.message.main = null;
                        tvm.message.context = null;
                        
                        $timeout(function() {
                            // render for showing later - D
                            showResults();
                        }, 1500); // render for later - D
                    }, 350); // empty - C
                }, 2000); // show - B
            }, 1000); // show - A
        }

        function showResults() {
            var results = exam.scoreExam();
            tvm.message.main = 'You are ' + results.what;
            if (results.what === 'drunk') {
                tvm.message.context = 'Gud jahb';
            } else if (results.what === 'tipsy') {
                tvm.message.context = 'Keep it up';
            } else {
                tvm.message.context = 'You may keep drinking';
            }

            $timeout(function() {
                // show after render - A
                tvm.message.show = true;
                
                $timeout(function() {
                    // show test again button - B
                    tvm.endOfGame = true;
                }, 1500); // show test again button - B
            }, 50); // show after render - A
        }

        function testAgain() {
            console.log('testing again');
            exam.clearEntries();
            tvm.stage = 0;

            tvm.message.show = false;
            tvm.endOfGame = false;

            $timeout(function() {
                init();
            }, 1000);
        }

        function setExpletive() {
            var text = expletives[Math.floor(Math.random() * expletives.length)];
            tvm.expletive = text;

            $timeout(function() {
                // show expletive - A
                tvm.showExpletive = true;

                $timeout(function() {
                    // hide expletive - B
                    tvm.showExpletive = false;
                }, 500); // hide expletive - B
            }, 10); // show expletive - A

        }
    }

    /* @ngInject */
    function messageEntryAnimation() {
        var hideClass = 'ng-hide';
        var message = {
            beforeAddClass: hideMessage,
            removeClass: showMessage
        };

        return message;

        ///

        function hideMessage(element, className, done) {
            if (className !== hideClass) {
                return;
            }
            element.fadeOut(300, done);
        }

        function showMessage(element, className, done) {
            if (className !== hideClass) {
                return;
            }
            element.hide().fadeIn(300, done);
        }
    }

    /* @ngInject */
    function playAgainButtonAnimation() {
        var hideClass = 'ng-hide';
        var message = {
            beforeAddClass: hideButton,
            removeClass: showButton
        };

        return message;

        ///

        function hideButton(element, className, done) {
            if (className !== hideClass) {
                return;
            }

            element.removeClass('slideUp').fadeOut(300, done);
        }

        function showButton(element, className, done) {
            if (className !== hideClass) {
                return;
            }
            // element.hide().addClass('slideUp').fadeIn(300, done);
            element.hide().fadeIn(300, done).addClass('slideUp');
        }
    }

    /* @ngInject */
    function expletiveAnimation() {}
})();
