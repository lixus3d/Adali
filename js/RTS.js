
/**
 * Base RTS object, contains some default configuration
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011 
 */
OBJECTS.RTS = function(){

    var RTS = this;

    RTS.offset = 0;
    RTS.grid = 40; 
    RTS.isoSize = {x:64, y:38}; // isometric size for the grid
    RTS.isoRatio = 38/64;
    RTS.mapSize = [10,10]; // pixelSize
    // TODO : make two type of ticker for the AI to be more responsive
    RTS.tickTime = 5; // The motor tick every 5 ms 
    RTS.speedDivide = 50; // Speed diviser for every moving object

    RTS.UTILS = new OBJECTS.UTILS();

};

/**
 * this is the rules object that defines rules for every item in the RTS
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
var RULES = {
		
	/**
	 * Defines RTS basic configuration
	 */
	config: {
		pathfinderUnitPenalityFriend: 40,
		pathfinderUnitPenalityEnemy: 200,
		pathfinderBuildingPenality: 250,
		
		projectileTickMultiplier: 5,
		
		sightStaticMultiplier: 1.1,
		
		startingCredits: 3000
	}
		
};

/**
 * This is the base object for all other object, it provides
 * @returns {OBJECTS.baseObject}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.baseObject = function(){
};

/**
 * Return the RTS object anywhere 
 * @returns {RTS} The RTS primary object
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.baseObject.prototype.getRts = function(){
    if(RTS){
        return RTS;
    }else throw 'RTS is not defined, but prototype.getRts() called.';
};

/**
 * Return the rules object that defines every rules of the RTS
 * @return {RULES} Every rules of the RTS
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.baseObject.prototype.getRules = function(){
    if(RULES){
        return RULES;
    }else throw 'RULES is not defined, but prototype.getRules() called.';
};

/**
 * Return the RTS map anywhere 
 * @returns {OBJECTS.map}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.baseObject.prototype.getMap = function(){
    return this.getMotor().map;
};

/**
 * Return the RTS motor anywhere 
 * @returns {OBJECTS.motor}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.baseObject.prototype.getMotor = function(){
    return this.getRts().motor;
};
