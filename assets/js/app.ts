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
            this.log('added %s (%d)', text, todo.ID);
            var todoHTMLElement = this.buildHTMLTodo(todo);
            this.output.insertBefore(todoHTMLElement,this.output.firstChild);
            this.input.value = '';
        }
        edit(id:number) {
            // TODO: add a find function
            var li = <HTMLElement>this.output.querySelector('#todo-'+id);
            var inline_input = <HTMLInputElement>li.querySelector('.inline-input');
            inline_input.classList.remove('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.remove('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.text')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.add('hidden');
            inline_input.value = this.findEntryByID(id).text;
            inline_input.focus();
        }
        confirm(id:number,value:string) {
            this.findEntryByID(id).text=value;
            var li = <HTMLElement>this.output.querySelector('#todo-'+id);
            var text = <HTMLElement>li.querySelector('.text');
            text.innerText = value;
            (<HTMLElement>li.querySelector('.inline-input')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.remove('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.remove('hidden');
            text.classList.remove('hidden');
        }
        remove(id:number) {
            this.entries[id].status = TodoStatus.DELETED;
            var li = this.output.querySelector("#todo-"+id);
            li.parentNode.removeChild(li);
        }
        buildHTMLTodo(todo:Todo):HTMLElement {
            var text:HTMLElement,confirmButton:HTMLElement,
                editButton:HTMLElement,removeButton:HTMLElement,li:HTMLElement,
                inline_input:HTMLInputElement;

            inline_input = <HTMLInputElement>make(['input',{
                'type':'text',
                'class':'input inline-input hidden',
                'value':todo.text
            }]);
            inline_input.addEventListener('keyup',(e:KeyboardEvent)=>{
                if(e.keyCode === this.keyCodes.ENTER){
                    var id = parseInt(inline_input.parentElement.id.replace('todo-',''));
                    this.confirm(id,inline_input.value);
                }
            },false);

            text = make(['span',{'class':'text'},todo.text]);
            text.addEventListener('dblclick',(e:MouseEvent)=>{
                e.preventDefault();
                var id = parseInt(text.parentElement.id.replace('todo-',''));
                this.log('editing todo with ID %d',id);
                this.edit(id);
            },false);

            editButton = make(['a',{'class':'todo-button pencil edit',href:'#', title: 'Edit this item'}]);
            editButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                var id = parseInt(editButton.parentElement.parentElement.id.replace('todo-',''));
                this.log('editing todo with ID %d',id);
                this.edit(id);
            },false);

            removeButton = make(['a',{'class':'todo-button bin remove ', href: '#', title: 'Delete this item'}]);
            removeButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                var id = parseInt(removeButton.parentElement.parentElement.id.replace('todo-',''));
                this.log('removing todo with ID %d',id);
                this.remove(id);
            },false);

            confirmButton = make(['a',{'class':'todo-button pencil confirm hidden',
                href:'#', title:'Confirm modifications' }]);
            confirmButton.addEventListener('click',(e:MouseEvent)=>{
                e.preventDefault();
                var id = parseInt(confirmButton.parentElement.parentElement.id.replace('todo-',''));
                var value = (<HTMLInputElement>confirmButton.parentElement.parentElement.querySelector('.input')).value;
                this.log('confirming %s',value);
                this.confirm(id,value);
            },false);

            li = make([
                'li',{
                    'class':'todo',
                    'id':'todo-'+todo.ID
                },
                inline_input,
                text,
                ['span',{'class':'settings'},
                    confirmButton,
                    editButton,
                    removeButton]
            ]);
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
        log(...args) {
            CAN_DEBUG && console.log.apply(console, args);
        }
    }
}