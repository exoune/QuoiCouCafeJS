const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Logger = require("../utils/Logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Fait un sondage')
        .addStringOption(option =>
			option
				.setName('question')
                .setRequired(true)
				.setDescription('Question à poser'))
        .addStringOption(option =>
            option
                .setName('option1')
                .setRequired(true)
                .setDescription('Option 1'))
        .addStringOption(option =>
            option
                .setName('option2')
                .setRequired(true)
                .setDescription('Option 2'))
        .addStringOption(option =>
            option
                .setName('option3')
                .setDescription('Option 3'))
        .addStringOption(option =>
            option
                .setName('option4')
                .setDescription('Option 4'))
        .addStringOption(option =>
            option
                .setName('option5')
                .setDescription('Option 5')),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { channel } = await interaction;
        const options = await interaction.options.data;
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        const text = interaction.options.getString('question');

        let embed = new EmbedBuilder()
            .setTitle(`${text}`)
            .setColor(0x019145);

        for (let index = 1; index < options.length; index++) {
            let emoji = emojis[index-1];
            let option = options[index];
            embed.addFields(
                {
                    name: `${emoji} ${option.value}`,
                    value: ' '
                }
            )
            
        }

        const message = await channel.send({embeds: [embed]});

        for (let index = 1; index < options.length; index++) {
            let emoji = emojis[index-1];
            await message.react(emoji);
        }

        await interaction.editReply({ content: 'Sondage envoyé !', ephemeral: true }).catch(Logger.error);
	},
};