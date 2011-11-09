<?php

if(!($grid = $_GET['w'])) $grid = 20;

header('Content-Type: image/svg+xml');
header("Content-Disposition:inline; filename=grid.svg");
echo '<?xml version="1.0" encoding="utf-8"?>';

?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="<?=$grid?>" height="<?=$grid?>">
    <line x1="0" y1="0" x2="<?=$grid?>" y2="0" stroke-width="1" stroke="black" /> 
    <line x1="0" y1="0" x2="0" y2="<?=$grid?>" stroke-width="1" stroke="black" /> 
</svg>