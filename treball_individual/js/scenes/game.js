class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.num_cartes = 0;
		this.points_substract= 20,
		this.reveal_time = 1000,
		this.initial_reveal = true
		this.revealing_error = false
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
		this.load.image('button','../resources/savebutton.png');
	}
	
    create (){	
		var arraycards = ['cb', 'co', 'sb', 'so', 'to', 'tb'];
		this.cameras.main.setBackgroundColor("#4D4D4D");

		let l_partida = null;
		if (sessionStorage.idPartida && localStorage.partides){
			let arrayPartides = JSON.parse(localStorage.partides);
			if (sessionStorage.idPartida < arrayPartides.length)
				l_partida = arrayPartides[sessionStorage.idPartida];
		}

		if (l_partida){ //si venim d'una partida guardada
			this.num_cartes = l_partida.num_cartes;
			let totalCardWidth = (this.num_cartes*2) * 96;
			let yPos = this.cameras.main.centerY - 128/2
			this.correct=l_partida.correct;
			this.points_substract = l_partida.points_substract
			this.reveal_time = l_partida.reveal_time;
			arraycards = l_partida.saved_arraycards.slice();
			console.log(this.num_cartes)
			for (let i = 0; i < this.num_cartes*2; i++){
				this.add.image(i*96 + this.cameras.main.centerX - (totalCardWidth/2), yPos, arraycards[i]);
			}
			
		}
		else{ //si creem partida nova
			var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
			var { cards, difficulty } = JSON.parse(json);
			this.num_cartes = cards;
			this.difficulty = difficulty;
			let totalCardWidth = (this.num_cartes*2) * 96;
			let yPos = this.cameras.main.centerY - 128/2

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
			
			arraycards.sort(function(){return Math.random() - 0.5}); // Array aleatòria
			arraycards = arraycards.slice(0, this.num_cartes); // Agafem els primers numCards elements
			arraycards = arraycards.concat(arraycards); // Dupliquem els elements
			arraycards.sort(function(){return Math.random() - 0.5}); // Array aleatòria
			for (var i = 0; i < arraycards.length; i++){
				this.add.image(i*96 + this.cameras.main.centerX - (totalCardWidth/2), yPos, arraycards[i]); //he intentat de centrarles pero soc incapaç ho sento 
			}
		}

		setTimeout(() => {
			let totalCardWidth = (this.num_cartes*2) * 96;
			let yPos = this.cameras.main.centerY - 128/2
			this.cards = this.physics.add.staticGroup();
			let p=0;
			for (let i = 0; i < this.num_cartes*2; i++){
				if(l_partida)
				{
					if(l_partida.cards_back[p]==true)
					{
						this.cards.create(i*96 + this.cameras.main.centerX - (totalCardWidth/2), yPos,'back'); //creem les cartes "back" nomes en les posicions que no estan girades ja
					}
				}
				else
				{
					this.cards.create(i*96 + this.cameras.main.centerX - (totalCardWidth/2), yPos, 'back');//creem totes les cartes "back"
				}
				p++;
			}
			let i = 0;
			this.cards.children.iterate((card)=>{
				if(l_partida){
					while(l_partida.cards_back[i]==false){
						i++;
					}
					card.card_id = arraycards[i];	
					i++;
				}
				else{
					card.card_id = arraycards[i];	
					i++;
				}	
				card.setInteractive();
				card.on('pointerup', () => {
					if (!this.revealing_error){
						card.disableBody(true,true);
						if (this.firstClick){
							if (this.firstClick.card_id !== card.card_id){
								this.score -= this.points_substract;
								this.revealing_error=true;
								setTimeout(()=>{ //ens esperem un temps determinat per la dificultat per tornar a amagar el error (mateix temps de reveal inicial de les cartes)
									this.revealing_error=false;
									this.firstClick.enableBody(false, 0, 0, true, true);
									card.enableBody(false, 0, 0, true, true);
									this.firstClick = null;
								},this.reveal_time);
								if (this.score <= 0){
									alert("Game Over");
									loadpage("../");
								}
							}
							else{
								this.correct++;
								if (this.correct >= this.num_cartes){

									//ja que no he fet el mode2 per manca de temps pero si que tenia fet lo de les puntuacions ho fico aqui per mostrar que funcionaria
									let score_struct = {
										username: name,
										punts: this.score,
										level: 5 //aixo seria el maxim nivell assolit al mode infinit, ho fico a 5 pq no em dongui error
									 };
									let scoreboard_array = [];
									if (localStorage.scores) {
										scoreboard_array = JSON.parse(localStorage.scores);
									}
									if (!Array.isArray(scoreboard_array)) {
										scoreboard_array = [];
									} else {
										scoreboard_array.push(score_struct);
									}
	
									scoreboard_array.sort((a, b) => b.punts - a.punts);
									localStorage.scores = JSON.stringify(scoreboard_array);
								
									alert("You Win with " + this.score + " points.");
									loadpage("../");
								}
								this.firstClick = null;
							}
						}
						else{
							this.firstClick=card;
						}
					}
				},card);
			});
		},this.reveal_time)
		
		
		//ho he intentat fer amb rectangles pero tal com em va passar amb el joc en grup no se perque no funciona, nomes funciona amb imatges
		/*const button = this.add.graphics({
			fillStyle: { color: 0xffffff, alpha: 0.3 },
			lineStyle: { color: 0x000000 }
		});
		button.fillRect(x, y, 100, 60);
		button.strokeRect(x, y, 100, 20);*/
		
		const x = this.cameras.main.centerX;
		const y = this.cameras.main.height - 200;
		const button = this.add.sprite(x ,y, 'button');
		button.scale = .5;
        button.setInteractive();
        button.on('pointerdown', () => {
			let cartes_girades = {};
			let i=0;
			this.cards.children.iterate((card) => {
				cartes_girades[i] = card.active;
				i++;
			});
			let partida = {
				username: name,
				es_mode_infinit: false,
				bad_clicks: this.bad_clicks, 
				num_cartes: this.num_cartes,
				saved_arraycards:arraycards,
				num_cartes: this.num_cartes,
				cards_back: cartes_girades,
				points_substract:this.points_substract,
				temps:this.temps,
				correct:this.correct,
				score: this.score,
			 };
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			arrayPartides.push(partida);
			localStorage.partides = JSON.stringify(arrayPartides);
			loadpage("../");
        });
	}
	update (){	}
}

