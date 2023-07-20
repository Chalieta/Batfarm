const { Users, Inventory, Shop } = require("../dbObjects.js");
const { Op } = require("sequelize");

exports.run = async (client, msg, args) => {
  // TO-DO: Check if user has enough spaces in the garden (25)

  if (args.length < 1) {
    return msg.reply("Provide the name of the plant.");
  }

  // Check if the plant is valid
  const plantName = args[0].toLowerCase();
  const seedName = plantName + " seed";
  const plant = await Shop.findOne({
    where: { name: { [Op.like]: plantName } },
  });
  if (!plant) return msg.reply(`That plant doesn't exist.`);
  const seed = await Shop.findOne({
    where: { name: { [Op.like]: seedName } },
  });
  if (!seed) return msg.reply(`The seed of that plant doesn't exist.`);

  // Check if user has the seed to plant
  const inv = await Inventory.findOne({
    where: { item_id: seed.id, user_id: msg.author.id },
  });
  if (!inv || inv.amount === 0)
    return msg.reply(`You don't have any ${seed.name}.`);

  // Extract quantity
  var quantity = args[1] ?? 1; // Default quantity is 1;
  if (args[1])
    quantity = args[1].toLowerCase() === "all" ? inv.amount : parseInt(args[1]);

  if (isNaN(quantity) || quantity <= 0) {
    return msg.reply(
      "Enter a valid quantity. Example: `bat plant tomato 3` or `bat plant tomato all`"
    );
  }

  // Check if the user has enough seeds
  if (inv.amount < quantity)
    return msg.reply(`You only have ${inv.amount} ${plant.name} Seed(s).`);

  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });

  user.addPlant(msg.author.id, plant, quantity);
  await user.removeItem(msg.author.id, seed, quantity);

  return msg.reply(
    `You have planted ${plant.name} (x${quantity}). Don't forget to water your plants!`
  );
};

exports.name = "plant";
