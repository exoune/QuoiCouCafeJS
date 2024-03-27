const { SlashCommandBuilder } = require('@discordjs/builders');
const { mesfamiliersSchema } = require('../data/mesfamiliers-schema.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesfamiliers')
        .setDescription('Affiche tous vos familiers'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const mesfamiliersModel = mongoose.model('mesfamiliers', mesfamiliersSchema);

        try {
            const user = await mesfamiliersModel.findOne({ _id: userId });
            if (!user || user.familiersAttrapes.length === 0) {
                await interaction.reply('Vous n\'avez pas encore attrapé de familiers.');
                return;
            }

            const familiers = user.familiersAttrapes.join(', ');

            await interaction.reply(`Vos familiers : ${familiers}`);
        } catch (error) {
            console.error('Error fetching user familiers:', error);
            await interaction.reply('Une erreur s\'est produite lors de la récupération de vos familiers.');
        }
    },
};
