const { SlashCommandBuilder } = require('@discordjs/builders');
const { cardSchema } = require('../data/card-schema.js');
const { userPSchema } = require('../data/userPresident-schema.js');
const { classementSchema } = require('../data/classement-schema.js');
const { jourSchema } = require('../data/jour-schema.js');
const { dataPresidentSchema } = require('../data/dataPresident-schema.js');

const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');

// Constante pour le nombre total de cartes
const TOTAL_CARDS = 57;
const idJour = [];
const id = "1";

const UserModel = mongoose.model('userP', userPSchema);
const carteModel = mongoose.model('card', cardSchema);
const classementModel = mongoose.model('classement', classementSchema);
const jourModel = mongoose.model('jour', jourSchema);
const dataPresidentModel = mongoose.model('dataPresident', dataPresidentSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tirer')
        .setDescription('Affiche une carte aléatoire'),

    async execute(interaction) {
        
        const userid = interaction.user.id;

        try {
            // Recherche de l'utilisateur dans la base de données
            let user = await UserModel.findById(userid);

            // Si l'utilisateur n'existe pas dans la base de données, créez-le avec use à false
            if (!user) {
                user = await UserModel.create({
                    _id: userid,
                    nom: interaction.user.username,
                    useP: false,
                    useT: false
                });
            }

            // Vérifier si l'utilisateur a déjà utilisé une carte aujourd'hui
            if (user.useP) {
                await interaction.reply("Vous avez déjà tiré une carte aujourd'hui.");
                return;
            }

            // Recherche d'une carte aléatoire non encore tirée dans la base de données
            let random;
            let randomCard;

            do {
                random = Math.floor(Math.random() * TOTAL_CARDS) + 1;
                randomCard = await carteModel.findOne({ _id: random });
            } while (idJour.includes(random));

            const stats = await dataPresidentModel.findOne({ _id: randomCard._id });

            // Ajout de l'ID de la carte tirée à la liste des cartes tirées aujourd'hui
            idJour.push(random);

            // Mettre à jour la valeur de use pour indiquer que l'utilisateur a déjà tiré une carte aujourd'hui
            await UserModel.findByIdAndUpdate(userid, { useP: true });

            // Récupérer l'URL de l'image de la carte aléatoire
            const gifUrl = randomCard.image;

            console.log('Utilisateur qui a tiré une carte :', user.nom);
            console.log('Carte aléatoire trouvée :', randomCard.nom);

            if (stats) {
                stats.nb_apparition += 1;

                switch(userid) {
                    case '217279235021209600':
                        stats.gwendal += 1;
                        break;
                    case '356091017314828289':
                        stats.ambre += 1;
                        break;
                    case '300762664714371073':
                        stats.lucas += 1;
                        break;
                    case '365180026376945667':
                        stats.clemence += 1;
                        break;
                    case '386880970655268865':
                        stats.fiona += 1;
                        break;
                    case '124917171359973376':
                        stats.benjamin += 1;
                        break;
                }

                await stats.save();
            }


            const jour = await jourModel.findOne({ _id: id });

            if(randomCard.valeur > jour.carteMax){
                console.log('carteMax', jour.carteMax);
                jour.carteMax = randomCard.valeur;
                jour.userId = userid;
                jour.user2 = "0";
                jour.user3 = "0";
                jour.user4 = "0";
            }else if(randomCard.valeur == jour.carteMax && jour.userId != userid){
                if(jour.user2 == "0"){
                    jour.user2 = userid;
                }else if(jour.user3 == "0"){
                    jour.user3 = userid;
                }else if(jour.user4 == "0"){
                    jour.user4 = userid;
                }
                console.log('Jour mis à jour :', jour);
            }

            // Sauvegarder le document jour mis à jour
            await jour.save();

            


            // Envoyer la carte aléatoire dans un message embed
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`**${randomCard.nom}**`)
                .setImage(gifUrl)
                .setTimestamp();

            await interaction.reply({ embeds: [exampleEmbed] });

        } catch (error) {
            console.error('Erreur lors de la récupération de la carte :', error);
            await interaction.reply("Une erreur s'est produite lors de la récupération de la carte.");
        }
    },
};
