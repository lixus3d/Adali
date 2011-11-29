/**
 * Placement object, convert into building on doAction
 * @returns {OBJECTS.placement}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 27 nov. 2011
 */
OBJECTS.placement = function(team,type,elementName){
	
	var placement = this;
	
	placement.type = 'placement';
	
	placement.team = null;	
	placement.itemType = 'building';
	placement.elementName = null;
	placement.structure = null;
	placement.footprint = null;
	
	this.init = function(team,type,elementName){
		this.team = team;
		this.itemType = type;
		this.elementName = elementName;
		this.structure = new OBJECTS[this.itemType](0,0,this.team,this.elementName);		
	};
	
	this.getId = function(){
		return -1;
	};
	
	this.select = function(){		
	};
	
	this.unselect = function(){		
	};
	
	this.doAction = function(action,indexInSelection){
		switch(action.type){
	        default:
	        	this.deploy(action.position);
	            break;
	        case 'drawHelper':
	        	this.drawHelper(action.position);
	        	break;
		}		
	};
	
	this.drawHelper = function(position){
		this.updatePosition(position);
		
		$('.placement').remove();
		
		$.each(placement.footprint,function(k,nodeCode){			
			
			if(placement.getMap().isWalkable(nodeCode,placement).value == 0){
				color = 'red';
			}else{
				color = '';
			}
	    	
	        $('.closeList .helper-'+nodeCode).remove();

	        var div = $('<div class="node helper-'+nodeCode+' pathNode'+color+' placement"></div>');
	        $('.closeList').append(div);
	        placement.getMap().positionElement(div,RTS.UTILS.getPositionByCode(nodeCode),RTS.grid);
		});	
	};
	
	this.updatePosition = function(position){
		//placement.structure = new OBJECTS[this.itemType](0,0,placement.team,placement.elementName);
		// convert the event position to the nearest nodeCode center
		nodePosition = placement.getMotor().convertToNodePosition(position);
		absPosition = placement.getMotor().convertToRealPosition(nodePosition,RTS.isoSize);		
		
		placement.structure.x = absPosition.x;
		placement.structure.y = absPosition.y;		
		placement.footprint = placement.structure.getFootprintNodeCode();
		//placement.structure.kill(true);
	};
	
	this.deploy = function(position){
		
		// get the structure footprint
		this.updatePosition(position);
		
		var ok = true;
		$.each(placement.footprint,function(k,nodeCode){
			if(placement.getMap().isWalkable(nodeCode,placement).value == 0){
				//unit.getMotor().say(nodeCode+' not walkable', unit);
				return  ok= false;
			}
		});
		
		if(ok){
			//placement.structure = new OBJECTS[this.itemType](0,0,placement.team,placement.elementName);
			placement.getMotor().buildings.addBuilding(placement.structure);
			placement.getMotor().selection.resetSelection();
			placement.getMotor().buildingQueue.resetActualConstruction(placement.structure.vars.sType,placement.elementName);
			//unit.kill(true); // passive , no sound , no score , etc . 
			//this.getMotor().sounds.play('place');
			return true;
		}else{
			this.getMotor().say('Can\'t deploy here !', this);	
			//placement.structure.kill(true);
		}
	};
	
	this.init(team,type,elementName);
	
};

OBJECTS.placement.prototype = new OBJECTS.baseObject();