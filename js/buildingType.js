
RULES.building = {

	/*
     * Default Base : constructionSite
     */
	constructionSite: {
		sType: 'building',
		type: 'construction',
		price: 3000,
		life: 3000,
		power: -50,
		turret: false,
		speed: 0,
		sight: 10, // view up to x nodes
		imageClass: 'constructionSite',
		footprint: [[1,0],[0,-1],[1,-1],[-1,0],[-1,-1]], // ground foot print , determine wich node is occupied by the building
		weapon: [],
		requiredType: ['power']
	},


	/*
     * Small Power Station
     */
	smallPower: {
		sType: 'building',
		type: 'power',
		price: 400,
		life: 1200,
		power: 700,
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
		power: -400,
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
		price: 2000,
		life: 2500,
		power: -500,
		turret: false,
		speed: 0,
		sight: 2, // view up to x nodes
		imageClass: 'factory',
		weapon: [],
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
		power: -350,
		turret: false,
		speed: 0,
		sight: 6, // view up to x nodes
		imageClass: 'armory',
		weapon: [],
		constructionSite: 'armory',
		requiredType: ['power','refinery']
	}
};
