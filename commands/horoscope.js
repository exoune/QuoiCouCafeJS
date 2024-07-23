const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const { astroSchema } = require('../data/astro-schema.js'); // Assurez-vous que le chemin est correct

const astroModel = mongoose.model('astro', astroSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horoscope')
        .setDescription('Obtenez votre horoscope quotidien'),

    async execute(interaction) {
        try {
            // Récupérer l'ID de l'utilisateur
            const userid = interaction.user.id;

            // Récupérer le signe astrologique de l'utilisateur depuis la base de données
            const userAstro = await astroModel.findById(userid);

            if (!userAstro) {
                await interaction.reply("Je ne connais pas votre signe astrologique. Veuillez le définir d'abord.");
                return;
            }

            const userSign = userAstro.sign;

            // Appel à l'API Horoscope App pour obtenir l'horoscope quotidien
            const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${userSign}&day=TODAY`;

            const response = await axios.get(apiUrl);

            const horoscopeData = response.data.data; // Obtenir les données d'horoscope depuis la réponse

            const horoscope = horoscopeData.horoscope_data;

            let imageUrl = "";

            switch (userSign) {
                case "aries":
                    imageUrl = "https://i.pinimg.com/564x/60/dc/40/60dc4085f1135bdc83adebc04bb2e7a3.jpg";
                    break;
                case "taurus":
                    imageUrl = "https://i.pinimg.com/564x/e7/07/4e/e7074e2eed8b36aeecb26b8e1a8bfd5e.jpg";
                    break;
                case "gemini":
                    imageUrl = "https://i.pinimg.com/564x/ec/2f/10/ec2f10f0b3eb0f3d43e21e2bee018334.jpg";
                    break;
                case "cancer":
                    imageUrl = "https://i.pinimg.com/564x/ef/56/5f/ef565fad3ac093ee4f5e78ed0be6b8ed.jpg";
                    break;
                case "leo":
                    imageUrl = "https://i.pinimg.com/564x/c5/b6/7f/c5b67ff81b6c5400b90ed1db9562c5c9.jpg";
                    break;
                case "virgo":
                    imageUrl = "https://i.pinimg.com/564x/9a/0c/27/9a0c27fa2ee802c8ef307f7f8ca4cc78.jpg";
                    break;
                case "libra":
                    imageUrl = "https://i.pinimg.com/564x/1c/38/43/1c3843b93def64b13b6a1428227c86e4.jpg";
                    break;
                case "scorpio":
                    imageUrl = "https://i.pinimg.com/564x/a0/6c/40/a06c40361757bd7c5863c06db108b5f7.jpg";
                    break;
                case "sagittarius":
                    imageUrl = "https://i.pinimg.com/564x/71/7a/0a/717a0a43aba4b7b9f037886a22dbf4f2.jpg";
                    break;
                case "capricorn":
                    imageUrl = "https://i.pinimg.com/564x/f5/64/fc/f564fc1ac0e5ec8af6182f7b942e6418.jpg";
                    break;
                case "aquarius":
                    imageUrl = "https://i.pinimg.com/564x/c8/a4/6f/c8a46f8a51638c3cc673f919fe548819.jpg";
                    break;
                case "pisces":
                    imageUrl = "https://i.pinimg.com/564x/77/e7/41/77e74199be59a670b6acf30c0934503f.jpg";
                    break;
                default:
                    imageUrl = "";
            }

            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Votre horoscope pour aujourd'hui **${userAstro.nom}**`)
                .setDescription(`**${userSign}**`)
                .addFields({ name: "____", value: horoscope })
                .setImage(imageUrl)
                .setTimestamp();

            await interaction.reply({ embeds: [exampleEmbed] });

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'horoscope :', error);
            await interaction.reply("Désolé, je n'ai pas pu récupérer votre horoscope pour aujourd'hui.");
        }
    }
};
