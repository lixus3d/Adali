
OBJECTS.teams = function (){
    
    var teams = this;
    
    this.list = [];
    
    this.addTeam = function(team){
        this.list.push(team);
        team.setId(this.list.length-1);
    }       
    
}


