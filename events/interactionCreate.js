const { Events } = require('discord.js');

module.exports = {
    // The name property states which event this file is for, and the once property holds a boolean value that specifies if the event should run only once.
    // Not specified in interactionCreate.js as the default behavior will be to run on every event instance. The execute function holds the event logic, which will be called by the event handler whenever the event emits.
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const { cooldowns } = client;

if (!cooldowns.has(command.data.name)) {
	cooldowns.set(command.data.name, new Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.data.name);
const defaultCooldownDuration = 3;
const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

if (timestamps.has(interaction.user.id)) {
	const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const expiredTimestamp = Math.round(expirationTime / 1000);
		return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
	}
	timestamps.set(interaction.user.id, now);
setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
