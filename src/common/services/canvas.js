(function() {
    'use strict';

    angular
        .module('drunkard.canvasService', [])
        .service('canvasing', canvasService);

    //////
    //////

    function canvasService($q, $interval, $timeout, exam) {
        /* jshint validthis: true */
        var self = this;
        var canvas, canvasElement;
        var width = window.innerWidth;
        var height = window.innerHeight;

        var things = {
            createBlip: createBlip,
            eraseBlip: eraseBlip,
            getCoordinates: getCoordinates,
            wasClose: wasClose
        };

        function setupCanvas() {
            // can we play this game?
            // is there canvas?
            var testCanvas = document.createElement('canvas');
            var canHasCanvas = (testCanvas.getContext) ? true : false;

            if (!canHasCanvas) {
                // TODO set up a message telling people to use something else
                // don't try to run the game
            } else {
                // initialise our canvas element
                canvasElement = document.getElementById('drunk-canvas');
                canvas = canvasElement.getContext('2d');

                self.setHeight();
                window.addEventListener('resize', self.setHeight, false);

                canvasElement.addEventListener('click', self.clickOnCanvas, false);
                canvasElement.addEventListener('touchstart', self.touchOnCanvas, false);

                canvas.fillStyle = "white";
            }
        }

        self.setHeight = function() {
            width = window.innerWidth;
            height = window.innerHeight;

            canvasElement.width = width;
            canvasElement.height = height;
        };

        self.clearCanvas = function() {
            canvas.clearRect(0, 0, width, height);
        };

        self.clickOnCanvas = function(event) {
            // console.log(event);
            // event.stopPropagation();
            self.coordinates = [event.clientX, event.clientY];
        };

        self.touchOnCanvas = function(event) {
            // console.log(event);
            self.coordinates = [event.touches[0].clientX, event.touches[0].clientY];
            // event.stopPropagation();
            // var force = event.touches[0].force;
        };



        function createBlip(shoveDown, starter, radius) {
            var deferred = $q.defer();

            var x, y,
                message = document.querySelector('.message'),
                offset = message.getBoundingClientRect().bottom;
            if (starter) {
                // down below the message, in the center
                x = Math.floor(width / 2);
                y = height - (height - offset) / 2;
            } else if (shoveDown) {
                // find the height of the message element
                // and put the blip below it at least
                x = Math.floor(Math.random() * width);
                y = height - (height - offset) / 2;
            } else {
                x = Math.floor(Math.random() * width);
                y = Math.floor(Math.random() * height);
                // TODO make sure the numbers 
                // aren't too close to the bounds of the canvas
            }

            var entry = exam.addEntry(x, y, radius);
            entry.interval = $interval(function() {
                drawBlip(x, y, entry.intervalCount, radius);
                entry.intervalCount--;

                if (entry.intervalCount === 0) {
                    entry.created = new Date();
                    $interval.cancel(entry.interval);
                    deferred.resolve();
                }
            }, 16);

            return deferred.promise;
        }

        function drawBlip(x, y, count, radius) {
            // canvas.clearRect(x - radius / 2, y - radius / 2, x + radius / 2, y + radius / 2);
            // canvas.clearRect(0, 0, width, height);
            self.clearCanvas();
            
            canvas.beginPath();
            canvas.arc(x, y, radius / count, 0, 2 * Math.PI);
            canvas.fill();
        }

        function eraseBlip() {
            var deferred = $q.defer();

            // what was the last blip?
            var entry = exam.getLastEntry();

            entry.interval = $interval(function() {
                drawBlip(entry.position.x, entry.position.y, entry.intervalCount, entry.radius);
                entry.intervalCount++;

                if (entry.intervalCount === entry.intervalLimit) {
                    $interval.cancel(entry.interval);
                    self.clearCanvas();
                    deferred.resolve();
                }

                exam.updateLastEntry(entry);
            }, 16);

            return deferred.promise;
        }

        function getCoordinates() {
            return self.coordinates;
        }

        function wasClose(entry) {
            var close = false;
            var buffer = 1.5;

            var wasCloseInX = Math.abs(entry.pinpoint.x - entry.position.x) < (entry.radius * buffer);
            var wasCloseInY = Math.abs(entry.pinpoint.y - entry.position.y) < (entry.radius * buffer);
            if (wasCloseInX && wasCloseInY) {
                close = true;
            }

            return close;
        }

        setupCanvas();

        return things;
    }
    
})();
