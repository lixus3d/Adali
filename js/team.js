/**
 * Team object
 * @param {Object} options
 * @returns {OBJECTS.team}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.team = function(options){

    var team = this;

    team.id = null;

    team.vars = {
        player: true,
	human: true,
        level: 10,
        activ: true
    };

    this.init = function(options){
        this.vars = $.extend(this.vars,options);
    };

    this.setId = function(id){
        this.id = id;
    };
    this.getId = function(){
        return this.id;
    };

    this.init(options);

};

