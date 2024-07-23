const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { angleSchema } = require('../data/angle-schema.js');
const { classementAngleSchema } = require('../data/classementAngle-schema.js'); 

const angleModel = mongoose.model('angle', angleSchema);
const classementAngleModel = mongoose.model('classementAngle', classementAngleSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guessangles')
        .setDescription('Devinez l\'angle')
        .addIntegerOption(option => 
            option.setName('angle')
                .setDescription('L\'angle à deviner')
                .setRequired(true)),

    async execute(interaction) {
        const guess = interaction.options.getInteger('angle');
        const angle = await angleModel.findOne({ _id: "1" });
        const classementUser = await classementAngleModel.findOne({ _id: interaction.user.id });
        
        if (!classementUser) {
            await interaction.reply("Utilisateur non trouvé dans le classement.");
            return;
        }
        
        classementUser.nombre_essai += 1;

        if (classementUser.trouver === true) {
            await interaction.reply("Vous avez déjà trouvé l'angle, vous ne pouvez plus jouer.");
            return;
        }

        try {
            // Sauvegarder les modifications dans la base de données
            await classementUser.save();

            if (guess === angle.angle) {
                await interaction.reply(`Bravo ${interaction.user.username}, vous avez deviné l'angle correct en ${classementUser.nombre_essai} essais !`);
                classementUser.trouver = true;  // Marquer l'angle comme trouvé
                await classementUser.save();    // Sauvegarder de nouveau après modification
            } else if (Math.abs(guess - angle.angle) <= 5) {
                if (guess > angle.angle) {
                    await interaction.reply(`Vous êtes proche ${interaction.user.username}, mais votre devinette est légèrement au-dessus. Essayez encore !`);
                } else {
                    await interaction.reply(`Vous êtes proche ${interaction.user.username}, mais votre devinette est légèrement en dessous. Essayez encore !`);
                }
            } else {
                if (guess > angle.angle) {
                    await interaction.reply(`Désolé ${interaction.user.username}, ce n'est pas le bon angle. Votre devinette est au-dessus. Essayez encore !`);
                } else {
                    await interaction.reply(`Désolé ${interaction.user.username}, ce n'est pas le bon angle. Votre devinette est en dessous. Essayez encore !`);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la lecture de l\'angle :', error);
            await interaction.reply("Une erreur s'est produite lors de la lecture de l'angle.");
        }
    }
};
