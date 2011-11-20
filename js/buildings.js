/**
 * buildings list of the RTS 
 * @returns {OBJECTS.buildings}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */

OBJECTS.buildings = function(){
    
    var buildings = this;
    
    this.list = [];
    this.idList = [];
    
//    this.unselectAll = function(){        
//        $.each(buildings.list,function(k,building){
//            building.unselect();
//        })       
//    };
    
    /**
     * Add a building to the buildings list and activate the building
     * @param {RTSitem} building 
     */    
    this.addBuilding = function(building){
        this.list.push(building) ;         
        building.setId(this.list.length-1);
        this.idList.push(building.getId()); 
        building.activate();
    };

    /**
     * Kill a building, update the list, update the current selection
     * @param {number} buildingId
     */
    this.killBuilding = function(buildingId){
        
        // get normal list position 
        var index = this.idList.indexOf(buildingId);
        if(index!=-1){
            this.list.splice(index,1);
            this.idList.splice(index,1);
        }
        this.getMotor().selection.update();        
    };
    
    /**
     * Execute every building tick when tick is triggered by the motor tick
     */
    this.tick = function(){
        //log(buildings.list);
        $.each(buildings.getMotor().buildings.list,function(k,building){
            if(building){
                building.tick();    
            }
        });       
    };
    
    /**
     * Return a list of building in the selector area if presents
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

        $.each(buildings.list,function(k,building){
            if(
               building.team.vars.player &&
               building.x >= (min.x - this.getRts().offset) && building.x <= (max.x - this.getRts().offset) &&
               building.y >= (min.y - this.getRts().offset) && building.y <= (max.y - this.getRts().offset)
            ){
                    search.push(building);
            }
        });       
        
        return search;
    };
    
};

OBJECTS.buildings.prototype = new OBJECTS.baseObject();