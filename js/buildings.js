/**
 * buildings list of the RTS 
 * @returns {OBJECTS.buildings}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */

OBJECTS.buildings = function(){
    
    var buildings = this;
    
    /**
     * Add a building to the buildings list and activate the building
     * @param {RTSitem} building 
     */    
    buildings.addBuilding = this.addItem;

    /**
     * Kill a building, update the list, update the current selection
     * @param {number} buildingId
     */
    buildings.killBuilding = this.killItem;

};

OBJECTS.buildings.prototype = new ABSTRACTS.itemListAbstract();