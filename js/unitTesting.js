/**
 * Do some "unit tests" before launching everything 
 * Not really unit test but some tests to check if everything correctly define 
 * @returns {OBJECTS.unitTesting}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.unitTesting = function(){
    
    var unitTest = this;
    
    /**
     * Launch the test process 
     */
    this.doTest = function(){
    	
        log('do some unit tests');
        
       /*
        * CHECK IMPLEMENTATION OF SOME OBJECTCLASS 
        */       
       var items = ['unit','building'];
       
       for(var i in items){       
           if(OBJECTS[items[i]]){
               var obj = new OBJECTS[items[i]]();
               if(obj.implement){
                   INTERFACES.checkInterface(obj, INTERFACES[obj.implement]);
               }
           }else unitTest.error('member "'+items[i]+'" doesn\'t exist');
       }       
       
       log('unit tests successfull !!!');
    };    
    
    /**
     * Show error and throw it  
     */
    this.error = function(e){
        log('Unit test error :');
        throw e;
    };
    
};

