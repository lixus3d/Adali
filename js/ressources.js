
OBJECTS.ressources = function(){

    var ressources = this;

    ressources.powerProduction = 300;
    ressources.powerConsumption = 100;

    ressources.credits = 3000;

    this.addCredit = function(quantity){
        this.credits += quantity;
        if(this.credits < 0) this.credits = 0;
    };

    this.addPower = function(quantity){
        this.powerProduction += quantity;
        if(this.powerProduction < 100) this.powerProduction = 100;
    };

    this.addConsumption = function(quantity){
        this.powerConsumption += quantity;
        if(this.powerConsumption < 0) this.powerConsumption = 0;
    };

    this.hasCredit = function(quantity){
        if(quantity == undefined) quantity = 1;
        return (this.credits - quantity) >= 0;
    };

    this.hasPositivePower = function(){
        return (this.powerProduction -this.powerConsumption ) >= 0;
    };

};

OBJECTS.ressources.prototype = new OBJECTS.baseObject();