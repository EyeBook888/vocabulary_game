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