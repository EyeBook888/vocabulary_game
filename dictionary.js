function dictionary(){

	this.vocabulary = new Array();
	this.length = 0;

	this.add = function(lang0, lang1){
	//the word and the translation in the other language
		newVocabulary = new Vocabulary(lang0, lang1)
		//newVocabulary.id = this.vocabulary.length;
		this.vocabulary.push(newVocabulary);
		this.length++;
	}

	this.getRandomVocabulary = function(){
		i = Math.floor(Math.random()*this.vocabulary.length)
		return this.vocabulary[i];
	}

	this.setIds = function(){
		for (var i = 0; i < this.vocabulary.length; i++) {
			this.vocabulary[i].id = i;
		};
	}

	this.getById = function(id){
		return this.vocabulary[id];
	}
}

function Vocabulary(lang0, lang1){
//simply hold tow words
	this.lang0 = lang0;
	this.lang1 = lang1;

	this.id = 0;
}