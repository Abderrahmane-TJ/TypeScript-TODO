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
            var target = e.target;
            e.preventDefault();
            switch (e.type) {
                case 'dblclick':
                    if (target.classList.contains('text')) {
                        var index = indexInParent(target.parentNode);
                        app.edit(index);
                    }
                    break;
                case 'keyup':
                    var input = app.input;
                    if (target === input && e.keyCode === this.codes.ENTER) {
                        app.add(input.value);
                    } else if (target.classList.contains('inline-input') && e.keyCode === this.codes.ENTER) {
                        var index = indexInParent(target.parentNode);
                        app.confirm(app.entries.length - 1 - index, target.value);
                    }
                    break;
                case 'click':
                    if (target.classList.contains('settings')) {
                        var index = indexInParent(target.parentNode);
                        if (target.classList.contains(('remove'))) {
                            app.log('remove');
                            app.delete(app.entries.length - 1 - index);
                        } else if (target.classList.contains(('edit'))) {
                            app.log('edit');
                            app.edit(index);
                        } else if (target.classList.contains(('confirm'))) {
                            app.log('confirm');
                            var value = (target.parentElement.querySelector('.input')).value;
                            app.confirm(app.entries.length - 1 - index, value);
                        }
                    }
                    break;
            }
        };
        Events.prototype.onDelete = function () {
        };
        return Events;
    })();
    Todo.Events = Events;
})(Todo || (Todo = {}));
//# sourceMappingURL=events.js.map
