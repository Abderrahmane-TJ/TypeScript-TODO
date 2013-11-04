var App = function(){
    this.debug = {ii : 0};
    this.events = [];
    this.init();
    this.loop();
};
App.prototype.loop = function(){
    var that = this;
    requestAnimationFrame(function(){
        that.loop();
    });
    var events = this.events;
    var i;
    for(i=0;i<events.length;i++){
        if(typeof events[i] === 'function'){
            events[i]();
        }
    }
}
App.prototype.associate = function(){
    var args = arguments;
    var oldValue = args[2][args[3]];
    var newValue = args[0][args[1]];
    if(oldValue!==newValue){
        args[2][args[3]] = args[0][args[1]];
    }
}
App.prototype.init = function(){
    var input = document.getElementsByClassName('text')[0];
    var output = document.getElementsByClassName('todo')[0];
    var that = this;
    this.events[0] = function(){
        that.associate(input,'value',output,'innerHTML');
    };
}
var app = new App();