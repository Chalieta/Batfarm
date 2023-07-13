const { getBalance, addBalance } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  if (msg.mentions.users.size === 0) {
    return msg.reply(
      "Mention the user you want to rob. For example: `bat rob @Batfarm`"
    );
  }
  const target = msg.mentions.users.first();
  // Get target's wallet balance
  const balance = getBalance(client.currency, target.id);

  // Check if the amount of money <= 0
  if (balance.wallet <= 100) {
    return msg.reply(
      `<@${target.id}> doesn't have at least 🪙100 in their wallet.`
    );
  }

  const amount = Math.floor(Math.random() * balance.wallet);

  // Transfer
  addBalance(client.currency, msg.author.id, amount);
  addBalance(client.currency, target.id, -amount);
  return msg.reply(`You robbed 🪙${amount} from ${target}!`);
};

exports.name = "rob";

// exports.cooldown = 2 * 60 * 60; // 2-hour cooldown
