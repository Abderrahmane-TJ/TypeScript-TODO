/// <reference path="app.ts"/>
var Main = (function () {
    function Main() {
        var input = document.getElementById('input');
        var output = document.getElementById('output');
        this.app = new App(input, output);
    }
    return Main;
})();
var app;
app = (new Main()).app;
//# sourceMappingURL=main.js.map