const { SlashCommandBuilder } = require('@discordjs/builders');
const { classementSchema } = require('../data/classement-schema.js');
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js'); // Utilisation de MessageEmbed au lieu de EmbedBuilder

module.exports = {
    data: new SlashCommandBuilder()
        .setName('classement')
        .setDescription('Affiche le classement du président'),

    async execute(interaction) {
        const classementModel = mongoose.model('classement', classementSchema);

        try {
            // Récupérer tous les documents du classement
            const classementEntries = await classementModel.find();

            // Construire un embed avec les données du classement
            const embed = new EmbedBuilder() // Utilisation de MessageEmbed
                .setColor('#0099ff')
                .setTitle('Classement du président')
                .setDescription('Voici le classement actuel :');

            // Ajouter chaque entrée du classement à l'embed
            classementEntries.forEach(entry => {
                embed.addFields({ name: entry.nom, value: `Points semaine: ${entry.points_semaine}, Victoires: ${entry.victoires}` });
            });

            // Envoyer l'embed dans le canal où la commande a été exécutée
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la récupération du classement :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération du classement.");
        }
    },
};
