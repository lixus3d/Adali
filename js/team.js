
OBJECTS.team = function(options){

    var team = this;

    this.id = null;

    this.vars = {
        player: true,
	human: true,
        level: 10,
        activ: true
    }

    this.init = function(options){
        this.vars = $.extend(this.vars,options);
    }

    this.setId = function(id){
        this.id = id;
    };
    this.getId = function(){
        return this.id;
    }

    this.init(options);

}

