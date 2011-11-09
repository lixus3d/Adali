
OBJECTS.nodeObject = function (x,y){
    
    this.F = 0;
    this.G= 0;
    this.H= 0;
    this.x= x;
    this.y= y;
    this.parent= null;
    this.getCode = this.getRts().UTILS.getNodeCode;
}
OBJECTS.nodeObject.prototype = new OBJECTS.baseObject();
// shortcut ;
var nodeObject = OBJECTS.nodeObject;
