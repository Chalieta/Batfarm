const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Generates a cat gif!"),
  async execute(interaction) {
    await interaction.deferReply();
    fetch("https://cataas.com/cat/gif?json=true")
      .then((response) => response.json())
      .then((cat) => {
        var url = `https://cataas.com/cat/${cat._id}.gif`;
        console.log(url);
        interaction.editReply({ files: [url] });
      });
  },
};
