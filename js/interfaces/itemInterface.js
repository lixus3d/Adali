
/**
 * Defines all function necessary for an item
 * Some testing are done during the RTS start and block if a function is not implemented 
 */
INTERFACES.itemInterface = {
    init: function(){},
    activate: function(){},
    initWeapon: function(){},
    kill: function(){},
    addWeapon: function(){},
    setPosition: function(){},
    getPosition: function(){},
    setId: function(){},
    getId: function(){},
    makeDom: function(){},
    draw: function(){},   
    updateJauge: function(){},   
    activateControl: function(){},   
    select: function(){},   
    unselect: function(){},   
    doAction: function(){},   
    tick: function(){},   
    attack: function(){},   
    fire: function(){},   
    touch: function(){},   
    setDirection: function(){},   
    setTurretDirection: function(){},   
    inSight: function(){},   
    enemyInSight: function(){},       
    toString: function(){return 'itemInterface';}
};
