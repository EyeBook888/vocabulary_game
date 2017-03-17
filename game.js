/*
	Copyright 2017 EyeBook888

	This file is part of vocabulary_game.

    vocabulary_game is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    vocabulary_game is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with vocabulary_game. If not, see <http://www.gnu.org/licenses/>.
*/


function loadJson(file, processFunction){ // load a json file and return a Object to the process Function
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//alert(this.responseText)
			var jsonString = this.responseText;
			var jsObject = JSON.parse( jsonString );
			processFunction(jsObject);
		}
	};
	xhttp.open("GET", file, true);
	xhttp.send();
}



function progressBar(max){
	this.max 	 = max;
	this.current = 0;

	this.animationTime = 700;
	this.lastCurrent = 0;
	this.currentDisplay = 0;//what is displayed on the screen
	this.lastChangeTime = 0;

	this.backgroundColor = "white";
	this.color 			 = "#2E9AFE"

	this.set = function(current){
		this.lastCurrent = this.current;
		this.current = current;
		this.lastChangeTime = Date.now();;
	}

	this.add = function(amount){
		this.set(this.current + amount);
	}

	this.add = function(){
		this.set(this.current + 1);
	}

	this.draw = function(context, x, y, width, height){

		pastTime = Date.now() - this.lastChangeTime;
		pastTimePercent = Math.min(1, pastTime/this.animationTime);//how far is the animation

		this.currentDisplay = this.lastCurrent + pastTimePercent*(this.current - this.lastCurrent);
		//console.log(this.lastCurrent + "=>" + this.current)


		if(this.currentDisplay > this.max){
			this.currentDisplay = this.max;
		}


		//draw the background
		context.lineWidth=5;
		context.fillStyle = this.backgroundColor;
		roundRect(context, x, y, width, height, 5, true, true)

		//draw the Bar
		context.fillStyle = this.color;
		roundRect(context, x, y, width * (this.currentDisplay/this.max) , height, 5, true, false)
	}

}


function Sprite(img){
	this.fixSize = state.HEIGHT_AS_FIX_SIZE;
	this.img = img;

	this.draw = function(context, x, y, widthOrHeight){//if width is the fix size than the last value is the width, if it is the height than the last value is the height
		if(this.fixSize == state.WIDTH_AS_FIX_SIZE){
			width = widthOrHeight;
			height = this.img.width/width*this.img.height;
		}else if(this.fixSize == state.HEIGHT_AS_FIX_SIZE){
			height = widthOrHeight;
			width = widthOrHeight/this.img.height*this.img.width;
		}

		context.drawImage(this.img, x, y, width, height);
	}

}


function nonLaplaceRandom(arra){//the Array contains points which says how likely this Number is
	console.log(arra)
	//add all point together
	var allPoints = 0;
	for (var i = 0; i < arra.length; i++) {
		allPoints+=arra[i];
	};

	//get a random number under allPoints
	randomNumber = Math.floor(Math.random()*allPoints+1);

	//find out in which element is number is
	for (var i = 0; i < arra.length; i++) {
		randomNumber-=arra[i];
		if(randomNumber <= 0){
			return i;
		}
	};
	alert("mist");
	return 0;
}

state = new Array();
state.WIDTH_AS_FIX_SIZE 	= 0;
state.HEIGHT_AS_FIX_SIZE 	= 1;
state.LOADING				= 2;
state.SELECTION 			= 3;
state.PLAYING 				= 4;



function testNonLaplaceRandom(arra){
	count = new Array(arra.length);
	testCount = 1000;
	for(var i = 0; i < count.length; i++){
		count[i] = 0;
	}

	for (var i = 0; i < testCount; i++) {
		randomId = nonLaplaceRandom(arra);
		count[randomId]++;
	};
	console.log(count)

	for (var i = 0; i < count.length; i++) {
		console.log(i + ":" + (count[i]/testCount*100) + "%");
	}

}

function getDistance(x1, y1, x2, y2){
	DistanceX = Math.abs(x2-x1);
	DistanceY = Math.abs(y2-y1);

	return Math.sqrt(Math.pow(DistanceX, 2) + Math.pow(DistanceY, 2));
}






var game = new Array();

game.canvas = document.getElementById("gameDisplay");

game.canvas.addEventListener('touchstart', function(event){
					game.onClick(event.touches[0].pageX, event.touches[0].pageY)}); 



game.words = new dictionary();

game.state = state.SELECTION;


game.words.VocabularyCount = Array();

game.words.VocabularyCount[0] = 0;//unlock to more words
game.words.VocabularyCount[1] = 0;
//game.words.VocabularyCount[2] = 0;
//game.words.VocabularyCount[3] = 0;
//game.words.VocabularyCount[4] = 0;

game.timePerVocabularyLetter = 1200;

game.levelUpAnimationStartTime = 0;


game.overworld = null;

game.player = new Array();
game.player.level = 0;
game.player.levelProgress = new progressBar(10);

img = new Image();
img.src = "./Player.png"
game.player.stayImage = new Sprite(img)

img = new Image();
img.src = "./arrow.png"
game.arrow = new Sprite(img)


game.opponent = new Array();
img = new Image();
img.src = "./slime.png"
game.opponent.stayImage = new Sprite(img);

game.update = function(){
	if(this.state == state.PLAYING){
		//adjust the size of the canvas
		this.canvas.width = window.innerWidth*2;
		this.canvas.height = window.innerHeight/2*2;
		this.canvas.style.height = "50%";//make the canvas halve screen
		document.getElementById("keyboard").style.visibility = "visible";
	
		var context = this.canvas.getContext("2d");
	
	
		context.fillStyle = "white"
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
		
	
		//draw Level Bar
		//draw the level-up circle
		percent = Math.min((Date.now() - this.levelUpAnimationStartTime)/700, 1)
		context.strokeStyle = "#2E9AFE"
		r 	= 255 - Math.round((1-percent)*(255-46 ))
		g 	= 255 - Math.round((1-percent)*(255-154))
		b 	= 255 - Math.round((1-percent)*(255-254))
	
	
		context.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
		context.lineWidth = 5
		strokeCircle(context, this.canvas.width-30, 30, percent*300 + 30)
	
		context.strokeStyle = "black"
	
	
		//draw the level background circle
		context.fillStyle = "#2E9AFE"
		drawCircle(context, this.canvas.width-30, 30, 30)
	
		context.fillStyle = "Black"
		context.font="40px Georgia";
		textWidth = context.measureText(this.player.level + "").width;
		context.fillText(this.player.level, this.canvas.width-30 - textWidth/2, 30+15)

		//draw the level progress bar
		game.player.levelProgress.draw(context, 65, 10, this.canvas.width-130, 40);
		

		//draw the 'back to the over word' button
		game.arrow.draw(context, 0, 10, 40);


	
	
		//draw you Avatar
		game.player.stayImage.draw(context, 0, this.canvas.height/2, this.canvas.height*0.48);
	
	
	
	
	
	
	
		//draw opponent Avatar
		game.opponent.stayImage.draw(context, this.canvas.width-this.canvas.height*0.30, this.canvas.height*0.76, this.canvas.height*0.22);
	
		//draw opponent speak bubble 
		textWidth = context.measureText(this.currentVocabulary.lang0).width;
	
		context.fillStyle = "#2E9AFE"
		SpeakBubbleX = this.canvas.width-this.canvas.height*0.30-textWidth;
		SpeakBubbleY = this.canvas.height*0.2;
		drawSpeakBubble(context, SpeakBubbleX, SpeakBubbleY, textWidth + 40, this.canvas.width - this.canvas.height*0.20, this.canvas.height*0.90)
		
	
		//write the Vocabulary you have to translate
		context.fillStyle = "black"
		context.font="40px Georgia";
		context.fillText(this.currentVocabulary.lang0, SpeakBubbleX +20, SpeakBubbleY +44)
	
	
	
	
	
	
		//draw you Avatar
		game.player.stayImage.draw(context, 0, this.canvas.height/2, this.canvas.height*0.48);
	
		//measure the text you currently tipping
		context.fillStyle = "black"
		context.font="40px Georgia";
		textWidth = Math.max(
			context.measureText(this.currentVocabulary.lang1.toUpperCase()).width,
			context.measureText(TipeHandler.currentText).width);
	
	
	
	
		//draw your speak bubble
		context.fillStyle = "#2E9AFE"
		SpeakBubbleX = this.canvas.height*0.3;
		SpeakBubbleY = this.canvas.height*0.4;
		drawSpeakBubble(context, SpeakBubbleX, SpeakBubbleY, textWidth + 40, this.canvas.height*0.155, this.canvas.height*0.69)
		
		
		if(game.words.VocabularyCount[this.currentVocabulary.id] == null || game.words.VocabularyCount[this.currentVocabulary.id] == 0){
			//if it is the fist time that you have this vocable 
			context.fillStyle = "rgba(0, 0, 0, 0.3)"
			context.font="40px Georgia";
			context.fillText(this.currentVocabulary.lang1.toUpperCase(), SpeakBubbleX+10, SpeakBubbleY+45)
		}
	
		context.fillStyle = "black"
		context.font="40px Georgia";
		context.fillText(TipeHandler.currentText, SpeakBubbleX+10, SpeakBubbleY+45)
	
	
	
	
	
	
		passedTime =  Date.now() - this.startTime;
	
		context.fillStyle = "red"
	
		//console.log(1-(passedTime/3000));
	
		context.fillRect(0, this.canvas.height-10, (1-passedTime/this.timeForVocabulary)*this.canvas.width, 10);
	
		if(TipeHandler.currentText.toUpperCase() == this.currentVocabulary.lang1.toUpperCase()){
			this.winFight();
		}else if(passedTime >= game.timeForVocabulary){
			this.looseFight();
		}




	}else if(this.state == state.SELECTION){
		//the map/selection screen

		this.canvas.width = window.innerWidth*2;
		this.canvas.height = window.innerHeight*2;
		this.canvas.style.height = "100%";//make the canvas full screen

		document.getElementById("keyboard").style.visibility = "hidden";

	
		var context = this.canvas.getContext("2d");
	
	
		context.fillStyle = "green"
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for(var i = 0; i < this.overworld.levels.length; i++){//draw all levels on the over world
			context.fillStyle = "blue"
			drawCircle(context, 
				this.overworld.levels[i].positionX*this.canvas.width, 
				this.overworld.levels[i].positionY*this.canvas.height,
				Math.min(this.canvas.width*0.1, this.canvas.height*0.1))
			
		}

	}

	/*
	//debug stuff
	context.fillStyle = "red"
	drawCircle(context, 
			game.textX, 
			game.textY,
			10)
	*/
}


game.textX = 0;
game.textY = 0;

game.onClick = function(x, y){
	//because x and y is in screen coordinates, calculate the canvas coordinates
	x = this.canvas.width * x/this.canvas.offsetWidth
	y = this.canvas.height * y/this.canvas.offsetHeight

	//at the moment just start the only level
	//todo: actual level selection

	game.textX = x;
	game.textY = y;
	if(this.state == state.SELECTION){

		for(var i = 0; i < this.overworld.levels.length; i++){//check all levels on the over world

			distance = getDistance(
				this.overworld.levels[i].positionX*this.canvas.width, 
				this.overworld.levels[i].positionY*this.canvas.height,
				x,
				y)

			radius = Math.min(this.canvas.width*0.1, this.canvas.height*0.1);//the radius of the circle
			if(distance <= radius){//test if you tap in the circle
				loadJson(this.overworld.levels[i].file, function(object){
    				game.words.loadByjsonObject(object);//load the dictionary
    				game.startLevel(); // start the game
    			})
			}
		}
	}else if(this.state == state.PLAYING){
		if(x >= 0 && x <= 40 && y >= 10 && y <= 65 ){//check if you click the Button
			this.state = state.SELECTION
		}
	}
}



game.winFight = function(){
	//add to the Vocabulary Counter
	if(game.words.VocabularyCount[this.currentVocabulary.id] == null){
		game.words.VocabularyCount[this.currentVocabulary.id] = 0;
	}

	game.words.VocabularyCount[this.currentVocabulary.id]++;

	this.player.levelProgress.add();//level progress
	if(this.player.levelProgress.current == this.player.levelProgress.max){
		this.nextLevel();
	}
	
//load the new Vocabulary (todo: start transitions animation)
	//game.currentVocabulary 	= game.words.getRandomVocabulary();
	game.currentVocabulary  = this.getNextVocabulary();
	this.timeForVocabulary  = Math.max(this.timePerVocabularyLetter*this.currentVocabulary.lang1.length, 4000);
	TipeHandler.currentText = "";
	game.startTime = Date.now();
}

game.nextLevel = function(){
	this.player.levelProgress.set(0);
	this.player.levelProgress.set(0);//abort the other animation
	this.player.level++;
	game.levelUpAnimationStartTime = Date.now();

	//todo: better unlock routine
	this.words.VocabularyCount[this.player.level +1] = 0;
}

game.looseFight = function(){
	this.player.levelProgress.set(0);
	//this.currentVocabulary 	= game.words.getRandomVocabulary();
	game.words.VocabularyCount[this.currentVocabulary.id] = 0;
	this.timeForVocabulary = Math.max(this.timePerVocabularyLetter*this.currentVocabulary.lang1.length, 4000);
	TipeHandler.currentText = "";
	game.startTime = Date.now();
}

game.getNextVocabulary = function(){
	chanceList = new Array();

	//basic chance
	for (var i = 0; i < this.words.length; i++) {
		if(this.words.VocabularyCount[i] == 0){
			chanceList[i] = Math.round(10*(this.player.level+1));
		}else if(this.words.VocabularyCount[i] == null){
			chanceList[i] = 0;
		}else{
			chanceList[i] = 1;
		}
	};
	//ask to less ask Vocabularys more often
	for (var i = 0; i < this.words.length; i++) {
		if(this.words.VocabularyCount[i] != null){
			//console.log(this.words.getById(i).lang1 + " less use bonus: " +Math.min(this.words.VocabularyCount[i]/5, 1) )
			//chanceList[i]+= Math.round((1- Math.min(this.words.VocabularyCount[i]/3, 1))*5);
			if(this.words.VocabularyCount[i] <= 5){
				chanceList[i]+= Math.round((this.player.level/((x+0.1)*0.5)))
			}
		}
	};

	//never ask for the same Vocabulary behind each other
	chanceList[this.currentVocabulary.id] = 0;

	return this.words.getById(
		nonLaplaceRandom(
			chanceList));

}

game.startLevel = function(){
	this.words.setIds();
	this.currentVocabulary = game.words.getById(0);//load the first vocabulary
	
	this.startTime = Date.now();//set the start time for the first vocabulary

	this.timeForVocabulary = Math.max(game.timePerVocabularyLetter*game.currentVocabulary.lang1.length, 4000);//set the time for the first vocabulary

	//just as a test put the state on playing
	this.state = state.PLAYING
}

game.load = function(){
	timer = window.setInterval(function(){game.update()}, 100);//start the update/draw function calls
	loadJson('./overworld.json', function(object){
    	game.overworld = object;//load the over world
  	})
}
game.load();






//start the game after load the vocabulary list
/*
loadJson("./vocabularyList.json", function(object){
	game.words.loadByjsonObject(object);//load the dictionary
	game.start(); // start the game
	})

*/







function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}


function drawTriangle(context, x0, y0, x1, y1, x2, y2){
	context.beginPath();
    context.moveTo(x0,y0);
    context.lineTo(x1,y1);
    context.lineTo(x2,y2);
    context.fill();
}

function drawCircle(context, x, y, radius){
	context.beginPath();
	context.moveTo(x, y)
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fill();
}

function strokeCircle(context, x, y, radius){
	context.beginPath();
	context.moveTo(x, y)
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.stroke();
}

function drawSpeakBubble(context, x, y, width, sourceX, sourceY){
	
	roundRect(context, x, y, width, 65, 15, true, false)//draw the Box

	drawTriangle(context, x, y+60, x+30, y+60, sourceX, sourceY)//Draw the arrow the the character
}



