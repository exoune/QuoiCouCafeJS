const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const Logger = require("./utils/Logger");
const { coinFoodSchema } = require('./data/coinFood-schema.js');
const mongoose = require('mongoose');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessageReactions
	],
	partials: [
		Partials.Message, 
		Partials.Channel, 
		Partials.Reaction
	], 
});

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

