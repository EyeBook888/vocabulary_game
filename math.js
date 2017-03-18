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


