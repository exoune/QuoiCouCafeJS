const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Utilisation de MessageEmbed au lieu de EmbedBuilder

module.exports = {
    data: new SlashCommandBuilder()
        .setName('date')
        .setDescription('Affiche les dates d\'anniversaire des membres du serveur'),
        

    async execute(interaction) {

        try {

            // Construire un embed 
            const embed = new EmbedBuilder() // Utilisation de MessageEmbed
                .setColor('#0099ff')
                .setTitle('Anniversaires')
                .addFields(
                    { name: '21 mars', value: 'CHLOE', inline: false },
                    { name: '02 avril', value: 'AMBRE', inline: false },
                    { name: '13 avril', value: 'CLEMENCE', inline: false },
                    { name: '18 mai', value: 'BENJAMIN', inline: false },
                    { name: '21 mai', value: 'FIONA', inline: false },
                    { name: '05 septembre', value: 'GWENDAL', inline: false },
                    { name: '06 septembre', value: 'LUCAS', inline: false }
                )
                .setTimestamp()

            // Envoyer l'embed dans le canal où la commande a été exécutée
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la récupération des anniversaires :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération des anniversaires.");
        }
    },
};

