const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const { collectionCarteSchema } = require('../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../data/dailyLimitsCarte-schema.js');

const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afficher-cartes-utilisateur')
        .setDescription('Affiche les cartes d\'un utilisateur spécifié ou de tous les utilisateurs.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur dont vous souhaitez afficher les cartes.')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('tous')
                .setDescription('Afficher les cartes de tous les utilisateurs sans les images.')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.options.getUser('utilisateur')?.id;
        const showAll = interaction.options.getBoolean('tous');

        try {
            await interaction.deferReply(); // Différer la réponse de l'interaction

            if (showAll) {
                // Afficher les cartes de tous les utilisateurs sans images
                const users = await dailyModel.find({});

                if (!users.length) {
                    await interaction.editReply("Aucun utilisateur trouvé dans la base de données.");
                    return;
                }

                const allCardsEmbed = new EmbedBuilder()
                    .setTitle('Cartes de tous les utilisateurs')
                    .setColor(0x00AE86);

                for (const user of users) {
                    const userName = user.nom;
                    const userCardsIds = user.cartes;
                    const userCards = await collectionModel.find({ _id: { $in: userCardsIds } });

                    let cardDetails = userCards.map(card => 
                        `**ID:** ${card._id}\n**Nom:** ${card.nom}\n**Famille:** ${card.famille}\n**Rareté:** ${card.rarete}`
                    ).join('\n\n');

                    allCardsEmbed.addFields({
                        name: `**${userName}**`,
                        value: cardDetails || 'Aucune carte',
                        inline: false
                    });

                    // Limiter le nombre de champs pour éviter de dépasser les limites d'embed de Discord
                    if (allCardsEmbed.data.fields.length > 25) { // Discord limite les champs à 25 par embed
                        await interaction.followUp({ embeds: [allCardsEmbed] });
                        allCardsEmbed.data.fields = [];
                    }
                }

                // Envoyer le dernier embed si nécessaire
                if (allCardsEmbed.data.fields.length > 0) {
                    await interaction.followUp({ embeds: [allCardsEmbed] });
                }

            } else if (userId) {
                // Afficher les cartes de l'utilisateur spécifié avec images
                const user = await dailyModel.findById(userId);

                if (!user) {
                    await interaction.editReply("Utilisateur non trouvé dans la base de données.");
                    return;
                }

                if (user.cartes.length === 0) {
                    await interaction.editReply("Cet utilisateur ne possède aucune carte.");
                    return;
                }

                const userName = user.nom;
                const userCardsIds = user.cartes;
                const userCards = await collectionModel.find({ _id: { $in: userCardsIds } });

                for (const card of userCards) {
                    let couleur = 0x00AE86;

                    if(card.rarete === "Legendaire"){
                        couleur = 0xFFD700;
                    } else if(card.rarete === "Epique"){
                        couleur = 0xC200C2;
                    } else if(card.rarete === "Rare"){
                        couleur = 0x0099FF;
                    }

                    const cardEmbed = new EmbedBuilder()
                        .setTitle(`**${userName}**`)
                        .setColor(couleur)
                        .setDescription(`${card.nom} - ${card.famille} - ${card.rarete}`)
                        .addFields({ name: 'Carte ID', value: card._id.toString(), inline: true });

                    if (card.image) {
                        cardEmbed.setThumbnail(card.image);
                    }

                    await interaction.followUp({ embeds: [cardEmbed] });
                }

                await interaction.editReply("Affichage des cartes terminé.");

            } else {
                await interaction.editReply("Veuillez spécifier un utilisateur ou choisir l'option pour afficher toutes les cartes.");
            }

        } catch (error) {
            console.error('Erreur lors de l\'affichage des cartes :', error);
            await interaction.editReply("Une erreur s'est produite lors de l'affichage des cartes.");
        }
    },
};
