var OxyMoeRust = {
        Title: "OxyMoe",
        Author: "Alexandra F.",
        Version: V(0,1,0),
        Description: "moe for Oxide/Rust",

        MoeIsConnected: false,

        MessageQueueTimer: null,
        Timer: null,
        Messages: null,

        Init: function(){
                command.AddChatCommand("moe", this.Plugin, "Command_Moe");
                command.AddConsoleCommand('moe.sendas', this.Plugin, 'Command_SendAsMoe');
        },

        Unload: function(){
                if( this.Timer ) this.Timer.Destroy();
        },

        SendMessageToPlayer: function(p, m){
                rust.SendChatMessage(p, "<color=#00ffffff>moe</color>: " + m, null, "76561198115120933");
        },

        BroadcastMessage: function(m){
                rust.BroadcastChat("<color=#00ffffff>moe</color>: " + m, null, "76561198115120933");
        },

        // Commands

        Command_Moe: function(player, cmd, arg){

                var msg = "<size=22>Oxy-Moe " + this.Version + "</size>\nmoe abstraction layer for Oxide-compatible Rust servers\n";
                msg+="moe is copyright (C) 2016 alexandra.moe.";

                this.SendMessageToPlayer(player, msg);
        },

        Command_SendAsMoe: function(arg){
                if( arg.connection || ! arg.args ) return;

                this.BroadcastMessage(arg.args.join(" "));
        },

        // Hooks

        OnPlayerChat: function(arg){
                var c = this;
                timer.Once(0.000001, function(){
                        var message = arg.GetString(0, "text");
                        print("MESSAGE_MOE STEAMID " + rust.UserIDFromConnection(arg.connection) + " " + arg.connection.player.displayName.split(" ").join("_").replace("[PLSNO]_", "") + " PAYLOAD " + message);
                });
        },

};
