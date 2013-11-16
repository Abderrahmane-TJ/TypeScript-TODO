var Events = (function () {
    function Events() {
        this.events = [];
        this.init();
        this.loop();
    }
    Events.prototype.loop = function () {
        var that = this;
        requestAnimationFrame(function () {
            that.loop();
        });
        var events = this.events;
        var i;
        for (i = 0; i < events.length; i++) {
            if (typeof events[i].callback === 'function') {
                events[i].callback();
            }
        }
    };

    Events.prototype.register = function (name, callback) {
        this.events[this.events.length] = {
            name: name,
            callback: callback
        };
    };
    Events.prototype.associate = function (o) {
        var output = o.ouput;
        var input = o.input;
        var input_property = o.input_property;
        var output_property = o.output_property;
        for (var i = 0; i < output.length; i++) {
            var oldValue = output[i][output_property];
            var newValue = input[input_property];
            if (oldValue !== newValue) {
                output[i][output_property] = newValue;
            }
        }
    };

    Events.prototype.init = function () {
    };
    return Events;
})();
//# sourceMappingURL=events.js.map
