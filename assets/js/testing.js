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
                            var value = target.parentElement.querySelector('.input').value;
                            app.confirm(app.entries.length - 1 - index, value);
                        }
                    }
                    break;
            }
        };
        return Events;
    })();
    Todo.Events = Events;
})(Todo || (Todo = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
function isArray(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
}
function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
}

function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i] == node)
            return num;
        if (children[i].nodeType == 1)
            num++;
    }
    return -1;
}

/*
*   make(["p", "Here is a ", ["a", { href:"http://www.google.com/" }, "link"], "."]);
*/
function make(desc) {
    if (!isArray(desc)) {
        return make.call(this, Array.prototype.slice.call(arguments));
    }
    var name = desc[0];
    var attributes = desc[1];
    var el = document.createElement(name);
    var start = 1;
    if (typeof attributes === "object" && attributes !== null && !isArray(attributes)) {
        for (var attr in attributes) {
            el.setAttribute(attr, attributes[attr]);
        }
        start = 2;
    }
    for (var i = start; i < desc.length; i++) {
        var current = desc[i];
        if (isArray(current)) {
            el.appendChild(make(current));
        } else if (isElement(current)) {
            el.appendChild(current);
        } else {
            el.appendChild(document.createTextNode(current));
        }
    }
    return el;
}
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
/// <reference path="app.ts"/>
/// <reference path="events.ts"/>
var Todo;
(function (Todo) {
    var Main = (function () {
        function Main() {
            var input = document.getElementById('input');
            var output = document.getElementById('output');
            var app = this.app = new Todo.App(input, output);
            input.addEventListener('keyup', app.events, false);
            input.focus();
        }
        return Main;
    })();
    Todo.Main = Main;
})(Todo || (Todo = {}));
var app = (new Todo.Main()).app;
