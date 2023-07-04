require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("astronomy-picture")
    .setDescription("Replies with astronomy picture of the day!"),
  async execute(interaction) {
    await interaction.deferReply();
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    )
      .then((response) => response.json())
      .then((img) =>
        interaction.editReply({
          content: `# ${img.title} \n${img.explanation}`,
          files: [img.url],
        })
      );
  },
};
