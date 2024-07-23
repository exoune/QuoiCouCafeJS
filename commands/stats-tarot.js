const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js'); 
//const { client } = require('../index.js'); 

const { statsTarotSchema } = require('../data/statsTarot-schema.js');

const statsTarotModel = mongoose.model('statsTarot', statsTarotSchema);

//const CHANNEL_ID_TAROT = '1234793299735478284';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats-tarot')
        .setDescription('Affiche les stats d\'apparition des cartes de Tarot'),

    async execute(interaction) {
        try {
            // Récupérer tous les documents du classement
            const statsEntries = await statsTarotModel.find();

            // Diviser les entrées en chunks de 25 pour respecter la limite d'embed
            const chunkSize = 25;
            for (let i = 0; i < statsEntries.length; i += chunkSize) {
                const chunk = statsEntries.slice(i, i + chunkSize);

                // Construire un embed avec les données du classement
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Statistiques des apparitions des cartes de Tarot depuis le 24 juin 2024')
                    .setDescription('Voici les données actuelles :');

                // Ajouter les entrées triées à l'embed
                chunk.forEach(entry => {
                    embed.addFields({ 
                        name: entry.label, 
                        value: `Nombre d'apparition: ${entry.nb_apparition}, Gwendal: ${entry.gwendal}, Ambre: ${entry.ambre}, Lucas: ${entry.lucas}, Clémence: ${entry.clemence}, Fiona: ${entry.fiona}, Benjamin: ${entry.benjamin}` 
                    });
                });

/*                 const channel = client.channels.cache.get(CHANNEL_ID_TAROT);
                if (!channel) {
                    console.error(`Le canal avec l'ID ${CHANNEL_ID_TAROT} est introuvable.`);
                    await interaction.reply("Le canal spécifié est introuvable.");
                    return;
                }

                channel.send({ embeds: [embed] }); */

                // Envoyer l'embed dans le canal où la commande a été exécutée
                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des stats :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération des stats.");
        }
    },
};
