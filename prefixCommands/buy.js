const { Users, Inventory, Shop } = require("../dbObjects.js");
const { addBalance, getBalance } = require("../helperMethods.js");
const { Op } = require("sequelize");

exports.run = async (client, msg, args) => {
  if (args.length < 1) {
    return msg.reply("Provide the name of item you want to buy.");
  }
  var itemName = "";
  var quantity = 1;
  if (args.length > 1) {
    for (var i = 0; i < args.length; ++i) {
      if (!isNaN(args[i])) {
        quantity = parseInt(args[i]);
        break;
      }
      itemName += args[i] + " ";
    }
  } else {
    itemName = args[0];
  }
  itemName = itemName.trim(); // Trim whitespace at the end
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
        "You have a fishing rod! You can only have 1 fishing rod at a time."
      );
    }
    if (quantity > 1) {
      return msg.reply("You can only buy 1 fishing rod.");
    }
  }
  const balance = await getBalance(client.currency, msg.author.id);
  if (item.cost * quantity > balance.wallet) {
    return msg.reply(
      `You currently have 🪙${balance.wallet}, but you need 🪙${
        item.cost * quantity
      }!`
    );
  }
  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });
  addBalance(client.currency, msg.author.id, -(item.cost * quantity));
  await user.addItem(msg.author.id, item, quantity);

  return msg.reply(
    `Transaction approved! You've bought: ${item.name} (x${quantity}) for 🪙${
      item.cost * quantity
    }.`
  );
};

exports.name = "buy";
