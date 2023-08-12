const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 6,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('I hope you die.');
	},

};