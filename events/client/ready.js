const Logger = require("../../utils/Logger");
const moment = require('moment-timezone');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const { ActivityType } = require('discord.js');
const cron = require('node-cron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { EmbedBuilder } = require('discord.js'); 

//---------------------------------------------- SCHEMAS ------------------------------------------------
const { feurCountSchema } = require('../../data/feur-count-schema.js');
const { userPSchema } = require('../../data/userPresident-schema.js');
const { jourSchema } = require('../../data/jour-schema.js');
const { classementSchema } = require('../../data/classement-schema.js');
const { troubadourSchema } = require('../../data/troubadour-schema.js');
const { citationSchema } = require('../../data/citation-schema.js');
const { angleSchema } = require('../../data/angle-schema.js');
const { classementAngleSchema } = require('../../data/classementAngle-schema.js');
const { carteSchema } = require('../../data/carte-schema.js');
const { ScoreDevinette } = require('../../data/scoreDevinette-schema');
const { tarotCard } = require('../../data/tarotDevin-schema');
const { collectionCarteSchema } = require('../../data/collectionCarte-schema.js');
const { dailyLimitsCarteSchema } = require('../../data/dailyLimitsCarte-schema.js');

const mongoose = require('mongoose');

let globalClient = undefined;

//---------------------------------------------- CHANNELS ID ------------------------------------------------
const CHANNEL_ID = '1217786944470126672';
const CHANNEL_ID_TAROT = '1234793299735478284';
const CHANNEL_ID_PRESIDENT = '1239941383419199630';
const CHANNEL_ANGLE = '1252906637631557684';
const CHANNEL_ID_TROUBADOUR = '1250061508696604672';
const CHANNEL_ID_WEATHER = '1249660032174526507';

const OPENWEATHERMAP_API_KEY = '700b85be6984d2d7eef1751af9704030';  // Remplace par ta clé API OpenWeatherMap

const roleId = '1219229682499588156'; // ID du rôle à mentionner
const roleMention = `<@&${roleId}>`; // Mention du rôle
const roleClemence = `<@&${'1222812944476405771'}>`; // Mention du rôle
const roleAmbre = `<@&${'356091017314828289'}>`; // Mention du rôle

//---------------------------------------------- MODELS ------------------------------------------------
const UserModel = mongoose.model('userP', userPSchema);
const jourModel = mongoose.model('jour', jourSchema);
const classementModel = mongoose.model('classement', classementSchema);
const troubadourModel = mongoose.model('troubadour', troubadourSchema);
const citationModel = mongoose.model('citation', citationSchema);
const angleModel = mongoose.model('angle', angleSchema);
const classementAngleModel = mongoose.model('classementAngle', classementAngleSchema);
const carteModel = mongoose.model('carte', carteSchema);
const scoreModel = mongoose.model('scoreDevinette', ScoreDevinette);
const trarotCardModel = mongoose.model('tarotDevin', tarotCard);
const collectionModel = mongoose.model('collectionCarte', collectionCarteSchema);
const dailyModel = mongoose.model('dailyLimits', dailyLimitsCarteSchema);

//---------------------------------------------- VARIABLES ------------------------------------------------
let classement = 0;
let userC = [];

module.exports = {
    name: 'ready',
    once: true,
    
    async execute(client) {

// ---------------------------------------------- NUIT ------------------------------------------------

        
        // Planifier la réinitialisation de la collection Jour tous les jours à 1h
        cron.schedule('0 1 * * *', async () => {
            try {
                await jourModel.updateMany({}, { carteMax: 0, userId: 0, user2: 0, user3: 0, user4: 0 });
                console.log("La variable 'jour' a été réinitialisée pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation de la variable 'jour' :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation de la variable 'angle' à 0 tous les jours à 1h30
        cron.schedule('30 1 * * *', async () => {
            try {
                await angleModel.updateMany({}, { angle: 0 });
                console.log("La variable 'angle' a été réinitialisée.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation de la variable 'angle' :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation de la variable 'useT' et 'useP' à false tous les jours à 2h 
        cron.schedule('0 2 * * *', async () => {
            try {
                await UserModel.updateMany({}, { useT: false });
                await UserModel.updateMany({}, { useP: false });
                console.log("La variable 'use' a été réinitialisée pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation de la variable 'use' :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation des variables 'trouver' 'nombre_essai' et 'position' tous les jours à 2h35
        cron.schedule('35 2 * * *', async () => {
            try {
                await classementAngleModel.updateMany({}, { trouver : false });
                await classementAngleModel.updateMany({}, { nombre_essai : 0 });
                await classementAngleModel.updateMany({}, { position : 0 });
                console.log("La variable 'use' a été réinitialisée pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation de la variable 'use' :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation des variables 'nbJour' tous les jours à 2h40
        cron.schedule('40 2 * * *', async () => {
            try {
                await dailyModel.updateMany({}, { nbJour : 0 });
                console.log("La variable 'nbJour' a été réinitialisée pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de la réinitialisation de la variable 'nbJour' :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

// ---------------------------------------------- MATIN ------------------------------------------------

        // Planifier l'envoi de la météo à 7h tous les jours
        cron.schedule('0 7 * * *', () => {
            fetchWeatherAndSend();
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier l'envoi d'une citation à 8h tous les jours
        cron.schedule('0 9 * * *', () => {
            citations();
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier l'envoi du message à 9h20 du lundi au vendredi
        /* cron.schedule('20 9 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID);
            gifUrl = 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'; // URL du GIF

            if (channel) {
                // Envoyer le message
                await channel.send({
                    content: `${roleMention} Pause 9h30 ?`,
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
        }, {
            timezone: "Europe/Paris"
        }); */

        // Planifier l'envoi du message à 10h00 du lundi au vendredi
        /* cron.schedule('30 9 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID); 
            gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2dnYTY1b3VzMms4czZzM2o4ZXJwbzJ0bW9lYWJkNGlieWdtMXVwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9vzk5JCmTBPfa/giphy.gif'; // URL du GIF

            if (channel) {
                // Envoyer le message
                await channel.send({
                    content: `${roleMention} Pause à 9h30 !!`,
                    files: [gifUrl]
                })
            } else {
                console.error('Canal introuvable.');
            }
        }, {
            timezone: "Europe/Paris"
        }); */

        // Planifie l'envoi de l'angle' à 9h40 tous les jours
        cron.schedule('40 9 * * *', async () => {
            try {
                console.log("création de l'angle !");
                const canvas = createCanvas(200, 200);
                const ctx = canvas.getContext('2d');
        
                const angleID = "1";
                let currentAngle = await angleModel.findOne({ _id: angleID });
        
                if (!currentAngle) {
                    console.error('Angle non trouvé');
                    return;
                }
        
                currentAngle.angle = Math.floor(Math.random() * 360); // Génère un angle aléatoire
                console.log('Angle généré :', currentAngle.angle);
        
                await currentAngle.save();
                console.log('Angle sauvegardé avec succès');
        
                // Dessine une image simple avec l'angle
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 200, 200);
        
                // Dessiner la ligne fixe horizontale sur la moitié droite
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(100, 100);
                ctx.lineTo(200, 100);
                ctx.stroke();
        
                // Dessiner la ligne mobile indiquant l'angle
                ctx.save();
                ctx.translate(100, 100);
                ctx.rotate(currentAngle.angle * Math.PI / 180);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(100, 0);
                ctx.stroke();
                ctx.restore();
        
                // Dessiner l'arc de cercle pour représenter l'angle
                ctx.strokeStyle = '#FF0000'; // Couleur rouge pour l'arc
                ctx.beginPath();
                ctx.arc(100, 100, 50, 0, currentAngle.angle * Math.PI / 180); // Rayon de 50 pixels
                ctx.stroke();
        
                const buffer = canvas.toBuffer('image/png');
                const attachment = new AttachmentBuilder(buffer, { name: 'angle.png' }); // Utilisation de AttachmentBuilder
        
                const channel = globalClient.channels.cache.get(CHANNEL_ANGLE);
                if (channel) {
                    await channel.send({ files: [attachment] });
                    console.log('Image envoyée avec succès.');
                } else {
                    console.error('Canal non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors de la création de l\'angle :', error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier l'envoi du message à 11h00 du lundi au vendredi
        /* cron.schedule('00 11 * * 1-5', async () => {
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
        }, {
            timezone: "Europe/Paris"
        }); */

        // Calcule la date du prochain lundi à 11:01
        const now = moment().tz("Europe/Paris");
        const nextMonday = now.clone().day(8).hour(11).minute(1).second(0);

        if (now.day() === 1 && now.hour() < 11) {
            nextMonday.add(-7, 'days');  // Si aujourd'hui est lundi avant 11h, planifiez pour aujourd'hui
        }

        const task = cron.schedule(`01 11 ${nextMonday.date()} ${nextMonday.month() + 1} *`, async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID);
            const gifUrl = 'https://www.photofunky.net/output/image/c/f/b/b/cfbb16/photofunky.gif'; // URL du GIF

            if (channel) {
                try {
                    const sentMessage = await channel.send({
                        content: ` COURGE ${roleClemence} & ${roleAmbre} !`,
                        files: [gifUrl]
                    });

                    await sentMessage.react('🎃');
                    await sentMessage.react('🥳');
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du message :', error);
                }
            } else {
                console.error('Canal introuvable.');
            }

            // Désactiver la tâche après l'exécution
            task.stop();
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier l'envoi du message à 12h00 du lundi au vendredi
        /* cron.schedule('00 12 * * 1-5', async () => {
            console.log("La tâche cron s'exécute à l'heure prévue !");
            const channel = client.channels.cache.get(CHANNEL_ID);
            gifUrl = 'https://i.pinimg.com/564x/51/d6/3f/51d63faf6312a3bc4873ee24d98cdfed.jpg'; 

            if (channel) {
                // Envoyer le message

                await channel.send({
                    content: `${roleMention} Miam !`,
                    files: [gifUrl]
                })
            } else {
                console.error('Canal introuvable.');
            }
        }, {
            timezone: "Europe/Paris"
        }); */

        
// ---------------------------------------------- APRES-MIDI ------------------------------------------------

        // Planifier l'envoi de la devinette du jour à 14h30 tous les jours
        cron.schedule('30 14 * * *', async () => {
            try {
                // Rechercher une carte aléatoire dans la base de données
                const count = await carteModel.countDocuments();

                const carteJour = await trarotCardModel.findOne({ _id: "1" });

                const random = Math.floor(Math.random() * count);
                const randomCard = await carteModel.findOne().skip(random);

                // Construire le message avec les détails de la carte
                carteJour.label = randomCard.label;
                if (randomCard._id < 23) {
                    carteJour.maison = "majeure";
                } else {
                    carteJour.maison = "mineure";
                }
                await carteJour.save();

                const replyMessageDes = `**Description:**\n${randomCard.description}\n`;

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('**Carte du jour**')
                    .setDescription(replyMessageDes)
                    .setTimestamp();

                const channel = client.channels.cache.get(CHANNEL_ID_TAROT);
                if (channel) {
                    await channel.send({ embeds: [embed] });
                    console.log('Embed envoyée avec succès.');
                } else {
                    console.error('Canal non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors de l\'exécution de la tâche cron :', error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier l'envoi du classement de la devinette à 17h tous les jours
        cron.schedule('0 17 * * *', async () => {
            try {
                const entries = await scoreModel.find().sort({ points: -1 });
                const carteJour = await trarotCardModel.findOne({ _id: "1" });
                const randomCard = await carteModel.findOne({ label: carteJour.label });

                if (!carteJour) {
                    console.error('Carte du jour non trouvée.');
                    return;
                }

                const userT = await UserModel.find();
                for (const user of userT) {
                    user.useT = false;
                    await user.save();
                }

                console.log(`image ${carteJour.image} et label ${carteJour.label}`);
                const embed1 = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('La carte était :')
                    .setImage(randomCard.image)
                    .setDescription(`**${carteJour.label}**`)

                const embed2 = new EmbedBuilder() // Utilisation de MessageEmbed
                    .setColor('#0099ff')
                    .setTitle('Classement des devinettes')
                    .setDescription('Voici le classement actuel :');

                // Ajouter chaque entrée du classement à l'embed
                entries.forEach(entry => {
                    embed2.addFields({ name: entry.nom, value: `Points : ${entry.points}` });
                });

                const channel = client.channels.cache.get(CHANNEL_ID_TAROT);
                if (channel) {
                    await channel.send({ embeds: [embed1] });
                    await channel.send({ embeds: [embed2] });
                    console.log('Messages envoyés avec succès.');
                } else {
                    console.error('Canal non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors de l\'envoi du classement:', error);
            }
        }, {
            timezone: "Europe/Paris"
        });


// ---------------------------------------------- SOIR ------------------------------------------------

        // Planifier l'envoi du classement des points du troubadour tous les dimanches à 20h
        cron.schedule('0 20 * * 0', async () => {
            // Trouver l'utilisateur avec la valeur la plus élevée
            const topUser = await troubadourModel.findOne().sort({ valeur: -1 });


            // Créer l'embed
            const embed = new EmbedBuilder()
                .setColor(0x1E90FF) // Couleur de l'embed
                .setTitle(`Classement des points pour le TROUBADOUR de la semaine :`)
                .setDescription(`Le grand gagnant de la semaine est ${topUser.nom} avec ${topUser.valeur} points !`)
                .setImage(topUser.image)
                .setTimestamp()

            // Ajouter chaque entrée du classement à l'embed

            // Récupérer tous les documents du classement
            const troubadourEntries = await troubadourModel.find();
            troubadourEntries.forEach(entry => {
                embed.addFields({ name: entry.nom, value: `Points semaine: ${entry.valeur}` });
            });

            const channel = globalClient.channels.cache.get(CHANNEL_ID_TROUBADOUR);
            if (channel) {
                channel.send({ embeds: [embed] });
            } else {
                console.error('Channel not found!');
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation des points du troubadour tous les dimanches à 21h
        cron.schedule('0 21 * * 0', async () => {
            const troubadourEntries = await troubadourModel.find();

            // Réinitialiser les points du troubadour
            troubadourEntries.forEach(entry => {
                entry.valeur = 0;
                entry.save();
            });

            await troubadourEntries.save();
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la réinitialisation des citations le premier dimanche du mois à 21h01
        /* cron.schedule('01 21 1-7 * *', async () => {
            const today = moment().tz("Europe/Paris");
            
            // Vérifier si aujourd'hui est bien le premier jour du mois
            if (today.date() === 1) {
                const citationsEntries = await citationModel.find();

                // Marquer toutes les citations comme non utilisées
                citationsEntries.forEach(entry => {
                    entry.use = false;
                    entry.save();
                });

                console.log("Réinitialisation des citations effectuée.");
            } else {
                console.log("Aucune réinitialisation nécessaire aujourd'hui.");
            }

        }, {
            timezone: "Europe/Paris"
        }); */


        // Planifier l'update du classement à 21h05 tous les jours
        cron.schedule('05 21 * * *', async () => {
            const jourClassement = "1";
            try {
                console.log("Update du classement :");
                const jour = await jourModel.findOne({ _id: jourClassement });
                
                if (!jour) {
                    console.error("Jour non trouvé");
                    return;
                }
        
                const user = await classementModel.findOne({ _id: jour.userId });
                if (!user) {
                    console.error("Utilisateur 1 non trouvé");
                    return;
                }

                if (jour.carteMax === 15) {
                    user.points_semaine += 2;
                }else {
                    user.points_semaine += 1;
                }
        
                let userID2, userID3, userID4;
        
                if (jour.user2 !== "0") {
                    userID2 = await classementModel.findOne({ _id: jour.user2 });
                    if (userID2) {
                        userID2.points_semaine += 1;
                    } else {
                        console.error("Utilisateur 2 non trouvé");
                    }
                }
        
                if (jour.user3 !== "0") {
                    userID3 = await classementModel.findOne({ _id: jour.user3 });
                    if (userID3) {
                        userID3.points_semaine += 1;
                    } else {
                        console.error("Utilisateur 3 non trouvé");
                    }
                }
        
                if (jour.user4 !== "0") {
                    userID4 = await classementModel.findOne({ _id: jour.user4 });
                    if (userID4) {
                        userID4.points_semaine += 1;
                    } else {
                        console.error("Utilisateur 4 non trouvé");
                    }
                }
        
                await user.save();
                if (userID2) await userID2.save();
                if (userID3) await userID3.save();
                if (userID4) await userID4.save();
        
                console.log("Le classement a été mis à jour pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de l'update du classement :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la mise à jour du classement tous les dimanches à 22h
        cron.schedule('0 22 * * 0', async () => {
            try {
                const users = await classementModel.find({});
                let classement = 0;
                let userC = [];
        
                // Déterminer l'utilisateur ou les utilisateurs avec le plus de points de la semaine
                for (const user of users) {
                    if (user.points_semaine === classement) {
                        userC.push(user._id);
                    } else if (user.points_semaine > classement) {
                        userC = [user._id];
                        classement = user.points_semaine;
                    }
                    user.points_semaine = 0;
                    await user.save();
                }
        
                if (userC.length > 0) {
                    let description = "Le(s) grand(s) gagnant(s) de la semaine est / sont :\n";
                    for (const userId of userC) {
                        const ranking = await classementModel.findOne({ _id: userId });
        
                        ranking.victoires += 1;
                        await ranking.save();
        
                        description += `${ranking.nom} avec ${ranking.victoires} victoires\n`;
                    }
        
                    // Créer l'embed
                    const embed = new EmbedBuilder()
                        .setColor(0x1E90FF) // Couleur de l'embed
                        .setTitle('Classement des points pour le PRESIDENT de la semaine :')
                        .setDescription(description)
                        .setTimestamp();
        
                    const channel = client.channels.cache.get(CHANNEL_ID_TROUBADOUR);
                    if (channel) {
                        channel.send({ embeds: [embed] });
                    } else {
                        console.error('Channel not found!');
                    }
                }
        
                classement = 0;
                userC = [];
        
                console.log("Le classement a été mis à jour pour tous les utilisateurs.");
            } catch (error) {
                console.error("Erreur lors de la mise à jour du classement :", error);
            }
        }, {
            timezone: "Europe/Paris"
        });
        


        // Planifier la tâche de suppression des messages du channel angle à minuit chaque jour
        cron.schedule('57 23 * * *', () => {
            console.log("La suppréssion s'exécute à l'heure prévue !");
            const channel_angle = client.channels.cache.get(CHANNEL_ANGLE);
            
            if (channel_angle) {
                channel_tarot.messages.fetch()
                    .then(messages => {
                        messages.forEach(message => {
                            message.delete()
                                .then(deletedMessage => console.log(`Message supprimé: ${deletedMessage.content}`))
                                .catch(error => console.error('Erreur lors de la suppression du message :', error));
                        });
                    })
                    .catch(error => console.error('Erreur lors de la récupération des messages :', error));
            } else {
                console.error('Canal non trouvé.');
            }
        }, {
            timezone: "Europe/Paris"
        });

        // Planifier la tâche de suppression des messages du channel President à minuit chaque jour
        cron.schedule('58 23 * * *', () => {
            console.log("La suppréssion s'exécute à l'heure prévue !");
            const channel_tarot = client.channels.cache.get(CHANNEL_ID_PRESIDENT);
            
            if (channel_tarot) {
                channel_tarot.messages.fetch()
                    .then(messages => {
                        messages.forEach(message => {
                            message.delete()
                                .then(deletedMessage => console.log(`Message supprimé: ${deletedMessage.content}`))
                                .catch(error => console.error('Erreur lors de la suppression du message :', error));
                        });
                    })
                    .catch(error => console.error('Erreur lors de la récupération des messages :', error));
            } else {
                console.error('Canal non trouvé.');
            }
        }, {
            timezone: "Europe/Paris"
        });
        
        
        // Planifier la tâche de suppression des messages du channel Tarot à minuit chaque jour
        cron.schedule('59 23 * * *', () => {
            console.log("La suppréssion s'exécute à l'heure prévue !");
            const channel_tarot = client.channels.cache.get(CHANNEL_ID_TAROT);
            
            if (channel_tarot) {
                channel_tarot.messages.fetch()
                    .then(messages => {
                        messages.forEach(message => {
                            message.delete()
                                .then(deletedMessage => console.log(`Message supprimé: ${deletedMessage.content}`))
                                .catch(error => console.error('Erreur lors de la suppression du message :', error));
                        });
                    })
                    .catch(error => console.error('Erreur lors de la récupération des messages :', error));
            } else {
                console.error('Canal non trouvé.');
            }
        }, {
            timezone: "Europe/Paris"
        });
        


// ---------------------------------------------- CONNECTION ------------------------------------------------

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

// ---------------------------------------------- BE ------------------------------------------------

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

/*         (function loop() {

            const triggerTime = getRandomHour();
        
            const now = new Date();
            triggerTime.setHours(triggerTime.getHours() + 24); //set trigger to next day
            Logger.event(`BePoul | Next : ${triggerTime}`)
        
            const triggerMs = triggerTime.getTime() - now.getTime();  

            setTimeout( () => {
                    bePoulTrigger();
                    loop();  
            }, triggerMs);
        }());

        (function loop() {

            const triggerTime = getRandomHour();
        
            const now = new Date();
            triggerTime.setHours(triggerTime.getHours() + 24); //set trigger to next day
            Logger.event(`BeVacqua | Next : ${triggerTime}`)
        
            const triggerMs = triggerTime.getTime() - now.getTime();  

            setTimeout( () => {
                    beVacquaTrigger();
                    loop();  
            }, triggerMs);
        }()); */
        
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

/* function bePoulTrigger(){
    Logger.event("BePoul | Triggered")
    globalClient.channels.cache.get(`1240300484670132244`).send(`<@&${'1240583679265214474'}> C'est l'heure de prendre son poul, faut faire attention à son petit coeur !`)
        .catch(error => Logger.error(error));
}

function beVacquaTrigger(){
    Logger.event("BeVacqua | Triggered")
    globalClient.channels.cache.get(`1240300415099080805`).send(`<@&${'1240583852834033735'}> C'est l'heure de boire de l'eau !`, {
        files: ["https://tenor.com/bzKL6.gif"]
    })
        .catch(error => Logger.error(error));
} */


// ---------------------------------------------- FONCTIONS ------------------------------------------------

async function citations() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    try {
        // Récupérer toutes les citations depuis la base de données
        const quotes = await citationModel.find({ used: false });

        if (quotes.length === 0) {
            console.error('Aucune citation trouvée dans la base de données.');
            return;
        }

        // Sélectionner une citation aléatoire
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        // Mettre à jour la citation pour la marquer comme utilisée
        randomQuote.use = true;
        await randomQuote.save();

        // Créer l'embed
        const embed = new EmbedBuilder()
            .setColor(0x1E90FF) // Couleur de l'embed
            .setTitle(`Citation du ${formattedDate} :`)
            .setDescription(`"${randomQuote.quote}"\n\n- ${randomQuote.author}`)
            .setTimestamp()

        const channel = globalClient.channels.cache.get(CHANNEL_ID_WEATHER);
        if (channel) {
            channel.send({ embeds: [embed] });
        } else {
            console.error('Channel not found!');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des citations depuis la base de données:', error);
    }
}

async function fetchWeatherAndSend() {
    try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        
        const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=Brest,FR&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
        const response = await fetch(forecastUrl);

        // Vérifiez si le statut de la réponse est OK
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json();

        //console.log(data); // Pour inspecter la structure de la réponse

        if (data.cod === "200" && Array.isArray(data.list)) {
            const forecastFor15h = data.list.find(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                return forecastDate.getHours() === 15 && forecastDate.getDate() === currentDate.getDate();
            });

            if (forecastFor15h) {
                const weatherDescription = forecastFor15h.weather[0].description;
                const temperature = forecastFor15h.main.temp;
                const humidity = forecastFor15h.main.humidity;
                const windSpeed = (forecastFor15h.wind.speed * 3.6).toFixed(1);

                const lat = data.city.coord.lat;
                const lon = data.city.coord.lon;
                const uvUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=${OPENWEATHERMAP_API_KEY}&lat=${lat}&lon=${lon}`;
                const uvResponse = await fetch(uvUrl);

                // Vérifiez si le statut de la réponse est OK
                if (!uvResponse.ok) {
                    throw new Error(`Erreur HTTP pour UV ! Statut : ${uvResponse.status}`);
                }

                const uvData = await uvResponse.json();
                const uvIndex = uvData.value;

                let imageUrl;
                if (weatherDescription.includes('clear')) {
                    imageUrl = 'https://i.pinimg.com/564x/0a/ff/88/0aff882a5cae2eddeab5461ce1076267.jpg'; 
                } else if (weatherDescription.includes('rain')) {
                    imageUrl = 'https://i.pinimg.com/564x/6e/01/df/6e01df9a8555d0be8332f77a1c63cadc.jpg'; 
                } else if (weatherDescription.includes('cloud')) {
                    imageUrl = 'https://i.pinimg.com/564x/07/94/da/0794dada573f545671d671ee589279ca.jpg'; 
                } else {
                    imageUrl = 'https://i.pinimg.com/564x/4a/bd/0a/4abd0a676185082b584bc340ba6ab6e3.jpg'; 
                }

                const tops = ['T-shirt', 'Chemise', 'Pull', 'Veste', 'Sweat à capuche', 'Blouse', 'Débardeur', 'Chemisier', 'Polo'];
                const bottoms = ['Jean', 'Pantalon', 'Short', 'Jupe', 'Legging', 'Robe', 'Jogging', 'Salopette', 'Combinaison', 'Short en jean', 'Short en lin'];

                const randomTop = tops[Math.floor(Math.random() * tops.length)];
                const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

                const embed = new EmbedBuilder()
                    .setColor(0x1E90FF)
                    .setTitle(`Météo à Brest le ${formattedDate} à 15h :`)
                    .setDescription(weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1))
                    .setImage(imageUrl)
                    .addFields(
                        { name: 'Température', value: `${temperature}°C`, inline: true },
                        { name: 'Humidité', value: `${humidity}%`, inline: true },
                        { name: 'Vitesse du vent', value: `${windSpeed} km/h`, inline: true },
                        { name: 'Indice UV', value: `${uvIndex}`, inline: true },
                        { name: 'Haut', value: randomTop, inline: true },
                        { name: 'Bas', value: randomBottom, inline: true }
                    )
                    .setTimestamp();

                const channel = globalClient.channels.cache.get(CHANNEL_ID_WEATHER);
                if (channel) {
                    channel.send({ embeds: [embed] });
                } else {
                    console.error('Channel not found!');
                }
            } else {
                console.error('No forecast available for 15h.');
            }
        } else {
            console.error('Failed to fetch weather data or invalid data format:', data.message);
        }
    } catch (error) {
        console.error('Échec de la récupération des données météo :', error);
    }
}
