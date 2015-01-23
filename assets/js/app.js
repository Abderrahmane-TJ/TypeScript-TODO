/// <reference path="helpers.ts"/>
/// <reference path="config.ts"/>
var Todo;
(function (Todo) {
    var App = (function () {
        function App(input, output) {
            var _this = this;
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
        App.prototype.add = function (entry) {
            entry = entry.trim();
            if (!entry) {
                return;
            }
            this.entries.push(entry);
            this.log('added %s', entry);
            this.buildList();
            this.input.value = '';
        };
        App.prototype.edit = function (index) {
            var _this = this;
            var indexInHTML = this.entries.length - 1 - index;
            var li = this.output.querySelector('li:nth-child(' + (indexInHTML + 1) + ')');
            var span = li.querySelector('.text');
            span.classList.add('hidden');
            li.querySelector('.edit').classList.add('hidden');
            li.querySelector('.remove').classList.add('hidden');
            li.querySelector('.confirm').classList.remove('hidden');
            var inline_input = make(['input', {
                'type': 'text',
                'class': 'input inline-input',
                'value': this.entries[index]
            }]);
            inline_input.addEventListener('keyup', function (e) {
                if (e.keyCode === _this.keyCodes.ENTER) {
                    var index = indexInParent(inline_input.parentNode);
                    _this.confirm(_this.entries.length - 1 - index, inline_input.value);
                }
            }, false);
            li.insertBefore(inline_input, span);
            inline_input.focus();
        };
        App.prototype.confirm = function (index, value) {
            this.entries[index] = value;
            var inline_input = this.output.querySelector('.inline-input');
            inline_input.parentNode.removeChild(inline_input);
            this.buildList();
        };
        App.prototype.remove = function (index) {
            this.entries.splice(index, 1);
            this.buildList();
        };
        App.prototype.buildList = function () {
            var _this = this;
            var output = this.output, text, confirmButton, editButton, removeButton, li;
            output.innerHTML = '';
            for (var i = this.entries.length - 1; i > -1; i--) {
                (function (text, confirmButton, editButton, removeButton, li) {
                    text = make(['span', { 'class': 'text' }, _this.entries[i]]);
                    text.addEventListener('dblclick', function (e) {
                        e.preventDefault();
                        var indexInHTML = indexInParent(text.parentNode);
                        var index = _this.entries.length - 1 - indexInHTML;
                        _this.log('editing %s', _this.entries[index]);
                        _this.edit(index);
                    }, false);
                    confirmButton = make(['a', {
                        'class': 'settings checkmark confirm hidden',
                        href: '#',
                        title: 'Confirm modifications'
                    }]);
                    confirmButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        var index = _this.entries.length - 1 - indexInParent(confirmButton.parentNode);
                        var value = confirmButton.parentNode.querySelector('.input').value;
                        _this.log('confirming %s', value);
                        _this.confirm(index, value);
                    }, false);
                    editButton = make(['a', { 'class': 'settings pencil edit', href: '#', title: 'Edit this item' }]);
                    editButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        var indexInHTML = indexInParent(editButton.parentNode);
                        var index = _this.entries.length - 1 - indexInHTML;
                        _this.log('editing %s', _this.entries[index]);
                        _this.edit(index);
                    }, false);
                    removeButton = make(['a', { 'class': 'settings bin remove ', href: '#', title: 'Delete this item' }]);
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        var indexInHTML = indexInParent(removeButton.parentNode);
                        var index = _this.entries.length - 1 - indexInHTML;
                        _this.log("removing %s", _this.entries[index]);
                        _this.remove(index);
                    }, false);
                    li = make([
                        'li',
                        { 'class': 'todo' },
                        text,
                        confirmButton,
                        editButton,
                        removeButton
                    ]);
                    output.appendChild(li);
                })(text, confirmButton, editButton, removeButton, li);
            }
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
    Todo.App = App;
})(Todo || (Todo = {}));
//# sourceMappingURL=app.js.map