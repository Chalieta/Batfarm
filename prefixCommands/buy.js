const { Users, Inventory, Shop } = require("../dbObjects.js");
const { addBalance, getBalance } = require("../helperMethods.js");
const { Op } = require("sequelize");

exports.run = async (client, msg, args) => {
  if (args.length < 2) {
    return msg.reply("Provide the name of item you want to buy.");
  }
  const itemName = args[0] + " " + args[1];
  const item = await Shop.findOne({
    where: { name: { [Op.like]: itemName } },
  });
  if (!item) return msg.reply(`That item doesn't exist.`);
  if (item.name === "Fishing Rod") {
    // Check if user already has a fishing rod
    const fishingRod = await Inventory.findOne({
      where: { item_id: 1, user_id: msg.author.id },
    });

    if (fishingRod) {
      return msg.reply(
        "You have a fishing rod! You can only have 1 fishing rod."
      );
    }
  }
  const balance = getBalance(client.currency, msg.author.id);
  if (item.cost > balance.wallet) {
    return msg.reply(
      `You currently have 🪙${balance.wallet}, but the ${item.name} costs 🪙${item.cost}!`
    );
  }
  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });
  addBalance(client.currency, msg.author.id, -item.cost);
  await user.addItem(msg.author.id, item);

  return msg.reply(`You've bought: ${item.name}.`);
};

exports.name = "buy";
