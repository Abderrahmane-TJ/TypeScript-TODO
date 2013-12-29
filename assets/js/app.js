/// <reference path="events.ts"/>
/// <reference path="helpers.ts"/>
var Todo;
(function (Todo) {
    var App = (function () {
        function App(input, output) {
            this.entries = [];
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
            var li = this.output.querySelector('li:nth-child(' + (index + 1) + ')');
            var span = li.querySelector('.text');
            span.classList.add('hidden');
            li.querySelector('.edit').classList.add('hidden');
            li.querySelector('.remove').classList.add('hidden');
            li.querySelector('.confirm').classList.remove('hidden');
            var input = make(['input', { 'type': 'text', 'class': 'input inline-input', 'value': this.entries[this.entries.length - 1 - index] }]);
            input.addEventListener('keyup', this.events, false);
            li.insertBefore(input, span);
            input.focus();
        };
        App.prototype.confirm = function (index, value) {
            this.entries[index] = value;
            var inline_input = this.output.querySelector('.inline-input');
            inline_input.parentNode.removeChild(inline_input);
            this.update();
        };
        App.prototype.delete = function (index) {
            this.entries.splice(index, 1);
            this.update();
        };
        App.prototype.update = function () {
            var output = this.output;
            output.innerHTML = '';
            for (var i = this.entries.length - 1; i > -1; i--) {
                var text = make(['span', { 'class': 'text' }, this.entries[i]]);
                text.addEventListener('dblclick', this.events, false);

                var confirm = make(['a', { 'class': 'settings checkmark confirm hidden', href: '#', title: 'Confirm modifications' }]);
                confirm.addEventListener('click', this.events, false);

                var edit = make(['a', { 'class': 'settings pencil edit', href: '#', title: 'Edit this item' }]);
                edit.addEventListener('click', this.events, false);

                var remove = make(['a', { 'class': 'settings bin remove ', href: '#', title: 'Delete this item' }]);
                remove.addEventListener('click', this.events, false);
                var li = make([
                    'li', { 'class': 'todo' },
                    text,
                    confirm,
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
