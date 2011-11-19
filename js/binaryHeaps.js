/**
 * My binary heaps implementation
 * inspired by this great tutorial for beginners :
 * - http://www.policyalmanac.org/games/aStarTutorial.htm
 * - http://www.policyalmanac.org/games/binaryHeaps.htm
 * 
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 16 nov. 2011 
 */

/**
 * Heaps object used by a*
 */
var heaps = function(){
    
	/**
	 * Creating two tables : 
	 * - one for the order 
	 * - one for storing element force (F) 
	 */
    this.elements = [];
    this.forces= [];
    
    /**
     * Return the first element of the heaps
     * @returns {number} The id of the first element in the heaps
     */
    this.getFirst = function(){
        return this.elements[0];
    };
    
    /**
     * Return the length of the heaps
     * @returns {number} The elements length
     */
    this.getSize = function(){
        return this.elements.length;
    };
    
    /**
     * Add an element to the heaps, need the id and the force of the element
     * @param {number} id
     * @param {number} force
     */
    this.addElement = function(id,force){        
        this.elements.push(id);
        this.forces[id] = force;        
        this.sortElement(this.elements.length - 1);
    };


    /**
     * Removes the first element of the list 
     * We always remove the first item in a binary heaps ( i think ? )
     */
    this.delFirst = function(){ 
        var eSize = this.elements.length - 1;
        if(eSize){ // if we have more than one element 
            this.elements[0] = this.elements[eSize];
            this.elements.pop();
            eSize--; // we have delete one element

            var v = 1;
            var id = this.elements[v-1];

            while(true){
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
            this.elements.length = 0; // reseting the heaps
        }
    };
     
    /**
     * Sort the Element at m position 
     * @param {number} m
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
    
    /**
     * Updating an element force by id
     * @param {number} id
     * @param {number} force
     */
    this.changeElement = function(id,force){
        var position = this.elements.indexOf(id);
        if(position!=-1){
            this.forces[id] = force;
            this.sortElement(position);
        }
    };
    
    /**
     * Indicate if an id is in the heaps
     * @param {number} id
     * @returns {Boolean} 
     */
    this.inList = function(id){
        return this.elements.indexOf(id) != -1;        
    };
    
    /**
     * Return the force of an element by id
     * @param {number} id
     * @returns {number} The force of the element
     */
    this.cost = function(id){
        return this.forces[id];
    };
    
    /**
     * Reset the heaps
     */
    this.clear = function(){
        this.elements.length = 0;
        this.forces.length = 0;
    };
};

