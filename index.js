var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendfile('index.html', {test : 1});
});

var arrSockets = [];

io.on('connection', function(socket){
 	console.log('a user connected');

 	// arrSockets.push(socket);

 	socket.on('register', function(sessionId){
 		
 		var type = 'X';

 		if(sessionId === '' || arrSockets[sessionId] === undefined){
 			sessionId = Math.round(Math.random()*100);

	 		arrSockets[sessionId] = {
	 			socket : socket,
	 			socketConnected : null
	 		};

 		}else{
 			type = 'O';
 			arrSockets[sessionId].socketConnected = socket;
 		}

 		socket.emit('registerSuccess', sessionId, type);
 		// console.log(arrSockets);

 	});

 	socket.on('message', function(msg ,sessionId){
 		console.log(msg, sessionId);

 		var _socket = ( arrSockets[sessionId].socket.id === socket.id ) ? arrSockets[sessionId].socketConnected : arrSockets[sessionId].socket;
 		_socket.emit('message', 'resposta de ' + msg);

 		// arrSockets.forEach(function(_socket, i){
 		// 	_socket.emit('message', 'resposta de ' + msg + ' --- ' + i);
 		// });

 	});

 	socket.on('disconnect', function(socket){
 		console.log('a user disconnected');
 	})

 	socket.on('game', function(sessionId, _class, type){
 		
 		console.log('GAME!', sessionId, _class, type);
 		
 		var _socket = ( arrSockets[sessionId].socket.id === socket.id ) ? arrSockets[sessionId].socketConnected : arrSockets[sessionId].socket;
 		_socket.emit('gameEvent', _class, type);

 	})

});

http.listen(3000, function(){
 	console.log('listening on *:3000');
});