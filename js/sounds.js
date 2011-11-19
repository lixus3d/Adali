
OBJECTS.sounds = function(){
    
    var sounds = this;
    
    this.audioFiles = {
        move: 6,
        moving: 3,
        attack: 5,
        fire: 3,
        explosion: 3,
        select: 5,
        ready: 1
    };
    
    this.channels = [];
    this.channel = 0;
    this.maxChannel = 8;
    
    this.init = function(){
        // preloading all sounds
        $.each(sounds.audioFiles,function(filename,count){
            for(var i=1;i<=count;i++){
                $('body').append($('<audio src="./sounds/'+filename+''+i+'.wav" preload="auto"></audio>'));            
            }
        });
    };
    
    
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


