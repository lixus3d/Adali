/**
 * Helper for playing sounds 
 * @returns {OBJECTS.sounds}
 * @author Lixus3d <developpement@adreamaline.com>
 * @date 20 nov. 2011
 */
OBJECTS.sounds = function(){
    
    var sounds = this;
    
    /**
     * List of available sounds 
     */
    this.audioFiles = {
    	artillery: 3,
        attack: 5,
        canon: 3,
        explosion: 3,
        missile: 2,
        move: 6,
        moving: 3,
        place: 1,
        poweroff: 1,
        poweron: 1,
        ready: 1,
        rifle: 3,
        rifle2: 3,
        rocket: 2,
        select: 5
    };
    
    this.channels = [];
    this.channel = 0;
    this.maxChannel = 8;
    
    /**
     * Init the sounds object 
     */
    this.init = function(){
    	
        // preloading all sounds
        $.each(sounds.audioFiles,function(filename,count){
            for(var i=1;i<=count;i++){
                $('body').append($('<audio src="./sounds/'+filename+''+i+'.wav" preload="auto"></audio>'));            
            }
        });
        
    };
    
    /** 
     * Play a particular sound ( by it's filename, without the number) 
     */
    this.play = function(filename){
        var count = sounds.audioFiles[filename];
        i = 1 + Math.floor(Math.random()*(count-0.1));
        if(!this.channels[this.channel]){ 
            this.channels[this.channel] = new Audio();            
            this.channels[this.channel].volume = 0.5;
        }
        else this.channels[this.channel].pause();
        this.channels[this.channel].src = './sounds/'+filename+''+i+'.wav';
        
        this.channels[this.channel].play();
        if( this.channel++ > this.maxChannel) this.channel = 0;        
    };
    
    this.init();
};


