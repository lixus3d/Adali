
OBJECTS.weapon = function(type,options,parent){
    
    var weapon = this;
    
    this.parent = null;
    this.type = null;
    this.reloaded = true;
    this.projectile = null;
    
    this.vars = {
        damage : 50, 
        speed: 100,
        reloadTime: 2,
        imageClass: 'shell'
    };
    
    this.init = function(type,options,parent){
        this.type = type;
        this.parent = parent;
        if( weaponVars = this.getRules().weapon[type]){
            this.vars = $.extend(this.vars,weaponVars);
        }
        this.vars = $.extend(this.vars,options);
    }
    
    
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
    }
    
    this.touch = function(target){ // callback by projectile
        target.touch(this.vars.damage);
        this.projectile = null;
    };
    
    this.load = function(){
        this.reloaded = true;
    }
    
    this.reload = function(){
        this.reloaded = false;
        window.setTimeout(function(){ weapon.load(); }, weapon.vars.reloadTime * 1000 );
    }
    
    this.init(type,options,parent);
    
}

OBJECTS.weapon.prototype = new OBJECTS.baseObject();