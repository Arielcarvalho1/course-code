const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.addListener("evento", (args) => console.log(args.message));

emitter.emit("evento", {id: 1, "message": "hellow"});