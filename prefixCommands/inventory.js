const { Users } = require("../dbObjects.js");

exports.run = async (client, msg, args) => {
  const user = await Users.findOne({ where: { user_id: msg.author.id } });
  const items = await user.getItems(msg.author.id);

  if (!items.length)
    return msg.reply(`${msg.author.username}'s inventory is empty!`);

  return msg.reply(
    `${msg.author.username}'s Inventory:\n${items
      .map((i) => `${i.item.name} x${i.amount}`)
      .join("\n")}`
  );
};

exports.name = "inventory";

exports.aliases = ["inv", "i"];
