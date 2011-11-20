/**
 * Building Queue object
 * @constructor
 * @returns {OBJECTS.buildQueue}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.buildQueue = function(){
    
    var buildQueue = this;
    
    buildQueue.actualConstruction = {};
    buildQueue.queue = {}; // queue by subType  
    buildQueue.queueQuantity = {};    
    
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
    	
    	// add to the queue of the subType
    	if(this.queue[subType] == undefined) buildQueue.queue[subType] = [];
    	this.queue[subType].push(queueObject);
        
        // update element quantity
        if(!this.queueQuantity[elementType]) buildQueue.queueQuantity[elementType] = [];
        if(!this.queueQuantity[elementType][elementName]) buildQueue.queueQuantity[elementType][elementName] = 0;
        this.queueQuantity[elementType][elementName]++ ;
        
        // Verbose 
        this.getMotor().say('Added to queue');
    };
    
    /**
     * Return the first element of the queue 
     * @returns {queueElement} 
     */
    this.getFirst = function(subType){
        var element = this.queue[subType].shift();
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
    this.getSize = function(subType){
        return this.queue[subType] ? this.queue[subType].length : 0;
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
    	
    	$.each(buildQueue.queue,function(subType,elements){    	
    		if( !buildQueue.isConstructing(subType) && buildQueue.getSize(subType) ){
    			buildQueue.setActualConstruction(buildQueue.getFirst(subType));
            }	
    	});        
    };
    
    /**
     * Is the queue actually constructing a unit ?
     * @returns {Boolean} 
     */
    this.isConstructing = function(subType){
    	return this.actualConstruction[subType] ? true : false;
    };
    
    /**
     * Do the construction itself of the item
     * @returns {Boolean}
     */
    this.doProgress = function(){

    	$.each(buildQueue.actualConstruction,function(subType,element){
    		if(element){
		    	// if the item is not yet constructed
		        if(element.progress < element.time){
		        	// We check the price of the unit
		    		if(price = element.vars.price){
		    			var increment = price/element.time;	    			
	        			if(buildQueue.getMotor().ressources.hasCredit(increment)){
	        				buildQueue.getMotor().ressources.addCredit(-increment);
	        			}else return false;	    			
		    		}            		
		    		element.progress++;
		        }else{
		        	buildQueue.createItem(element);     
		        	buildQueue.resetActualConstruction(subType);
		        }
    		}	        
    	});
    };

    
    /**
     * Define the actual item to construct
     * @param {queueObject} queueObject
     */
    this.setActualConstruction = function(queueObject){
    	subType = queueObject.subType;        
        if( unitOptions = this.getRules()[queueObject.type][queueObject.elementName]){
        	queueObject.vars = unitOptions;
        	queueObject.time = (queueObject.vars.price + queueObject.vars.life);
        	queueObject.progress = 0;
        	buildQueue.actualConstruction[subType] = queueObject;
        }else{                
        	buildQueue.resetActualConstruction(subType);
        }    	
    };
    
    /**
     * Reset the actual item to construct
     */
    this.resetActualConstruction = function(subType){
    	this.actualConstruction[subType] = null;
    };    
    
    /**
     * Create the RTSitem, find native position, add to the motor
     * @param {string} elementName
     * @param {team} team  
     */
    this.createItem = function(queueObject){   	
    	
    	var elementName = queueObject.elementName;
    	var team = queueObject.team;    	
    	var nativePosition = {x: 0, y: 0};
    	
    	if(queueObject.vars.constructionSite){ // the item is construct in a particular building 
    		// try to get the building
    		if( constructionSiteItem = this.getMotor().buildings.getItemByName(team.getId(),queueObject.vars.constructionSite)){
    			nativePosition.x = constructionSiteItem.x;
    			nativePosition.y = constructionSiteItem.y + 55;
    		}
    	}
    	
    	log(elementName);
    	
    	item = new OBJECTS.unit(nativePosition.x,nativePosition.y,team,elementName);
        this.getMotor().units.addUnit(item);
        if(constructionSiteItem && constructionSiteItem.waypoint){
        	item.moveTo(constructionSiteItem.waypoint);
        }
        this.getMotor().sounds.play('ready');
    };    
};

OBJECTS.buildQueue.prototype = new OBJECTS.baseObject();