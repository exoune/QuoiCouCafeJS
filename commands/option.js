const { SlashCommandBuilder } = require('@discordjs/builders');
const { optionsSchema } = require('../data/options-schema.js')
const Discord = require('discord.js');
const mongoose = require('mongoose')
const Logger = require("../utils/Logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('option')
		.setDescription('Change une option')
        .addStringOption(option =>
			option
				.setName('option')
                .setRequired(true)
				.setDescription('Option à modifier'))
        .addBooleanOption(option =>
            option
                .setName('valeur')
                .setRequired(true)
                .setDescription('Valeur de l\'option (bool)')),
	async execute(interaction) {
        const optionModel = mongoose.model('options', optionsSchema);
        const value = interaction.options.getBoolean('valeur');
        const option = interaction.options.getString('option');

        const filter = { _name: option };
        const update = { value: value };
        x = await optionModel.findOneAndUpdate(filter, update)
            .catch(Logger.error);
        Logger.info(`Modified option : ${x}`);
        if(!!x){
            await interaction.reply({ content: `Modified option ${option} to ${value}`, ephemeral: true }).catch(Logger.error);
        } else {
            await interaction.reply({ content: `Option ${option} not found`, ephemeral: true }).catch(Logger.error);
        }
	},
};