/**
 * RTSitem list abstract 
 * @returns {OBJECTS.items}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */

ABSTRACTS.itemListAbstract = function(){
    
    var items = this;
    
    items.list = [];  // list of item 
    items.listByTeam = []; // list of item by teamId and itemType
    items.primaries = [];
    
    items.idList = [];
    
    
    /**
     * Add a item to the items list and activate the item
     * @param {RTSitem} item 
     */
    this.addItem = function(item){
	
		// add item to the list 
		this.list.push(item);
		// compute itemId
		itemId = this.list.length-1;
		// set the itemId 
        item.setId(itemId);
        // push the id to the idList 
        this.idList.push(itemId);
        
        // push the id to the listByTeam
        if( (item.itemType) && (item.team) && (teamId = item.team.getId()) != undefined ){
            if(this.listByTeam[teamId] == undefined) this.listByTeam[teamId] = [];
            if(this.listByTeam[teamId][item.itemType] == undefined) this.listByTeam[teamId][item.itemType] = [];
            this.listByTeam[teamId][item.itemType].push(item);
        }
        
        item.activate();
    };
    
    /**
     * Kill a item, update the list, update the current selection
     * @param {number} itemId
     */
    this.killItem = function(itemId){
        
        // get normal list position 
        var index = this.idList.indexOf(itemId);
        if(index!=-1){
            this.list.splice(index,1);
            this.idList.splice(index,1);
        }
        this.getMotor().selection.update();        
    };
    
    /**
     * Define the primary item of a particular itemType
     * @param {RTSitem} item
     */
    this.setPrimary = function(item){
    	if( (item.itemType) && (item.team) && (teamId = item.team.getId()) != undefined ){
            if(this.primaries[teamId] == undefined) this.primaries[teamId] = [];
            if(this.primaries[teamId][item.itemType] == undefined) this.primaries[teamId][item.itemType] = [];
            this.primaries[teamId][item.itemType] = item;
    	}
    	return item.getId();
    };
    
    /**
     * Return a item by its Id 
     */
    this.getItemById = function(itemId){    	
    	if(items.list[itemId] != undefined ) return items.list[itemId];
    	return null;
    };
    
    /**
     * Return an item by it's name, teamId and eventually itemIndex if multiple occurrences
     */
    this.getItemByName = function(teamId,itemType,itemIndex){
    	
    	// We search for primary or 0 index by default  
    	if(itemIndex == undefined ) itemIndex = 'primary';
    	
    	if(itemIndex == 'primary'){
    		if(items.primaries[teamId] && items.primaries[teamId][itemType]) return items.primaries[teamId][itemType];
    		itemIndex = 0;
    	}    	
    	
    	if(itemList = this.getItemsByName(teamId,itemType)){
	    	if(itemList[itemIndex] != undefined ) return itemList[itemIndex];
    	}
    	return null;
    };
    
    /**
     * Return a list of items , selected by name and teamId
     */
    this.getItemsByName = function(teamId,itemType){
    	if(this.listByTeam[teamId] && this.listByTeam[teamId][itemType]){
    		return this.listByTeam[teamId][itemType];
    	}
    	return null;
    };
    
    /**
     * Execute every item tick when tick is triggered by the motor tick
     */
    this.tick = function(){
        //log(items.list);
        $.each(items.list,function(k,item){
            if(item){
                item.tick();    
            }
        });       
    };
    
    /**
     * Return a list of item in the selector area if presents
     * @param {selector} selector
     * @return {Array}
     */
    this.searchInSelector = function(selector){
        
        var search = [];
        var min = {};
        var max = {};
        
        if(this.getMotor().selector.start.x < this.getMotor().selector.end.x){
            min.x = this.getMotor().selector.start.x;
            max.x = this.getMotor().selector.end.x;
        }else{
            min.x = this.getMotor().selector.end.x;
            max.x = this.getMotor().selector.start.x;            
        }
        
        if(this.getMotor().selector.start.y < this.getMotor().selector.end.y){
            min.y = this.getMotor().selector.start.y;
            max.y = this.getMotor().selector.end.y;
        }else{
            min.y = this.getMotor().selector.end.y;
            max.y = this.getMotor().selector.start.y;            
        }  

        $.each(items.list,function(k,item){
            if(
               item.team.vars.player &&
               item.x >= (min.x - this.getRts().offset) && item.x <= (max.x - this.getRts().offset) &&
               item.y >= (min.y - this.getRts().offset) && item.y <= (max.y - this.getRts().offset)
            ){
                    search.push(item);
            }
        });       
        
        return search;
    };
    
};

ABSTRACTS.itemListAbstract.prototype = new OBJECTS.baseObject();