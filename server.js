var express = require('express');
var app     = express(); //application instance
var PORT    = process.env.PORT || 3000;

app.get('/',function(req,res){
	res.send('ToDo Api route....');
}).listen(PORT,function(){
	console.log('Server started...');
});



/*
1.heroku create : makes a new heroku app and adds a heroku git remote

2.heroku rename APPNAME

//make sure commit done
3. git push heroku master

*/