

/**
 * Defines some usefull functions in the RTS 
 * @returns {OBJECTS.UTILS}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */

OBJECTS.UTILS = function(){

    
    this.vertical = {
        '-1':'top',
        '0':'',
        '1':'bottom'
    };
    this.horizontal = {
        '-1':'left',
        '0':'',
        '1':'right'
    };
    
    /**
     * Return an array wich contains a vector and textual direction between the actual nodeCode and anoter nodeCode
     * @param {nodeCode} actualCode actual position
     * @param {nodeCode} nextCode next position
     * @returns {Array} vector + textual direction
	 * @author Lixus3d <developpement@adreamaline.com>
     * @date 19 nov. 2011
     */    
    this.getDirection = function (actualCode,nextCode){

        var direction = [0,0,'default'];
        var map = this.getMap();

        switch(true){
            case (nextCode==actualCode-map.width) :
                direction = [0,1,'top'];
                break;
            case (nextCode==actualCode+map.width) :
                direction = [0,-1,'bottom'];
                break;
            case (nextCode==actualCode-1) :
                direction = [-1,0,'left'];
                break;
            case (nextCode==actualCode+1) :
                direction = [1,0,'right'];
                break;
            case (nextCode==actualCode-map.width-1) :
                direction = [-1,1,'topLeft'];
                break;
            case (nextCode==actualCode-map.width+1) :
                direction = [1,1,'topRight'];
                break;
            case (nextCode==actualCode+map.width+1) :
                direction = [1,-1,'bottomRight'];
                break;
            case (nextCode==actualCode+map.width-1) :
                direction = [-1,-1,'bottomLeft'];
                break;
        }       

        return direction; 
    };

    /**
     * Same as getDirection but with absolute position
     * @param {posObject} actualPosition actual position
     * @param {posObject} nextPosition next position
     * @returns {Array} vector + textual direction
	 * @author Lixus3d <developpement@adreamaline.com>
     * @date 19 nov. 2011 
     */
    this.getDirectionByPosition = function(actualPosition,nextPosition){

        var direction = [0,0,'default'];

        var width = nextPosition.x - actualPosition.x;
        var height = nextPosition.y - actualPosition.y;

        var delta = this.getRts().grid/2;

        if(Math.abs(width) > delta){
            direction[0] = (nextPosition.x - actualPosition.x) / Math.abs(nextPosition.x - actualPosition.x);
        }
        if(Math.abs(height) > delta){
            direction[1] = (nextPosition.y - actualPosition.y) / Math.abs(nextPosition.y - actualPosition.y);
        }       

        direction[2] = this.getOrientation(direction);

        return direction;
    };

	/**
	 * Return the textual direction of a vector , usefull for css 
	 * @param {vector} vector The vector to get the direction
	 * @returns {string} direction string
	 */
    this.getOrientation = function(vector){
        return ''+this.vertical[vector[1]]+''+this.horizontal[vector[0]];
    };
    
    // TODO : most likely not used ... ??
    this.getNodeCode = function(){
        return this.x + (this.getRts().map.width * (this.y-1));
    };

    /**
     * Return the nodeCode of a position
     * @param {posObject} point 
     * @returns {nodeCode} The node code of a point position 
     */
    this.getPointCode = function(point){
        if(point){
            return point.x + (this.getMap().width * (point.y-1));
        }
        return false;
    };

    /**
     * Return the position of a nodeCode
     * @param {nodeCode} nodeCode 
     * @returns {posObject} 
     */
    this.getPositionByCode = function(nodeCode){
       var position = {};
       position.x = nodeCode % this.getMap().width || this.getMap().width;
       position.y = Math.floor( (nodeCode - 1) / this.getMap().width) + 1;
       return position;
    };  
    
    /**
     * Return the nodeCode related to an actual nodeCode and a direction
     * @param {nodeCode} nodeCode
     * @param {vector} vector
     * @returns {nodeCode} The nodeCode of the destination
     */
    this.getNodeCodeRel = function(nodeCode,vector){
       return nodeCode + vector[0] + (vector[1] * this.getMap().width);
    };

    /*
     * ISOMETRIC FUNCTION 
     */

    /**
     * Change the position of an item in the workspace
     * @param {RTSitem} elem
     * @param {posObject} position
     */
    this.drawElem = function(elem,position){
        elem.css({
            top: position.y - isoSize.y/2,
            left: position.x
        });
    };

    /**
     * Convert an absolute position to a relative position on the map 
     * @param {posObject} positionAbs
     * @param {posObject} nodeZero Give the nodeZero position to be relative with
     * @returns {posObject} the relative position
     */
    this.absToRel = function(positionAbs,nodeZero){
        return {
            x: (positionAbs.x - nodeZero.x),
            y: (positionAbs.y - nodeZero.y)
        };                   
    };

    /**
     * Convert a relative position to an absolute position on the map
     * @param {posObject} positionRel
     * @param {posObject} nodeZero Give the nodeZero position that the positionRel is relative with
     * @returns {posObject} the absolute position 
     */
    this.relToAbs = function(positionRel,nodeZero){
        return {
            x: (positionRel.x + nodeZero.x),
            y: (positionRel.y + nodeZero.y)
        };      
    };

    /**
     * Return a node position from a relative position
     * @param {posObject} position
     * @param {isoSize} isoSize
     * @returns {nodePosObject} The node position
     */
    this.relPosToNodePos = function(position,isoSize){

        var ratios = {
            x: (position.x / isoSize.x),
            y: (position.y / isoSize.y)
        };

//        log('ratios :'+ratios.x+ ' '+ ratios.y);

        return {
            x: Math.ceil(ratios.x - ratios.y),
            y: Math.ceil(ratios.y + ratios.x)
        };
    };

    /**
     * Return a relative position from a node position
     * @param {nodePosObject} node
     * @param {isoSize} isoSize
     * @eturns {posObject} the relative position
     */
    this.nodePosToRelPos = function(node,isoSize){
        return {
            x: (((node.x - 1) + (node.y - 1))/2 * isoSize.x) + (isoSize.x/2),
            y: ((node.y - 1) - (node.x - 1))/2 * isoSize.y
        };
    };

};

OBJECTS.UTILS.prototype = new OBJECTS.baseObject();