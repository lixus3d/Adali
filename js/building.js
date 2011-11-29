/**
 * Building object 
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {OBJECTS.team} team
 * @param {String} buildingType
 * @param {Object} options
 * @returns {OBJECTS.building}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.building = function(x,y,team,buildingType,options) {

    this.toString = function(){return 'buildingObject';}; // String translation of the object

    var building = this; // Useful to avoid error in this scope

    this.implement = 'itemInterface';  // INTERFACE


    this.type = 'building';
    this.itemType = '';
    this.unitSize = 128;
    this.centerOffset = this.unitSize/-2;
    this.yOffset = -14; // 4 nodeCode building usually must be offset this way
    this.zIndexOffset = 0;
    
    /*
     * Path
     */
    this.lastDestination = null;
    this.destination = null;
    this.path = null;
    this.waypoint = null;

    this.wait = {
        time: 0,
        retry: 0
    };
    this.waitPathfinder = {
        time: 0,
        retry: 0
    };

    /*
     * building configuration;
     */
    this.vars = {
		sType: 'building',
		type: 'helipad',
		price: 2000,		
        life: 1500,
		powerDrain: 100,
		powerProduce: 300,        
        turnRatio: 0, // don't used for now
        speed: 0, // moving speed
        sight: 5, // view up to x nodes
        imageClass: '',//css class to use
        turret: false,
        weapon: [],
        requiredType: [],
        footprint: [],
        popOffset: {x: 0, y: 0}, // the position where unit will popup when created by this building 
    };

    this.weapons = [];
  	this.weaponsTypeFire = [];

    /*
     * Methods
     */
    /**
     * Init a building object 
     * @param {Number} x
     * @param {Number} y
     * @param {OBJECTS.team} team
     * @param {String} buildingType
     * @param {Object} options
     */
//    this.init = function(x,y,team,buildingType,options){
//    	this.itemType = buildingType;
//        if( buildingOptions = this.getRules().building[buildingType]){
//            this.vars = $.extend(this.vars,buildingOptions);
//        }
//        this.setPosition(x,y);
//        this.team = team;
//        this.vars = $.extend(this.vars,options);
//        this.life = this.vars.life;
//        this.initWeapon();        
//    };

    /**
     * Activate the building : draw and control 
     */
    this.activate = function(){
        this.draw();
        this.activateControl();

        if(nodeCodes = this.getFootprintNodeCode()){
            for(var key in nodeCodes){
                this.getMap().drawNodeHelp(nodeCodes[key]);
            }
        }
        this.getMotor().sounds.play('place');
        this.initPower(); // Drain or product so
        this.initConstruction(); // init construction possibility
    };

    /**
     * Init the power drain and/or production of the building
     */
	this.initPower = function(){
		if(window.RTS){ // to avoid testing problem
			if(this.vars.powerProduce)
				building.getMotor().ressources.addPower(this.vars.powerProduce);
			if(this.vars.powerDrain)
				building.getMotor().ressources.addConsumption(this.vars.powerDrain);
		}		
	};
	
	/**
	 * Reset the power drain and/or production of the building 
	 */
	this.resetPower = function(){
		if(this.vars.powerProduce)
			building.getMotor().ressources.addPower(-this.vars.powerProduce);
		if(this.vars.powerDrain)
			building.getMotor().ressources.addConsumption(-this.vars.powerDrain);
	};

	/**
	 * Init the construction possibility of the building 
	 */
	this.initConstruction = function(){

	};

	/**
	 * Reset the construction possibility of the building  
	 */
	this.resetConstruction = function(){
		
	};

	this.postSelect = function(){
		if(this.waypoint){
			this.showWaypoint();
		}
	};

    /**
     * Return the footprint of the building (nodeCode occuped by the building
     * @returns {Array} nodeCodes
     */
    this.getFootprintNodeCode = function(){

        var UTILS = this.getRts().UTILS;

        var code = this.getNodeCode();

        var nodeCodes = [code];

        for(var key in this.vars.footprint){
            var nodeVector = this.vars.footprint[key];
            nodeCodes.push(UTILS.getNodeCodeRel(code,nodeVector));
        }
        return nodeCodes;
    };

    /**
     * Kill the building 
     */
    this.kill = function(passive){
    	
    	if(passive == undefined) passive = false;
    	
        if(this.inLife){
            this.life = 0;
            this.inLife = false;
            this.resetPower();
            this.resetConstruction();
            if(this.dom) this.dom.remove();
            //this.dom.html('KILL');
            if(!passive){
            	this.getMotor().sounds.play('explosion');
        	}
        }
        this.getMotor().buildings.killBuilding(this.getId());
    };


    /**
     * Create the dom for the building 
     */
    this.makeDom = function(){
        if(this.vars.turret){
            this.dom = $('<div id="building-'+this.id+'" class="building '+this.vars.imageClass+'"><div class="selectZone"><div class="lifeJauge"></div></div><div class="graphic bottomright"><div class="turret default"></div></div></div>');
            this.turretDom = this.dom.find('.turret');
        }else{
            this.dom = $('<div id="building-'+this.id+'" class="building '+this.vars.imageClass+'"><div class="selectZone"><div class="lifeJauge"></div></div><div class="graphic bottomright"></div></div>');
        }
        $('.units').append(this.dom);
        this.graphicDom = this.dom.find('.graphic');
        this.selectDom = this.dom.find('.selectZone');
    };

    /**
     * Activate building control 
     */
    this.activateControl = function(){

        if(building.team.vars.player){
            building.selectDom.click(function(){
            	if(building.isSelected()){
            		building.getMotor().buildings.setPrimary(building);
            		building.getMotor().say('I\'m now the primary building');
            	}else{
            		building.getMotor().selection.addSelection(building);
            	}
                return false;
            });
        }else{
            building.dom.hover(function(){
                if(building.getMotor().selection.getSize()){
                    building.dom.addClass('attackCursor');
                }
            },function(){
                building.dom.removeClass('attackCursor');
            }).click(function(event){
                if(building.getMotor().selection.getSize()){
                    building.getMotor().actionSelection(event, {
                        type: 'attack',
                        target: building
                    });
                    return false;
                }
            });
        }
    };

    /**
     * Perform action on the actual building
     * @param {action} action
     * @param {Number} indexInSelection 
     */
    this.doAction = function(action,indexInSelection){

        //var UTILS = this.getRts().UTILS;

        switch(action.type){
            default:
            case 'default':
            case 'waypoint':
            case 'moveTo':
                waypoint = this.getMotor().convertToNodePosition(action.position);
                this.waypoint = new nodeObject(waypoint.x, waypoint.y);
                this.getMotor().say('Waypoint defined !');
                this.showWaypoint();
                break;
            case 'attack':
                if(this.inSight(action.target.getPosition())){
                    this.target = action.target;
                    this.stopMove();
                    this.attack(this.target);
                } // building can't move so ...
                break;
        }

    };

    /**
     * Does a building can move ? maybe ...
     */
    this.moveTo = function(position,mode,options){

        this.lastDestination = null; // there is no more last destination

        if(mode==undefined) mode = 'move'; // we can set to 'attack', which make the destination itself walkable during the calculation

        if(options == undefined) options = {};


        startPosition = this.getMotor().convertToNodePosition(this);
        var start = new nodeObject(startPosition.x, startPosition.y);

        if(!(position instanceof nodeObject)){
            endPosition = this.getMotor().convertToNodePosition(position);
            end = new nodeObject(endPosition.x, endPosition.y);
        }else{
            end = position;
        }

        var pathfinder = new OBJECTS.pathfinder(start,end,this,this.getMap(),options);

        var calculateReturn = pathfinder.calculate();

        if(calculateReturn == 1){ // path calculate sucessfully


            this.waitPathfinder.time = 0;
            this.waitPathfinder.retry = 0;

            this.destination = pathfinder.end;
            this.path = pathfinder.path;
//            this.path.delFirst(); // First is the actual position;

        }else if(calculateReturn == -1 && pathfinder.blockedByFriendlybuilding.length){ // blocked by friendly building
            log('can\'t go, friend block !');
            this.destination = end;
            this.waitPathfinder.time = 30 + (Math.random()*50);
            this.waitPathfinder.retry++;
        }else{ // can't reach because of wall or island
            this.destination = null;
            this.getMotor().say('I can\t go to the destination !',building);
        }
    };

    /**
     * Perform building tick 
     */
    this.tick = function(){

        this.move();

        if(this.destination && !this.path){ // If we haven't found destination path , try to find one
            if(this.waitPathfinder.time>=1){
                this.waitPathfinder.time--;
            }else{
                if(this.waitPathfinder.retry < 10){
                    this.moveTo(this.destination);
                }else{
                    this.destination = null;
                    this.waitPathfinder.time = 0;
                    this.waitPathfinder.retry = 0;
                    this.getMotor().say('I can\t go to the destination !',building);
                }
            }
        }
        if(this.target && this.inSight(this.target.getPosition())){
            this.stopMove();
            this.attack(this.target);
        }else if( (this.vars.turret || !this.destination) && (enemy = this.enemyInSight()) ){
            this.attack(enemy);
        }
    };

    /**
     * Move the building ... ??
     */
    this.move = function(){
        if(this.destination && this.path){

            if(this.wait.time >= 1){
                this.wait.time--;
                return true;
            }

            if(this.path.getSize() == 0){
                return this.stopMove('I\'ve reach my destination !!!');
            }

            var destinationNodeCode = this.path.getFirst();

            //            if(map.isWalkable(destinationNodeCode,building).value == 0){ // if the nextNode is no more walkable
            //                if(!this.wait.time && this.wait.retry < 5){
            //                    this.wait.time = 20 + Math.floor((Math.random()*10));
            //                    this.wait.retry++;
            //                    return true;
            //                }else{
            //                    if(this.path.getSize() > 3){ // there is other nodes
            //                        // get the first walkable next node
            //                        var rP = this.path.recalculatePartially(this);
            //                        if( rP == 1){
            //                            this.wait.time = 0;
            //                            this.wait.retry = 0;
            //                            return true;
            //                        }else if(rP == 0){
            //                                this.wait.time = 0;
            //                                this.wait.retry = 0;
            //                              return true;
            ////                            return this.stopMove('Destination no more Reachable, I\'ve reach the farrest point !!!');
            //                        }else{
            //                            return this.stopMove('Destination no more Reachable, I\'ve reach my farrest point !!!');
            //                        }
            //                    }else{ // this is the last node , so stop here
            //                        return this.stopMove('Destination no more Walkable, I\'ve reach the nearest point !!!');
            //                    }
            //                }
            //            }
            var isWalkable = this.getMap().isWalkable(destinationNodeCode,building);

            if( isWalkable.value == 0){
                if(isWalkable.error == 2){
                    var friendbuilding = isWalkable.infos.building;
                    if(friendbuilding.getNodeCode() == this.getNodeCode()){
                        // bug two building at the same place , the smallest id move the other one wait
                        if(this.getId() > friendbuilding.getId()){
                            this.wait.time = 30 + Math.floor((Math.random()*10));
                            return true;
                        }
                    }else if(friendbuilding.destination && friendbuilding.destination.getCode() == this.destination.getCode()){
                        // we go to the same destination... i will waiting that you move your ass
                        this.wait.time = 2 + Math.floor((Math.random()*10));
                        return true;
                    }else if( friendbuilding.lastDestination && friendbuilding.lastDestination.getCode() == this.destination.getCode()){
                        // you seems to be arrived to the same destination as me ...
                        if(this.path.getSize() > 2){ // but i'm "far" no ?
                            // can i get a new path to the destination
                            var rp = this.path.recalculatePartially(this);
                            if(rp == 1){ // we get a new path, good !
                                return true;
                            }else if(rp == 0) { // we can't get a new path but the problem may change
                                // try to reverse pathfinding logic
                                this.path.reversePathfinding = true;
                                this.wait.time = 10 + Math.floor((Math.random()*20));
                                return true;
                            }else {
                                return this.stopMove('Friend behind @ the destination, i\'m FAR but can\'t do better so i stop too !');
                            }
                        }else{ // ok i'm near my destination too i stop
                            return this.stopMove('Friend behind @ the destination, i\'m near too so i stop !');
                        }
                    }else {
                        // friendly building stopped @ a different destination or moving to a different destination
                        if(friendbuilding.destination){
                            // Friendly building moving too , so i will wait that you move your ass
                            // i will waiting that you move your ass
                            this.wait.time = 2 + Math.floor((Math.random()*10));
                            return true;
                        }else{
                            // you are not moving
                            if(this.path.getSize() > 2){ // but i'm "far" from my destination no ?
                                // can i get a new path to the destination
                                var rp = this.path.recalculatePartially(this);
                                if(rp == 1){
                                    return true;
                                }else if(rp == 0) { // we can't get a new path but the problem may change
                                    // try to reverse pathfinding logic
                                    this.path.reversePathfinding = true;
                                    this.wait.time = 10 + Math.floor((Math.random()*20));
                                    return true;
                                }else{
                                    // tell the friend to move so i can reach my destination
                                    return this.stopMove('Friend behind @ different destination, i\'m FAR but can\'t calculate a better path');
                                }
                            }else{ // ok i'm near my destination too i stop
                                return this.stopMove('Friend behind @ different destination, but i\'m near mine too so i stop !');
                            }
                        }
                    }
                }else if(isWalkable.error == 1){
                    this.getMotor().say('Enemy on my path i kill him before !!!');
                    this.wait.time = 50 + Math.floor((Math.random()*50));
                    return true;
                }else{
                    return this.stopMove('I\'m stuck !');
                }
            }

            var nextPosition = this.getMotor().convertToRealPosition(this.getRts().UTILS.getPositionByCode(destinationNodeCode));

            var direction = [0,0,'right'];

            var delta = 3;

            if(Math.abs(this.x - nextPosition.x) <= delta) direction[0] = 0;
            else if(this.x > nextPosition.x) direction[0] = -1;
            else direction[0] = 1;

            if(Math.abs(this.y - nextPosition.y) <= delta) direction[1] = 0;
            else if(this.y > nextPosition.y) direction[1] = -1;
            else direction[1] = 1;

            direction[2] = this.getRts().UTILS.getOrientation(direction);

            if(direction[0] == 0 && direction[1] == 0){ // we have reach the point
                this.path.delFirst();
                this.move();
                return true;
            }else{
                this.setDirection(direction); // body orientation
                this.setTurretDirection(this.getRts().UTILS.getDirectionByPosition(this,this.getMotor().convertToRealPosition(this.getRts().UTILS.getPositionByCode(this.path.getLast()))));

                var speed = this.vars.speed / 65;

                if(direction[0] != 0 && direction[1] != 0) speed *= 0.7; // les diagonales vont un peu moins vite

                this.x += direction[0]*speed;
                this.y += direction[1]*speed;

                this.draw();
            }

        }
    };

    /**
     * Stop the building from moving ...
     */
    this.stopMove = function(text){
        this.wait.time = 0;
        this.wait.retry = 0;
        this.lastDestination = this.destination;
        this.destination = null;
        this.path = null;
        this.setDirection([0,0,'default']);
        if(text){
            this.getMotor().say(text);
            };
        return true;
    };

    this.showWaypoint = function(){
    	//log(this.waypoint);
    	this.getMap().drawNodeHelp(this.waypoint.getCode(),'blue');
    };

    // Init the building when instantiate
    this.init(x,y,team,buildingType,options);

};

/*
 * building extends itemAbstract
 */
OBJECTS.building.prototype = new ABSTRACTS.itemAbstract();