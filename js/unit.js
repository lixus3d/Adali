/**
 * Unit object 
 * @param {Number} x
 * @param {Number} y
 * @param {OBJECTS.team} team
 * @param {String} unitType
 * @param {Object} options
 * @returns {OBJECTS.unit}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.unit = function(x,y,team,unitType,options) {

    this.toString = function(){return 'unitObject';}; // String translation of the object

    var unit = this; // Useful to avoid error in this scope

    this.implement = 'itemInterface';  // INTERFACE


    this.type = 'unit';
    this.itemType = '';

    /*
     * Path
     */
    this.lastDestination = null;
    this.destination = null;
    this.path = null;

    this.wait = {
        time: 0,
        retry: 0
    };
    this.waitPathfinder = {
        time: 0,
        retry: 0
    };
    

    /*
     * Unit configuration;
     */
    this.vars = {
    	sType: 'vehicule',
    	price: 3000,
        life: 500,
        turnRatio: 0.5, // don't used for now
        speed: 1, // moving speed
        sight: 4, // view up to x nodes
        imageClass: '',//css class to use
    	movement: 'tank',
        turret: false,
        rotor: false,
        weapon: [],
        requiredType: [],
        deploy: '',
        constructionSite: 'factory'
    };

  this.weapons = [];
  this.weaponsTypeFire = [];

    
    /**
     * Activate the unit : draw and control 
     */
    this.activate = function(){
        this.draw();
        this.activateControl();
        this.getMap().drawNodeHelp(this.getNodeCode());
//        log(this.getPosition());
//        log(this.getRts().UTILS.absToRel(this.getPosition(),this.getMap().nodeZero));
//        log(this.getRts().UTILS.relPosToNodePos(this.getRts().UTILS.absToRel(this.getPosition(),this.getMap().nodeZero),this.getRts().isoSize));
    };

    /**
     * Kill the unit
     * @param {Boolean} passive Weither to play sound or not  
     */
    this.kill = function(passive){
    	
    	if(passive == undefined) passive = false;
    	
        if(this.inLife){
            this.life = 0;
            this.inLife = false;
            this.dom.remove();
            //this.dom.html('KILL');
            if(!passive){
            	this.getMotor().sounds.play('explosion');
        	}
        }
        this.getMotor().units.killUnit(this.getId());
    };

    /**
     * Create the dom for a unit 
     */
    this.makeDom = function(){
    	
        if(this.vars.turret){
            this.dom = $('<div id="unit-'+this.id+'" class="unit '+this.vars.imageClass+'"><div class="selectZone"><div class="lifeJauge"></div></div><div class="graphic default"><div class="turret default"></div></div></div>');
            this.turretDom = this.dom.find('.turret');
        }else{
            this.dom = $('<div id="unit-'+this.id+'" class="unit '+this.vars.imageClass+'"><div class="selectZone"><div class="lifeJauge"></div></div><div class="graphic default"></div></div>');
        }
        
        if(this.vars.rotor){
        	this.dom.find('.graphic.default').append('<div class="rotor subItem default"></div>');
        	
        	this.rotorDom = this.dom.find('.rotor');
        }
        
        if(this.yOffset != 0){
        	this.dom.find('.graphic.default').append('<div class="shadow subItem default" style="top:' + -unit.yOffset + 'px"></div>');
        }
        
        $('.units').append(this.dom);
        this.graphicDom = this.dom.find('.graphic');
        this.selectDom = this.dom.find('.selectZone');
    };

    /**
     * Activate the control of a unit 
     */
    this.activateControl = function(){

    	// Player unit are selectable 
        if(unit.team.vars.player){
            unit.selectDom.click(function(){
            	if(unit.isSelected()){
            		if(unit.vars.deploy){
            			unit.deploy();
            			return false;
            		}
            	}
            	unit.getMotor().selection.addSelection(unit);           	
                return false;
            });
        }else{
        	// Enemy units are attackable 
            unit.dom.hover(function(){
                if(unit.getMotor().selection.getSize()){
                    unit.dom.addClass('attackCursor');
                }
            },function(){
                unit.dom.removeClass('attackCursor');
            }).click(function(event){
                if(unit.getMotor().selection.getSize()){
                    unit.getMotor().actionSelection(event, {
                        type: 'attack',
                        target: unit
                    });
                    return false;
                }
            });
        }
    };

    /**
     * Make the unit perform an action
     * @param {actionObject} action
     * @param {Number} indexInSelection
     */
    this.doAction = function(action,indexInSelection){
        switch(action.type){
            default:
            case 'default':
            case 'moveTo':
                this.target = null;
                if(action.selectionSize > 1){
                    options = {
                        spreadEnd: true,
                        spreadAmount: action.selectionSize,
                        spreadIndex: indexInSelection
                    };

                    this.moveTo(action.position,'moveWithOther',options);
                }else{
                    this.moveTo(action.position);
                }
                break;
            case 'attack':
                this.target = action.target;
                if(this.inSight(action.target.getPosition())){
                    this.stopMove();
                    this.attack(this.target);
                }else{
                    this.moveTo(action.target.getPosition());
                }
                break;
        }
    };

    /**
     * Tell the unit to go to a particular position
     * @param {posObject} position
     * @param {String} mode Either "move" or "attack" 
     * @param {Object} options
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
//            pathfinder.showPath(this);
//            log(this.path.list);
//            this.path.delFirst(); // First is the actual position;

        }else if(calculateReturn == -1 && pathfinder.blockedByFriendlyUnit.length){ // blocked by friendly unit
            log('can\'t go, friend block !');
            this.destination = end;
            this.waitPathfinder.time = 30 + (Math.random()*50);
            this.waitPathfinder.retry++;
        }else{ // can't reach because of wall or island
            this.destination = null;
            this.getMotor().say('I can\t go to the destination !',unit);
        }
    };

    /**
     * Execute it every motor tick, move the unit and watch for enemy insight 
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
                    this.getMotor().say('I can\t go to the destination !',unit);
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
     * Move the unit on the map, if the unit has a path and a destination 
     */
    this.move = function(){

        var RTS = this.getRts();
        var UTILS = RTS.UTILS;

        if(this.destination && this.path){

            if(this.wait.time >= 1){
                this.wait.time--;
                return true;
            }

            if(this.path.getSize() == 0){
                return this.stopMove('I\'ve reach my destination !!!');
            }

            var destinationNodeCode = this.path.getFirst();

            //            if(map.isWalkable(destinationNodeCode,unit).value == 0){ // if the nextNode is no more walkable
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
            var isWalkable = this.getMap().isWalkable(destinationNodeCode,unit);

            if( isWalkable.value == 0){
                if(isWalkable.error == 2){
                    var friendUnit = isWalkable.infos.unit;
                    if(friendUnit.getNodeCode() == this.getNodeCode()){
                        // bug two unit at the same place , the smallest id move the other one wait
                        if(this.getId() > friendUnit.getId()){
                            this.wait.time = 30 + Math.floor((Math.random()*10));
                            return true;
                        }
                    }else if(friendUnit.destination && friendUnit.destination.getCode() == this.destination.getCode()){
                        // we go to the same destination... i will waiting that you move your ass
                        this.wait.time = 2 + Math.floor((Math.random()*10));
                        return true;
                    }else if( friendUnit.lastDestination && friendUnit.lastDestination.getCode() == this.destination.getCode()){
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
                        // friendly unit stopped @ a different destination or moving to a different destination
                        if(friendUnit.destination){
                            // Friendly unit moving too , so i will wait that you move your ass
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

            var nextPosition = this.getMotor().convertToRealPosition(UTILS.getPositionByCode(destinationNodeCode));

            var direction = [0,0,'right'];

            var delta = 3;

            if(Math.abs(this.x - nextPosition.x) <= delta) direction[0] = 0;
            else if(this.x > nextPosition.x) direction[0] = -1;
            else direction[0] = 1;

            if(Math.abs(this.y - nextPosition.y) <= delta) direction[1] = 0;
            else if(this.y > nextPosition.y) direction[1] = -1;
            else direction[1] = 1;

            direction[2] = UTILS.getOrientation(direction);

            if(direction[0] == 0 && direction[1] == 0){ // we have reach the point
                this.path.delFirst();
                this.move();
                return true;
            }else{
                this.setDirection(direction); // body orientation
                this.setTurretDirection(UTILS.getDirectionByPosition(this,this.getMotor().convertToRealPosition(UTILS.getPositionByCode(this.path.getLast()))));

                var speed = this.vars.speed / RTS.speedDivide ;

                if(direction[0] != 0 && direction[1] != 0) speed *= 0.75; // les diagonales vont un peu moins vite

                this.x += direction[0]*speed;
                this.y += direction[1]*speed*RTS.isoRatio;

                this.draw();
            }

        }
    };

    /**
     * Stop the movement of the unit 
     * @returns {Boolean}
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


    
    /**
     * Deploy the unit into the structure carried
     */
    this.deploy = function(){
    	// check if deployement is possible for this unit 
    	if(this.vars.deploy){
    		
    		// get the structure footprint
    		var structure = this.getStructure();
    		var absPositionCentered = unit.getMotor().convertToRealPosition(unit.getMotor().convertToNodePosition({x:unit.x,y:unit.y}));
    		structure.x = absPositionCentered.x;
    		structure.y = absPositionCentered.y;
    		
    		var footprint = structure.getFootprintNodeCode();
    		
    		var ok = true;
    		$.each(footprint,function(k,nodeCode){
    			if(unit.getMap().isWalkable(nodeCode, unit).value == 0){
    				//unit.getMotor().say(nodeCode+' not walkable', unit);
    				return  ok= false;
    			}
    		});
    		
    		if(ok){
    			unit.getMotor().buildings.addBuilding(structure);
    			unit.kill(true); // passive , no sound , no score , etc . 
    			//this.getMotor().sounds.play('place');
    			return true;
    		}else{
    			this.getMotor().say('Can\'t deploy here !', this);	
    			structure.kill(true);
    		}	
    	}    	
    	return false;
    };
    
    this.getStructure = function(){
    	
    	if(this.deployStructure == undefined){
    		this.deployStructure = new OBJECTS.building(unit.x,unit.y,unit.team,this.vars.deploy); 
    	}
    	return this.deployStructure;    	
    };


    // Init the unit when instantiate
    this.init(x,y,team,unitType,options);

};

/*
 * unit extends itemAbstract
 */
OBJECTS.unit.prototype = new ABSTRACTS.itemAbstract();