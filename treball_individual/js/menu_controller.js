var menu = new Vue({
	el:"#id_menu",
	methods:{
		start_game(){
			sessionStorage.clear();
			//localStorage.clear();
			name = prompt("User name");
			sessionStorage.setItem("username", name);

			var json = localStorage.getItem("config");
			var options_data = JSON.parse(json);
			if (options_data.mode == "mode1") 
				loadpage("./html/phasergame.html");
			else
				loadpage("./html/infinit_phasergame.html");
		},
		exit (){
			loadpage("../");
		},
		options(){
			loadpage("./html/options.html");
		},
		load(){
			loadpage("./html/load.html");
		},
		scoreboard(){
			loadpage("./html/scoreboard.html");
		}
	}
})




