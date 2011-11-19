
// Crappy cache ...
var lastSpreading = {
    nodeCode: null,
    spreading: null,
    list: []
};

OBJECTS.pathfinder = function(start,end,unit,map,options){
    
    var pathfinder = this;
    
    this.options = {
        forceWalkableBoundary: false,
        friendlyUnitBlock: false,
        enemyUnitBlock: false
    };
    
    this.init = function(start,end,unit,map,options){
        this.found = 0;
        this.pathDisplacement = 0;

        this.openList = new heaps();
        this.closeList = [];
        this.nodeList = [];
        
        this.blockedByFriendlyUnit = [];

        this.unit = unit;
        this.map = map;
        
        this.path = new OBJECTS.path();
        
        this.start = start;
        this.end = end;
        
        this.possible = true;
        
        // TODO add a getSpreadNodes that do high speed spread;
        //        log(this.end.getCode());
        if( options ){
            this.options = $.extend(this.options,options);
            if( this.options.spreadEnd ){
                //            log('spreading');
                if(lastSpreading.spreading && lastSpreading.spreading == this.options.spreadAmount && lastSpreading.nodeCode == this.end.getCode()){
                    if(lastSpreading.list.length > this.options.spreadIndex){
                        this.end = this.getNodeByCode(lastSpreading.list[this.options.spreadIndex]);
                    }else{
                        this.end = this.getNodeByCode(lastSpreading.list[0]);
                    }
//                    this.end = this.getNodeByCode(lastSpreading.list[this.options.spreadIndex]);
                }else{
                    var spreadNodes = this.getSpreadNodesCodes(end,this.options.spreadAmount);
                    if(spreadNodes.length){
                        lastSpreading.nodeCode = this.end.getCode();
                        lastSpreading.spreading = this.options.spreadAmount;
                        lastSpreading.list = spreadNodes;
                        if(spreadNodes.length > this.options.spreadIndex){
                            this.end = this.getNodeByCode(spreadNodes[this.options.spreadIndex]);
                        }else{
                            this.end = this.getNodeByCode(spreadNodes[0]);
                        }
                    }
                }
            }
        }        
        
        /*
         * We calculate an alternative end if it's not Walkable
         */
        if(!this.options.forceWalkableBoundary && this.map.isWalkable(this.end.getCode(),unit).value == 0){            
            if(newEnd = this.getNearestWalkableNode(this.end)){
                this.end = newEnd;
            }else{
                this.possible = false;
            }
        }
        
        if(this.possible){
            this.addNode(this.start);
            this.addNode(this.end);
            this.openList.addElement(start.getCode(),start.F);
        }else this.found = -1;
    };
    
    this.calculate = function(){
        if(this.possible){
            beginT = microtime(); // info timer
            while(this.found==0){
                if(!this.calculatePath()) break;
            }
            calculateT = microtime();
        //        log('CalculateTime : '+(calculateT - beginT));
        }
        return this.found;
    };
    
    this.calculatePath = function(){
        node = this.getLowestF();    

        if(!node){ // if we don't get node, openList is empty , so path can't be find 
            this.found = -1;
            return false;
        }

        this.openList.delFirst();
        nodeCode = node.getCode();

        var nearestNodes = this.getNearestNodes(node);
        
        $.each(nearestNodes,function(k,sNode){
            var penality = 0;
            if( (walkable = pathfinder.map.isWalkable(sNode.getCode(),pathfinder.unit)).value == 0 ){
                // this node is not walkable 
                if(walkable.error == 2){
                    if(pathfinder.options.friendlyUnitBlock) return true;
                    penality = 40; // the node is occuped by a friendly unit , penality the place 
                // friend unit don't block
                //                    if(walkable.infos.unit){
                //                        if(pathfinder.closeList.length < 4){
                //                            // block by friendly unit in the early 10 first calculate nodes
                //                            pathfinder.blockedByFriendlyUnit.push(walkable.infos.unit);
                //                        }
                //                    }
                }else if(walkable.error ==1) {
                    if(pathfinder.options.enemyUnitBlock) return true;
                    penality = 100; // the node is occuped by a enemy unit , penality the place 
                }else if(walkable.error ==3) {
                    // building 
                    penality = 200; // the node is occuped by a enemy unit , penality the place 
                }else{
                    return true; // go next node                 
                }
            }            
            if(pathfinder.score(sNode,node,penality)){
                var sNodeCode = sNode.getCode();
                if(!pathfinder.openList.inList(sNodeCode)){
                    pathfinder.openList.addElement(sNodeCode,sNode.F);
                }
            }
        });    

        this.addCloseList(nodeCode);    

        return true;
    };

    this.score = function(node,parent,penality){
        
        if(penality == undefined) penality = 0;
        if(!node.parent) node.parent = parent;

        // calculate G 
        var cost = 10;

        if( (node.x != parent.x) && (node.y != parent.y) ) cost = 14;
        var G = parent.G + cost;


        // calculate H
        var H = this.estimate(node,this.end);

        // compute F
        var F = G + H + penality;

        // assign
        switch(true){
            case ((node.G) && (node.G <= G)):
                return false;
                break;
            case (!node.G):
            case ((node.G) && (node.G > G) ):
                node.F = F;
                node.G = G;
                node.H = H;
                node.parent = parent;
                break;

        }
        return true;
    };

    this.estimate = function(node,end){
        var cost = 10;

        var displacement = Math.abs(node.x - end.x) + Math.abs(node.y - end.y);

        var force = cost * displacement;
        return force;
        
    //        if(this.pathDisplacement == 0){
    //            this.pathDisplacement = force ;
    //            return force;
    //        }
    //        
    //        var pow = 2;
    //        
    //        var ratio = force / this.pathDisplacement;
    //        var ratioPow = Math.pow(ratio,pow);
    //
    //        
    //        return force + Math.floor(ratioPow*this.pathDisplacement);
    };


    this.getLowestF = function(){
        if(this.openList.getSize()) return this.getNodeByCode(this.openList.getFirst());
        else return false;
    };

    this.getNearestNodes = function(node){
        var nearestNodeCodes = this.getNearestNodeCodes(node);
        nearestNodeCodes = this.getValidNodes(nearestNodeCodes,node);
        
        var nearestNodes = {};
        
        $.each(nearestNodeCodes,function(key,nodeCode){
            if(!pathfinder.inCloseList(nodeCode)){
                nearestNodes[key] = pathfinder.getNodeByCode(nodeCode);
            }
        });
        return nearestNodes;
    };
    
    
    this.getNearestNodeCodes = function(node){
        var nodeCode = node.getCode();
               
        var nearest = {
            top: nodeCode - this.map.width,
            topright: nodeCode - this.map.width + 1,
            right: nodeCode + 1,
            bottomright: nodeCode + this.map.width + 1,
            bottom: nodeCode + this.map.width,
            bottomleft: nodeCode + this.map.width - 1,
            left: nodeCode - 1,
            topleft: nodeCode - this.map.width - 1        
        };

        return nearest;
    };
    
    this.getValidNodes = function(nodeCodeList,initialNode){
        
        var nearest = nodeCodeList;
        var node = initialNode;
        var nodeCode = initialNode.getCode();
                
        var pMap = this.map;
        
        // On supprime les murs et les hors grilles
        for(var key in nearest){            
            var code = nearest[key];
            switch(true){
                //                case ( (walkable = map.isWalkable(code,pathfinder.unit)) <= 0 ):
                //                    if(walkable == -2){ // friendly unit blocking 
                //                        log('friendly unit blocking');
                //                    }
                case (code<1):
                case (code>pMap.width*pMap.height):                
                case ( ((nodeCode%pMap.width)==1) && ( (key=='left') || (key=='bottomleft') || (key=='topleft') ) ):
                case ( ((nodeCode%pMap.width)==0) && ( (key=='right') || (key=='bottomright') || (key=='topright') ) ):
                    delete nearest[key];
                    continue;
            }
            // We check the diagonals
            if( key=='topright' || key == 'bottomright' || key=='bottomleft' || key=='topleft'){
                    
                var sNode = pathfinder.getNodeByCode(code);
                var node1 = pathfinder.getRts().UTILS.getPointCode({
                    x: node.x, 
                    y: sNode.y
                });
                var node2 = pathfinder.getRts().UTILS.getPointCode({
                    x: sNode.x, 
                    y:node.y
                });
                if( pMap.isWalkable(node1,pathfinder.unit).value == 0 || pMap.isWalkable(node2,pathfinder.unit).value == 0) delete nearest[key];
            }
        }
  
        return nearest;      
    };
    
    this.getNearestWalkableNode = function(node){
        
        var pMap = this.map;

        var walkableNode = [];
        
        var retry = 0;
        
        var nodeToTest = [node];
        
        var lowestNode = null;
        
        while(nodeToTest.length > 0){
            
            var nearestNodes = this.getNearestNodeCodes(nodeToTest[0]);

            var validNodes = this.getValidNodes(nearestNodes,node);
            
            if(validNodes){          
                $.each(validNodes,function(key,nodeCode){
                    
                    if( (walkable = pMap.isWalkable(nodeCode,pathfinder.unit)).value == 0 ){
                        return true; // go next node 
                    }                     
                    walkableNode.push(pathfinder.getNodeByCode(nodeCode));
                //                    return false;
                });
            }    
            
            if(walkableNode.length == 0){                
                if(nearestNodes){
                    $.each(nearestNodes,function(k,nodeCode){
                        nodeToTest.push(pathfinder.getNodeByCode(nodeCode));           
                    });
                }else{
                    break;
                }
                if(retry++ > 4) break;
                nodeToTest.shift();
            }else{
                var lowestH = -1;
                lowestNode = node;
                $.each(walkableNode,function(k,node){
                    var H = pathfinder.estimate(node,start);
                    //                    log('Code : '+node.getCode());
                    //                    log(H);
                    if(lowestH == -1 || H < lowestH ){
                        lowestH = H;
                        lowestNode = node;
                    }                    
                });
                break;
            }
            
        }
        
        //        log(lowestNode.getCode());
        
        return lowestNode;
        
    };
    
    this.getSpreadNodesCodes = function(node, spread){
        
        if(spread == undefined) spread = 1;
        
        var nodeCode = node.getCode();
        
        var nodeCodes = [nodeCode];
        var i = 0;
        
        var pMap = this.map;     

        
       // var retry = 0;
        
        while(nodeCodes.length < spread){
            
            if(!nodeCode) break;
            
            var nearest = {
                top: nodeCode - pMap.width,
                topright: nodeCode - pMap.width + 1,
                right: nodeCode + 1,
                bottomright: nodeCode + pMap.width + 1,
                bottom: nodeCode + pMap.width,
                bottomleft: nodeCode + pMap.width - 1,
                left: nodeCode - 1,
                topleft: nodeCode - pMap.width - 1        
            };         
        
            $.each(nearest,function(key,code){            
                switch(true){
                    case ( pMap.isWall(code)):                        
                    case (code<1):
                    case (code>pMap.width*pMap.height):                
                    case ( ((nodeCode%pMap.width)==1) && ( (key=='left') || (key=='bottomleft') || (key=='topleft') ) ):
                    case ( ((nodeCode%pMap.width)==0) && ( (key=='right') || (key=='bottomright') || (key=='topright') ) ):
                        delete nearest[key];
                }
            });    
    
            // on vérifie que les diagonales sont accessibles
            $.each(nearest,function(key,code){
//                log(key+' '+code);
                if(nodeCodes.length >= spread) return false;
                if(code){
                    var sNode = pathfinder.getNodeByCode(code);
                    if( (sNode.x != node.x) && (sNode.y != node.y) ){ // cas des diagonales
                        // on vérifie que les 2 block adjacents sont Walkable
                        var node1 = pathfinder.getRts().UTILS.getPointCode({
                            x: node.x, 
                            y:sNode.y
                        });
                        var node2 = pathfinder.getRts().UTILS.getPointCode({
                            x: sNode.x, 
                            y:node.y
                        });
                        if( pMap.isWall(node1) && pMap.isWall(node2)) return true;                        
                    }        
                    if(nodeCodes.indexOf(code) == -1) // on ajoute que de nouvelles cases 
                        nodeCodes.push(code);
                }   
            });
            if(nodeCodes.length >= spread) break;
            nodeCode = nodeCodes[++i];
        }
        
        return nodeCodes;
    };

    
    this.getNodeByCode = function(nodeCode){  
        if( !this.nodeList[nodeCode]) {
            var node = new nodeObject();
            node.x = nodeCode % this.map.width || this.map.width;
            node.y = Math.floor( (nodeCode - 1) / this.map.width) + 1;
            this.addNode(node);
        }
        return this.nodeList[nodeCode];
    };
    
    this.addNode = function (node){
        this.nodeList[node.getCode()] = node ;    
        return node.getCode();
    };

    this.addCloseList = function(nodeCode){
        this.closeList.push(nodeCode);
        if(nodeCode == this.end.getCode()){
            this.found = 1;
            this.setPath();            
        }
    };

    this.inCloseList = function(nodeCode){
        return this.closeList.indexOf(nodeCode) != -1;
    };    
    
    this.setPath = function(){
        var n = this.end;
        while(n){
            this.path.addList(n.getCode());
            n = n.parent;
        }
    };        
    
    this.showPath = function(unit){
        var map = this.getMap();
        var RTS = this.getRts();
        
        //var advanced = false;

        var unitId = unit.id;

        $('.closeList .unit'+unitId).remove();

        $.each(pathfinder.path.list,function(k,nodeCode){        
            var div = $('<div class="node unit'+unitId+' node-'+nodeCode+' pathNode"></div>');        
            $('.closeList').append(div);
            map.positionElement(div,RTS.UTILS.getPositionByCode(nodeCode),RTS.grid);
        });
//        $('.closeList .unit'+unitId).fadeOut(1500,function(){ $('.closeList .unit'+unitId).remove() });
    };   
    
    this.init(start,end,unit,map,options);
   
};

OBJECTS.pathfinder.prototype = new OBJECTS.baseObject();