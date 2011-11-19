
OBJECTS.teams = function (){
    
    var teams = this;
    
    teams.list = [];
    
    teams.addTeam = function(team){
        this.list.push(team);
        team.setId(this.list.length-1);
    };       
    
};


