var avatarImage = "img/avatar.png";
var enemyImage = "img/enemy.png";

var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 400;
var FPS = 60;

var CANVAS = document.getElementById("gameCanvas");

var Mouse = {
	x: 0,
	y: 0
}

var xOffset, yOffset;
function init() {
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
	
}

function draw() {
	CANVAS.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	CANVAS.drawImage(resources.get("img/avatar.png"), 150, 100);
}

function updateMousePos(mouseEvent) {
	Mouse.x = mouseEvent.offsetX;
	Mouse.y = mouseEvent.offsetY;
}

