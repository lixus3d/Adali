/**
 * References RTS ressources
 * @returns {OBJECTS.ressources}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.ressources = function(){

    var ressources = this;

    ressources.powerProduction = 0;
    ressources.powerConsumption = 0;

    ressources.credits = ressources.getRules().config.startingCredits;

    /**
     * Add some credits
     * @param {number} quantity  
     */
    this.addCredit = function(quantity){
        this.credits += quantity;
        if(this.credits < 0) this.credits = 0;
    };

    /**
     * Add some power 
     * @param {number} quantity
     */
    this.addPower = function(quantity){
        this.powerProduction += quantity;
        if(this.powerProduction < 100) this.powerProduction = 100;
    };

    /**
     * Add power consumption
     * @param {Number} quantity
     */
    this.addConsumption = function(quantity){
        this.powerConsumption += quantity;
        if(this.powerConsumption < 0) this.powerConsumption = 0;
    };

    /**
     * Do we got enough credit for the given quantity
     * @param {number} quantity
     * @returns {Boolean}
     */
    this.hasCredit = function(quantity){
        if(quantity == undefined) quantity = 1;
        return (this.credits - quantity) >= 0;
    };

    /**
     * Do we have enough power for the actual consumption
     * @returns {Boolean}
     */
    this.hasPositivePower = function(){
        return (this.powerProduction -this.powerConsumption ) >= 0;
    };

};

OBJECTS.ressources.prototype = new OBJECTS.baseObject();