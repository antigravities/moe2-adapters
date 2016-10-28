# moe2-adapters
Open adapters for moe2.

**These will absolutely not work on their own.** They are a foundation on which you should build your own thing.

## FAQ

### So how do I use these?
Initialize them using the arguments (which should be self explanatory) and pass a MessageProcessor.

### What is a MessageProcessor?
````
MessageProcessor = {};
MessageProcessor.exec = function(String from, String message, Function sendMessage, Object metaInformation){}
// There's some other methods here that you shouldn't really care about unless you're developing on moe
````

### Can I dynamically update the message processor?
Yes.
````
var adapter = new Adapter(a1, a2, a3..., messageProcessor);
adapter.messageProcessor = new MessageProcessor();
````

### Where's the Steam adapter?
Still closed.

### Can I use moe myself?
[Yes.](https://steamcommunity.com/id/robomoe)

### I have a question that isn't answered here!
Sorry, I'm not providing support with these. You're on your own, use the source :)
