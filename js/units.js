
OBJECTS.units = function(){
    
    var units = this;
    
    this.list = [];
    this.idList = [];
    
//    this.unselectAll = function(){        
//        $.each(units.list,function(k,unit){
//            unit.unselect();
//        })       
//    };    
    
    this.addUnit = function(unit){
        this.list.push(unit) ;         
        unit.setId(this.list.length-1);
        this.idList.push(unit.getId()); 
        unit.activate();
    }
    
    this.killUnit = function(unitId){
        
        // get normal list position 
        var index = this.idList.indexOf(unitId);
        if(index!=-1){
            this.list.splice(index,1);
            this.idList.splice(index,1);
        }
        this.getMotor().selection.update();        
    }
    
    this.tick = function(){
        //log(units.list);
        $.each(units.getMotor().units.list,function(k,unit){
            if(unit){
                unit.tick();    
            }
        });       
    }
    
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

        $.each(units.list,function(k,unit){
            if(
               unit.team.vars.player &&
               unit.x >= (min.x - this.getRts().offset) && unit.x <= (max.x - this.getRts().offset) &&
               unit.y >= (min.y - this.getRts().offset) && unit.y <= (max.y - this.getRts().offset)
            ){
                    search.push(unit);
            }
        });       
        
        return search;
    }
    
}

OBJECTS.units.prototype = new OBJECTS.baseObject();