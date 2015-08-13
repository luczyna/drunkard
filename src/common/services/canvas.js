(function() {
    'use strict';

    angular
        .module('drunkard.canvasService', [])
        .service('canvasing', canvasService);

    //////
    //////

    function canvasService() {
        /* jshint validthis: true */
        var self = this;
        var canvas, canvasElement;

        var things = {
            createBlip: createBlip
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
            }
        }

        self.setHeight = function() {
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
        };

        self.clickOnCanvas = function(event) {
            // console.log(event);
            event.stopPropagation();
        };

        self.touchOnCanvas = function(event) {};



        function createBlip(shoveDown, xPos, yPos) {
            if (shoveDown) {

            }
        }



        setupCanvas();

        return things;
    }
    
})();
