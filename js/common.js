/**
 * Common functions I use
 */

/**
 * easy access to console.log 
 * @param e
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 16 nov. 2011
 */
function log(e){
    if(window.console){
        console.log(e)
    }
}
/**
 * Quicker access to getTime 
 * @returns
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 16 nov. 2011
 */
function microtime(){
    return new Date().getTime();
}


/**
 * Shuffle an array like php array_shuffle
 * @param myArray
 * @returns {Boolean}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 16 nov. 2011
 */
function array_shuffle(myArray){
    var i = myArray.length ;
    if( i == 0) return false;
    while(--i){
        var j = Math.floor(Math.random() * (i+1));
        var tempj = myArray[j];
        myArray[j] = myArray[i];
        myArray[i] = tempj;
    }
}


