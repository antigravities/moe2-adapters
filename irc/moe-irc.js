module.exports = function(server, channels, nick, nickservpw, messageProcessor){
  this.channels = channels;
  this.nick = nick;
  this.nickservpw = nickservpw;
  this.server = server;
  this.chan = channels[0];

  var circ = this;

  var irc = require("irc");
  this.bot = new irc.Client(this.server, this.nick, {
    channels: this.channels,
    userName: "moe",
    realName: "moe"
  });

  this.sendMessageTemplate = function(msg,who){
      if( ! who ) circ.bot.say(circ.chan, f + ": " + msg);
      else circ.bot.say(circ.chan, msg);

      var e = {};
      e.name = circ.nick;
      e.from = "irc:" + this.server;
      e.adapter = circ;
      e.loopback = true;
      e.isGroupChat = true;

      circ.messageProcessor.exec("irc:" + circ.server + ":" + circ.nick, msg, function(msg){ }, e);
    };

  this.bot.addListener("message" + this.chan, function(f,m){
    var e = {};
    e.name = f;
    e.from = "irc:" + this.server;
    e.adapter = circ;
    e.loopback = false;
    e.isGroupChat = true;

    circ.messageProcessor.exec("irc:" + circ.server + ":" + f, m, function(msg,who){
      if( ! who ) circ.bot.say(circ.chan, f + ": " + msg);
      else circ.bot.say(circ.chan, msg);

      var e = {};
      e.name = circ.nick;
      e.from = "irc:" + this.server;
      e.adapter = circ;
      e.loopback = true;
      e.isGroupChat = true;

      circ.messageProcessor.exec("irc:" + circ.server + ":" + circ.nick, msg, function(msg){ }, e);
    }, e);
  });

  this.bot.addListener("motd", function(){
    if( nickservpw != null ) circ.bot.send("PRIVMSG", "NickServ", "IDENTIFY " + nickservpw);
    console.log("Logged onto IRC.");
  });

  this.bot.addListener("join", function(chan, nick){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + nick + " has joined");
    });
  });

  this.bot.addListener("part", function(chan, nick, reason){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + nick + " has parted (" + reason + ")");
    });
  });

  this.bot.addListener("quit", function(n,r,c,m){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + n + " has quit (" + r + ")");
    });
  });

  this.bot.addListener("kick", function(c,n,b,r,m){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + n + " was kicked by " + b + " (" + r + ")");
    });
  });

  this.bot.addListener("kill", function(n,r,c,m){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + n + " was K-lined");
    });
  });

  this.bot.addListener("nick", function(o,n,c,m){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + o + " has changed their nick to " + n);
    });
  });

  this.bot.addListener("action", function(f,to,t,m){
    database.irc.forEach(function(v,k){
      v.messenger("[IRC] " + f + " " + t);
    });
  });

  this.bot.addListener("pm", function(nick, text, message){
    var e = {};
    e.name = nick;
    e.from = "irc:" + this.server + ":" + nick;
    e.adapter = circ;
    e.loopback = false;
    e.isGroupChat = false;

    circ.messageProcessor.exec("irc:" + circ.server + ":" + nick, text, function(msg){ circ.bot.say(nick, msg); }, e);
  });

  this.bot.addListener("ctcp-version", function(f,t,m){
    var lyrics = [ "This was a triumph. I'm making a note here, HUGE SUCCESS.", "It's hard to overstate my satisfaction.", "Aperture Science: we do what we must, because we can.", "For the good of all of us, except the ones who are dead.", "But there's no sense crying over every mistake; you just keep on trying 'til you run out of cake.", "And the science gets done; and you make a neat gun, for the people who are, still alive.", "I'm not even angry - I'm being so sincere right now; even though you broke my heart and killed me.", "And tore me to pieces, and threw every piece into a fire.", "As they burned, it hurt because I was so happy for you!", "Now these points of data make a beautiful line.", "And we're out of beta, we're releasing on time!", "So I'm GlaD I got burned; think of all the things we learned for the people who are still alive.", "Go 'head and leave me... I think I'd prefer to stay inside.", "Maybe you'll find someone else to help you. Maybe Black Mesa. That was a joke - HA HA. FAT CHANCE!", "Anyway, this cake is great, it's so delicious and moist!", "Look at me still talking, when there's science to do. When I look out there, it makes me GlaD I'm not you!", "I've experiments to run, there is research to be done, on the people who are still alive.", "And believe me, I am - still alive.", "I'm doing science and I'm - still alive.", "I feel FAN TASTIC and I'm - still alive.", "While you're dying, I'll be - still alive.", "And when you're dead I will be - still alive.", "Still alive. Still alive." ];

    circ.bot.ctcp(f, "VERSION", lyrics[Math.floor(Math.random()*lyrics.length)]);
  });

  this.sendMessage = function(f,x){
    circ.bot.say(circ.chan, f);

    if( ! x ) return;

    var e = {};
    e.name = circ.nick;
    e.from = "irc:" + this.server;
    e.adapter = circ;
    e.loopback = true;
    e.isGroupChat = true;

    circ.messageProcessor.exec("irc:" + circ.server + ":" + circ.nick, f, function(msg){ }, e);

  }

  this.messageProcessor = messageProcessor;

  this.intraAdapter = function(id, message){
    var nick = id.split(":")[2];
    circ.sendMessage(nick + ": " + message, true);
  }

  this.type = "irc";
}
