

var avatarImage = "img/avatar.png";
var enemyImage = "img/enemy.png";

var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 400;
var FPS = 60;

var CANVAS;
var CTX;


var Mouse = {
	x: 0,
	y: 0
}

var xOffset, yOffset;
function init() {

	CANVAS = document.getElementById("gameCanvas");
	CTX = CANVAS.getContext("2d");
	

	Resources.load(["img/avatar.png", "img/enemy.png"]);
	Resources.onReady(main);
}

function main() {
	
    setInterval(function() {
		
		update();
		draw();
    }, 1000/FPS);
    
}

function update() {
	
	CANVAS.addEventListener("mousemove", updateMousePos);
}

function draw() {
	CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	CTX.drawImage(Resources.get("img/avatar.png"), Mouse.x, Mouse.y);
}

function updateMousePos(mouseEvent) {
	Mouse.x = mouseEvent.offsetX;
	Mouse.y = mouseEvent.offsetY;
}

var Game = {
	init: init,
	main: main,
	update: update,
	draw: draw,
	updateMousePos: updateMousePos
};
