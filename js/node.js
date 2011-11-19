
/**
 * Base node object, every little square on the map is a "node" 
 * @param {number} x
 * @param {number} y
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 19 nov. 2011
 */
OBJECTS.nodeObject = function (x,y){
    
    this.F= 0;
    this.G= 0;
    this.H= 0;
    this.x= x;
    this.y= y;
    this.parent= null;
    this.getCode = this.getRts().UTILS.getNodeCode;
};
OBJECTS.nodeObject.prototype = new OBJECTS.baseObject();

// shortcut used in the early stage of the project, still useful
var nodeObject = OBJECTS.nodeObject; 
