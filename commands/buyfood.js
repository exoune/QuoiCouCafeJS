const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Utilisez MessageEmbed au lieu de EmbedBuilder
const mongoose = require('mongoose');
const { coinFoodSchema } = require('../data/coinFood-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buyfood')
        .setDescription('Acheter de la nourriture avec vos coins'),

    async execute(interaction) {
        const userId = interaction.user.id;
        
        try {
            const coinFoodModel = mongoose.model('coinFood', coinFoodSchema);
            const user = await coinFoodModel.findOne({ _id: userId });

            if (!user) {
                await interaction.reply("Vous n'avez pas encore attrapé de familiers.");
                return;
            }

            // Créez un message proposant différentes options de nourriture à acheter
            const embed = new EmbedBuilder() // Utilisez MessageEmbed
                .setColor('#0099ff')
                .setTitle('Options de nourriture')
                .setDescription('Réagissez avec l\'emoji correspondant pour acheter de la nourriture.\n\n🍎 - Pomme (2 coins)');

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            // Ajoutez des réactions aux options de nourriture
            await message.react('🍎');

            // Fonction pour écouter les réactions des utilisateurs
            const collectorFilter = (reaction, user) => {return ['🍎'].includes(reaction.emoji.name) && user.id === interaction.user.id; };

            message.awaitReactions({ filter: collectorFilter, max: 10, time: 60_000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
    
                    if (reaction.emoji.name === '🍎') {
                        // Vérifiez si l'utilisateur a assez de coins pour acheter la nourriture
                        if (user.coins < 2) { // Utilisez user.coins pour vérifier les pièces de l'utilisateur
                            interaction.followUp("Vous n'avez pas assez de coins pour acheter cette nourriture.");
                            return;
                        }

                        // Mettez à jour la base de données de l'utilisateur pour incrémenter la nourriture et décrémenter les coins
                        user.coins -= 2;
                        user.food += 1;
                        user.save();

                        interaction.followUp("Vous avez acheté une pomme !");
                    // Ajoutez d'autres cas pour d'autres options de nourriture si nécessaire
                    } else {
                        message.reply('Mauvais emoji');
                    }
                })
                .catch(collected => {
                    message.reply('La sélection de nourriture a expiré.');
                });
            
        }catch (error) {
            console.error('Achat nourriture', error);
            await interaction.reply('Une erreur s\'est produite lors de l\'achat de nourriture.');
        }
    },
};
