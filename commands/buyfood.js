const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const { coinFoodSchema } = require('../data/coinFood-schema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buyfood')
        .setDescription('Acheter de la nourriture avec vos coins'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const pomme = '🍎';
        
        try {
            const coinFoodModel = mongoose.model('coinFood', coinFoodSchema);
            let user = await coinFoodModel.findOne({ _id: userId });

            if (!user) {
                await interaction.reply("Vous n'avez pas encore de compte pour acheter de la nourriture.");
                return;
            }

            // Création du message proposant différentes options de nourriture à acheter
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Options de nourriture')
                .setDescription('Réagissez avec l\'emoji correspondant pour acheter de la nourriture.\n\n🍎 - Pomme (2 coins)');

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });

            // Ajout des réactions aux options de nourriture
            await message.react('🍎');
            await message.react('🍐');
            
            // Attend que le message soit complètement disponible
            await message.fetch();

            // Attend les réactions des utilisateurs pendant 60 secondes
            const collector = message.createReactionCollector({ time: 60000 });

            collector.on('collect', async (reaction, user) => {
                // Vérifiez si l'utilisateur est le bot ou si la réaction n'est pas une des réactions attendues
                if (reaction.me || !['🍎', '🍐'].includes(reaction.emoji.name)) return;

                console.log(`Reaction: ${reaction.emoji.name}, User: ${user.username}`);

                // Votre logique pour traiter les réactions des utilisateurs ici
                if (reaction.emoji.name === '🍎') {
                    // Logique pour acheter une pomme
                    console.log(`POMME`);

                    // Vérification si l'utilisateur a assez de coins pour acheter la nourriture
                    if (user.coins < 2) {
                        await interaction.followUp("Vous n'avez pas assez de coins pour acheter cette nourriture.");
                        return;
                    }

                    // Mise à jour de la base de données de l'utilisateur pour incrémenter la nourriture et décrémenter les coins
                    user.coins -= 2;
                    user.food += 1;
                    await user.save();

                    await interaction.followUp("Vous avez acheté une pomme !");
                } else if (reaction.emoji.name === '🍐') {
                    // Logique pour acheter une poire
                    console.log(`POIRE`);

                    // Vérification si l'utilisateur a assez de coins pour acheter la nourriture
                    if (user.coins < 3) {
                        await interaction.followUp("Vous n'avez pas assez de coins pour acheter cette nourriture.");
                        return;
                    }

                    // Mise à jour de la base de données de l'utilisateur pour incrémenter la nourriture et décrémenter les coins
                    user.coins -= 3;
                    user.food += 1;
                    await user.save();

                    await interaction.followUp("Vous avez acheté une poire !");
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await interaction.followUp("La sélection de nourriture a expiré.");
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'achat de nourriture :', error);
            await interaction.reply("Une erreur s'est produite lors de l'achat de nourriture.");
        }
    },
};
