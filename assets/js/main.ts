/// <reference path="app.ts"/>
module Todo {
    export class Main {
        public app;
        constructor(){
            var input = <HTMLInputElement>document.getElementById('input');
            var output = <HTMLUListElement>document.getElementById('output');
            var app = this.app = new Todo.App(input,output);
        }
    }
}
var app = (new Todo.Main()).app;