const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime-quote")
    .setDescription("Replies with anime quotes!"),
  async execute(interaction) {
    fetch("https://animechan.xyz/api/random")
      .then((response) => response.json())
      .then((quote) =>
        interaction.reply(`${quote.quote} —${quote.character} (${quote.anime})`)
      );
  },
};
