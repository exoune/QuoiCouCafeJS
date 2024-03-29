const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const Logger = require("./utils/Logger");
const { coinFoodSchema } = require('./data/coinFood-schema.js');
const mongoose = require('mongoose');


const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildModeration

] });

["CommandUtils", "EventUtils"].forEach((handler) => {
    require(`./utils/handlers/${handler}`)(client);
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		Logger.error(error);
		await interaction.reply({ content: 'La commande elle est pétée x(', ephemeral: true }).catch(Logger.error);
	}
});

client.login(process.env.TOKEN).catch(Logger.error);

client.on('messageReactionAdd', (reaction, user) => {
	console.log(`Reaction ajoutée : ${reaction.emoji.name}, User: ${user.username}`)
	if (reaction.emoji.name === '🍎') {
		console.log(`POMME`);
		if (user.coins < 2) {
			interaction.followUp("Vous n'avez pas assez de coins pour acheter cette nourriture.");
			return;
		}
		user.coins -= 2;
		user.food += 1;
		user.save();
		interaction.followUp("Vous avez acheté une pomme !");
	}
	if (reaction.emoji.name === '🍐') {
		console.log(`POIRE`);
		if (user.coins < 3) {
			interaction.followUp("Vous n'avez pas assez de coins pour acheter cette nourriture.");
			return;
		}
		user.coins -= 3;
		user.food += 1;
		user.save();
		interaction.followUp("Vous avez acheté une poire !");
	}
});

client.on('messageReactionRemove', (reaction, user) => {
	console.log(`Reaction retirée : ${reaction.emoji.name}, User: ${user.username}`)
});