const { SlashCommandBuilder } = require('@discordjs/builders');
const { feurCountSchema } = require('../data/feur-count-schema.js')
const Discord = require('discord.js');
const mongoose = require('mongoose')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('topfeur')
		.setDescription('Leaderboard des Feur'),
	async execute(interaction) {
    const FeurModel = mongoose.model('feur-counts', feurCountSchema)
    let x = await FeurModel.find({}).sort({feurCount: -1});

    let message = 'Leaderboard\n'

    x.forEach((item, index) => {
        message += `<@${item._id}>`
        message += " | "
        message += item.feurCount
        message += '\n'
      })

	await interaction.reply(message)
	},
};