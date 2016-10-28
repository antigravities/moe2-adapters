var kik = require("@kikinteractive/kik");

module.exports = function(user, key, url, messageProcessor){

        var circ = this;

        this.messageProcessor = messageProcessor;

        this.bot = new kik({
                username: user,
                apiKey: key,
                baseUrl: url
        });

        this.bot.updateBotConfiguration();

        this.bot.onTextMessage(function(m){
                circ.bot.getUserProfile(m.from).then(function(u){
                        var e = {};
                        e.name = u.displayName;
                        e.from = "kik:" + m.from;
                        e.adapter = circ;
                        e.loopback = false;
                        e.isGroupChat = false;
                        circ.messageProcessor.exec(e.from, m.body, function(x){
                                circ.bot.send(x, m.from);
                        }, e);
                });
        });

        this.bot.onStartChattingMessage(function(m){
                circ.bot.send("Hi! I'm moe, your favorite cute chatbot!");
        });

        this.httpSrv = require("http").createServer(this.bot.incoming()).listen(22233);

        this.type = "kik";
}
