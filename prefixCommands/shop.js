const { Shop } = require("../dbObjects.js");
const { codeBlock, EmbedBuilder } = require("discord.js"); // To be replaced with embed

exports.run = async (client, msg, args) => {
  const items = await Shop.findAll();
  var itemList = "`Buy or sell for the price listed:\n";
  items.forEach((i) => {
    itemList += `${i.name}`;
    for (var j = 0; j < 20 - i.name.length; j++) {
      itemList += " ";
    }
    itemList += `🪙${i.cost}\n`;
  });
  itemList += "`";
  // const itemNames = items.map((i) => `${i.name} `).join("\n");
  // const itemPrices = items.map((i) => `🪙${i.cost}`).join("\n");
  const embed = new EmbedBuilder()
    .setColor(0xfcc93d)
    .setTitle("Gotham's General Store")
    .setDescription(
      `${itemList}\n\`bat buy (item name)\` to buy an item and \`bat sell (item name)\` to sell an item.`
    )
    .setFooter({
      text: "Thank you for shopping at Gotham's General Store",
    });
  // .addFields(
  //   { name: "\u200b", value: `${itemNames}`, inline: true },
  //   { name: "\u200b", value: `${itemPrices}`, inline: true }
  // );
  return msg.reply(
    // codeBlock(items.map((i) => `${i.name}: 🪙${i.cost}`).join("\n"))
    { embeds: [embed] }
  );
};

exports.name = "shop";
exports.aliases = ["store"];
