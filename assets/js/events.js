/// <reference path="app.ts"/>
var Todo;
(function (Todo) {
    var Events = (function () {
        function Events(app) {
            this.app = app;
            this.codes = {
                ENTER: 13
            };
        }
        Events.prototype.handleEvent = function (e) {
            var app = this.app;
            switch (e.type) {
                case 'keyup':
                    var input = app.input;
                    if (e.target === input && e.keyCode === this.codes.ENTER) {
                        app.add(input.value);
                    }
                    break;
                case 'click':
                    e.preventDefault();
                    var target = e.target;
                    if (target.classList.contains('settings')) {
                        var index = indexInParent(target.parentNode);
                        if (target.classList.contains(('remove'))) {
                            app.delete(app.entries.length - 1 - index);
                        } else if (target.classList.contains(('edit'))) {
                            app.edit(app.entries.length - 1 - index);
                        }
                    }
                    break;
            }
        };
        return Events;
    })();
    Todo.Events = Events;
})(Todo || (Todo = {}));
//# sourceMappingURL=events.js.map
