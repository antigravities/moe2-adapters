var Rcon = require("rcon");

module.exports = function(host, port, password, messageProcessor){

  this.messageProcessor = messageProcessor;
  this.type = "spilled";
  var circ = this;

  this.conn = new Rcon(host, port, password);

  this.conn.on("auth", function(){
    console.log("OK");
  }).on("response", function(x){
    try { x=JSON.parse(x); } catch(e) { return; }
    x.forEach(function(v){
      console.log(v);
      var e = {};
      e.name = v.name;
      e.from = v.moeID;
      e.adapter = circ;
      e.loopback = false;
      e.isGroupChat = true;

      circ.messageProcessor.exec(e.from, v.message, function(m,n){
        if( n ) circ.conn.send("moe say " + m);
        else circ.conn.send("moe say " + e.name + ": " + m);
      }, e);
    });
  }).on("end", function(){
    console.log("Socket closed");
  });

  setInterval(function(){
    circ.conn.send("moe queue");
  }, 1000);
  this.conn.connect();
};
