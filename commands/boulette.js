require('dotenv').config(); // Charger les variables d'environnement

const { SlashCommandBuilder } = require('@discordjs/builders');
const { CohereClient } = require('cohere-ai');
const { EmbedBuilder } = require('discord.js');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boulette')
        .setDescription('Pour parler avec Boulette')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Votre message')
                .setRequired(true)
        ),

    async execute(interaction) {
        const message = interaction.options.getString('message');
        const userid = interaction.user.id;

        try {
            // Réponse différée pour signaler que le bot traite l'interaction
            await interaction.deferReply();

            // Utilisation de l'API de Cohere pour obtenir une réponse à la question posée
            const response = await cohere.chat({
                message: message
            });

            // Vérification de la longueur du message
            if (response.text.length === 0) {
                await interaction.followUp("Boulette n'a pas pu répondre à votre message.");
                return;
            }

            let answer = response.text;

            // Vérifier si le message est trop long
            if (answer.length > 2000) {
                answer = "Le message est trop long. Voici une version raccourcie :\n" + answer.slice(0, 1997) + '...';
            }

            // Envoi de la réponse à l'utilisateur
            await interaction.followUp(`Boulette dit :\n\n${answer}`);

        } catch (error) {
            console.error(error);
            await interaction.followUp("Une erreur s'est produite lors du traitement de votre message.");
        }
    }
};
