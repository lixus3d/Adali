<?php
$x = 64;
$y = 32;
?>
<!DOCTYPE HTML>
<html>
    <head>
        <style>
            <!--
            body {
                margin:0;
                padding:0;
                background-image:url('<?=$x?>x<?=$y?>.png');
                
            }
            .global{
                width:100%;
                height:100%;
                display:block;
                position:absolute;
            }
            .node {
                position:absolute;
                display:block;
                width:<?=$x?>px;
                height:<?=$y?>px;
                background-image:url('<?=$x?>x<?=$y?>_highlight.png');
            }
            .area{
                border:1px solid #000;
                width:500px;
                height:125px;
                left:256px;
                top:144px;
                position:absolute;
                display:block;
            }
            -->
        </style>
        <script type="text/javascript" src="../js/jquery.js"></script>
    </head>
    <body>
        <div class="global">
            <div class="area"></div>
            <div class="node zeroNode"></div>
        </div>
        <script type="text/javascript">
            var isoSize = {
                x: <?=$x?>,
                y: <?=$y?>
            }
            var nodeZero = {};
           
            function log(e){
                if(window.console) console.log(e);
            }
            function drawElem(elem,position){
                elem.css({
                    top: position.y - isoSize.y/2,
                    left: position.x
                })
            }
           
            function absToRel(positionAbs){
                return {
                    x: (positionAbs.x - nodeZero.x),
                    y: (positionAbs.y - nodeZero.y)
                };                   
            }
           
            function relToAbs(positionRel){
                return {
                    x: (positionRel.x + nodeZero.x),
                    y: (positionRel.y + nodeZero.y)
                };      
            }
           
            function posToNode(position){

                var ratios = {
                    x: (position.x / isoSize.x),
                    y: (position.y / isoSize.y)
                };

                log('ratios :'+ratios.x+ ' '+ ratios.y);

                return {
                    x: Math.ceil(ratios.x - ratios.y),
                    y: Math.ceil(ratios.y + ratios.x)
                };
            }
           
            function nodeToPos(node){
                return {
                    x: ((node.x - 1) + (node.y - 1))/2 * isoSize.x,
                    y: ((node.y - 1) - (node.x - 1))/2 * isoSize.y
                };
            }
                          

            $(document).ready(function(){
                // get the area 
                var area = $('.area');
                var offset = area.offset();
               
                var node = $('.zeroNode');
               
                var areaIsoHeight = Math.ceil(area.height() / isoSize.y);
               
                var areaX = Math.floor( offset.left);
                var areaY = Math.floor( offset.top);               
               
                // determine the x and y position of zero node 
                nodeZero = {
                    x: Math.floor(areaX - ( isoSize.x * areaIsoHeight/2)),
                    y: Math.floor(areaY + ( isoSize.y * areaIsoHeight/2))
                }
               
                // trace zeroNode 
                drawElem(node,nodeZero);                           
                $('body').css({
                    backgroundPosition: (nodeZero.x)+'px '+(nodeZero.y - isoSize.y/2)+'px '
                })
                // trace node at the click
                var pointNode = $('<div class="point node"/>');
                $('body').append(pointNode);
                $('body').click(function(event){
                   
                    // determine the click position in the grid
                    var clickPosition = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    
                    var relativePosition = absToRel(clickPosition);
                    
                    var node = posToNode(relativePosition);
                    log('node: '+node.x+ ' '+ node.y);
                    var nodePos = nodeToPos(node);
                    
                    
                    drawElem(pointNode,relToAbs(nodePos));
                    
//                    var relativePosition = {
//                        x: (clickPosition.x - nodeZero.x),
//                        y: (clickPosition.y - nodeZero.y)
//                    };
//                   
//                    var ratios = {
//                        x: (relativePosition.x / isoSize.x),
//                        y: (relativePosition.y / isoSize.y)
//                    };
//                   
//                    log('ratios :'+ratios.x+ ' '+ ratios.y);
//                   
//                    var nodePosition = {
//                        x: Math.ceil(ratios.x - ratios.y),
//                        y: Math.ceil(ratios.y + ratios.x)
//                    };
//                   
//                    log('node: '+nodePosition.x+ ' '+ nodePosition.y);
//                    // determining nodeGrid position 
//                    //                   var nodeX = event.layerX;
//                   
//                    drawElem(pointNode,clickPosition);
                   
                })
               
               
            });
        </script>
    </body>
</html>