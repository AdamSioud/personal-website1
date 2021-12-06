"use strict";

var width = 320, //canvas bredde
	height = 500, //canvas høyde
	gLoop,
	points = 0,
	pointsVisual = Math.round(points),
	state = true,
	c = document.getElementById('c'), //henter canvas
	ctx = c.getContext('2d'),
	vindu = document.getElementById("forgrunnsvindu"),
	boi = document.getElementById("boi"),
	sang = new Audio();
	c.width = width;
	c.height = height;

var bodyEl = document.querySelector("body");

sang.src = "lyd/hopp5.mp3";

var player = new (function(){ //lager et nytt objekt med en funksjon
	var that = this;
	that.image = new Image();
	that.image.src = "bilder/karakter1.png";

	//Lager et nytt bilde og legger til source

	that.width = 45; //bredden av bildet
	that.height = 75; //høyden av bildet
	
	that.frames = 1;
	//antall frames indeksert fra null
	that.actualFrame = 0;
	//hvilken frame man starter på
	that.fart = 6;

	that.X = 0;
	that.Y = 0;	
	//X- og Y-posisjon til bildet

	//Nye attributter
	that.isJumping = false;
	that.isFalling = false;
	//objektets/spillerens tilstand beskrevet med booleanske verdier

	that.jumpSpeed = 0;
	that.fallSpeed = 0;
	//fall og hopp skal ha egne verdier for fart

    that.jump = function() {
		//starten av hoppet
		if (!that.isJumping && !that.isFalling) {
			//hvis objektet hverken faller eller hopper
			that.fallSpeed = 0;
			that.isJumping = true;
			that.jumpSpeed = 17;
			//startfart
			sang.play();
		}
	}
	
	that.checkJump = function() {
		//Når hoppingen ble aktivert av jump(), tar denne funksjonen over
		if(that.Y > height * 0.4){
		that.setPosition(that.X, that.Y - that.jumpSpeed);
		//flytter objektet/spilleren jumpSpeed antall piksler
		} else {
			if(that.jumpSpeed > 0.5) points ++;

			platforms.forEach(function(platform, ind){
				platform.y += that.jumpSpeed;
				
				if (platform.y > height) {
					//hvis plattformen forsvinner ut av skjermen, så genereres en ny på toppen
					var type = ~~(Math.random() * 5);
					if (type == 0)
                    	type = 1;
                	else 
                    	type = 0;
                	platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height);
				}
			});
		}		
			
		that.jumpSpeed--;
		//og legger til "tyngdekraft" ved å trekke fra hoppefart
		if (that.jumpSpeed == 0) {
			that.isJumping = false;
			that.isFalling = true;
			that.fallSpeed = 1;
		}



	
	}
	
	that.fallStop = function(){
		//stopper fallingen, starter å hoppe igjen
		that.isFalling = false;
		that.fallSpeed = 0;
		that.jump();	
	}
	
	that.checkFall = function(){
		//gjør det samme som checkJump()
		if (that.Y < height - that.height) {
			//sjekker om objektet treffer bunnen av skjermen, hvis ikke øker fallfarten
			that.setPosition(that.X, that.Y + that.fallSpeed);
			that.fallSpeed++;
		}  else {
			if(points <= 11){
			//hvis det stemmer, så skal den hoppe
			that.fallStop();
			} else{
				GameOver();
			}
		}
	}

	that.drawSpillerTap = function(){
		that.image.src = "bilder/tapte.png";
		ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, width/2 - that.width/2, height/2 , that.width, that.height);
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
		
	}
	
	that.moveLeft = function(){
		if (that.X > 0) {
			//sjekker om objektet/spilleren er innenfor skjermen
			that.setPosition(that.X - 5, that.Y);
		}
	}
	
	that.moveRight = function(){
		if (that.X + that.width < width) {
			//sjekker om objektet/spilleren er innenfor skjermen
			that.setPosition(that.X + 5, that.Y);
		}
	}

	that.flytt = function(){
        if (taster[39]) {
            that.X += that.fart;
        } else if(taster[37]) {
            that.X -= that.fart;
        }
	}
	that.swapSide = function(x, y){
		if(that.X < - that.width/2) {
			that.X = width - that.width/2;
		} else if(that.X > width - that.width/2) {
			that.X = -that.width/2;
		}
	}

	
	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}
	
	that.interval = 0;
	//Vi trenger ikke å bytte frame hver gang det loopes. Derfor har vi interval
	that.draw = function(){
		try {
			if(points < 100){
			that.image.src = "bilder/karakter1.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
			//henter bilde sourcen og limer det inn i plassering én, 
			//drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
		
		} else if (points >= 100 && points < 225){
			that.image.src = "bilder/karakter2.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} else if (points >= 225 && points < 375){
			that.image.src = "bilder/karakter3.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} else if (points >= 350 && points < 550){
			that.image.src = "bilder/karakter4.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} else if (points >= 550 /*&& points < 700*/){
			that.image.src = "bilder/karakter5.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
		} /*else if (points >= 700) {
			that.image.src = "bilder/vant.png";
			ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
			GameWon();
		} */

	} 
		catch (e) {
			//Noen ganger er bildet for stort og vil ikke lastes inn på første forsøk. Da må man catche feilen og få scriptet til å prøve på nytt, hvis ikke vil det komme mange errors
		};
		
		if (that.interval == 4 ) {
			//Her får man det til å bytte bilde hver fjerde loop	
			if (that.actualFrame == that.frames) {
				that.actualFrame = 0;
			}
			else {
				that.actualFrame++;
			}
			that.interval = 0;
		}
		that.interval++;	
	}

	function GameWon() {
		window.addEventListener("keypress", refresh);
		if(points > 700){
			state = false;
			//setter status til false
			clearTimeout(gLoop);
			//stopper å loope spillet
			
			setTimeout(function(){
				//venter på at alle frames som allerede er kallt skal bli tegnet, for deretter å fjerne alt og generere tekst
				clear();

				ctx.fillStyle = "White";
				ctx.fillText("POINTS:" + pointsVisual, 10, height-10);
				ctx.font = "40pt Arial";
				ctx.fillText("DU VANT", width/2 - 115, height - 150);
				ctx.font = "10pt Arial";
				ctx.fillText("Trykk 'enter' for å starte på nytt!", width/2 - 100, height - 100);
				that.image.src = "bilder/vant.png";
				//ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
				ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, width/2 - that.width/2, height - 416 , that.width, that.height);
			})
		}

		//setTimeout(visVindu, 3000);
	}

	
	/*function visVindu(){
		var topp = 500;
		var venstre = 33;
		vindu.style.top = topp + "px";
		vindu.style.left = venstre + "%";
		vindu.style.display = "initial";
	
		boi.autoplay = true;
		boi.load();
	}*/
})(); //Denne funksjonen kjøres umiddelbart, og resultatene blir gitt til var spiller som et nytt


