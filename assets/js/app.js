/// <reference path="helpers.ts"/>
/// <reference path="config.ts"/>
/// <reference path="todo.ts"/>
var Todos;
(function (Todos) {
    var App = (function () {
        function App(input, output) {
            var _this = this;
            this.todoID = 0;
            this.keyCodes = {
                ENTER: 13
            };
            this.entries = [];
            this.input = input;
            this.output = output;
            input.addEventListener('keyup', function (e) {
                e.preventDefault();
                if (e.keyCode == _this.keyCodes.ENTER) {
                    var value = input.value;
                    _this.add(value);
                }
            }, false);
            input.focus();
        }
        App.prototype.add = function (text) {
            text = text.trim();
            if (!text) {
                return;
            }
            var todo = new Todos.Todo(this.todoID, text, 0 /* TODO */);
            this.todoID += 1;
            this.entries.push(todo);
            this.log('added %s (%d)', text, todo.ID);
            var todoHTMLElement = this.buildHTMLTodo(todo);
            this.output.insertBefore(todoHTMLElement, this.output.firstChild);
            this.input.value = '';
        };
        App.prototype.edit = function (id) {
            // TODO: add a find function
            var li = this.output.querySelector('#todo-' + id);
            var inline_input = li.querySelector('.inline-input');
            inline_input.classList.remove('hidden');
            li.querySelector('.confirm').classList.remove('hidden');
            li.querySelector('.edit').classList.add('hidden');
            li.querySelector('.text').classList.add('hidden');
            li.querySelector('.remove').classList.add('hidden');
            inline_input.value = this.findEntryByID(id).text;
            inline_input.focus();
        };
        App.prototype.confirm = function (id, value) {
            this.findEntryByID(id).text = value;
            var li = this.output.querySelector('#todo-' + id);
            var text = li.querySelector('.text');
            text.innerText = value;
            li.querySelector('.inline-input').classList.add('hidden');
            li.querySelector('.confirm').classList.add('hidden');
            li.querySelector('.edit').classList.remove('hidden');
            li.querySelector('.remove').classList.remove('hidden');
            text.classList.remove('hidden');
        };
        App.prototype.remove = function (id) {
            this.entries[id].status = 2 /* DELETED */;
            var li = this.output.querySelector("#todo-" + id);
            li.parentNode.removeChild(li);
        };
        App.prototype.buildHTMLTodo = function (todo) {
            var _this = this;
            var text, confirmButton, editButton, removeButton, li, inline_input;
            inline_input = make(['input', {
                'type': 'text',
                'class': 'input inline-input hidden',
                'value': todo.text
            }]);
            inline_input.addEventListener('keyup', function (e) {
                if (e.keyCode === _this.keyCodes.ENTER) {
                    var id = parseInt(inline_input.parentElement.id.replace('todo-', ''));
                    _this.confirm(id, inline_input.value);
                }
            }, false);
            text = make(['span', { 'class': 'text' }, todo.text]);
            text.addEventListener('dblclick', function (e) {
                e.preventDefault();
                var id = parseInt(text.parentElement.id.replace('todo-', ''));
                _this.log('editing todo with ID %d', id);
                _this.edit(id);
            }, false);
            editButton = make(['a', { 'class': 'todo-button pencil edit', href: '#', title: 'Edit this item' }]);
            editButton.addEventListener('click', function (e) {
                e.preventDefault();
                var id = parseInt(editButton.parentElement.parentElement.id.replace('todo-', ''));
                _this.log('editing todo with ID %d', id);
                _this.edit(id);
            }, false);
            removeButton = make(['a', { 'class': 'todo-button bin remove ', href: '#', title: 'Delete this item' }]);
            removeButton.addEventListener('click', function (e) {
                e.preventDefault();
                var id = parseInt(removeButton.parentElement.parentElement.id.replace('todo-', ''));
                _this.log('removing todo with ID %d', id);
                _this.remove(id);
            }, false);
            confirmButton = make(['a', { 'class': 'todo-button pencil confirm hidden', href: '#', title: 'Confirm modifications' }]);
            confirmButton.addEventListener('click', function (e) {
                e.preventDefault();
                var id = parseInt(confirmButton.parentElement.parentElement.id.replace('todo-', ''));
                var value = confirmButton.parentElement.parentElement.querySelector('.input').value;
                _this.log('confirming %s', value);
                _this.confirm(id, value);
            }, false);
            li = make([
                'li',
                {
                    'class': 'todo',
                    'id': 'todo-' + todo.ID
                },
                inline_input,
                text,
                ['span', { 'class': 'settings' }, confirmButton, editButton, removeButton]
            ]);
            return li;
        };
        App.prototype.findEntryByID = function (ID) {
            var entry;
            for (var i = 0, len = this.entries.length; i < len; i++) {
                entry = this.entries[i];
                if (entry.ID === ID) {
                    return entry;
                }
            }
            return null;
        };
        App.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            CAN_DEBUG && console.log.apply(console, args);
        };
        return App;
    })();
    Todos.App = App;
})(Todos || (Todos = {}));
//# sourceMappingURL=app.js.map