/// <reference path="app.ts"/>
/// <reference path="events.ts"/>
module Todo {
    export class Main {
        public app;
        constructor(){
            var input = document.getElementById('input');
            var output = document.getElementById('output');
            var app = this.app = new Todo.App(input,output);
            input.addEventListener('keyup', app.events, false);
            input.focus();
        }
    }
}
var app = (new Todo.Main()).app;

// almost finished :P