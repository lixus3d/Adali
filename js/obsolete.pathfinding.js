/*
 * Init some vars
 */
var grid = 50;
var found = 0;
var showProgress = false;
var pathDisplacement = 0;
var timer = null;

/*
 * Mover specific var
 */
var turnRatio = 1; // 1 mean instantly turn

/*
 * Node object
 */
var nodeObj = {
    F: 0,
    G: 0,
    H: 0,
    x: null,
    y: null,
    parent: null,
    type: 'node'
}

/*
 * Start and End nodes
 */
var start = $.extend({},nodeObj,{
    x: 3,
    y: 4
});

var end = $.extend({},nodeObj,{
    x: 22,
    y: 11
});

/*
 * Init vars for nodes lists
 */
var Walls = [364, 541, 99, 510, 804, 221, 402, 599, 811, 317, 403, 745, 485, 85, 87, 184, 713, 893, 541, 513, 799, 568, 113, 594, 602, 666, 45, 697, 54, 230, 740, 826, 465, 685, 83, 38, 623, 190, 461, 856, 354, 358, 652, 208, 639, 539, 346, 664, 201, 231, 338, 583, 360, 735, 115, 827, 574, 221, 364, 161, 178, 155, 650, 555, 675, 226, 306, 212, 490, 361, 451, 745, 281, 552, 860, 866, 486, 683, 25, 408, 350, 844, 429, 211, 167, 807, 258, 379, 620, 198, 345, 795, 220, 304, 370, 23, 739, 386, 753, 268, 787, 177, 397, 734, 482, 379, 77, 165, 339, 315, 414, 305, 225, 766, 476, 281, 215, 361, 297, 565, 14, 387, 898, 657, 328, 870, 693, 819, 1, 854, 440, 355, 539, 625, 795, 609, 110, 386, 583, 180, 578, 109, 392, 721, 456, 48, 671, 310, 624, 759, 9, 289, 644, 262, 495, 619, 332, 687, 123, 176, 803, 125, 219, 388, 713, 246, 327, 61, 182, 6, 610, 172, 778, 562, 517, 326, 814, 48, 734, 354, 59, 521, 343, 100, 537, 319, 433, 54, 796, 563, 481, 444, 675, 71, 148, 267, 769, 869, 896, 259, 452, 827, 326, 827, 393, 687, 689, 347, 379, 532, 800, 325, 350, 359, 811, 620, 742, 77, 693, 302, 891, 817, 458, 864, 698, 100, 714, 246, 142, 112, 262, 771, 589, 27, 8, 777, 769, 141, 799, 244, 537, 631, 356, 393, 490, 509, 425, 114, 260, 427, 804, 612, 46, 344, 363, 485, 54, 41, 837, 1, 333, 615, 587, 701, 798, 790, 660, 752, 30, 238, 11, 503, 131, 280, 528, 767, 601, 94, 660, 336, 432, 871, 406, 365, 866, 807, 629, 785, 796, 537, 850, 881, 688, 525, 813, 852, 159, 846, 622];
var openList = $.extend({},heaps); // create from a binary heaps
var closeList = [];
var nodeList = [];


/*
 * Initialize grid, wall, etc.
 */
function init(){
    
    found = 0; // reset vars to default value
    //Walls.length = 0 ;
    openList.clear(); // binaryheaps.clear()
    closeList.length = 0;
    nodeList.length = 0;
    
    beginT = microtime(); // info timer
    
    showPoint({A: start, B: end}); // show graphical position
    setStartPoint(start); // set A to start point 
    setEndPoint(end); // set B to arrival point
    
    //generateWalls();        
    showWalls();
    
    var initT = microtime(); // init time 
    log('InitTime : '+(initT - beginT));

}

/*
 * Calculate the path
 */
function startPathfinding(){
    
    if(found){
        init();        
    }
    beginT = microtime(); // info timer
    
    pathDisplacement = estimate(start, end);
    log(pathDisplacement);
    
    if(showProgress){
        timer = setInterval(function(){
            if(found){
                window.clearInterval(timer);
                calculateT = microtime();
                log('CalculateTime : '+(calculateT - beginT));
                log('Total nodes computed : '+ (openList.getSize() + closeList.length) )
            }
            !calculatePath(); // calculate path from start to end
            showLists(true);            
        },50);
    }else{
        while(!found){
            if(!calculatePath()) break; // calculate path from start to end
        }
        calculateT = microtime();
        log('CalculateTime : '+(calculateT - beginT));

        showLists(true);
        log('Total nodes computed : '+ (openList.getSize() + closeList.length) )
    }   
    
   
}

/*
 * Generate some wall nodes
 */
function generateWalls(){

    // generate some Walls    
    var max = (size*size)/3;
    for (i = 0; i < max; i++) {
        var code = Math.floor(Math.random()*size*size);
        if( (code != getNodeCode(start)) && (code != getNodeCode(end)) ){
            Walls.push(code);
        }
    }
}


function calculatePath(){
    node = getLowestF();    
    
    if(!node){ // if we don't get node, openList is empty , so path can't be find
        found = 1;
        log('Impossible path');
        return false;
    }
    
    openList.delFirst();
    
    nodeCode = getNodeCode(node);
    
    var nearestNodes = getNearestNodes(node);

    $.each(nearestNodes,function(key,sNode){
        
        score(sNode,node);
        var sNodeCode = sNode.getCode();
        if(!openList.inList(sNodeCode)){
            openList.addElement(sNodeCode,sNode.F);
        }
    })    
    
    addCloseList(nodeCode);    
    
    return true;
}

function score(node,parent){
    if(!node.parent) node.parent = parent;

    // calculate G 
    var cost = 10;
    
    if( (node.x != parent.x) && (node.y != parent.y) ) cost = 14;
    var G = parent.G + cost;
    
    
    // calculate H
    var H = estimate(node,end);
    
    // compute F
    var F = G + H;
    
    // assign
    switch(true){
        case (!node.G):
        case ((node.G) && (node.G > G) ):
            node.F = F;
            node.G = G;
            node.H = H;
         break;
    }
}

function estimate(node,end){
    var cost = 10;
    
    var displacement = Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
    
//    return displacement * cost;
    if(pathDisplacement == 0) multiplier = 1;
    else multiplier = pathDisplacement/(displacement*cost);
    
    cost = cost/2 + ( (cost / 2) / multiplier );
    
    //return Math.ceil( (cost*displacement) / multiplier );
    return Math.floor(Math.pow(cost * displacement,1.2));
    //return (cost * displacement)*(cost * displacement);
}


function getLowestF(){
    if(openList.getSize()) return getNodeByCode(openList.getFirst());
    else return false;
}

function getNearestNodes(node){
    var nearestNodeCodes = getNearestNodeCodes(node);
    
    var nearestNodes = {};
    
    $.each(nearestNodeCodes,function(key,nodeCode){
        if(!inCloseList(nodeCode)){
            nearestNodes[key] = getNodeByCode(nodeCode);
        }
    })
    return nearestNodes;
}

function getNearestNodeCodes(node){
    var nodeCode = getNodeCode(node);
     
    var nearest = {
        top: nodeCode - size,
        topright: nodeCode - size + 1,
        right: nodeCode + 1,
        bottomright: nodeCode + size + 1,
        bottom: nodeCode + size,
        bottomleft: nodeCode + size - 1,
        left: nodeCode - 1,
        topleft: nodeCode - size - 1        
    }

    // On supprime les murs et les hors grilles
    $.each(nearest,function(key,code){
        switch(true){
            case (code<1):
            case (code>size*size):
            case (!isWalkable(code)):
            case ( ((nodeCode%size)==1) && ( (key=='left') || (key=='bottomleft') || (key=='topleft') ) ):
            case ( ((nodeCode%size)==0) && ( (key=='right') || (key=='bottomright') || (key=='topright') ) ):
                delete nearest[key];
        }
    })
    
    // on vérifie que les diagonales sont accessibles
    $.each(nearest,function(key,code){
        if(code){
            var sNode = getNodeByCode(code);
            if( (sNode.x != node.x) && (sNode.y != node.y) ){ // cas des diagonales
                // on vérifie que les 2 block adjacents sont Walkable
                var node1 = getNodeCode({x: node.x, y:sNode.y});
                var node2 = getNodeCode({x: sNode.x, y:node.y});
                if(!isWalkable(node1) && !isWalkable(node2)) delete nearest[key];
            }
        }   
    })
    
    return nearest;
}

function isWalkable(code){
    return Walls.indexOf(code) == -1;
}

function getNodeCode(node){
    if(node){
        return node.x + (size * (node.y-1));
    }
    return false;
}

function getNodeByCode(nodeCode){  
    if( !nodeList[nodeCode]) {
        var node = $.extend({},nodeObj);
        node.x = nodeCode % size || size;
        node.y = Math.floor( (nodeCode - 1) / size) + 1;
        node.type = 'default';
        addNode(node);
    }
    return nodeList[nodeCode];
}

function assignParent(node,childNodes){
    $.each(childNodes,function(key,sNode){
        sNode.parent = node;
    })
    return childNodes;
}

function addNode(node){
    var nodeCode = getNodeCode(node);
    nodeList[nodeCode] = node ;    
    return nodeCode;
}

function addCloseList(nodeId){
    closeList.push(nodeId);
    if(nodeId == getNodeCode(end)){
        found = 1;
    }    
}

function delCloseList(nodeId){
    $.each(closeList,function(key,cNodeId){
        if(cNodeId == nodeId){
            delete closeList[key];
            return false;
        } 
    }) 
}

function inCloseList(nodeId){
    return closeList.indexOf(nodeId) != -1;
}

function setStartPoint(node){
    node.type = 'start';
    id = addNode(node);
    openList.addElement(id,node.F)
}


function setEndPoint(node){   
    node.type = 'end';
    addNode(node);
}


function positionElement(elem,position,pointSize){
    
    var offset = 50;
    if(pointSize==undefined) var pointSize = 50;
    
    elem.css({
        position: 'absolute',
        left: (offset + (grid/2) - (pointSize/2) + (position.x-1)*grid)+"px",
        top: (offset + (grid/2) - (pointSize/2) + (position.y-1)*grid)+"px"
    });
}

function showPoint(pointList){    
    $.each(pointList,function(k,point){
        positionElement($('.p'+k), point);
    })
}

function showLists(advanced){
    
    if(advanced==undefined) advanced = false;
    
    $.each({openList: openList,closeList: closeList},function(k,list){
        $('.'+k).html('');
        
        if(list.elements) list = list.elements;
        
        $.each(list,function(id,nodeCode){
            if( (nodeCode) && (node = getNodeByCode(nodeCode)) ){
                var direction = getParentDirection(node);
                if(advanced){
                    var div = $('<div class="node node-'+nodeCode+' a'+direction+'"><span class="f">'+node.F+'</span><span class="g">'+node.G+'</span><span class="h">'+node.H+'</span></div>');
                }else{
                    var div = $('<div class="node node-'+nodeCode+'"><span class="parent">'+getNodeCode(node.parent)+'</span></div>');
                }
                $('.'+k).append(div);
                positionElement(div, node, grid)
            }
        })
    })
    
    $.each(getPath(),function(k,code){
        $('.node-'+code).addClass('pathNode');
    })
        
}

function getPath(){
    var path = [];
    if(found){
        var n = end;
        while(true){
            path.push(getNodeCode(n));
            n = n.parent;
            if(!n) break;
        }
    }
    return path;
}

function getParentDirection(node){
   
    var pCode = getNodeCode(node.parent);
    var nCode = getNodeCode(node);
    if(pCode && nCode){
        return getDirection(nCode,pCode);
    }

    return 'None';
}

function getDirection(nCode,pCode){
    var direction = 'None';
    
       switch(true){
        case (pCode==nCode-size) :direction = 'Top';break;
        case (pCode==nCode+size) :direction = 'Bottom';break;
        case (pCode==nCode-1) :direction = 'Left';break;
        case (pCode==nCode+1) :direction = 'Right';break;
        case (pCode==nCode-size-1) :direction = 'TopLeft';break;
        case (pCode==nCode-size+1) :direction = 'TopRight';break;
        case (pCode==nCode+size+1) :direction = 'BottomRight';break;
        case (pCode==nCode+size-1) :direction = 'BottomLeft';break;
    }       
    
    return direction; 
}

function getDirectionIndicator(nCode,pCode){    
     var direction = 0;
     switch(true){
        case (pCode==nCode-size) :direction = -1;break;
        case (pCode==nCode+size) :direction = 1;break;
        case (pCode==nCode-1) :direction = -1;break;
        case (pCode==nCode+1) :direction = 1;break;
        case (pCode==nCode-size-1) :direction = -2;break;
        case (pCode==nCode-size+1) :direction = 0;break;
        case (pCode==nCode+size+1) :direction = 2;break;
        case (pCode==nCode+size-1) :direction = 0;break;
    }
    return direction
}

function showWalls(){
    
    $('.walls').html('');
    $.each(Walls,function(k,code){
        node = getNodeByCode(code);
        var div = $('<div class="wall"></div>');
        $('.walls').append(div);
        positionElement(div, node, grid) 
    })

}


