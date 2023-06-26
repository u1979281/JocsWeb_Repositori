var load_objS = function(){
	var vue_instance = new Vue({
		el: "#scoreboard_id",
		data: {
			scores: []
		},
		created: function(){
			if(localStorage.scores){
				this.scores = JSON.parse(localStorage.scores);
				if(!Array.isArray(this.scores)) this.scores = [];
			}
		},
	});
	return {}; 
}();
