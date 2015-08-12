include('js/Render.js');

var avatarImage = "img/avatar.png";
var enemyImage = "img/enemy.png";

var render = new Render();

function main() {
    var canvas = document.getElementById("gameCanvas");
    setInterval(function() {
       
        render.Draw(canvas, avatarImage, MouseEvent.offsetX, MouseEvent.offsetY);
    }, 1000/15);
    
}

