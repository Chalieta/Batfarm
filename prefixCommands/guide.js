const embed = require("../embeds/guide.js");

exports.run = (client, msg, args) => {
  return msg.reply({ embeds: [embed] });
};

exports.name = "guide";

exports.aliases = ["help"];
