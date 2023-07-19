exports.run = async (client, msg, args) => {
  const channel = client.channels.cache.get(msg.channelId);
  const random1 = Math.floor(Math.random() * 100) + 1; // First random number from 1-100
  var random2 = Math.floor(Math.random() * 100) + 1;
  while (random1 === random2) {
    random2 = Math.floor(Math.random() * 100) + 1;
  }
  const rightAnswer = random2 > random1 ? "h" : "l";
  msg.reply(
    `The first number is ${random1}. Guess if the second number is higher or lower than ${random1}.`
  );
  const msg_filter = (m) => m.author.id === msg.author.id;
  msg.channel
    .awaitMessages({
      filter: msg_filter,
      max: 1,
      time: 5000,
      errors: ["time"],
    })
    .then((ans) => {
      var answer = ans.first().content.toLowerCase();
      if (answer.startsWith(rightAnswer)) {
        return channel.send(`You're correct! The second number is ${random2}.`);
      } else {
        return channel.send(`You're wrong! The second number is ${random2}.`);
      }
    })
    .catch((collected) => {
      return channel.send("Time is up!");
    });
};

exports.name = "highlow";
exports.aliases = ["hl"];
