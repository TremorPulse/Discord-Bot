// Require the necessary discord.js classes.
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// The path module is Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');

// Create a new client instance.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();
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

// When the client is ready, run this code (only once).
// We use 'c' for the event parameter to keep it separate from the already defined 'client'.
client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

//  Get the matching command from the client.commands Collection based on the interaction.commandName. Your Client instance is always available via interaction.client.
client.on(Events.InteractionCreate, async interaction => {
	// If no matching command is found, log an error to the console and ignore the event.
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
// Call the command's .execute() method and pass in the interaction variable as its argument.
	try {
		await command.execute(interaction);
		// In case something goes wrong, catch and log any error to the console.
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);