const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { MessageAttachment } = require('discord.js');
//const { createObjectCsvStringifier } = require('csv-writer').CsvWriter;

const { dataPresidentSchema } = require('../data/dataPresident-schema.js');

const dataPresidentModel = mongoose.model('dataPresident', dataPresidentSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats-president')
        .setDescription('Affiche les stats d\'apparition des cartes du President'),

    async execute(interaction) {
        /* try {
            // Récupérer tous les documents du classement
            const statsEntries = await dataPresidentModel.find();

            // Définir les en-têtes CSV
            const csvHeaders = [
                { id: 'label', title: 'Carte' },
                { id: 'nb_apparition', title: 'Nombre d\'apparition' },
                { id: 'gwendal', title: 'Gwendal' },
                { id: 'ambre', title: 'Ambre' },
                { id: 'lucas', title: 'Lucas' },
                { id: 'clemence', title: 'Clémence' },
                { id: 'fiona', title: 'Fiona' },
                { id: 'benjamin', title: 'Benjamin' }
            ];

            // Créer un stringifier CSV basé sur les en-têtes définis
            const csvStringifier = createObjectCsvStringifier({
                header: csvHeaders
            });

            // Convertir les données en format CSV
            const csvData = csvStringifier.stringifyRecords(statsEntries.map(entry => ({
                label: entry.label,
                nb_apparition: entry.nb_apparition,
                gwendal: entry.gwendal,
                ambre: entry.ambre,
                lucas: entry.lucas,
                clemence: entry.clemence,
                fiona: entry.fiona,
                benjamin: entry.benjamin
            })));

            // Créer une pièce jointe de message avec le contenu CSV
            const csvAttachment = new MessageAttachment(Buffer.from(csvData), 'stats-president.csv');

            // Envoyer la pièce jointe CSV en réponse à l'interaction
            await interaction.reply({ files: [csvAttachment] });

        } catch (error) {
            console.error('Erreur lors de la récupération des stats :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération des stats.");
        } */
    },
};
