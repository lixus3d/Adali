

//try {

    $(document).ready(function(){
        $('a[href=#startEngine]').click(function(){
            RTS.motor.start();
            RTS.motor.say('Engine started');
            return false;
        });

        $('a[href=#stopEngine]').click(function(){
            RTS.motor.stop();
            RTS.motor.say('Engine stopped');
            return false;
        });

        $('a[href=#construct]').click(function(){
            var link = $(this);
            var elementType = 'unit';
            var subType = link.attr('rel');
            RTS.motor.unitQueue.addQueue(elementType,subType,team1);
        });
    });

    var unitTesting = new OBJECTS.unitTesting();
    unitTesting.doTest();

    // CREATING THE RTS OBJECT
    var RTS = new OBJECTS.RTS();

    // Initialize some vars
    RTS.offset = 0;
    RTS.grid = 40;
    RTS.isoSize = {x:64, y:38}; // isometric size for the grid
    RTS.isoRatio = 38/64;
    RTS.mapSize = [1000,1000]; // pixelSize
    RTS.tickTime = 5;
    RTS.speedDivide = 50;

    // Map creation
    RTS.map = new OBJECTS.map(RTS.mapSize);

    // Motor init
    RTS.motor = new OBJECTS.motor(RTS.map);
    RTS.motor.map.drawWalls();
    
    // Adding some teams
    var team1 = new OBJECTS.team({player: true});
	RTS.playerTeam = team1;

    var team2 = new OBJECTS.team({player: true, human: false});

    RTS.motor.teams.addTeam(team1);
    RTS.motor.teams.addTeam(team2);

    // Create some unit
    RTS.motor.units.addUnit(new OBJECTS.unit(80,80,team1,'mcv'));
    //RTS.motor.units.addUnit(new OBJECTS.unit(120,80,team1,'tank'));
    //RTS.motor.units.addUnit(new OBJECTS.unit(80,120,team1,'heavyTank'));
    //RTS.motor.units.addUnit(new OBJECTS.unit(120,120,team1,'heavyTank'));
    RTS.motor.units.addUnit(new OBJECTS.unit(200,120,team1,'komX'));
    //RTS.motor.units.addUnit(new OBJECTS.unit(200,80,team1,'artilleryTank'));
    

    //RTS.motor.buildings.addBuilding(new OBJECTS.building(128,208,team1,'constructionSite'));
    //RTS.motor.buildings.addBuilding(new OBJECTS.building(128,308,team1,'smallPower'));
    //RTS.motor.buildings.addBuilding(new OBJECTS.building(256,308,team1,'factory'));
    
    //RTS.motor.buildings.getItemById(1).primary = true;


    RTS.motor.units.addUnit(new OBJECTS.unit(840,350,team2,'tank'));
    RTS.motor.units.addUnit(new OBJECTS.unit(800,400,team2,'tank'));
    RTS.motor.units.addUnit(new OBJECTS.unit(860,410,team2,'heavyTank'));
    RTS.motor.units.addUnit(new OBJECTS.unit(780,450,team2,'heavyTank'));
    RTS.motor.units.addUnit(new OBJECTS.unit(850,440,team2,'artilleryTank'));

    RTS.motor.start();

//}catch(e){
//    log('///// EXCEPTION /////')
//    log(e);
//    if(RTS && RTS.motor){
//        RTS.motor.stop();
//    }
//}