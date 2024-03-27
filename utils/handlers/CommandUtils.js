const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);
const Logger = require("../Logger");

module.exports = async (client) => {
  (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async (cmdFile) => {
    const cmd = require(cmdFile);

    if (!cmd.name)
      return Logger.warn(
        `Commande non-chargée: ajouter un nom à votre commande ↓\nFichier -> ${cmdFile}`
      );

    if (!cmd.description)
      return Logger.warn(
        `Commande non-chargée: ajouter une description à votre commande ↓\nFichier -> ${cmdFile}`
      );

    client.commands.set(cmd.name, cmd);
    Logger.command(`- ${cmd.name}`);
  });
};
