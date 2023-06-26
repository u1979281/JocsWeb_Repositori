var load_obj = function(){
	var vue_instance = new Vue({
		el: "#saves_id",
		data: {
			saves: []
		},
		created: function(){
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			this.saves = arrayPartides;
		},
		methods: { 
			load: function(i){
				sessionStorage.idPartida = i;
				if(this.saves[i].es_mode_infinit){
					loadpage("../html/infinit_phasergame.html");
				}
				else{
					loadpage("../html/phasergame.html");
				}
			}
		}
	});
	return {}; 
}();

