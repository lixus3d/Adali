/**
 * Building Queue object
 * @returns {OBJECTS.buildQueue}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.buildQueue = function(){
    
    var buildQueue = this;
    
    buildQueue.actualConstruction = null;
    buildQueue.queue = [];     
    buildQueue.queueQuantity = {};
    
    /**
     * Add something to a queue
     */
    this.addQueue = function(elementType,subType,team){        
        this.queue.push({type: elementType, subType: subType, team: team});
        if(!this.queueQuantity[elementType]) this.queueQuantity[elementType] = [];
        if(!this.queueQuantity[elementType][subType]) this.queueQuantity[elementType][subType] = 0;
        this.queueQuantity[elementType][subType]++ ;
        this.getMotor().say('Added to queue');
    };
    
    /**
     * Return the first element of the queue 
     * @returns {queueElement} 
     */
    this.getFirst = function(){
        var element = this.queue.shift();
        this.queueQuantity[element.type][element.subType]--;
        return element;
    };
    
    /**
     * Returns the number of an element in the queue 
     * @returns {number}
     */
    this.getTypeQuantity = function(elementType,subType){
        return this.queueQuantity[elementType][subType];
    };
    
    /**
     * Returns the queue size (number of element in the queue)
     * @returns {number} 
     */
    this.getSize = function(){
        return this.queue.length;
    };
    
    /**
     * tick function of the queue 
     */
    this.tick = function(){
        this.construct();
    };
    
    /**
     * Launch/Continue construction, actually construct unit by unit (not by subType)
     */
    this.construct = function(){    
    	
        if(this.actualConstruction){
        	
            if(this.progress < this.actualConstruction.time){
            	// We check the price of the unit
            	if( unitOptions = this.getRules().unit[this.actualConstruction.subType]){
            		if(price = unitOptions.price){
            			if(this.progress <= price){ // do we have already get all credits required
	            			if(this.getMotor().ressources.hasCredit(1)){
	            				this.getMotor().ressources.addCredit(-1);
	            			}else return false;
            			}
            		}            		
            	}
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
                

            }else{                
                this.actualConstruction = null;
                return false;
            }
        }
    };
};

OBJECTS.buildQueue.prototype = new OBJECTS.baseObject();