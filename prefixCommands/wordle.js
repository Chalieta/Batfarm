const fetch = require("node-fetch");
const { addBalance } = require("../helperMethods.js");

exports.run = (client, msg, args) => {
  const channel = client.channels.cache.get(msg.channelId);
  var win = false;
  fetch("https://random-word-api.herokuapp.com/word?length=5&lang=en")
    .then((res) => res.json())
    .then((data) => {
      const word = data[0];
      // const word = "fritt";
      msg.reply("Guess a five-letter word!\n🔲🔲🔲🔲🔲");

      const collectorFilter = (m) => m.author.id === msg.author.id;
      const collector = channel.createMessageCollector({
        filter: collectorFilter,
        time: 60000 * 10,
        max: 5,
      });
      collector.on("collect", (m) => {
        var letterCount = {};
        for (c of word) {
          if (letterCount[c] === undefined) {
            letterCount[c] = 1;
          } else {
            letterCount[c]++;
          }
        }
        const answer = m.content.toLowerCase();
        if (answer === word) {
          channel.send(`🟩🟩🟩🟩🟩`);
          addBalance(client.currency, msg.author.id, 500);
          win = true;
          collector.stop();
          return;
        }
        if (answer.length !== 5) {
          channel.send("Enter a five-letter word!");
          return;
        }
        var hint = ["🔲", "🔲", "🔲", "🔲", "🔲"];
        for (var i = 0; i < 5; ++i) {
          if (answer[i] === word[i]) {
            hint[i] = "🟩";
            letterCount[answer[i]]--;
          }
        }
        for (var i = 0; i < 5; ++i) {
          if (
            letterCount[answer[i]] !== undefined &&
            letterCount[answer[i]] !== 0 &&
            hint[i] !== "🟩"
          ) {
            hint[i] = "🟨";
            letterCount[answer[i]]--;
          }
        }
        channel.send(`<@${msg.author.id}>\n${hint.join("")}`);
      });
      collector.on("end", (collected) => {
        if (win) {
          channel.send(`You won! The word is **${word}**! You earned 🪙500`);
        } else {
          channel.send(`You lost! The word is **${word}**!`);
        }
      });
    });
};

exports.name = "wordle";
