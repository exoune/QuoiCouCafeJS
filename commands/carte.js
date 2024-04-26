const { SlashCommandBuilder } = require('@discordjs/builders');
const { carteSchema } = require('../data/carte-schema.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('carte')
        .setDescription('Affiche une carte de tarot aléatoire'),

    async execute(interaction) {
        const carteModel = mongoose.model('carte', carteSchema);
        
        try {
            // Rechercher une carte aléatoire dans la base de données
            const random = Math.floor(Math.random() * 78) + 1;
            const randomCard = await carteModel.findOne({ _id: random });

            console.log('Carte de tarot aléatoire trouvée :', randomCard.label);
            
            if (!randomCard) {
                await interaction.reply("Aucune carte de tarot trouvée.");
                return;
            }

            // Construire le message avec les détails de la carte
            let replyMessage = `**Carte de Tarot:** ${randomCard.label}\n\n`;
            let replyMessageDes = `**Description:**\n${randomCard.description}\n`;

            // Choisir aléatoirement entre l'endroit et l'envers
            const randomChoice = Math.floor(Math.random() * 2) + 1;
            if (randomChoice === 1) {
                replyMessage += `**Endroit:**\n${randomCard.description_endroit}\n`;
            } else {
                replyMessage += `**Envers:**\n${randomCard.description_envers}\n`;
            }

            // Récupérer l'URL de l'image de la carte aléatoire
            const gifUrl = randomCard.image;

            const CHANNEL_ID = '1232679990471037021';
            const channel = interaction.client.channels.cache.get(CHANNEL_ID);

            await channel.send({
                content: replyMessage,
                files: [gifUrl]
            })

            await channel.send(replyMessageDes);

            // Envoyer le message avec l'image attachée
/*              await interaction.reply({
                content: replyMessage,
                files: [gifUrl]
            }); */

        } catch (error) {
            console.error('Erreur lors de la récupération de la carte de tarot :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération de la carte de tarot.");
        }
    },
};
