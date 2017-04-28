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
	  
	var query = req.query;
	// console.log("query" + query);
	var where = {};
	
	if (query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	}else if(query.hasOwnProperty('completed') && query.completed == 'false'){
    where.completed = false;
	}
	 if(query.hasOwnProperty('q') && query.q.length > 0){
	 		where.description = {
	 			$like : '%' + query.q + '%'
	 		};
	 }
	
	 db.todo.findAll({where:where}).then(function(todos){
	 		res.json(todos)
	 },function(e){
      res.status(500).send();
	 });

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
   db.todo.destroy({
   	where :{
   		id : todoID
   	}
   }).then(function(rowsDeleted){//returns number of destroyed rows
   	if(rowsDeleted == 0){
   		res.status(404).json({
   			error : "No To DO with id."
   		});
   	}
   	else{
   		res.send(204).send();
   	}

   },function(){
   	res.status(500).send();
   })
});
//------------------------------------UPDATE-----------------------------------------------------------------------------
app.put('/todos/:id',function(req,res){
		var todoID = parseInt(req.params.id,10);
		 
		var body = _.pick(req.body,'description','completed');

		var attributes = {};
		//hasOwnProperty returns a boolean
		if(body.hasOwnProperty('completed')){ //if completed exists and its a boolean
				attributes.completed = body.completed;

		}
		if(body.hasOwnProperty('description')){
				attributes.description = body.description;
		}

		db.todo.findById(todoID).then(function(todo){
				if(todo){
					//return todo.update(attributes);
					todo.update(attributes).then(function(todo){
								res.json(todo.toJSON());
						},function(e){
								res.status(400).json(e);
						});
				  }
				else{
					res.status(404).send();
				}
		},function(){
			res.status(500).send();
		// }).then(function(todo){
		// 		res.json(todo.toJSON());
		// },function(e){
		// 		res.status(400).json(e);
		// });
  });
});
//----------------------------------------------------------------------------------------------------------------------

db.sequelize.sync().then(function(){
	app.listen(PORT,function(){
	console.log('Server started...');
	});
});
