/*********************************************************************
 * Game1 - Client-Side Game in Javascript
 *
 * Simple Asteroid scroller

 @TODO - Add in Asteroid and Player sprites
 @TODO - Fix pixel collision detection / Find better collision method.
 ********************************************************************/
var FPS = 60;
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / FPS);
        };
})();


var playerImgs = ["img/Ship.png"];
var asteroidImgs = ["img/enemy.png"];



/************************************************
 *
 * Game Area and Canvas Globals
 *
 ***********************************************/
var CANVAS;
var CTX;

/***********************************************
 *
 * Game State Variables
 *
 **********************************************/
var gameTime = 0;
var isGameOver = false;

var player;
var maxSpd = 250;
var bombs = 3;

var asteroids = [];
var asteroidSpeed = 100;

var bombsArr = [];

var quad;

var score = 0;
var scoreEl = document.getElementById('score');

var Mouse = {
	x: 0,
	y: 0
}

var xOffset, yOffset;

/*********************************************************************
 *
 * Initialize necessary game data
 *
 ********************************************************************/
var lastTime;
function init() {
    
    CANVAS = document.getElementById('gameCanvas');
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
    CTX = CANVAS.getContext("2d");
    
	document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    document.getElementById('toggleInstruction').addEventListener('click', function() {
        toggleInstructions();
    })
    
    document.addEventListener('resize', resize, false);

	//Create the player instance and assign the avatar
	player = new Player(new Sprite(playerImgs[0], [0, 0], [46, 46]), [CANVAS.width / 2, CANVAS.height * .75], maxSpd);
	
    reset();
	lastTime = Date.now();

    quad = new QuadTree(0, new Rectangle(0, 0, CANVAS.width, CANVAS.height));

    //Load our sprites
    Resources.load(playerImgs);
    Resources.load(asteroidImgs);
    Resources.onReady(main);
}

function main() {
	
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;
	
	update(dt);
	render();
	
	lastTime = now;
	requestAnimFrame(main);
}

function update(dt) {
	gameTime += dt;
	
    handleInput(dt);
	updateEntities(dt);
	
	//Update to use animation for asteroid
	if(Math.random() < 1 - Math.pow(.993, gameTime) && !isGameOver) {
        asteroids.push({
            pos: [Math.random() * (CANVAS.width - 39),
                  0],
            sprite: new Sprite('img/enemy.png', [0, 0], [29, 29])
        });
    }
	
	quad.clear()
	quad.insert()
	
	checkCollisions();

    scoreEl.innerHTML = "Score: "+score;
}

function updateEntities(dt) {

    player.sprite.update(dt);

    for(var i = 0; i < bombsArr.length; i++) {
        if(bombsArr[i] == null)
            continue;
        
        if(bombsArr[i].sprite.script()) {
            bombsArr.splice(i, 1);
            i--;
        }
    }

    for(var i = 0; i < asteroids.length; i++) {
        asteroids[i].pos[1] += asteroidSpeed * dt;
        asteroids[i].sprite.update(dt);

        //Remove if offscreen
        if(asteroids[i].pos[1] + asteroids[i].sprite.size[1] > CANVAS.height) {
            asteroids.splice(i, 1);
            i--;
            if(!isGameOver)
                score += 1;
        }
    }
}

function render() {
    
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
    if(!isGameOver) {
        renderEntity(player);
    }
    
    //Render other things
    renderEntities(asteroids);
    renderEntities(bombsArr);
};

function renderEntities(list) {
    for(var i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    CTX.save();
    CTX.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(CTX);
    CTX.restore();
}

function checkCollisions() {
    checkPlayerBounds();

    for(var i=0; i<asteroids.length;i++) {
        var pos = asteroids[i].pos;
        var size = asteroids[i].sprite.size;

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            gameOver();
            asteroids.splice(i, 1);
            i--;
        }
        
        for(var j=0; j<bombsArr.length;j++) {
            
            if(boxCollides(pos, size, bombsArr[j].pos, [bombsArr[j].sprite.d, bombsArr[j].sprite.d])) {
                asteroids.splice(i, 1);
                i--;
            }
            break;
        }
    }
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += player.maxSpeed * dt;
    } else if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= player.maxSpeed * dt;
    }
    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= player.maxSpeed * dt;
    } else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += player.maxSpeed * dt;
    }

    if(input.keyUp('SPACE') && bombs > 0 && !isGameOver) {
        var ind = document.getElementById('bombs-remaining-'+bombs);
        ind.style.background = '#2C2C2C';
        bombsArr.push({
            pos: [player.pos[0], player.pos[1]],
            
            sprite: new Wave(player.sprite.size[0] / 2, player.sprite.size[1] / 2, 1, 30)
        });
        bombs--;
        gameTime = 0;
    }
}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
    //Submit Score...etc
}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;
    bombs = 3;
    for(var i=1;i<4;i++) {
        document.getElementById('bombs-remaining-'+i).style.background = '#00FFFF';
    }

    asteroids = [];

    player.pos = [CANVAS.width / 2, CANVAS.height * .75];
}

function resize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
}

function toggleInstructions() {
    document.getElementById('instructions').style.display = document.getElementById('instructions').style.display === 'none' ? 'block' : 'none';
    document.getElementById('toggleInstruction').innerHTML = document.getElementById('instructions').style.display === 'none' ? 'Show Instruction' : 'Hide Instruction';
}

/**************************************
 *
 * Collision_Handling
 *
 *************************************/
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
            b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

//TODO Fix/Test the canvas cross-origin tainted with http:// instead of file://
function pixelCollision(ctx, ent1, ent2, isCentered) {
    
    var x = ent1.pos[0],
        y = ent1.pos[1],
        x2 = ent2.pos[0],
        y2 = ent2.pos[1];
        
    x = Math.round(x);
    y = Math.round(y);
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    
    var imgDat1 = ctx.getImageData(ent1.pos[0], ent1.pos[1], ent1.sprite.size[0], ent1.sprite.size[1]),
        imgDat2 = ctx.getImageData(ent2.pos[0], ent2.pos[1], ent2.sprite.size[0], ent2.sprite.size[1]);
    
    var w = imgDat1.width,
        h = imgDat1.height,
        w2 = imgDat2.width,
        h2 = imgDat2.height;
        
    if(isCentered) {
        x -= (w/2 + 0.5) << 0;
        y -= (y/2 + 0.5) << 0;
        x2 -= (x2/2 + 0.5) << 0;
        y2 -= (y2/2 + 0.5) << 0;
    }
    
    var xMin = Math.min(x, x2),
        yMin = Math.min(y, y2),
        xMax = Math.max(x, x2),
        yMax = Math.max(y, y2);
        
    if( xMin >= xMax || yMin >= yMax) {
        return false;
    }
    
    var xDiff = xMax - xMin,
        yDiff = yMax - yMin;
        
    var pixels = imgDat1.data,
        pixels2 = imgDat2.data;
    
    for(var pixelX = xMin; pixelX < xMax; pixelX++) {
        for(var pixelY = yMin; pixelY < yMax; pixelY++) {
            if(
                (pixels[((pixelX - x) + (pixelY - y) *w) * 4 + 3] !== 0)
            &&
                (pixels2[((pixelX - x2) + (pixelY - y2) * w) * 4 + 3] !== 0)
            ) {
                return true;
            }
        }
    }
    return false;
}

//Keep the player within the bounds of the level
function checkPlayerBounds() {
    //Subtract the player's speed for perfect collisions
    //at higher velocity
    if(player.pos[0] < 0 - player.speed[0]) {
        player.pos[0] = 0 - player.speed[0];
    } else if(player.pos[0] > CANVAS.width - player.sprite.size[0] - player.speed[0]) {
        player.pos[0] = CANVAS.width - player.sprite.size[0] - player.speed[0];
    }
    if(player.pos[1] < 0 - player.speed[1]) {
        player.pos[1] = 0 - player.speed[1];
    } else if(player.pos[1] > CANVAS.height - player.sprite.size[1] - player.speed[1]) {
        player.pos[1] = CANVAS.height - player.sprite.size[1] - player.speed[1];
    }
}

var Game = {
	init: init
};

/********************************************
 *
 * Utilities
 *
 *******************************************/
//Input Utility
(function() {
    var pressedKeys = {};
    var registerOnce;
    var keyUp;

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
        if(status === false) {
            registerOnce = true;
            keyUp = key;
        }
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },

        keyUp: function(key) {
            if(!pressedKeys[key.toUpperCase()] && registerOnce) {
                if(key.toUpperCase() === keyUp) {
                    keyUp = "";
                    registerOnce = false;
                    return true;
                }
            }
        }
    };
})();

//Resources Utility
(function() {
	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];

	//Load an image url or an array of image urls
	function load(urlOrArr) {
		if(urlOrArr instanceof Array) {
			urlOrArr.forEach(function(url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	}

	function _load(url) {
		if(resourceCache[url]) {
			return resourceCache[url];
		} else {
			var img = new Image();
			
			img.onload = function() {
			    img.crossOrigin = "Anonymous";
			    
				resourceCache[url] = img;
				
				if(isReady()) {
					readyCallbacks.forEach(function(func) { func(); });
				}
			};
			resourceCache[url] = false;
			img.src = url;
			
		}
	}

	function get(url) {
		return resourceCache[url];
	}

	function isReady() {
		var ready = true;
		for(var k in resourceCache) {
			if(resourceCache.hasOwnProperty(k) &&
			!resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	}

	function onReady(func) {
		readyCallbacks.push(func);
	}

	window.Resources = {
		load: load,
		get: get,
		isReady: isReady,
		onReady: onReady
	};
}) ();

/********************************************
 *
 * Object Definitions/Declarations
 *
 *******************************************/
 
 function Sprite(url, pos, size, speed, frames, dir, once) {
    this.url = url;
    this.pos = pos;
    this.size = size;
    this.speed = typeof speed === 'number' ? speed : 0;
    this.frames = frames;
    this._index = 0;
    this.dir = dir || 'horizontal';
    this.once = once;
    
    this.update = function(dt) {
        this._index += this.speed * dt;
    };
    
    this.render = function(ctx) {
        var frame;
        
        if(this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            
            frame = this.frames[idx % max];
            if(this.once && idx >= max) {
                this.done = true;
                return;
            }
        } else {
            frame = 0;
        }
        
        var x = this.pos[0];
        var y = this.pos[1];
        
        ctx.drawImage(Resources.get(this.url),
                                    x, y,
                                    this.size[0], this.size[1],
                                    0, 0,
                                    this.size[0], this.size[1]);
    };
 }
 
 function Player(sprite, pos, maxSpeed) {
    this.sprite = sprite;
    this.pos = pos || [0, 0];
    this.maxSpeed = maxSpeed;
    this.speed = [0,0];
 }
 "use strict"
 function Wave(xx, yy, dd, ee) {
    this.OUTLINE = "#FFFFFF";
    this.WEIGHT = 2.0;
    this.LIMIT = 1.3;
    
    this.pos = [0, 0];
    
    this.pos[0] = xx;
    this.pos[1] = yy;
    this.d = dd;
    this.e = ee;
    
    this.waveUpdate = function() {
        this.d += this.e;
    };
    
    this.render = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.OUTLINE;
        ctx.ellipse(this.pos[0], this.pos[1], this.d, this.d, 0, 0, 2 * Math.PI, false);
        ctx.stroke();
    };
    
    this.gotTooBig = function() {
        return this.d > CANVAS.width*this.LIMIT;
    };
    
    this.script = function() {
        this.waveUpdate();
        return this.gotTooBig();
    };
 }
