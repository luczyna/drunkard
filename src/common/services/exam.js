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
        
        function scoreExam() {
            // what is our maximum score?
            var max = entries.length * 10;

            // of each entry, what is their score?
            // start off with benefit of doubt
            var score = max;
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var mark = scoreEntry(entry);
                score -= mark;
            }

            var result = {
                what: null,
                score: score / max
            };
            if (score < max / 2) {
                result.what = 'drunk';
            } else if (score < max * 0.75) {
                result.what = 'tipsy';
            } else {
                result.what = 'good enough';
            }

            return result;
        }

        function scoreEntry(entry) {
            var mark;

            // how far away from the center
            // it's bad if it's too much farther than the radius
            var a, b, c, distance;
            a = Math.abs(entry.position.x - entry.pinpoint.x);
            b = Math.abs(entry.position.y - entry.pinpoint.y);
            c = Math.pow(a, 2) + Math.pow(b, 2);
            distance = Math.sqrt(c);

            if (distance < entry.radius / 2) {
                mark = 0;
            } if (distance < entry.radius * 1.5) {
                mark = 2;
            } else {
                // damn, you suck
                mark = 4;
            }

            // how long did it take to finish
            var time, seconds, moreTrouble;
            time = Date.parse(entry.answered) - Date.parse(entry.created);
            seconds = time / 1000;
            if (seconds < 0.3) {
                moreTrouble = 0;
            } else if (seconds < 0.6) {
                moreTrouble = 3;
            } else {
                moreTrouble = 4;
            }
            mark += moreTrouble;

            // if this look a lot of time 
            // AND
            // you couldn't hit the mark...
            if (seconds > 0.6 && distance > entry.radius * 2) {
                // there is no question! RIGHT!?!
                mark = 10;
            }

            return mark;
        }



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
