const { Shop } = require("../dbObjects.js");
const { codeBlock } = require("discord.js"); // To be replaced with embed

exports.run = async (client, msg, args) => {
  const items = await Shop.findAll();
  return msg.reply(
    codeBlock(items.map((i) => `${i.name}: 🪙${i.cost}`).join("\n"))
  );
};

exports.name = "shop";
