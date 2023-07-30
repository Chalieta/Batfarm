const fetch = require("node-fetch");
const { addBalance } = require("../helperMethods.js");
const { EmbedBuilder } = require("discord.js");
const categories = {
  science: "Science",
  film_and_tv: "Film and TV",
  music: "Music",
  history: "History",
  geography: "Geography",
  arts_and_literature: "Arts and Literature",
  sport_and_leisure: "Sport and Leisure",
  general_knowledge: "General Knowledge",
  society_and_culture: "Society and Culture",
  food_and_drink: "Food and Drink",
};

exports.run = async (client, msg, args) => {
  const channel = client.channels.cache.get(msg.channelId);
  if (args.length < 1) {
    return msg.reply(
      "Provide the level of difficulty: `easy`, `medium`, or `hard`"
    );
  }
  if (
    args[0].toLowerCase() !== "easy" &&
    args[0].toLowerCase() !== "medium" &&
    args[0].toLowerCase() !== "hard"
  ) {
    return msg.reply(
      "Provide a valid level of difficulty. Example: `bat trivia hard`"
    );
  }
  const level = args[0].toLowerCase();
  const reward = level === "easy" ? 50 : level === "medium" ? 100 : 150;
  fetch(`https://the-trivia-api.com/v2/questions?limit=1&difficulties=${level}`)
    .then((res) => res.json())
    .then((data) => {
      const q = data[0];
      const correct = Math.floor(Math.random() * 4) + 1; // Generate the correct answer from 1-4
      var answers = { 1: "", 2: "", 3: "", 4: "" };
      answers[correct] = q.correctAnswer;
      var counter = 1;
      q.incorrectAnswers.forEach((a) => {
        for (var i = counter; i < 5; ++i) {
          if (answers[i] === "") {
            answers[i] = a;
            counter++;
            break;
          }
        }
      });
      var answersText = "";
      for (const key in answers) {
        answersText += `[${key}] ${answers[key]}\n`;
      }
      //   console.log(q);
      //   console.log(answers);
      const embed = new EmbedBuilder()
        .setColor(0xfca212)
        .setDescription(
          `**${categories[q.category]} (${level})**\n${
            q.question.text
          }\n${answersText}`
        )
        .setAuthor({
          name: `${client.users.cache.get(msg.author.id).username} - Trivia`,
          iconURL: `${client.users.cache
            .get(msg.author.id)
            .avatarURL({ size: 2048, extension: "jpg" })}`,
        })
        .setFooter({ text: "Enter the number of the correct answer!" });
      msg.reply({ embeds: [embed] });
      const msg_filter = (m) => m.author.id === msg.author.id;
      msg.channel
        .awaitMessages({
          filter: msg_filter,
          max: 1,
          time: 10000,
          errors: ["time"],
        })
        .then((ans) => {
          //   console.log(ans.first().content);
          //   console.log(!isNaN(ans.first().content));
          if (!isNaN(ans.first().content)) {
            const userAns = parseInt(ans.first().content);
            if (userAns === correct) {
              addBalance(client.currency, msg.author.id, reward);
              return channel.send(
                `You're correct! You have earned 🪙${reward}!`
              );
            } else {
              return channel.send(
                `You're wrong! The correct answer is **${q.correctAnswer}**.`
              );
            }
          } else {
            return channel.send(
              `You're wrong! The correct answer is **${q.correctAnswer}**.`
            );
          }
        })
        .catch((collected) => {
          return channel.send("Time is up!");
        });
    });
};

exports.name = "trivia";
