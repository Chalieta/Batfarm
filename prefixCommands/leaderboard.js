const { EmbedBuilder } = require("discord.js");

exports.run = (client, msg, args) => {
  const icon = client.guilds.cache
    .get(msg.guildId)
    .iconURL({ size: 2048, extension: "jpg" });
  const lb = client.currency
    .sort((a, b) => b.wallet + b.bank - (a.wallet + a.bank))
    // .filter((user) => client.users.cache.has(user.user_id))
    .first(10);
  var lbPrint = "";
  lb.forEach((user, position) => {
    // var uname = await client.users.fetch(user.user_id).username;
    // lbPrint += `${position + 1}. ${uname} — 🪙${user.wallet + user.bank}\n`;
    lbPrint += `${position + 1}. <@${user.user_id}> — 🪙${
      user.wallet + user.bank
    }\n`;
  });
  const embed = new EmbedBuilder()
    .setColor(0xb52b1b)
    .setAuthor({
      name: `${client.guilds.cache.get(msg.guildId).name}'s Leaderboard`,
      iconURL: `${icon}`,
    })
    .setDescription(`${lbPrint}`)
    .setTimestamp();
  // .addFields({ name: "\u200b", value: `${lb}` });
  return msg.reply({ embeds: [embed] });
};

exports.name = "leaderboard";

exports.aliases = ["lb"];
