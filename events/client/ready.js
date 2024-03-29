const Logger = require("../../utils/Logger");
const mongoose = require('mongoose')
const { feurCountSchema } = require('../../data/feur-count-schema.js')
const { ActivityType, time } = require('discord.js');

let globalClient = undefined;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

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
            triggerTime.setHours(triggerTime.getHours()); //set trigger to next day
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
