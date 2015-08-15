/*********************************************************************
 * Game1 - Client-Side Game in Javascript
 *
 * Simple Asteroid scroller

 @TODO - Add in Asteroid and Player sprites
 @TODO - Add in bomb effect.
 @TODO - Add in more enemy types
 @TODO - Balance Asteroid generation
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


var playerImgs = ["img/avatar.png"];
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

	//Create the player instance and assign the avatar
	player = new Player(new Sprite(playerImgs[0], [0, 0], [29, 33]), [CANVAS.width / 2, CANVAS.height * .75], maxSpd);
	
    reset();
	lastTime = Date.now();

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
	
	if(Math.random() < 1 - Math.pow(.993, gameTime) && !isGameOver) {
        asteroids.push({
            pos: [Math.random() * (CANVAS.width - 39),
                  0],
            sprite: new Sprite('img/enemy.png', [0, 0], [29, 29])
        });
    }
	
	checkCollisions();

    scoreEl.innerHTML = "Score: "+score;
}

function updateEntities(dt) {

    player.sprite.update(dt);

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
        bombs--;
        asteroids = [];
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
    bombs = 3;
    for(var i=1;i<4;i++) {
        document.getElementById('bombs-remaining-'+i).style.background = '#00FFFF';
    }

    asteroids = [];

    player.pos = [CANVAS.width / 2, CANVAS.height * .75];
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