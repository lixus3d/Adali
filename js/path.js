/**
 * Path object define an Array of nodeCode from one position to another
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.path = function(){
    
    var path = this;
    
    this.pRecalculateCount = 0;
    this.tRecalculateCount = 0;
    
    this.reversePathfinding = false;
    
    this.list = [];
    
    /**
     * Add a nodeCode to the path
     * @param {nodeCode} nodeCode
     */
    this.addList = function(nodeCode){
        this.list.push(nodeCode);
    };
    
    /**
     * Return the first nodeCode of the path
     * Caution : the path is in reverse order
     * @returns {nodeCode} 
     */
    this.getFirst = function(){
        return this.list[this.list.length -1 ];
    };
    
    /**
     * Return the last nodeCode of the path 
     * Caution : the path is in reverse order
     * @returns {nodeCode} 
     */
    this.getLast = function(){
        return this.list[0];
    };
    
    /**
     * Delete the first nodeCode of the path 
     * Caution : the path is in reverse order 
     */
    this.delFirst = function(){ // table is in reverse order
        this.list.pop();
    };
    
    /**
     * Get the path Array of nodeCode ( reverse the array to have it in the "correct" order )
     * @returns {Array}
     */
    this.getPath = function(){
        return this.list.reverse(); // table is in reverse order 
    };
    
    /**
     * Get the size of the path (number of nodeCodes in it)
     * @returns {number}
     */
    this.getSize = function(){
        return path.list.length;
    };
    
    /**
     * Make the path empty
     */
    this.reset = function(){
        this.list.length = 0;
    };

    /**
     * Try to recalculate the path from the actual position to the destination
     * @param {RTSitem} unit 
     * @returns {number} // 1 work , 0 have to retry (not sure) , -1 definitely impossible (not sure i don't remember)  
     */
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
                
                // we recalculate between the new first point and the actual point 
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
            
            // we recalculate between the new first point and the actual point 
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
    
    /**
     * Is the path still walkable somewhere, returns the length to the first walkable element
     * @param {RTSitem} unit 
     * @returns {number} 0 = none walkable element 
     */
    this.isThereWalkable = function(unit){       
        var walkableFound = 0;
        path.list.reverse();        
        $.each(path.list,function(k,code){
            if( path.getMap().isWalkable(code,unit).value > 0 ){
                walkableFound = k;
                return false; // stop the each
            }
        });
        path.list.reverse();
        walkableFound = path.list.length-1 - walkableFound;        
        return walkableFound; 
    };
    
    /**
     * Delete every element of the path to the first walkable element 
     * @param {RTSitem} unit
     * @returns {Boolean}
     */
    this.deleteUntilWalkable = function(unit){

        var walkableFound = false;
        path.list.reverse();
        $.each(path.list,function(k,code){
            if( path.getMap().isWalkable(code,unit).value > 0 ){
                walkableFound = true;
                return false; // stop the each
            }else path.list.shift();
        });
        path.list.reverse();
        return walkableFound;
    };   
    
};

OBJECTS.path.prototype = new OBJECTS.baseObject();

