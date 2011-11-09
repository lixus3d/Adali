
OBJECTS.projectile = function(weapon,target){
    
    var projectile = this;
    
    this.ticker = null;
    this.weapon = null;
    this.target = null;
    
    this.centerOffset = -5/2;
    
    this.x = 0;
    this.y = 0;
    
    this.dom = null;
    
    this.init = function(weapon){
        this.weapon = weapon;
        this.target = target;
        this.x = weapon.parent.x;
        this.y = weapon.parent.y;
    };
            
    this.makeDom = function(){
        this.dom = $('<div class="projectile '+this.weapon.vars.imageClass+'"></div>');
        $('.projectiles').append(this.dom);
    };
    
    this.move = function(){
        
        var delta = 10;
        
        var width = this.target.x - this.x;
        var height = this.target.y - this.y ;
        
        if( (Math.abs(width) <= delta) && (Math.abs(height) <= delta) ) this.touch();
        else{
            var x = this.x;
            var y = this.y;
            
            var divider = Math.max(Math.abs(width),Math.abs(height));
            var vector = { x: width/divider, y: height/divider};
            
//            log(vector);
            
            var speed = (weapon.vars.speed / Math.sqrt(vector.x*vector.x + vector.y*vector.y)) /  (RTS.speedDivide / 5);
            
            this.x = this.x + (vector.x * speed);
            this.y = this.y + (vector.y * speed);          
                        
            return true;
        }
        return false;        
    };
    
    this.draw = function(){
        if(!this.dom) this.makeDom();
       
        var offset = this.getRts().offset;
       
        this.dom.css({
            left: (offset + projectile.centerOffset + (Math.floor(projectile.x)))+"px",
            top: (offset + projectile.centerOffset + (Math.floor(projectile.y)))+"px"
        })   
    };
    
    this.touch = function(){
        this.stop();
        this.weapon.touch(projectile.target);
    }
    
    this.tick = function(){
        if(projectile.move()){
            projectile.draw();
        }
    };
      
    this.start = function(){
        if(this.ticker) this.stop();
        this.ticker = window.setInterval(projectile.tick,this.getRts().tickTime*5);
    };
    
    this.stop = function(){
        window.clearInterval(this.ticker);
        this.dom.remove();
    };
    
    this.init(weapon,target);
    this.start();
}


OBJECTS.projectile.prototype = new OBJECTS.baseObject();