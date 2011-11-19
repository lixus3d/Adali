
OBJECTS.selection = function(){
    
    var selection = this;
    
    this.type = 'unit';
    this.list = [];
    
    this.getSize = function(){
        return this.list.length;
    };
    
    this.doAction = function(action){
        action.selectionSize = this.getSize();
        $.each(selection.list, function(k,element){
            element.doAction(action,k);
        });
        
        // sounds
        switch(this.type){
            case 'unit':
                switch(action.type){
                    default:
                    case 'default':
                    case 'moveTo':
                        this.getMotor().sounds.play('move');
                        //this.getMotor().sounds.play('moving');
                        break;
                    case 'attack':
                        this.getMotor().sounds.play('attack');
                        //                motor.sounds.play('moving');
                        break;
                }        
                break;
            case 'building':
                switch(action.type){
                    default:
                    case 'default':
                    case 'moveTo':
                        //                        this.getMotor().sounds.play('waypoint');
                        break;
                    case 'attack':
                        this.getMotor().sounds.play('attack');
                        break;
                }                        
                break;
        }
    };
    
    this.addSelection = function(collection){
        this.resetSelection();
        
        if( collection.length != undefined ){
            $.each(collection,function(k,element){
                selection.addToList(element);
            });
        }else{
            this.addToList(collection);
        }
        
        if(this.getSize()){
            if(this.type == 'unit'){
                this.getMotor().sounds.play('select');
            }
            return true;
        }
        return false;
    };
    
    this.addToList = function(element){
        element.select();
        this.type = element.type;
        this.list.push(element);
    };
    
    this.resetSelection = function(){
        $.each(selection.list, function(k,element){
            element.unselect();
        });
        this.list.length = 0;        
    };
    
    this.update = function(){
        $.each(selection.list, function(k,element){
            if(!element || !element.inLife) selection.list.splice(k,1);
        });
        
    };
    
};

OBJECTS.selection.prototype = new OBJECTS.baseObject();



