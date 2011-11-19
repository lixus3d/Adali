
OBJECTS.menu = function(){

	var menu = this;

	this.dom = $('.menu');
	this.tabsDoms = {};
	this.itemsDoms = {};

	this.powerJaugeHeight = 400;

	/*
     * Get every jquery's menu elements
     */
	this.init = function(){

		this.domCredit = this.dom.find('.credit .sold');
		this.domPower = this.dom.find('.powerJauge');
		this.domConstruction = this.dom.find('.construction');


		this.constructBuildList();
		this.initTabs();
	};

	/*
	 * Construct every build list from configuration
	 */
	this.constructBuildList = function(){

		var RTS = this.getRts();
		var tabLinks = this.dom.find('a[href$=-tab]');

		tabLinks.each(function(){
			var link = $(this);
			var tabId = link.attr('href');

			var list = link.closest('.list'); // we get the closest list parent, and insert the tab
			if( list.find(tabId).length == 0){
				tabIdReal = tabId.substr(1);
				menu.tabsDoms[tabIdReal] = $('<div id="'+tabIdReal+'" class="itemGrid"><ul></ul></div>');
				list.append(menu.tabsDoms[tabIdReal]);
			}
		});

		// we loop on the units configuration to add block and click to construct 
		$.each(RULES,function(type,items){
			$.each(items,function(itemName,item){
				var sType = item.sType;
				if(tabDom = menu.tabsDoms[sType+'s-tab']){
					menu.itemsDoms[itemName] = $('<li class="'+itemName+' available"><a href="#'+itemName+'"><span class="count"></span><label>'+itemName+'</label></a></li>');
					tabDom.find('ul').append(menu.itemsDoms[itemName]);

					menu.itemsDoms[itemName].click(function(){
						if(queue = RTS.motor[type+'Queue']){
							queue.addQueue(type,itemName,RTS.playerTeam);
						}
					});
				}

			});
		});
	};

	this.initTabs = function(){
		var tabLinks = this.dom.find('a[href$=-tab]');
		tabLinks.each(function(){
			var link = $(this);
			var tabId = link.attr('href');

			var tab = $(tabId);
			if(tab.length){
				link.click(function(){
					link.parent().siblings().removeClass('selected');
					link.parent().addClass('selected');
					tab.siblings('[id$=-tab]').hide();
					tab.show();
					return false;
				});
			}
		});
		this.dom.find('.subMenu ul li:nth-child(1) a').click();
	};

	this.updateBuildList = function(){

	};

	/*
     * Ticker that update menu
     */
	this.tick = function(){
		this.updateCredit();
		this.updatePower();
	};

	/*
     * Update credit sold (graphic)
     */
	this.updateCredit = function(){
		this.domCredit.html(this.getMotor().ressources.credits);
	};

	/*
     * Update power Jauge (graphic)
     */
	this.updatePower = function(){
		var MOTOR = this.getMotor();

		this.domPower.find('.producing').css({
			height: MOTOR.ressources.powerProduction / 2000 * menu.powerJaugeHeight
		});
		this.domPower.find('.draining').css({
			height: MOTOR.ressources.powerConsumption / 2000 * menu.powerJaugeHeight
		});

		var pRatio = MOTOR.ressources.powerConsumption / MOTOR.ressources.powerProduction ;

		var pClass = 'good';
		if(pRatio <= 0.9 && pRatio >= 0.5){
			pClass = 'limit';
		}else if( pRatio >= 1){
			pClass = 'low';
		}
		this.domPower.attr('class','powerJauge '+pClass);
	};

	this.init();
};


OBJECTS.menu.prototype = new OBJECTS.baseObject();