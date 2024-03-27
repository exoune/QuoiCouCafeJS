const Logger = require("../../utils/Logger");
const { feurCountSchema } = require('../../data/feur-count-schema.js')
const { optionsSchema } = require('../../data/options-schema.js')
const { familiersSchema } = require('../../data/familiers-schema.js')
const { mesfamiliersSchema } = require('../../data/mesfamiliers-schema.js')
const { ActivityType } = require('discord.js');
const mongoose = require('mongoose')

const regexPattern = /\s+/g;

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.author.bot) return;

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
        if(message.content.toLowerCase().replace(regexPattern, "").replace().includes("quoi"))
        {
            if(message.content.toLowerCase().includes("pourquoi")){
                message.reply("Pour Feur").catch(error => console.log(error));
            } else if(Math.random() < 0.02) {
                message.reply("coupaielecafé").catch(error => console.log(error));
            }else if(Math.random() < 0.10){
                message.reply({ files: ["https://cdn.discordapp.com/attachments/1151806327862083676/1220322984401829960/2024-03-21-FEUR.gif?ex=660e8557&is=65fc1057&hm=afd5b6ad58a8c4bdd98d495687fcfeee540dffa763c77650370768a0f3cd5d53&"] }).catch(error => console.log(error));
            }else{
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
        if(message.content.toLowerCase().replace(regexPattern, "").replace().includes("comment"))
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
