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

	this.loadByjsonObject = function(object){
		for (var i = 0; i < object.words.length; i++) {
			this.add(object.words[i][0], object.words[i][1]);
		};
	}
}

function Vocabulary(lang0, lang1){
//simply hold tow words
	this.lang0 = lang0;
	this.lang1 = lang1;

	this.id = 0;
}