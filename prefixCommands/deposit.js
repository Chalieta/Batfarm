const { getBalance, deposit } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  const balance = getBalance(client.currency, msg.author.id);
  if (args.length < 1) {
    return msg.reply(
      "Provide an amount you want to deposit. For example: `bat dep 20`"
    );
  }
  // Parse amount of money
  const amount =
    args[0].toLowerCase() === "all" ? balance.wallet : parseInt(args[0]);
  if (isNaN(amount)) {
    return msg.reply(
      "Provide a valid amount in a valid format. For example: `bat dep 20`"
    );
  }
  // Check if the amount of money <= 0
  if (amount <= 0) {
    return msg.reply("Provide an amount greater than 0.");
  }
  // Check if the amount of money <= wallet
  if (amount > balance.wallet) {
    return msg.reply(
      `Deposit failed! You only have 🪙${balance.wallet} on hand.`
    );
  }
  deposit(client.currency, msg.author.id, amount);
  return msg.reply(
    `You have successfully deposited 🪙${amount} to Gotham National Bank!`
  );
};

exports.name = "deposit";

exports.aliases = ["dep"];
