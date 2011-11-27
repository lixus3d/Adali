/**
 * The map object, defines everything relative to the terrain
 * @param {Array} size
 * @returns {OBJECTS.map}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.map = function(size) {

    var map = this;

    this.walls = [];
    this.nodeZero = {};

    this.dom = $('.map');

    /**
     * Init every elements of the map
     * @param {Array} size
     */
    this.init = function(size){

        var RTS = this.getRts();
        var UTILS = this.getRts().UTILS;

        var ZeroNodeOffset = Math.ceil(size[1] / RTS.isoSize.y);
        log('ZeroNodeOffset : '+ZeroNodeOffset);

        // determine the x and y position of zero node
        this.nodeZero = {
            x: Math.floor(RTS.offset - ( RTS.isoSize.x * ZeroNodeOffset/2)),
            y: Math.floor(RTS.offset + ( RTS.isoSize.y * ZeroNodeOffset/2))
        };

        // Correct the background grids
        $('.map, .grid').css({
            backgroundPosition: (map.nodeZero.x)+'px '+(map.nodeZero.y - RTS.isoSize.y/2)+'px '
        });
        $('.interface').css({
            backgroundPosition: (map.nodeZero.x - RTS.isoSize.x/2)+'px '+(map.nodeZero.y)+'px '
        });

        var topRightRel = UTILS.absToRel({x: size[0], y: 0},this.nodeZero);
        var topRightNode = UTILS.relPosToNodePos(topRightRel,RTS.isoSize);

        var bottomRightRel = UTILS.absToRel({x: size[0], y: size[1]},this.nodeZero);
        var bottomRightNode = UTILS.relPosToNodePos(bottomRightRel,RTS.isoSize);

        this.width = topRightNode.x;
        this.height = bottomRightNode.y;

        log('mapSize: '+this.width+' x '+this.height);

		this.dom.css({
		    width: size[0],
		    height: size[1]
		});
	
		// TODO : Do the map editor ...
	    this.walls = [
	        368,369,370,371,372,
	        555,554,553,552,551,
	        631,632,630,629,628,
	        751,752,753,754,755,756,
	        882,881,880,879,878,877,876,
	        889,890,891,892
	    ];
//        this.walls = [52,53,54,55,87,88,89,90,122,123,124,125,168, 203,204,205,206,207, 238, 273, 562, 597, 632, 667, 189, 190, 191, 192, 51, 86, 121, 156, 285, 320, 355, 390, 249, 284, 319, 354, 215, 216, 217, 218, 585, 586, 587, 588, 474, 509, 544, 579, 339, 374, 409, 444, 340, 341, 342, 343, 351, 352, 353, 354, 189, 224, 259, 294, 161, 196, 231, 266, 286, 287, 288, 289, 348, 349, 350, 351, 120, 155, 190, 225, 93, 128, 163, 198, 503, 538, 573, 608, 478, 479, 480, 481];
//        this.generateWalls();
    };

    /**
     * Define whether a nodeCode is walkable for the current unit 
     * @param {nodeCode} nodeCode
     * @param {RTSitem} unit
     * @returns {walkableObject} 
     */
    this.isWalkable = function(nodeCode,unit){

        /*
         * Errors :
         * 0 = Wall, water, tree, etc ...
         * 1 = Other team unit
         * 2 = Friendly unit
         * 3 = Building
         * ...
         */
    	
    	var isWalkable = {value: 1, error: 0, infos: {}};
    	
    	// Aerial units can move anywhere
    	if(unit && unit.vars && unit.vars.movement == 'helicopter'){
    		return isWalkable;
    	}
    	
        
        switch(true){
            case (this.isWall(nodeCode)):
                isWalkable.value = 0; // 0 = wall, water, tree
                isWalkable.error = 0;
                break;
            case ( (unitFound = this.isUnitAtCode(nodeCode,unit)).error > 0 ): // really useful js syntax 
                isWalkable.value = 0;
                isWalkable.infos.unit = unitFound.unit;
                if(unitFound.error == 1){ // unit
                    isWalkable.error = 1;
                }else if(unitFound.error == 2){ // friend unit
                    isWalkable.error = 2;
                }
                break;
            case ( (buildingFound = this.isBuildingAtCode(nodeCode,unit)).error > 0 ): // really useful js syntax
                isWalkable.value = 0;
                isWalkable.error = 3;
                break;
        }
        return isWalkable;
    };

    /**
     * Is there a wall at the given nodeCode
     * @param {nodeCode} nodeCode
     * @returns {Boolean}  
     */
    this.isWall = function(nodeCode){
        return this.walls.indexOf(nodeCode) >= 0;
    };

    /**
     * Does we see thru the given nodeCode
     * @param {nodeCode} nodeCode
     * @param {RTSitem} actualUnit
     * @returns {Boolean}
     */
    this.isSightable = function(nodeCode,actualUnit){
    	
    	if(actualUnit.vars && actualUnit.vars.movement == 'helicopter'){
    		return true;
    	}
        switch(true){
            case this.isWall(nodeCode):
//            case (this.isUnitAtCode(nodeCode,unit)): // we can fire or view thru unit ( yes ;), why not ^^ )
                return false;
        }
        return true;
    };

    /**
     * Is there a unit at the given nodeCode (don't forget to exclude the actualOne ...) 
     * @param {nodeCode} nodeCode
     * @param {RTSitem} actualUnit
     * @returns {unitPresenceObject}
     */
    this.isUnitAtCode = function(nodeCode,actualUnit){
    	
        /*
         * Errors :
         * 0 = Wall, water, tree, etc ...
         * 1 = Other team unit
         * 2 = Friendly unit
         * 3 = Building
         * ...
         */
    	
        var unitFound = {unit: null, error: 0};

        $.each(map.getMotor().units.list,function(k,unit){
            if(actualUnit && unit.getId() == actualUnit.getId())
                return true; // go to next unit
            if(unit.getNodeCode() == nodeCode){
                unitFound.unit = unit;
                if(actualUnit && actualUnit.team.getId() == unit.team.getId()){
                    unitFound.error = 2;
                }else{
                    unitFound.error = 1;
                }
                return false;
            }
        });
        return unitFound;
    };

    /**
     * Just like isUnitAtCode but for building 
     * @param {nodeCode} nodeCode
     * @param {RTSitem} actualUnit
     * @returns {unitPresenceObject}
     */
    this.isBuildingAtCode = function(nodeCode,actualUnit){

        /*
         * Errors :
         * 0 = Wall, water, tree, etc ...
         * 1 = Other team unit
         * 2 = Friendly unit
         * 3 = Building
         * ...
         */
    	
        var buildingFound = {building: null, error: 0};
    	        
        $.each(map.getMotor().buildings.list,function(k,building){
            var buildingFootprint = building.getFootprintNodeCode();

            if(buildingFootprint.indexOf(nodeCode) !== -1){
                buildingFound.building = building;
                if(actualUnit.team.getId() == building.team.getId()){
                    buildingFound.error = 2;
                }else{
                    buildingFound.error = 1;
                }
                return false;
            }
        });
        return buildingFound;
    };

    /**
     * Generate random walls on the map 
     * @deprecated
     */
    this.generateWalls = function(){
        this.walls = [];
        // generate some Walls
        var max = 20;
        for (var i=0; i < max; i++) {
            var code = Math.floor(Math.random()*this.height*this.width);

            var direction = Math.random() > 0.5 ? 1 : this.width;
            for (var j=0; j < 4; j++) {
                  this.walls.push(code+(direction*j));
            }

        }
    };

    /**
     * Draw the walls on the map 
     */
    this.drawWalls = function(){
        $('.walls').html('');
        $.each( map.walls ,function(k,code){
            node = map.getRts().UTILS.getPositionByCode(code);
            var div = $('<div class="wall"></div>');
            $('.walls').append(div);
            map.positionElement(div, node, map.getRts().grid);
        });
    };

    /**
     * Draw an element of the map on it 
     * TODO : Fine a better centralize function 
     * @param {dom} elem
     * @param {posObject} position
     * @param {number} pointSize // obsolete ???
     */
    this.positionElement = function(elem,position,pointSize){

        var RTS = this.getRts();
        var UTILS = this.getRts().UTILS;

        var relPos = UTILS.nodePosToRelPos(position,RTS.isoSize);
        var absPos = UTILS.relToAbs(relPos,this.nodeZero);

        elem.css({
            top: absPos.y - RTS.isoSize.y/2,
            left: absPos.x - RTS.isoSize.x/2
        });

//        var offset = this.getRts().offset;
//        var grid = this.getRts().grid;
//
//        if(pointSize==undefined) var pointSize = grid;
//
//        elem.css({
//            position: 'absolute',
//            left: (offset + (grid/2) - (pointSize/2) + (position.x-1)*grid)+"px",
//            top: (offset + (grid/2) - (pointSize/2) + (position.y-1)*grid)+"px"
//        });
    };

    /**
     * Show a bright square at a given nodeCode briefly
     */
    this.drawNodeHelp = function(nodeCode,color){
    	if(color == undefined) color = '';
    	
        $('.closeList .helper-'+nodeCode).remove();

        var div = $('<div class="node helper-'+nodeCode+' pathNode'+color+'"></div>');
        $('.closeList').append(div);
        map.positionElement(div,RTS.UTILS.getPositionByCode(nodeCode),RTS.grid);
        div.fadeOut(2500,function(){ div.remove(); });
    };

    // Launch the map initialization when map is instantiate 
    this.init(size);
};

OBJECTS.map.prototype = new OBJECTS.baseObject();

