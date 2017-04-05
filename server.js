var express = require('express');
var app     = express(); //application instance
var PORT    = process.env.PORT || 3000;
var todos   = [{
	id          : 1,
	description : 'meet mom for lunch',
	completed   : false
},
{
	id          : 2,
	description : 'Goto market',
	completed   : false
},
{
	id          : 3,
	description : 'Goto dance class',
	completed   : true
}
];

app.get('/',function(req,res){
	res.send('ToDo Api route....');
});


app.get('/todos',function(req,res){
	//res.send(JSON.stringify(todos));
	res.json(todos);

});

app.get('/todos/:id',function(req,res){
	  var todoID = parseInt(req.params.id,10); //A parameter is always a string

	  var matchedToDo;
	  todos.forEach(function(todo){
	  	if(todoID === todo.id){
	  		matchedToDo = todo;
	  	}
	  });
	  if(matchedToDo){
	  	res.json(matchedToDo);
	  }else{
	  	res.status(404).send();
	  }
	// var limit  = todos.length;
	// //console.log(limit);
	// var itr    = 0;
	// while(itr < limit){
	// 	if(todos.itr.id === todoID){
	// 		res.json(todos.itr);
	// 	}
	// 	itr = itr + 1 ;
	// }
	res.send(req.params.id);
});



app.listen(PORT,function(){
	console.log('Server started...');
});