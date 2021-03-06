var requestAnimFrame:(callback:() => void) => void = (function (){
    return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback){
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
/*var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;

function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === stringConstructor) {
        return "String";
    }
    else if (object.constructor === arrayConstructor) {
        return "Array";
    }
    else if (object.constructor === objectConstructor) {
        return "Object";
    }
    else if(typeof object) {
        return (typeof object);
    }else{
        return "???"
    }
}*/

function isArray(a){
    return Object.prototype.toString.call(a) === "[object Array]";
}
function isElement(obj){
    return !!(obj && obj.nodeType === 1);
}
/*function indexInParent(node:Node){
    var children = node.parentNode.childNodes;
    var num = 0;
    for(var i = 0; i < children.length; i++){
        if(children[i] == node) return num;
        if(children[i].nodeType == 1) num++;
    }
    return -1;
}*/
/*
 *   make(["p", "Here is a ", ["a", { href:"http://www.google.com/" }, "link"], "."]);
 */
function make(desc:any[]):HTMLElement{
    if(!isArray(desc)){
        return make.call(this, Array.prototype.slice.call(arguments));
    }
    var name = desc[0];
    var attributes = desc[1];
    var el = document.createElement(name);
    var start = 1;
    if(typeof attributes === "object" && attributes !== null && !isArray(attributes)){
        for(var attr in attributes){
            el.setAttribute(attr, attributes[attr]);
        }
        start = 2;
    }
    for(var i = start; i < desc.length; i++){
        var current = desc[i];
        if(isArray(current)){
            el.appendChild(make(current));
        } else
            if(isElement(current)){
                el.appendChild(current)
            } else {
                el.appendChild(document.createTextNode(current));
            }
    }
    return el;
}
enum TodoStatus {
    TODO,
    DONE,
    DELETED
}