const { Users, Garden, Shop } = require("../dbObjects.js");
const { Op } = require("sequelize");

exports.run = async (client, msg, args) => {
  if (args.length < 1) {
    return msg.reply("Provide the name of the plant.");
  }

  // Check if the plant is valid
  const plantName = args[0].toLowerCase();
  const plant = await Shop.findOne({
    where: { name: { [Op.like]: plantName } },
  });
  if (!plant) return msg.reply(`That plant doesn't exist.`);

  // Check if user has the plant in the garden
  const plantInv = await Garden.findAll({
    where: { item_id: plant.id, user_id: msg.author.id, counter: 0 },
  });
  if (!plantInv) return msg.reply(`You don't have any ${plant.name}.`);

  // Extract quantity
  var quantity = args[1] ?? 1; // Default quantity is 1;
  if (args[1])
    quantity =
      args[1].toLowerCase() === "all" ? plantInv.length : parseInt(args[1]);

  if (isNaN(quantity) || quantity <= 0) {
    return msg.reply(
      "Enter a valid quantity. Example: `bat harvest tomato 3` or `bat harvest tomato all`"
    );
  }

  // Check if the user has enough plants
  if (plantInv.length < quantity)
    return msg.reply(`You only have ${plantInv.length} ${plant.name}(s).`);

  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });

  user.removePlant(msg.author.id, plant, quantity);
  await user.addItem(msg.author.id, plant, quantity);

  return msg.reply(`You have harvested ${plant.name} (x${quantity})!`);
};

exports.name = "harvest";
