(function() {
    'use strict';

    angular
        .module('drunkard.canvasService', [])
        .factory('canvasing', canvasService);

    //////
    //////

    function canvasService() {
        /* jshint validthis: true */
        var self = this;
        var canvas, canvasElement;

        var things = {

        };

        function setupCanvas() {
            // can we play this game?
            // is there canvas?
            var testCanvas = document.createElement('canvas');
            var canHasCanvas = (testCanvas.getContext) ? true : false

            if (!canHasCanvas) {
                // TODO set up a message telling people to use something else
                // don't try to run the game
            } else {
                // initialise our canvas element
                canvasElement = document.getElementById('drunk-canvas');
                canvas = canvasElement.getContext('2d');
            }
        }

        setupCanvas();

        return things;
    }
    
})();