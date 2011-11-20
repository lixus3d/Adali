/**
 * References all teams  
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.teams = function (){
    
    var teams = this;
    
    teams.list = [];
    
    teams.addTeam = function(team){
        this.list.push(team);
        team.setId(this.list.length-1);
    };       
    
};


