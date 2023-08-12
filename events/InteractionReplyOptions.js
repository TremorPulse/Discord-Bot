const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'You still alive?', ephemeral: true });
        await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('I hope you die.');
	}
});