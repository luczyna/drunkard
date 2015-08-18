(function() {
    'use strict';

    angular
        .module('drunkard.entryFactory', [])
        .factory('Entry', entryFactory);

    //////
    //////

    function entryFactory() {

        var intervalLimit = 20;

        function Entry(xPos, yPos, radius) {
            this.created = null;
            this.position = {
                x: xPos,
                y: yPos
            };
            this.radius = radius;
            this.answered = null;
            this.pinpoint = {
                x: null,
                y: null
            };
            this.rule = null;
            this.followedRule = null;
            this.score = null;

            this.interval = null;
            this.intervalCount = intervalLimit;
            this.intervalLimit = intervalLimit;
        }

        return Entry;
    }
    
})();