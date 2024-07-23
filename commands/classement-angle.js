const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js'); 

const { angleSchema } = require('../data/angle-schema.js');
const { classementAngleSchema } = require('../data/classementAngle-schema.js'); 

const angleModel = mongoose.model('angle', angleSchema);
const classementAngleModel = mongoose.model('classementAngle', classementAngleSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('classement-angle')
        .setDescription('Affiche le classement de la recherche d\'angle'),

    async execute(interaction) {

        try {
            // Récupérer tous les documents du classement
            const classementEntries = await classementAngleModel.find();

            // Filtrer les entrées avec nombre d'essais de 0
            const zeroEssaisEntries = classementEntries.filter(entry => entry.nombre_essai === 0);
            const nonZeroEssaisEntries = classementEntries.filter(entry => entry.nombre_essai !== 0);

            // Trier les entrées par nombre d'essais croissant
            const sortedEntries = nonZeroEssaisEntries.sort((a, b) => a.nombre_essai - b.nombre_essai);

            // Mettre à jour la position de chaque entrée en fonction de l'ordre trié
            let currentPosition = 1;
            for (let i = 0; i < sortedEntries.length; i++) {
                // Si l'entrée précédente a le même nombre d'essais, la position reste la même
                if (i > 0 && sortedEntries[i].nombre_essai === sortedEntries[i - 1].nombre_essai) {
                    sortedEntries[i].position = sortedEntries[i - 1].position;
                } else {
                    sortedEntries[i].position = currentPosition;
                }
                currentPosition++;

                await sortedEntries[i].save(); // Sauvegarder la nouvelle position dans la base de données
            }

            // Construire un embed avec les données du classement
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Classement de la recherche d\'angle')
                .setDescription('Voici le classement actuel :');

            // Ajouter les entrées triées à l'embed
            sortedEntries.forEach(entry => {
                embed.addFields({ name: entry.nom, value: `Nombres d'essais: ${entry.nombre_essai}, Position: ${entry.position}` });
            });

            // Ajouter une section pour les entrées avec nombre d'essais de 0
            if (zeroEssaisEntries.length > 0) {
                embed.addFields({ name: 'Hors Classement (Nombre d\'essais: 0)', value: zeroEssaisEntries.map(entry => `${entry.nom} (Position: ${entry.position})`).join('\n') });
            }

            // Envoyer l'embed dans le canal où la commande a été exécutée
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la récupération du classement :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération du classement.");
        }
    },
};
