const { Users, Garden } = require("../dbObjects.js");

exports.run = async (client, msg, args) => {
  const user = await Users.findOne({ where: { user_id: msg.author.id } });
  const plants = await user.getPlants(msg.author.id);
  var harvest = false;

  if (!plants.length)
    return msg.reply(`${msg.author.username}'s garden is empty!`);

  plants.forEach((p) => {
    if (p.counter > 0) {
      p.counter--;
    }

    if (p.counter <= 0) {
      harvest = true;
    }
    p.save();
  });
  if (harvest) {
    return msg.reply("You have plant(s) ready to harvest!");
  } else {
    return msg.reply("Thank you for watering your plants today!");
  }
};

exports.name = "water";
