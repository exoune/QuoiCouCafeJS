const { SlashCommandBuilder } = require('@discordjs/builders');
const { feurCountSchema } = require('../data/feur-count-schema.js')
const { victimeSchema } = require('../data/victime-shema.js')
const Discord = require('discord.js');
const mongoose = require('mongoose')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('feurlist')
		.setDescription('Savoir qui a Feur qui')
    .addUserOption(option =>
			option
				.setName('user')
				.setDescription('Utilisateur dont on veux les détails')
        .setRequired(true)
        ),

	async execute(interaction) {
    const FeurModel = mongoose.model('feur-counts', feurCountSchema);
    const VictimeModel = mongoose.model('victime', victimeSchema);
    const user = interaction.options.getUser('user');

    let x = await FeurModel.findOne({
      _id: user.id
    });

    let y = await VictimeModel.find({
      ravage: user.id
    });

    //console.log(y);

    let message = `Détails des Feur de ${user}\nTotal des feurs : ${x.feurCount}\n`
    y.forEach(elem => {
      message += `${elem.victime} : ${elem.feurCount}\n`
      console.log(elem.ravage + " " + elem.victime + " : " + elem.feurCount)
    });
		await interaction.reply(message);
	},
};