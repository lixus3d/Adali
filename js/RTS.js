
OBJECTS.RTS = function(){

    var RTS = this;

    this.offset = 0;
    this.grid = 40;
    this.isoSize = {x:64, y:38}; // isometric size for the grid
    this.isoRatio = 38/64;
    this.mapSize = [10,10]; // pixelSize
    this.tickTime = 5;
    this.speedDivide = 50;

    this.UTILS = new OBJECTS.UTILS();

//    this.RULES = {};

};

OBJECTS.baseObject = function(){
}

var RULES = {};


OBJECTS.baseObject.prototype.getRts = function(){
    if(RTS){
        return RTS;
    }else throw 'RTS is not defined, but prototype.getRts() called.';
}

OBJECTS.baseObject.prototype.getRules = function(){
    if(RULES){
        return RULES;
    }else throw 'RULES is not defined, but prototype.getRules() called.';
}