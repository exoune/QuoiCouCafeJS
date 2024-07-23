const { SlashCommandBuilder } = require('@discordjs/builders');
const { collectionCarteSchema } = require('../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../data/dailyLimitsCarte-schema.js');
const mongoose = require('mongoose');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echanger-carte')
        .setDescription('Échangez des cartes avec un autre utilisateur.')
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription('L\'utilisateur avec qui échanger.')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const otherUserId = interaction.options.getUser('utilisateur').id;

        try {
            await interaction.deferReply(); // Différer la réponse de l'interaction

            // Vérification des cartes des utilisateurs
            const user = await dailyModel.findById(userId);
            const otherUser = await dailyModel.findById(otherUserId);

            if (!user || !otherUser) {
                await interaction.editReply("Une erreur s'est produite lors de la récupération des informations des utilisateurs.");
                return;
            }

            if (user.cartes.length === 0 || otherUser.cartes.length === 0) {
                await interaction.editReply("L'un des utilisateurs ne possède pas de cartes à échanger.");
                return;
            }

            // Limiter le nombre d'options pour éviter des erreurs de largeur
            const MAX_OPTIONS = 25; // Limite arbitraire pour éviter les erreurs de largeur
            const userCardOptions = user.cartes.slice(0, MAX_OPTIONS).map(carteId => ({ label: `Carte ${carteId}`, value: carteId.toString() }));
            const otherUserCardOptions = otherUser.cartes.slice(0, MAX_OPTIONS).map(carteId => ({ label: `Carte ${carteId}`, value: carteId.toString() }));

            // Sélecteurs de cartes
            const userCardSelector = new StringSelectMenuBuilder()
                .setCustomId('your_card_selector')
                .setPlaceholder('Choisissez une carte à échanger')
                .addOptions(userCardOptions);

            const theirCardSelector = new StringSelectMenuBuilder()
                .setCustomId('their_card_selector')
                .setPlaceholder('Choisissez une carte que vous voulez recevoir')
                .addOptions(otherUserCardOptions);

            // Créer des rangées avec un seul sélecteur de chaque type
            const cardSelectorRow1 = new ActionRowBuilder().addComponents(userCardSelector);
            const cardSelectorRow2 = new ActionRowBuilder().addComponents(theirCardSelector);

            // Demande de sélection des cartes par l'utilisateur initial
            const selectionMessage = await interaction.editReply({
                content: `${interaction.user.username}, veuillez choisir une carte parmi vos cartes disponibles pour échanger avec ${interaction.options.getUser('utilisateur')}.`,
                components: [cardSelectorRow1, cardSelectorRow2],
                fetchReply: true,
            });

            const filter = i => i.user.id === userId;
            const collector = selectionMessage.createMessageComponentCollector({
                filter,
                componentType: ComponentType.StringSelectMenu,
                time: 60000, // 60 secondes pour répondre
            });

            let selectedYourCardId = null;
            let selectedTheirCardId = null;

            collector.on('collect', async i => {
                try {
                    if (i.customId === 'your_card_selector') {
                        selectedYourCardId = i.values[0];
                        await i.update({ content: `Vous avez sélectionné la carte ${selectedYourCardId}. Veuillez maintenant sélectionner la carte que vous souhaitez recevoir.`, components: [cardSelectorRow2] });
                    } else if (i.customId === 'their_card_selector') {
                        selectedTheirCardId = i.values[0];
                        await i.update({ content: `Vous avez sélectionné la carte ${selectedTheirCardId}. Veuillez attendre la confirmation de ${interaction.options.getUser('utilisateur').username}.`, components: [] });

                        // Envoyer la demande de confirmation à l'autre utilisateur
                        const confirmButton = new ButtonBuilder()
                            .setCustomId('confirm')
                            .setLabel('Confirmer')
                            .setStyle(ButtonStyle.Success);

                        const cancelButton = new ButtonBuilder()
                            .setCustomId('cancel')
                            .setLabel('Annuler')
                            .setStyle(ButtonStyle.Danger);

                        const confirmationRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

                        await interaction.followUp({
                            content: `${interaction.options.getUser('utilisateur').username}, veuillez confirmer l'échange des cartes.`,
                            components: [confirmationRow],
                        });

                        const filterConfirm = i => i.user.id === otherUserId;
                        const confirmationCollector = interaction.channel.createMessageComponentCollector({
                            filter: filterConfirm,
                            componentType: ComponentType.Button,
                            time: 60000, // 60 secondes pour répondre
                        });

                        confirmationCollector.on('collect', async i => {
                            if (i.customId === 'confirm') {
                                // Vérifier les choix
                                if (!user.cartes.includes(selectedYourCardId) || !otherUser.cartes.includes(selectedTheirCardId)) {
                                    await i.update({ content: 'Une erreur s\'est produite lors de la sélection des cartes.', components: [] });
                                    return;
                                }

                                // Retirer la carte des utilisateurs respectifs
                                user.cartes = user.cartes.filter(carte => carte !== selectedYourCardId);
                                otherUser.cartes = otherUser.cartes.filter(carte => carte !== selectedTheirCardId);

                                // Ajouter la carte aux utilisateurs respectifs
                                user.cartes.push(selectedTheirCardId);
                                otherUser.cartes.push(selectedYourCardId);

                                // Sauvegarder les modifications dans la base de données
                                await user.save();
                                await otherUser.save();

                                await i.update({ content: `Échange réussi ! ${interaction.user.username} a échangé la carte ${selectedYourCardId} contre la carte ${selectedTheirCardId} de ${interaction.options.getUser('utilisateur').username}.`, components: [] });
                            } else if (i.customId === 'cancel') {
                                await i.update({ content: 'Échange annulé.', components: [] });
                            }
                        });

                        confirmationCollector.on('end', collected => {
                            if (collected.size === 0) {
                                interaction.editReply({ content: 'Échange expiré.', components: [] });
                            }
                        });
                    }
                } catch (error) {
                    console.error('Erreur lors de la gestion des sélections :', error);
                    await i.update({ content: 'Une erreur s\'est produite lors de la gestion des sélections.', components: [] });
                }
            });

        } catch (error) {
            console.error('Erreur lors de l\'échange de cartes :', error);
            await interaction.editReply("Une erreur s'est produite lors de l'échange de cartes.");
        }
    },
};
