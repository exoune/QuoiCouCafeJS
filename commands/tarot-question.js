require('dotenv').config(); // Charger les variables d'environnement

const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');
const { carteSchema } = require('../data/carte-schema.js');
const { userPSchema } = require('../data/userPresident-schema.js');

const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const carteModel = mongoose.model('carte', carteSchema);
const UserModel = mongoose.model('userP', userPSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tarot-question')
        .setDescription('Donne une réponse à une question posée au tarot')
        .addStringOption(option =>
        option.setName('question')
            .setDescription('La question que vous posez au tarot')
            .setRequired(true)
        ),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const userid = interaction.user.id;

        try {
            await interaction.deferReply(); // Déférer la réponse pour prolonger la validité de l'interaction

            const cartes = await carteModel.aggregate([{ $sample: { size: 3 } }]);
            let user = await UserModel.findById(userid);
            
            // Vérifier si l'utilisateur a déjà utilisé une carte aujourd'hui
            if (user.useT === true) {
                await interaction.editReply("Vous avez déjà utilisé votre question du jour.");
            } else {
                if (cartes.length === 3) {
                    let cardsDetails = [];
                    let cardsLabels = [];

                    await UserModel.findByIdAndUpdate(userid, { useT: true });

                    for (let i = 0; i < cartes.length; i++) {
                        const carte = cartes[i];
                        const position = Math.random() > 0.5 ? 'endroit' : 'envers';
                        const description = position === 'endroit' ? carte.description_endroit : carte.description_envers;
                        const image = carte.image;

                        const carteTime = i === 0 ? "Passé" : i === 1 ? "Présent" : i === 2 ? "Futur" : "";

                        const embed = new EmbedBuilder()
                            .setTitle(`Carte ${carteTime}: ${carte.label}`)
                            .setColor(0x1D82B6)
                            .setDescription(`**${description}**`)
                            .setImage(image)
                            .addFields({ name: 'Position', value: position });

                        // Envoyer le message avec l'embed
                        await interaction.channel.send({ embeds: [embed] });

                        cardsDetails.push({ carteTime, label: carte.label, position, description });
                        cardsLabels.push(carte.label);
                    }

                    const prompt = `Voici la question: "${question}". Les cartes tirées sont: Passé: ${cardsDetails[0].label} (${cardsDetails[0].position}), Présent: ${cardsDetails[1].label} (${cardsDetails[1].position}), Futur: ${cardsDetails[2].label} (${cardsDetails[2].position}). Donne une interprétation de ces cartes en réponse à la question et fais en sorte que ta réponse soit en dessous de 2000 caractères.`;

                    const response = await cohere.chat({
                        message: prompt
                    });

                    const answer = response.text;

                    if (answer.length > 0) {
                        if (answer.length > 2000) {
                            await interaction.editReply(`Voici votre question : **${question}**\n\n${answer.slice(0, 1800)}`);
                        } else {
                            await interaction.editReply(`Voici votre question : **${question}**\n\n${answer}`);
                        }
                    } else {
                        await interaction.editReply("Boulette n'a pas pu répondre à votre message.");
                    }
                } else {
                    await interaction.editReply('Désolé, il n\'y a pas assez de cartes dans la base de données pour un tirage.');
                }
            }
        } catch (error) {
            console.error('Error fetching tarot cards or getting response:', error);
            await interaction.editReply('Une erreur est survenue lors du tirage des cartes ou de l\'obtention de la réponse.');
        }
    }
};
