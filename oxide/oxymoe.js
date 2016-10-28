var Rcon = require("sourcecon");

module.exports = function(hostname, password, port, messageProcessor){
  this.con = new Rcon(hostname, port);

  this.type = "oxymoe";

  this.messageProcessor = messageProcessor;
  var circ = this;

  this.con.connect(function(e){
    if( e ) throw(e);
    circ.con.auth(password, function(e){
      if( e ) throw(e);
    });
    circ.con.on("message", function(m){
      if( m.body.toString().substring(0,7) == "[Oxide]" && m.body.indexOf("MESSAGE_MOE") > -1 ){
        var msg = m.body.toString().split(" ").splice(3);
        msg = {
          steamid: msg[2],
          name: msg[3],
          message: msg.splice(5).join(" ")
        };
        var e = {};
        e.name = msg.name;
        e.from = "steam:" + msg.steamid;
        e.adapter = circ;
        e.loopback = false;
        e.isGroupChat = true;

        circ.messageProcessor.exec(e.from, msg.message, function(msg, name){
          if( name ) circ.con.send("moe.sendas " + msg);
          else circ.con.send("moe.sendas  " + e.name.split("_").join(" ") + ": " + msg);
        }, e);
      }
    });
    circ.con.on("connect", function(m){
      console.log("Connected to RCON");
    })
  });

  this.sendMessage = function(m,t){
    if( ! t ) circ.con.send("moe.sendas " + m);
    else circ.con.send("moe.sendas " + t + ": " + m);
  };
}
