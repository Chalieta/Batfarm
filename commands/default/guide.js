const { SlashCommandBuilder } = require("discord.js");
const embed = require("../../embeds/guide.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Displays the guide to use the bot"),
  async execute(interaction) {
    await interaction.reply({ embeds: [embed] });
  },
};
