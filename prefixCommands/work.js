const { addBalance } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  let amountEarned = Math.floor(Math.random() * 20) + 10;
  addBalance(client.currency, msg.author.id, amountEarned).then((u) =>
    msg.reply(
      `${msg.author.username} went to work and earned 🪙${amountEarned}.`
    )
  );
};

exports.name = "work";

exports.aliases = ["w"];

// exports.cooldown = 60 * 60; // 1-hour cooldown
