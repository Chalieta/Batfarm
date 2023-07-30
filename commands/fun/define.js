const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Replies with the definition of a word!")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The word to define")
        .setRequired(true)
    ),
  async execute(interaction) {
    const word = interaction.options.getString("word");
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.title) {
          return interaction.reply(
            `No definition for the word **${word}** is found.`
          );
        }
        const def = data[0];
        for (var i = 0; i < def.phonetics.length; ++i) {
          if (def.phonetics[i].text) {
            var phonetics = def.phonetics[i].text;
            phonetics += "\n";
            break;
          }
        }
        var meanings = "";
        def.meanings.forEach((m) => {
          meanings += `*${m.partOfSpeech}*\n`;
          m.definitions.forEach((d) => {
            meanings += `- ${d.definition}\n`;
            if (d.example) {
              meanings += `  Example: ${d.example}\n`;
            }
            if (d.synonyms.length !== 0) {
              meanings += `  Synonyms: ${d.synonyms.join(", ")}\n`;
            }
            if (d.antonyms.length !== 0) {
              meanings += `  Antonyms: ${d.antonyms.join(", ")}\n`;
            }
          });
          if (m.synonyms.length !== 0) {
            meanings += `  Synonyms: ${m.synonyms.join(", ")}\n`;
          }
          if (m.antonyms.length !== 0) {
            meanings += `  Antonyms: ${m.antonyms.join(", ")}\n`;
          }
          meanings += "\n";
        });
        return interaction.reply(
          `# ${def.word}\n${phonetics ?? ""}\n${meanings}`
        );
      });
  },
};
