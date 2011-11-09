
OBJECTS.motor = function(map){

    var motor = this;

    this.units = new OBJECTS.units();
    this.buildings = new OBJECTS.buildings();
    this.teams = new OBJECTS.teams();
    this.sounds = new OBJECTS.sounds();

    this.unitQueue = new OBJECTS.buildQueue();
    this.buildingQueue = new OBJECTS.buildQueue();

    this.selection = new OBJECTS.selection();
    this.ressources = new OBJECTS.ressources();
    this.menu = new OBJECTS.menu();

    this.selector = {
        activ: false,
        start: {},
        end: {},
        dom: $('.selector')
    }

    this.init = function(map){
        this.map = map;
        this.activateControl();
    };

    this.activateControl = function(){

        $('body')[0].oncontextmenu = function() {
            return false;
        }

        $('body').click(function(event){
            if(motor.selection.getSize()){
                motor.actionSelection(event);
            }
        })
        .mousedown(function(event){
            if(event.button == 0){
                motor.selector.current = true;
                motor.selector.start.x = event.pageX;
                motor.selector.start.y = event.pageY;
            }else if(event.button==2){
                motor.unselectAll();
            }
            return false;
        })

        .mouseup(function(event){

            motor.selector.current = false;
            if(motor.selector.activ){
                motor.selector.dom.css({display: 'none'});
                if( !motor.selection.addSelection(motor.units.searchInSelector(motor.selector)) ){
                    motor.selection.addSelection(motor.buildings.searchInSelector(motor.selector))
                }
            }
            motor.selector.activ = false;

        })

        .mousemove(function(event){

            if(motor.selector.activ || motor.selector.current){

                 motor.selector.end.x = event.pageX;
                 motor.selector.end.y = event.pageY;

                 var delta = (motor.getRts().grid/2);
                 if( motor.selector.activ || (Math.abs(motor.selector.start.x - motor.selector.end.x) >= delta) || (Math.abs(motor.selector.start.y - motor.selector.end.y)>=delta)){
                     motor.selector.activ = true;
                     motor.selector.dom.css({
                         display: 'block',
                         left: (motor.selector.start.x < motor.selector.end.x ? motor.selector.start.x : motor.selector.end.x),
                         top: (motor.selector.start.y < motor.selector.end.y ? motor.selector.start.y : motor.selector.end.y),
                         width: Math.abs(motor.selector.start.x - motor.selector.end.x),
                         height: Math.abs(motor.selector.start.y - motor.selector.end.y)
                     });
                 }
            }
        });
    }

    this.unselectAll = function(){
        motor.selection.resetSelection();
    }

    this.actionSelection = function(event,options){

        var action = {
            position: {
                x: null,
                y: null
            },
            type: 'default'
        }

        var offset = this.getRts().offset;

        action.position = {x: event.pageX - offset, y: event.pageY - offset};
        action = $.extend(action,options);

        this.selection.doAction(action);

    }

    this.sortKillingList = function(a,b){
        if(a.life < b.life){
            return -1;
        }else if(a.life == b.life) return 0;
        else return 1;
    }

    // convert unit position to node position
    this.convertToNodePosition = function(position){

        var RTS = this.getRts();
        var UTILS = RTS.UTILS ;

        // position must be translate to relative position to the nodeZero
        var relPos = UTILS.absToRel(position,this.getMap().nodeZero);
        return UTILS.relPosToNodePos(relPos, RTS.isoSize);

//        var newPos = {x: null, y: null};
//        var grid = this.getRts().grid;
//        newPos.x = Math.ceil(position.x / grid);
//        newPos.y = Math.ceil(position.y / grid);
//        return newPos;
    }

    this.convertToRealPosition = function(position){

        var RTS = this.getRts();
        var UTILS = RTS.UTILS ;

        var relPos = UTILS.nodePosToRelPos(position, RTS.isoSize)
        return UTILS.relToAbs(relPos,this.getMap().nodeZero);

//        var newPos = {x: null, y: null};
//        var grid = this.getRts().grid;
//        newPos.x = (position.x * grid) - (grid/2);
//        newPos.y = (position.y * grid) - (grid/2);
//        return newPos;
    }

    this.tick = function(){
        motor.units.tick();
        motor.unitQueue.tick();
	motor.menu.tick();
    };

    this.start = function(){
        if(this.ticker) this.stop();
        log('Starting Motor');
        motor.ticker = window.setInterval(motor.tick,this.getRts().tickTime);
    };

    this.stop = function(){
        log('Stopping Motor');
        window.clearInterval(motor.ticker);
    };

    this.say = function(text,element){
//        return true;
        var div = $('<div class="message">'+text+'</div>');
        $('.messages').append(div);
        div.fadeOut(1500,function(){
            div.remove();
        });
    };

    this.init(map);
}

OBJECTS.motor.prototype = new OBJECTS.baseObject();

OBJECTS.baseObject.prototype.getMotor = function(){
    return this.getRts().motor;
}


