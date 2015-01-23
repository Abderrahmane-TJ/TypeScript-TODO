/// <reference path="app.ts"/>
var Todo;
(function (Todo) {
    var Main = (function () {
        function Main() {
            var input = document.getElementById('input');
            var output = document.getElementById('output');
            var app = this.app = new Todo.App(input, output);
        }
        return Main;
    })();
    Todo.Main = Main;
})(Todo || (Todo = {}));
var app = (new Todo.Main()).app;
//# sourceMappingURL=main.js.map