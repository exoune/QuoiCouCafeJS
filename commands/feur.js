const { SlashCommandBuilder } = require('@discordjs/builders');
const { feurCountSchema } = require('../data/feur-count-schema.js')
const { victimeSchema } = require('../data/victime-shema.js')
const { ActivityType } = require('discord.js');
const mongoose = require('mongoose')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('feur')
		.setDescription('Quoi ?')
    .addStringOption(option =>
			option
				.setName('victime')
				.setDescription('La personne qui c\'est fait feur')),

	async execute(interaction) {
    const FeurModel = mongoose.model('feur-counts', feurCountSchema);
    const VictimeModel = mongoose.model('victime', victimeSchema);
    const victime = interaction.options.getString('victime');

    await FeurModel.findOneAndUpdate({
      _id: interaction.user.id
      }, {
      _id: interaction.user.id,
      $inc : {
        feurCount: 1,
      }
      }, {
      upsert: true
    });
    
    if(victime!=undefined){
      console.log(victime)
      await VictimeModel.findOneAndUpdate({
        _id: interaction.user.id + victime,
        ravage: interaction.user.id,
        victime: victime
        }, {
        _id: interaction.user.id + victime,
        ravage: interaction.user.id,
        victime: victime,
        $inc : {
          feurCount: 1,
        }
        }, {
        upsert: true
      });
    }      

    let x = await FeurModel.findOne({
      _id: interaction.user.id
    });

    client.user.setPresence({
        activities: [{ name: `${x.feurCount} Feurs`, type: ActivityType.Playing }],
    });

    const message = `Compteur de Feur de ${interaction.user} : ${x.feurCount}`
		await interaction.reply(message);
	},
};