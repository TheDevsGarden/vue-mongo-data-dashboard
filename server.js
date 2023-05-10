//Création d'un serveur avec NodeJS

var http = require('http');

//Requête
var serverRequest = function (request, response){
    console.log(request.headers);
    response.setHeader("Application", "HelloWorld");
    response.write("Introduction a NodeJS")
    response.end();
}

var port = 8000;
var server = http.createServer(serverRequest);
server.listen(port);
console.log("Server started on port: " + port);

//Pour rouler le serveur : écrire dans le terminal : node server