/// <reference path="helpers.ts"/>
/// <reference path="config.ts"/>
module Todo {
    export class App {
        entries:string[];
        input:HTMLInputElement;
        output:HTMLUListElement;
        keyCodes;
        constructor(input,output) {
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
        add(entry:string) {
            entry = entry.trim();
            if (!entry) {
                return;
            }
            this.entries.push(entry);
            this.log('added %s', entry);
            this.buildList();
            this.input.value = '';
        }
        edit(index:number) {
            var indexInHTML = this.entries.length -1 -index;
            var li = <HTMLElement>this.output.querySelector('li:nth-child('+(indexInHTML+1)+')');
            var span = <HTMLElement>li.querySelector('.text');
            span.classList.add('hidden');
            (<HTMLElement>li.querySelector('.edit')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.remove')).classList.add('hidden');
            (<HTMLElement>li.querySelector('.confirm')).classList.remove('hidden');

            var inline_input = make(['input',{
                'type':'text',
                'class':'input inline-input',
                'value':this.entries[index]
            }]);
            inline_input.addEventListener('keyup',(e:KeyboardEvent)=>{
                if(e.keyCode === this.keyCodes.ENTER){
                    var index = indexInParent(inline_input.parentNode);
                    this.confirm(this.entries.length-1-index,inline_input.value);
                }
            },false);
            li.insertBefore(inline_input,span);
            inline_input.focus();

        }
        confirm(index:number,value:string) {
            this.entries[index] = value;
            var inline_input = <HTMLElement>this.output.querySelector('.inline-input');
            inline_input.parentNode.removeChild(inline_input);
            this.buildList();
        }
        remove(index:number) {
            this.entries.splice(index,1);
            this.buildList();
        }
        buildList() {
            var output = this.output,
                text,confirmButton,editButton,removeButton,li;
            output.innerHTML = '';
            for(var i = this.entries.length-1; i > -1 ; i-- ){
                ((text,confirmButton,editButton,removeButton,li)=>{
                text = make(['span',{'class':'text'},this.entries[i]]);
                text.addEventListener('dblclick',(e:MouseEvent)=>{
                    e.preventDefault();
                    var indexInHTML = indexInParent(text.parentNode);
                    var index = this.entries.length -1 -indexInHTML;
                    this.log('editing %s',this.entries[index]);
                    this.edit(index);
                },false);

                confirmButton = make(['a',{
                    'class':'settings checkmark confirm hidden',
                    href:'#',
                    title:'Confirm modifications'
                }]);
                confirmButton.addEventListener('click',(e:MouseEvent)=>{
                    e.preventDefault();
                    var index = this.entries.length -1 -indexInParent(confirmButton.parentNode);
                    var value = (<HTMLInputElement>confirmButton.parentNode.querySelector('.input')).value;
                    this.log('confirming %s',value);
                    this.confirm(index,value);
                },false);

                editButton = make(['a',{'class':'settings pencil edit',href:'#', title: 'Edit this item'}]);
                editButton.addEventListener('click',(e:MouseEvent)=>{
                    e.preventDefault();
                    var indexInHTML = indexInParent(editButton.parentNode);
                    var index = this.entries.length -1 -indexInHTML;
                    this.log('editing %s',this.entries[index]);
                    this.edit(index);
                },false);

                removeButton = make(['a',{'class':'settings bin remove ', href: '#', title: 'Delete this item'}]);
                removeButton.addEventListener('click',(e:MouseEvent)=>{
                    e.preventDefault();
                    var indexInHTML = indexInParent(removeButton.parentNode);
                    var index = this.entries.length -1 -indexInHTML;
                    this.log("removing %s",this.entries[index]);
                    this.remove(index);
                },false);
                li = make([
                    'li',{'class':'todo'},
                    text,
                    confirmButton,
                    editButton,
                    removeButton
                ]);
                output.appendChild(li);
                })(text,confirmButton,editButton,removeButton,li);
            }
        }
        log(...args) {
            CAN_DEBUG && console.log.apply(console, args);
        }
    }
}