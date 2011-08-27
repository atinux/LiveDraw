var http	=	require('http');
var fs      =	require('fs');
var io		=	require('socket.io');

// Creation du serveur
var app = http.createServer(function (req, res) {
	// On lit notre fichier app.html
	 fs.readFile('./app.html', 'utf-8', function(error, content) {
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(content);
	});
});

io = io.listen(app); // Socket io ecoute maintenant notre application !

// Variables globales
var dessin = [];
for (var i = 0; i < 100; i++)
	dessin[i] = 0;

//// SOCKET.IO ////

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {
	socket.emit('recupererDessin', dessin);
	socket.on('draw', function (p) {
		var i = p.i;
		var j = p.j;
		var couleur = p.couleur;
		dessin[i * 10 + j] = couleur;
		socket.broadcast.emit('caseColoree', { 'id':'case'+i+j, 'couleur':couleur });
	});
});

///////////////////

// Notre application ecoute sur le port 8080
app.listen(8080);
console.log('Live Draw App running at http://localhost:8080/');

