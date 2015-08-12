"use strict";

var Render = function() {};

Render.prototype.Draw = function(canvas, image, x, y) {
    
    canvas.clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").drawImage(image, x, y);
    
};
    
    function drawAvatar() {
    var gameCanvas = document.getElementById("gameCanvas");
    var avatarImage = new Image();
    var enemyImage = new Image();
    
    avatarImage.src = "img/avatar.png";
    enemyImage.src = "img/enemy.png";
    
    gameCanvas.getContext("2d").drawImage(avatarImage, Math.random() * 100, Math.random() * 100);

    gameCanvas.addEventListener("mousemove", redrawAvatar);
}

function redrawAvatar(mouseEvent) {
    var gameCanvas = document.getElementById("gameCanvas");
    var avatarImage = new Image();
    var enemyImage = new Image();
    
    avatarImage.src = "img/avatar.png";
    enemyImage.src = "img/enemy.png";
    gameCanvas.width = 400;
    
    gameCanvas.getContext("2d").drawImage(avatarImage,
        mouseEvent.offsetX,
        mouseEvent.offsetY);
    
    gameCanvas.getContext("2d").drawImage(enemyImage, 250, 150);
}
