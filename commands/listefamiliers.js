const { SlashCommandBuilder } = require('@discordjs/builders');
const { mesfamiliersSchema } = require('../data/mesfamiliers-schema.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listefamiliers')
        .setDescription('Affiche la liste de tous les familiers de chaque utilisateur'),

    async execute(interaction) {
        try {
            const MesFamiliersModel = mongoose.model('mesfamiliers', mesfamiliersSchema);
            const allUsers = await MesFamiliersModel.find({});

            if (!allUsers.length) {
                await interaction.reply("Il n'y a pas encore d'utilisateurs avec des familiers.");
                return;
            }

            let replyMessage = "Liste de tous les familiers des utilisateurs :\n";

            allUsers.forEach(user => {
                if (user.familiersAttrapes.length > 0) {
                    const familiarList = user.familiersAttrapes.join(', ');
                    if(user._id == "386880970655268865"){
                        replyMessage += `Utilisateur: FIONA \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "217279235021209600"){
                        replyMessage += `Utilisateur: GWENDAL \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "365180026376945667"){
                        replyMessage += `Utilisateur: CLEMENCE \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "124917171359973376"){
                        replyMessage += `Utilisateur: BENJAMIN \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "300762664714371073"){
                        replyMessage += `Utilisateur: LUCAS \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "688751205643714623"){
                        replyMessage += `Utilisateur: CHLOE \nFamiliers: ${familiarList}\n\n`;
                    }
                    if(user._id == "356091017314828289"){
                        replyMessage += `Utilisateur: AMBRE \nFamiliers: ${familiarList}\n\n`;
                    }
                }
            });

            await interaction.reply(replyMessage);
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste des familiers :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération de la liste des familiers.");
        }
    },
};
