
/**
 * Some common function and properties for all item 
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */

ABSTRACTS.itemAbstract = function(){
    
    /*
     * Default variables
     */
    this.id = 0; // unit "number" in the RTS 
    this.x = 0;
    this.y = 0;    
    this.unitSize = 64; 
    this.centerOffset = this.unitSize/-2;
    this.team = null;
    this.selected = false;
    
    /*
     * Life  
     */   
    this.inLife = true;
    this.life = 500;
    
     
    /*
     * Graphics orientation
     */
    this.orientation = 'default';
    this.lastOrientation = 'default';
    
    this.turretOrientation = 'default';
    this.lastTurretOrientation = 'default';
    
    /*
     * Jquery graphics 
     */
    this.dom = null;
    this.jaugeDom = null;
    this.selectDom = null;
    
    this.graphicDom = null;
    this.turretDom = null;
    this.rotorDom = null;
 
    /*
     * Attack
     */
    this.target = null;
    this.weapons = [];
    
    /*
     * Methods
     */
    
    this.setId = function(id){
        this.id = id;        
    };
    
    this.getId = function(){
        return this.id;
    };
       
    this.setPosition = function(x,y){
        this.x = x;
        this.y = y;
    };
    
    this.getPosition = function(){
        return {
            x: this.x, 
            y: this.y
            };
    };
    
    /**
     * Initialize item weapons from the item vars
     */
    this.initWeapon = function(){
        var item = this;
        $.each(item.vars.weapon,function(k,weaponType){
            item.addWeapon(new OBJECTS.weapon(weaponType,{},item));
        });
    };
    
    /**
     * Add a weapon to the item weapons
     */
    this.addWeapon = function(weapon){
        this.weapons.push(weapon);
    };

    
    this.draw = function(){
        if(!this.dom) this.makeDom();
        
        var item = this;
        
        this.dom.css({
            left: (this.x - item.unitSize/2),
            top: (this.y - item.unitSize/1.8)
        });      
        this.graphicDom.css({
           zIndex: 1000 + this.y 
        });
        
    };
    
    this.updateJauge = function(){
        if(!this.dom) this.makeDom();        
        if(!this.jaugeDom) this.jaugeDom = this.dom.find('.lifeJauge');
        
        var jaugeRatio = this.life / this.vars.life;
        
        var color = {
            red: 0,
            green: 255,
            blue: 0
        };        
        
        if(jaugeRatio > 0.4){
            color.red = Math.floor(255 * (0.4/jaugeRatio));
        }else{
            color.red = 255;
            color.green = Math.floor(255 * (jaugeRatio/0.4));
        }
        
        this.jaugeDom.css({
           width: Math.floor( jaugeRatio * this.unitSize),
           backgroundColor: 'rgb('+color.red+', '+color.green+', '+color.blue+')'
        });        
    };
    
        
    this.select = function(){
    	this.selected = true;
        this.dom.addClass('selected');     
        if(this.postSelect) this.postSelect();
    };
    
    this.unselect = function(){
    	this.selected = false;
        this.dom.removeClass('selected');
        if(this.postUnselect) this.postUnselect();
    };
    
    this.isSelected = function(){
    	return this.selected;
    };
    
    this.getNodeCode = function(){
        var positionOnGrid = {
            x: this.x, 
            y: this.y
        };
        return this.getRts().UTILS.getPointCode(this.getMotor().convertToNodePosition(positionOnGrid));
    };
    
    /**
     * Fire every weapons at a target
     * @param {RTSitem} target 
     */    
    this.fire = function(target){
        
        var item = this;
        
        $.each(item.weapons,function(k,weapon){
            if( item.weaponsTypeFire[weapon.type] && item.weaponsTypeFire[weapon.type].time ){
                // one weapon of the same type have already fired 
                if(item.weaponsTypeFire[weapon.type].time-- < 0){
                    item.weaponsTypeFire[weapon.type] = {};
                }
            }else{
                if(weapon.fire(target)){
                    item.weaponsTypeFire[weapon.type] = {index: k, time: (weapon.vars.reloadTime * 30)};
                }
            }
        });
    };
    
    /**
     * Triggered when the unit is touch and lose an amount of life
     * @param {number} amount
     */
    this.touch = function(amount){
        this.life -= amount;
        if(this.life <=0){
            this.kill();
        }
        this.updateJauge();
        log('item '+this.getId()+' : life '+this.life);
    };
    
    
    /**
     * Indicate whether a position is inSight or not
     * when the unit stop, the maxSight is potentially maximize ( give advantage to fix item with same weapon )
     * @param {posObject} position
     */
    this.inSight = function(position){        
        
        var maxSight = this.vars.sight * this.getRts().grid;
        
        if(this.destination == null) maxSight *= this.getRules().config.sightStaticMultiplier ;
        
        // We calculate distance between actual item position and position
        var width = position.x - this.x;
        var height = position.y - this.y;
        
        var distance = Math.sqrt( width*width + height*height);
        
        if(distance < maxSight){
            // we must check if there is no wall or building between
            
            var divider = distance / (this.getRts().grid/4);
            
            var cPosition = {
                x: 0 , 
                y: 0
            };
            var x = this.x;
            var y = this.y;
            
            for (var i = 1; i <= divider; i++) {
                // We check that the computed position is "sightable"
                x += width/divider ;
                y += height/divider ;
                cPosition.x = Math.floor(x);
                cPosition.y = Math.floor(y);
                if(!this.getMap().isSightable(this.getRts().UTILS.getPointCode(this.getMotor().convertToNodePosition(cPosition)))) return false;                
            }               
            
            return true;
        }
        
        return false;
    };
    
    /**
     * References the enemy actually inSight and returns the better for the sortKillingList function
     * @returns {Boolean|RTSitem} 
     */
    this.enemyInSight = function(){
        var inSights = [];
        
        var item = this;
        
        $.each(item.getMotor().units.list,function(k,sUnit){
            if(sUnit.team.getId() != item.team.getId()){
                if(item.inSight(sUnit.getPosition())){
                    inSights.push(sUnit);
                }
            }
        });
        
        if(inSights){
            inSights.sort(this.getMotor().sortKillingList);
            return inSights[0];
        }        
        return false;
    };
    

    this.toString = function(){return 'itemAbstract';};
};

ABSTRACTS.itemAbstract.prototype = new OBJECTS.baseObject();