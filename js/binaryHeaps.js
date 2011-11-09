
var heaps = function(){
    
    this.elements = [];
    this.forces= [];
    
    this.getFirst = function(){
        return this.elements[0];
    };
    
    this.getSize = function(){
        return this.elements.length;
    };
    
    this.addElement = function(id,force){        
        this.elements.push(id);
        this.forces[id] = force;        
        this.sortElement(this.elements.length - 1)
    };

    /*
     * We always remove the first item in a binary heaps ( i think ? )
     */
    this.delFirst = function(){ 
        var eSize = this.elements.length - 1;
        if(eSize){ // si on a plus d'un element
            this.elements[0] = this.elements[eSize];
            this.elements.pop();
            eSize--; // we have delete one element

            var v = 1;
            var id = this.elements[v-1];

            while(1){
                u = v;
                if(2*u+1 <= eSize){
                    if( this.cost(this.elements[u-1]) >= this.cost(this.elements[2*u-1])) v = 2*u;
                    if( this.cost(this.elements[v-1]) >= this.cost(this.elements[2*u])) v= 2*u+1;
                }else if(2*u <= eSize){
                    if( this.cost(this.elements[u-1]) >= this.cost(this.elements[2*u-1])) v = 2*u;
                }

                if(u!=v){
                    this.elements[u-1] = this.elements[v-1];
                    this.elements[v-1] = id;
                }else break;

            }
        }else{
            this.elements.length = 0;
        }
    };
     
    /*
     * Sort the Element at m position 
     */
    this.sortElement = function(m){
        id = this.elements[m];
        while(m!=0){
            middle = Math.floor(m/2);
            if( this.cost(this.elements[m]) <= this.cost(this.elements[middle]) ){                
                this.elements[m] = this.elements[middle];
                this.elements[middle] = id;
                m = middle;
            }else break;
        }        
        
    };
    
    this.changeElement = function(id,force){
        var position = this.elements.indexOf(id);
        if(position!=-1){
            this.forces[id] = force;
            this.sortElement(position);
        }
    };
    
    this.inList = function(id){
        return this.elements.indexOf(id) != -1;        
    };
    
    this.cost = function(id){
        return this.forces[id];
    };
    
    this.clear = function(){
        this.elements.length = 0;
        this.forces.length = 0;
    };
}

