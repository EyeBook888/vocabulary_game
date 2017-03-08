function virtualKeyboard(){
	//virtual Keyboard object

	this.MaxKeysPerRow = 10;
	this.Rows = 3;

	this.KeyColor = "white"

	this.Keys = new Array();
	this.Keys[0] = ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P"];
	this.Keys[1] = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	this.Keys[2] = ["Y", "X", "C", "V", "B", "N", "M", "&larr;"];

	this.getBasicKey = function(Letter){
	//create the Key, without the position and width

		var currentKey = document.createElement("DIV"); //currentKey hold the Key which is created at the moment

		currentKey.innerHTML 				= Letter;
		currentKey.keyName					= Letter;
		currentKey.style.backgroundColor 	= this.KeyColor;//all the attributes 
		currentKey.style.margin				= "2px";
		currentKey.style.position			= "absolute";
		currentKey.style.textAlign 			= "center";
		currentKey.style.fontSize			= "5vw";

		currentKey.addEventListener('touchstart', function(){
					TipeHandler.click(this.keyName);
					this.style.backgroundColor = "gray"});

		currentKey.addEventListener('touchend', function(){
					this.style.backgroundColor = "white"});

		return currentKey;
	}

	this.create = function(element){
	//create the display of the Keyboard in a div (or other Element)

		element.style.textAlign = "center"; //make the Keyboard-Element fit


		for(y = 0; y < this.Keys.length; y++){
		//create all rows

			for(x = 0; x < this.Keys[y].length; x++){
			//create a line of Keys

				xOffset = (100-((100/this.MaxKeysPerRow)* this.Keys[y].length))/2; //to center the Keys

				currentKey = this.getBasicKey(this.Keys[y][x]);

				currentKey.style.width				= (100/this.MaxKeysPerRow -0.5) + "%";
				currentKey.style.height				= (100/(this.Rows+1) -0.5) + "%";
				currentKey.style.left				= ((100/this.MaxKeysPerRow)*x +xOffset) + "%";
				currentKey.style.top				= ((100/(this.Rows+1))*y) + "%";

				element.appendChild(currentKey);
			}
		}


		//the Space Key
		SpaceKey = this.getBasicKey(" ");

		SpaceKey.style.width				= "60%";
		SpaceKey.style.height				= (100/(this.Rows+1) -0.5) + "%";
		SpaceKey.style.left					= "20%";
		SpaceKey.style.top					= ((100/(this.Rows+1))*this.Rows) + "%";

		element.appendChild(SpaceKey);
	}
}




TipeHandler = new Array()//can't be in a Object (sadly)
						 //handle the Inputs form the Keyboard

TipeHandler.currentText = "";

TipeHandler.click = function(key){
	if(key != "&larr;"){
		this.currentText =  this.currentText + key;
	}else{
		str = this.currentText
		str = str.substr(0, str.length-1);
		this.currentText = str;
	}
}

	

new virtualKeyboard().create(document.getElementById("keyboard"));


