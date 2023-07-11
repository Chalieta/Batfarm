const {
  addBalance,
  getBalance,
  deposit,
  withdraw,
} = require("../helperMethods.js");
const fetch = require("node-fetch");
const { Users, Shop, Inventory } = require("../dbObjects.js");
const { codeBlock } = require("discord.js");
const { Op } = require("sequelize");

module.exports = async (client, msg) => {
  const prefix = client.config.prefix;
  const currency = client.currency;
  // Ignore messages that don't start with prefix and bot messages
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd =
    client.prefixCommands.get(command) ||
    client.prefixCommands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(command)
    );

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, msg, args);
};
