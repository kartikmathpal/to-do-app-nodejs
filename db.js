//load all modules into sequelize
//return database connection to serverjs ,where request is made

var Sequelize = require('sequelize');
var env  = process.env.NODE_ENV || 'development';
var sequelize ;
if(env ==='production'){
	sequelize = new Sequelize(process.env.DATABASE_URL,{
		dialect : 'postgres'
	});
}
else{
	 sequelize  = new Sequelize(undefined,undefined,undefined,{ //creating a blue print
	 
	 'dialect' : 'sqlite',//This object tells the ORM about the DB which we want to use 
	 'storage' : __dirname + '/data/dev-todo-api.sqlite'//and where we want to store that DB 
});

}
// var sequelize  = new Sequelize(undefined,undefined,undefined,{ //creating a blue print
	 
// 	 'dialect' : 'sqlite',//This object tells the ORM about the DB which we want to use 
// 	 'storage' : __dirname + '/data/dev-todo-api.sqlite'//and where we want to store that DB 
// });

var db = {};

//To the above object add property
db.todo      = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;