/**
 * References all teams  
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.teams = function (){
    
    var teams = this;
    
    teams.list = [];
    
    /**
     * Add a team to the team's list
     * @param {OBJECTS.team} team
     * @author Lixus3d <developpement@adreamaline.com>
     * @date 20 nov. 2011
     */
    teams.addTeam = function(team){
        this.list.push(team);
        team.setId(this.list.length-1);
    };       
    
};


