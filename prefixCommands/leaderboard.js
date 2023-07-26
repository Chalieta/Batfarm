const { EmbedBuilder } = require("discord.js");

exports.run = (client, msg, args) => {
  const icon = client.guilds.cache
    .get(msg.guildId)
    .iconURL({ size: 2048, extension: "jpg" });
  const lb = client.currency
    .sort((a, b) => b.wallet + b.bank - (a.wallet + a.bank))
    .filter((user) => client.users.cache.has(user.user_id))
    .first(10)
    .map(
      (user, position) =>
        `${position + 1}. ${
          client.users.cache.get(user.user_id).username
        } — 🪙${user.wallet + user.bank}`
    )
    .join("\n");
  const embed = new EmbedBuilder()
    .setColor(0xb52b1b)
    .setAuthor({
      name: `${client.guilds.cache.get(msg.guildId).name}'s Leaderboard`,
      iconURL: `${icon}`,
    })
    .setDescription(`${lb}`)
    .setTimestamp();
  // .addFields({ name: "\u200b", value: `${lb}` });
  return msg.reply({ embeds: [embed] });
};

exports.name = "leaderboard";

exports.aliases = ["lb"];
