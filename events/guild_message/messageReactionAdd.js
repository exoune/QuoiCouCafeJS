//const Logger = require("../../utils/Logger")
const { troubadourSchema } = require('../../data/troubadour-schema.js');

const { ActivityType } = require('discord.js');
const mongoose = require('mongoose')
const troubadourModel = mongoose.model('troubadour', troubadourSchema);

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async execute(client, reaction, user) {
        // Vérifiez si la réaction n'est pas ajoutée par un bot
        if (user.bot) return;

        // Assurez-vous que la réaction et le message sont complètement chargés
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Erreur lors du chargement de la réaction: ', error);
                return;
            }
        }

        const message = reaction.message;

        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error('Erreur lors du chargement du message: ', error);
                return;
            }
        }

        // Vérifiez si le message contient l'emoji :pilote:
        if (reaction.emoji.id === "1226853784039329852") {
            try {
                const message = reaction.message;
                const author = message.author;

                // Vérifiez si l'auteur du message est défini
                if (!author) {
                    console.error('Auteur du message non défini.');
                    return;
                }

                const troubadour = await troubadourModel.findOne({ _id: author.id });
/* 
                if (!troubadour) {
                    // Si l'utilisateur n'existe pas, créez un nouveau document
                    troubadour = new Troubadour({
                        _id: author.id,
                        nom: message.author.username,
                        valeur: 1,
                        image: message.author.displayAvatarURL()
                    });
                } else { */
                    // Incrémentez le compteur si l'utilisateur existe
                troubadour.valeur += 1;
                //}

                await troubadour.save();
                console.log(`Incrémenteur pour ${message.author.username} (${author.id}): ${troubadour.valeur}`);
            } catch (error) {
                console.error('Impossible de réagir à un message: ', error);
            }
        }
    }
}
