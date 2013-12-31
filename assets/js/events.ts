/// <reference path="app.ts"/>
/// <reference path="helpers.ts"/>

module Todo {
    export class Events {
        app;
        codes;
        constructor(app :Todo.App){
            this.app = app;
            this.codes = {
                ENTER: 13
            };
        }
        handleEvent(e) {
            var app = this.app;
            var target = e.target;
            e.preventDefault();
            switch (e.type) {
                case 'dblclick':
                    // if double click on a todo_item then bring up a text field
                    if(target.classList.contains('text')){
                        var index = indexInParent(target.parentNode);
                        app.edit(index);
                    }
                    break;
                case 'keyup':
                    var input = app.input;
                    // if ENTER is hit on the main input field, add a todo_item
                    if (target === input && e.keyCode === this.codes.ENTER) {
                        app.add(input.value);
                    } else if(target.classList.contains('inline-input')&& e.keyCode === this.codes.ENTER){
                    // if ENTER is hit on an inline-input field, confirm modifications of said input
                        var index = indexInParent(target.parentNode);
                        app.confirm(app.entries.length-1-index,target.value);
                    }
                    break;
                case 'click':
                    // if MouseClick on one of the settings' links
                    if(target.classList.contains('settings')){
                        var index = indexInParent(target.parentNode);
                        if(target.classList.contains(('remove'))){
                            app.log('remove');
                            app.remove(app.entries.length-1-index);
                        } else if(target.classList.contains(('edit'))){
                            app.log('edit');
                            app.edit(index);
                        } else if(target.classList.contains(('confirm'))){
                            app.log('confirm');
                            var value = (<HTMLInputElement>target.parentElement.querySelector('.input')).value;
                            app.confirm(app.entries.length-1-index,value);
                        }
                    }
                    break;
            }
        }
    }
}
