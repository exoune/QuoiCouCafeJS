const { SlashCommandBuilder } = require('@discordjs/builders');
const { CoinFoodSchema } = require('../data/coinFood-schema.js'); // Importer le modèle de la collection coinFood
const { utcToZonedTime } = require('date-fns-tz');
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('food')
        .setDescription('Utiliser de la nourriture pour nourrir votre familiers'),

    async execute(interaction) {
        const CoinFoodModel = mongoose.model('coinFood', CoinFoodSchema);
        const userId = interaction.user.id;

        try {
            let user = await CoinFoodModel.findById(userId);

            if (!user) {
                await interaction.reply('Vous n\'avez pas de nourriture.');
                return;
            }

            // Vérifier si l'utilisateur a déjà utilisé sa nourriture aujourd'hui
            const now = new Date();
            const today = utcToZonedTime(now, 'UTC');
            const lastMeal = user.lastMeal ? utcToZonedTime(user.lastMeal, 'UTC') : null;

            if (lastMeal && lastMeal.getDate() === today.getDate() && lastMeal.getMonth() === today.getMonth() && lastMeal.getFullYear() === today.getFullYear()) {
                await interaction.reply('Vous avez déjà utilisé votre nourriture aujourd\'hui.');
                return;
            }

            if (user.food < 5) {
                await interaction.reply('Vous n\'avez pas assez de nourriture.');
                return;
            }

            // Décrémenter la quantité de food et mettre à jour la date du dernier repas
            user.food -= 5;
            user.lastMeal = now;

            // Incrémenter vieF si elle est inférieure à 100
            if (user.vieF < 100) {
                user.vieF = Math.min(100, user.vieF + 5);
            } else {
                // Passer au niveau de familiers suivant
                user.vieF = 100; // Remettre vieF à 100
                user.nivF += 1; // Incrémenter le niveau de familiers
            }

            await user.save();
            await interaction.reply('Votre familiers a été nourri avec succès!');
        } catch (error) {
            console.error('Error processing food command:', error);
            await interaction.reply('Une erreur s\'est produite lors du traitement de la nourriture.');
        }
    },
};
