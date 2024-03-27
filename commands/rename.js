const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { mesfamiliersSchema } = require('../data/mesfamiliers-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Renomme un familier dans votre liste de familiers')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('nom du familier à renommer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('new')
                    .setDescription('Nouveau nom du familier')
                    .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const familiarName = interaction.options.getString('nom');
        const newFamiliarName = interaction.options.getString('new');

        try {
            const mesfamiliersModel = mongoose.model('mesfamiliers', mesfamiliersSchema);
            const user = await mesfamiliersModel.findOne({ _id: userId });

            if (!user) {
                await interaction.reply("Vous n'avez pas encore attrapé de familiers.");
                return;
            }

            // Vérifiez si le familier avec le nouveau nom existe déjà dans la liste
            if (user.familiersAttrapes.includes(newFamiliarName)) {
                await interaction.reply("Vous avez déjà un familier avec ce nom.");
                return;
            }

            // Trouver l'index du familier dans la liste
            const familiarIndex = user.familiersAttrapes.indexOf(familiarName);

            // Vérifier si le familier avec le nom donné existe dans la liste
            if (familiarIndex === -1) {
                await interaction.reply("Vous n'avez pas de familier avec ce nom.");
                return;
            }

            // Renommer le familier
            user.familiersAttrapes[familiarIndex] = newFamiliarName;
            await user.save();

            await interaction.reply(`Le familier "${familiarName}" a été renommé en "${newFamiliarName}".`);
        } catch (error) {
            console.error('Erreur lors du renommage du familier:', error);
            await interaction.reply("Une erreur s'est produite lors du renommage du familier.");
        }
    },
};
