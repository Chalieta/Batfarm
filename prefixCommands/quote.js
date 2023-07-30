const fetch = require("node-fetch");

exports.run = (client, msg, args) => {
  fetch("https://zenquotes.io/api/random")
    .then((res) => res.json())
    .then((data) => msg.reply(`"${data[0].q}" —${data[0].a}`));
};

exports.name = "quote";

exports.aliases = ["q", "qt"];
