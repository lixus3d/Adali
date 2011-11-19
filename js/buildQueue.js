
OBJECTS.buildQueue = function(){
    
    var buildQueue = this;
    
    buildQueue.actualConstruction = null;
    buildQueue.queue = [];     
    buildQueue.queueQuantity = {};
    
    this.addQueue = function(elementType,subType,team){        
        this.queue.push({type: elementType, subType: subType, team: team});
        if(!this.queueQuantity[elementType]) this.queueQuantity[elementType] = [];
        if(!this.queueQuantity[elementType][subType]) this.queueQuantity[elementType][subType] = 0;
        this.queueQuantity[elementType][subType]++ ;
        this.getMotor().say('Added to queue');
    };
    
    this.getFirst = function(){
        var element = this.queue.shift();
        this.queueQuantity[element.type][element.subType]--;
        return element;
    };
    
    this.getTypeQuantity = function(elementType,subType){
        return this.queueQuantity[elementType][subType];
    };
    
    this.getSize = function(){
        return this.queue.length;
    };
    
    this.tick = function(){
        this.construct();
    };
    
    this.construct = function(){        
        if(this.actualConstruction){
            if(this.progress < this.actualConstruction.time){
                this.progress++;
            }else{
                log(this.actualConstruction.subType);
                this.getMotor().units.addUnit(new OBJECTS.unit(22,22,this.actualConstruction.team,this.actualConstruction.subType));
                this.getMotor().sounds.play('ready');
                this.actualConstruction = null;
            }
        }else if(this.getSize()){
            this.actualConstruction = this.getFirst();
            if( unitOptions = this.getRules().unit[this.actualConstruction.subType]){
                this.actualConstruction.vars = unitOptions;
                this.actualConstruction.time = (this.actualConstruction.vars.price + this.actualConstruction.vars.life);
                this.progress = 0;
                this.getMotor().say('Construction in progress, please wait ...');
            }else{                
                this.actualConstruction = null;
                return false;
            }
        }
    };
};

OBJECTS.buildQueue.prototype = new OBJECTS.baseObject();