const { getBalance, withdraw } = require("../helperMethods.js");

exports.run = async (client, msg, args) => {
  const balance = await getBalance(client.currency, msg.author.id);
  if (args.length < 1) {
    return msg.reply(
      "Provide an amount you want to withdraw. For example: `bat wd 20`"
    );
  }
  // Parse amount of money
  const amount =
    args[0].toLowerCase() === "all" ? balance.bank : parseInt(args[0]);
  if (isNaN(amount)) {
    return msg.reply(
      "Provide a valid amount in a valid format. For example: `bat wd 20`"
    );
  }
  // Check if the amount of money <= 0
  if (amount <= 0) {
    return msg.reply("Provide an amount greater than 0.");
  }
  // Check if the amount of money <= wallet
  if (amount > balance.bank) {
    return msg.reply(
      `Withdraw failed! You only have 🪙${balance.bank} in the bank.`
    );
  }
  withdraw(client.currency, msg.author.id, amount);
  return msg.reply(
    `You have successfully withdrawn 🪙${amount} from Gotham National Bank!`
  );
};

exports.name = "withdraw";

exports.aliases = ["wd"];
