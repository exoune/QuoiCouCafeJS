const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Logger = require("../utils/Logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('1 chance sur 6'),
	async execute(interaction) {

        let x = Math.floor(Math.random()*6);
        if(x === 0){
            let tempstimeout = 0;
            if(Math.random() >= 0.20)
			{
                const min = 1;
            	const max = 30;
            	tempstimeout = Math.random() * (max - min) + min;
			}
			else 
			{
                const min = 30;
            	const max = 120;
            	tempstimeout = Math.random() * (max - min) + min;
			}
            interaction.reply("Perdu !");
            interaction.member.timeout(tempstimeout *60*1000)
                    .catch(Logger.error);
            Logger.info(`Roulette | ${interaction.channel.name} | ${interaction.member.user.username} | Number : ${x}`);
            Logger.info(`Roulette | Timed out member ${interaction.member.user.username} for ${tempstimeout} min`);
            interaction.client.users.send('217279235021209600', `ROULETTE | ${interaction.channel.name} | Timed out ${interaction.member.user.username} : ${tempstimeout} min`).catch(Logger.error);

        } else {
            interaction.reply("Rien ne se passe.");
        }
	},
};