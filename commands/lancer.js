const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lancer')
        .setDescription('lance des dés')
        .addStringOption(option =>
			option
				.setName('stats')
				.setDescription('les stats que vous voulez tirer')
        .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;

        try {

            const option = interaction.options.getString('stats');
            let de;
            let valeur;

            if(option === "POUVOIR") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "DEXTERITE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "FORCE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "APPARENCE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "CONSTITUTION") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "EDUCATION") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = (de + 6) * 5;
            } else if(option === "INTELLIGENCE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = (de + 6) * 5;
            } else if(option === "TAILLE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = (de + 6) * 5;
            } else if(option === "CHANCE") {
                de = Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                de = de + Math.floor(Math.random() * 6) + 1;
                valeur = de * 5;
            } else if(option === "TEST") {
                de = Math.floor(Math.random() * 100) + 1;
                valeur = de;
            } else if(option === "DE10") {
                de = Math.floor(Math.random() * 10) + 1;
                valeur = de;
            } else {
                await interaction.reply("Veuillez entrer une statistique valide. POUVOIR, DEXTERITE, FORCE, APPARENCE, CONSTITUTION, EDUCATION, INTELLIGENCE, TAILLE, CHANCE, TEST, DE10.");
                return;
            }
            

            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`**${option} : ${valeur}**`)
                .setTimestamp();

            await interaction.reply({ embeds: [exampleEmbed] });

        } catch (error) {
            console.error('Erreur lors du lancement de dés :', error);
            await interaction.reply("Une erreur s'est produite lors du lancement de dés.");
        }
    },
};
