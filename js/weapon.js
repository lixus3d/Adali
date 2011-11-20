/**
 * Weapon Object that handle weapon function 
 * @param {weaponType} type
 * @param {Object} options
 * @param {RTSitem} parent
 * @returns {OBJECTS.weapon}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.weapon = function(type,options,parent){
    
    var weapon = this;
    
    this.parent = null; // parent RTSitem (unit or building most likely)
    this.type = null; // type of the weapon 
    this.reloaded = true; // ready to fire 
    this.projectile = null; // current projectile
    
    // default weapon options
    this.vars = {
        damage : 50, 
        speed: 100,
        reloadTime: 2,
        imageClass: 'shell'
    };
    
    /**
     * Init a weapon
	 * @param {weaponType} type
	 * @param {Object} options
	 * @param {RTSitem} parent
     */
    this.init = function(type,options,parent){
        this.type = type;
        this.parent = parent;
        if( weaponVars = this.getRules().weapon[type]){
            this.vars = $.extend(this.vars,weaponVars);
        }
        this.vars = $.extend(this.vars,options);
    };
    
    /**
     * Fire the weapon at a given target, return whether it fires or not  
     * @param {RTSitem} target
     * @returns {Boolean} 
     */
    this.fire = function(target){
        if(this.reloaded){
            if(!this.projectile){
                this.projectile = new OBJECTS.projectile(weapon,target);
                this.getMotor().sounds.play('fire');
                this.reload();
                return true;
            }
        }
        return false;
    };
    
    /**
     * Trigger when the projectile touch the target 
     * TODO : there is a problem if projectile touch the target after the reload time , not sure this.projectile really useful
     * @param {RTSitem} target
     */
    this.touch = function(target){ // callback by projectile
        target.touch(this.vars.damage); // trigger the touch on the target 
        this.projectile = null; // reset the projectile 
    };
    
    /**
     * Set the weapon ready to fire 
     */
    this.load = function(){
        this.reloaded = true;
    };
    
    /**
     * Launch the rearm process of the weapon 
     */
    this.reload = function(){
        this.reloaded = false;
        window.setTimeout(function(){ weapon.load(); }, weapon.vars.reloadTime * 1000 );
    };
    
    // init the weapon when instantiate
    this.init(type,options,parent);
    
};

OBJECTS.weapon.prototype = new OBJECTS.baseObject();