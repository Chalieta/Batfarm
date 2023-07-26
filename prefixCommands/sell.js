const { Users, Inventory, Shop } = require("../dbObjects.js");
const { addBalance } = require("../helperMethods.js");
const { Op } = require("sequelize");

exports.run = async (client, msg, args) => {
  if (args.length < 1) {
    return msg.reply("Provide the name of the item you want to sell.");
  }

  const itemName = args[0];
  if (itemName.toLowerCase() === "fishing" && args[1].toLowerCase() === "rod")
    return msg.reply("You cannot sell your fishing rod.");

  const item = await Shop.findOne({
    where: { name: { [Op.like]: itemName } },
  });
  if (!item) return msg.reply(`That item doesn't exist.`);

  const inv = await Inventory.findOne({
    where: { item_id: item.id, user_id: msg.author.id },
  });
  if (!inv || inv.amount === 0)
    return msg.reply(`You don't have any ${item.name}.`);

  // Extract quantity
  var quantity = args[1] ?? 1; // Default quantity is 1;
  if (args[1])
    quantity = args[1].toLowerCase() === "all" ? inv.amount : parseInt(args[1]);

  if (isNaN(quantity) || quantity <= 0) {
    return msg.reply(
      "Enter a valid quantity. Example: `bat sell shark 3` or `bat shell shark all`"
    );
  }

  if (inv.amount < quantity)
    return msg.reply(
      `Transaction failed! The quantity of that item in your inventory: ${inv.amount}`
    );

  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });

  addBalance(client.currency, msg.author.id, quantity * item.cost);
  await user.removeItem(msg.author.id, item, quantity);

  return msg.reply(
    `Transaction approved! You've sold: ${item.name} (x${quantity}) for 🪙${
      quantity * item.cost
    }.`
  );
};

exports.name = "sell";
