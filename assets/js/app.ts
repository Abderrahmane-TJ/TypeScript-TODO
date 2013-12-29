/// <reference path="events.ts"/>
/// <reference path="helpers.ts"/>
module Todo {
    export class App {
        entries:string[];
        input;
        output;
        events;
        constructor(input,output) {
            this.entries = [];
            this.input = input;
            this.output = output;
            this.events = new Todo.Events(this);
        }
        add(entry:string) {
            entry = entry.trim();
            if (!entry) {
                return;
            }
            this.entries.push(entry);
            this.log('added %s', entry);
            this.update();
            this.input.value = '';
        }
        edit(index:number) {
            var li:HTMLElement = <HTMLElement>this.output.querySelector('li:nth-child('+(index+1)+')');
            var span:HTMLElement = <HTMLElement>li.querySelector('.text');
            span.classList.add('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.remove('hidden');
            var input = make(['input',{'type':'text','class':'input inline-input','value':this.entries[this.entries.length-1-index]}]);
            input.addEventListener('keyup',this.events,false);
            li.insertBefore(input,span);
            input.focus();

        }
        confirm(index:number,value:string) {
            this.entries[index] = value;
            var inline_input = <HTMLElement>this.output.querySelector('.inline-input');
            inline_input.parentNode.removeChild(inline_input);
            this.update();
        }
        delete(index:number) {
            this.entries.splice(index,1);
            this.update();
        }
        update() {
            var output = this.output;
            output.innerHTML = '';
            for(var i = this.entries.length-1; i > -1 ; i-- ){
                var text = make(['span',{'class':'text'},this.entries[i]]);
                text.addEventListener('dblclick',this.events,false);

                var confirm = make(['a',{'class':'settings checkmark confirm hidden',href:'#', title: 'Confirm modifications'}]);
                confirm.addEventListener('click',this.events,false);

                var edit = make(['a',{'class':'settings pencil edit',href:'#', title: 'Edit this item'}]);
                edit.addEventListener('click',this.events,false);

                var remove = make(['a',{'class':'settings bin remove ', href: '#', title: 'Delete this item'}]);
                remove.addEventListener('click',this.events,false);
                var li = make([
                    'li',{'class':'todo'},
                    text,
                    confirm,
                    edit,
                    remove
                ]);
                output.appendChild(li);
            }
        }
        log(...args) {
            console.log.apply(console, args);
        }
    }
}