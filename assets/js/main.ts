/// <reference path="app.ts"/>
module Todos {
    export class Main {
        public app;
        constructor(){
            var input = <HTMLInputElement>document.getElementById('input');
            var output = <HTMLUListElement>document.getElementById('output');
            var app = this.app = new Todos.App(input,output);
        }
    }
}
var app = (new Todos.Main()).app;