package es.antigraviti.spilled;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.plugin.messaging.PluginMessageListener;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;

import com.google.common.collect.Iterables;
import com.google.common.io.ByteArrayDataInput;
import com.google.common.io.ByteArrayDataOutput;
import com.google.common.io.ByteStreams;
import com.google.gson.*;

public class Spilled extends JavaPlugin implements Listener, PluginMessageListener {
	public static final String VERSION = "1.0.0";
	private ArrayList<HashMap<String,String>> queue = new ArrayList<HashMap<String, String>>();
	private final Gson gson = new Gson();
	
	public void onEnable(){
		getServer().getPluginManager().registerEvents(this, this);
		getServer().getMessenger().registerOutgoingPluginChannel(this, "BungeeCord");
		getServer().getMessenger().registerIncomingPluginChannel(this, "BungeeCord", this);
		System.out.println("Spilled is now queueing messages.");
	}

	public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args){
		
		if( cmd.getName().equalsIgnoreCase("spilled") || cmd.getName().equalsIgnoreCase("moe") ){
			if( args.length == 0 ){
				sender.sendMessage(ChatColor.RED + "Spilled for " + ChatColor.BLUE + "moe" + ChatColor.RED + " v" + VERSION + "\n" + ChatColor.AQUA + "Copyright (C) 2016 Truly Mysterious Investigations. All rights reserved.");
				return true;
			}
			
			if( sender instanceof Player ){
				sender.sendMessage(ChatColor.RED + "This is a moe internal command. Only the console is allowed to run it.");
				return true;
			}
			
			if( args[0].equals("queue") ){
				sender.sendMessage(gson.toJson(queue));
				queue = new ArrayList<HashMap<String,String>>();
				return true;
			}
			
			if( args[0].equals("say") ){
				getServer().broadcastMessage(formatMessage(ChatColor.AQUA + "moe" + ChatColor.RESET, "", String.join(" ", Arrays.copyOfRange(args, 1, args.length))));
				forwardMessage("moe", "", String.join(" ", Arrays.copyOfRange(args, 1, args.length)));
				
			}
			
			
			return false;
		}
		
		return false;
		
	}
	
	private String formatMessage(String server, String name, String message){
		if( name != null && ! name.equals("") ) name="<" + name + "> ";
		else name="";
		return "[" + server + "] " + name + message;
	}
	
	private void forwardMessage(String server, String name, String message){
		ByteArrayDataOutput out = ByteStreams.newDataOutput();
		out.writeUTF("Forward");
		out.writeUTF("ALL");
		out.writeUTF("Spilled_MessageForward");

		ByteArrayOutputStream msgbytes = new ByteArrayOutputStream();
		DataOutputStream msgout = new DataOutputStream(msgbytes);
		
		try {
			msgout.writeUTF(formatMessage(server, name, message));
		} catch (IOException e) {
			e.printStackTrace();
		}
		out.writeShort(msgbytes.toByteArray().length);
		out.write(msgbytes.toByteArray());
		
		Iterables.getFirst(Bukkit.getOnlinePlayers(), null).sendPluginMessage(this, "BungeeCord", out.toByteArray());
	}
	
	@EventHandler
	public void onChat(AsyncPlayerChatEvent evt){
		HashMap<String,String> entry = new HashMap<String,String>();
		
		entry.put("moeID", "minecraft:" + evt.getPlayer().getUniqueId());
		entry.put("message", evt.getMessage());
		entry.put("name", evt.getPlayer().getDisplayName());
		
		forwardMessage(getServer().getMotd(), evt.getPlayer().getDisplayName(), evt.getMessage());
		
		queue.add(entry);
		
		evt.setCancelled(true);
		getServer().broadcastMessage(formatMessage(getServer().getMotd(), evt.getPlayer().getDisplayName(), evt.getMessage()));
		
		
	}

	public void onPluginMessageReceived(String channel, Player player, byte[] message) {
		if( ! channel.equals("BungeeCord") ) return;
		
		ByteArrayDataInput in = ByteStreams.newDataInput(message);
		String subchannel = in.readUTF();
		if( subchannel.equals("Spilled_MessageForward") ){
			String broadcast = in.readUTF();
			System.out.println(broadcast.substring(1));
			getServer().broadcastMessage(broadcast.substring(2));
		}
		
	}
	
}
