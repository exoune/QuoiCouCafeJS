const { SlashCommandBuilder } = require('@discordjs/builders');

const { collectionCarteSchema } = require('../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../data/dailyLimitsCarte-schema.js');

const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Constante pour le nombre total de cartes
const TOTAL_CARDS = 176;

const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chasser-carte')
        .setDescription('partez à la chasse !'),

    async execute(interaction) {
        
        const userid = interaction.user.id;

        try {

            // Recherche de l'utilisateur dans la base de données
            let user = await dailyModel.findById(userid);
            let couleur = 0x00AE86;

            // Vérifier si l'utilisateur a déjà utilisé une carte aujourd'hui
            if (user.nbJour >= 2) {
                await interaction.reply("Vous avez attrapé assez de cartes pour aujourd'hui, laissez en aux autres.");
                return;
            }


            random = Math.floor(Math.random() * 10) + 1;
            if(random === 8){
                randomCarte = Math.floor(Math.random() * TOTAL_CARDS) + 1;
                let carte = await collectionModel.findOne({ _id: randomCarte });
                while(carte.quantite < 1){
                    randomCarte = Math.floor(Math.random() * TOTAL_CARDS) + 1;
                }

                user.cartes.push(randomCarte);
                user.nbJour += 1;
                user.nbTotal += 1;
                carte.quantite -= 1;
                user.save();
                carte.save();

                if(carte.rarete == "Legendaire"){
                    couleur = 0xFFD700;
                }else if(carte.rarete == "Epique"){
                    couleur = 0xC200C2;
                }else if(carte.rarete == "Rare"){
                    couleur = 0x0099FF;
                }

                // Envoyer la carte aléatoire dans un message embed
                const embed = new EmbedBuilder()
                    .setColor(couleur)
                    .setTitle(`${carte._id}  -  **${carte.nom}**`)
                    .setDescription(`**Famille** : ${carte.famille} \n **Rarete** : ${carte.rarete}`)
                    .setImage(carte.image)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

                
            }else{
                await interaction.reply("Vous n'avez rien trouvé.");
            }

        } catch (error) {
            console.error('Erreur lors de la chasse :', error);
            await interaction.reply("Une erreur s'est produite lors de la chasse.");
        }
    },
};
