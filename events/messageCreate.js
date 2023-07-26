const fetch = require("node-fetch");
const { Users, Shop, Inventory } = require("../dbObjects.js");
const { codeBlock, Collection } = require("discord.js");
const { Op } = require("sequelize");

module.exports = async (client, msg) => {
  const prefix = client.config.prefix;
  const currency = client.currency;
  const cooldowns = client.cooldowns;
  // Ignore messages that don't start with prefix and bot messages
  if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Find user and initialize if doesn't exist
  const user = Users.findOne({ where: { user_id: msg.author.id } });
  if (!user) {
    await Users.create({ user_id: id, wallet: 100 + amount });
  }

  // Grab the command data from the client.commands Enmap
  const cmd =
    client.prefixCommands.get(command) ||
    client.prefixCommands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(command)
    );

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  if (!cooldowns.has(cmd.name) && cmd.cooldown) {
    cooldowns.set(cmd.name, new Collection());
  }

  // Check cooldowns
  if (cmd.cooldown) {
    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    // const defaultCooldownDuration = 3;
    const cooldownAmount = cmd.cooldown * 1000; // Converts seconds to milliseconds

    if (timestamps.has(msg.author.id)) {
      const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return msg.reply({
          content: `You are on a cooldown for \`${cmd.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
  }

  // Run the command
  cmd.run(client, msg, args);
};
