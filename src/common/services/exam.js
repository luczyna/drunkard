(function() {
    'use strict';

    angular
        .module('drunkard.testingService', [])
        .service('exam', testingService);

    //////
    //////

    function testingService() {
        /* jshint validthis: true */
        var self = this;
        var entries = [];

        var exam = {
            addEntry: addEntry,
            getLastEntry: getLastEntry,
            updateLastEntry: updateLastEntry,
            getEntries: getEntries,
            clearEntries: clearEntries,
            scoreEntry: scoreEntry,
            scoreExam: scoreExam
        };



        function addEntry(xPos, yPos, radius) {
            var entry = new Entry(xPos, yPos, radius);
            entries.push(entry);

            return entry;
        }

        function getLastEntry() {
            return entries[entries.length - 1];
        }

        function updateLastEntry(entry) {
            entries[entries.length - 1] = entry;
        }

        function getEntries() {
            return entries;
        }

        function clearEntries() {
            entries.length = 0;
        }
        
        function scoreEntry() {}
        function scoreExam() {}



        return exam;
    }

    function Entry(xPos, yPos, radius) {
        // this.created = new Date();
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
        this.intervalCount = 10;
    }
})();
