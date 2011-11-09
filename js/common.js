
function log(e){
    if(window.console){
        console.log(e)
    }
}

function microtime(){
    return new Date().getTime();
}


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


