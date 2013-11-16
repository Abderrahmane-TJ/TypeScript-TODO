/// <reference path="events.ts"/>
class App {
    constructor() {
        this.init();
    }
    init() {
        var ev = new Events();
        var input = document.getElementsByClassName('text')[0];
        var output = document.getElementsByClassName('todo');

        ev.register('associate', () => {
            ev.associate({
                input: input,
                input_property: 'value',
                ouput: output,
                output_property: 'innerHTML'
            });
        });
    }
}

var app = new App();