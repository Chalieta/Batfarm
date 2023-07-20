const { Users } = require("../dbObjects.js");

exports.run = async (client, msg, args) => {
  const user = await Users.findOne({ where: { user_id: msg.author.id } });
  const plants = await user.getPlants(msg.author.id);

  if (!plants.length)
    return msg.reply(`${msg.author.username}'s garden is empty!`);

  return msg.reply(
    // To be modified with emojis
    `${msg.author.username}'s Garden:\n${plants
      .map((i) => `${i.item.name} - ${i.counter}`)
      .join("\n")}`
  );
};

exports.name = "garden";

exports.aliases = ["gar", "g"];
