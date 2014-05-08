var Cave = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.available = 1;
        this.initWithFile( 'images/cave.png' );
   	},

   	checkFinish: function ( frog ) {
   		var frogPos = frog.getPosition();
   	    var cavePos = this.getPosition();

   	    if ( this.available == 1 ){
            if ( frogPos.y > 460 && Math.abs( frogPos.x - cavePos.x ) <= 20 ) {
                this.available = 0 
                return true;
            }

        }
        
        return false;
   	},
    getAvailable: function() {
        return this.available;
    },
    setAvailable: function( e ) {
        this.available = e;
    }
});