const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { AttachmentBuilder } = require('discord.js');
const { registerFont } = require('canvas'); // Importer la fonction registerFont de canvas

// Importer le schéma
const { dataPresidentSchema } = require('../data/dataPresident-schema.js');

// Modèle Mongoose
const dataPresidentModel = mongoose.model('dataPresident', dataPresidentSchema);

// Enregistrer une police (utiliser un chemin absolu pour la police)
//registerFont('../fonts/Roboto-Regular.ttf', { family: 'CustomFont' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('graphe-president')
        .setDescription('Affiche un graphique des stats d\'apparition des cartes du President'),

    async execute(interaction) {
        try {
            // Récupérer tous les documents du classement
            const statsEntries = await dataPresidentModel.find();

            // Préparer les données pour le graphique
            const labels = statsEntries.map(entry => entry.label);
            const data = statsEntries.map(entry => entry.nb_apparition);

            // Configuration des dimensions du graphique
            const baseWidth = 800;
            const baseHeight = 600;
            const additionalWidth = 50 * labels.length; // Ajustez ce facteur selon vos besoins
            const width = baseWidth + additionalWidth;
            const height = baseHeight; // Vous pouvez également ajuster dynamiquement la hauteur si nécessaire

            const chartJSNodeCanvas = new ChartJSNodeCanvas({ 
                width, 
                height, 
                backgroundColour: 'white',
                chartCallback: (ChartJS) => {
                    ChartJS.defaults.font.family = 'CustomFont';
                }
            });

            // Configuration détaillée du graphique
            const configuration = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nombre d\'apparitions',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de fond
                        borderColor: 'rgba(75, 192, 192, 1)', // Couleur de bordure
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 14 // Taille de police pour l'axe x
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 14 // Taille de police pour l'axe y
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 16 // Taille de police pour la légende
                                }
                            }
                        }
                    }
                }
            };

            // Générer le graphique
            const image = await chartJSNodeCanvas.renderToBuffer(configuration);
            const attachment = new AttachmentBuilder(image, { name: 'chart.png' });

            // Envoyer le graphique dans le canal où la commande a été exécutée
            await interaction.reply({ files: [attachment] });

        } catch (error) {
            console.error('Erreur lors de la récupération des stats :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération des stats.");
        }
    },
};
