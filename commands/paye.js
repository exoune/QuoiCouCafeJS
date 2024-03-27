const { SlashCommandBuilder } = require('@discordjs/builders');
const { CoinFoodSchema } = require('../data/coinFood-schema.js'); // Importer le modèle de la collection coinFood
const { utcToZonedTime } = require('date-fns-tz');
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paye')
        .setDescription('Recevoir une récompense quotidienne de coins'),

    async execute(interaction) {
        const CoinFoodModel = mongoose.model('coinFood', CoinFoodSchema);
        const userId = interaction.user.id;

        try {
            let user = await CoinFoodModel.findById(userId);

            if (!user) {
                // Si l'utilisateur n'existe pas dans la base de données, le créer
                user = await CoinFoodModel.create({
                    _id: userId,
                    coins: 5 // Initialiser le nombre de coins à 5
                });
            } else {
                // Vérifier si l'utilisateur a déjà reçu sa récompense aujourd'hui
                const now = new Date();
                const today = utcToZonedTime(now, 'UTC');
                const lastReward = user.lastReward ? utcToZonedTime(user.lastReward, 'UTC') : null;

                if (!lastReward || lastReward.getDate() !== today.getDate() || lastReward.getMonth() !== today.getMonth() || lastReward.getFullYear() !== today.getFullYear()) {
                    // Incrémenter le nombre de coins et mettre à jour la date de la dernière récompense
                    user.coins += 5;
                    user.lastReward = now;
                    await user.save();
                } else {
                    await interaction.reply('Vous avez déjà reçu votre récompense quotidienne aujourd\'hui.');
                    return;
                }
            }

            await interaction.reply('Vous avez reçu 5 coins en récompense!');
        } catch (error) {
            console.error('Error processing reward:', error);
            await interaction.reply('Une erreur s\'est produite lors du traitement de votre récompense.');
        }
    },
};
