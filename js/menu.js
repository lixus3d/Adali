
OBJECTS.menu = function(){

	var menu = this;

	this.dom = $('.menu');
	this.tabsDoms = {};
	this.itemsDoms = {};

	this.powerJaugeHeight = 400;

	/**
     * Get every jquery's menu elements
     */
	this.init = function(){

		this.domCredit = this.dom.find('.credit .sold');
		this.domPower = this.dom.find('.powerJauge');
		this.domConstruction = this.dom.find('.construction');


		this.constructBuildList();
		this.initTabs();
	};

	/**
	 * Construct every build list from configuration
	 */
	this.constructBuildList = function(){

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
					menu.itemsDoms[itemName] = $('<li class="'+itemName+' available"><a href="#'+itemName+'"><span class="progress"></span><span class="count"></span><label>'+itemName+'</label></a></li>');
					tabDom.find('ul').append(menu.itemsDoms[itemName]);

					menu.boxClick(type,itemName,sType);
//					menu.itemsDoms[itemName].click(function(){
//						if(queue = RTS.motor[type+'Queue']){
//							queue.addQueue(type,itemName,sType,menu.getRts().playerTeam);
//						}
//						return false;
//					});
				}

			});
		});
	};
	
	/**
	 * Dynamise click on a particular box 
	 * @param {string} type building or unit 
	 * @param {elementName} elementName
	 * @param {sType} sType aerial, vehicule, etc.
	 */
	this.boxClick = function(type,elementName,sType){
		var RTS = this.getRts();
		
		menu.itemsDoms[elementName].click(function(){
			if(!menu.isReady(elementName)){
				if(queue = RTS.motor[type+'Queue']){
					queue.addQueue(type,elementName,sType,RTS.playerTeam);
				}
			}else{
				var item = new OBJECTS.placement(menu.getRts().playerTeam , 'building', elementName);
				menu.getMotor().selection.addSelection(item);
			}
			return false;
		});		
	};
	
	/**
	 * Init menu tabs 
	 */
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

	/**
     * Ticker that update menu
     */
	this.tick = function(){
		this.updateCredit();
		this.updatePower();
	};

	/**
     * Update credit sold (graphic)
     */
	this.updateCredit = function(){
		this.domCredit.html(Math.floor(this.getMotor().ressources.credits));
	};

	/**
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
			//this.getMotor().sounds.play('poweroff');
		}
		
		this.domPower.attr('class','powerJauge '+pClass);
	};
	
	/**
	 * Update the number of element in the queue of a particular item 
	 * @param {String} elementName
	 * @param {Number} count
	 */
	this.updateCount = function(elementName,count){
		var actualCount = parseInt($('li.'+elementName+' .count').html());
		if(isNaN(actualCount)) actualCount = 0;
		var newCount = actualCount + count; 
		if(newCount>0){
			$('li.'+elementName+' .count').html(newCount);
		}else{
			$('li.'+elementName+' .count').html('');
		}
	};
	
	/**
	 * Update the progress bar of an item in the menu
	 * @param {String} elementName
	 * @param {Number} progress 
	 */
	this.updateProgress = function(elementName,progress){
		$('li.'+elementName+' .progress').css({height: 55*progress});
		
	};
	
	/**
	 * Blink the actual ready element
	 * @param {String} elementName 
	 */
	this.setReady = function(elementName){
		
		var blinker = $('li.'+elementName+' .progress').addClass('ready').stop();
		
		// launch blinking 
		var time = 500;		
		function myShow(){
			blinker.fadeTo(time,1,myHide);
		}		
		function myHide(){
			blinker.fadeTo(time,0,myShow);
		}		
		myShow();		

	};
	
	/**
	 * Unblink the actual ready element
	 * @param {String} elementName
	 */
	this.unsetReady = function(elementName){
		$('li.'+elementName+' .progress').stop().fadeTo(1,0.5).removeClass('ready');
	};
	
	/**
	 * Indicate weither a particular element is ready to place 
	 * @param {String} elementName
	 */
	this.isReady = function(elementName){
		return $('li.'+elementName+' .progress').hasClass('ready');
	};

	this.init();
};


OBJECTS.menu.prototype = new OBJECTS.baseObject();