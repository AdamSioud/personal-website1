"use strict";

var width = 320, //canvas bredde
	height = 500, //canvas høyde
	gLoop,
	points = 0,
	pointsVisual = 0,
	state = true,
	c = document.getElementById('c'), //henter canvas
	ctx = c.getContext('2d');
			
	c.width = width;
	c.height = height;

var bodyEl = document.querySelector("body");


//Fjernet copyrightsang, kan legges til hvis ønskelig
/*var sangTap = new Audio();
sangTap.src = "lyd/tap2.mp3";*/

var bakgrunnSang = new Audio();
bakgrunnSang.src = "lyd/bakgrunn1.mp3"; 

bakgrunnSang.play();

setTimeout(bakgrunnSang.play(), 133000); 

var taster = [];
var enter = [];

window.addEventListener("keydown", knappnedopp);
window.addEventListener("keyup", knappnedopp);

function refresh(e) {
	if(e.type === "keypress") {
		enter[e.keyCode] = true;
	} 
	if(enter[13]) {
		location.reload();
	}	
}

function knappnedopp(e) {
    if (e.type === "keydown") {
        taster[e.keyCode] = true;
    } else if (e.type === "keyup") {
        delete taster[e.keyCode];
	}
}

var clear = function(){
	var bakgrunn = new Image(); //etablerer bakgrunnsbilde
	bakgrunn.src = "bilder/havBak.png"; //henter bakgrunnsbilde
	bakgrunn.onload = function(){ //når siden lastes vil det lages et pattern med bakgrunnsbildet
	var pattern = ctx.createPattern(bakgrunn, "repeat");
	ctx.fillStyle = pattern;
	}
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.closePath();
	ctx.fill();
 if (points >= 100 && points < 225){
	bakgrunn.src = "bilder/saharaBak.png"; //henter bakgrunnsbilde
	} else if (points >= 225 && points < 375){
		bakgrunn.src = "bilder/jungelBak.png";
	} else if (points >= 375 && points < 550){
		bakgrunn.src = "bilder/himmelBak.png";
	} else if (points >= 550 && points < 693){
		bakgrunn.src = "bilder/verdensrommetBak.png";
	} else if (points >= 693) {
		bakgrunn.src = "bilder/solaBak.png";
	}
}



player.setPosition(~~((width-player.width)/2), ~~((height - player.height)/2));
player.jump();
//Nå flyttes spilleren til midten av skjermen
//"~~" gjør det samme som Math.floor, og gir returnerer det laveste heltallet



	var checkCollision = function(){
	platforms.forEach(function(e, ind){
		//platform.forEach() gjør at det sjekkes for hver plattform
		if (
		(player.isFalling) && 
		//sjekker bare når spilleren faller og er direkte over plattformen
		(player.X < e.x + platformWidth) && 
		(player.X + player.width > e.x) && 
		(player.Y + player.height > e.y) && 
		(player.Y + player.height < e.y + platformHeight)
		) {
			e.onCollide();
		}
	})
}

var GameLoop = function(){
	pointsVisual = Math.round(points);
	clear();
		if (player.isJumping) 
			player.checkJump();
		if (player.isFalling) 
			player.checkFall();


	platforms.forEach(function(platform, index){
		//platforms.forEach gjelder alle plattformer
		if(platform.isMoving){
		//hvis platformen kan bevege på seg	
			if(platform.x < 0){
			//hvis plattformen er på enden av skjermen
				platform.direction = 1;
			} else if (platform.x > width - platformWidth){
				platform.direction = -1;
			//bytter retning på plattformen hvis den treffer andre siden	
			}
			platform.x += platform.direction * (index / 2) * ~~(points / 150);
			//farten er avhengig av indeksen i platform[]-arrayen og antall poeng. Dette er for å unngå at alle plattformene beveger seg med samme hastighet, siden det ser stygt ut. 
		}
		platform.draw();
	});
	if(state != false /*&& points <= 700*/){
		bakgrunnSang.play();
	} else {
		bakgrunnSang.pause();
	}
	checkCollision();
	//player.checkWin();
	if(points < 225){
		ctx.fillStyle = "Black";
	} else if(points >= 225 && points < 375) {
		ctx.fillStyle = "white";
	} else if(points >= 375 && points < 550){
		ctx.fillStyle = "Black";
	} else {
		ctx.fillStyle = "white";
	}
	//endrer fillStyle til svart
	ctx.fillText("POINTS:" + pointsVisual, 10, height-10);

	//legger til tekst nede i venstre hjørne
	
	player.swapSide();
	player.flytt();
	player.draw();

    if(state)
	gLoop = setTimeout(GameLoop, 1000 / 50);
	//vil loope spillet hvert 1/50 sekund
}

var GameOver = function(){
	//bakgrunnSang.stop();
	
	//sangTap.play();    //For å aktivere sang ved tap

	window.addEventListener("keypress", refresh);
	state = false;
	//setter status til false
	clearTimeout(gLoop);
	//stopper å loope spillet
	setTimeout(function(){
		//venter på at alle frames som allerede er kallt skal bli tegnet, for deretter å fjerne alt og generere tekst
		clear();
		player.drawSpillerTap();
		
		ctx.font = "40pt Arial";
		ctx.fillText("DU TAPTE", width / 2 - 130, height / 2 - 50);
		ctx.font = "10pt Arial";
		ctx.fillText("Trykk 'enter' for å starte på nytt!", width/2 - 100, height / 2);
	}, 100);
}



GameLoop();