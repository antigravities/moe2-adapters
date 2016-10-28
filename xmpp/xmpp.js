module.exports = function(jid, password, messageProcessor){

  var Client = require("node-xmpp-client");

  var circ = this;

  this.messageProcessor = messageProcessor;
  this.jid = jid;
  this.bot = new Client({ jid: jid, password: password });

  this.bot.on("online", function(){
    console.log("Logged into Jabber/XMPP.");
    circ.bot.send(new Client.Stanza('presence', {})
      .c("show").t("chat").up()
      .c("status").t("For help, please visit https://moe.gravities.xyz/")
    );
  });

  this.bot.on("stanza", function(stanza){
    if( stanza.is("message") && stanza.attrs.type == "chat" && stanza.getChildText("body") != null ){
      var e = {};
      e.name = stanza.attrs.from.split("@")[0];
      e.from = "xmpp:" + stanza.attrs.from.split("@")[1].split("/")[0] + ":" + stanza.attrs.from.split("@")[0];
      e.adapter = circ;
      e.loopback = false;
      e.isGroupChat = false;
      circ.messageProcessor.exec(e.from, stanza.getChildText("body").trim(), function(msg){
        var reply = new Client.Stanza('message', { to: stanza.attrs.from, from: stanza.attrs.to });
        reply.c("body").t(msg);
        circ.bot.send(reply);
      }, e);
    }
  });

  this.intraAdapter = function(jabberid, message){
    var jidm = jabberid.split(":")[2] + "@" + jabberid.split(":")[1];
    var reply = new Client.Stanza('message', { to: jidm, from: circ.jid });
    reply.c("body").t(message);
    circ.bot.send(reply);
  }

  this.type="xmpp";
}
