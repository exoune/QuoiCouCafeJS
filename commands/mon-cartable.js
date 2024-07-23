const { SlashCommandBuilder } = require('@discordjs/builders');

const { collectionCarteSchema } = require('../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../data/dailyLimitsCarte-schema.js');

const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Constante pour le nombre total de cartes
const TOTAL_CARDS = 176;
const nb_tarot_Arcana = "22";
const nb_tarot_Sparrow = "78";
const nb_pierre_precieuse = "49";
const nb_fantasy_craft = "14";
const nb_quoicoufamily = "13";


const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mon-cartable')
        .setDescription('regardez ce que vous avez comme cartes !'),

    async execute(interaction) {
        const userid = interaction.user.id;
        let tarot_Arcana = 0;
        let tarot_Sparrow = 0;
        let pierre_precieuse = 0;
        let fantasy_craft = 0;
        let quoicoufamily = 0;

        try {
            await interaction.deferReply(); // Différer la réponse de l'interaction

            // Recherche de l'utilisateur dans la base de données
            let user = await dailyModel.findById(userid);

            if (user.cartes.length === 0) {
                await interaction.editReply("Vous n'avez pas de cartes.");
                return;
            }

            let cartes = [];
            for (let i = 0; i < user.cartes.length; i++) {
                let carte = await collectionModel.findOne({ _id: user.cartes[i] });
                cartes.push(carte);
            }

            // Création des embeds pour afficher les cartes
            const embeds = [];
            const MAX_EMBEDS_PER_MESSAGE = 10; // Discord a une limite de 10 embeds par message

            for(let i = 0; i < cartes.length; i++) {
                const carte = cartes[i];

                if(carte.famille == "tarot_Arcana"){
                    tarot_Arcana += 1;
                }else if(carte.famille == "tarot_Sparrow"){
                    tarot_Sparrow += 1;
                }else if(carte.famille == "pierre_precieuse"){
                    pierre_precieuse += 1;
                }else if(carte.famille == "fantasy_craft"){
                    fantasy_craft += 1;
                }else if(carte.famille == "QuoiCouFamily"){
                    quoicoufamily += 1;
                }
            }

            for (let i = 0; i < cartes.length; i++) {

                const carte = cartes[i];
                let couleur = 0x00AE86;
                let famille = "";
                let nbCartes = "";

                if(carte.rarete == "Legendaire"){
                    couleur = 0xFFD700;
                }else if(carte.rarete == "Epique"){
                    couleur = 0xC200C2;
                }else if(carte.rarete == "Rare"){
                    couleur = 0x0099FF;
                }

                if(carte.famille == "tarot_Arcana"){
                    famille = tarot_Arcana;
                    nbCartes = nb_tarot_Arcana;
                }else if(carte.famille == "tarot_Sparrow"){
                    famille = tarot_Sparrow;
                    nbCartes = nb_tarot_Sparrow;
                }else if(carte.famille == "pierre_precieuse"){
                    famille = pierre_precieuse;
                    nbCartes = nb_pierre_precieuse;
                }else if(carte.famille == "fantasy_craft"){
                    famille = fantasy_craft;
                    nbCartes = nb_fantasy_craft;
                }else if(carte.famille == "QuoiCouFamily"){
                    famille = quoicoufamily;
                    nbCartes = nb_quoicoufamily;
                }


                const embed = new EmbedBuilder()
                    .setTitle(`${carte._id}  -  ${carte.nom}`)
                    .setColor(couleur)
                    .setDescription(`**Famille** : ${carte.famille} \n **Rarete** : ${carte.rarete} \n **Quantité sur la famille** : ${famille}/${nbCartes}`)
                    .setImage(carte.image); // Ajoute l'image spécifique à chaque carte

                embeds.push(embed);

                // Pour éviter de dépasser la limite des embeds par message
                if (embeds.length === MAX_EMBEDS_PER_MESSAGE) {
                    await interaction.followUp({ embeds });
                    embeds.length = 0; // Réinitialise la liste des embeds pour le prochain envoi
                }
            }

            // Envoi des derniers embeds s'il en reste
            if (embeds.length > 0) {
                await interaction.followUp({ embeds });
            }

            // Mise à jour du message initial
            await interaction.editReply("Voici vos cartes !");
        } catch (error) {
            console.error('Erreur lors de la récupération des cartes :', error);
            await interaction.editReply("Une erreur s'est produite lors de la récupération de vos cartes.");
        }
    },
};
