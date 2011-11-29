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
   
    buildQueue.readyQueue = {}; // elements ready to place 
    
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
        
        buildQueue.getMotor().menu.updateCount(queueObject.elementName,1);
        
        // Verbose 
        this.getMotor().say('Added to queue');
    };
    
    /**
     * Add a queueObject to the ready to place queue
     * @param queueObject
     */
    this.addReadyQueue = function(elementName){
    	if(this.readyQueue[elementName] == undefined) buildQueue.readyQueue[elementName] = [];
    	this.readyQueue[elementName].push(1);
    };
    
    /**
     * Delete a queueObject from the ready to place queue
     * @param queueObject
     */
    this.delReadyQueue = function(elementName){
    	if(this.inReadyQueue(elementName)){
    		//log('resetReadyQueue');
    		this.readyQueue[elementName].length = 0;
    	}        
    };
    
    /**
     * Indicate if a queueObject is already ready 
     * @param {queueObject} queueObject
     * @returns {Boolean}
     */
    this.inReadyQueue = function(elementName){
    	//log(this.readyQueue);
    	return (this.readyQueue[elementName] && this.readyQueue[elementName].length > 0) ;
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
		    		buildQueue.getMotor().menu.updateProgress(element.elementName,element.progress/element.time);
		        }else{
		        	buildQueue.readyItem(element);
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
        	buildQueue.resetActualConstruction(subType,queueObject.elementName);
        }    	
    };
    
    /**
     * Reset the actual item to construct
     */
    this.resetActualConstruction = function(subType,elementName){
    	//log(subType);
    	this.actualConstruction[subType] = null;
    	if(elementName){
			buildQueue.getMotor().menu.updateProgress(elementName,0);
			buildQueue.getMotor().menu.updateCount(elementName,-1);
			buildQueue.getMotor().menu.unsetReady(elementName);
			buildQueue.delReadyQueue(elementName);
    	}
    };    
    
    /**
     * Indicate an item is ready
     * @param {queueObject} queueObject
     */
    this.readyItem = function(queueObject){
    	var elementType = queueObject.type;
    	
    	if(elementType == 'unit'){
    		this.createItem(queueObject);
    	}else if(elementType == 'building'){
    		if(!this.inReadyQueue(queueObject.elementName)){
    			this.addReadyQueue(queueObject.elementName);
    			this.getMotor().menu.setReady(queueObject.elementName);
    		}
    	}
    };
    
    /**
     * Create the RTSitem, find native position, add to the motor
     * TODO : put the team start position if we don't find the construction site
     * @param {queueObject} queueObject
     * @return {Boolean} 
     */
    this.createItem = function(queueObject,nativePosition){   	
    	
    	var elementName = queueObject.elementName;
    	var elementType = queueObject.type;
    	var subType = queueObject.subType;
    	var team = queueObject.team;    
    	
    	if(nativePosition == undefined){
    		nativePosition = {x: 25, y: 25}; // default position if we can't find the construction site
    	}
    	
    	if(queueObject.vars.constructionSite){ // the item is construct in a particular building 
    		// try to get the building
    		if( constructionSiteItem = this.getMotor().buildings.getItemByName(team.getId(),queueObject.vars.constructionSite)){
    			if(!(popOffset = constructionSiteItem.vars.popOffset)) popOffset = {x:0 ,y:-55};		
    			nativePosition.x = constructionSiteItem.x + popOffset.x;
    			nativePosition.y = constructionSiteItem.y + popOffset.y;
    		}
    	}
    	
    	item = new OBJECTS[elementType](nativePosition.x,nativePosition.y,team,elementName);
        this.getMotor()[elementType+'s'].addItem(item);
        
        if(queueObject.vars.constructionSite && constructionSiteItem && constructionSiteItem.waypoint){
        	item.moveTo(constructionSiteItem.waypoint);
        }
        this.getMotor().sounds.play('ready');
        buildQueue.resetActualConstruction(subType,queueObject.elementName);
        
        return true;
    };    
};

OBJECTS.buildQueue.prototype = new OBJECTS.baseObject();