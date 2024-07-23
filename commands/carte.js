const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

const { carteSchema } = require('../data/carte-schema.js');
const { statsTarotSchema } = require('../data/statsTarot-schema.js');
const { userPSchema } = require('../data/userPresident-schema.js');

const UserModel = mongoose.model('userP', userPSchema);
const carteModel = mongoose.model('carte', carteSchema);
const statsTarotModel = mongoose.model('statsTarot', statsTarotSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('carte')
        .setDescription('Affiche une carte de tarot aléatoire'),

    async execute(interaction) {
        
        const userId = interaction.user.id;
        const user = await UserModel.findOne({ _id: userId });

        await interaction.reply(`Désolée ${user.nom}, cette fonctionnalité n\'est plus disponible, elle était trop à chier. `);
/* 
        try {
            // Recherche de l'utilisateur dans la base de données
            let user = await UserModel.findById(userId);

            // Rechercher une carte aléatoire dans la base de données
            const count = await carteModel.countDocuments();
            const random = Math.floor(Math.random() * count);
            const randomCard = await carteModel.findOne().skip(random);
            const stats = await statsTarotModel.findOne({ _id: randomCard._id });

            if (!randomCard) {
                await interaction.reply("Aucune carte de tarot trouvée.");
                return;
            }

            // Vérifier si l'utilisateur a déjà utilisé une carte aujourd'hui
            if (user.useT) {
                await interaction.reply("Vous avez déjà tiré une carte aujourd'hui.");
                return;
            }

            if (stats) {
                stats.nb_apparition += 1;

                switch(userId) {
                    case '217279235021209600':
                        stats.gwendal += 1;
                        break;
                    case '356091017314828289':
                        stats.ambre += 1;
                        break;
                    case '300762664714371073':
                        stats.lucas += 1;
                        break;
                    case '365180026376945667':
                        stats.clemence += 1;
                        break;
                    case '386880970655268865':
                        stats.fiona += 1;
                        break;
                    case '124917171359973376':
                        stats.benjamin += 1;
                        break;
                }

                await stats.save();
            }

            console.log('Carte de tarot aléatoire trouvée :', randomCard.label);
            console.log('Stats :', stats ? stats.label : 'Pas de stats trouvées');

            // Construire le message avec les détails de la carte
            const replyMessage = `**${randomCard.label}**\n\n`;
            const replyMessageDes = `**Description:**\n${randomCard.description}\n`;
            let replyMessageChoice = '';
            let replyMessageSens = '';

            // Choisir aléatoirement entre l'endroit et l'envers
            const randomChoice = Math.floor(Math.random() * 2);
            if (randomChoice === 0) {
                replyMessageSens = `**Endroit:**`;
                replyMessageChoice = `${randomCard.description_endroit}`;
            } else {
                replyMessageSens = `**Envers:**`;
                replyMessageChoice = `${randomCard.description_envers}`;
            }

            // Récupérer l'URL de l'image de la carte aléatoire
            const gifUrl = randomCard.image;

            // Mettre à jour la valeur de use pour indiquer que l'utilisateur a déjà tiré une carte aujourd'hui
            await UserModel.findByIdAndUpdate(userId, { useT: true });

            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(replyMessage)
                .setDescription(replyMessageDes)
                .addFields({ name: replyMessageSens, value: replyMessageChoice })
                .setImage(gifUrl)
                .setTimestamp();

            await interaction.reply({ embeds: [exampleEmbed] }); 

        } catch (error) {
            console.error('Erreur lors de la récupération de la carte de tarot :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération de la carte de tarot.");
        }
        */
    },
};
