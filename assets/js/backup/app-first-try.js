/// <reference path="events-first-try.ts"/>
var App = (function () {
    function App() {
        this.init();
    }
    App.prototype.init = function () {
        var ev = new Events();
        var input = document.getElementsByClassName('text')[0];
        var output = document.getElementsByClassName('todo');

        ev.register('associate', function () {
            ev.associate({
                input: input,
                input_property: 'value',
                ouput: output,
                output_property: 'innerHTML'
            });
        });
    };
    return App;
})();

var app = new App();
//# sourceMappingURL=app-first-try.js.map
