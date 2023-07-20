const { Users } = require("../dbObjects.js");

const emoji = { Tomato: "🍅", Eggplant: "🍆", Corn: "🌽", Pepper: "🫑" };

exports.run = async (client, msg, args) => {
  const user = await Users.findOne({ where: { user_id: msg.author.id } });
  const plants = await user.getPlants(msg.author.id);

  if (!plants.length)
    return msg.reply(`${msg.author.username}'s garden is empty!`);

  var gardenMap = "";
  var columns = 5;
  plants.forEach((p) => {
    gardenMap +=
      p.counter === 0 ? emoji[p.item.name] : p.counter === 3 ? "🫘" : "🌱";
    gardenMap += " ";
    columns--;
    if (columns <= 0) {
      gardenMap += "\n";
      columns = 5;
    }
  });

  return msg.reply(`${msg.author.username}'s Garden:\n${gardenMap}`);
};

exports.name = "garden";

exports.aliases = ["gar", "g"];
