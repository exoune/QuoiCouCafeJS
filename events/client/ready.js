const Logger = require("../../utils/Logger");
const mongoose = require('mongoose')
const { feurCountSchema } = require('../../data/feur-count-schema.js')
const { ActivityType, time } = require('discord.js');

const cron = require('node-cron');

let globalClient = undefined;

const CHANNEL_ID = '1217786944470126672';
const CHANNEL_ID_TAROT = '1232679990471037021';
const roleId = '1219229682499588156'; // ID du rôle à mentionner
const roleMention = `<@&${roleId}>`; // Mention du rôle

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        // Planifier la tâche de suppression des messages à minuit chaque jour
        cron.schedule('30 21 * * *', () => {
            console.log("La suppréssion s'exécute à l'heure prévue !");
            const channel_tarot = client.channels.cache.get(CHANNEL_ID_TAROT);
            
            if (channel_tarot) {
                channel.messages.fetch()
                    .then(messages => {
                        messages.forEach(message => {
                            message.delete();
                        });
                    })
                    .catch(error => console.error('Erreur lors de la suppression des messages :', error));
            } else {
                console.error('Canal non trouvé.');
            }
        });


        // Planifier l'envoi du message à 9h30 du lundi au vendredi
        cron.schedule('30 7 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID);
            gifUrl = 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'; // URL du GIF

            if (channel) {
                // Envoyer le message
                await channel.send({
                    content: `${roleMention} Pause 10h15 ?`,
                    files: [gifUrl]
                })
                    .then(async sentMessage => {
                        // Ajouter la réaction au message
                        await sentMessage.react('🌞');
                        await sentMessage.react('✖️');
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'envoi du message :', error);
                    });
            } else {
                console.error('Canal introuvable.');
            }
        });

        // Planifier l'envoi du message à 10h00 du lundi au vendredi
        cron.schedule('00 8 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID); 
            gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2dnYTY1b3VzMms4czZzM2o4ZXJwbzJ0bW9lYWJkNGlieWdtMXVwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9vzk5JCmTBPfa/giphy.gif'; // URL du GIF

            if (channel) {
                // Envoyer le message
                await channel.send({
                    content: `${roleMention} Pause à 10h15 !!`,
                    files: [gifUrl]
                })
            } else {
                console.error('Canal introuvable.');
            }
        });

        // Planifier l'envoi du message à 11h00 du lundi au vendredi
        cron.schedule('00 9 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID);
            gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDRrYzZpODdkZWJuMWppdnpqcG02ZWJxem16YWthbzIzb2Rtb2Z2eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VrFsENnbl5GCs/giphy-downsized-large.gif'; // URL du GIF

            if (channel) {
                // Envoyer le message

                await channel.send({
                    content: `${roleMention} Miam 12h : 🐮 ou 12h15 : 🐔 ?`,
                    files: [gifUrl]
                })
                    .then(async sentMessage => {
                        // Ajouter la réaction au message
                        await sentMessage.react('🐮');
                        await sentMessage.react('🐔');
                        await sentMessage.react('✖️');
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'envoi du message :', error);
                    });
            } else {
                console.error('Canal introuvable.');
            }
        });


        globalClient = client;

        mongoose.set('strictQuery', false);

        mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true
        })
            .then(()=> {Logger.client("Succesfully connected to MongoDB")})
            .catch(error => Logger.error(error));
        Logger.client("QUOICOU ENCLANCHÉ");

        const FeurModel = mongoose.model('feur-counts', feurCountSchema);


        // let x = await FeurModel.findOne({
        //     _id: client.user.id
        //     }).catch(error => Logger.error(error));

        // client.user.setPresence({
        //     activities: [{ name: `${x.feurCount} Feurs`, type: ActivityType.Playing }]
        // });

        (function loop() {

            const triggerTime = getRandomHour();
        
            const now = new Date();
            triggerTime.setHours(triggerTime.getHours() + 24); //set trigger to next day
            Logger.event(`BeMusic | Next : ${triggerTime}`)
        
            const triggerMs = triggerTime.getTime() - now.getTime();  
            
            setTimeout( () => {
                    beMusicTrigger();
                    loop();  
            }, triggerMs);
        }());
    }
}

function getRandomHour(){
    const minh = 7;
    const maxh = 20;
    const hour = Math.random() * (maxh - minh) + minh;
    const minm = 0;
    const maxm = 59;
    const minute = Math.random() * (maxm - minm) + minm;
    const time = new Date(); time.setHours(hour, minute);
    // const time = new Date(); time.setHours(time.getHours(), time.getMinutes(), time.getSeconds()+5);
    return time
}


function beMusicTrigger(){
    Logger.event("BeMusic | Triggered")
    globalClient.channels.cache.get(`1222819900578598922`).send(`<@&${'1222820029616357486'}> C'est l'heure de poster la dernière musique que vous avez écoutée !`)
        .catch(error => Logger.error(error));
}
