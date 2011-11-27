/**
 * Every rules related to weapons 
 */
RULES.weapon = {
    
	/*
	 * RIFLES
	 */	
	'15mm': {
		sound: 'rifle',
		damage: 7,
		speed: 175,
		reloadTime: 0.5,
		imageClass: 'bullet'
	},
	
	'30mm': {
		sound: 'rifle2',
		damage: 14,
		speed: 150,
		reloadTime: 0.9,
		imageClass: 'bullet'
	},
		
	/*
	 * CANONS
	 */
		
    '90mm': {
    	sound: 'canon',
    	damage : 50, 
    	speed: 100,
    	reloadTime: 1.7,
    	imageClass: 'shell'
    },
    
    '140mm': {
    	sound: 'artillery',
    	damage : 100,
    	speed: 100,
    	reloadTime: 3,
    	imageClass: 'shell'
    },
    
    /*
     * ROCKETS
     */
    
    'rocket': {
    	sound: 'missile',
    	damage : 35,
    	speed: 125,
    	reloadTime: 3,
    	imageClass: 'rocket'
    }
    
};