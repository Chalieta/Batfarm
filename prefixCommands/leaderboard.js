const { codeBlock } = require("discord.js"); // To be replaced with embed

exports.run = (client, msg, args) => {
  return msg.reply(
    codeBlock(
      client.currency
        .sort((a, b) => b.wallet + b.bank - (a.balance + a.bank))
        .filter((user) => client.users.cache.has(user.user_id))
        .first(10)
        .map(
          (user, position) =>
            `${position + 1}. ${client.users.cache.get(user.user_id).tag}: 🪙${
              user.wallet + user.bank
            }`
        )
        .join("\n")
    )
  );
};

exports.name = "leaderboard";

exports.aliases = ["lb"];
