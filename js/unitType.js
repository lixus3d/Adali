/**
 * Every rules related to units 
 */
RULES.unit = {

	/*
     * MCV
     */
	mcv: {
		sType: 'vehicule',
		price: 3000,
		life: 500,
		turret: false,
		speed: 35,
		sight: 4, // view up to x nodes
		imageClass: 'mcv',
		weapon: [],
		movement: 'tank',
		deploy: 'constructionSite',
		constructionSite: 'factory',
		requiredType: ['factory','repairSite']
	},

	/*
     * TANKS
     */
	tank: {
		sType: 'vehicule',
		price: 500,
		life: 500,
		turret: true,
		speed: 65,
		sight: 4, // view up to x nodes
		imageClass: 'tank',
		weapon: ['90mm'],
		movement: 'tank',
		constructionSite: 'factory',
		requiredType: ['factory']
	},

	heavyTank: {
		sType: 'vehicule',
		price: 900,
		life: 900,
		turret: true,
		speed: 54,
		sight: 4, // view up to x nodes
		imageClass: 'heavyTank',
		weapon: ['90mm','90mm'],
		movement: 'tank',
		constructionSite: 'factory',
		requiredType: ['factory']
	},

	artilleryTank: {
		sType: 'aerial',
		price: 800,
		life: 400,
		turret: false,
		speed: 45,
		sight: 6, // view up to x nodes
		imageClass: 'artilleryTank',
		weapon: ['140mm'],
		movement: 'tank',
		constructionSite: 'factory',
		requiredType: ['factory','radar']
	},

	/*
     * HELICOPTERS
     */
	komX: {
		sType: 'aerial',
		price: 1200,
		life: 500,
		turret: true,
		rotor: true,
		speed: 45,
		sight: 6, // view up to x nodes
		imageClass: 'komX',
		weapon: ['rocket','rocket','15mm','30mm'], // big firepower ^^
		movement: 'helicopter',
		constructionSite: 'helipad',
		requiredType: ['helipad','factory','radar']
	}

};
