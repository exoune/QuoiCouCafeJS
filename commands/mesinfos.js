const { SlashCommandBuilder } = require('@discordjs/builders');
const { CoinFoodSchema } = require('../data/coinFood-schema.js'); // Importer le modèle de la collection coinFood
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesinfos')
        .setDescription('Affiche toutes vos informations'),

    async execute(interaction) {
        const CoinFoodModel = mongoose.model('coinFood', CoinFoodSchema);
        const userId = interaction.user.id;

        try {
            const user = await CoinFoodModel.findById(userId);

            if (!user) {
                await interaction.reply('Vous n\'avez pas encore de données enregistrées.');
                return;
            }

            const userInfo = `
                **ID Utilisateur:** ${userId}
                **Coins:** ${user.coins}
                **Food:** ${user.food}
                **VieF:** ${user.vieF}
                **NivF:** ${user.nivF}
                **Dernier Repas:** ${user.lastMeal ? user.lastMeal.toISOString() : 'Non défini'}
            `;

            await interaction.reply(userInfo);
        } catch (error) {
            console.error('Error fetching user information:', error);
            await interaction.reply('Une erreur s\'est produite lors de la récupération de vos informations.');
        }
    },
};
