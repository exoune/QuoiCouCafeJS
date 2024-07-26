const Logger = require("../../utils/Logger");
const { feurCountSchema } = require('../../data/feur-count-schema.js');
const { optionsSchema } = require('../../data/options-schema.js');
const { familiersSchema } = require('../../data/familiers-schema.js');
const { mesfamiliersSchema } = require('../../data/mesfamiliers-schema.js');
const { troubadourSchema } = require('../../data/troubadour-schema.js');
const { pokemonSchema } = require('../../data/pokemon-schema.js');
const { userPokemonSchema } = require('../../data/userPokemon-schema.js');

const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');

const regexPattern = /\s+/g;
const regexPattern2 = /[^\w\s]/g; // Patron de regex pour enlever la ponctuation

const pass = "MotDePasse";
const mdp = "Quoicoulove";

const axios = require('axios');
const CHANNEL_ID_MESSAGES = '1247522632052506715';
const CHANNEL_ID_DEATHS = '1247620018871472279';
const MINECRAFT_URL = 'http://QUOICOUMINECRAFT.exaroton.me:36578'; // Update with your Minecraft server URL

const MAX_POKEMON = 87;
const CHANNEL_ATTRAPE = '1264538223477002281';
const CHANNEL_TEA_TIME = '1263419458999816192';

const troubadourModel = mongoose.model('troubadour', troubadourSchema);
const pokemonModel = mongoose.model('pokemon', pokemonSchema);
const userPokemonModel = mongoose.model('userPokemon', userPokemonSchema);

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        const troubadour = await troubadourModel.findOne({ _id: message.author.id });

        if (message.author.bot) return;

        if (message.channel.id === CHANNEL_ID_MESSAGES) {
            axios.post(MINECRAFT_URL, {
                content: message.author.username + ": " + message.content
            }).catch(error => {
                console.error('Erreur lors de l\'envoi du message à Minecraft:', error);
            });
        }

        // Vérifier si le message contient le nom d'un familier
        const familiersModel = mongoose.model('familiers', familiersSchema);
        const familiers = await familiersModel.find({});
        const mentionedFamiliar = familiers.find(familiar => message.content.toLowerCase().includes(familiar._nom.toLowerCase()));

        // Si un familier est mentionné dans le message
        if (mentionedFamiliar) {
            // Vérifier si l'utilisateur attrape le familier avec une probabilité basée sur sa rareté
            const probability = getProbabilityByRarity(mentionedFamiliar.rarete);
            if (Math.random() <= probability) {
                // Si l'utilisateur attrape le familier, lui envoyer la question
                message.reply(mentionedFamiliar.question).catch(console.error);

                // Attendre la réponse de l'utilisateur
                const filter = response => response.author.id === message.author.id;
                message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(async collected => {
                        const answer = collected.first().content.trim().toLowerCase();
                        if (answer === mentionedFamiliar.reponse.toLowerCase()) {
                            // Si l'utilisateur répond correctement, ajouter le familier à sa collection
                            await addFamiliarToUser(message.author.id, mentionedFamiliar._nom);
                            message.reply(`Félicitations! Vous avez attrapé ${mentionedFamiliar._nom}`).catch(console.error);
                        } else {
                            message.reply('Désolé, votre réponse est incorrecte. Essayez à nouveau plus tard.').catch(console.error);
                        }
                    })
                    .catch(() => {
                        message.reply('Désolé, vous n\'avez pas répondu à temps. Essayez à nouveau plus tard.').catch(console.error);
                    });
            }
        }

        if (message.author.bot) return;

        const chance = Math.random();
        if (chance < 0.009 && (message.channel.id == CHANNEL_ATTRAPE || message.channel.id == CHANNEL_TEA_TIME)) { // 1% de chance

            const embed = new EmbedBuilder()
                .setTitle('Vous êtes tombé dans les hautes herbes !')
                .setDescription('Un Pokémon sauvage apparaît ! Voulez-vous accepter le combat ?')
                .setImage('https://i.gifer.com/sjg.gif');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('accept')
                        .setLabel('Accepter')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('decline')
                        .setLabel('Fuir')
                        .setStyle(ButtonStyle.Danger),
                );

            const fightMessage = await message.channel.send({ embeds: [embed], components: [row] });

            const filter = interaction => ['accept', 'decline'].includes(interaction.customId) && interaction.user.id === message.author.id;

            const collector = fightMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async interaction => {
                if (interaction.customId === 'accept') {
                    await interaction.update({ content: 'Vous avez accepté le combat !', components: [] });
                    startGame(message);
                } else {
                    await interaction.update({ content: 'Vous avez fuis le combat.', components: [] });
                }
            });

            collector.on('end', collected => {
                if (!collected.size) {
                    fightMessage.edit({ content: 'Vous n\'avez pas répondu à temps.', components: [] });
                }
            });
        }

        if(message.content.includes(client.user.id)){
            message.reply("Tg").catch(error => console.log(error));
            Logger.info(`TG ${message.author.username}`);
        }
        if(message.author.id === "181120771937009664"){ //luunar
            const optionModel = mongoose.model('options', optionsSchema);
            let x = await optionModel.findOne({
            _name: "luunarchapo"
            }).catch(Logger.error);
            Logger.info(`DB OPTIONS : Found : ${x}`);
            if (x.value) {
                message.reply("<:ChapeauChapeau:1143146901995278346>").catch(Logger.error);
            }            
        }
        if(message.content.toLowerCase().includes("ligma")){
            message.reply("Ligma Balls").catch(Logger.error);
            Logger.info(`Ligma balls ${message.author.username}`);
        }
        if(/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/.test(message.content)){
            let url = message.content.match(/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/);
            Logger.info(`LINK : ${message.author.username} | ${message.channel.name} | ${url[1]}`);
            // if(url[0].includes(".instagram")){
            //     message.reply(url[0].slice(0, 12)+"dd"+url[0].slice(12));
            // }
            if(url[0].includes("twitter") && !url[0].includes("xtwitter")){
                message.reply(url[0].slice(0, 8)+"vx"+url[0].slice(8));
            }
        }
        if(message.content.toLowerCase().replace(regexPattern, "").includes("quoicoub") 
            || message.content.toLowerCase().replace(regexPattern, "").includes("kwacoub")
            || message.content.toLowerCase().replace(regexPattern, "").includes("coubeh")
            || message.content.toLowerCase().replace(regexPattern, "").includes("coubé")
            || message.content.toLowerCase().replace(regexPattern, "").includes("apagnan")
            || message.content.toLowerCase().replace(regexPattern, "").includes("apanyae")
            || message.content.toLowerCase().replace(regexPattern, "").includes("apanyan")
            || message.content.toLowerCase().replace(regexPattern, "").includes("kwacoub")){
            message.reply("Quoicoubaise ta mère.").catch(error => console.log(error));

            const min = 1;
            const max = 5;

            const time = Math.random() * (max - min) + min;

            message.member.timeout(time * 60 * 1000)
                .catch(Logger.error)
                .then(() => Logger.info(`Apagnan | ${message.author.username} a été crampté pour ${time} min`));
            client.users.send('217279235021209600', `Apagnan | ${message.channel.name} | ${message.author.username} a été crampté pour ${time} min`);
        }
        if(message.content.toLowerCase().replace(regexPattern, "").replace().includes("flipreset"))
        {
            message.reply("C'est ta mère que je flip reset");
            Logger.info(`Flip reset ${message.author.username} | ${message.channel.name}`);
        }
        if(message.content.toLowerCase().replace(regexPattern, "").replace().includes("démonte") && Math.random() < 0.30)
        {
            message.reply("C'est ta mère que je démonte");
            Logger.info(`Démonte ${message.author.username} | ${message.channel.name}`);
        }
        if( (message.content.toLowerCase().replace(regexPattern, "").replace().includes("soulèv")
        || message.content.toLowerCase().replace(regexPattern, "").replace().includes("soulev")) 
        && Math.random() < 0.30)
        {
            message.reply("C'est ta mère que je soulève");
            Logger.info(`Soulève ${message.author.username} | ${message.channel.name}`);
        }
        if(message.content.toLowerCase().replace(regexPattern, "").replace().includes("neodrift")
        || message.content.toLowerCase().replace(regexPattern, "").replace().includes("néodrift"))
        {
            message.reply("Je néo drift dans ta daronne");
            Logger.info(`Neo ${message.author.username} | ${message.channel.name}`);
        }

        if (message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi") 
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi ?")
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi !")
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi ?!")
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi .")
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("quoi,")){
            if (message.content.toLowerCase().includes("pourquoi")) {
                message.reply("Pour Feur").catch(error => console.log(error));
            } else if (Math.random() < 0.02) {
                message.reply("coupaielecafé").catch(error => console.log(error));
            } else if (Math.random() < 0.10) {
                message.reply({ files: [troubadour.image] }).catch(error => console.log(error));
            } else {
                message.reply("Feur").catch(error => console.log(error));
            }

            Logger.info(`Feur ${message.author.username} | ${message.channel.name}`);
            const FeurModel = mongoose.model('feur-counts', feurCountSchema);
            await FeurModel.findOneAndUpdate({
            _id: client.user.id
            }, {
            _id: client.user.id,
            $inc : {
                feurCount: 1
            }
            }, {
            upsert: true
            });
        
            let x = await FeurModel.findOne({
            _id: client.user.id
            });

            await client.user.setPresence({
                activities: [{ name: `${x.feurCount} Feurs`, type: 'PLAYING' }],
            });
        }
        if(message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("comment")
            || message.content.toLowerCase().replace(regexPattern2, "").replace(regexPattern, "").endsWith("comment ?"))
        {
            message.reply("dant cousteau").catch(error => console.log(error));
        }

        if(message.content.toLowerCase().includes("qword") || message.content.toLowerCase().includes("q-word")){
            message.reply("F word");
            Logger.info(`Qword ${message.author.username} | ${message.channel.name}`);

            const FeurModel = mongoose.model('feur-counts', feurCountSchema);
            await FeurModel.findOneAndUpdate({
            _id: client.user.id
            }, {
            _id: client.user.id,
            $inc : {
                feurCount: 1
            }
            }, {
            upsert: true
            });
        
            let x = await FeurModel.findOne({
            _id: client.user.id
            });

            client.user.setPresence({
                activities: [{ name: `${x.feurCount} Feurs`, type: 'PLAYING' }],
            });
        }

        if (message.content.toLowerCase().includes(mdp)) {
            console.log('mdp');
            const role = message.guild.roles.cache.find(role => role.name === 'QuoiCouBandit');
            const member = message.member;
            await member.roles.add(role);
            message.reply('Mot de passe correct. Vous avez maintenant accès au salon.');    
        }
    }
};

function getProbabilityByRarity(rarity) {
    switch (rarity) {
        case 1:
            return 0.9; // 90% de chance
        case 2:
            return 0.1; // 10% de chance
        case 3:
            return 0.09; // 9% de chance
        case 4:
            return 0.009; // 0.9% de chance
        case 5:
            return 0.001; // 0.1% de chance
        default:
            return 0; // Aucune chance par défaut
    }
}

async function addFamiliarToUser(userId, familiarNom) {
    try {
        const MesFamiliersModel = mongoose.model('mesfamiliers', mesfamiliersSchema);

        let user = await MesFamiliersModel.findOne({ _id: userId });

        if (!user) {
            user = new MesFamiliersModel({ _id: userId, familiersAttrapes: [familiarNom] });
        } else {
            user.familiersAttrapes.push(familiarNom);
        }

        await user.save();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de familier à l\'utilisateur :', error);
    }
}

async function startGame(message) {
    const minigames = ['numberGuessing', 'rockPaperScissors', 'mathGame'];
    const chosenMinigame = minigames[Math.floor(Math.random() * minigames.length)];
    const userPokemon = await userPokemonModel.findOne({ _id : message.author.id });

    let randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    
    while(userPokemon.pokemon.includes(randomId)){
        randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
        if(!userPokemon.pokemon.includes(randomId) && 59 <= randomId >= 55){
            let chance = Math.floor(Math.random() * 100) + 1;
            if(chance < 90){
                randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
            }
        }
    }

    const pokemon = await pokemonModel.findOne({ _id: randomId });

    // Afficher l'image du Pokémon avant de commencer le mini-jeu
    const embed = new EmbedBuilder()
        .setTitle(`Combat contre ${pokemon.nom}!`)
        .setImage(pokemon.imagePokemon); // Image du Pokémon sauvage
    
    await message.channel.send({ embeds: [embed] });

    if (chosenMinigame === 'numberGuessing') {
        await numberGuessingGame(message, randomId);
    } else if (chosenMinigame === 'rockPaperScissors') {
        await rockPaperScissorsGame(message, randomId);
    } else if (chosenMinigame === 'mathGame') {
        await mathGame(message, randomId);
    }
}

async function numberGuessingGame(message, randomId) {
    const min = 1;
    const max = 3;
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    await message.reply(`Je pense à un nombre entre ${min} et ${max}. Pouvez-vous deviner lequel ?`);
    const pokemonGame = await pokemonModel.findOne({ _id: randomId });

    const filter = response => response.author.id === message.author.id;
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const guess = parseInt(collected.first().content.trim());
            if (guess === targetNumber) {
                try {
                    if (pokemonGame) {
                        await addPokemonToCollection(message.author.id, message.author.username, pokemonGame._id);

                        const embed = new EmbedBuilder()
                            .setTitle('Félicitations!')
                            .setDescription(`Vous avez fait le même choix que moi (${targetNumber}). Vous avez attrapé un ${pokemonGame.nom}!`)
                            .setImage(pokemonGame.imageCarte); // Image du Pokémon après la victoire

                        await message.reply({ embeds: [embed] });
                    } else {
                        message.reply(`Désolé, aucun Pokémon trouvé avec l'ID ${randomId}. Essayez à nouveau plus tard.`);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération du Pokémon:', error);
                    message.reply('Désolé, une erreur est survenue lors de la récupération du Pokémon. Essayez à nouveau plus tard.');
                }
            } else {
                message.reply(`Désolé, la bonne réponse était ${targetNumber}. Essayez à nouveau plus tard.`);
            }
        })
        .catch(() => {
            message.reply('Désolé, vous n\'avez pas répondu à temps. Essayez à nouveau plus tard.');
        });
}

async function rockPaperScissorsGame(message, randomId) {
    const choices = ['pierre', 'feuille', 'ciseaux'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    await message.reply('Jouons à Pierre Feuille Ciseaux! Répondez avec votre choix : `pierre`, `feuille`, ou `ciseaux`.');
    const pokemonGame = await pokemonModel.findOne({ _id: randomId });

    const filter = response => response.author.id === message.author.id && choices.includes(response.content.toLowerCase());
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const userChoice = collected.first().content.trim().toLowerCase();
            if (userChoice === botChoice) {
                try {
                    if (pokemonGame) {
                        await addPokemonToCollection(message.author.id, message.author.username, pokemonGame._id);
                        const embed = new EmbedBuilder()
                            .setTitle('Félicitations!')
                            .setDescription(`Vous avez fait le même choix que moi (${botChoice}). Vous avez attrapé un ${pokemonGame.nom}!`)
                            .setImage(pokemonGame.imageCarte); // Image du Pokémon après la victoire

                        await message.reply({ embeds: [embed] });
                    } else {
                        message.reply(`Désolé, aucun Pokémon trouvé avec l'ID ${randomId}. Essayez à nouveau plus tard.`);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération du Pokémon:', error);
                    message.reply('Désolé, une erreur est survenue lors de la récupération du Pokémon. Essayez à nouveau plus tard.');
                }
            } else {
                message.reply(`J'ai choisi ${botChoice} et vous avez choisi ${userChoice}. Désolé, vous n'avez pas gagné cette fois-ci.`);
            }
        })
        .catch(() => {
            message.reply('Désolé, vous n\'avez pas répondu à temps. Essayez à nouveau plus tard.');
        });
}

async function mathGame(message, randomId) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    await message.reply(`Quel est le résultat de ${num1} + ${num2} ?`);
    const pokemonGame = await pokemonModel.findOne({ _id: randomId });

    const filter = response => response.author.id === message.author.id;
    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const userAnswer = parseInt(collected.first().content.trim());
            if (userAnswer === correctAnswer) {
                try {
                    if (pokemonGame) {
                        await addPokemonToCollection(message.author.id, message.author.username, pokemonGame._id);
                        const embed = new EmbedBuilder()
                            .setTitle('Félicitations!')
                            .setDescription(`Vous avez trouvé la bonne réponse : (${correctAnswer}). Vous avez attrapé un ${pokemonGame.nom}!`)
                            .setImage(pokemonGame.imageCarte); // Image du Pokémon après la victoire

                        await message.reply({ embeds: [embed] });
                    } else {
                        message.reply(`Désolé, aucun Pokémon trouvé avec l'ID ${randomId}. Essayez à nouveau plus tard.`);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération du Pokémon:', error);
                    message.reply('Désolé, une erreur est survenue lors de la récupération du Pokémon. Essayez à nouveau plus tard.');
                }
            } else {
                message.reply(`Incorrect. La bonne réponse était : ${correctAnswer}`);
            }
        })
        .catch(() => {
            message.reply("Désolé, vous n'avez pas répondu à temps.");
        });
}


async function addPokemonToCollection(userId, userName, pokemonID) {
    try {
        const userPokemon = await userPokemonModel.findOne({ _id : userId });

        if (!userPokemon) {
            total = 1;
            await new userPokemonModel({ _id : userId, nom : userName, nbTotal : total, pokemon: [pokemonID] });
        } else {
            userPokemon.pokemon.push(pokemonID);
            userPokemon.nbTotal += 1;
        }
        
        await userPokemon.save();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du Pokémon à la collection :', error);
    }
}

