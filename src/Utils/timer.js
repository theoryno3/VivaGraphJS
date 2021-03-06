/**
 * @author Andrei Kashcha (aka anvaka) / http://anvaka.blogspot.com
 */

Viva.Graph.Utils = Viva.Graph.Utils || {};

(function () {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        i,
        global = (typeof window === 'undefined') ? {} : window;

    for (i = 0; i < vendors.length && !global.requestAnimationFrame; ++i) {
        var vendorPrefix = vendors[i];
        global.requestAnimationFrame = global[vendorPrefix + 'RequestAnimationFrame'];
        global.cancelAnimationFrame =
            global[vendorPrefix + 'CancelAnimationFrame'] || global[vendorPrefix + 'CancelRequestAnimationFrame'];
    }

    if (!global.requestAnimationFrame) {
        global.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!global.cancelAnimationFrame) {
        global.cancelAnimationFrame = function (id) {
            global.clearTimeout(id);
        };
    }

    /**
     * Timer that fires callback with given interval (in ms) until
     * callback returns true;
     */
    Viva.Graph.Utils.timer = function (callback) {
        var intervalId,
            stopTimer = function () {
                global.cancelAnimationFrame(intervalId);
                intervalId = 0;
            },

            startTimer = function () {
                intervalId = global.requestAnimationFrame(startTimer);
                if (!callback()) {
                    stopTimer();
                }
            };

        startTimer(); // start it right away.

        return {
            /**
             * Stops execution of the callback
             */
            stop: stopTimer,

            restart : function () {
                if (!intervalId) {
                    startTimer();
                }
            }
        };
    };
}());