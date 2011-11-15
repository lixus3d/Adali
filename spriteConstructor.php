<?php

/**
 * Tiny script that performs the construction of my buildings and units sprites
 * Just use for the smallPower for now
 */

$error = null;

if(isset($_GET['spritename']) && $spritename = $_GET['spritename']){
    $path = './sources/images/'.$spritename ;
    if(file_exists($path)){
        if($files = glob($path.'/*.png')){
            
            // we get the size of the first image to determine sprite size
            $size = getimagesize($files[0]);
            
            $img = imagecreatetruecolor($size[0],$size[1]*9);
            imagealphablending($img,false);
            imagesavealpha($img, true);
            
            $y = 0;
            foreach($files as $file){
                $sImg = imagecreatefrompng($file);
                imagecopy($img, $sImg, 0, $y, 0, 0, $size[0], $size[1]);
                $y += $size[1];
                imagedestroy($sImg);
            }
            $ok = imagepng($img,$path.'.png',9,PNG_ALL_FILTERS);
            imagedestroy($img);
            
        }else $error = 'Images for this sprite are missing.';
    }else $error = 'Folder '.$spritename.' can\'t be find !';
}

?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    </head>
    <body>
        <?=$error?'<b>'.$error.'</b>':''?>
        <? if(isset($ok) && $ok){ ?>
            <img src="<?=$path.'.png'?>" />       
        <? } ?>
        <form action="" method="get">
            <input type="text" name="spritename" value="<?=isset($spritename)?$spritename:''?>" />
            <input type="submit" name="submitter" value="Générer" />
        </form>

    </body>
</html>

