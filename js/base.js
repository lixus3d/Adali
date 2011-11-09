
var INTERFACES = {
    checkInterface: function(object,myinterface){
        for(var member in myinterface){
            if( (typeof object[member]) != (typeof myinterface[member])){
                throw 'Interface '+myinterface+ ' badly implemented in '+object+', member "'+member+'" is missing or not of the same type.';
                return false;
            }
        }
    }
};

var ABSTRACTS = {};

var OBJECTS = {};
