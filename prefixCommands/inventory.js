const { Users } = require("../dbObjects.js");
const { addBalance } = require("../helperMethods.js");
const { EmbedBuilder } = require("discord.js");

exports.run = async (client, msg, args) => {
  const user =
    (await Users.findOne({ where: { user_id: msg.author.id } })) ??
    (await addBalance(client.currency, msg.author.id, 0));
  const items = await user.getItems(msg.author.id);
  var itemList = "`A list of items you currently own:\n";
  items.forEach((i) => {
    itemList += `${i.item.name}`;
    for (var j = 0; j < 20 - i.item.name.length; j++) {
      itemList += " ";
    }
    itemList += `x${i.amount}\n`;
  });
  itemList += "`";
  // const itemNames = items.map((i) => `${i.item.name} `).join("\n");
  // const itemQuant = items.map((i) => `x${i.amount}`).join("\n");
  const embed = new EmbedBuilder()
    .setColor(0x307cab)
    .setDescription(`${itemList}`)
    .setAuthor({
      name: `${client.users.cache.get(msg.author.id).username}'s Inventory`,
      iconURL: `${client.users.cache
        .get(msg.author.id)
        .avatarURL({ size: 2048, extension: "jpg" })}`,
    })
    .setTimestamp();
  // .addFields(
  //   { name: "\u200b", value: `${itemNames}`, inline: true },
  //   { name: "\u200b", value: `${itemQuant}`, inline: true }
  // );

  if (!items.length)
    return msg.reply(`${msg.author.username}'s inventory is empty!`);
  return msg.reply({ embeds: [embed] });
};

exports.name = "inventory";

exports.aliases = ["inv", "i"];
