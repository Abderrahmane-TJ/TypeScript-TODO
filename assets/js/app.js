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
            this.loadFromLocalStorage();
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
            this.save();
            this.log('added %s (%d)', text, todo.ID);
            var todoHTMLElement = this.buildHTMLTodo(todo);
            this.output.insertBefore(todoHTMLElement, this.output.firstChild);
            this.input.value = '';
        };
        App.prototype.edit = function (id, li) {
            var li = li || this.output.querySelector('#todo-' + id);
            var inline_input = li.querySelector('.inline-input');
            inline_input.classList.remove('hidden');
            li.querySelector('.doEdit').classList.remove('hidden');
            li.querySelector('.edit').classList.add('hidden');
            li.querySelector('.text').classList.add('hidden');
            li.querySelector('.remove').classList.add('hidden');
            li.querySelector('.confirm').classList.add('hidden');
            inline_input.value = this.findEntryByID(id).text;
            inline_input.focus();
        };
        App.prototype.confirm = function (id, li) {
            var li = li || this.output.querySelector('#todo-' + id);
            var entry = this.findEntryByID(id);
            var confirming = entry.status === 0 /* TODO */;
            if (confirming) {
                entry.status = 1 /* DONE */;
                li.classList.add('done');
            }
            else {
                entry.status = 0 /* TODO */;
                li.classList.remove('done');
            }
            this.save();
        };
        App.prototype.doEdit = function (id, value, li) {
            this.findEntryByID(id).text = value;
            this.save();
            var li = li || this.output.querySelector('#todo-' + id);
            var text = li.querySelector('.text');
            text.innerText = value;
            li.querySelector('.inline-input').classList.add('hidden');
            li.querySelector('.doEdit').classList.add('hidden');
            li.querySelector('.edit').classList.remove('hidden');
            li.querySelector('.remove').classList.remove('hidden');
            li.querySelector('.confirm').classList.remove('hidden');
            text.classList.remove('hidden');
        };
        App.prototype.remove = function (id, li) {
            this.findEntryByID(id).status = 2 /* DELETED */;
            this.save();
            var li = li || this.output.querySelector('#todo-' + id);
            li.parentNode.removeChild(li);
        };
        App.prototype.buildHTMLTodo = function (todo) {
            var _this = this;
            var text, doEditButton, editButton, removeButton, li, confirmButton, inline_input;
            inline_input = make(['input', {
                'type': 'text',
                'class': 'input inline-input hidden',
                'value': todo.text
            }]);
            text = make(['span', { 'class': 'text' }, todo.text]);
            confirmButton = make(['a', { 'class': 'todo-button checkmark confirm', href: '#', title: 'Confirm this item' }]);
            editButton = make(['a', { 'class': 'todo-button pencil edit', href: '#', title: 'Edit this item' }]);
            removeButton = make(['a', { 'class': 'todo-button bin remove ', href: '#', title: 'Delete this item' }]);
            doEditButton = make(['a', { 'class': 'todo-button pencil doEdit hidden', href: '#', title: 'Confirm modifications' }]);
            var li_class = 'todo';
            if (todo.status === 1 /* DONE */) {
                li_class += ' done';
            }
            li = make([
                'li',
                { 'class': li_class, 'id': 'todo-' + todo.ID },
                inline_input,
                text,
            ]);
            inline_input.addEventListener('keyup', function (e) {
                if (e.keyCode === _this.keyCodes.ENTER) {
                    _this.doEdit(todo.ID, inline_input.value);
                }
            }, false);
            text.addEventListener('dblclick', function (e) {
                e.preventDefault();
                _this.log('editing todo with ID %d', todo.ID);
                _this.edit(todo.ID, li);
            }, false);
            confirmButton.addEventListener('click', function (e) {
                e.preventDefault();
                _this.log('confirming todo with ID %d', todo.ID);
                _this.confirm(todo.ID, li);
            }, false);
            editButton.addEventListener('click', function (e) {
                e.preventDefault();
                _this.log('editing todo with ID %d', todo.ID);
                _this.edit(todo.ID, li);
            }, false);
            removeButton.addEventListener('click', function (e) {
                e.preventDefault();
                _this.log('removing todo with ID %d', todo.ID);
                _this.remove(todo.ID, li);
            }, false);
            doEditButton.addEventListener('click', function (e) {
                e.preventDefault();
                var value = li.querySelector('.input').value;
                _this.log('confirming %s', value);
                _this.doEdit(todo.ID, value, li);
            }, false);
            var buttons = make(['span', { 'class': 'settings' }, doEditButton, confirmButton, editButton, removeButton]);
            li.appendChild(buttons);
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
        App.prototype.loadFromLocalStorage = function () {
            var _this = this;
            var localStorageEntries = localStorage['entries'];
            if (!localStorageEntries) {
                this.save();
                return;
            }
            var entries = JSON.parse(localStorageEntries);
            if (!isArray(entries) || entries.length === 0) {
                return;
            }
            var ul = document.createDocumentFragment();
            this.entries = entries.map(function (entry) {
                var todo = new Todos.Todo(entry.ID, entry.text, entry.status);
                if (entry.status !== 2 /* DELETED */) {
                    var li = _this.buildHTMLTodo(todo);
                    ul.insertBefore(li, ul.firstChild);
                }
                return todo;
            });
            this.todoID = entries[entries.length - 1].ID + 1;
            this.output.appendChild(ul);
        };
        App.prototype.save = function () {
            localStorage['entries'] = JSON.stringify(this.entries);
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