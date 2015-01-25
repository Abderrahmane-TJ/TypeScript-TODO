/// <reference path="helpers.ts"/>
/// <reference path="config.ts"/>
/// <reference path="todo.ts"/>

module Todos {
    export class App {
        public todoID :number;
        entries:Todo[];
        input:HTMLInputElement;
        output:HTMLUListElement;
        keyCodes;
        constructor(input,output) {
            this.todoID = 0;
            this.keyCodes = {
                ENTER: 13
            };
            this.entries = [];
            this.input = input;
            this.output = output;

            this.loadFromLocalStorage();

            input.addEventListener('keyup', (e:KeyboardEvent)=>{
                e.preventDefault();
                if(e.keyCode == this.keyCodes.ENTER){
                    var value = input.value;
                    this.add(value);
                }
            }, false);
            input.focus();
        }
        add(text:string) {
            text = text.trim();
            if (!text) {
                return;
            }
            var todo = new Todos.Todo(this.todoID,text,TodoStatus.TODO);
            this.todoID += 1;
            this.entries.push(todo);
            this.save();
            this.log('added %s (%d)', text, todo.ID);
            var todoHTMLElement = this.buildHTMLTodo(todo);
            this.output.insertBefore(todoHTMLElement,this.output.firstChild);
            this.input.value = '';
        }
        edit(id:number,li?:HTMLElement) {
            var li = li || <HTMLElement>this.output.querySelector('#todo-'+id);
            var inline_input = <HTMLInputElement>li.querySelector('.inline-input');
            inline_input.classList.remove('hidden');
            (<HTMLElement>li.querySelector('.doEdit')).classList.remove('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.text')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.add('hidden');
            inline_input.value = this.findEntryByID(id).text;
            inline_input.focus();
        }
        confirm(id:number,li?:HTMLElement){
            var li = li || <HTMLElement>this.output.querySelector('#todo-'+id);
            var entry = this.findEntryByID(id);
            var confirming = entry.status === TodoStatus.TODO;

            if(confirming){
                entry.status = TodoStatus.DONE;
                li.classList.add('done');
            }else{
                entry.status = TodoStatus.TODO;
                li.classList.remove('done');
            }
            this.save();
        }
        doEdit(id:number,value:string,li?:HTMLElement) {
            this.findEntryByID(id).text=value;
            this.save();
            var li = li || <HTMLElement>this.output.querySelector('#todo-'+id);
            var text = <HTMLElement>li.querySelector('.text');
            text.innerText = value;
            (<HTMLElement>li.querySelector('.inline-input')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.doEdit')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.remove('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.remove('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.remove('hidden');
            text.classList.remove('hidden');
        }
        remove(id:number,li?:HTMLElement) {
            this.findEntryByID(id).status = TodoStatus.DELETED;
            this.save();
            var li = li || <HTMLElement>this.output.querySelector('#todo-'+id);
            li.parentNode.removeChild(li);
        }
        buildHTMLTodo(todo:Todo):HTMLElement {
            var text:HTMLElement,doEditButton:HTMLElement,
                editButton:HTMLElement,removeButton:HTMLElement,li:HTMLElement,
                confirmButton:HTMLElement,inline_input:HTMLInputElement;

            inline_input = <HTMLInputElement>make(['input',{
                'type':'text',
                'class':'input inline-input hidden',
                'value':todo.text
            }]);
            text = make(['span',{'class':'text'},todo.text]);
            confirmButton = make(['a',{'class':'todo-button checkmark confirm',href:'#', title: 'Confirm this item'}]);
            editButton = make(['a',{'class':'todo-button pencil edit',href:'#', title: 'Edit this item'}]);
            removeButton = make(['a',{'class':'todo-button bin remove ', href: '#', title: 'Delete this item'}]);
            doEditButton = make(['a',{'class':'todo-button pencil doEdit hidden',
                href:'#', title:'Confirm modifications' }]);

            var li_class = 'todo';
            if(todo.status===TodoStatus.DONE){
                li_class += ' done';
            }
            li = make([
                'li',{ 'class':li_class, 'id':'todo-'+todo.ID },
                inline_input,
                text,
            ]);

            inline_input.addEventListener('keyup',(e:KeyboardEvent)=>{
                if(e.keyCode === this.keyCodes.ENTER){
                    this.doEdit(todo.ID,inline_input.value);
                }
            },false);

            text.addEventListener('dblclick',(e:MouseEvent)=>{
                e.preventDefault();
                this.log('editing todo with ID %d',todo.ID);
                this.edit(todo.ID,li);
            },false);

            confirmButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                this.log('confirming todo with ID %d',todo.ID);
                this.confirm(todo.ID,li);
            },false);

            editButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                this.log('editing todo with ID %d',todo.ID);
                this.edit(todo.ID,li);
            },false);

            removeButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                this.log('removing todo with ID %d',todo.ID);
                this.remove(todo.ID,li);
            },false);

            doEditButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                var value = (<HTMLInputElement>li.querySelector('.input')).value;
                this.log('confirming %s',value);
                this.doEdit(todo.ID,value,li);
            },false);

            var buttons = make(['span',{'class':'settings'},
                doEditButton,
                confirmButton,
                editButton,
                removeButton]);

            li.appendChild(buttons);

            return li;
        }
        findEntryByID(ID:number):Todo{
            var entry;
            for(var i=0,len=this.entries.length;i<len;i++){
                entry = this.entries[i];
                if(entry.ID===ID){
                    return entry;
                }
            }
            return null;
        }
        loadFromLocalStorage(){
            var localStorageEntries = localStorage['entries'];
            if(!localStorageEntries){
                this.save();
                return;
            }
            var entries = JSON.parse(localStorageEntries);
            if(!isArray(entries) || entries.length === 0){
                return;
            }
            var ul = document.createDocumentFragment();
            this.entries = entries.map((entry)=>{
                var todo = new Todo(entry.ID,entry.text,entry.status);
                if(entry.status !== TodoStatus.DELETED){
                    var li = this.buildHTMLTodo(todo);
                    ul.insertBefore(li,ul.firstChild);
                }
                return todo;
            });
            this.todoID = entries[entries.length-1].ID + 1;
            this.output.appendChild(ul);
        }
        save(){
            localStorage['entries'] = JSON.stringify(this.entries);
        }
        log(...args) {
            CAN_DEBUG && console.log.apply(console, args);
        }
    }
}