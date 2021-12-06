"use strict";

var width = 320, //canvas bredde
    height = 500, //canvas høyde
    gLoop,
    points = 0,
    pointsVisual = Math.round(points),
    state = true,
    c = document.getElementById('c'), //henter canvas
    ctx = c.getContext('2d');
            
    c.width = width;
    c.height = height;

var bodyEl = document.querySelector("body");

var nrOfPlatforms = 6, 
platforms = [],
platformWidth = 70,
platformHeight = 20;
//lager globale variabler for plattformstørrelse 

var Platform = function(x, y, type){
//funksjonen finner posisjonen og hvilken type plattformen er
var that = this;

that.onCollide = function(){
    player.fallStop();
};

if (type === 1) {
    that.onCollide = function(){
        player.fallStop();
    };
}

that.x = ~~ x;
that.y = y;


that.isMoving = ~~(Math.random() * 3);
//sjekker om plattformen kan flyttes eller ikke, om den har verdien 1 eller 0
that.direction= ~~(Math.random() * 2) ? -1 : 1;
//sjekker hvilken retning den beveger seg i


that.draw = function(){

    var plattform = new Image();
    plattform.src = "bilder/hav.png";
    ctx.drawImage(plattform, that.x, that.y, platformWidth, platformHeight);
    //var monster = ctx.createPattern(plattform, "repeat");
    //ctx.fillStyle = monster;
 if (points >= 100 && points < 225){
        plattform.src = "bilder/sahara.png"
        ctx.drawImage(plattform, that.x, that.y, platformWidth, platformHeight);
    } else if(points >= 225 && points < 375){
        plattform.src = "bilder/jungel.png"
        ctx.drawImage(plattform, that.x, that.y, platformWidth, platformHeight);
    } else if(points >= 375 && points < 550){
        plattform.src = "bilder/himmel2.png"
        ctx.drawImage(plattform, that.x, that.y, platformWidth, platformHeight);
    } else if(points >= 550){
        plattform.src = "bilder/verdensrommet.png"
        ctx.drawImage(plattform, that.x, that.y, platformWidth, platformHeight);
    }
};

return that;
};

var generatePlatforms = function(){
var position = 0, type;
//position er plattformens y-verdi. For at de skal plasseres med ganske likt intervall starter den på 0.

for (var i = 0; i < nrOfPlatforms; i++) {

    
    platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
    //genererer en tilfeldig x-verdi

    if (position < height - platformHeight) 
        position += ~~(height / nrOfPlatforms);
    //genererer tifeldig y-verdi
}
}();
//denne funksjonen startes bare én gang før spillet starter