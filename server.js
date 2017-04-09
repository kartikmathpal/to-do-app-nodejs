var express    = require('express');
var app        = express(); //application instance
var bodyParser = require('body-parser');
var PORT       = process.env.PORT || 3000;
var _          = require('underscore');

// var todos   = [{
// 	id          : 1,
// 	description : 'meet mom for lunch',
// 	completed   : false
// },
// {
// 	id          : 2,
// 	description : 'Goto market',
// 	completed   : false
// },
// {
// 	id          : 3,
// 	description : 'Goto dance class',
// 	completed   : true
// }
// ];
var todos      = [];
var todoNextID = 1;
app.use(bodyParser.json()); //process incoming JSON request

//--------------------------------------------------------------routes-----
app.get('/',function(req,res){
	res.send('ToDo Api route....');
});

//-------------------------------------------------------------------------
app.get('/todos',function(req,res){
	//res.send(JSON.stringify(todos));
	res.json(todos);

});
//-------------------------------------------------------------------------
app.get('/todos/:id',function(req,res){
	  //var todoID = parseInt(req.params.id,10); //A parameter is always a string
    // var matchedToDo;
	  // todos.forEach(function(todo){
	  // 	if(todoID === todo.id){
	  // 		matchedToDo = todo;
	  // 	}
	  // });
    //  if(matchedToDo){
	  // 	res.json(matchedToDo);
	  // }else{
	  // 	res.status(404).send();
	  // }
	  var todoID = parseInt(req.params.id,10);
	  var matchedToDo = _.findWhere(todos, {id :todoID});
	   //findWhere Looks through the list and returns the first value that matches all of the key-value pairs listed in properties.
     //If no match is found, or if list is empty, undefined will be returned.
	 
	  if(matchedToDo){
			res.json(matchedToDo);
		}else{
			console.log('Not Found!!');
		  res.status(404).send();
		  console.log('Error 404 sent!');
		}
	});
//-------------------------------------------------------------------------
app.post('/todos',function(req,res){
	//var body = req.body; //access
	var body = _.pick(req.body,'description','completed');
	/*
	 pick_.pick(object, *keys) 
   Return a copy of the object, filtered to only have 
   values for the whitelisted keys (or array of valid keys). Alternatively accepts a predicate indicating which keys to pick.
  */
	if(!_.isBoolean (body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
		return res.status(400).send();
	}
	body.description = body.description.trim();
  //add id 
	body.id = todoNextID ;          //body.id = todoNextID++ ;
  todoNextID = todoNextID + 1 ;

  //push into array
  todos.push(body);
	//console.log('description :' , body.description);

	res.json(body);

});
//-------------------------------------------------------------------------

app.delete('/todos/:id',function(req,res){

	var todoID = parseInt(req.params.id,10);
  var matchedToDo = _.findWhere(todos, {id :todoID});
  if(matchedToDo){
  	/*
	without_.without(array, *values) 
  Returns a copy of the array with all instances of the values removed.
	*/
  todos = _.without(todos,matchedToDo);	
  res.send(todos);
  }
  else{
  	res.status(404).json({"error" : "no to-do found with that id!!"});
  }
});
//-------------------------------------------------------------------------
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
		
		//res.send(validAttributes);

		/*
			_.extend(destination, *sources) 
			Shallowly copy all of the properties in the source objects over to the destination object, 
			and return the destination object. Any nested objects or arrays will be copied by reference, 
			not duplicated. It's in-order, so the last source will override properties of the same name in previous arguments.

		*/
		//objects in javascript are passed by reference
		 _.extend(matchedToDo,validAttributes);
		 res.json(matchedToDo);


});
//-------------------------------------------------------------------------
app.listen(PORT,function(){
	console.log('Server started...');
});