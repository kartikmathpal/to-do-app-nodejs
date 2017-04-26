var express    = require('express');
var app        = express(); //application instance
var bodyParser = require('body-parser');
var PORT       = process.env.PORT || 3000;
var db         = require('./db.js');
var _          = require('underscore');

var todos      = [];
var todoNextID = 1;
//middleware
app.use(bodyParser.json()); //process incoming JSON request

//---------------------------------------READ--------------------------------------------------------------------------
app.get('/',function(req,res){
	res.send('ToDo Api route....');
});

//---------------------------------------READ--------------------------------------------------------------------------
app.get('/todos',function(req,res){
	  
	var queryParams = req.query;
	var filteredTodos = todos;
  //adding filter
	if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){
		filteredTodos = _.where(filteredTodos,{completed:true}); //_.where(arr,searchParameter)
	}
	else if(queryParams.hasOwnProperty('completed') && queryParams.completed == 'false'){
			filteredTodos = _.where(filteredTodos,{completed:false}); 
	} 
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
			filteredTodos = _.filter(todos,function(todo){
				return todo.description.toLowerCase().indexOf(queryParams.q) > -1  //<==============================
			})
	}
	res.send(filteredTodos);

});
//---------------------------------------READ--------------------------------------------------------------------------
app.get('/todos/:id',function(req,res){
	   
	  var todoID = parseInt(req.params.id,10);

	  db.todo.findById(todoID).then(function(todo){
	  		if(!!todo){

	  			res.json(todo.toJSON());
	  		}
	  		else{
	  			res.status(400).send();
	  		}
	  },function(e){
	  			res.status(500).send();
	  });

	});
//--------------------------------------CREATE---------------------------------------------------------------------------
app.post('/todos',function(req,res){
	 
	var body = _.pick(req.body,'description','completed');

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON()); //since todo obj is not  a simple obj, we conv it to json
	},function(e){
		res.status(400).json(e); 
	}); 

});
//--------------------------------------DELETE---------------------------------------------------------------------------

app.delete('/todos/:id',function(req,res){

	var todoID = parseInt(req.params.id,10);
  var matchedToDo = _.findWhere(todos, {id :todoID});
  if(matchedToDo){
  todos = _.without(todos,matchedToDo);	
  res.send(todos);
  }
  else{
  	res.status(404).json({"error" : "no to-do found with that id!!"});
  }
});
//------------------------------------UPDATE-----------------------------------------------------------------------------
app.put('/todos/:id',function(req,res){
		var todoID = parseInt(req.params.id,10);
		var matchedToDo = _.findWhere(todos,{id : todoID});
		var body = _.pick(req.body,'description','completed');
		var validAttributes = {};
		//hasOwnProperty returns a boolean
		if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){ //if completed exists and its a boolean
				validAttributes.completed = body.completed;

		}else if(body.hasOwnProperty('completed')){
				return res.status(400).send();
		}
		if(body.hasOwnProperty('description') && _.isString('description') && body.description.trim().listen > 0){
				validAttributes.description = body.description;
		}else if(body.hasOwnProperty('description')){
				res.status(400).send();
		}
		 _.extend(matchedToDo,validAttributes);
		 res.json(matchedToDo);


});
//----------------------------------------------------------------------------------------------------------------------

db.sequelize.sync().then(function(){
	app.listen(PORT,function(){
	console.log('Server started...');
	});
});
// app.listen(PORT,function(){
// 	console.log('Server started...');
// });