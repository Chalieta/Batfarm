const { getBalance } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  const balance = getBalance(client.currency, msg.author.id);
  msg.reply(
    `You have 🪙${balance.wallet} on hand and 🪙${balance.bank} in the bank.`
  );
};

exports.name = "balance";

exports.aliases = ["bal", "b"];
