// guess-tarot.js

const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { ScoreDevinette } = require('../data/scoreDevinette-schema');
const { tarotCard } = require('../data/tarotDevin-schema');
const { userPSchema } = require('../data/userPresident-schema.js');

const scoreModel = mongoose.model('scoreDevinette', ScoreDevinette);
const trarotCardModel = mongoose.model('tarotDevin', tarotCard);
const UserModel = mongoose.model('userP', userPSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess-tarot')
        .setDescription('Devinez si une carte de tarot est majeure ou mineure et son nom exact.')
        .addStringOption(option =>
            option.setName('maison')
                .setDescription('Majeure ou mineure')
                .setRequired(true)
                .addChoices(
                    { name: 'Majeure', value: 'majeure' },
                    { name: 'Mineure', value: 'mineure' }
                )
        )
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Nom exact de la carte')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const user = await scoreModel.findById(userId);
        const maisonUser = interaction.options.getString('maison').toLowerCase(); // Convertir en minuscules
        const nomUser = interaction.options.getString('nom').toLowerCase(); // Convertir en minuscules
        const carte = await trarotCardModel.findOne({ _id: "1" });
        const userT = await UserModel.findOne({ _id: userId });

        if(userT.useT) {
            await interaction.reply("Vous avez déjà essayé de deviné aujourd'hui.");
            return;
        }

        userT.useT = false;
        await userT.save();

        console.log(`les choix de ${user.nom} sont ${maisonUser} et ${nomUser}`);
        console.log(`la carte est ${carte.maison} et ${carte.label}`);

        try {
            const carte = await trarotCardModel.findOne({ _id: "1" });

            // Comparer en convertissant en minuscules
            if (maisonUser === carte.maison.toLowerCase() && nomUser === carte.label.toLowerCase()) {
                user.points = user.points + 3;
                console.log(`${user.nom} a trouvé le nom et la maison et a maintenant ${user.points} points}`);
                
            } else if (maisonUser === carte.maison.toLowerCase()) {
                user.points = user.points + 1;
                console.log(`${user.nom} a trouvé la maison et a maintenant ${user.points} points}`);

            } else if (nomUser === carte.label.toLowerCase()) {
                user.points = user.points + 1;
                console.log(`${user.nom} a trouvé le nom et a maintenant ${user.points} points}`);
            } else {
                console.log(`${user.nom} n'a rien trouvé et a toujours ${user.points} points}`);
            }

            await user.save();

            await interaction.reply(`Merci ${user.nom} pour votre participation. Veuillez attendre 17h pour la révélation des résultats.`);
        } catch (error) {
            console.error('Error during guess-tarot command:', error);
            await interaction.reply('Une erreur est survenue lors de la devinette.');
        }
    },
};
