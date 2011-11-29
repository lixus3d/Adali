/**
 * Every rules related to buildings 
 */
RULES.building = {

	/*---------------------
	 		STRUCTURES
	 -----------------------*/
		
	/*
     * Default Base : constructionSite
     */
	constructionSite: {
		sType: 'building',
		type: 'construction',
		price: 3000,
		life: 3000,
		powerDrain: 100,
		powerProduce: 300,
		turret: false,
		speed: 0,
		sight: 10, // view up to x nodes
		imageClass: 'constructionSite',
		footprint: [[1,0],[0,-1],[1,-1]], // ground foot print , determine wich node is occupied by the building
		weapon: [],
		requiredType: ['power']
	},


	/*
     * Small Power Station
     */
	smallPower: {
		sType: 'building',
		type: 'power',
		price: 700,
		life: 1000,
		powerDrain: 10,
		powerProduce: 700,
		turret: false,
		speed: 0,
		sight: 4, // view up to x nodes
		imageClass: 'smallPower',
		footprint: [[1,0],[0,-1],[1,-1]], // ground foot print , determine wich node is occupied by the building
		weapon: []
	},

	/*
     * Refinery
     */
	refinery: {
		sType: 'building',
		type: 'refinery',
		price: 2000,
		life: 2000,
		powerDrain: 400,
		powerProduce: 0,
		turret: false,
		speed: 0,
		sight: 5, // view up to x nodes
		imageClass: 'refinery',
		weapon: [],
		requiredType: ['power']
	},

	/*
     * Factory : Product vehicles
     */
	factory: {
		sType: 'building',
		type: 'factory',
		price: 20,
		life: 25,
		powerDrain: 500,
		powerProduce: 0,
		turret: false,
		speed: 0,
		sight: 2, // view up to x nodes
		imageClass: 'factory',
		weapon: [],
		footprint: [[1,0],[0,-1],[1,-1]], // ground foot print , determine wich node is occupied by the building
		popOffset: {x: -70, y:5},
		requiredType: ['power','refinery']
	},

	/*
     * Helipad
     */
	helipad: {
		sType: 'building',
		type: 'helipad',
		price: 2000,
		life: 2500,
		powerDrain: 375,
		powerProduce: 0,
		turret: false,
		speed: 0,
		sight: 6, // view up to x nodes
		imageClass: 'armory',
		weapon: [],
		constructionSite: 'armory',
		requiredType: ['power','refinery']
	},
	
	/*---------------------
		DEFENSES
	-----------------------*/
	rifleTurret: {
		sType: 'defense',
		type: 'defense',
		price: 70,
		life: 120,
		powerDrain: 105,
		powerProduce: 0,
		turret: true,
		speed: 0,
		sight: 7, // view up to x nodes
		imageClass: 'rifleTurret',
		weapon: ['30mm'],
		constructionSite: 'constructionSite',
		requiredType: ['smallPower','refinery'],
		yOffset: {x:0,y:7},
	}
};
