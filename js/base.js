/**
 * Create the base namespace and interface principe
 * @author Lixus3d <developpement@adreamaline.com>
 */

/**
 * Namespace for interfaces
 */
var INTERFACES = {
		
	/**
	 * Check if myinterface is correctly implemented in object , basic testing but helpfull
	 * @param {Object} object
	 * @param {Interface} myinterface
	 * @returns {Boolean}
	 * @author Lixus3d <developpement@adreamaline.com>
	 * @date 16 nov. 2011
	 */
    checkInterface: function(object,myinterface){
        for(var member in myinterface){
            if( (typeof object[member]) != (typeof myinterface[member])){
                throw 'Interface '+myinterface+ ' badly implemented in '+object+', member "'+member+'" is missing or not of the same type.';
                return false;
            }
        }
    }
};

/**
 * Namespace for abstract classes
 * TODO : maybe it can be collapse with objects
 */
var ABSTRACTS = {};

/**
 * Namespace for basic objects
 */
var OBJECTS = {};
