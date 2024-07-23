
const Logger = require("../../utils/Logger")
const { feurCountSchema } = require('../../data/feur-count-schema.js')
const { optionsSchema } = require('../../data/options-schema.js')
const { familiersSchema } = require('../../data/familiers-schema.js')
const { mesfamiliersSchema } = require('../../data/mesfamiliers-schema.js')
const { troubadourSchema } = require('../../data/troubadour-schema.js');

const { ActivityType } = require('discord.js');
const mongoose = require('mongoose')

const cron = require('node-cron');

const regexPattern = /\s+/g;
const regexPattern2 = /[^\w\s]/g; // Patron de regex pour enlever la ponctuation

const pass = "MotDePasse";
const mdp = "Quoicoulove";

const axios = require('axios');
const CHANNEL_ID_MESSAGES = '1247522632052506715';
const CHANNEL_ID_DEATHS = '1247620018871472279';
const MINECRAFT_URL = 'http://QUOICOUMINECRAFT.exaroton.me:36578'; // Update with your Minecraft server URL

const troubadourModel = mongoose.model('troubadour', troubadourSchema);

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

        /* const channelName = '🎶🎧-bemusic';  // Remplacez par le nom de votre canal
        if (message.channel.name === channelName) {
            const spotifyUrlPattern = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
            const match = spotifyUrlPattern.exec(message.content);
            if (match) {
                const trackId = match[1];
                try {
                    await spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`]);
                    message.channel.send('La chanson a été ajoutée à la playlist!');
                } catch (error) {
                    console.error('Erreur lors de l\'ajout de la chanson à la playlist:', error);
                    message.channel.send('Une erreur est survenue lors de l\'ajout de la chanson à la playlist.');
                }
            }
        } */


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
        /* if(message.author.id === "124917171359973376"){
            // Supprimer le message original
            await message.delete();
            
            // Envoyer un nouveau message avec l'image
            await message.channel.send({
                files: [troubadour.image]
            });
        } */

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
                activities: [{ name: `${x.feurCount} Feurs`, type: ActivityType.Playing }],
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
                activities: [{ name: `${x.feurCount} Feurs`, type: ActivityType.Playing }],
            });
        }

        if (message.content.toLowerCase().includes(mdp)) {
            console.log('mdp');
            const role = message.guild.roles.cache.find(role => role.name === 'QuoiCouBandit');
            const member = message.member;
            await member.roles.add(role);
            message.reply('Mot de passe correct. Vous avez maintenant accès au salon.');    
        }
        /* if(message.content.toLowerCase().includes(mdp) && !message.content.toLowerCase().includes(pass)) {
            message.reply('Mot de passe incorrect. Veuillez réessayer.');
        } */
    }
}


function getProbabilityByRarity(rarity) {
// Logique pour calculer la probabilité en fonction de la rareté du familier
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
        const MesFamiliersModel = mongoose.model('mesfamiliers', mesfamiliersSchema); // Créez le modèle à partir du schéma

        // Recherchez l'utilisateur dans la base de données
        let user = await MesFamiliersModel.findOne({ _id: userId });

        // Si l'utilisateur n'existe pas, créez-le avec le familier attrapé
        if (!user) {
            user = new MesFamiliersModel({ _id: userId, familiersAttrapes: [familiarNom] });
        } else {
            // Ajoutez le familier à la liste des familiers attrapés pour l'utilisateur
            user.familiersAttrapes.push(familiarNom);
        }

        // Enregistrez les modifications dans la base de données
        await user.save();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de familier à l\'utilisateur :', error);
    }
}
