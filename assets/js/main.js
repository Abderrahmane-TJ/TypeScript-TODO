/// <reference path="app.ts"/>
var Main = (function () {
    function Main() {
        var input = document.getElementById('input');
        var output = document.getElementById('output');
        this.app = new App(input, output);
    }
    return Main;
})();
var app = (new Main()).app;
app.log('Application loaded');
//# sourceMappingURL=main.js.map