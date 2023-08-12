// Require the necessary discord.js classes.
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// The path module is Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');

// Create a new client instance.
// The Client class in discord.js extends the EventEmitter class. Therefore, the client object exposes the .on() and .once() methods that you can use to register event listeners.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();
// Initialize a Collection to store cooldowns of commands.
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
	// path.join() helps to construct a path to the commands directory.
	const commandsPath = path.join(foldersPath, folder);
	// fs.readdirSync() method then reads the path to the directory and returns an array of all the file names it contains. To ensure only command files get processed, Array.filter() removes any non-JavaScript files from the array.
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// The callback function passed takes argument(s) returned by its respective event, collects them in an args array using the ... rest parameter syntax, then calls event.execute() while passing in the args array using the ... spread syntax.
// The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the execute function.
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);