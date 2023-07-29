const { getBalance, addBalance } = require("../helperMethods.js");

exports.run = async (client, msg, args) => {
  const chance = Math.floor(Math.random() * 2);
  if (msg.mentions.users.size === 0) {
    return msg.reply(
      "Mention the user you want to rob. For example: `bat rob @Batfarm`"
    );
  }
  const target = msg.mentions.users.first();
  // Get target's wallet balance
  const balance = await getBalance(client.currency, target.id);

  // Check if the amount of money <= 0
  if (balance.wallet <= 100) {
    return msg.reply(
      `<@${target.id}> doesn't have at least 🪙100 in their wallet.`
    );
  }

  if (chance === 0) {
    addBalance(client.currency, msg.author.id, -100);
    return msg.reply({
      files: [
        "https://media.tenor.com/AwnhEjcYUuEAAAAd/batman-batman-the-animated-series.gif",
      ],
      content:
        "# ATTENZIONE PICKPOCKET! ATTENZIONE BORSEGGIATRICI!\nBatman catches you in action, and you're fined 🪙100",
    });
  }
  const amount = Math.floor(Math.random() * balance.wallet);

  // Transfer
  addBalance(client.currency, msg.author.id, amount);
  addBalance(client.currency, target.id, -amount);
  return msg.reply(`You robbed 🪙${amount} from ${target}!`);
};

exports.name = "rob";

exports.cooldown = 10 * 60; // 10-minute cooldown for testing

// exports.cooldown = 2 * 60 * 60; // 2-hour cooldown
