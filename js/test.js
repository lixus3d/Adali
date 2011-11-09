

function positionElement(elem,position,pointSize){
    
    var offset = 50;
    if(pointSize==undefined) var pointSize = grid;
    
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

function showPath(pathfinder,unit){
    var advanced = false;
    
    var unitId = unit.id;
    
    $('.closeList .unit'+unitId).remove();
    
    $.each(pathfinder.path,function(k,nodeCode){        
        var div = $('<div class="node unit'+unitId+' node-'+nodeCode+' pathNode"></div>');        
        $('.closeList').append(div);
        positionElement(div,getPositionByCode(nodeCode),grid);
    })
    /*
    $.each({openList: pathfinder.openList.elements, closeList: pathfinder.closeList},function(k,list){
        $('.'+k).html('');
        
        $.each(list,function(id,nodeCode){
            if( (nodeCode) && (node = pathfinder.getNodeByCode(nodeCode)) ){
                var direction = getParentDirection(node);
                if(advanced){
                    var div = $('<div class="node node-'+nodeCode+' a'+direction+'"><span class="f">'+node.F+'</span><span class="g">'+node.G+'</span><span class="h">'+node.H+'</span></div>');
                }else{
                    var div = $('<div class="node node-'+nodeCode+' a'+direction+'"></div>');
                }
                $('.'+k).append(div);
                positionElement(div, node, grid)
            }
        })
    })
    
    $.each(pathfinder.path,function(k,code){
        $('.node-'+code).addClass('pathNode');
    })
    */

    log('Total nodes computed : '+ (pathfinder.openList.getSize() + pathfinder.closeList.length) )
}

function getParentDirection(node){
   
    var pCode = getPointCode(node.parent);
    var nCode = getPointCode(node);
    if(pCode && nCode){
        return getDirection(nCode,pCode);
    }

    return 'None';
}

function getDirection(nCode,pCode){
    var direction = 'None';
    
       switch(true){
        case (pCode==nCode-map.size) :direction = 'Top';break;
        case (pCode==nCode+map.size) :direction = 'Bottom';break;
        case (pCode==nCode-1) :direction = 'Left';break;
        case (pCode==nCode+1) :direction = 'Right';break;
        case (pCode==nCode-map.size-1) :direction = 'TopLeft';break;
        case (pCode==nCode-map.size+1) :direction = 'TopRight';break;
        case (pCode==nCode+map.size+1) :direction = 'BottomRight';break;
        case (pCode==nCode+map.size-1) :direction = 'BottomLeft';break;
    }       
    
    return direction; 
}

function getDirectionIndicator(nCode,pCode){    
     var direction = 0;
     switch(true){
        case (pCode==nCode-map.size) :direction = -1;break;
        case (pCode==nCode+map.size) :direction = 1;break;
        case (pCode==nCode-1) :direction = -1;break;
        case (pCode==nCode+1) :direction = 1;break;
        case (pCode==nCode-map.size-1) :direction = -2;break;
        case (pCode==nCode-map.size+1) :direction = 0;break;
        case (pCode==nCode+map.size+1) :direction = 2;break;
        case (pCode==nCode+map.size-1) :direction = 0;break;
    }
    return direction
}

function showWalls(){
    
    $('.walls').html('');
    $.each(map.walls,function(k,code){
        node = getPositionByCode(code);
        var div = $('<div class="wall"></div>');
        $('.walls').append(div);
        positionElement(div, node, grid) 
    })

}

function drawPoint(position){
    var div = $('<div class="miniPoint">');
    div.css({
        left: position.x + offset,
        top: position.y + offset
    })
    $('body').append(div);
}
