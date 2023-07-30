require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("astronomy-picture")
    .setDescription("Replies with astronomy picture of the day!")
    .addBooleanOption((option) =>
      option
        .setName("random")
        .setDescription("Generate an astronomy picture of a random date!")
        .setRequired(true)
    ),
  async execute(interaction) {
    function randomDate(start, end) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    const d = randomDate(new Date(2012, 0, 1), new Date());
    const dText = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    // console.log(dText);

    const random = interaction.options.getBoolean("random");
    await interaction.deferReply();
    if (random) {
      fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${dText}`
      )
        .then((response) => response.json())
        .then((img) => {
          // console.log(img);
          interaction.editReply({
            content: `# ${img.title} \n${
              monthNames[d.getMonth()]
            } ${d.getDate()}, ${d.getFullYear()}\n${img.explanation}`,
            files: [img.url],
          });
        });
    } else {
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
    }
  },
};
