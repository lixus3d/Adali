<?php

/**
 * Tiny script that performs the construction of my buildings and units sprites
 */

$error = null;
$alphaMax = 127;
$shawdowDisplacement = 1;

// get the object to construct from the $_GET
if(isset($_GET['spritename']) && $spritename = $_GET['spritename']){
	
	if(isset($_GET['separateShadow'])){
			$separateShadow = (int) $_GET['separateShadow'];			
	}
	
	// path to the images 
    $path = './sources/images/'.$spritename ;
    
    if(file_exists($path)){
    	
    	
    	
    	// find images in the path 
        if($files = glob($path.'/'.$spritename.'*.png')){


        	
        	
        	/*
        	 * BODY 
        	 */
        	
            // we get the size of the first image to determine sprite size
            $size = getimagesize($files[0]);
            
            $img = imagecreatetruecolor($size[0],$size[1]*9); // 9 images per object : 8 direction + default
            $alphaColor = imagecolorallocatealpha($img,255,255,255,127); // we put the background fully transparent
            imagefill($img,0,0,$alphaColor);
            imagealphablending($img,true);
            imagesavealpha($img, true);
            
            if(!$separateShadow){
	            // try to find shadows in the path
	            if($shadows = glob($path.'/shadow*.png')){
		            $y = 0;
		            foreach($shadows as $shadow){ // shawdows are not grayscale png, white is fully transparent , black is opaque
		            	$sImg = imagecreatefrompng($shadow); // we create a new image from the shadow            	
		            	for($w=0;$w<$size[0];$w++){
		            		for($h=0;$h<$size[1];$h++){ // we transform every pixel color to alpha level
		            			$cIndex = imagecolorat($sImg,$w,$h);
		            			$colors = imagecolorsforindex($sImg,$cIndex);
		            			$alpha = ceil(( ($colors['red']+$colors['green']+$colors['blue'] )/ 3) / 255 * $alphaMax);
		            			
		            			$alphaColor = imagecolorallocatealpha($img,0,0,0,$alpha); // we put the color in the image
		            			imagesetpixel($img,$w,$h+$shawdowDisplacement+($y),$alphaColor);
		            		}
		            	}
		            	$y += $size[1];
		            	imagedestroy($sImg);
		            }
	            }
            }
            
            $y = 0;
            foreach($files as $file){
                $sImg = imagecreatefrompng($file);
                imagecopy($img, $sImg, 0, $y, 0, 0, $size[0], $size[1]);
                $y += $size[1];
                imagedestroy($sImg);
            }
            
            
			/*
			 * TURRET
			 */
            
            if($turrets = glob($path.'/turret*.png')){
            	$imgTurret = imagecreatetruecolor($size[0],$size[1]*9); // 9 images per object : 8 direction + default
            	$alphaColor = imagecolorallocatealpha($imgTurret,255,255,255,127); // we put the background fully transparent
            	imagefill($imgTurret,0,0,$alphaColor);
            	imagealphablending($imgTurret,true);
            	imagesavealpha($imgTurret, true);
            	
            	// try to find turret's shadows in the path 
            	if($shadows = glob($path.'/shadowTurret*.png')){
            		$y = 0;
            		foreach($shadows as $shadow){
            			// shawdows are not grayscale png, white is fully transparent , black is opaque
            			$sImg = imagecreatefrompng($shadow); // we create a new image from the shadow
            			for($w=0;$w<$size[0];$w++){
            				for($h=0;$h<$size[1];$h++){
            					// we transform every pixel color to alpha level
            					$cIndex = imagecolorat($sImg,$w,$h);
            					$colors = imagecolorsforindex($sImg,$cIndex);
            					$alpha = ceil(( ($colors['red']+$colors['green']+$colors['blue'] )/ 3) / 255 * $alphaMax);
            	
            					$alphaColor = imagecolorallocatealpha($imgTurret,0,0,0,$alpha); // we put the color in the image
            					imagesetpixel($imgTurret,$w,$h+$shawdowDisplacement+($y),$alphaColor);
            				}
            			}
            			$y += $size[1];
            			imagedestroy($sImg);
            		}
            	}
            	
            	$y = 0;
            	foreach($turrets as $file){
            		$sImg = imagecreatefrompng($file);
            		imagecopy($imgTurret, $sImg, 0, $y, 0, 0, $size[0], $size[1]);
            		$y += $size[1];
            		imagedestroy($sImg);
            	}
            	$okTurret = imagepng($imgTurret,$path.'Turret.png',9,PNG_ALL_FILTERS);
            }
            
            
            if($rotors = glob($path.'/rotor*.png')){
              	$imgRotor = imagecreatetruecolor($size[0],$size[1]*9); // 9 images per object : 8 direction + default
	            $alphaColor = imagecolorallocatealpha($imgRotor,255,255,255,127); // we put the background fully transparent
	            imagefill($imgRotor,0,0,$alphaColor);
	            imagealphablending($imgRotor,true);
	            imagesavealpha($imgRotor, true);

            	 
            	$y = 0;
            	foreach($rotors as $file){
	            	$sImg = imagecreatefrompng($file);
	            	imagecopy($imgRotor, $sImg, 0, $y, 0, 0, $size[0], $size[1]);
	            	$y += $size[1];
	            	imagedestroy($sImg);
            	}
            	$okRotor = imagepng($imgRotor,$path.'Rotor.png',9,PNG_ALL_FILTERS);
            }            
            
            if(isset($okTurret) && $okTurret){
            	$ok = imagepng($img,$path.'Body.png',9,PNG_ALL_FILTERS);
            }else{
            	$ok = imagepng($img,$path.'.png',9,PNG_ALL_FILTERS);
            }
            
            if($separateShadow){
            	$imgShadow = imagecreatetruecolor($size[0],$size[1]*9); // 9 images per object : 8 direction + default
            	$alphaColor = imagecolorallocatealpha($imgShadow,255,255,255,127); // we put the background fully transparent
            	imagefill($imgShadow,0,0,$alphaColor);
            	imagealphablending($imgShadow,true);
            	imagesavealpha($imgShadow, true);            	
            	// try to find shadows in the path
	            if($shadows = glob($path.'/shadow*.png')){
		            $y = 0;
		            foreach($shadows as $shadow){ // shawdows are not grayscale png, white is fully transparent , black is opaque
		            	$sImg = imagecreatefrompng($shadow); // we create a new image from the shadow            	
		            	for($w=0;$w<$size[0];$w++){
		            		for($h=0;$h<$size[1];$h++){ // we transform every pixel color to alpha level
		            			$cIndex = imagecolorat($sImg,$w,$h);
		            			$colors = imagecolorsforindex($sImg,$cIndex);
		            			$alpha = ceil(( ($colors['red']+$colors['green']+$colors['blue'] )/ 3) / 255 * $alphaMax);
		            			
		            			$alphaColor = imagecolorallocatealpha($imgShadow,0,0,0,$alpha); // we put the color in the image
		            			imagesetpixel($imgShadow,$w,$h+$shawdowDisplacement+($y),$alphaColor);
		            		}
		            	}
		            	$y += $size[1];
		            	imagedestroy($sImg);
		            }
	            }
	            $okShadow = imagepng($imgShadow,$path.'Shadow.png',9,PNG_ALL_FILTERS);
            }
            
            imagedestroy($img);
            if(isset($imgRotor))imagedestroy($imgRotor);
            if(isset($imgShadow))imagedestroy($imgShadow);
            if(isset($imgTurret))imagedestroy($imgTurret);
            
        }else $error = 'Images for this sprite are missing.';
    }else $error = 'Folder '.$spritename.' can\'t be find !';
}

?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    </head>
    <body style="background-color:#DDD">
        <?=$error?'<b>'.$error.'</b>':''?>
        <? if(isset($ok) && $ok){ ?>
        	<?php  if(isset($okTurret) && $okTurret){?>
            	<img src="<?=$path.'Body.png'?>" style="float:left"/>            
            	<img src="<?=$path.'Turret.png'?>" style="float:left" />
            <?php }else{ ?>
            	<img src="<?=$path.'.png'?>" style="float:left"/>
            <?php } ?>  
            <?php  if(isset($okShadow) && $okShadow){?>
    			<img src="<?=$path.'Shadow.png'?>" style="float:left"/>            
	        <?php } ?>                   
        	<?php  if(isset($okRotor) && $okRotor){?>
            	<img src="<?=$path.'Rotor.png'?>" style="float:left"/>            
            <?php } ?>          
            <div style="clear:both"></div>
        <? } ?>
        <form action="" method="get">
            <input type="text" name="spritename" value="<?=isset($spritename)?htmlentities($spritename):''?>" />
            <br />
            <label><input type="checkbox" name="separateShadow" value="1"<?=isset($separateShadow)?' checked="checked"':''?>/> Separate Shadow</label>
            <br />
            <input type="submit" name="submitter" value="Générer" />
        </form>

    </body>
</html>

