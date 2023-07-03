const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("order-coffee")
    .setDescription("Serves you coffee!"),
  async execute(interaction) {
    await interaction.deferReply();
    fetch("https://coffee.alexflipnote.dev/random.json")
      .then((response) => response.json())
      .then((coffee) => interaction.editReply({ files: [coffee.file] }));
  },
};
