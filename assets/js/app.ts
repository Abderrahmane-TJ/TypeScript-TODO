/// <reference path="events.ts"/>
/// <reference path="helpers.ts"/>
module Todo {
    export class App {
        entries:Array;
        input;
        output;
        events;
        constructor(input,output) {
            this.entries = new Array<String>();
            this.input = input;
            this.output = output;
            this.events = new Todo.Events(this);
        }
        add(entry:String) {
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
        }
        delete(index:number) {
            this.entries.splice(index,1);
            this.update();
        }
        update() {
            var output = this.output;
            output.innerHTML = '';
            for(var i = this.entries.length-1; i > -1 ; i-- ){
                var text = make(['span',this.entries[i]]);
                var edit = make(['a',{'class':'settings cog edit',href:'#', title: 'Edit this item'}]);
                edit.addEventListener('click',this.events,false);
                var remove = make(['a',{'class':'settings bin remove ', href: '#', title: 'Delete this item'}]);
                remove.addEventListener('click',this.events,false);
                var li = make([
                    'li',{'class':'todo'},
                    text,
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