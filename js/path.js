
OBJECTS.path = function(){
    
    var path = this;
    
    this.pRecalculateCount = 0;
    this.tRecalculateCount = 0;
    
    this.reversePathfinding = false;
    
    this.list = [];
    
    this.addList = function(nodeCode){
        this.list.push(nodeCode);
    };
    
    this.getFirst = function(){
        return this.list[this.list.length -1 ];
    };
    
    this.getLast = function(){
        return this.list[0];
    };
    
    this.delFirst = function(){ // table is in reverse order
        this.list.pop();
    };
    
    this.getPath = function(){
        return this.list.reverse(); // table is in reverse order 
    };
    
    this.getSize = function(){
        return path.list.length;
    };
    
    this.reset = function(){
        this.list.length = 0;
    };

    this.recalculatePartially = function(unit){
        
        var actualNodeCode = unit.getNodeCode();
        
        var UTILS = this.getRts().UTILS;
        
        if(this.pRecalculateCount < 2){     
            log('partial Recalculate');
            this.pRecalculateCount++;
            if(walkableKey = this.isThereWalkable(unit)){  
                
                startPosition = UTILS.getPositionByCode(actualNodeCode);   
                endPosition = UTILS.getPositionByCode(this.list[walkableKey]);   

                var start = new nodeObject(startPosition.x, startPosition.y);
                var end = new nodeObject(endPosition.x, endPosition.y);  
                var options = {
                    friendlyUnitBlock: true
                };
                
                // on recalcule entre le nouveau premier point et le point actuel 
                if(path.reversePathfinding){
                    log('reversing logic');
                    options.forceWalkableBoundary = true;
                    pathfinder = new OBJECTS.pathfinder(end,start,unit,this.getMap(),options);
                }else{
                    pathfinder = new OBJECTS.pathfinder(start,end,unit,this.getMap(),options);
                }
                
                var calculateReturn = pathfinder.calculate();
                
                if(calculateReturn > 0){                       
                    path.list.splice(walkableKey+1,path.list.length-1-walkableKey); // on supprime le path jusqu'au point actuel
                    var partialPath = pathfinder.path;   
                    if(path.reversePathfinding) partialPath.list.reverse();
                    $.each(partialPath.list,function(k,code){
                       path.addList(code); 
                    });
                    return 1;
                }else if(path.reversePathfinding && calculateReturn == -1){
                    return -1;
                }
            }else{
                log('no more walkable element found');     
            }
            
        }else if(this.tRecalculateCount < 4){
            log('total Recalculate');
            this.pRecalculateCount = 0;
            this.tRecalculateCount++;
            
            startPosition = UTILS.getPositionByCode(actualNodeCode);   
            endPosition = UTILS.getPositionByCode(this.getLast());   

            var start = new nodeObject(startPosition.x, startPosition.y);
            var end = new nodeObject(endPosition.x, endPosition.y);  
            var options = {
                friendlyUnitBlock: true
            };
            // on recalcule entre le nouveau premier point et le point actuel 
            if(path.reversePathfinding){
                log('reversing logic');
                options.forceWalkableBoundary = true;
                pathfinder = new OBJECTS.pathfinder(end,start,unit,this.getMap(),options);
            }else{
                pathfinder = new OBJECTS.pathfinder(start,end,unit,this.getMap(),options);
            }

            var calculateReturn = pathfinder.calculate();

            if(calculateReturn > 0){ 
                path.list = pathfinder.path.list.reverse();                
                return 1;
            }else if(path.reversePathfinding && calculateReturn == -1){
                return -1;
            }       
        }else{
            return -1;
        }
        return 0;
    };
    
    this.isThereWalkable = function(unit){       
        var walkableFound = 0;
        path.list.reverse();        
        $.each(path.list,function(k,code){
            if( path.getMap().isWalkable(code,unit).value > 0 ){
                walkableFound = k;
                return false;
            }
        });
        path.list.reverse();
        walkableFound = path.list.length-1 - walkableFound;        
        return walkableFound; 
    };
    
    this.deleteUntilWalkable = function(unit){

        var walkableFound = false;
        path.list.reverse();
        $.each(path.list,function(k,code){
            if( path.getMap().isWalkable(code,unit).value > 0 ){
                walkableFound = true;
                return false;
            }else path.list.shift();
        });
        path.list.reverse();
        return walkableFound;
    };   
    
};

OBJECTS.path.prototype = new OBJECTS.baseObject();

