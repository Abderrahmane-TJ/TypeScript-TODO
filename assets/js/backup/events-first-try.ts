interface ev{
    name :string;
    callback :Function;
}

class Events{
    events :ev[];
    constructor() {
        this.events = [];
        this.init();
        this.loop();
    }
    loop() {
        var that = this;
        requestAnimationFrame(function () {
            that.loop();
        });
        var events = this.events;
        var i;
        for (i = 0; i < events.length; i++) {
            if (typeof events[i].callback === 'function') {
                events[i].callback();
            }
        }
    }

    register(name :string ,callback :Function){
        this.events[this.events.length] = {
            name: name,
            callback: callback
        };
    }
    associate(o) {
        var output = o.ouput;
        var input = o.input;
        var input_property = o.input_property;
        var output_property = o.output_property;
        for(var i=0;i<output.length;i++){

            var oldValue = output[i][output_property];
            var newValue = input[input_property];
            if (oldValue !== newValue) {
                output[i][output_property] = newValue;
            }
        }
    }

    init() {

    }
}

//  TODO : add register and listen methods
//  TODO : add SIMO asspcoation

/*
 To be able to associate MIMO, we first have to have a SIMO system,
 them the rest is done manually, like in jQuery :
 $('.input').each(function(){ $(this).sibling('nian') });
 */
