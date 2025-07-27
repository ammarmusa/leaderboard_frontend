import { EventEmitter } from "events";

// This creates a singleton instance of an event emitter.
// By exporting the same instance, all parts of the app that import it
// will be communicating on the same channel.
const eventEmitter = new EventEmitter();

export default eventEmitter;
