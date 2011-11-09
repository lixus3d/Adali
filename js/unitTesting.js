
OBJECTS.unitTesting = function(){
    
    var unitTest = this;
    
    this.doTest = function(){
        
        log('do some unit tests');
       /*
        * CHECK IMPLEMENTATION OF SOME OBJECTCLASS 
        */
       
       var items = ['unit'];
       
       for(var i in items){       
           if(OBJECTS[items[i]]){
               var obj = new OBJECTS[items[i]]();
               if(obj.implement){
                   INTERFACES.checkInterface(obj, INTERFACES[obj.implement]);
               }
           }else unitTest.error('member "'+items[i]+'" doesn\'t exist');
       }       
       
       log('unit tests successfull !!!');
    }    
    
    this.error = function(e){
        log('Unit test error :');
        throw e;
    }
    
}

