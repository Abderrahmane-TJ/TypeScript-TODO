/// <reference path="events.ts"/>
/// <reference path="helpers.ts"/>
var Todo;
(function (Todo) {
    var App = (function () {
        function App(input, output) {
            this.entries = new Array();
            this.input = input;
            this.output = output;
            this.events = new Todo.Events(this);
        }
        App.prototype.add = function (entry) {
            entry = entry.trim();
            if (!entry) {
                return;
            }
            this.entries.push(entry);
            this.log('added %s', entry);
            this.update();
            this.input.value = '';
        };
        App.prototype.edit = function (index) {
        };
        App.prototype.delete = function (index) {
            this.entries.splice(index, 1);
            this.update();
        };
        App.prototype.update = function () {
            var output = this.output;
            output.innerHTML = '';
            for (var i = this.entries.length - 1; i > -1; i--) {
                var text = make(['span', this.entries[i]]);
                var edit = make(['a', { 'class': 'settings cog edit', href: '#', title: 'Edit this item' }]);
                edit.addEventListener('click', this.events, false);
                var remove = make(['a', { 'class': 'settings bin remove ', href: '#', title: 'Delete this item' }]);
                remove.addEventListener('click', this.events, false);
                var li = make([
                    'li',
                    { 'class': 'todo' },
                    text,
                    edit,
                    remove
                ]);
                output.appendChild(li);
            }
        };
        App.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            console.log.apply(console, args);
        };
        return App;
    })();
    Todo.App = App;
})(Todo || (Todo = {}));
//# sourceMappingURL=app.js.map
