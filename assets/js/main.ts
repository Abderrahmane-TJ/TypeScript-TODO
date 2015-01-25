/// <reference path="app.ts"/>

class Main {
    public app;
    constructor(){
        var input = <HTMLInputElement>document.getElementById('input');
        var output = <HTMLUListElement>document.getElementById('output');
        this.app = new App(input,output);
    }
}
var app = (new Main()).app;
app.log('Application loaded');