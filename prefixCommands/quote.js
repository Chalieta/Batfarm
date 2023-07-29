const fetch = require("node-fetch");

exports.run = (client, msg, args) => {
  // If a user sends "Hi" to the server, the bot will reply
  fetch("https://zenquotes.io/api/random")
    .then((res) => res.json())
    .then((data) => msg.reply(`"${data[0].q}" —${data[0].a}`));
};

exports.name = "quote";

exports.aliases = ["q", "qt"];
