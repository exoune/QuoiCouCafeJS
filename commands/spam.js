const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Logger = require("../utils/Logger");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spam')
		.setDescription('Spam une phrase x fois')
        .addStringOption(option =>
			option
				.setName('message')
                .setRequired(true)
				.setDescription('Message à spam'))
        .addIntegerOption(option =>
            option
                .setName('repeat')
                .setRequired(true)
                .setDescription('Nombre de fois où le message doit être répété')),
	async execute(interaction) {
        let repeat = interaction.options.getInteger('repeat');
        const text = interaction.options.getString('message');
        const channel = interaction.channel;

        if (repeat > 50 && interaction.member.user.username != "nwen"){
            Logger.warn(`SPAM | ${interaction.channel.name} | ${interaction.member.user.username} | Trop de spam (${repeat})`)
            repeat = 50;
        }

        Logger.info(`SPAM | ${interaction.channel.name} | ${interaction.member.user.username} | ${text} : ${repeat} fois`)
        await interaction.reply({ content: `Envoi de "${text}" ${repeat} fois.`, ephemeral: true }).catch(Logger.error);

        for (let i = 0; i < repeat; i++) {
            channel.send(text).catch(Logger.error);
            await sleep(1000);
          }
        Logger.info("SPAM | Fini")
	},
};