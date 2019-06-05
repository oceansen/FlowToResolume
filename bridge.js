var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer, oscClient;

io.on('connection', function (socket) {
  socket.on('config', function (obj) {
    console.log('config', obj);
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.id + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      socket.emit('message', msg);
      console.log('sent OSC message to WS', msg, rinfo);
    });
  });
  
  //var regex_values = /[+-]?\d+(\.\d+)?/g;

  var regex_values = /(?!.*\/)[+-]?\d+(\.\d+)?/g;
  socket.on('message', function (obj) {

    var values =obj.match(regex_values).map(function(v) { return parseFloat(v); });
    console.log(values);
	
	var address_string=obj.replace(values[0].toString(),"");
	console.log(address_string);
	
    oscClient.send(address_string, values[0]);
    //oscClient.send(obj);
    console.log('sent WS message to OSC', address_string, values[0]);
  });
  
  
  /*socket.on("message", function (address,value) {
      console.log(value);
      oscClient.send(address, value);
  });
  */
  
  socket.on("disconnect", function () {
    oscServer.kill();
  })
});
