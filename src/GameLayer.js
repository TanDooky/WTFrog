var GameLayer = cc.LayerColor.extend( {
    init: function () {
        this._super( new cc.Color4B( 50, 150, 80, 200 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
        
        this.state = 0;
        this.score = 0;;
        
        this.createBackground( 0 );       

        this.word = new Word();
        this.addChild( this.word );
        this.word.scheduleUpdate();

        this.checkLife = true;
        this.lifeScore = 10;


        this.isCompleteArr = new Array( false, false, false, false, false );

        this.setKeyboardEnabled( true );

        return true;
    },
    
    addAll: function() {
        this.scheduleOnce( function() {
            this.createBackground( 1 );
            this.createFrog();
            this.createTime();
            this.createCave();
            this.createFlag();
            this.createCarArr();
            this.createAllLeafs();
            this.createAllWoods();
            this.createLife();
            this.createGhost();
            this.createTrain();    
            this.showScore();
            this.scheduleUpdate();
        }, 3);
    },

    onKeyDown: function ( e ) {
        
        if( this.state == 0 ) { 
        
            this.state = 1;
            this.removeChild( this.word );
            this.background.runAction(cc.FadeOut.create(0.5));
            this.level( this.state );
            this.addAll();
        
        } else if ( this.state != 0 ) {

            this.frog.switchDirection( e );
            this.frog.move();
        } 

    },
    onKeyUp: function () {
        this.frog.switchDirection( 0 );
    },
    
    createGhost: function() {
        this.ghost = new Ghost( this );
        var rand = Math.round( Math.random() * 4 );

        if ( this.isCompleteArr[rand] == true ) {
            this.ghost.setVisible( false );
        }
        
        this.ghost.setPosition( new cc.Point( 80 + ( 160 * rand ), 510 ) );
        this.addChild( this.ghost );
    },
    resetGhost: function() {
        this.removeChild( this.ghost );
        this.createGhost();
    },

    createFrog: function () {

        this.frog = new Frog();
        this.addChild( this.frog );
        this.frog.setZOrder( 1 );

    },
    createTrain: function() {
        var type = Math.round( Math.random() );
        this.train = new Train( type, this );
        this.addChild( this.train );
        this.train.scheduleUpdate();
    },
    resetTrain: function() {
        this.removeChild( this.train );
        this.createTrain();
    },

    createBackground: function( index ) {
        this.background = new Background( index );
        this.background.setOpacity(0);
        this.addChild( this.background );
        this.background.runAction(cc.FadeIn.create(0.4));
    },

    createTime: function () {
        this.times = new Time( this );
        this.addChild( this.times );
        this.times.scheduleUpdate();
    },

    //Create Life
    createLife: function () {
        this.lifeScoreArr = new Array();

        for ( var i = 0; i < this.lifeScore; i++ ) {
            this.lifeScoreArr[i] = cc.Sprite.create( 'images/life.png' );
            this.lifeScoreArr[i].setPosition( cc.p( 760 - ( i * 50 ) , 570 ));
            this.addChild( this.lifeScoreArr[i] );
        }

    },
    updateLife: function( amt ) {
       this.lifeScore = this.lifeScore + amt;
       this.removeChild( this.lifeScoreArr[this.lifeScore]);
    },

     /////////    FLAG    ////////////
    createFlag: function () {
        this.flagArr = new Array();

        for ( var i = 0; i < 5; i++ ) {
            this.flagArr[i] = new Flag();
            this.flagArr[i].setPosition( new cc.Point( 80 + ( 160 * i ), 520 ) );
            this.addChild( this.flagArr[i] );
            this.flagArr[i].setVisible( false );
        }

    },

    /////////    CAVE    ////////////
    createCave: function () {
        this.caveArr = new Array();

        for ( var i = 0; i < 5; i++ ) {
            this.caveArr[i] = new Cave();
            this.caveArr[i].setPosition( new cc.Point( 80 + ( 160 * i ), 520 ) );
            this.addChild( this.caveArr[i] );
        }

    },

    /////////    CAR    ////////////
    createCar: function ( index ) {
        var randomPosX = Math.round( Math.random() * 8 ) * 150;
        var posY = new Array( 100, 140, 180);

        var car = new Car( index , this );
        car.setPosition( new cc.Point( randomPosX, posY[index % 3] ) );

        return car;
    },
    createCarArr: function () {
        this.carArr = new Array();

        for ( var i = 0; i < 9; i++ ) {
            this.carArr[i] = this.createCar( i );
            this.addChild( this.carArr[i] );
            this.carArr[i].scheduleUpdate();
        }

    },
    resetCar: function() {
        for ( var i = 0; i < this.carArr.length; i++ ) {
            this.removeChild( this.carArr[i] );
        }

        this.createCarArr();
    },

     /////////    LEAF   ////////////
    createLeafs: function ( amt ) {
        this.leafs = new Array();

        for ( var i = 0; i < amt; i++ ) {
            this.leafs[i] = new Leaf( amt, this );
            this.leafs[i].setPosition( new cc.Point( i * 40, 0 ) );
        }

        return this.leafs;
    },
    createOneRowLeafs: function ( amt ) {
        this.leafsArr = new Array();
        var form = new Array( 200, 500, 800, 1100 );

        for ( var i = 0; i < 4; i++ ) {
            this.leafsArr[i] = this.createLeafs( amt );
            for( var j = 0; j < amt; j++ ) {
                var xPos = this.leafsArr[i][j].getPositionX();
                this.leafsArr[i][j].setPosition( new cc.Point( form[i] + xPos, 0 ) );
            }
        }

        return this.leafsArr;
    }, 
    createAllLeafs: function () {
        this.allLeaf = new Array( this.createOneRowLeafs( 3 ), this.createOneRowLeafs( 4 ), this.createOneRowLeafs( 3 ) );
        var yPosArr = new Array( 260, 380, 460 );

        for ( var i = 0; i < this.allLeaf.length; i++ ) {
            for ( var j = 0; j < this.allLeaf[i].length; j++) {
                for( var k = 0; k < this.allLeaf[i][j].length; k++ ) {
                    this.allLeaf[i][j][k].setPositionY( yPosArr[i] );
                    this.addChild( this.allLeaf[i][j][k] );
                    this.allLeaf[i][j][k].scheduleUpdate();
                }
            }
        }

    },

    /////////    WOOD    ////////////
    createWood: function ( amt ) {
        this.woodArr = new Array();
        var xPosArr = new Array( 200, 500, 800 );
        var yPosArr = new Array ( 300, 420 );
        
        for ( var i = 0; i < 3; i++ ) {
            this.woodArr[i] = new Wood( amt );
            this.woodArr[i].setPosition( new cc.Point( xPosArr[i], yPosArr[ amt - 3 ] ) );
        }

        return this.woodArr;
    },
    createAllWoods: function () {
        this.allWoods = new Array( this.createWood( 3 ), this.createWood( 4 ) );
        
        for ( var i = 0; i < this.allWoods.length; i++ ) {
            for ( var j = 0; j < this.allWoods[i].length; j++ ) {
                this.addChild( this.allWoods[i][j] );
                this.allWoods[i][j].scheduleUpdate();
            }
        }

    },

    /////////    CHECK    ////////////
    checkSide: function() {

        if ( this.frog.getPositionX() < 1 || this.frog.getPositionX() > 799 ) {   
            this.updateLife( -1 );
            this.regame();
        }

    },
    checkCompleteLevel: function() {
       
        for ( var i = 0; i < 5; i++ ) {
            this.isCompleteArr[i] = !this.caveArr[i].getAvailable();
        }

        if ( this.checkNumPass() == 5 ) {
            this.state++;
            this.frog.unscheduleUpdate();

                for ( var i = 0; i < 5; i++ ){
                    this.flagArr[i].setVisible( false );
                }

                for ( var i = 0; i < 5; i++ ){
                    this.isCompleteArr[i] = false;
                }

                for ( var i = 0; i < 5; i++ ){
                    this.caveArr[i].setAvailable( true );
                } 

            this.removeAllChildren();
            this.level( this.state );
            this.addAll();
        } 
        
    },
    checkNumPass: function() {
        var count = 0;
        for ( var i = 0; i < 5; i++ ) {
            if ( this.isCompleteArr[i] == true ) {
                count++;
            }
        }
        return count;
    },

    checkCave: function() {
        if ( this.ghost.hit( this.frog ) ) {
            this.ghost.checkDie( this.frog );
        }
        else {
            for ( var i = 0; i < this.caveArr.length; i++ ){
                if (this.caveArr[i].checkFinish( this.frog )){
                    this.score = this.score + ( this.state * ( this.times.getPositionX() + 500 ) );
                    this.flagArr[i].setVisible( true );
                    this.regame();
                    this.resetCar(); 
                    this.resetTrain();
                }
            }
        }

    },
    checkWater: function() {

         if ( this.checkLife ) {
           if ( this.frog.getPositionY() >= 260 && this.frog.getPositionY() != 340) {
                this.regame();
                this.updateLife( -1 );
                this.resetCar();
                this.resetTrain(); 
            }
        }

    },
    regame: function() {

        if( this.checkNumPass() < 3 ) {
            this.resetGhost();
        }
        else {
            this.removeChild( this.ghost );
            this.ghost.setPosition( new cc.Point( 800, 600 ) )
        }

        this.frog.reborn();
        this.createTime(); 
        this.score = this.score - 100;  
    },

    ///  Label  ////
    gameOver: function() {
        this.removeAllChildren();
        this.gameOverLabel = cc.LabelTTF.create( '      Game Over       ', 'Arial', 40 );
        this.gameOverLabel.setPosition( new cc.Point( 400, 300 ) );
        this.addChild( this.gameOverLabel );
    },
    level: function( num ) {
        this.levelLabel = cc.LabelTTF.create( '  Level  ' + num , 'Arial', 40 );
        this.levelLabel.setPosition( new cc.Point( 400, 300 ) );
        this.addChild(this.levelLabel);
        this.scheduleOnce(function() {
            this.removeChild( this.levelLabel );
        }, 3);
    },
    showScore: function() {
        this.scoreLabel = cc.LabelTTF.create( ' Score : ' + this.score, 'Arial', 30 );
        this.scoreLabel.setPosition( new cc.Point( 100, 570 ) );
        this.addChild( this.scoreLabel );
    },
    updateScore: function() {
        this.removeChild( this.scoreLabel );
        this.showScore();
    }, 

    /////////    UPDATE    ////////////
    update: function( dt ) {
        
        if ( this.state != 0  ) {
            
            this.times.checkDie(); 

            this.checkSide();

            for ( var i = 0; i < this.carArr.length; i++ ) {
                this.carArr[i].checkDie( this.frog );
            }
                
            this.train.checkDie( this.frog ); 
    

            this.checkLife = this.frog.moveWithLeaf( this.allLeaf );
            
            this.checkLife = this.frog.moveWithWood( this.allWoods, this.checkLife );

            this.checkCave();
  
            this.checkWater();

            this.checkLife = true;

            this.updateScore();

            this.checkCompleteLevel();

            if ( this.lifeScore == -1 ) {
                this.gameOver();
                this.removeChild( this.frog );
                this.state = 99;
            }
            
        } 

    }

});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});

 GameLayer.STATES = {
    FRONT: 0,
    LEVEL_1: 1,
    LEVEL_2: 2,
    ENDED: 3
 };