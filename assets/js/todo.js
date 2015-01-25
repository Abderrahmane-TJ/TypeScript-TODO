/// <reference path="helpers.ts"/>
var Todos;
(function (Todos) {
    var Todo = (function () {
        function Todo(ID, text, status) {
            this.ID = ID;
            this.text = text;
            this.status = status;
        }
        return Todo;
    })();
    Todos.Todo = Todo;
})(Todos || (Todos = {}));
//# sourceMappingURL=todo.js.map