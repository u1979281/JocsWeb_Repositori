var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, 
		difficulty:"hard",
		lvlDifficulty:1,
		mode:"mode1",
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"difficulty":"hard","lvlDifficulty":1,"mode":"mode1"}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		console.log(options_data)
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			difficulty: "normal",
			lvlDifficulty:1,
			mode:"mode1",
		},
		created: function(){
			this.num = options_data.cards;
			this.difficulty = options_data.difficulty;
			this.mode = options_data.mode;
			this.lvlDifficulty = options_data.lvlDifficulty
		},
		watch: {
			num: function(value){
				if (value < 2)
					this.num = 2;
				else if (value > 4)
					this.num = 4;
			},
			lvlDifficulty: function(value){
				if(value<1) this.lvlDifficulty = 1
			}
		},
		methods: { 
			discard: function(){
				this.num = options_data.cards;
				this.difficulty = options_data.difficulty;
				this.lvlDifficulty = options_data.lvlDifficulty;
				this.mode = options_data.mode;
			},
			save: function(){
				options_data.cards = this.num;
				options_data.difficulty = this.difficulty;
				options_data.lvlDifficulty = this.lvlDifficulty;
				options_data.mode = this.mode;
				save();
				loadpage("../");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDificulty: function (){
			return options_data.difficulty;
		},
		getLvlDifficulty: function(){
			return options_data.lvlDifficulty;
		},
		getMode: function(){
			return options_data.mode;
		}
	}; 
}();

/*console.log(options.getOptionsString());
console.log("NumOfCards: " + options.getNumOfCards());
console.log("Difficulty: " + options.getDificulty());
console.log("StartLevel: " + options.getLvlDifficulty());
console.log("Mode: " + options.getMode());*/
