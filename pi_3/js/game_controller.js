const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];



var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		difficulty: "hard",
		bad_clicks: 0,
		points_substract: 20,
		reveal_time: 1000,
		initial_reveal : true
	},
	created: function(){
		
		var json = localStorage.getItem("config") || '{"cards":2,"difficulty":"hard"}';
		var { cards, difficulty } = JSON.parse(json);
		this.num_cards = cards;
		this.difficulty = difficulty;

		if(difficulty == "easy"){
			this.points_substract = 10;
			this.reveal_time = 2000;
		} 
		else if(difficulty =="normal"){
			this.points_substract = 15;
			this.reveal_time = 1500;
		} 
		else if(difficulty == "hard"){
			this.points_substract = 20;
			this.reveal_time = 1000;
		} 

		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}

		setTimeout(() => {
			this.initial_reveal = false;
			for (var i = 0; i < this.items.length; i++){
                Vue.set(this.current_card, i, {done: false, texture: back});
            }
		} , this.reveal_time);
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if(!this.initial_reveal){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}			
			}
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * this.points_substract;
		}
	}
});



