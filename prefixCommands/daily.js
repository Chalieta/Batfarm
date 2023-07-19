const { addBalance } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  let amountEarned = Math.floor(Math.random() * 200) + 100;
  addBalance(client.currency, msg.author.id, amountEarned).then((u) => {
    msg.reply(
      `Your daily reward of 🪙${amountEarned} has been successfully claimed!`
    );
    // const channel = client.channels.cache.get("881377807362588706");
    // channel.send(".daily");
  });
};

exports.name = "daily";

// exports.cooldown = 24 * 60 * 60; // 24-hour cooldown
