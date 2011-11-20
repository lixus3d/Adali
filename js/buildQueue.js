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
    buildQueue.progress = 0;
    
    /**
     * Add something to a queue
     */
    this.addQueue = function(elementType,elementName,subType,team){
    	// create the queue object
    	var queueObject = {
    			type: elementType, // unit or building 
    			subType: subType, // aerial, infantry, vehicule, etc.
    			elementName: elementName, // tank, heavyTank, etc.
    			team: team
    		};
    	// add to the queue
        this.queue.push(queueObject); 
        
        // update element quantity
        if(!this.queueQuantity[elementType]) this.queueQuantity[elementType] = [];
        if(!this.queueQuantity[elementType][elementName]) this.queueQuantity[elementType][elementName] = 0;
        this.queueQuantity[elementType][elementName]++ ;
        
        // Verbose 
        this.getMotor().say('Added to queue');
    };
    
    /**
     * Return the first element of the queue 
     * @returns {queueElement} 
     */
    this.getFirst = function(){
        var element = this.queue.shift();
        this.queueQuantity[element.type][element.elementName]--;
        return element;
    };
    
    /**
     * Returns the number of an element in the queue 
     * @returns {number}
     */
    this.getTypeQuantity = function(elementType,elementName){
        return this.queueQuantity[elementType][elementName];
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
        this.doProgress();
    };
    
    /**
     * Launch/Continue construction, actually construct unit by unit (not by subType)
     * TODO : Construct subType by subType
     * TODO : Construct slowly when no power
     * TODO : Consume credit 5 by 5
     */
    this.construct = function(){  
        if( !this.isConstructing() && this.getSize() ){
        	this.setActualConstruction(this.getFirst());
        }
    };
    
    /**
     * Is the queue actually constructing a unit ?
     * @returns {Boolean} 
     */
    this.isConstructing = function(){
    	return this.actualConstruction ? true : false;
    };
    
    /**
     * Do the construction itself of the item
     * @returns {Boolean}
     */
    this.doProgress = function(){
    	if(this.isConstructing()){
	    	// if the item is not yet constructed
	        if(this.progress < this.actualConstruction.time){
	        	// We check the price of the unit
	    		if(price = this.actualConstruction.vars.price){
	    			var increment = price/this.actualConstruction.time;	    			
        			if(this.getMotor().ressources.hasCredit(increment)){
        				this.getMotor().ressources.addCredit(-increment);
        			}else return false;	    			
	    		}            		
	            this.progress++;
	        }else{
	            this.createItem(this.actualConstruction.elementName, this.actualConstruction.team);     
	            this.resetActualConstruction();
	        }
    	}
    };
    
    /**
     * Reset the actualConstruction progress
     */
    this.resetProgress = function(){
    	this.progress = 0;
    };
    
    /**
     * Create the RTSitem, find native position, add to the motor
     * @param {string} elementName
     * @param {team} team  
     */
    this.createItem = function(elementName,team){   	
    	log(elementName);
    	
    	var nativePosition = {x: 0, y: 0};
    	item = new OBJECTS.unit(nativePosition.x,nativePosition.y,team,elementName);
        this.getMotor().units.addUnit(item);
        this.getMotor().sounds.play('ready');
    };
    
    /**
     * Define the actual item to construct
     */
    this.setActualConstruction = function(queueObject){
        this.actualConstruction = queueObject;
        if( unitOptions = this.getRules()[this.actualConstruction.type][this.actualConstruction.elementName]){
            this.actualConstruction.vars = unitOptions;
            this.actualConstruction.time = (this.actualConstruction.vars.price + this.actualConstruction.vars.life);
            this.resetProgress();
        }else{                
        	this.resetActualConstruction();
        }    	
    };
    
    /**
     * Reset the actual item to construct
     */
    this.resetActualConstruction = function(){
    	this.actualConstruction = null;
    };
};

OBJECTS.buildQueue.prototype = new OBJECTS.baseObject();