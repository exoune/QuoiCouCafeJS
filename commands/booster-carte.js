const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { collectionCarteSchema } = require('../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../data/dailyLimitsCarte-schema.js');
const mongoose = require('mongoose');

// Constante pour le nombre total de cartes
const TOTAL_CARDS = 176;

// URL de l'image du booster (remplacez ceci par l'URL réelle de votre image de booster)
const BOOSTER_IMAGE_URL = 'https://example.com/path/to/booster-image.jpg';

const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('booster-carte')
        .setDescription('Obtenez votre booster du jour !'),

    async execute(interaction) {
        const userid = interaction.user.id;

        try {
            // Recherche de l'utilisateur dans la base de données
            let user = await dailyModel.findById(userid);

            // Vérifier si l'utilisateur a déjà utilisé une carte aujourd'hui
            if (user.nbJour >= 2) {
                await interaction.reply("Vous avez attrapé assez de cartes pour aujourd'hui, laissez-en aux autres.");
                return;
            }

            // Créer un bouton pour ouvrir les cartes
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('open_cards')
                        .setLabel('Ouvrir le booster')
                        .setStyle(ButtonStyle.Primary),
                );

            // Envoyer un message initial avec l'image du booster et le bouton
            const embed = new EmbedBuilder()
                .setColor(0x00AE86)
                .setTitle('Booster de cartes')
                .setDescription('Cliquez sur le bouton ci-dessous pour ouvrir votre booster et découvrir vos cartes !')
                .setImage(BOOSTER_IMAGE_URL)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'open_cards' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'open_cards') {
                    collector.stop();

                    // Tirer trois cartes aléatoires
                    const cards = [];
                    let couleur;
                    for (let j = 0; j < 3; j++) {
                        let randomCarte = Math.floor(Math.random() * TOTAL_CARDS) + 1;
                        let carte = await collectionModel.findOne({ _id: randomCarte });
                        while (carte.quantite < 1) {
                            randomCarte = Math.floor(Math.random() * TOTAL_CARDS) + 1;
                            carte = await collectionModel.findOne({ _id: randomCarte });
                        }

                        cards.push(carte);
                        user.cartes.push(randomCarte);
                        user.nbTotal += 1;
                        carte.quantite -= 1;
                        carte.save();

                        if (carte.rarete === "Legendaire") {
                            couleur = 0xFFD700;
                        } else if (carte.rarete === "Epique") {
                            couleur = 0xC200C2;
                        } else if (carte.rarete === "Rare") {
                            couleur = 0x0099FF;
                        } else {
                            couleur = 0x00AE86;
                        }
                    }

                    user.nbJour += 1;
                    user.save();

                    // Construire l'embed avec les trois cartes
                    const cardsEmbed = new EmbedBuilder()
                        .setColor(couleur)
                        .setTitle('Vos cartes')
                        .setDescription(cards.map(carte => `**${carte._id} - ${carte.nom}**\nFamille : ${carte.famille}\nRarete : ${carte.rarete}`).join('\n\n'))
                        .setTimestamp();

                    await i.update({ embeds: [cardsEmbed], components: [] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: "Vous n'avez pas ouvert votre booster à temps.", components: [] });
                }
            });
        } catch (error) {
            console.error('Erreur lors de la chasse :', error);
            await interaction.reply("Une erreur s'est produite lors de la chasse.");
        }
    },
};
