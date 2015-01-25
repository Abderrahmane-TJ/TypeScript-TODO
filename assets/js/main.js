/// <reference path="app.ts"/>
var Todos;
(function (Todos) {
    var Main = (function () {
        function Main() {
            var input = document.getElementById('input');
            var output = document.getElementById('output');
            var app = this.app = new Todos.App(input, output);
        }
        return Main;
    })();
    Todos.Main = Main;
})(Todos || (Todos = {}));
var app = (new Todos.Main()).app;
//# sourceMappingURL=main.js.map