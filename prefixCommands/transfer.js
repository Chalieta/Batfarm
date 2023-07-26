const { getBalance, addBalance } = require("../helperMethods.js");

exports.run = async (client, msg, args) => {
  if (msg.mentions.users.size === 0) {
    return msg.reply(
      "Mention the user you want to transfer batcoins to. For example: `bat tf @Batfarm 5`"
    );
  }
  let target;
  for (const u of msg.mentions.users.keys()) {
    target = u;
  }
  if (args.length < 2) {
    return msg.reply(
      "Provide an amount you want to transfer. For example: `bat tf @Batfarm 5`"
    );
  }
  // Parse amount of money
  const amount = parseInt(args[1]);
  if (isNaN(amount)) {
    return msg.reply(
      "Provide a valid amount in a valid format. For example: `bat tf @Batfarm 5`"
    );
  }
  // Check if the amount of money <= 0
  if (amount <= 0) {
    return msg.reply("Provide an amount greater than 0.");
  }
  // Check if the amount of money <= wallet
  const balance = await getBalance(client.currency, msg.author.id);
  if (amount > balance.wallet) {
    return msg.reply(
      `Transfer failed! You only have 🪙${balance.wallet} batcoins on hand.`
    );
  }
  // Transfer
  addBalance(client.currency, msg.author.id, -amount);
  addBalance(client.currency, target, amount);
  return msg.reply(
    `You have successfully transferred 🪙${amount} to <@${target}>!`
  );
};

exports.name = "transfer";

exports.aliases = ["tf", "tr"];
