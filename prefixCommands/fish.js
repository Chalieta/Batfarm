const { Users, Shop, Inventory } = require("../dbObjects.js");
const { Op } = require("sequelize");
const { EmbedBuilder } = require("discord.js");
const images = require("../fish.json");

const fish = [
  "Carp",
  "Crab",
  "Squid",
  "Lobster",
  "Salmon",
  "Snapper",
  "Sturgeon",
  "Tuna",
  "Shark",
];

const fishEmojis = ["🐟", "🦀", "🦑", "🦞", "🐟", "🐟", "🐟", "🐟", "🦈"];

exports.run = async (client, msg, args) => {
  const user = await Users.findOne({
    where: { user_id: msg.author.id },
  });
  // Check if user has a fishing rod
  const fishingRod = await Inventory.findOne({
    where: { item_id: 1, user_id: msg.author.id },
  });

  if (!fishingRod) {
    return msg.reply(
      "You have no fishing rod. Buy a fishing rod to fish. Example: `bat buy fishing rod`"
    );
  }

  const chance = Math.random();
  if (chance <= 0.05) {
    msg.reply(
      "You caught somebody's moldy socks 🧦! *You threw it back to the water.*"
    );
  } else if (chance <= 0.1) {
    msg.reply(
      "You caught somebody's stinky underwear 🩲! *You threw it back to the water.*"
    );
  } else if (chance <= 0.15) {
    msg.reply("You caught an empty can 🥫! *You threw it back to the water.*");
  } else if (chance <= 0.2) {
    msg.reply(
      "You caught an empty barrel 🛢️! *You rolled it back into the water.*"
    );
  } else if (chance <= 0.5) {
    var random = Math.floor(Math.random() * 3);
  } else if (chance <= 0.8) {
    var random = Math.floor(Math.random() * 3) + 3;
  } else if (chance <= 0.95) {
    var random = Math.floor(Math.random() * 2) + 6;
  } else {
    var random = Math.floor(Math.random() * 9);
  }

  if (random > 0) {
    const fishCaught = fish[random];
    const item = await Shop.findOne({
      where: { name: { [Op.like]: fishCaught } },
    });
    if (!item) console.log(`${fishCaught} doesn't exist.`);

    await user.addItem(msg.author.id, item, 1);

    const embed = new EmbedBuilder()
      .setColor(0x18a362)
      .setAuthor({
        name: `${client.users.cache.get(msg.author.id).username} - Fish`,
        iconURL: `${client.users.cache
          .get(msg.author.id)
          .avatarURL({ size: 2048, extension: "jpg" })}`,
      })
      .setDescription(`You caught a **${fishCaught}**!`)
      .setImage(`${images[fishCaught]}`)
      .setTimestamp();
    // msg.reply(`You caught a ${fishCaught} ${fishEmojis[random]}!`);
    msg.reply({ embeds: [embed] });
  }
  //   console.log(chance);
  fishingRod.counter--;
  //   console.log(fishingRod.counter);
  if (fishingRod.counter > 0) {
    return fishingRod.save();
  } else {
    Inventory.destroy({ where: { user_id: msg.author.id, item_id: 1 } }); // Destroy fishing rod in inventory
    return msg.reply("Your fishing rod broke! Buy a new one to fish again!");
  }
};

exports.name = "fish";

// exports.cooldown = 15 * 60; // 15-minute cooldown
